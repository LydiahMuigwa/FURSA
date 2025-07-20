const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Talent endpoints
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

  // File upload endpoint
  async uploadFiles(files) {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    
    return this.request('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    })
  }

  // Search endpoints
  async searchTalents(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters })
    return this.request(`/api/search?${params}`)
  }

  // Service Provider endpoints
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

  // Authentication endpoints
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
}

export default new ApiService()