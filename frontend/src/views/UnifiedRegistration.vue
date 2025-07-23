<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
    
    <!-- FURSA Header -->
    <header class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <router-link 
            to="/app" 
            class="flex items-center hover:opacity-80 transition-opacity"
            aria-label="FURSA Home"
          >
            <!-- Cultural Pattern Logo -->
            <div class="cultural-pattern mr-3" aria-hidden="true">
              <div class="pattern-bar-1"></div>
              <div class="pattern-bar-2"></div>
              <div class="pattern-bar-3"></div>
              <div class="pattern-bar-4"></div>
            </div>
            <div class="text-xl font-bold gradient-text">FURSA</div>
          </router-link>
          
          <div class="text-right">
            <div class="text-sm text-gray-500 mb-1">Already have an account?</div>
            <button 
              @click="showLoginModal = true" 
              class="text-sm font-semibold text-fursa-orange hover:text-orange-600 transition-colors"
            >
              Sign in here →
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Registration Form -->
    <main class="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      
      <!-- User Type Display -->
      <section class="text-center mb-8">
        <div 
          :class="[
            'w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center',
            userType === 'provider' 
              ? 'bg-gradient-to-br from-blue-100 to-blue-200' 
              : 'bg-gradient-to-br from-orange-100 to-orange-200'
          ]"
        >
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
            <span>🔧</span> Service Provider
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
            <span>🎨</span> Creative Talent
          </button>
        </div>
      </section>

      <!-- Registration Form -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form @submit.prevent="submitRegistration">
          
          <!-- Personal Information Section -->
          <fieldset class="mb-8 pb-6 border-b border-gray-100 px-6 pt-6">
            <legend class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span>👤</span>
              <span>Personal Information</span>
            </legend>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Full Name -->
              <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input 
                  id="name"
                  v-model="formData.name" 
                  type="text" 
                  required
                  placeholder="Enter your full name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fursa-orange focus:border-transparent transition-all duration-200 bg-white"
                  :class="{ 'border-red-300': errors.name }"
                  @blur="validateField('name')"
                />
                <div v-if="errors.name" class="text-xs text-red-600 mt-1">
                  {{ errors.name }}
                </div>
              </div>

              <!-- Phone Number -->
              <div class="mb-4">
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input 
                  id="phone"
                  v-model="formData.phone" 
                  type="tel" 
                  required
                  placeholder="+254 712 345 678"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fursa-orange focus:border-transparent transition-all duration-200 bg-white"
                  :class="{ 'border-red-300': errors.phone }"
                  @input="formatPhoneNumber"
                  @blur="validateField('phone')"
                />
                <div v-if="errors.phone" class="text-xs text-red-600 mt-1">
                  {{ errors.phone }}
                </div>
                <div v-else-if="isPhoneValid" class="text-xs text-green-600 mt-1">
                  ✓ Valid Kenyan phone number
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Email Address -->
              <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input 
                  id="email"
                  v-model="formData.email" 
                  type="email" 
                  required
                  placeholder="your.email@gmail.com"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fursa-orange focus:border-transparent transition-all duration-200 bg-white"
                  :class="{ 'border-red-300': errors.email }"
                  @blur="validateField('email')"
                />
                <div v-if="errors.email" class="text-xs text-red-600 mt-1">
                  {{ errors.email }}
                </div>
              </div>

              <!-- Password -->
              <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Create Password *</label>
                <div class="relative">
                  <input 
                    id="password"
                    v-model="formData.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    required
                    placeholder="Create a secure password"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fursa-orange focus:border-transparent transition-all duration-200 bg-white pr-12"
                    :class="{ 'border-red-300': errors.password }"
                    @blur="validateField('password')"
                  />
                  <button 
                    type="button" 
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <span>{{ showPassword ? '👁️' : '👁️‍🗨️' }}</span>
                  </button>
                </div>
                <div v-if="errors.password" class="text-xs text-red-600 mt-1">
                  {{ errors.password }}
                </div>
              </div>
            </div>

            <!-- Location -->
            <div class="mb-4">
              <label for="location" class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input 
                id="location"
                v-model="formData.location" 
                type="text" 
                required
                placeholder="City, County, Country"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fursa-orange focus:border-transparent transition-all duration-200 bg-white"
                :class="{ 'border-red-300': errors.location }"
                @blur="validateField('location')"
              />
              <button 
                type="button" 
                @click="detectLocation" 
                class="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                📍 Use my current location
              </button>
              <div v-if="errors.location" class="text-xs text-red-600 mt-1">
                {{ errors.location }}
              </div>
            </div>
          </fieldset>

          <!-- Professional Information Section -->
          <fieldset class="mb-8 pb-6 border-b border-gray-100 px-6">
            <legend class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span>{{ userType === 'provider' ? '🔧' : '🎨' }}</span>
              <span>{{ userType === 'provider' ? 'Service Information' : 'Creative Information' }}</span>
            </legend>
            
            <!-- Service Type or Skill -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ userType === 'provider' ? 'What service do you provide? *' : 'What is your primary skill? *' }}
              </label>
              
              <select 
                v-if="userType === 'provider'" 
                v-model="formData.serviceType" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fursa-orange focus:border-transparent transition-all duration-200 bg-white"
                :class="{ 'border-red-300': errors.serviceType }"
                @blur="validateField('serviceType')"
              >
                <option value="" disabled>Select your service</option>
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fursa-orange focus:border-transparent transition-all duration-200 bg-white"
                :class="{ 'border-red-300': errors.skill }"
                @blur="validateField('skill')"
              />
              
              <div v-if="errors.serviceType || errors.skill" class="text-xs text-red-600 mt-1">
                {{ errors.serviceType || errors.skill }}
              </div>
            </div>

            <!-- Experience (Required for Providers) -->
            <div v-if="userType === 'provider'" class="mb-4">
              <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
              <select 
                id="experience"
                v-model="formData.experience"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fursa-orange focus:border-transparent transition-all duration-200 bg-white"
                :class="{ 'border-red-300': errors.experience }"
                @blur="validateField('experience')"
              >
                <option value="" disabled>Select your experience level</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
              <div v-if="errors.experience" class="text-xs text-red-600 mt-1">
                {{ errors.experience }}
              </div>
            </div>

            <!-- Category (for Talents) -->
            <div v-if="userType === 'talent'" class="mb-4">
              <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                id="category"
                v-model="formData.category"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fursa-orange focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="" disabled>Select category</option>
                <option value="traditional-crafts">Traditional Crafts</option>
                <option value="modern-art">Modern Art</option>
                <option value="fashion-design">Fashion & Design</option>
                <option value="jewelry">Jewelry & Accessories</option>
                <option value="home-decor">Home Décor</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Availability (for Providers) -->
            <div v-if="userType === 'provider'" class="mb-4">
              <label for="availability" class="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select 
                id="availability"
                v-model="formData.availability" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fursa-orange focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="flexible">Flexible hours</option>
                <option value="weekdays">Weekdays only</option>
                <option value="weekends">Weekends only</option>
                <option value="emergency">Emergency calls</option>
              </select>
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                {{ userType === 'provider' 
                  ? 'Tell customers about your service *' 
                  : 'Tell your creative story *' }}
              </label>
              <textarea 
                id="description"
                v-model="formData.description" 
                required
                rows="4"
                :placeholder="userType === 'provider' 
                  ? 'Describe your expertise, what makes you different, and why customers should choose you...'
                  : 'Share your journey, inspiration, and what makes your work special...'"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fursa-orange focus:border-transparent transition-all duration-200 bg-white resize-none"
                maxlength="500"
                :class="{ 'border-red-300': errors.description }"
                @blur="validateField('description')"
              ></textarea>
              <div class="flex justify-between text-xs mt-1">
                <span class="text-gray-500">
                  {{ userType === 'provider' ? 'Help customers understand your value' : 'Let your personality shine through' }}
                </span>
                <span :class="formData.description.length >= 50 ? 'text-gray-500' : 'text-red-600'">
                  {{ formData.description.length }}/500
                </span>
              </div>
              <div v-if="errors.description" class="text-xs text-red-600 mt-1">
                {{ errors.description }}
              </div>
            </div>
          </fieldset>

          <!-- Terms and Submit Section -->
          <div class="px-6 pb-6">
            <div class="mb-6">
              <label class="flex items-start gap-3 cursor-pointer">
                <input 
                  v-model="formData.agreeToTerms" 
                  type="checkbox" 
                  required
                  class="mt-1 w-4 h-4 text-fursa-orange rounded"
                  :class="{ 'border-red-300': errors.agreeToTerms }"
                  @blur="validateField('agreeToTerms')"
                />
                <span class="text-sm text-gray-700">
                  I agree to FURSA's 
                  <a href="/terms" class="text-fursa-orange hover:text-orange-600 font-medium">Terms of Service</a>
                  and 
                  <a href="/privacy" class="text-fursa-orange hover:text-orange-600 font-medium">Privacy Policy</a>
                </span>
              </label>
              <div v-if="errors.agreeToTerms" class="text-xs text-red-600 mt-1">
                {{ errors.agreeToTerms }}
              </div>
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
                'disabled:opacity-50 disabled:cursor-not-allowed',
                !isSubmitting && 'hover:scale-105 hover:shadow-lg'
              ]"
            >
              <div v-if="isSubmitting" class="flex items-center gap-3">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating your account...</span>
              </div>
              <div v-else class="flex items-center gap-2">
                <span>Join FURSA</span>
                <span class="text-xl">→</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </main>

    <!-- Success Modal -->
    <div 
      v-if="showSuccessModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="p-6 text-center">
          <div 
            :class="[
              'w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl font-bold',
              userType === 'provider' 
                ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600' 
                : 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600'
            ]"
          >
            ✓
          </div>
          
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Welcome to FURSA! 🎉</h3>
          <p class="text-gray-600 mb-6">
            Your account has been created successfully. Let's complete your profile to start 
            {{ userType === 'provider' ? 'getting customers' : 'selling your work' }}.
          </p>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex flex-col gap-3">
          <button 
            @click="goToDashboard"
            :class="[
              'w-full py-3 px-6 rounded-xl font-semibold text-white transition-colors',
              userType === 'provider' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'
            ]"
          >
            Continue to Dashboard
          </button>
          <button 
            @click="closeSuccessModal" 
            class="text-gray-700 hover:text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Explore FURSA First
          </button>
        </div>
      </div>
    </div>

    <!-- Simple Login Modal -->
    <div 
      v-if="showLoginModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Sign In</h3>
        <p class="text-gray-600 mb-4">Login functionality will be implemented here.</p>
        <button 
          @click="showLoginModal = false"
          class="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

