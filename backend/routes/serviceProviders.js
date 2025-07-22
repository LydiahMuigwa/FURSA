// backend/models/ServiceProvider.js - COMPLETE MODEL
const mongoose = require('mongoose')

// Story schema for provider work stories
const storySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  projectPhotos: [{
    url: String,
    caption: String,
    order: Number
  }],
  voiceIntro: {
    url: String,
    duration: Number,
    language: {
      type: String,
      default: 'english'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Rating schema
const ratingSchema = new mongoose.Schema({
  average: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  count: {
    type: Number,
    default: 0
  },
  breakdown: {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 }
  }
})

// Stats schema
const statsSchema = new mongoose.Schema({
  completedJobs: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    default: '2 hours'
  },
  completionRate: {
    type: Number,
    default: 100
  },
  totalEarnings: {
    type: Number,
    default: 0
  }
})

// Availability schema
const availabilitySchema = new mongoose.Schema({
  schedule: {
    type: Map,
    of: {
      available: Boolean,
      startTime: String,
      endTime: String,
      booked: [{
        startTime: String,
        endTime: String,
        customerId: String,
        status: {
          type: String,
          enum: ['confirmed', 'pending', 'cancelled'],
          default: 'pending'
        }
      }]
    }
  },
  timezone: {
    type: String,
    default: 'Africa/Nairobi'
  },
  generalAvailability: {
    type: String,
    enum: ['flexible', 'business', 'weekends', 'emergency'],
    default: 'flexible'
  }
})

// Main ServiceProvider schema
const serviceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  businessName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: [
      'painter', 'plumber', 'electrician', 'carpenter', 
      'cleaner', 'mechanic', 'gardener', 'security', 
      'catering', 'photography', 'videography', 'other'
    ]
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    enum: ['0-1', '1-3', '3-5', '5-10', '10+']
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  skills: [{
    type: String,
    trim: true
  }],
  minPrice: {
    type: Number,
    min: 0
  },
  maxPrice: {
    type: Number,
    min: 0
  },
  profilePhoto: {
    type: String
  },
  portfolio: [{
    title: String,
    description: String,
    imageUrl: String,
    order: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  stories: [storySchema],
  rating: ratingSchema,
  stats: statsSchema,
  availability: availabilitySchema,
  socialLinks: {
    whatsapp: String,
    facebook: String,
    instagram: String,
    website: String
  },
  verificationStatus: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: String,
    verifiedAt: Date,
    documents: [{
      type: String,
      url: String,
      verifiedAt: Date
    }]
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    privacy: {
      showPhoneNumber: { type: Boolean, default: true },
      showExactLocation: { type: Boolean, default: false },
      allowDirectContact: { type: Boolean, default: true }
    },
    workPreferences: {
      minimumJobValue: Number,
      maximumTravelDistance: Number,
      preferredPaymentMethods: [String]
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Indexes for better query performance
serviceProviderSchema.index({ serviceType: 1 })
serviceProviderSchema.index({ location: 'text' })
serviceProviderSchema.index({ 'rating.average': -1 })
serviceProviderSchema.index({ isActive: 1 })
serviceProviderSchema.index({ createdAt: -1 })
serviceProviderSchema.index({ email: 1 }, { unique: true })
serviceProviderSchema.index({ phone: 1 })

// Text search index
serviceProviderSchema.index({
  name: 'text',
  businessName: 'text',
  description: 'text',
  skills: 'text'
})

// Update the updatedAt field before saving
serviceProviderSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Virtual for profile completeness
serviceProviderSchema.virtual('profileCompleteness').get(function() {
  const requiredFields = ['name', 'email', 'phone', 'location', 'serviceType', 'experience', 'description']
  const completedFields = requiredFields.filter(field => this[field] && this[field] !== '').length
  const skillsBonus = this.skills && this.skills.length > 0 ? 1 : 0
  const photoBonus = this.profilePhoto ? 1 : 0
  
  return Math.round(((completedFields + skillsBonus + photoBonus) / (requiredFields.length + 2)) * 100)
})

// Method to calculate average rating
serviceProviderSchema.methods.calculateAverageRating = function() {
  const breakdown = this.rating.breakdown
  const total = breakdown[5] + breakdown[4] + breakdown[3] + breakdown[2] + breakdown[1]
  
  if (total === 0) return 0
  
  const weightedSum = (breakdown[5] * 5) + (breakdown[4] * 4) + (breakdown[3] * 3) + (breakdown[2] * 2) + (breakdown[1] * 1)
  return (weightedSum / total).toFixed(1)
}

// Method to add a new rating
serviceProviderSchema.methods.addRating = function(rating) {
  this.rating.breakdown[rating]++
  this.rating.count++
  this.rating.average = this.calculateAverageRating()
}

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema)

---

// backend/routes/serviceProviders.js - COMPLETE ROUTES
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
        isActive: provider.isActive,
        profileCompleteness: provider.profileCompleteness
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
      .select('-verificationStatus.documents -preferences') // Hide sensitive data
    
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
      minRating = 0,
      maxPrice,
      minPrice,
      skills,
      verified,
      page = 1, 
      limit = 20,
      search,
      sortBy = 'rating'
    } = req.query

    let query = { isActive: true }
    let sort = {}

    // Filter by service type
    if (serviceType && serviceType !== 'all') {
      query.serviceType = serviceType
    }

    // Filter by location (fuzzy search)
    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }

    // Filter by rating
    if (minRating > 0) {
      query['rating.average'] = { $gte: parseFloat(minRating) }
    }

    // Filter by price range
    if (maxPrice) {
      query.minPrice = { $lte: parseInt(maxPrice) }
    }
    if (minPrice) {
      query.minPrice = { $gte: parseInt(minPrice) }
    }

    // Filter by skills
    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : [skills]
      query.skills = { $in: skillArray.map(skill => new RegExp(skill, 'i')) }
    }

    // Filter by verification status
    if (verified === 'true') {
      query['verificationStatus.isVerified'] = true
    }

    // Search across multiple fields
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
        { location: { $regex: search, $options: 'i' } }
      ]
    }

    // Sorting
    switch (sortBy) {
      case 'rating':
        sort = { 'rating.average': -1, 'rating.count': -1 }
        break
      case 'price_low':
        sort = { minPrice: 1 }
        break
      case 'price_high':
        sort = { minPrice: -1 }
        break
      case 'experience':
        sort = { 'stats.completedJobs': -1 }
        break
      case 'newest':
        sort = { createdAt: -1 }
        break
      case 'online':
        sort = { isOnline: -1, lastSeen: -1 }
        break
      default:
        sort = { 'rating.average': -1, 'stats.completedJobs': -1 }
    }

    console.log('🔍 Searching providers with query:', query)

    const providers = await ServiceProvider.find(query)
      .select('-verificationStatus.documents -preferences') // Hide sensitive data
      .sort(sort)
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
      },
      filters: {
        serviceType,
        location,
        minRating,
        maxPrice,
        search,
        sortBy
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
    delete updates.rating
    delete updates.stats
    delete updates.createdAt
    delete updates.joinedDate
    
    // Ensure arrays are properly formatted
    if (updates.skills) {
      updates.skills = Array.isArray(updates.skills) 
        ? updates.skills.map(s => s.trim()) 
        : [updates.skills.trim()]
    }
    
    updates.updatedAt = new Date()
    
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-verificationStatus.documents -preferences')
    
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
        profilePhoto: provider.profilePhoto,
        profileCompleteness: provider.profileCompleteness,
        isVerified: provider.verificationStatus.isVerified
      },
      stats: {
        newRequests: 0, // TODO: Implement quotes system
        activeQuotes: 0, // TODO: Implement quotes system
        rating: provider.rating.average || 0,
        ratingCount: provider.rating.count || 0,
        monthlyJobs: provider.stats.completedJobs || 0,
        totalEarnings: provider.stats.totalEarnings || 0,
        responseTime: provider.stats.responseTime,
        completionRate: provider.stats.completionRate
      },
      notifications: [],
      recentActivity: []
    }
    
    // Add notifications based on profile state
    if (provider.profileCompleteness < 80) {
      dashboardData.notifications.push({
        id: 'profile_incomplete',
        type: 'warning',
        message: 'Complete your profile to appear higher in search results',
        action: 'Complete Profile',
        link: '/app/provider-dashboard/profile'
      })
    }
    
    if (provider.stories.length === 0) {
      dashboardData.notifications.push({
        id: 'no_stories',
        type: 'info',
        message: 'Share your work story to stand out to customers',
        action: 'Tell Your Story',
        link: '/app/provider-dashboard/story-builder'
      })
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

// PUT /api/service-providers/:id/preferences - Update preferences
router.put('/:id/preferences', async (req, res) => {
  try {
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      { 
        preferences: req.body,
        updatedAt: new Date()
      },
      { new: true }
    ).select('preferences')
    
    if (!provider) {
      return res.status(404).json({ 
        success: false,
        error: 'Provider not found' 
      })
    }
    
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: provider.preferences
    })
  } catch (error) {
    console.error('❌ Failed to update preferences:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to update preferences' 
    })
  }
})

