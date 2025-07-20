const express = require('express')
const Talent = require('../models/Talent')
const router = express.Router()

// GET /api/search - Search talents
router.get('/', async (req, res) => {
  try {
    const { q, category, location, verified, sort = 'rating' } = req.query
    let query = {}

    // Text search
    if (q) {
      query.$text = { $search: q }
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category
    }

    // Location filter
    if (location && location !== 'All') {
      query['location.full'] = { $regex: location, $options: 'i' }
    }

    // Verified filter
    if (verified === 'true') {
      query.verified = true
    }

    // Build sort object
    let sortObj = {}
    switch (sort) {
      case 'rating':
        sortObj = { 'rating.average': -1, verified: -1 }
        break
      case 'reviews':
        sortObj = { 'rating.count': -1 }
        break
      case 'recent':
        sortObj = { createdAt: -1 }
        break
      case 'verified':
        sortObj = { verified: -1, 'rating.average': -1 }
        break
      case 'name':
        sortObj = { name: 1 }
        break
      default:
        sortObj = { 'rating.average': -1 }
    }

    const talents = await Talent.find(query)
      .sort(sortObj)
      .limit(50)
      .exec()

    res.json({ talents, total: talents.length })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/search/filters - Get available filter options
router.get('/filters', async (req, res) => {
  try {
    const categories = await Talent.distinct('category')
    const countries = await Talent.distinct('location.country')
    const cities = await Talent.distinct('location.city')

    res.json({
      categories,
      locations: { countries, cities }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router