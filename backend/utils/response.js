// backend/utils/response.js
const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data
})

const errorResponse = (message, statusCode = 400) => ({
  success: false,
  error: message,
  statusCode
})

module.exports = { successResponse, errorResponse }