// PUT /api/service-providers/:id/online-status - Update online status
router.put('/:id/online-status', async (req, res) => {
  try {
    const { isOnline } = req.body
    
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      { 
        isOnline: Boolean(isOnline),
        lastSeen: new Date()
      },
      { new: true }
    ).select('isOnline lastSeen')
    
    if (!provider) {
      return res.status(404).json({ 
        success: false,
        error: 'Provider not found' 
      })
    }
    
    res.json({
      success: true,
      message: 'Online status updated',
      isOnline: provider.isOnline,
      lastSeen: provider.lastSeen
    })
  } catch (error) {
    console.error('❌ Failed to update online status:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to update status' 
    })
  }
})

// DELETE /api/service-providers/:id - Deactivate provider
router.delete('/:id', async (req, res) => {
  try {
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      { 
        isActive: false,
        isOnline: false,
        updatedAt: new Date()
      },
      { new: true }
    ).select('isActive')
    
    if (!provider) {
      return res.status(404).json({ 
        success: false,
        error: 'Provider not found' 
      })
    }
    
    console.log('✅ Provider deactivated:', req.params.id)
    
    res.json({
      success: true,
      message: 'Account deactivated successfully'
    })
  } catch (error) {
    console.error('❌ Failed to deactivate provider:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to deactivate account' 
    })
  }
})

// GET /api/service-providers/search/suggestions - Search suggestions
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query
    
    if (!q || q.length < 2) {
      return res.json({ 
        success: true,
        suggestions: [] 
      })
    }

    const [serviceTypes, locations, skills] = await Promise.all([
      ServiceProvider.distinct('serviceType', { 
        isActive: true,
        serviceType: { $regex: q, $options: 'i' }
      }),
      ServiceProvider.distinct('location', { 
        isActive: true,
        location: { $regex: q, $options: 'i' }
      }).limit(10),
      ServiceProvider.distinct('skills', { 
        isActive: true,
        skills: { $in: [new RegExp(q, 'i')] }
      }).limit(10)
    ])

    res.json({
      success: true,
      suggestions: {
        serviceTypes,
        locations,
        skills: skills.flat()
      }
    })
  } catch (error) {
    console.error('❌ Failed to get suggestions:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to get suggestions' 
    })
  }
})

module.exports = router