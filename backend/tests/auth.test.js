// backend/tests/auth.test.js
const request = require('supertest')
const app = require('../server')

describe('Authentication', () => {
  test('Should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        userType: 'provider'
      })
      .expect(201)
    
    expect(response.body.success).toBe(true)
    expect(response.body.user.email).toBe('test@example.com')
  })
})