// backend/utils/errors.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

const handleError = (err, req, res, next) => {
  let { statusCode, message } = err
  
  if (!statusCode) statusCode = 500
  if (!message) message = 'Internal Server Error'
  
  res.status(statusCode).json({
    success: false,
    error: message
  })
}

module.exports = { AppError, handleError }