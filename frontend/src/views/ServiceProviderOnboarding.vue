<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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

    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-2xl shadow-xl border p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Join as Service Provider</h1>
          <p class="text-gray-600">Start getting customers and growing your business with FURSA</p>
        </div>

        <!-- Registration Form -->
        <form @submit.prevent="submitRegistration" class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input v-model="formData.name" 
                   type="text" 
                   required
                   placeholder="e.g., John Mwangi"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input v-model="formData.email" 
                   type="email" 
                   required
                   placeholder="e.g., john@example.com"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <input v-model="formData.password" 
                   type="password" 
                   required
                   minlength="8"
                   placeholder="At least 8 characters"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
          </div>

          <!-- Service Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
            <select v-model="formData.serviceType" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
              <option value="">Select your service</option>
              <option value="electrician">⚡ Electrician</option>
              <option value="plumber">🔧 Plumber</option>
              <option value="carpenter">🪚 Carpenter</option>
              <option value="cleaner">🧹 Cleaner</option>
              <option value="painter">🎨 Painter</option>
              <option value="mechanic">🔩 Mechanic</option>
              <option value="technician">💻 Technician</option>
              <option value="other">🛠️ Other</option>
            </select>
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <div class="relative">
              <input v-model="formData.location" 
                    type="text" 
                    required
                    placeholder="e.g., Westlands, Nairobi"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10">
              <button type="button" @click="detectLocation" class="absolute right-3 top-3.5 text-blue-600 hover:text-blue-800">
                <Locate class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input v-model="formData.phone" 
                   type="tel" 
                   required
                   placeholder="e.g., +254 712 345 678"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
          </div>

          <!-- Experience -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
            <select v-model="formData.experience" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
              <option value="">Select experience</option>
              <option value="1-2">1-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Brief Description *</label>
            <textarea v-model="formData.description" 
                      rows="3"
                      required
                      placeholder="Tell customers about your services and what makes you special..."
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"></textarea>
            <p class="mt-1 text-xs text-gray-500">{{ formData.description.length }}/500 characters</p>
          </div>

          <!-- Terms Checkbox -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="terms" v-model="formData.termsAccepted" 
                     type="checkbox" 
                     required
                     class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded">
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="font-medium text-gray-700">I agree to the <a href="#" class="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a href="#" class="text-blue-600 hover:text-blue-800">Privacy Policy</a></label>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" 
                  :disabled="isSubmitting || !isFormValid"
                  :class="[
                    'w-full py-4 px-6 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl',
                    isFormValid && !isSubmitting
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]">
            <div v-if="isSubmitting" class="flex items-center justify-center">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Your Account...
            </div>
            <div v-else class="flex items-center justify-center">
              <Check class="w-5 h-5 mr-2" />
              Create My Provider Account
            </div>
          </button>
        </form>

        <!-- Benefits -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">🎉 What you get with FURSA:</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div class="flex items-center p-3 bg-blue-50 rounded-lg">
              <Check class="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
              Direct customer leads in your area
            </div>
            <div class="flex items-center p-3 bg-green-50 rounded-lg">
              <Check class="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
              Professional dashboard & tools
            </div>
            <div class="flex items-center p-3 bg-purple-50 rounded-lg">
              <Check class="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
              Build your work story portfolio
            </div>
            <div class="flex items-center p-3 bg-orange-50 rounded-lg">
              <Check class="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
              Customer reviews & ratings
            </div>
          </div>
        </div>

        <!-- Trust Indicators -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            🔒 Your information is secure and will only be used to connect you with customers
          </p>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check class="w-8 h-8 text-green-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-4">Welcome to FURSA! 🎉</h3>
        <p class="text-gray-600 mb-6">
          Your provider account has been created successfully. You can now start receiving customer requests!
        </p>
        <button @click="goToDashboard"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
          Go to My Dashboard
        </button>
      </div>
    </div>

    <!-- Error Notification -->
    <div v-if="errorMessage" class="fixed bottom-4 right-4 z-50">
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg flex items-start">
        <div class="flex-shrink-0">
          <XCircle class="w-5 h-5 text-red-500" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">{{ errorMessage }}</p>
        </div>
        <button @click="errorMessage = ''" class="ml-auto pl-4">
          <X class="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Check, Locate, XCircle, X } from 'lucide-vue-next'
import ApiService from '@/services/api'

const router = useRouter()

// Component state
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const errorMessage = ref('')

// Form data
const formData = ref({
  name: '',
  email: '',
  password: '',
  serviceType: '',
  location: '',
  phone: '',
  experience: '',
  description: '',
  termsAccepted: false
})

// Computed properties
const isFormValid = computed(() => {
  return (
    formData.value.name.trim() &&
    formData.value.email.trim() &&
    formData.value.password.length >= 8 &&
    formData.value.serviceType &&
    formData.value.location.trim() &&
    formData.value.phone.trim() &&
    formData.value.experience &&
    formData.value.description.trim() &&
    formData.value.termsAccepted
  )
})

// Methods
const detectLocation = () => {
  if (navigator.geolocation) {
    isSubmitting.value = true
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you would reverse geocode these coordinates to get an address
        formData.value.location = `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`
        isSubmitting.value = false
      },
      (error) => {
        errorMessage.value = 'Could not detect your location. Please enter manually.'
        isSubmitting.value = false
      }
    )
  } else {
    errorMessage.value = 'Geolocation is not supported by your browser'
  }
}

const submitRegistration = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  errorMessage.value = ''
  
  try {
    // Call the API service
    const response = await ApiService.createServiceProvider({
      ...formData.value,
      // Add any additional fields the API expects
      status: 'active',
      languages: ['English', 'Swahili'], // Default values
      availability: 'flexible'
    })

    // If registration includes authentication, store the token
    if (response.token) {
      localStorage.setItem('authToken', response.token)
    }

    // Store provider ID for dashboard access
    localStorage.setItem('fursa-provider-id', response.provider.id)
    
    // Show success modal
    showSuccessModal.value = true
    
  } catch (error) {
    console.error('Registration failed:', error)
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}


const goToDashboard = () => {
  showSuccessModal.value = false
  router.push('/app/provider-dashboard')
}

// Auto-focus first input on mount
onMounted(() => {
  const firstInput = document.querySelector('input')
  if (firstInput) firstInput.focus()
})
</script>

<style scoped>
/* Cultural Pattern Styles */
.cultural-pattern {
  position: relative;
  width: 40px;
  height: 40px;
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

/* Enhanced form styles */
input:focus, select:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Loading spinner animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Smooth transitions */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>