// services/api.js - Enhanced with proper authentication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class ApiService {
  constructor() {
    this.authToken = null
  }

  // ENHANCED: Authentication token management
  setAuthToken(token) {
    this.authToken = token
  }

  clearAuthToken() {
    this.authToken = null
  }

  // ENHANCED: Request method with auth headers
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      // ENHANCED: Better error handling
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // ENHANCED: Convenience methods for different HTTP verbs
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return this.request(url, { method: 'GET' })
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // === EXISTING TALENT ENDPOINTS (UNCHANGED) ===
  async getTalents(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/api/talents?${params}`)
  }

  async getTalentById(id) {
    return this.request(`/api/talents/${id}`)
  }

  async createTalent(talentData) {
    return this.request('/api/talents', {
      method: 'POST',
      body: JSON.stringify(talentData),
    })
  }

  async updateTalent(id, talentData) {
    return this.request(`/api/talents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(talentData),
    })
  }

  async deleteTalent(id) {
    return this.request(`/api/talents/${id}`, {
      method: 'DELETE',
    })
  }

  // === EXISTING FILE UPLOAD (UNCHANGED) ===
  async uploadFiles(files) {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    
    return this.request('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    })
  }

  // === EXISTING SEARCH ENDPOINTS (UNCHANGED) ===
  async searchTalents(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters })
    return this.request(`/api/search?${params}`)
  }

  // === EXISTING SERVICE PROVIDER ENDPOINTS (UNCHANGED) ===
  async createServiceProvider(providerData) {
    return this.request('/api/service-providers', {
      method: 'POST',
      body: JSON.stringify(providerData),
    })
  }

  async getServiceProvider(id) {
    return this.request(`/api/service-providers/${id}`)
  }

  async getServiceProviders(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/api/service-providers?${params}`)
  }

  async updateServiceProvider(id, providerData) {
    return this.request(`/api/service-providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(providerData),
    })
  }

  async deleteServiceProvider(id) {
    return this.request(`/api/service-providers/${id}`, {
      method: 'DELETE',
    })
  }

  async addWorkStory(providerId, storyData) {
    return this.request(`/api/service-providers/${providerId}/stories`, {
      method: 'POST',
      body: JSON.stringify(storyData),
    })
  }

  async getWorkStories(providerId) {
    return this.request(`/api/service-providers/${providerId}/stories`)
  }

  // === ENHANCED AUTHENTICATION ENDPOINTS ===
  
  // NEW: Proper authentication with backend
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getCurrentUser() {
    return this.request('/api/auth/me')
  }

  // NEW: Logout endpoint
  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST'
    })
  }

  // NEW: Refresh token endpoint
  async refreshToken(token) {
    return this.request('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token })
    })
  }

  // === FALLBACK METHODS (For when backend isn't ready) ===
  // These will work with your current setup and can be removed later
  
  async loginServiceProvider(email, phone) {
    try {
      // Try proper backend login first
      return await this.login({
        email,
        phone,
        userType: 'provider'
      })
    } catch (error) {
      // Fallback to searching existing providers
      console.warn('Backend login failed, using fallback method')
      const providers = await this.getServiceProviders()
      const provider = providers.find(p => 
        p.email?.toLowerCase() === email.toLowerCase() && 
        p.phone?.replace(/\s/g, '') === phone.replace(/\s/g, '')
      )
      
      if (provider) {
        return { 
          user: provider, 
          token: 'fallback-token-' + provider._id,
          expiresIn: 24 * 60 * 60 * 1000 // 24 hours
        }
      } else {
        throw new Error('Invalid credentials. Please check your email and phone number.')
      }
    }
  }

  async loginTalent(email, phone) {
    try {
      // Try proper backend login first
      return await this.login({
        email,
        phone,
        userType: 'talent'
      })
    } catch (error) {
      // Fallback to searching existing talents
      console.warn('Backend login failed, using fallback method')
      const talents = await this.getTalents()
      const talent = talents.find(t => 
        t.email?.toLowerCase() === email.toLowerCase() && 
        t.phone?.replace(/\s/g, '') === phone.replace(/\s/g, '')
      )
      
      if (talent) {
        return { 
          user: talent, 
          token: 'fallback-token-' + talent._id,
          expiresIn: 24 * 60 * 60 * 1000 // 24 hours
        }
      } else {
        throw new Error('Invalid credentials. Please check your email and phone number.')
      }
    }
  }

  // === USER MANAGEMENT ENDPOINTS ===
  
  // NEW: Update user profile
  async updateUserProfile(userId, profileData) {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  }

  // NEW: Delete user account
  async deleteUserAccount(userId) {
    return this.request(`/api/users/${userId}`, {
      method: 'DELETE'
    })
  }

  // === QUOTE MANAGEMENT ENDPOINTS ===
  
  // NEW: Quote-related endpoints for service providers
  async createQuoteRequest(providerId, quoteData) {
    return this.request('/api/quotes', {
      method: 'POST',
      body: JSON.stringify({
        providerId,
        ...quoteData
      })
    })
  }

  async getQuoteRequests(providerId, status = null) {
    const params = status ? { status } : {}
    return this.get(`/api/service-providers/${providerId}/quotes`, params)
  }

  async respondToQuote(quoteId, responseData) {
    return this.request(`/api/quotes/${quoteId}/respond`, {
      method: 'POST',
      body: JSON.stringify(responseData)
    })
  }

  async updateQuoteStatus(quoteId, status) {
    return this.request(`/api/quotes/${quoteId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }

  // === PROVIDER PREFERENCES ===
  
  // NEW: Update provider preferences (language, notifications, etc.)
  async updateProviderPreferences(providerId, preferences) {
    return this.request(`/api/service-providers/${providerId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences)
    })
  }

  // === UTILITY METHODS ===
  
  // NEW: Check API health
  async healthCheck() {
    return this.request('/api/health')
  }

  // NEW: Get supported service categories
  async getServiceCategories() {
    return this.request('/api/categories')
  }

  // NEW: Get location suggestions
  async getLocationSuggestions(query) {
    return this.get('/api/locations/search', { q: query })
  }
}

export default new ApiService()