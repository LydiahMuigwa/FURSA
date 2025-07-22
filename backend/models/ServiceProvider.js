const mongoose = require('mongoose')

const serviceProviderSchema = new mongoose.Schema({
  // Basic Information
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
  
  // Service Information
  serviceType: {
    type: String,
    required: true,
    enum: ['electrician', 'plumber', 'carpenter', 'cleaner', 'painter', 'mechanic','gardener', 'other']
  },
  location: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true,
    enum: ['1-2', '3-5', '6-10', '10+']
  },
  description: {
    type: String,
    default: ''
  },

  // Business Information
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    default: '24 hours'
  },
  
  // Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Work Stories
  stories: [{
    title: String,
    projectType: String,
    introduction: String,
    beforePhotos: [String],
    processPhotos: [String],
    afterPhotos: [String],
    skills: [String],
    customerImpact: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
})

// Index for search
serviceProviderSchema.index({ serviceType: 1, location: 1 })
serviceProviderSchema.index({ name: 'text', description: 'text' })

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema)