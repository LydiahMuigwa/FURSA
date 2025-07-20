const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample data
const sampleTalents = [
  {
    name: 'Lydian Kamau',
    email: 'lydian.kamau@example.com',
    phone: '+254712345678',
    skill: 'Beadwork Artist',
    category: 'Artisans',
    location: {
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      full: 'Nairobi, Kenya'
    },
    description: 'Handcrafted African beaded jewelry using traditional techniques passed down through generations. Specializing in custom designs for special occasions.',
    verified: true,
    rating: { average: 4.8, count: 17 },
    portfolio: [
      { title: 'Traditional Necklace', description: 'Colorful beaded necklace' },
      { title: 'Maasai Bracelet', description: 'Traditional Maasai beadwork' }
    ]
  },
  {
    name: 'John Ochieng',
    email: 'john.ochieng@example.com',
    phone: '+254723456789',
    skill: 'Wood Carver',
    category: 'Artisans',
    location: {
      city: 'Kisumu',
      county: 'Kisumu',
      country: 'Kenya',
      full: 'Kisumu, Kenya'
    },
    description: 'Traditional wood carving with modern artistic touches. Creating functional and decorative pieces.',
    verified: true,
    rating: { average: 4.5, count: 12 },
    portfolio: [
      { title: 'Wooden Sculpture', description: 'Hand-carved animal sculpture' },
      { title: 'Decorative Bowl', description: 'Traditional wooden bowl' }
    ]
  },
  {
    name: 'Sarah Nyong',
    email: 'sarah.nyong@example.com',
    phone: '+234801234567',
    skill: 'Fashion Designer',
    category: 'Creatives',
    location: {
      city: 'Lagos',
      county: 'Lagos',
      country: 'Nigeria',
      full: 'Lagos, Nigeria'
    },
    description: 'Contemporary African fashion with traditional influences. Sustainable fashion practices.',
    verified: true,
    rating: { average: 4.6, count: 23 },
    portfolio: [
      { title: 'Ankara Dress', description: 'Modern Ankara print dress' },
      { title: 'Traditional Headwrap', description: 'Colorful traditional headwrap' }
    ]
  }
];

// Seed function
async function seedDatabase() {
  try {
    const Talent = require('../models/Talent');
    
    // Clear existing data
    await Talent.deleteMany({});
    console.log('🗑️ Cleared existing talents');
    
    // Insert sample data
    await Talent.insertMany(sampleTalents);
    console.log('✅ Seeded database with sample talents');
    console.log(`📊 Created ${sampleTalents.length} sample talents`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();