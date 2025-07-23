<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <!-- Cultural Pattern Logo -->
            <div class="cultural-pattern">
              <div class="pattern-bar-1"></div>
              <div class="pattern-bar-2"></div>
              <div class="pattern-bar-3"></div>
              <div class="pattern-bar-4"></div>
            </div>
            <div class="font-bold text-xl text-gray-900">FURSA</div>
          </router-link>
          <router-link to="/" class="text-gray-600 hover:text-gray-800 transition-colors">
            ← Back to Home
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Login Content -->
    <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        <!-- Header -->
        <div class="px-6 py-8 text-center border-b border-gray-100">
          <!-- Cultural Pattern Logo -->
          <div class="cultural-pattern mx-auto mb-4">
            <div class="pattern-bar-1"></div>
            <div class="pattern-bar-2"></div>
            <div class="pattern-bar-3"></div>
            <div class="pattern-bar-4"></div>
          </div>
          
          <h1 class="text-2xl font-bold gradient-text mb-2">Welcome Back!</h1>
          <p class="text-gray-600 text-sm">Sign in to continue your FURSA journey</p>
        </div>

        <!-- User Type Selector -->
        <div class="px-6 pt-6 pb-2">
          <div class="flex bg-gray-100 rounded-xl p-1.5">
            <button 
              @click="selectedUserType = 'provider'"
              :class="[
                'flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2',
                selectedUserType === 'provider' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              ]"
            >
              <span>🔧</span>
              Service Provider
            </button>
            
            <button 
              @click="selectedUserType = 'talent'"
              :class="[
                'flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2',
                selectedUserType === 'talent' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              ]"
            >
              <span>🎨</span>
              Creative Talent
            </button>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="submitLogin" class="px-6 pb-6 space-y-4">
          <!-- Error Display -->
          <div v-if="error" class="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <AlertCircle class="w-5 h-5 flex-shrink-0" />
            <span class="text-sm">{{ error }}</span>
          </div>

          <!-- Success Message -->
          <div v-if="showSuccessMessage" class="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <CheckCircle class="w-5 h-5 flex-shrink-0" />
            <span class="text-sm">{{ successMessage }}</span>
          </div>

          <!-- Email Input -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail class="w-4 h-4" />
              Email Address
            </label>
            <input 
              id="email"
              v-model="formData.email"
              type="email" 
              required
              placeholder="Enter your email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :disabled="isLoading"
              autocomplete="email"
            />
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock class="w-4 h-4" />
              Password
            </label>
            <div class="relative">
              <input 
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'" 
                required
                placeholder="Enter your password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                :disabled="isLoading"
                autocomplete="current-password"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabindex="-1"
              >
                <Eye v-if="showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                v-model="formData.rememberMe" 
                type="checkbox" 
                class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">Remember me</span>
            </label>
            <button 
              type="button" 
              class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              @click="showForgotPassword = true"
            >
              Forgot password?
            </button>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="isLoading || !formData.email || !formData.password"
            :class="[
              'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200',
              selectedUserType === 'provider' 
                ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300' 
                : 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300'
            ]"
          >
            <div v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <LogIn v-else class="w-5 h-5" />
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <!-- Registration Links -->
        <div class="px-6 py-6 border-t border-gray-100 bg-gray-50">
          <p class="text-center text-sm text-gray-600 mb-3">
            Don't have an account?
          </p>
          <div class="space-y-2">
            <button 
              @click="goToProviderRegister" 
              class="w-full py-2 px-4 border-2 border-blue-200 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Join as Service Provider
            </button>
            <button 
              @click="goToTalentRegister" 
              class="w-full py-2 px-4 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-colors"
            >
              Join as Creative Talent
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="showForgotPassword = false">
      <div @click.stop class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Reset Password</h3>
        <p class="text-gray-600 mb-4">Enter your email address and we'll send you a password reset link.</p>
        <input 
          type="email" 
          placeholder="Enter your email"
          v-model="forgotPasswordEmail"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
        />
        <div class="flex gap-3">
          <button 
            @click="showForgotPassword = false"
            class="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="sendPasswordReset"
            class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="!forgotPasswordEmail"
          >
            Send Reset Link
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Component state
const selectedUserType = ref('provider')
const showPassword = ref(false)
const showSuccessMessage = ref(false)
const showForgotPassword = ref(false)
const successMessage = ref('')
const isLoading = ref(false)
const error = ref('')
const forgotPasswordEmail = ref('')

