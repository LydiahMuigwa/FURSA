const fs = require('fs');
console.log('PWD:', process.cwd());
console.log('ENV FILE EXISTS:', fs.existsSync('.env'));
if (fs.existsSync('.env')) {
  console.log('ENV FILE CONTENTS:\n', fs.readFileSync('.env', 'utf8'));
}
const dotenv = require('dotenv');
const result = dotenv.config();
console.log('dotenv result:', result);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'ZIVU API is running!' });
});

const serviceProviderRoutes = require('./routes/serviceProviders')
app.use('/api/service-providers', serviceProviderRoutes)

const talentRoutes = require('./routes/talent')
app.use('/api/talent', talentRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ZIVU server running on port ${PORT}`);
});