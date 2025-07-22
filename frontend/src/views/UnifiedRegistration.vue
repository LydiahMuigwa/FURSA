<template>
  <!-- FURSA Unified Registration - Design System Version -->
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
    
    <!-- FURSA Header -->
    <header class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <router-link to="/app" class="flex items-center hover:opacity-80 transition-opacity">
            <!-- Cultural Pattern Logo -->
            <div class="cultural-pattern mr-3">
              <div class="pattern-bar-1"></div>
              <div class="pattern-bar-2"></div>
              <div class="pattern-bar-3"></div>
              <div class="pattern-bar-4"></div>
            </div>
            <div class="text-xl font-bold gradient-text">FURSA</div>
          </router-link>
          
          <div class="text-right">
            <div class="text-sm text-gray-500 mb-1">Already have an account?</div>
            <button @click="showLoginModal = true" class="text-sm font-semibold text-fursa-orange hover:text-orange-600 transition-colors">
              Sign in here →
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Registration Form -->
    <main class="max-w-2xl mx-auto px-4 py-12">
      
      <!-- User Type Display -->
      <div class="text-center mb-8">
        <div :class="[
          'w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center',
          userType === 'provider' 
            ? 'bg-gradient-to-br from-blue-100 to-blue-200' 
            : 'bg-gradient-to-br from-orange-100 to-orange-200'
        ]">
          <span class="text-4xl">{{ userType === 'provider' ? '🔧' : '🎨' }}</span>
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ userType === 'provider' ? 'Join as Service Provider' : 'Join as Creative Talent' }}
        </h1>
        <p class="text-lg text-gray-600 mb-6">
          {{ userType === 'provider' 
            ? 'Start getting customers and growing your business' 
            : 'Share your talent and sell to the world' }}
        </p>
        
        <!-- User Type Switcher -->
        <div class="inline-flex bg-gray-100 rounded-xl p-1">
          <button 
            @click="switchUserType('provider')" 
            :class="[
              'px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              userType === 'provider' 
                ? 'bg-white text-fursa-blue shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            🔧 Service Provider
          </button>
          <button 
            @click="switchUserType('talent')" 
            :class="[
              'px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2',
              userType === 'talent' 
                ? 'bg-white text-fursa-orange shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            🎨 Creative Talent
          </button>
        </div>
      </div>

      <!-- Registration Form -->
      <div class="card">
        <form @submit.prevent="submitRegistration">
          
          <!-- Personal Information -->
          <div class="mb-8 pb-6 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              👤 Personal Information
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  required
                  placeholder="Enter your full name"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Phone Number *</label>
                <input 
                  v-model="formData.phone" 
                  type="tel" 
                  required
                  placeholder="+254 712 345 678"
                  class="form-input"
                  @input="formatPhoneNumber"
                />
                <div v-if="isPhoneValid" class="text-xs text-green-600 mt-1">
                  ✓ Valid Kenyan phone number
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input 
                  v-model="formData.email" 
                  type="email" 
                  required
                  placeholder="your.email@gmail.com"
                  class="form-input"
                  @blur="checkEmailSuggestion"
                />
                <div v-if="emailSuggestion" class="mt-1">
                  <button 
                    type="button" 
                    @click="acceptEmailSuggestion"
                    class="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Did you mean: {{ emailSuggestion }}?
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Create Password *</label>
                <div class="relative">
                  <input 
                    v-model="formData.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    required
                    placeholder="Create a secure password"
                    class="form-input pr-12"
                    @input="checkPasswordStrength"
                  />
                  <button 
                    type="button" 
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                
                <!-- Password Strength -->
                <div class="mt-2">
                  <div class="flex gap-1 mb-1">
                    <div 
                      v-for="i in 4" 
                      :key="i" 
                      :class="[
                        'h-1 flex-1 rounded-full transition-colors',
                        getStrengthBarClass(i)
                      ]"
                    ></div>
                  </div>
                  <div class="text-xs text-gray-500">{{ passwordStrengthText }}</div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Location *</label>
              <input 
                v-model="formData.location" 
                type="text" 
                required
                placeholder="City, County, Country"
                class="form-input"
              />
              <button 
                type="button" 
                @click="detectLocation" 
                class="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                📍 Use my current location
              </button>
            </div>
          </div>

          <!-- Professional Information -->
          <div class="mb-8 pb-6 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              {{ userType === 'provider' ? '🔧 Service Information' : '🎨 Creative Information' }}
            </h3>
            
            <div class="form-group">
              <label class="form-label">
                {{ userType === 'provider' ? 'What service do you provide? *' : 'What is your primary skill? *' }}
              </label>
              
              <select 
                v-if="userType === 'provider'" 
                v-model="formData.serviceType" 
                required
                class="form-input"
              >
                <option value="">Select your service</option>
                <option value="electrician">⚡ Electrician</option>
                <option value="plumber">🔧 Plumber</option>
                <option value="carpenter">🪚 Carpenter</option>
                <option value="painter">🎨 Painter</option>
                <option value="cleaner">🧹 Cleaning Service</option>
                <option value="mechanic">🔩 Mechanic</option>
                <option value="gardener">🌱 Gardener</option>
                <option value="other">Other Service</option>
              </select>
              
              <input 
                v-else
                v-model="formData.skill" 
                type="text" 
                required
                placeholder="e.g., Beadwork, Wood Carving, Fashion Design"
                class="form-input"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label">
                  {{ userType === 'provider' ? 'Years of Experience' : 'Category' }}
                </label>
                
                <select 
                  v-if="userType === 'provider'" 
                  v-model="formData.experience"
                  class="form-input"
                >
                  <option value="">Select experience</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
                
                <select 
                  v-else 
                  v-model="formData.category"
                  class="form-input"
                >
                  <option value="">Select category</option>
                  <option value="traditional-crafts">Traditional Crafts</option>
                  <option value="modern-art">Modern Art</option>
                  <option value="fashion-design">Fashion & Design</option>
                  <option value="jewelry">Jewelry & Accessories</option>
                  <option value="home-decor">Home Décor</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div v-if="userType === 'provider'" class="form-group">
                <label class="form-label">Availability</label>
                <select v-model="formData.availability" class="form-input">
                  <option value="flexible">Flexible hours</option>
                  <option value="weekdays">Weekdays only</option>
                  <option value="weekends">Weekends only</option>
                  <option value="emergency">Emergency calls</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                {{ userType === 'provider' 
                  ? 'Tell customers about your service *' 
                  : 'Tell your creative story *' }}
              </label>
              <textarea 
                v-model="formData.description" 
                required
                rows="4"
                :placeholder="userType === 'provider' 
                  ? 'Describe your expertise, what makes you different, and why customers should choose you...'
                  : 'Share your journey, inspiration, and what makes your work special...'"
                class="form-input resize-none"
                maxlength="500"
              ></textarea>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>{{ userType === 'provider' ? 'Help customers understand your value' : 'Let your personality shine through' }}</span>
                <span>{{ formData.description.length }}/500</span>
              </div>
            </div>
          </div>

          <!-- Terms and Submit -->
          <div>
            <div class="mb-6">
              <label class="flex items-start gap-3 cursor-pointer">
                <input 
                  v-model="formData.agreeToTerms" 
                  type="checkbox" 
                  required
                  class="mt-1 w-4 h-4 text-fursa-orange rounded focus:ring-fursa-orange"
                />
                <span class="text-sm text-gray-700 leading-relaxed">
                  I agree to FURSA's 
                  <a href="/terms" class="text-fursa-orange hover:text-orange-600 font-medium">Terms of Service</a>
                  and 
                  <a href="/privacy" class="text-fursa-orange hover:text-orange-600 font-medium">Privacy Policy</a>
                </span>
              </label>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <span>⚠️</span>
              <span class="text-sm">{{ error }}</span>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="!isFormValid || isSubmitting"
              :class="[
                'w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300',
                userType === 'provider' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' 
                  : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
                !isSubmitting && 'hover:scale-105 hover:shadow-lg'
              ]"
            >
              <div v-if="isSubmitting" class="flex items-center gap-3">
                <div class="loading-spinner"></div>
                Creating your account...
              </div>
              <div v-else class="flex items-center gap-2">
                <span>Join FURSA</span>
                <span class="text-xl">→</span>
              </div>
            </button>
          </div>
        </form>
      </div>

      <!-- Next Steps Preview -->
      <div class="mt-8 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-6">
        <h4 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          🎯 What happens next?
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <div class="font-medium text-gray-900 text-sm">Account Created</div>
              <div class="text-xs text-gray-600">You'll be signed in automatically</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <div class="font-medium text-gray-900 text-sm">Complete Your Profile</div>
              <div class="text-xs text-gray-600">Add photos and showcase your work</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <div class="font-medium text-gray-900 text-sm">Start Earning</div>
              <div class="text-xs text-gray-600">
                {{ userType === 'provider' ? 'Get quote requests' : 'Sell your creations' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <div :class="[
            'w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl font-bold',
            userType === 'provider' 
              ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600' 
              : 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600'
          ]">
            ✓
          </div>
          
          <h3 class="modal-title">Welcome to FURSA! 🎉</h3>
          <p class="modal-subtitle">
            Your account has been created successfully. Let's complete your profile to start 
            {{ userType === 'provider' ? 'getting customers' : 'selling your work' }}.
          </p>
        </div>
        
        <div class="modal-footer">
          <button 
            @click="goToDashboard"
            :class="[
              'w-full py-3 px-6 rounded-xl font-semibold text-white',
              userType === 'provider' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'
            ]"
          >
            Continue to Dashboard
          </button>
          <button 
            @click="closeSuccessModal" 
            class="btn-ghost w-full"
          >
            Explore FURSA First
          </button>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <LoginModal :is-open="showLoginModal" @close="showLoginModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginModal from '@/components/auth/LoginModal.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Determine user type from route or props
