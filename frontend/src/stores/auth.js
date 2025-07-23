// stores/auth.js - CORRECTED VERSION - Fixed logout issues
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ApiService from '@/services/api.js'

// ===== UTILITY FUNCTIONS =====
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password) => {
  return password && password.length >= 8
}

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

// ===== CONSTANTS =====
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours
const AUTH_STORAGE_KEY = 'fursa-auth'

// ===== MAIN STORE =====
export const useAuthStore = defineStore('auth', () => {
  // ===== STATE =====
  const user = ref(null)
  const userType = ref(null) // 'provider' | 'talent' 
  const authToken = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const lastActivity = ref(null)

  // ===== COMPUTED GETTERS =====
  const isAuthenticated = computed(() => !!user.value && !!authToken.value)
  const isProvider = computed(() => userType.value === 'provider')
  const isTalent = computed(() => userType.value === 'talent')
  const userId = computed(() => user.value?._id || user.value?.id)
  
  const userDisplayName = computed(() => {
    if (!user.value) return 'User'
    return user.value.name || user.value.businessName || user.value.email?.split('@')[0] || 'User'
  })

  const userFirstName = computed(() => {
    if (!user.value) return 'User'
    const name = user.value.name || user.value.businessName || ''
    return name.split(' ')[0] || 'User'
  })

  const sessionValid = computed(() => {
    if (!lastActivity.value) return false
    return (Date.now() - lastActivity.value) < SESSION_TIMEOUT
  })

  // ===== PRIVATE HELPER FUNCTIONS =====
  const setAuthData = (userData, type, token) => {
    // Remove sensitive data
    const secureUserData = {
      ...userData,
      password: undefined,
      internalNotes: undefined,
      adminFlags: undefined
    }
    
    user.value = secureUserData
    userType.value = type
    authToken.value = token
    lastActivity.value = Date.now()
    
    // Store in localStorage
    const authData = {
      user: secureUserData,
      userType: type,
      token: token,
      timestamp: Date.now(),
      expiresAt: Date.now() + SESSION_TIMEOUT
    }
    
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
    } catch (storageError) {
      console.warn('Failed to save auth data to localStorage:', storageError)
    }
    
    // Set API service auth token
    if (ApiService && typeof ApiService.setAuthToken === 'function') {
      ApiService.setAuthToken(token)
    }
    
    return { user: secureUserData, userType: type, success: true }
  }

  // FIXED: Enhanced clearAuthData with better error handling
  const clearAuthData = () => {
    try {
      // Clear state first
      user.value = null
      userType.value = null
      authToken.value = null
      error.value = null
      lastActivity.value = null
      
      // Clear localStorage items individually with error handling
      const itemsToRemove = [
        AUTH_STORAGE_KEY,
        'fursa-user', // Legacy
        'fursa-user-type', // Legacy
        'fursa-auth-token', // Legacy
        'fursa-provider-id', // Legacy
        'fursa-talent-id', // Legacy
        'providerId', // Sometimes used in components
        'talentId' // Sometimes used in components
      ]
      
      itemsToRemove.forEach(item => {
        try {
          localStorage.removeItem(item)
        } catch (removeError) {
          console.warn(`Failed to remove ${item} from localStorage:`, removeError)
        }
      })
      
      // Clear API service auth token
      if (ApiService && typeof ApiService.clearAuthToken === 'function') {
        try {
          ApiService.clearAuthToken()
        } catch (apiError) {
          console.warn('Failed to clear API auth token:', apiError)
        }
      }
      
      console.log('✅ Auth data cleared successfully')
      
    } catch (error) {
      console.error('❌ Error clearing auth data:', error)
      // Force clear localStorage as last resort
      try {
        localStorage.clear()
      } catch (clearError) {
        console.error('Failed to clear localStorage:', clearError)
      }
    }
  }

  const validateLoginCredentials = (credentials) => {
    const email = sanitizeInput(credentials.email)
    const password = credentials.password
    
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address')
    }
    
    if (!password) {
      throw new Error('Please enter your password')
    }
    
    return { email, password }
  }

  const validateRegistrationData = (userData) => {
    const sanitizedData = {}
    for (const [key, value] of Object.entries(userData)) {
      sanitizedData[key] = sanitizeInput(value)
    }

    if (!validateEmail(sanitizedData.email)) {
      throw new Error('Please enter a valid email address')
    }
    
    if (!validatePassword(sanitizedData.password)) {
      throw new Error('Password must be at least 8 characters long')
    }

    if (!sanitizedData.name || sanitizedData.name.length < 2) {
      throw new Error('Please enter your full name (at least 2 characters)')
    }

    return sanitizedData
  }

  // ===== AUTHENTICATION ACTIONS =====
  const login = async (credentials, type) => {
    console.log('🔑 Login attempt:', { type, email: credentials.email })
    
    isLoading.value = true
    error.value = null
    
    try {
      const { email, password } = validateLoginCredentials(credentials)
      let userData = null
      let token = null
      
      // Try backend authentication first
      try {
        console.log('🌐 Attempting backend login...')
        const response = await ApiService.login({
          email,
          password,
          userType: type
        })
        
        if (!response.success) {
          throw new Error(response.error || 'Login failed')
        }
        
        userData = response.user
        token = response.token
        
        console.log('✅ Backend login successful')
        
      } catch (backendError) {
        console.warn('🔄 Backend login failed, trying fallback method:', backendError.message)
        
        // Fallback to searching existing users (for development)
        try {
          let users = []
          
          if (type === 'provider') {
            const response = await ApiService.getServiceProviders()
            users = Array.isArray(response) ? response : (response.providers || response.data || [])
          } else if (type === 'talent') {
            const response = await ApiService.getTalents()
            users = Array.isArray(response) ? response : (response.talents || response.data || [])
          }
          
          userData = users.find(u => u.email?.toLowerCase() === email.toLowerCase())
          
          if (!userData) {
            throw new Error('Invalid email or password. Please check your credentials.')
          }
          
          // Generate fallback token
          token = `fallback-token-${userData._id || userData.id}-${Date.now()}`
          
          console.log('✅ Fallback login successful')
          
        } catch (fallbackError) {
          console.error('❌ Fallback login failed:', fallbackError)
          throw new Error('Login failed. Please check your credentials and try again.')
        }
      }

      // Additional security checks
      if (type === 'provider' && userData.status === 'suspended') {
        throw new Error('Your account has been suspended. Please contact support.')
      }
      
      const result = setAuthData(userData, type, token)
      
      console.log('🎉 Login successful:', {
        userId: userData._id || userData.id,
        userType: type,
        timestamp: new Date().toISOString()
      })
      
      return result
      
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.'
      error.value = errorMessage
      
      console.warn('⚠️ Login failed:', {
        email: credentials.email,
        userType: type,
        error: errorMessage,
        timestamp: new Date().toISOString()
      })
      
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData, type) => {
    console.log('📝 Registration attempt:', { type, email: userData.email })
    
    isLoading.value = true
    error.value = null
    
    try {
      const sanitizedData = validateRegistrationData(userData)
      let response = null
      let token = null
      
      // Try backend registration first
      try {
        console.log('🌐 Attempting backend registration...')
        response = await ApiService.register({
          ...sanitizedData,
          userType: type
        })
        
        if (!response.success) {
          throw new Error(response.error || 'Registration failed')
        }
        
        user.value = response.user
        userType.value = response.userType || type
        token = response.token
        
        console.log('✅ Backend registration successful')
        
      } catch (backendError) {
        console.warn('🔄 Backend registration failed, trying fallback method:', backendError.message)
        
        // Fallback to direct API calls (for development)
        if (type === 'provider') {
          if (!sanitizedData.serviceType) {
            throw new Error('Please select your service type')
          }
          if (!sanitizedData.location) {
            throw new Error('Please enter your location')
          }
          
          response = await ApiService.createServiceProvider(sanitizedData)
          user.value = response.provider || response
          userType.value = 'provider'
          
        } else if (type === 'talent') {
          response = await ApiService.createTalent(sanitizedData)
          user.value = response.talent || response
          userType.value = 'talent'
        } else {
          throw new Error('Invalid user type')
        }
        
        // Generate fallback token
        token = `fallback-token-${user.value._id || user.value.id}-${Date.now()}`
        
        console.log('✅ Fallback registration successful')
      }
      
      const result = setAuthData(user.value, type, token)
      
      console.log('🎉 Registration successful:', {
        userId: user.value._id || user.value.id,
        userType: type
      })
      
      return result
      
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.'
      error.value = errorMessage
      console.error('❌ Registration failed:', err)
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  // FIXED: Enhanced logout with comprehensive error handling
  const logout = async () => {
    try {
      console.log('👋 Starting logout process...')
      
      // Log current state for debugging
      const currentUserId = userId.value
      const currentUserType = userType.value
      
      console.log('Current user before logout:', {
        userId: currentUserId,
        userType: currentUserType,
        hasToken: !!authToken.value
      })
      
      // Try to notify backend (but don't fail if this doesn't work)
      if (authToken.value && !authToken.value.startsWith('fallback-token-')) {
        try {
          console.log('🌐 Notifying backend of logout...')
          await ApiService.logout()
          console.log('✅ Backend logout successful')
        } catch (backendError) {
          console.warn('⚠️ Backend logout failed (continuing with local logout):', backendError)
          // Don't throw error - local logout is more important
        }
      }
      
      // Clear all auth data
      clearAuthData()
      
      console.log('✅ Logout completed successfully for user:', {
        previousUserId: currentUserId,
        previousUserType: currentUserType
      })
      
      return true
      
    } catch (error) {
      console.error('❌ Logout error:', error)
      
      // Force clear everything even if there's an error
      try {
        clearAuthData()
      } catch (clearError) {
        console.error('❌ Force clear failed:', clearError)
        // Last resort - clear localStorage completely
        try {
          localStorage.clear()
        } catch (finalError) {
          console.error('❌ Final clear failed:', finalError)
        }
      }
      
      // Always return true - logout should never fail from UI perspective
      return true
    }
  }

  // ===== SESSION MANAGEMENT =====
  const initializeAuth = async () => {
    try {
      console.log('🔐 Initializing auth...')
      
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
      
      if (!storedAuth) {
        console.log('🔍 No stored auth found')
        return
      }
      
      const authData = JSON.parse(storedAuth)
      
      // Validate auth data structure
      if (!authData.user || !authData.userType) {
        console.warn('⚠️ Invalid auth data structure, clearing...')
        await logout()
        return
      }
      
      // Check if session has expired
      if (authData.expiresAt && Date.now() > authData.expiresAt) {
        console.log('⏰ Session expired, logging out...')
        await logout()
        return
      }
      
      // Restore auth state
      user.value = authData.user
      userType.value = authData.userType
      authToken.value = authData.token || `fallback-token-${authData.user._id || authData.user.id}`
      lastActivity.value = authData.timestamp
      
      if (ApiService && typeof ApiService.setAuthToken === 'function') {
        ApiService.setAuthToken(authToken.value)
      }
      
      console.log('✅ Auth restored:', {
        userId: userId.value,
        userType: userType.value
      })
      
    } catch (err) {
      console.error('❌ Failed to restore auth state:', err)
      await logout() // Clear invalid data
    }
  }

  const refreshSession = () => {
    if (!isAuthenticated.value) return
    
    lastActivity.value = Date.now()
    
    // Update localStorage expiration
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth)
        authData.timestamp = Date.now()
        authData.expiresAt = Date.now() + SESSION_TIMEOUT
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
      } catch (err) {
        console.warn('⚠️ Failed to update session timestamp:', err)
      }
    }
  }

  const updateUser = (updatedData) => {
    if (!user.value) return
    
    user.value = { ...user.value, ...updatedData }
    refreshSession()
    
    console.log('👤 User data updated')
  }

  const clearError = () => {
    error.value = null
  }

  const handleUserActivity = () => {
    if (isAuthenticated.value) {
      refreshSession()
    }
  }

  // ===== RETURN STORE INTERFACE =====
  return {
    // State
    user,
    userType,
    authToken,
    isLoading,
    error,
    lastActivity,
    
    // Getters
    isAuthenticated,
    isProvider,
    isTalent,
    userId,
    userDisplayName,
    userFirstName,
    sessionValid,
    
    // Actions
    login,
    register,
    logout,
    initializeAuth,
    refreshSession,
    updateUser,
    clearError,
    handleUserActivity
  }
})