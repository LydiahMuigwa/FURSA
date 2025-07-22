// backend/models/ServiceProvider.js - ALIGNED WITH ROUTER
const mongoose = require('mongoose')

const serviceProviderSchema = new mongoose.Schema({
  // Basic Information - ALIGNED
  name: {
    type: String,
    required: true,
    trim: true
  },
  businessName: {  // ✅ ADDED - Router expects this
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true  // ✅ ADDED
  },
  phone: {
    type: String,
    required: true,
    trim: true  // ✅ ADDED
  },
  
  // Service Information - UPDATED
  serviceType: {
    type: String,
    required: true,
    enum: [
      'painter', 'plumber', 'electrician', 'carpenter', 
      'cleaner', 'mechanic', 'gardener', 'security', 
      'catering', 'photography', 'videography', 'other'
    ]  // ✅ EXPANDED - Router supports more types
  },
  location: {
    type: String,
    required: true,
    trim: true  // ✅ ADDED
  },
  experience: {
    type: String,
    required: true,
    enum: ['0-1', '1-3', '3-5', '5-10', '10+']  // ✅ UPDATED - Router uses these values
  },
  description: {
    type: String,
    required: true,  // ✅ CHANGED - Router expects required
    maxlength: 1000,  // ✅ ADDED - Prevent overly long descriptions
    trim: true  // ✅ ADDED
  },

  // ✅ ADDED - Router expects these fields
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

  // Business Information - ENHANCED
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },  // ✅ ADDED constraints
    count: { type: Number, default: 0 },
    breakdown: {  // ✅ ADDED - Router uses this for detailed ratings
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },

  // ✅ RESTRUCTURED - Router expects stats object
  stats: {
    completedJobs: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: String,
      default: '2 hours'  // ✅ UPDATED - More realistic default
    },
    completionRate: {
      type: Number,
      default: 100
    },
    totalEarnings: {  // ✅ ADDED - Router uses this
      type: Number,
      default: 0
    }
  },

  // ✅ ADDED - Router expects availability object
  availability: {
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
  },

  // ✅ ADDED - Router expects these social links
  socialLinks: {
    whatsapp: String,
    facebook: String,
    instagram: String,
    website: String
  },

  // Status - ENHANCED
  verificationStatus: {  // ✅ RESTRUCTURED - Router expects object
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
  isActive: {
    type: Boolean,
    default: true
  },
  isOnline: {  // ✅ ADDED - Router uses this
    type: Boolean,
    default: false
  },
  lastSeen: {  // ✅ ADDED - Router updates this
    type: Date,
    default: Date.now
  },

  // ✅ ADDED - Router expects preferences
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
  
  // Work Stories - ENHANCED TO MATCH ROUTER
  stories: [{
    id: {  // ✅ ADDED - Router creates unique ID
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true  // ✅ MADE REQUIRED
    },
    description: {  // ✅ RENAMED from 'introduction'
      type: String,
      required: true  // ✅ MADE REQUIRED
    },
    skills: [String],  // ✅ KEPT - Router uses this
    projectPhotos: [{  // ✅ RESTRUCTURED - Router expects this format
      url: String,
      caption: String,
      order: Number
    }],
    voiceIntro: {  // ✅ ADDED - Router supports voice introductions
      url: String,
      duration: Number,
      language: {
        type: String,
        default: 'english'
      }
    },
    // ✅ REMOVED - Router doesn't use these fields:
    // projectType, beforePhotos, processPhotos, afterPhotos, customerImpact
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],

  // ✅ ADDED - Additional fields router expects
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

  // Timestamps - ENHANCED
  joinedDate: {  // ✅ ADDED - Router uses this
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
}, {
  timestamps: true  // ✅ KEPT - Adds automatic createdAt/updatedAt
})

// Enhanced Indexes - ALIGNED WITH ROUTER QUERIES
serviceProviderSchema.index({ serviceType: 1 })
serviceProviderSchema.index({ location: 'text' })  // ✅ CHANGED to text index
serviceProviderSchema.index({ 'rating.average': -1 })
serviceProviderSchema.index({ isActive: 1 })
serviceProviderSchema.index({ createdAt: -1 })
serviceProviderSchema.index({ email: 1 }, { unique: true })
serviceProviderSchema.index({ phone: 1 })

// ✅ ENHANCED - Text search index for router search functionality
serviceProviderSchema.index({
  name: 'text',
  businessName: 'text',
  description: 'text',
  skills: 'text'
})

// ✅ ADDED - Update the updatedAt field before saving
serviceProviderSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// ✅ ADDED - Virtual for profile completeness (router uses this)
serviceProviderSchema.virtual('profileCompleteness').get(function() {
  const requiredFields = ['name', 'email', 'phone', 'location', 'serviceType', 'experience', 'description']
  const completedFields = requiredFields.filter(field => this[field] && this[field] !== '').length
  const skillsBonus = this.skills && this.skills.length > 0 ? 1 : 0
  const photoBonus = this.profilePhoto ? 1 : 0
  
  return Math.round(((completedFields + skillsBonus + photoBonus) / (requiredFields.length + 2)) * 100)
})

// ✅ ADDED - Method to calculate average rating (router may use this)
serviceProviderSchema.methods.calculateAverageRating = function() {
  const breakdown = this.rating.breakdown
  const total = breakdown[5] + breakdown[4] + breakdown[3] + breakdown[2] + breakdown[1]
  
  if (total === 0) return 0
  
  const weightedSum = (breakdown[5] * 5) + (breakdown[4] * 4) + (breakdown[3] * 3) + (breakdown[2] * 2) + (breakdown[1] * 1)
  return (weightedSum / total).toFixed(1)
}

// ✅ ADDED - Method to add a new rating
serviceProviderSchema.methods.addRating = function(rating) {
  this.rating.breakdown[rating]++
  this.rating.count++
  this.rating.average = this.calculateAverageRating()
}

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema)



// MIGRATION GUIDE - How to Update Existing Data
// If you have existing providers in the database, run this migration:

/*
// backend/scripts/migrateServiceProviders.js
const mongoose = require('mongoose');
require('dotenv').config();

async function migrateProviders() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const ServiceProvider = require('../models/ServiceProvider');
  
  // Update all existing providers to new structure
  await ServiceProvider.updateMany({}, {
    $set: {
      'stats.completedJobs': { $ifNull: ['$completedJobs', 0] },
      'stats.responseTime': { $ifNull: ['$responseTime', '2 hours'] },
      'stats.completionRate': 100,
      'stats.totalEarnings': 0,
      'verificationStatus.isVerified': { $ifNull: ['$isVerified', false] },
      'rating.breakdown': { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      'isOnline': false,
      'lastSeen': new Date(),
      'joinedDate': { $ifNull: ['$createdAt', new Date()] }
    },
    $unset: {
      'completedJobs': '',
      'responseTime': '',
      'isVerified': ''
    }
  });
  
  console.log('✅ Migration completed');
  process.exit(0);
}

migrateProviders().catch(console.error);
*/