const userType = ref('talent') // Default to talent

// Component state
const showPassword = ref(false)
const isSubmitting = ref(false)
const error = ref('')
const showSuccessModal = ref(false)
const showLoginModal = ref(false)
const emailSuggestion = ref('')

// Form data
const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  location: '',
  serviceType: '', // for providers
  skill: '', // for talents
  category: '', // for talents
  experience: '', // for providers
  availability: 'flexible', // for providers
  description: '',
  agreeToTerms: false
})

// Computed properties
const isFormValid = computed(() => {
  const baseValid = formData.value.name && 
                   formData.value.email && 
                   formData.value.phone && 
                   formData.value.password && 
                   formData.value.location && 
                   formData.value.description && 
                   formData.value.agreeToTerms

  if (userType.value === 'provider') {
    return baseValid && formData.value.serviceType
  } else {
    return baseValid && formData.value.skill
  }
})

const isPhoneValid = computed(() => {
  const phone = formData.value.phone.replace(/\s/g, '')
  return /^(\+254|254|0)?[17]\d{8}$/.test(phone)
})

const passwordStrength = computed(() => {
  const password = formData.value.password
  let strength = 0
  
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  return Math.min(strength, 4)
})

const passwordStrengthText = computed(() => {
  const texts = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']
  return texts[passwordStrength.value] || 'Enter password'
})

