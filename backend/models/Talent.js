const mongoose = require('mongoose')

const portfolioItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  imageUrl: String,
  videoUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const talentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  skill: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Artisans', 'Creatives', 'Skilled Trades', 'Students']
  },
  location: {
    city: String,
    county: String,
    country: String,
    full: String
  },
  description: {
    type: String,
    required: true
  },
  profileImage: String,
  voiceIntroUrl: String,
  voiceLanguage: {
    type: String,
    default: 'english'
  },
  portfolio: [portfolioItemSchema],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: String,
  socialLinks: {
    whatsapp: String,
    facebook: String,
    instagram: String
  },
  availability: {
    status: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available'
    },
    globalShipping: {
      type: Boolean,
      default: false
    }
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

// Update the updatedAt field before saving
talentSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Create indexes for better search performance
talentSchema.index({ skill: 'text', name: 'text', description: 'text' })
talentSchema.index({ category: 1 })
talentSchema.index({ 'location.country': 1, 'location.city': 1 })
talentSchema.index({ verified: 1 })
talentSchema.index({ 'rating.average': -1 })

module.exports = mongoose.model('Talent', talentSchema)