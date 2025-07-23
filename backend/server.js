// backend/server.js - COMPLETE FIX
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

// Security middleware
app.use(helmet())
app.use(cors())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
})
app.use(limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes - FIXED: Add missing auth routes
const authRoutes = require('./routes/auth')
const serviceProviderRoutes = require('./routes/serviceProviders')
const talentRoutes = require('./routes/talent')

app.use('/api/auth', authRoutes)
app.use('/api/service-providers', serviceProviderRoutes)
app.use('/api/talents', talentRoutes)

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 FURSA server running on port ${PORT}`)
})