// backend/routes/auth.js - FIXED: Complete authentication routes
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Import your existing models
const ServiceProvider = require('../models/ServiceProvider')
const Talent = require('../models/Talent')

// Generate JWT token
const generateToken = (user, userType) => {
  return jwt.sign(
    { 
      id: user._id || user.id, 
      email: user.email,
      userType: userType,
      name: user.name || user.businessName
    },
    process.env.JWT_SECRET || 'fursa-secret-key-change-in-production',
    { expiresIn: '24h' }
  )
}

// Sanitize user data for response
const sanitizeUser = (user) => {
  const sanitized = { ...user.toObject ? user.toObject() : user }
  delete sanitized.password
  delete sanitized.__v
  return sanitized
}

// POST /api/auth/login - Login with email and password
router.post('/login', async (req, res) => {
  try {
    console.log('🔑 Auth login attempt:', { email: req.body.email, userType: req.body.userType })
    
    const { email, password, userType } = req.body

    // Validate input
    if (!email || !password || !userType) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and user type are required'
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    let user = null
    
    // Find user based on type
    if (userType === 'provider') {
      user = await ServiceProvider.findOne({
        email: normalizedEmail,
        isActive: true
      })
    } else if (userType === 'talent') {
      user = await Talent.findOne({
        email: normalizedEmail
      })
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid user type'
      })
    }

    if (!user) {
      console.log('❌ User not found:', { email: normalizedEmail, userType })
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Check password
    if (!user.password) {
      console.log('❌ User has no password set:', { email: normalizedEmail, userType })
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.log('❌ Invalid password:', { email: normalizedEmail, userType })
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Additional checks for providers
    if (userType === 'provider' && user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        error: 'Your account has been suspended. Please contact support.'
      })
    }

    // Generate token
    const token = generateToken(user, userType)

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    console.log('✅ Login successful:', { userId: user._id, userType })

    res.json({
      success: true,
      user: sanitizeUser(user),
      userType,
      token,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('💥 Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    })
  }
})

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Auth registration attempt:', { email: req.body.email, userType: req.body.userType })

    const { email, password, userType, name, ...otherData } = req.body

    // Validate input
    if (!email || !password || !userType || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, user type, and name are required'
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    let existingUser = null
    let newUser = null

    if (userType === 'provider') {
      // Check if provider already exists
      existingUser = await ServiceProvider.findOne({
        $or: [
          { email: normalizedEmail },
          { phone: otherData.phone }
        ]
      })

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email or phone number already exists.'
        })
      }

      // Create new provider
      newUser = new ServiceProvider({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: otherData.phone,
        serviceType: otherData.serviceType,
        location: otherData.location,
        description: otherData.description,
        experience: otherData.experience,
        availability: otherData.availability || 'flexible',
        isActive: true,
        status: 'active',
        createdAt: new Date(),
        lastLogin: new Date()
      })

    } else if (userType === 'talent') {
      // Check if talent already exists
      existingUser = await Talent.findOne({
        $or: [
          { email: normalizedEmail },
          { phone: otherData.phone }
        ]
      })

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email or phone number already exists.'
        })
      }

      // Create new talent
      newUser = new Talent({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: otherData.phone,
        skills: otherData.skill ? [otherData.skill] : [],
        category: otherData.category,
        location: otherData.location,
        description: otherData.description,
        createdAt: new Date(),
        lastLogin: new Date()
      })
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid user type'
      })
    }

    // Save user
    await newUser.save()

    // Generate token
    const token = generateToken(newUser, userType)

    console.log('🎉 Registration successful:', { userId: newUser._id, userType })

    res.status(201).json({
      success: true,
      user: sanitizeUser(newUser),
      userType,
      token,
      message: 'Registration successful'
    })

  } catch (error) {
    console.error('💥 Registration error:', error)
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email or phone number already exists.'
      })
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    })
  }
})

// GET /api/auth/me - Get current user info
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fursa-secret-key-change-in-production')
    
    let user = null
    if (decoded.userType === 'provider') {
      user = await ServiceProvider.findById(decoded.id)
    } else if (decoded.userType === 'talent') {
      user = await Talent.findById(decoded.id)
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    res.json({
      success: true,
      user: sanitizeUser(user),
      userType: decoded.userType
    })

  } catch (error) {
    console.error('💥 Get user error:', error)
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    })
  }
})

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fursa-secret-key-change-in-production')
      console.log('👋 User logged out:', { userId: decoded.id, userType: decoded.userType })
    } catch (error) {
      // Token might be invalid, but that's okay for logout
    }
  }

  res.json({
    success: true,
    message: 'Logged out successfully'
  })
})

module.exports = router