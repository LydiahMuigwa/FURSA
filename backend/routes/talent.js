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
    res.status(500).json({ error: error.message })
  }
})

// POST /api/talents - Create new talent profile
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
      voiceLanguage
    } = req.body

    // Create new talent
    const talent = new Talent({
      name,
      email,
      phone,
      skill,
      category,
      location: {
        full: location,
        // You might want to parse city/county/country from location string
      },
      description,
      voiceLanguage
    })

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'vizu/portfolios' },
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
        imageUrl: result.resource_type === 'image' ? result.secure_url : null,
        videoUrl: result.resource_type === 'video' ? result.secure_url : null
      }))
    }

    await talent.save()
    res.status(201).json(talent)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// PUT /api/talents/:id - Update talent profile
router.put('/:id', upload.array('files', 10), async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id)
    if (!talent) {
      return res.status(404).json({ error: 'Talent not found' })
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        talent[key] = req.body[key]
      }
    })

    await talent.save()
    res.json(talent)
  } catch (error) {
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
    res.status(500).json({ error: error.message })
  }
})

module.exports = router