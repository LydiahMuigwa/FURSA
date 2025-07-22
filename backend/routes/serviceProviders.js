// backend/routes/serviceProviders.js
const express = require('express')
const ServiceProvider = require('../models/ServiceProvider')
const router = express.Router()

// POST /api/service-providers - Register new service provider
router.post('/', async (req, res) => {
  try {
    const {
      name,
      businessName,
      email,
      phone,
      serviceType,
      location,
      experience,
      description,
      skills = [],
      minPrice,
      maxPrice
    } = req.body

    console.log('📝 Registering new service provider:', { name, email, serviceType, location })

    // Check if provider already exists
    const existingProvider = await ServiceProvider.findOne({ 
      $or: [{ email }, { phone }]
    })
    
    if (existingProvider) {
      return res.status(400).json({ 
        success: false,
        error: 'Email or phone number already registered',
        field: existingProvider.email === email ? 'email' : 'phone'
      })
    }

    // Create new provider
    const provider = new ServiceProvider({
      name: name.trim(),
      businessName: businessName ? businessName.trim() : name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      serviceType,
      location: location.trim(),
      experience,
      description: description.trim(),
      skills: Array.isArray(skills) ? skills.map(s => s.trim()) : [],
      minPrice: minPrice ? parseInt(minPrice) : null,
      maxPrice: maxPrice ? parseInt(maxPrice) : null,
      isActive: true,
      isOnline: true
    })

    await provider.save()

    console.log('✅ Service provider registered successfully:', provider._id)

    res.status(201).json({
      success: true,
      message: 'Service provider registered successfully',
      provider: {
        id: provider._id,
        name: provider.name,
        businessName: provider.businessName,
        email: provider.email,
        serviceType: provider.serviceType,
        location: provider.location,
        isActive: provider.isActive
      }
    })
  } catch (error) {
    console.error('❌ Registration failed:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }))
      
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: errors
      })
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Registration failed'
    })
  }
})

// GET /api/service-providers/:id - Get provider by ID
router.get('/:id', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
    
    if (!provider) {
      return res.status(404).json({ 
        success: false,
        error: 'Service provider not found' 
      })
    }
    
    // Update last seen
    provider.lastSeen = new Date()
    await provider.save()
    
    res.json({
      success: true,
      provider
    })
  } catch (error) {
    console.error('❌ Failed to get provider:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve provider' 
    })
  }
})

// GET /api/service-providers - Search and filter providers
router.get('/', async (req, res) => {
  try {
    const { 
      serviceType, 
      location, 
      page = 1, 
      limit = 20,
      search,
      includeStories  // 🆕 ADD THIS - enables portfolio display
    } = req.query

    let query = { isActive: true }

    // Filter by service type
    if (serviceType && serviceType !== 'all') {
      query.serviceType = serviceType
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }

    // Search across multiple fields
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    }

    console.log('🔍 Searching providers with query:', query)
    if (includeStories) {
      console.log('📖 Including stories/portfolio data in results')
    }

    const providers = await ServiceProvider.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await ServiceProvider.countDocuments(query)

    // 🆕 ENHANCE PROVIDERS WITH PORTFOLIO DATA
    const enhancedProviders = providers.map(provider => {
      const providerObj = provider.toObject()
      
      // Transform stories into professional portfolio items when requested
      if (includeStories === 'true' && providerObj.stories) {
        providerObj.stories = providerObj.stories.map(story => ({
          ...story,
          // Add professional display fields
          displayTitle: professionalizeTitle(story.title),
          projectValue: estimateProjectValue(story),
          formattedDate: formatStoryDate(story.createdAt),
          skillsCount: story.skills ? story.skills.length : 0
        }))
        
        // Add portfolio summary
        providerObj.portfolioSummary = {
          totalProjects: providerObj.stories.length,
          recentProjects: providerObj.stories.slice(-3),
          topSkills: extractTopSkills(providerObj.stories),
          hasVoiceIntros: providerObj.stories.some(s => s.voiceIntro)
        }
      }
      
      return providerObj
    })

    console.log(`✅ Found ${providers.length} providers (${total} total)`)

    res.json({
      success: true,
      providers: enhancedProviders,  // 🆕 RETURN ENHANCED DATA
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('❌ Failed to search providers:', error)
    res.status(500).json({ 
      success: false,
      error: 'Search failed' 
    })
  }
})

// PUT /api/service-providers/:id - Update provider profile
router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body }
    
    // Remove fields that shouldn't be updated directly
    delete updates._id
    delete updates.createdAt
    
    updates.updatedAt = new Date()
    
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
    
    if (!provider) {
      return res.status(404).json({ 
        success: false,
        error: 'Provider not found' 
      })
    }
    
    console.log('✅ Provider profile updated:', provider._id)
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      provider
    })
  } catch (error) {
    console.error('❌ Failed to update provider:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }))
      
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: errors
      })
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Update failed' 
    })
  }
})

