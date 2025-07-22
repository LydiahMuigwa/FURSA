const express = require('express')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const Talent = require('../models/Talent')
const router = express.Router()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

// GET /api/talents - Get all talents with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, location, search, page = 1, limit = 20 } = req.query
    let query = {}

    // Apply filters
    if (category && category !== 'All') {
      query.category = category
    }

    if (location) {
      query['location.full'] = { $regex: location, $options: 'i' }
    }

    if (search) {
      query.$text = { $search: search }
    }

    const talents = await Talent.find(query)
      .sort({ 'rating.average': -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const total = await Talent.countDocuments(query)

    res.json({
      talents,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    console.error('Get talents error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/talents/:id - Get single talent by ID
router.get('/:id', async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id)
    if (!talent) {
      return res.status(404).json({ error: 'Talent not found' })
    }
    res.json(talent)
  } catch (error) {
    console.error('Get talent by ID error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/talents - Create new talent profile (ENHANCED)
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      skill,
      category,
      location,
      description,
      voiceLanguage = 'english'
    } = req.body

    console.log('Creating talent with data:', { name, email, phone, skill, category })

    // ENHANCED: Validate required fields
    if (!name || !email || !phone || !skill || !category || !description) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please provide name, email, phone, skill, category, and description.' 
      })
    }

    // ENHANCED: Check if talent already exists
    const existingTalent = await Talent.findOne({ email: email.toLowerCase() })
    if (existingTalent) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // ENHANCED: Parse location better
    let locationData = location
    if (typeof location === 'string') {
      const parts = location.split(',').map(part => part.trim())
      locationData = {
        full: location,
        city: parts[0] || '',
        county: parts[1] || '',
        country: parts[2] || 'Kenya'
      }
    }

    // Create new talent
    const talent = new Talent({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      skill: skill.trim(),
      category,
      location: locationData,
      description: description.trim(),
      voiceLanguage,
      verified: false,
      rating: { average: 0, count: 0 },
      availability: {
        status: 'available',
        globalShipping: false
      }
    })

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { resource_type: 'auto', folder: 'fursa/portfolios' },
              (error, result) => {
                if (error) reject(error)
                else resolve(result)
              }
            ).end(file.buffer)
          })
        })

        const uploadResults = await Promise.all(uploadPromises)

        // Add uploaded files to portfolio
        talent.portfolio = uploadResults.map((result, index) => ({
          title: `Work ${index + 1}`,
          description: `Portfolio item ${index + 1}`,
          imageUrl: result.resource_type === 'image' ? result.secure_url : null,
          videoUrl: result.resource_type === 'video' ? result.secure_url : null
        }))
      } catch (uploadError) {
        console.error('File upload error:', uploadError)
        // Continue without files rather than failing completely
      }
    }

    const savedTalent = await talent.save()
    console.log('Talent created successfully:', savedTalent._id)

    res.status(201).json({
      message: 'Talent registered successfully',
      talent: savedTalent
    })

  } catch (error) {
    console.error('Create talent error:', error)
    
    // ENHANCED: Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      })
    }

    // ENHANCED: Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    res.status(500).json({ error: 'Internal server error. Please try again.' })
  }
})

// PUT /api/talents/:id - Update talent profile
router.put('/:id', upload.array('files', 10), async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id)
    if (!talent) {
      return res.status(404).json({ error: 'Talent not found' })
    }

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { resource_type: 'auto', folder: 'fursa/portfolios' },
              (error, result) => {
                if (error) reject(error)
                else resolve(result)
              }
            ).end(file.buffer)
          })
        })

        const uploadResults = await Promise.all(uploadPromises)

        // Add new files to existing portfolio
        const newPortfolioItems = uploadResults.map((result, index) => ({
          title: `Work ${talent.portfolio.length + index + 1}`,
          description: `Portfolio item ${talent.portfolio.length + index + 1}`,
          imageUrl: result.resource_type === 'image' ? result.secure_url : null,
          videoUrl: result.resource_type === 'video' ? result.secure_url : null
        }))

        talent.portfolio.push(...newPortfolioItems)
      } catch (uploadError) {
        console.error('File upload error:', uploadError)
      }
    }

    // Update other fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined && key !== 'files') {
        if (key === 'location' && typeof req.body[key] === 'string') {
          // Parse location string
          const parts = req.body[key].split(',').map(part => part.trim())
          talent.location = {
            full: req.body[key],
            city: parts[0] || '',
            county: parts[1] || '',
            country: parts[2] || 'Kenya'
          }
        } else {
          talent[key] = req.body[key]
        }
      }
    })

    talent.updatedAt = new Date()
    await talent.save()
    
    res.json({
      message: 'Talent updated successfully',
      talent
    })
  } catch (error) {
    console.error('Update talent error:', error)
    res.status(400).json({ error: error.message })
  }
})

// DELETE /api/talents/:id - Delete talent profile
router.delete('/:id', async (req, res) => {
  try {
    const talent = await Talent.findByIdAndDelete(req.params.id)
    if (!talent) {
      return res.status(404).json({ error: 'Talent not found' })
    }
    res.json({ message: 'Talent deleted successfully' })
  } catch (error) {
    console.error('Delete talent error:', error)
    res.status(500).json({ error: error.message })
  }
})

// BONUS: Add portfolio item endpoint
router.post('/:id/portfolio', upload.array('files', 5), async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id)
    if (!talent) {
      return res.status(404).json({ error: 'Talent not found' })
    }

    const { title, description } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Portfolio title is required' })
    }

    let portfolioItem = {
      title: title.trim(),
      description: description?.trim() || '',
      createdAt: new Date()
    }

    // Handle file upload
    if (req.files && req.files.length > 0) {
      try {
        const file = req.files[0] // Take first file
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'fursa/portfolios' },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          ).end(file.buffer)
        })

        portfolioItem.imageUrl = uploadResult.resource_type === 'image' ? uploadResult.secure_url : null
        portfolioItem.videoUrl = uploadResult.resource_type === 'video' ? uploadResult.secure_url : null
      } catch (uploadError) {
        console.error('Portfolio upload error:', uploadError)
        return res.status(400).json({ error: 'Failed to upload portfolio file' })
      }
    }

    talent.portfolio.push(portfolioItem)
    await talent.save()

    res.json({ 
      message: 'Portfolio item added successfully', 
      portfolioItem: talent.portfolio[talent.portfolio.length - 1] 
    })
  } catch (error) {
    console.error('Add portfolio error:', error)
    res.status(400).json({ error: error.message })
  }
})

module.exports = router