// stores/auth.js - FURSA Authentication Store with Security & Validation + ROUTING FIXES
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ApiService from '@/services/api.js'

// Input validation utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone) => {
  // Kenyan phone number validation (supports +254 and 07xx formats)
  const phoneRegex = /^(\+254|254|0)?([17][0-9]{8})$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const userType = ref(null) // 'provider' | 'talent' 
  const isLoading = ref(false)
  const error = ref(null)
  const lastActivity = ref(null)

  // Session timeout (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isProvider = computed(() => userType.value === 'provider')
  const isTalent = computed(() => userType.value === 'talent')
  
  const userDisplayName = computed(() => {
    if (!user.value) return 'User'
    return user.value.name || user.value.businessName || user.value.email?.split('@')[0] || 'User'
  })

  const sessionValid = computed(() => {
    if (!lastActivity.value) return false
    return (Date.now() - lastActivity.value) < SESSION_TIMEOUT
  })

  // ENHANCED: Login method with proper routing return data
  const login = async (credentials, type) => {
    console.log('🔑 Login attempt:', { type, email: credentials.email })
    
    // Input validation
    const email = sanitizeInput(credentials.email)
    const phone = sanitizeInput(credentials.phone)
    
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address')
    }
    
    if (!validatePhone(phone)) {
      throw new Error('Please enter a valid Kenyan phone number (+254 or 07xx format)')
    }

    isLoading.value = true
    error.value = null
    
    try {
      let userData = null
      
      if (type === 'provider') {
        console.log('👷 Attempting provider login...')
        
        // Try backend first, then fallback to searching existing providers
        try {
          const response = await ApiService.login({
            email,
            phone,
            userType: 'provider'
          })
          userData = response.user
        } catch (backendError) {
          console.warn('Backend login failed, using fallback method')
          
          // Fallback to searching existing providers
          const providers = await ApiService.getServiceProviders()
          userData = providers.find(p => 
            p.email?.toLowerCase() === email.toLowerCase() && 
            p.phone?.replace(/\s/g, '') === phone.replace(/\s/g, '')
          )
          
          if (!userData) {
            throw new Error('Invalid credentials. Please check your email and phone number.')
          }
        }

        // Additional security checks for providers
        if (userData.status === 'suspended') {
          throw new Error('Your account has been suspended. Please contact support.')
        }
        
      } else if (type === 'talent') {
        console.log('🎨 Attempting talent login...')
        
        // Try backend first, then fallback to searching existing talents
        try {
          const response = await ApiService.login({
            email,
            phone,
            userType: 'talent'
          })
          userData = response.user
        } catch (backendError) {
          console.warn('Backend login failed, using fallback method')
          
          // Fallback to searching existing talents
          const talents = await ApiService.getTalents()
          userData = talents.find(t => 
            t.email?.toLowerCase() === email.toLowerCase() && 
            t.phone?.replace(/\s/g, '') === phone.replace(/\s/g, '')
          )
          
          if (!userData) {
            throw new Error('Invalid credentials. Please check your email and phone number.')
          }
        }
      } else {
        throw new Error('Invalid user type')
      }
      
      // Set user data with security considerations
      const secureUserData = {
        ...userData,
        // Remove sensitive data from client-side storage
        password: undefined,
        internalNotes: undefined,
        adminFlags: undefined
      }
      
      user.value = secureUserData
      userType.value = type // CRITICAL: Set the correct user type
      lastActivity.value = Date.now()
      
      // Store in localStorage with expiration
      const authData = {
        user: secureUserData,
        userType: type, // CRITICAL: Store the correct user type
        timestamp: Date.now(),
        expiresAt: Date.now() + SESSION_TIMEOUT
      }
      
      localStorage.setItem('fursa-auth', JSON.stringify(authData))
      
      // Log successful login (without sensitive data)
      console.log('🎉 Login successful:', {
        userId: userData._id || userData.id,
        userType: type,
        timestamp: new Date().toISOString()
      })
      
      // ENHANCED: Return data for routing
      return {
        user: secureUserData,
        userType: type,
        success: true
      }
      
    } catch (err) {
      error.value = err.message || 'Login failed. Please try again.'
      
      // Log failed login attempt (security monitoring)
      console.warn('⚠️ Login failed:', {
        email: email,
        userType: type,
        error: err.message,
        timestamp: new Date().toISOString()
      })
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ENHANCED: Register method with proper routing return data
  const register = async (userData, type) => {
    console.log('📝 Registration attempt:', { type, email: userData.email })
    
    // Validate and sanitize all input data
    const sanitizedData = {}
    for (const [key, value] of Object.entries(userData)) {
      sanitizedData[key] = sanitizeInput(value)
    }

    // Validate required fields
    if (!validateEmail(sanitizedData.email)) {
      throw new Error('Please enter a valid email address')
    }
    
    if (!validatePhone(sanitizedData.phone)) {
      throw new Error('Please enter a valid Kenyan phone number')
    }

    if (!sanitizedData.name || sanitizedData.name.length < 2) {
      throw new Error('Please enter your full name (at least 2 characters)')
    }

    isLoading.value = true
    error.value = null
    
    try {
      let response = null
      
      if (type === 'provider') {
        console.log('👷 Registering as provider...')
        
        // Additional validation for service providers
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
        console.log('🎨 Registering as talent...')
        
        response = await ApiService.createTalent(sanitizedData)
        user.value = response.talent || response
        userType.value = 'talent'
      } else {
        throw new Error('Invalid user type')
      }
      
      lastActivity.value = Date.now()
      
      // Store in localStorage
      const authData = {
        user: user.value,
        userType: type,
        timestamp: Date.now(),
        expiresAt: Date.now() + SESSION_TIMEOUT
      }
      
      localStorage.setItem('fursa-auth', JSON.stringify(authData))
      
      console.log('🎉 Registration successful:', {
        userId: user.value._id || user.value.id,
        userType: type
      })
      
      // ENHANCED: Return data for routing
      return {
        user: user.value,
        userType: type,
        success: true
      }
      
    } catch (err) {
      error.value = err.message || 'Registration failed. Please try again.'
      console.error('Registration failed:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    console.log('👋 User logged out:', {
      userId: user.value?._id || user.value?.id,
      userType: userType.value
    })
    
    user.value = null
    userType.value = null
    error.value = null
    lastActivity.value = null
    
    // Clear all auth-related localStorage
    localStorage.removeItem('fursa-auth')
    localStorage.removeItem('fursa-user') // Legacy cleanup
    localStorage.removeItem('fursa-user-type') // Legacy cleanup
    localStorage.removeItem('fursa-auth-token') // Legacy cleanup
    localStorage.removeItem('fursa-provider-id') // Legacy cleanup
  }

  // ENHANCED: Initialize auth with proper type restoration
  const initializeAuth = () => {
    try {
      const storedAuth = localStorage.getItem('fursa-auth')
      
      if (!storedAuth) {
        // Try legacy format for backwards compatibility
        const legacyUser = localStorage.getItem('fursa-user')
        const legacyType = localStorage.getItem('fursa-user-type')
        
        if (legacyUser && legacyType) {
          console.log('🔄 Migrating legacy auth format...')
          user.value = JSON.parse(legacyUser)
          userType.value = legacyType
          lastActivity.value = Date.now()
          
          // Migrate to new format
          const authData = {
            user: user.value,
            userType: legacyType,
            timestamp: Date.now(),
            expiresAt: Date.now() + SESSION_TIMEOUT
          }
          
          localStorage.setItem('fursa-auth', JSON.stringify(authData))
          
          // Clean up legacy items
          localStorage.removeItem('fursa-user')
          localStorage.removeItem('fursa-user-type')
          localStorage.removeItem('fursa-auth-token')
          
          console.log('✅ Legacy auth migrated:', {
            userId: user.value._id || user.value.id,
            userType: userType.value
          })
          
          return
        }
        
        console.log('🔍 No stored auth found')
        return // No stored auth
      }
      
      const authData = JSON.parse(storedAuth)
      
      // Check if session has expired
      if (Date.now() > authData.expiresAt) {
        console.log('⏰ Session expired, logging out...')
        logout()
        return
      }
      
      // Restore auth state
      user.value = authData.user
      userType.value = authData.userType // CRITICAL: Restore user type
      lastActivity.value = authData.timestamp
      
      console.log('✅ Auth restored:', {
        userId: user.value._id || user.value.id,
        userType: userType.value
      })
      
    } catch (err) {
      console.error('Failed to restore auth state:', err)
      logout() // Clear invalid data
    }
  }

  const updateUser = (updatedData) => {
    if (user.value) {
      user.value = { ...user.value, ...updatedData }
      lastActivity.value = Date.now()
      
      // Update localStorage
      const authData = {
        user: user.value,
        userType: userType.value,
        timestamp: Date.now(),
        expiresAt: Date.now() + SESSION_TIMEOUT
      }
      
      localStorage.setItem('fursa-auth', JSON.stringify(authData))
    }
  }

  const refreshSession = () => {
    if (user.value) {
      lastActivity.value = Date.now()
      
      // Update localStorage expiration
      const storedAuth = localStorage.getItem('fursa-auth')
      if (storedAuth) {
        const authData = JSON.parse(storedAuth)
        authData.timestamp = Date.now()
        authData.expiresAt = Date.now() + SESSION_TIMEOUT
        localStorage.setItem('fursa-auth', JSON.stringify(authData))
      }
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Auto-refresh session on activity
  const handleUserActivity = () => {
    if (isAuthenticated.value) {
      refreshSession()
    }
  }

  return {
    // State
    user,
    userType,
    isLoading,
    error,
    lastActivity,
    
    // Getters
    isAuthenticated,
    isProvider,
    isTalent,
    userDisplayName,
    sessionValid,
    
    // Actions
    login,
    register,
    logout,
    initializeAuth,
    updateUser,
    refreshSession,
    clearError,
    handleUserActivity
  }
})