console.log('🎨 UnifiedRegistration loading - NO ASYNC IMPORTS')

// Composables
const router = useRouter()
const route = useRoute()

// Import your actual auth store
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

// Determine user type from route
const getUserTypeFromRoute = () => {
  console.log('Determining user type from route:', route.path)
  
  if (route.path.includes('join-as-provider') || route.path.includes('provider')) {
    return 'provider'
  } else if (route.path.includes('join-as-talent') || route.path.includes('talent')) {
    return 'talent'
  }
  
  // Fallback to localStorage or default
  const stored = localStorage.getItem('preferredUserType')
  console.log('Using stored user type:', stored)
  return stored || 'talent'
}

// State
const userType = ref(getUserTypeFromRoute())
const showPassword = ref(false)
const isSubmitting = ref(false)
const error = ref('')
const showSuccessModal = ref(false)
const showLoginModal = ref(false)
const errors = ref({})

console.log('User type determined:', userType.value)

// Form data
const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  location: '',
  serviceType: '',
  skill: '',
  experience: '', // Required for providers
  category: '',
  availability: 'flexible',
  description: '',
  agreeToTerms: false
})

// Computed properties
const isFormValid = computed(() => {
  const requiredFields = ['name', 'email', 'phone', 'password', 'location', 'description', 'agreeToTerms']
  
  if (userType.value === 'provider') {
    requiredFields.push('serviceType', 'experience') // Experience is required for providers
  } else {
    requiredFields.push('skill')
  }
  
  const allFieldsFilled = requiredFields.every(field => {
    const value = formData.value[field]
    return value && value.toString().trim() !== ''
  })
  
  const noErrors = Object.keys(errors.value).length === 0
  
  return allFieldsFilled && noErrors
})