// POST /api/service-providers/:id/stories - Add work story
router.post('/:id/stories', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
    if (!provider) {
      return res.status(404).json({ 
        success: false,
        error: 'Service provider not found' 
      })
    }

    // 🆕 ENHANCED STORY DATA STRUCTURE
    const story = {
      id: new Date().getTime().toString(),
      title: req.body.title || 'Professional Project',
      description: req.body.description || req.body.introduction,
      projectType: req.body.projectType,
      
      // Photo organization for portfolio display
      beforePhotos: req.body.beforePhotos || [],
      processPhotos: req.body.processPhotos || [],
      afterPhotos: req.body.afterPhotos || [],
      projectPhotos: req.body.projectPhotos || [],
      
      // Professional details
      skills: req.body.skills || [],
      customerImpact: req.body.customerImpact,
      voiceIntro: req.body.voiceRecording || req.body.voiceIntro,
      
      // Portfolio metadata
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Initialize stories array if it doesn't exist
    if (!provider.stories) {
      provider.stories = []
    }
    
    provider.stories.push(story)
    
    // Update provider portfolio stats
    provider.totalProjects = (provider.totalProjects || 0) + 1
    provider.lastPortfolioUpdate = new Date()
    
    await provider.save()

    console.log('✅ Professional story added to provider:', provider._id)
    console.log('📊 Provider now has', provider.stories.length, 'portfolio items')

    res.json({ 
      success: true,
      message: 'Professional story published successfully', 
      story: story,
      portfolioStats: {
        totalStories: provider.stories.length,
        hasPortfolio: true
      }
    })
  } catch (error) {
    console.error('❌ Failed to add story:', error)
    res.status(400).json({ 
      success: false,
      error: 'Failed to publish story' 
    })
  }
})

// GET /api/service-providers/:id/dashboard - Get provider dashboard data
router.get('/:id/dashboard', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
    if (!provider) {
      return res.status(404).json({ 
        success: false,
        error: 'Provider not found' 
      })
    }

    // 🆕 ENHANCED DASHBOARD DATA WITH PORTFOLIO STATS
    const dashboardData = {
      provider: {
        id: provider._id,
        name: provider.name,
        businessName: provider.businessName,
        email: provider.email,
        serviceType: provider.serviceType,
        location: provider.location,
        profilePhoto: provider.profilePhoto,
        
        // Portfolio information
        totalStories: provider.stories ? provider.stories.length : 0,
        hasPortfolio: provider.stories && provider.stories.length > 0,
        lastPortfolioUpdate: provider.lastPortfolioUpdate
      },
      stats: {
        newRequests: 0,
        activeQuotes: 0,
        rating: provider.rating?.average || 0,
        monthlyJobs: 0,
        
        // Portfolio stats
        portfolioViews: 0, // Could be tracked later
        storiesPublished: provider.stories ? provider.stories.length : 0
      },
      notifications: [],
      recentActivity: [],
      
      // Recent portfolio items
      recentStories: provider.stories ? provider.stories.slice(-3).reverse() : []
    }
    
    res.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    console.error('❌ Failed to get dashboard data:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to load dashboard' 
    })
  }
})

// 🆕 HELPER FUNCTIONS FOR PROFESSIONAL PORTFOLIO DISPLAY

// Transform casual titles into professional ones
function professionalizeTitle(title) {
  if (!title || title.length < 10) {
    return 'Professional Service Project'
  }
  
  return title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .replace(/\bfix\b/gi, 'Repair')
    .replace(/\bhelp\b/gi, 'Professional Service')
    .replace(/\binstall\b/gi, 'Installation')
}

// Estimate project value based on type and complexity
function estimateProjectValue(story) {
  const baseValues = {
    'emergency': 8000,
    'installation': 15000,
    'upgrade': 25000,
    'maintenance': 5000,
    'consultation': 3000,
    'custom': 20000
  }
  
  const baseValue = baseValues[story.projectType] || 10000
  const skillsMultiplier = 1 + ((story.skills?.length || 0) * 0.15)
  const photosBonus = story.projectPhotos?.length > 0 ? 1.1 : 1.0
  
  return Math.round(baseValue * skillsMultiplier * photosBonus)
}

// Format story date for display
function formatStoryDate(dateString) {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 7) return 'This week'
    if (diffDays < 30) return 'This month'
    if (diffDays < 90) return 'Recent project'
    return 'Previous work'
  } catch {
    return 'Recent project'
  }
}

// Extract most common skills across stories
function extractTopSkills(stories) {
  if (!stories || !stories.length) return []
  
  const skillCounts = {}
  stories.forEach(story => {
    if (story.skills) {
      story.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1
      })
    }
  })
  
  return Object.entries(skillCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([skill]) => skill)
}

module.exports = router