const express = require('express')
const ServiceProvider = require('../models/ServiceProvider')
const router = express.Router()

// POST /api/service-providers - Register new service provider
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      serviceType,
      location,
      experience,
      description
    } = req.body

    // Check if provider already exists
    const existingProvider = await ServiceProvider.findOne({ email })
    if (existingProvider) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Create new provider
    const provider = new ServiceProvider({
      name,
      email,
      phone,
      serviceType,
      location,
      experience,
      description
    })

    await provider.save()

    res.status(201).json({
      message: 'Service provider registered successfully',
      provider: {
        id: provider._id,
        name: provider.name,
        email: provider.email,
        serviceType: provider.serviceType,
        location: provider.location
      }
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET /api/service-providers/:id - Get provider by ID
router.get('/:id', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
    if (!provider) {
      return res.status(404).json({ error: 'Service provider not found' })
    }
    res.json(provider)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/service-providers - Get all providers with filtering
router.get('/', async (req, res) => {
  try {
    const { serviceType, location, page = 1, limit = 20 } = req.query
    let query = { isActive: true }

    if (serviceType) {
      query.serviceType = serviceType
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }

    const providers = await ServiceProvider.find(query)
      .sort({ 'rating.average': -1, completedJobs: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    res.json(providers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/service-providers/:id/stories - Add work story
router.post('/:id/stories', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
    if (!provider) {
      return res.status(404).json({ error: 'Service provider not found' })
    }

    provider.stories.push(req.body)
    await provider.save()

    res.json({ message: 'Story added successfully', story: provider.stories[provider.stories.length - 1] })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router