const isPhoneValid = computed(() => {
  const phone = formData.value.phone.replace(/\s/g, '')
  return /^(\+254|254|0)?[17]\d{8}$/.test(phone)
})

// Methods
function switchUserType(type) {
  console.log('Switching user type to:', type)
  userType.value = type
  localStorage.setItem('preferredUserType', type)
  
  // Clear type-specific errors
  if (type === 'provider') {
    delete errors.value.skill
  } else {
    delete errors.value.serviceType
  }
  
  const newPath = type === 'provider' ? '/app/join-as-provider' : '/app/join-as-talent'
  router.replace(newPath)
}

function validateField(fieldName) {
  const value = formData.value[fieldName]
  
  // Clear previous error
  delete errors.value[fieldName]
  
  // Required field validation
  if (!value || value.toString().trim() === '') {
    if (['name', 'email', 'phone', 'password', 'location', 'description'].includes(fieldName)) {
      errors.value[fieldName] = 'This field is required'
      return
    }
    if (fieldName === 'serviceType' && userType.value === 'provider') {
      errors.value[fieldName] = 'Please select your service type'
      return
    }
    if (fieldName === 'experience' && userType.value === 'provider') {
      errors.value[fieldName] = 'Please select your experience level'
      return
    }
    if (fieldName === 'skill' && userType.value === 'talent') {
      errors.value[fieldName] = 'Please enter your primary skill'
      return
    }
    if (fieldName === 'agreeToTerms') {
      errors.value[fieldName] = 'You must agree to the terms and conditions'
      return
    }
  }
  
  // Specific validations
  if (fieldName === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errors.value[fieldName] = 'Please enter a valid email address'
  }
  
  if (fieldName === 'phone' && value && !isPhoneValid.value) {
    errors.value[fieldName] = 'Please enter a valid Kenyan phone number'
  }
  
  if (fieldName === 'password' && value && value.length < 8) {
    errors.value[fieldName] = 'Password must be at least 8 characters'
  }
  
  if (fieldName === 'description' && value && value.length < 50) {
    errors.value[fieldName] = 'Description must be at least 50 characters'
  }
}

