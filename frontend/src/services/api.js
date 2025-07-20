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
}

export default new ApiService()