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
      search
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

    const providers = await ServiceProvider.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await ServiceProvider.countDocuments(query)

    console.log(`✅ Found ${providers.length} providers (${total} total)`)

    res.json({
      success: true,
      providers,
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

    const story = {
      id: new Date().getTime().toString(),
      title: req.body.title,
      description: req.body.description,
      skills: req.body.skills || [],
      projectPhotos: req.body.projectPhotos || [],
      voiceIntro: req.body.voiceIntro || null,
      createdAt: new Date()
    }

    provider.stories.push(story)
    await provider.save()

    console.log('✅ Story added to provider:', provider._id)

    res.json({ 
      success: true,
      message: 'Story added successfully', 
      story: provider.stories[provider.stories.length - 1] 
    })
  } catch (error) {
    console.error('❌ Failed to add story:', error)
    res.status(400).json({ 
      success: false,
      error: 'Failed to add story' 
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

    const dashboardData = {
      provider: {
        id: provider._id,
        name: provider.name,
        businessName: provider.businessName,
        email: provider.email,
        serviceType: provider.serviceType,
        location: provider.location,
        profilePhoto: provider.profilePhoto
      },
      stats: {
        newRequests: 0,
        activeQuotes: 0,
        rating: 0,
        monthlyJobs: 0
      },
      notifications: [],
      recentActivity: []
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

module.exports = router