function formatPhoneNumber(event) {
  let value = event.target.value.replace(/\D/g, '')
  
  if (value.startsWith('254')) {
    value = '+254 ' + value.slice(3).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
  } else if (value.startsWith('07') || value.startsWith('01')) {
    value = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  
  formData.value.phone = value
  validateField('phone')
}

function detectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        formData.value.location = 'Nairobi, Kenya' // Demo location
        delete errors.value.location
      },
      (error) => {
        console.warn('Location detection failed:', error)
        formData.value.location = 'Nairobi, Kenya' // Fallback
        delete errors.value.location
      }
    )
  } else {
    formData.value.location = 'Nairobi, Kenya' // Fallback
    delete errors.value.location
  }
}

async function submitRegistration() {
  console.log('Submitting registration...')
  
  // Validate all fields
  const fieldsToValidate = ['name', 'email', 'phone', 'password', 'location', 'description', 'agreeToTerms']
  if (userType.value === 'provider') {
    fieldsToValidate.push('serviceType', 'experience') // Experience is required for providers
  } else {
    fieldsToValidate.push('skill')
  }
  
  fieldsToValidate.forEach(validateField)
  
  if (!isFormValid.value) {
    error.value = 'Please fill all required fields correctly'
    return
  }
  
  isSubmitting.value = true
  error.value = ''
  
  try {
    // Format phone number consistently before submission
    const formattedPhone = formData.value.phone.startsWith('0') 
      ? `+254${formData.value.phone.substring(1)}`.replace(/\s/g, '')
      : formData.value.phone.replace(/\s/g, '')
    
    const registrationData = {
      ...formData.value,
      phone: formattedPhone
    }
    
    // Remove empty optional fields to avoid validation issues
    if (!registrationData.category) delete registrationData.category
    if (!registrationData.availability) registrationData.availability = 'flexible'
    
    console.log('Registering with data:', registrationData)
    
    // Use your actual auth store register method
    const result = await authStore.register(registrationData, userType.value)
    
    console.log('Registration result:', result)
    
    if (result.success) {
      console.log('Registration successful!')
      localStorage.setItem('registrationComplete', 'true')
      localStorage.setItem('userType', userType.value)
      showSuccessModal.value = true
      
      // Track registration in analytics if available
      if (window.analytics) {
        window.analytics.track('Registration Completed', {
          userType: userType.value,
          email: formData.value.email,
          location: formData.value.location
        })
      }
    } else {
      throw new Error(result.message || 'Registration failed')
    }
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.message || 'Registration failed. Please try again.'
    
    // Track registration error in analytics if available
    if (window.analytics) {
      window.analytics.track('Registration Error', {
        error: err.message,
        userType: userType.value,
        email: formData.value.email
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

function goToDashboard() {
  showSuccessModal.value = false
  const dashboardPath = userType.value === 'provider' ? '/app/provider-dashboard' : '/app/talent-dashboard'
  console.log('Navigating to dashboard:', dashboardPath)
  router.push(dashboardPath)
}

function closeSuccessModal() {
  showSuccessModal.value = false
  router.push('/app/explore')
}

// Initialize
onMounted(() => {
  console.log('✅ UnifiedRegistration mounted successfully!')
  console.log('Route:', route.path)
  console.log('User type:', userType.value)
  
  // Update localStorage
  localStorage.setItem('preferredUserType', userType.value)
})
</script>

<style scoped>
/* Cultural pattern styling */
.cultural-pattern {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 1.5rem;
}

.pattern-bar-1 {
  width: 100%;
  height: 0.25rem;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 0.25rem;
}

.pattern-bar-2 {
  width: 75%;
  height: 0.25rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 0.25rem;
  margin-left: auto;
}

.pattern-bar-3 {
  width: 50%;
  height: 0.25rem;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 0.25rem;
}

.pattern-bar-4 {
  width: 25%;
  height: 0.25rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 0.25rem;
  margin-left: auto;
}

.gradient-text {
  background: linear-gradient(135deg, #ff6b35, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

/* Color utilities */
.text-fursa-orange {
  color: #ff6b35;
}

.text-fursa-blue {
  color: #2563eb;
}

.text-red-600 {
  color: #dc2626;
}

.text-green-600 {
  color: #16a34a;
}

.border-red-300 {
  border-color: #fca5a5;
}

.hover\:text-orange-600:hover {
  color: #ea580c;
}

.hover\:text-gray-800:hover {
  color: #1f2937;
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

/* Transition utilities */
.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}

/* Button states */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Focus styles for accessibility */
input:focus,
textarea:focus,
select:focus {
  outline: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>