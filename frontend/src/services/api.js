// services/api.js - FINAL VERSION with Best Practices
// ===== CONSTANTS =====
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const REQUEST_TIMEOUT = 15000 // 15 seconds
const MAX_RETRIES = 3

// ===== MAIN API SERVICE CLASS =====
class ApiService {
  constructor() {
    this.authToken = null
    this.requestCache = new Map()
    this.initializeAuth()
  }

  // ===== INITIALIZATION =====
  initializeAuth() {
    try {
      const authData = localStorage.getItem('fursa-auth')
      if (authData) {
        const { token } = JSON.parse(authData)
        if (token) {
          this.authToken = token
          console.log('🔐 Auth token initialized from localStorage')
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to initialize auth token:', error)
    }
  }

  // ===== TOKEN MANAGEMENT =====
  setAuthToken(token) {
    this.authToken = token
    console.log('🔐 Auth token set:', token ? 'Token present' : 'Token cleared')
  }

  clearAuthToken() {
    this.authToken = null
    this.requestCache.clear() // Clear cache on logout
    console.log('🔐 Auth token cleared')
  }

  // ===== PRIVATE HELPER METHODS =====
  _getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`
    }

    return headers
  }

  _getCacheKey(endpoint, options) {
    return `${options.method || 'GET'}_${endpoint}_${JSON.stringify(options.body || {})}`
  }

  _shouldCache(method) {
    return method === 'GET'
  }

  _handleHttpError(response, data) {
    switch (response.status) {
      case 401:
        console.warn('🔒 Unauthorized request - clearing auth token')
        this.clearAuthToken()
        localStorage.removeItem('fursa-auth')
        throw new Error('Your session has expired. Please log in again.')
      
      case 403:
        throw new Error('You do not have permission to perform this action.')
      
      case 404:
        throw new Error(data.error || data.message || 'Resource not found')
      
      case 422:
        throw new Error(data.error || data.message || 'Invalid data provided')
      
      case 429:
        throw new Error('Too many requests. Please wait a moment and try again.')
      
      case 500:
      case 502:
      case 503:
      case 504:
        throw new Error('Server error. Please try again later.')
      
      default:
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`)
    }
  }

  async _makeRequest(url, config, retryCount = 0) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      // Parse response
      const contentType = response.headers.get('content-type')
      let data

      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        try {
          data = JSON.parse(text)
        } catch {
          data = { message: text || 'No response data' }
        }
      }

      if (!response.ok) {
        this._handleHttpError(response, data)
      }

      return data

    } catch (error) {
      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.')
      }
      
      if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        // Retry logic for network errors
        if (retryCount < MAX_RETRIES) {
          console.warn(`🔄 Network error, retrying... (${retryCount + 1}/${MAX_RETRIES})`)
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))) // Exponential backoff
          return this._makeRequest(url, config, retryCount + 1)
        }
        
        throw new Error('Network error. Please check your connection and try again.')
      }
      
      throw error
    }
  }

  // ===== MAIN REQUEST METHOD =====
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
    const method = options.method || 'GET'
    
    const config = {
      method,
      headers: this._getHeaders(options.headers),
      ...options
    }

    console.log(`🌐 API Request: ${method} ${endpoint}`)

    // Check cache for GET requests
    const cacheKey = this._getCacheKey(endpoint, options)
    if (this._shouldCache(method) && this.requestCache.has(cacheKey)) {
      console.log(`📦 Cache hit: ${method} ${endpoint}`)
      return this.requestCache.get(cacheKey)
    }

    try {
      const result = await this._makeRequest(url, config)
      
      // Cache successful GET requests
      if (this._shouldCache(method)) {
        this.requestCache.set(cacheKey, result)
        // Auto-expire cache after 5 minutes
        setTimeout(() => this.requestCache.delete(cacheKey), 5 * 60 * 1000)
      }
      
      console.log(`✅ API Success: ${method} ${endpoint}`)
      return result
    } catch (error) {
      console.error(`❌ API Error: ${method} ${endpoint}`, error.message)
      throw error
    }
  }

  // ===== CONVENIENCE METHODS =====
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

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // ===== AUTHENTICATION ENDPOINTS =====
  async login(credentials) {
    console.log('🔐 Login attempt:', { userType: credentials.userType, email: credentials.email })
    
    try {
      const response = await this.post('/api/auth/login', credentials)
      
      if (response.token) {
        this.setAuthToken(response.token)
      }
      
      console.log('✅ Login successful')
      return response
    } catch (error) {
      console.warn('⚠️ Backend login failed:', error.message)
      throw error // Let the auth store handle fallback logic
    }
  }

  async register(userData) {
    console.log('📝 Registration attempt:', { userType: userData.userType, email: userData.email })
    
    const response = await this.post('/api/auth/register', userData)
    
    if (response.token) {
      this.setAuthToken(response.token)
    }
    
    console.log('✅ Registration successful')
    return response
  }

  async getCurrentUser() {
    return this.get('/api/auth/me')
  }

  async logout() {
    console.log('🚪 Logout request')
    
    try {
      await this.post('/api/auth/logout')
      console.log('✅ Server logout successful')
    } catch (error) {
      console.warn('⚠️ Server logout failed, continuing with local logout:', error.message)
    } finally {
      this.clearAuthToken()
    }
  }

  async refreshToken(token) {
    return this.post('/api/auth/refresh', { token })
  }

  async checkEmailExists(email) {
    return this.get(`/api/auth/check-email/${encodeURIComponent(email)}`)
  }

  // ===== SERVICE PROVIDER ENDPOINTS =====
  async createServiceProvider(providerData) {
    console.log('👷 Creating service provider:', { email: providerData.email, serviceType: providerData.serviceType })
    
    const response = await this.post('/api/service-providers', providerData)
    
    console.log('✅ Service provider created successfully')
    return response
  }

  async getServiceProviders(filters = {}) {
    console.log('🔍 Getting service providers with filters:', filters)
    
    try {
      const response = await this.get('/api/service-providers', filters)
      console.log('✅ Service providers retrieved')
      
      // Normalize response structure
      if (Array.isArray(response)) {
        return response
      } else if (response && Array.isArray(response.providers)) {
        return response.providers
      } else if (response && Array.isArray(response.data)) {
        return response.data
      } else {
        console.warn('⚠️ Unexpected service providers response structure:', response)
        return []
      }
    } catch (error) {
      console.error('❌ Failed to get service providers:', error.message)
      return [] // Return empty array as fallback
    }
  }

  async getServiceProvider(id) {
    console.log('👷 Getting service provider:', id)
    
    const response = await this.get(`/api/service-providers/${id}`)
    return response.provider || response
  }

  // NEW: Add the missing getServiceProviderProfile method that dashboard needs
  async getServiceProviderProfile(id) {
    console.log('👷 Getting service provider profile:', id)
    
    try {
      // Use the existing getServiceProvider method for consistency
      const response = await this.getServiceProvider(id)
      
      console.log('✅ Service provider profile retrieved')
      return response
    } catch (error) {
      console.error('❌ Failed to get service provider profile:', error.message)
      
      // Return a safe fallback profile structure so dashboard doesn't crash
      return {
        _id: id,
        id: id,
        name: 'Provider',
        email: '',
        serviceType: 'General Service',
        location: 'Kenya',
        stories: [],
        totalStories: 0,
        hasStories: false,
        status: 'active'
      }
    }
  }

  async updateServiceProvider(id, providerData) {
    console.log('👷 Updating service provider:', id)
    
    const response = await this.put(`/api/service-providers/${id}`, providerData)
    
    console.log('✅ Service provider updated successfully')
    return response
  }

  async deleteServiceProvider(id) {
    return this.delete(`/api/service-providers/${id}`)
  }

  // ===== SERVICE PROVIDER DASHBOARD =====
  async getServiceProviderStats(providerId) {
    console.log('📊 Getting provider stats for:', providerId)
    
    try {
      const response = await this.get(`/api/service-providers/${providerId}/dashboard`)
      
      return {
        pendingQuotes: response.stats?.newRequests || 0,
        activeQuotes: response.stats?.activeQuotes || 0,
        averageRating: response.stats?.rating || 0,
        monthlyJobs: response.stats?.monthlyJobs || 0,
        storiesPublished: response.stats?.storiesPublished || 0,
        totalEarnings: response.stats?.totalEarnings || 0
      }
    } catch (error) {
      console.warn('⚠️ Dashboard endpoint not available, using defaults:', error.message)
      return {
        pendingQuotes: 0,
        activeQuotes: 0,
        averageRating: 0,
        monthlyJobs: 0,
        storiesPublished: 0,
        totalEarnings: 0
      }
    }
  }

  async getProviderPerformance(providerId) {
    console.log('⚡ Getting provider performance for:', providerId)
    
    try {
      const response = await this.get(`/api/service-providers/${providerId}/dashboard`)
      
      return {
        responseRate: response.performance?.responseRate || 85,
        avgResponseTime: response.performance?.avgResponseTime || '2 hours',
        completedJobs: response.stats?.completedJobs || 0,
        customerSatisfaction: response.stats?.rating || 0,
        onTimeDelivery: response.performance?.onTimeDelivery || 90
      }
    } catch (error) {
      console.warn('⚠️ Performance endpoint not available, using defaults:', error.message)
      return {
        responseRate: 85,
        avgResponseTime: '2 hours',
        completedJobs: 0,
        customerSatisfaction: 0,
        onTimeDelivery: 90
      }
    }
  }

  async getProviderQuotes(providerId) {
    console.log('💬 Getting provider quotes for:', providerId)
    
    try {
      const response = await this.get(`/api/service-providers/${providerId}/quotes`)
      return response.quotes || response || []
    } catch (error) {
      console.warn('⚠️ Quotes endpoint not available yet:', error.message)
      return []
    }
  }

  async getProviderActivity(providerId) {
    console.log('🔄 Getting provider activity for:', providerId)
    
    try {
      const response = await this.get(`/api/service-providers/${providerId}/dashboard`)
      return response.recentActivity || []
    } catch (error) {
      console.warn('⚠️ Activity data not available:', error.message)
      return []
    }
  }

  // ===== WORK STORIES =====
  async addWorkStory(providerId, storyData) {
    return this.post(`/api/service-providers/${providerId}/stories`, storyData)
  }

  async getWorkStories(providerId) {
    return this.get(`/api/service-providers/${providerId}/stories`)
  }

  // ===== TALENT ENDPOINTS =====
  async createTalent(talentData) {
    console.log('🎨 Creating talent:', { email: talentData.email, skill: talentData.skill })
    
    const transformedData = {
      name: talentData.name,
      email: talentData.email,
      password: talentData.password,
      phone: talentData.phone,
      skill: talentData.skill,
      category: this._mapCategory(talentData.category),
      location: {
        full: talentData.location,
        city: talentData.location?.split(',')[0]?.trim(),
        county: talentData.location?.split(',')[1]?.trim(),
        country: talentData.location?.split(',')[2]?.trim() || 'Kenya'
      },
      description: talentData.description,
      voiceLanguage: 'english'
    }
    
    const response = await this.post('/api/talents', transformedData)
    
    console.log('✅ Talent created successfully')
    return response
  }

  async getTalents(filters = {}) {
    console.log('🔍 Getting talents with filters:', filters)
    
    try {
      const response = await this.get('/api/talents', filters)
      console.log('✅ Talents retrieved')
      
      // Normalize response structure
      if (Array.isArray(response)) {
        return response
      } else if (response && Array.isArray(response.talents)) {
        return response.talents
      } else if (response && Array.isArray(response.data)) {
        return response.data
      } else {
        console.warn('⚠️ Unexpected talents response structure:', response)
        return []
      }
    } catch (error) {
      console.error('❌ Failed to get talents:', error.message)
      return [] // Return empty array as fallback
    }
  }

  async getTalent(id) {
    return this.get(`/api/talents/${id}`)
  }

  async updateTalent(id, talentData) {
    console.log('🎨 Updating talent:', id)
    
    const response = await this.put(`/api/talents/${id}`, talentData)
    
    console.log('✅ Talent updated successfully')
    return response
  }

  async deleteTalent(id) {
    return this.delete(`/api/talents/${id}`)
  }

  // ===== TALENT DASHBOARD =====
  async getTalentStats(talentId) {
    console.log('📊 Getting talent stats for:', talentId)
    
    try {
      const response = await this.get(`/api/talents/${talentId}/dashboard`)
      
      return {
        portfolioItems: response.stats?.portfolioItems || 0,
        totalViews: response.stats?.totalViews || 0,
        averageRating: response.stats?.rating || 0,
        monthlyOrders: response.stats?.monthlyOrders || 0,
        totalEarnings: response.stats?.totalEarnings || 0,
        profileViews: response.stats?.profileViews || 0
      }
    } catch (error) {
      console.warn('⚠️ Talent dashboard endpoint not available, using defaults:', error.message)
      return {
        portfolioItems: 0,
        totalViews: 0,
        averageRating: 0,
        monthlyOrders: 0,
        totalEarnings: 0,
        profileViews: 0
      }
    }
  }

  // ===== PORTFOLIO MANAGEMENT =====
  async uploadPortfolioItem(talentId, formData) {
    console.log('📸 Uploading portfolio item for talent:', talentId)
    
    // For file uploads, don't set Content-Type header
    const response = await this.request(`/api/talents/${talentId}/portfolio`, {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    })
    
    console.log('✅ Portfolio item uploaded successfully')
    return response
  }

  async getPortfolio(talentId) {
    return this.get(`/api/talents/${talentId}/portfolio`)
  }

  async deletePortfolioItem(talentId, itemId) {
    return this.delete(`/api/talents/${talentId}/portfolio/${itemId}`)
  }

  // ===== FILE UPLOAD =====
  async uploadFiles(files) {
    console.log('📁 Uploading files:', files.length)
    
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    
    const response = await this.request('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    })
    
    console.log('✅ Files uploaded successfully')
    return response
  }

  // ===== SEARCH ENDPOINTS =====
  async searchTalents(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters })
    return this.get(`/api/search/talents?${params}`)
  }

  async searchServices(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters })
    return this.get(`/api/search/services?${params}`)
  }

  // ===== QUOTE MANAGEMENT =====
  async createQuoteRequest(providerId, quoteData) {
    return this.post('/api/quotes', {
      providerId,
      ...quoteData
    })
  }

  async getQuoteRequests(providerId, status = null) {
    const params = status ? { status } : {}
    return this.get(`/api/service-providers/${providerId}/quotes`, params)
  }

  async respondToQuote(quoteId, responseData) {
    return this.post(`/api/quotes/${quoteId}/respond`, responseData)
  }

  async updateQuoteStatus(quoteId, status) {
    return this.put(`/api/quotes/${quoteId}/status`, { status })
  }

  // ===== REVIEWS & RATINGS =====
  async getReviews(providerId) {
    return this.get(`/api/service-providers/${providerId}/reviews`)
  }

  async addReview(providerId, reviewData) {
    return this.post(`/api/service-providers/${providerId}/reviews`, reviewData)
  }

  // ===== MESSAGING =====
  async sendMessage(recipientId, messageData) {
    return this.post('/api/messages', {
      recipientId,
      ...messageData
    })
  }

  async getMessages(conversationId) {
    return this.get(`/api/messages/${conversationId}`)
  }

  async getConversations() {
    return this.get('/api/conversations')
  }

  // ===== LOCATION SERVICES =====
  async getLocations() {
    try {
      return await this.get('/api/locations')
    } catch (error) {
      console.warn('⚠️ Failed to get locations from backend, using fallback')
      // Return common Kenyan locations as fallback
      return [
        'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
        'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega'
      ].map(city => ({ name: city, type: 'city' }))
    }
  }

  async getLocationSuggestions(query) {
    return this.get('/api/locations/search', { q: query })
  }

  // ===== USER MANAGEMENT =====
  async updateUserProfile(userId, profileData) {
    return this.put(`/api/users/${userId}`, profileData)
  }

  async deleteUserAccount(userId) {
    return this.delete(`/api/users/${userId}`)
  }

  async updateProviderPreferences(providerId, preferences) {
    return this.put(`/api/service-providers/${providerId}/preferences`, preferences)
  }

  // ===== ANALYTICS & REPORTING =====
  async getAnalytics(userId, type, timeframe = '30d') {
    return this.get(`/api/analytics/${type}/${userId}`, { timeframe })
  }

  async getMarketInsights(category = null) {
    const params = category ? { category } : {}
    return this.get('/api/analytics/market-insights', params)
  }

  // ===== NOTIFICATIONS =====
  async getNotifications() {
    return this.get('/api/notifications')
  }

  async markNotificationAsRead(notificationId) {
    return this.put(`/api/notifications/${notificationId}/read`)
  }

  async getNotificationSettings() {
    return this.get('/api/notifications/settings')
  }

  async updateNotificationSettings(settings) {
    return this.put('/api/notifications/settings', settings)
  }

  // ===== UTILITY METHODS =====
  async healthCheck() {
    return this.get('/api/health')
  }

  async getServiceCategories() {
    try {
      return await this.get('/api/categories')
    } catch (error) {
      console.warn('⚠️ Categories endpoint not available, using defaults')
      return [
        { id: 'electrician', name: 'Electrician', icon: '⚡' },
        { id: 'plumber', name: 'Plumber', icon: '🔧' },
        { id: 'carpenter', name: 'Carpenter', icon: '🪚' },
        { id: 'painter', name: 'Painter', icon: '🎨' },
        { id: 'cleaner', name: 'Cleaning Service', icon: '🧹' },
        { id: 'mechanic', name: 'Mechanic', icon: '🔩' },
        { id: 'gardener', name: 'Gardener', icon: '🌱' }
      ]
    }
  }

  // ===== PRIVATE HELPER METHODS =====
  _mapCategory(frontendCategory) {
    const categoryMap = {
      'traditional-crafts': 'Artisans',
      'modern-art': 'Creatives', 
      'fashion-design': 'Creatives',
      'jewelry': 'Artisans',
      'home-decor': 'Artisans',
      'other': 'Creatives'
    }
    
    const mapped = categoryMap[frontendCategory] || 'Creatives'
    console.log(`📂 Mapping category: ${frontendCategory} → ${mapped}`)
    return mapped
  }

  // ===== CACHE MANAGEMENT =====
  clearCache() {
    this.requestCache.clear()
    console.log('🧹 Request cache cleared')
  }

  getCacheSize() {
    return this.requestCache.size
  }

  // ===== ERROR HANDLING HELPERS =====
  isNetworkError(error) {
    return error.message.includes('fetch') || 
           error.message.includes('NetworkError') || 
           error.message.includes('timeout')
  }

  isAuthError(error) {
    return error.message.includes('Unauthorized') || 
           error.message.includes('session has expired')
  }

  // ===== DEBUGGING HELPERS =====
  getRequestStats() {
    return {
      cacheSize: this.getCacheSize(),
      hasAuthToken: !!this.authToken,
      tokenType: this.authToken?.startsWith('fallback-') ? 'fallback' : 'real'
    }
  }
}

// ===== EXPORT SINGLETON INSTANCE =====
export default new ApiService()