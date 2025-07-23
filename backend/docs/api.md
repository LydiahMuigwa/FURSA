// backend/docs/api.md
# FURSA API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user (provider or talent)

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "userType": "provider",
  "phone": "+254123456789"
}