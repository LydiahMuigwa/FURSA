<template>
  <!-- Login Modal -->
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white rounded-xl max-w-md w-full p-8">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-xl font-bold text-gray-900">Welcome Back!</h3>
          <p class="text-gray-600">Sign in to your FURSA account</p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- User Type Selector -->
      <div class="mb-6">
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button @click="userType = 'provider'"
                  :class="[
                    'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                    userType === 'provider' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  ]">
            🔧 Service Provider
          </button>
          <button @click="userType = 'talent'"
                  :class="[
                    'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                    userType === 'talent' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  ]">
            🎨 Creative Talent
          </button>
        </div>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="submitLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input v-model="formData.email" 
                 type="email" 
                 required
                 placeholder="Enter your email"
                 class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
        </div>

        <!-- Password (simplified - just email for now) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input v-model="formData.phone" 
                 type="tel" 
                 required
                 placeholder="Enter your phone number"
                 class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
          <p class="text-xs text-gray-500 mt-1">We'll use email + phone to verify your identity</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <!-- Submit Button -->
        <button type="submit" 
                :disabled="isLoading"
                :class="[
                  'w-full py-3 px-4 rounded-lg font-semibold transition-all',
                  userType === 'provider'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white',
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                ]">
          <div v-if="isLoading" class="flex items-center justify-center">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Signing In...
          </div>
          <div v-else class="flex items-center justify-center">
            <LogIn class="w-5 h-5 mr-2" />
            Sign In
          </div>
        </button>
      </form>

      <!-- Register Link -->
      <div class="mt-6 pt-6 border-t border-gray-200 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <button @click="goToRegister" class="text-blue-600 hover:text-blue-700 font-medium ml-1">
            {{ userType === 'provider' ? 'Join as Service Provider' : 'Join as Creative Talent' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { X, LogIn } from 'lucide-vue-next'
import ApiService from '@/services/api.js'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const router = useRouter()

// Component state
const userType = ref('provider') // 'provider' or 'talent'
const isLoading = ref(false)
const errorMessage = ref('')

const formData = ref({
  email: '',
  phone: ''
})

// Methods
const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  formData.value = { email: '', phone: '' }
  errorMessage.value = ''
  isLoading.value = false
}

const submitLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    if (userType.value === 'provider') {
      // Find service provider by email and phone
      const providers = await ApiService.getServiceProviders({
        email: formData.value.email
      })
      
      const provider = providers.find(p => 
        p.email === formData.value.email && p.phone === formData.value.phone
      )
      
      if (provider) {
        // Login successful
        localStorage.setItem('fursa-provider-id', provider._id)
        closeModal()
        router.push('/app/provider-dashboard')
      } else {
        errorMessage.value = 'Invalid email or phone number. Please check your credentials.'
      }
    } else {
      // Talent login (simplified for now)
      errorMessage.value = 'Talent login coming soon! Please use Creative Talent registration for now.'
    }
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const goToRegister = () => {
  closeModal()
  if (userType.value === 'provider') {
    router.push('/app/join-as-provider')
  } else {
    router.push('/app/upload')
  }
}
</script>

<style scoped>
/* Loading spinner animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>