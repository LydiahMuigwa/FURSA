const express = require('express')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const router = express.Router()

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image and video files are allowed'), false)
    }
  }
})

// POST /api/upload - Upload files to Cloudinary
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' })
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'fursa/portfolios',
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(file.buffer)
      })
    })

    const uploadResults = await Promise.all(uploadPromises)

    const files = uploadResults.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      type: result.resource_type,
      width: result.width,
      height: result.height
    }))

    res.json({ files })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router