// Methods
const switchUserType = (type) => {
  userType.value = type
  const newPath = type === 'provider' ? '/app/join-as-provider' : '/app/upload'
  router.replace(newPath)
}

const getStrengthBarClass = (index) => {
  if (index <= passwordStrength.value) {
    if (passwordStrength.value === 1) return 'bg-red-500'
    if (passwordStrength.value === 2) return 'bg-yellow-500'
    if (passwordStrength.value === 3) return 'bg-blue-500'
    return 'bg-green-500'
  }
  return 'bg-gray-200'
}

const formatPhoneNumber = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  
  if (value.startsWith('254')) {
    value = '+254 ' + value.slice(3).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
  } else if (value.startsWith('07') || value.startsWith('01')) {
    value = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  
  formData.value.phone = value
}

const checkEmailSuggestion = () => {
  const email = formData.value.email.toLowerCase()
  const commonTypos = {
    'gmai.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'hotmial.com': 'hotmail.com'
  }
  
  if (email.includes('@')) {
    const [user, domain] = email.split('@')
    if (commonTypos[domain]) {
      emailSuggestion.value = `${user}@${commonTypos[domain]}`
    }
  }
}

const acceptEmailSuggestion = () => {
  formData.value.email = emailSuggestion.value
  emailSuggestion.value = ''
}

const detectLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        formData.value.location = 'Location detected automatically'
      },
      (error) => {
        console.warn('Location detection failed:', error)
      }
    )
  }
}

const submitRegistration = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  error.value = ''
  
  try {
    await authStore.register(formData.value, userType.value)
    showSuccessModal.value = true
  } catch (err) {
    error.value = err.message || 'Registration failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const goToDashboard = () => {
  showSuccessModal.value = false
  
  if (userType.value === 'provider') {
    router.push('/app/provider-dashboard')
  } else {
    router.push('/app/talent-dashboard')
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/app')
}

// Initialize based on route
onMounted(() => {
  if (route.meta.userType) {
    userType.value = route.meta.userType
  } else if (route.path.includes('join-as-provider')) {
    userType.value = 'provider'
  } else if (route.path.includes('upload')) {
    userType.value = 'talent'
  }
})
</script>