const formData = ref({
  email: '',
  password: '',
  rememberMe: false
})

// Methods
const resetForm = () => {
  formData.value = { email: '', password: '', rememberMe: false }
  error.value = ''
  showSuccessMessage.value = false
  successMessage.value = ''
  showPassword.value = false
  showForgotPassword.value = false
}

// COMPLETE: Login submission
const submitLogin = async () => {
  try {
    console.log('🔑 Login attempt:', { 
      email: formData.value.email,
      userType: selectedUserType.value 
    })
    
    isLoading.value = true
    error.value = ''
    showSuccessMessage.value = false
    
    // Create login credentials
    const credentials = {
      email: formData.value.email.trim(),
      password: formData.value.password,
      userType: selectedUserType.value
    }
    
    // Call auth store login method
    const result = await authStore.login(credentials, selectedUserType.value)
    
    console.log('✅ Login successful:', result)
    
    // Show success message
    successMessage.value = `Welcome back! Redirecting to your dashboard...`
    showSuccessMessage.value = true
    
    // Wait for user to see success message
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirect to appropriate dashboard
    const actualUserType = authStore.userType
    if (actualUserType === 'provider') {
      await router.push({
        path: '/app/provider-dashboard',
        query: { welcome: 'true' }
      })
    } else if (actualUserType === 'talent') {
      await router.push({
        path: '/app/talent-dashboard', 
        query: { welcome: 'true' }
      })
    } else {
      await router.push('/app')
    }
    
  } catch (err) {
    console.error('❌ Login failed:', err)
    error.value = err.message || 'Login failed. Please check your credentials and try again.'
    showSuccessMessage.value = false
  } finally {
    isLoading.value = false
  }
}

const goToProviderRegister = () => {
  router.push('/app/join-as-provider')
}

const goToTalentRegister = () => {
  router.push('/app/upload')
}

const sendPasswordReset = async () => {
  if (!forgotPasswordEmail.value) return
  
  try {
    // TODO: Implement password reset API call
    console.log('Sending password reset to:', forgotPasswordEmail.value)
    
    // For now, just show success
    alert('Password reset link sent! Check your email.')
    showForgotPassword.value = false
    forgotPasswordEmail.value = ''
  } catch (error) {
    console.error('Password reset failed:', error)
    alert('Failed to send reset link. Please try again.')
  }
}

// Auto-focus email input when page loads
onMounted(() => {
  // Check if user is already authenticated
  if (authStore.isAuthenticated) {
    console.log('⚠️ User already authenticated, redirecting to dashboard')
    const dashboardRoute = authStore.isProvider 
      ? '/app/provider-dashboard' 
      : '/app/talent-dashboard'
    router.push(dashboardRoute)
    return
  }

  // Focus email input
  nextTick(() => {
    const emailInput = document.querySelector('input[type="email"]')
    if (emailInput) emailInput.focus()
  })

  // Handle redirect query parameter
  if (route.query.redirect) {
    console.log('🔄 Will redirect to:', route.query.redirect)
  }
})
</script>

<style scoped>
/* Cultural Pattern Styles */
.cultural-pattern {
  position: relative;
  width: 40px;
  height: 40px;
  margin: 0 auto;
}

.pattern-bar-1 { 
  background: #ff6b35; 
  height: 8px; 
  border-radius: 4px; 
}

.pattern-bar-2 { 
  background: #f7931e; 
  height: 6px; 
  border-radius: 3px; 
  margin-top: 2px; 
  margin-left: 4px; 
}

.pattern-bar-3 { 
  background: #10b981; 
  height: 6px; 
  border-radius: 3px; 
  margin-top: 2px; 
  margin-left: 8px; 
}

.pattern-bar-4 { 
  background: #2563eb; 
  height: 4px; 
  border-radius: 2px; 
  margin-top: 2px; 
  margin-left: 12px; 
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, #2563eb, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Focus styles for accessibility */
input:focus,
button:focus {
  outline: none;
}

/* Disabled button styles */
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Animation for loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive design */
@media (max-width: 640px) {
  .cultural-pattern {
    width: 32px;
    height: 32px;
  }
  
  .pattern-bar-1 { height: 6px; }
  .pattern-bar-2 { height: 5px; }
  .pattern-bar-3 { height: 4px; }
  .pattern-bar-4 { height: 3px; }
}

/* High contrast support */
@media (prefers-contrast: high) {
  input, button {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>