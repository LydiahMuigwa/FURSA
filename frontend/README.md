# FURSA Platform 🌍

**Give your voice to the world** - A platform connecting African talent to global opportunities.

## Overview

FURSA is a talent-first platform designed to showcase African artisans, creatives, and skilled workers to the global market. Unlike traditional job boards, FURSA focuses on visual portfolios, voice introductions, and authentic representation of talent.

## Features

- 📱 **Mobile-first design** - Built for African internet realities
- 🎨 **Visual portfolios** - Show work, not just CVs
- 🎤 **Voice introductions** - Multilingual support
- ✅ **Verification system** - Trust and safety
- 🌍 **Global discovery** - Connect local talent with world opportunities
- 🔍 **Smart search** - Filter by skill, location, rating

## Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management
- **Vite** - Build tool
- **Lucide Vue** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Cloudinary** - Media storage
- **Multer** - File uploads

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Git

### Installation

1. **Run the setup script**
```bash
chmod +x setup-fursa.sh
./setup-fursa.sh
```

2. **Install dependencies**
```bash
cd fursa-platform/backend && npm install
cd ../frontend && npm install
```

3. **Environment setup**
```bash
# Update backend/.env with your credentials
# Update frontend/.env if needed
```

4. **Start development**
```bash
./start-dev.sh
```

5. **Seed database (optional)**
```bash
cd backend && npm run seed
```

## Project Structure

```
fursa-platform/
├── backend/
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth, validation, etc.
│   └── scripts/          # Database scripts
├── frontend/
│   ├── src/
│   │   ├── components/   # Vue components
│   │   ├── views/        # Page components
│   │   ├── stores/       # Pinia stores
│   │   └── services/     # API services
│   └── public/           # Static assets
└── docs/                 # Documentation
```

## API Endpoints

### Talents
- `GET /api/talents` - List talents with filtering
- `GET /api/talents/:id` - Get talent by ID
- `POST /api/talents` - Create new talent profile
- `PUT /api/talents/:id` - Update talent profile

### Search
- `GET /api/search` - Search talents by keyword
- `GET /api/search/filters` - Get available filters

### Upload
- `POST /api/upload` - Upload files to Cloudinary

## Development

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Building for Production
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vizu
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env)
```
VITE_API_URL=https://your-api.com
VITE_APP_NAME=FURSA
```

## Required External Services

- **MongoDB** (local or Atlas): https://mongodb.com
- **Cloudinary** (free tier): https://cloudinary.com

## Development URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## File Placement Guide

After running the setup script, place these files in the correct locations:

### Backend Files
- `backend/models/Talent.js`
- `backend/routes/talents.js`
- `backend/routes/search.js`
- `backend/routes/upload.js`
- `backend/scripts/seedDatabase.js`

### Frontend Files
- `frontend/src/main.js`
- `frontend/src/App.vue`
- `frontend/src/stores/talent.js`
- `frontend/src/services/api.js`
- `frontend/src/views/HomeView.vue`
- `frontend/src/views/TalentProfile.vue`
- `frontend/src/views/UploadFlow.vue`
- `frontend/src/views/SearchView.vue`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Roadmap

- [ ] **Phase 1**: MVP with basic portfolio creation
- [ ] **Phase 2**: Advanced search and filtering
- [ ] **Phase 3**: Payment integration
- [ ] **Phase 4**: Mobile app
- [ ] **Phase 5**: AI-powered matching

## Support

- 📧 Email: support@fursa.africa
- 💬 Discord: [Join our community]
- 📖 Docs: [Documentation site]

## License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for African talent**