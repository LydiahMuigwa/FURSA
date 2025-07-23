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
              @click="goToLogin" 
              class="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg px-2 py-1"
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
            'w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300',
            userType === 'provider' 
              ? 'bg-gradient-to-br from-blue-100 to-blue-200' 
              : 'bg-gradient-to-br from-orange-100 to-orange-200'
          ]"
        >
          <span class="text-4xl" role="img" :aria-label="userType === 'provider' ? 'Service Provider' : 'Creative Talent'">
            {{ userType === 'provider' ? '🔧' : '🎨' }}
          </span>
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
        <div class="inline-flex bg-gray-100 rounded-xl p-1" role="tablist" aria-label="User type selection">
          <button 
            @click="switchUserType('provider')" 
            :class="[
              'px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
              userType === 'provider' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
            role="tab"
            :aria-selected="userType === 'provider'"
            :tabindex="userType === 'provider' ? 0 : -1"
          >
            <span role="img" aria-label="Service Provider">🔧</span> Service Provider
          </button>
          <button 
            @click="switchUserType('talent')" 
            :class="[
              'px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
              userType === 'talent' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
            role="tab"
            :aria-selected="userType === 'talent'"
            :tabindex="userType === 'talent' ? 0 : -1"
          >
            <span role="img" aria-label="Creative Talent">🎨</span> Creative Talent
          </button>
        </div>
      </section>

      <!-- Registration Form -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form @submit.prevent="submitRegistration" novalidate>
          
          <!-- Personal Information Section -->
          <fieldset class="mb-8 pb-6 border-b border-gray-100 px-6 pt-6">
            <legend class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span role="img" aria-label="Person">👤</span>
              <span>Personal Information</span>
            </legend>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Full Name -->
              <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input 
                  id="name"
                  v-model.trim="formData.name" 
                  type="text" 
                  required
                  placeholder="Enter your full name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                  :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.name }"
                  :aria-invalid="!!errors.name"
                  :aria-describedby="errors.name ? 'name-error' : undefined"
                  @blur="validateField('name')"
                  @input="clearFieldError('name')"
                />
                <div v-if="errors.name" id="name-error" class="text-xs text-red-600 mt-1" role="alert">
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                  :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.phone }"
                  :aria-invalid="!!errors.phone"
                  :aria-describedby="errors.phone ? 'phone-error' : isPhoneValid ? 'phone-success' : undefined"
                  @input="handlePhoneInput"
                  @blur="validateField('phone')"
                />
                <div v-if="errors.phone" id="phone-error" class="text-xs text-red-600 mt-1" role="alert">
                  {{ errors.phone }}
                </div>
                <div v-else-if="isPhoneValid && formData.phone" id="phone-success" class="text-xs text-green-600 mt-1">
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
                  v-model.trim="formData.email" 
                  type="email" 
                  required
                  placeholder="your.email@gmail.com"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                  :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.email }"
                  :aria-invalid="!!errors.email"
                  :aria-describedby="errors.email ? 'email-error' : undefined"
                  autocomplete="email"
                  @blur="validateField('email')"
                  @input="clearFieldError('email')"
                />
                <div v-if="errors.email" id="email-error" class="text-xs text-red-600 mt-1" role="alert">
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
                    class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg transition-all duration-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.password }"
                    :aria-invalid="!!errors.password"
                    :aria-describedby="errors.password ? 'password-error' : 'password-help'"
                    autocomplete="new-password"
                    @blur="validateField('password')"
                    @input="clearFieldError('password')"
                  />
                  <button 
                    type="button" 
                    @click="togglePasswordVisibility"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    tabindex="0"
                  >
                    <span role="img" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                      {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                    </span>
                  </button>
                </div>
                <div v-if="errors.password" id="password-error" class="text-xs text-red-600 mt-1" role="alert">
                  {{ errors.password }}
                </div>
                <div v-else id="password-help" class="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </div>
              </div>
            </div>

            <!-- Location -->
            <div class="mb-4">
              <label for="location" class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input 
                id="location"
                v-model.trim="formData.location" 
                type="text" 
                required
                placeholder="City, County, Country"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.location }"
                :aria-invalid="!!errors.location"
                :aria-describedby="errors.location ? 'location-error' : undefined"
                @blur="validateField('location')"
                @input="clearFieldError('location')"
              />
              <button 
                type="button" 
                @click="detectLocation" 
                class="mt-1 text-xs text-blue-600 hover:text-blue-800 focus:outline-none focus:underline transition-colors"
                :disabled="isDetectingLocation"
              >
                📍 {{ isDetectingLocation ? 'Detecting...' : 'Use my current location' }}
              </button>
              <div v-if="errors.location" id="location-error" class="text-xs text-red-600 mt-1" role="alert">
                {{ errors.location }}
              </div>
            </div>
          </fieldset>

          <!-- Professional Information Section -->
          <fieldset class="mb-8 pb-6 border-b border-gray-100 px-6">
            <legend class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span role="img" :aria-label="userType === 'provider' ? 'Service' : 'Creative'">
                {{ userType === 'provider' ? '🔧' : '🎨' }}
              </span>
              <span>{{ userType === 'provider' ? 'Service Information' : 'Creative Information' }}</span>
            </legend>
            
            <!-- Service Type or Skill -->
            <div class="mb-4">
              <label 
                :for="userType === 'provider' ? 'serviceType' : 'skill'" 
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                {{ userType === 'provider' ? 'What service do you provide? *' : 'What is your primary skill? *' }}
              </label>
              
              <select 
                v-if="userType === 'provider'" 
                id="serviceType"
                v-model="formData.serviceType" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.serviceType }"
                :aria-invalid="!!errors.serviceType"
                :aria-describedby="errors.serviceType ? 'serviceType-error' : undefined"
                @change="clearFieldError('serviceType')"
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
                id="skill"
                v-model.trim="formData.skill" 
                type="text" 
                required
                placeholder="e.g., Beadwork, Wood Carving, Fashion Design"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.skill }"
                :aria-invalid="!!errors.skill"
                :aria-describedby="errors.skill ? 'skill-error' : undefined"
                @blur="validateField('skill')"
                @input="clearFieldError('skill')"
              />
              
              <div v-if="errors.serviceType" id="serviceType-error" class="text-xs text-red-600 mt-1" role="alert">
                {{ errors.serviceType }}
              </div>
              <div v-if="errors.skill" id="skill-error" class="text-xs text-red-600 mt-1" role="alert">
                {{ errors.skill }}
              </div>
            </div>

            <!-- Experience (Required for Providers) -->
            <div v-if="userType === 'provider'" class="mb-4">
              <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
              <select 
                id="experience"
                v-model="formData.experience"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.experience }"
                :aria-invalid="!!errors.experience"
                :aria-describedby="errors.experience ? 'experience-error' : undefined"
                @change="clearFieldError('experience')"
                @blur="validateField('experience')"
              >
                <option value="" disabled>Select your experience level</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
              <div v-if="errors.experience" id="experience-error" class="text-xs text-red-600 mt-1" role="alert">
                {{ errors.experience }}
              </div>
            </div>

            <!-- Category (for Talents) -->
            <div v-if="userType === 'talent'" class="mb-4">
              <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                id="category"
                v-model="formData.category"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
              >
                <option value="">Select category (optional)</option>
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
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
                v-model.trim="formData.description" 
                required
                rows="4"
                :placeholder="userType === 'provider' 
                  ? 'Describe your expertise, what makes you different, and why customers should choose you...'
                  : 'Share your journey, inspiration, and what makes your work special...'"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none resize-none"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.description }"
                :aria-invalid="!!errors.description"
                :aria-describedby="errors.description ? 'description-error' : 'description-help'"
                maxlength="500"
                @blur="validateField('description')"
                @input="clearFieldError('description')"
              ></textarea>
              <div class="flex justify-between text-xs mt-1">
                <span id="description-help" class="text-gray-500">
                  {{ userType === 'provider' ? 'Help customers understand your value' : 'Let your personality shine through' }}
                </span>
                <span :class="descriptionCharacterCount >= 50 ? 'text-gray-500' : 'text-red-600'">
                  {{ descriptionCharacterCount }}/500
                </span>
              </div>
              <div v-if="errors.description" id="description-error" class="text-xs text-red-600 mt-1" role="alert">
                {{ errors.description }}
              </div>
            </div>
          </fieldset>

          <!-- Terms and Submit Section -->
          <div class="px-6 pb-6">
            <div class="mb-6">
              <label class="flex items-start gap-3 cursor-pointer">
                <input 
                  id="agreeToTerms"
                  v-model="formData.agreeToTerms" 
                  type="checkbox" 
                  required
                  class="mt-1 w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 focus:ring-2"
                  :class="{ 'border-red-300': errors.agreeToTerms }"
                  :aria-invalid="!!errors.agreeToTerms"
                  :aria-describedby="errors.agreeToTerms ? 'terms-error' : undefined"
                  @change="clearFieldError('agreeToTerms')"
                  @blur="validateField('agreeToTerms')"
                />
                <span class="text-sm text-gray-700">
                  I agree to FURSA's 
                  <a href="/terms" class="text-orange-600 hover:text-orange-700 font-medium focus:outline-none focus:underline" target="_blank" rel="noopener">Terms of Service</a>
                  and 
                  <a href="/privacy" class="text-orange-600 hover:text-orange-700 font-medium focus:outline-none focus:underline" target="_blank" rel="noopener">Privacy Policy</a>
                </span>
              </label>
              <div v-if="errors.agreeToTerms" id="terms-error" class="text-xs text-red-600 mt-1 ml-7" role="alert">
                {{ errors.agreeToTerms }}
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
              <span role="img" aria-label="Warning">⚠️</span>
              <span class="text-sm">{{ error }}</span>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="!isFormValid || isSubmitting"
              :class="[
                'w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 focus:outline-none focus:ring-4',
                userType === 'provider' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-300' 
                  : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white focus:ring-orange-300',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                !isSubmitting && 'hover:scale-105 hover:shadow-lg'
              ]"
            >
              <div v-if="isSubmitting" class="flex items-center gap-3">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                <span>Creating your account...</span>
              </div>
              <div v-else class="flex items-center gap-2">
                <span>Join FURSA</span>
                <span class="text-xl" aria-hidden="true">→</span>
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
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
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
            aria-hidden="true"
          >
            ✓
          </div>
          
          <h3 id="success-title" class="text-2xl font-bold text-gray-900 mb-2">Welcome to FURSA! 🎉</h3>
          <p class="text-gray-600 mb-6">
            Your account has been created successfully. Let's complete your profile to start 
            {{ userType === 'provider' ? 'getting customers' : 'selling your work' }}.
          </p>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex flex-col gap-3">
          <button 
            @click="goToDashboard"
            :class="[
              'w-full py-3 px-6 rounded-xl font-semibold text-white transition-colors focus:outline-none focus:ring-4',
              userType === 'provider' 
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300' 
                : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-300'
            ]"
          >
            Continue to Dashboard
          </button>
          <button 
            @click="closeSuccessModal" 
            class="text-gray-700 hover:text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Explore FURSA First
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Composables
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Reactive state
const userType = ref('provider')
const showPassword = ref(false)
const isSubmitting = ref(false)
const isDetectingLocation = ref(false)
const error = ref('')
const showSuccessModal = ref(false)
const errors = ref({})

// Form data with default values
const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  location: '',
  serviceType: '',
  skill: '',
  experience: '',
  category: '',
  availability: 'flexible',
  description: '',
  agreeToTerms: false
})

// Computed properties
const isFormValid = computed(() => {
  const requiredFields = ['name', 'email', 'phone', 'password', 'location', 'description', 'agreeToTerms']
  
  if (userType.value === 'provider') {
    requiredFields.push('serviceType', 'experience')
  } else {
    requiredFields.push('skill')
  }
  
  const allFieldsFilled = requiredFields.every(field => {
    const value = formData.value[field]
    return value && value.toString().trim() !== ''
  })
  
  const noErrors = Object.keys(errors.value).length === 0
  const hasMinimumDescription = formData.value.description.length >= 50
  
  return allFieldsFilled && noErrors && hasMinimumDescription
})

const isPhoneValid = computed(() => {
  if (!formData.value.phone) return false
  const phone = formData.value.phone.replace(/\s/g, '')
  return /^(\+254|254|0)?[17]\d{8}$/.test(phone)
})

const descriptionCharacterCount = computed(() => {
  return formData.value.description.length
})

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password) => {
  return password && password.length >= 8
}

const validateField = (fieldName) => {
  const value = formData.value[fieldName]
  
  // Clear previous error
  delete errors.value[fieldName]
  
  // Required field validation
  switch (fieldName) {
    case 'name':
      if (!value || value.trim().length < 2) {
        errors.value[fieldName] = 'Full name must be at least 2 characters'
      }
      break
      
    case 'email':
      if (!value) {
        errors.value[fieldName] = 'Email is required'
      } else if (!validateEmail(value)) {
        errors.value[fieldName] = 'Please enter a valid email address'
      }
      break
      
    case 'phone':
      if (!value) {
        errors.value[fieldName] = 'Phone number is required'
      } else if (!isPhoneValid.value) {
        errors.value[fieldName] = 'Please enter a valid Kenyan phone number'
      }
      break
      
    case 'password':
      if (!value) {
        errors.value[fieldName] = 'Password is required'
      } else if (!validatePassword(value)) {
        errors.value[fieldName] = 'Password must be at least 8 characters long'
      }
      break
      
    case 'location':
      if (!value || value.trim().length < 2) {
        errors.value[fieldName] = 'Location is required'
      }
      break
      
    case 'serviceType':
      if (userType.value === 'provider' && !value) {
        errors.value[fieldName] = 'Please select your service type'
      }
      break
      
    case 'skill':
      if (userType.value === 'talent' && (!value || value.trim().length < 2)) {
        errors.value[fieldName] = 'Please enter your primary skill'
      }
      break
      
    case 'experience':
      if (userType.value === 'provider' && !value) {
        errors.value[fieldName] = 'Please select your experience level'
      }
      break
      
    case 'description':
      if (!value) {
        errors.value[fieldName] = 'Description is required'
      } else if (value.length < 50) {
        errors.value[fieldName] = 'Description must be at least 50 characters'
      }
      break
      
    case 'agreeToTerms':
      if (!value) {
        errors.value[fieldName] = 'You must agree to the terms and conditions'
      }
      break
  }
}

// Helper functions
const clearFieldError = (fieldName) => {
  delete errors.value[fieldName]
}

const getUserTypeFromRoute = () => {
  if (route.path.includes('join-as-provider') || route.path.includes('provider')) {
    return 'provider'
  } else if (route.path.includes('join-as-talent') || route.path.includes('talent')) {
    return 'talent'
  }
  
  return localStorage.getItem('preferredUserType') || 'provider'
}

// Event handlers
const goToLogin = () => {
  router.push('/app/login')
}

const switchUserType = (type) => {
  console.log('🔄 Switching user type to:', type)
  
  userType.value = type
  localStorage.setItem('preferredUserType', type)
  
  // Clear type-specific errors and form data
  if (type === 'provider') {
    delete errors.value.skill
    delete errors.value.category
    formData.value.skill = ''
    formData.value.category = ''
  } else {
    delete errors.value.serviceType
    delete errors.value.experience
    formData.value.serviceType = ''
    formData.value.experience = ''
  }
  
  // Update route to match user type
  const newPath = type === 'provider' ? '/app/join-as-provider' : '/app/upload'
  
  if (route.path !== newPath) {
    router.replace(newPath).catch(err => {
      console.warn('Route update failed:', err)
    })
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handlePhoneInput = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  
  // Format phone number as user types
  if (value.startsWith('254')) {
    value = '+254 ' + value.slice(3).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
  } else if (value.startsWith('07') || value.startsWith('01')) {
    value = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
  } else if (value.startsWith('7') || value.startsWith('1')) {
    value = '+254 ' + value.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  
  formData.value.phone = value
  clearFieldError('phone')
}

const detectLocation = async () => {
  if (!navigator.geolocation) {
    formData.value.location = 'Nairobi, Kenya'
    return
  }

  isDetectingLocation.value = true
  
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: false
      })
    })
    
    // In a real app, you'd reverse geocode these coordinates
    // For now, we'll use a default location
    formData.value.location = 'Nairobi, Kenya'
    clearFieldError('location')
    
  } catch (error) {
    console.warn('Location detection failed:', error)
    formData.value.location = 'Nairobi, Kenya'
    clearFieldError('location')
  } finally {
    isDetectingLocation.value = false
  }
}

const submitRegistration = async () => {
  console.log('📝 Starting registration process...')
  
  // Validate all required fields
  const fieldsToValidate = ['name', 'email', 'phone', 'password', 'location', 'description', 'agreeToTerms']
  if (userType.value === 'provider') {
    fieldsToValidate.push('serviceType', 'experience')
  } else {
    fieldsToValidate.push('skill')
  }
  
  // Run validation
  fieldsToValidate.forEach(validateField)
  
  if (!isFormValid.value) {
    error.value = 'Please fill all required fields correctly'
    // Scroll to first error
    const firstErrorElement = document.querySelector('.border-red-300')
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      firstErrorElement.focus()
    }
    return
  }
  
  isSubmitting.value = true
  error.value = ''
  
  try {
    // Format phone number consistently
    const formattedPhone = formData.value.phone.startsWith('0') 
      ? `+254${formData.value.phone.substring(1)}`.replace(/\s/g, '')
      : formData.value.phone.replace(/\s/g, '')
    
    const registrationData = {
      ...formData.value,
      phone: formattedPhone,
      userType: userType.value,
      // Clean up empty optional fields
      category: formData.value.category || undefined,
      availability: formData.value.availability || 'flexible'
    }
    
    console.log('🚀 Submitting registration:', {
      email: registrationData.email,
      userType: userType.value,
      name: registrationData.name
    })
    
    // Call auth store register method
    const result = await authStore.register(registrationData, userType.value)
    
    console.log('✅ Registration successful:', result)
    
    // Show success modal
    showSuccessModal.value = true
    
    // Track successful registration
    if (typeof gtag !== 'undefined') {
      gtag('event', 'sign_up', {
        method: 'email',
        user_type: userType.value
      })
    }
    
  } catch (err) {
    console.error('❌ Registration error:', err)
    
    // Handle specific error cases
    if (err.message.includes('email')) {
      error.value = 'This email is already registered. Please try logging in instead.'
    } else if (err.message.includes('phone')) {
      error.value = 'This phone number is already registered. Please try logging in instead.'
    } else if (err.message.includes('network') || err.message.includes('fetch')) {
      error.value = 'Network error. Please check your connection and try again.'
    } else {
      error.value = err.message || 'Registration failed. Please try again.'
    }
    
    // Scroll to error message
    const errorElement = document.querySelector('[role="alert"]')
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    
  } finally {
    isSubmitting.value = false
  }
}

const goToDashboard = async () => {
  console.log('🧭 Navigating to dashboard for user type:', userType.value)
  
  showSuccessModal.value = false
  
  try {
    if (!authStore.isAuthenticated) {
      console.error('❌ Auth state not set properly')
      error.value = 'Authentication error. Please try again.'
      return
    }
    
    const dashboardRoute = authStore.isProvider 
      ? '/app/provider-dashboard' 
      : '/app/talent-dashboard'
    
    console.log('📍 Navigating to:', dashboardRoute)
    
    await router.push({
      path: dashboardRoute,
      query: { welcome: 'true' }
    })
    
  } catch (error) {
    console.error('❌ Navigation failed:', error)
    // Fallback navigation
    const fallbackRoute = userType.value === 'provider' 
      ? '/app/provider-dashboard' 
      : '/app/talent-dashboard'
    window.location.href = fallbackRoute
  }
}

const closeSuccessModal = () => {
  console.log('🚪 Closing success modal')
  showSuccessModal.value = false
  router.push('/app').catch(() => {
    // Handle navigation error silently
  })
}

// Watchers
watch(() => route.path, () => {
  userType.value = getUserTypeFromRoute()
}, { immediate: true })

// Lifecycle hooks
onMounted(async () => {
  console.log('✅ UnifiedRegistration mounted')
  
  // Initialize user type from route
  userType.value = getUserTypeFromRoute()
  localStorage.setItem('preferredUserType', userType.value)
  
  // Check if user is already authenticated
  if (authStore.isAuthenticated) {
    console.log('⚠️ User already authenticated, redirecting')
    const dashboardRoute = authStore.isProvider 
      ? '/app/provider-dashboard' 
      : '/app/talent-dashboard'
    await router.push(dashboardRoute)
    return
  }
  
  // Initialize auth store
  await authStore.initializeAuth()
  
  // Focus first input for better UX
  const firstInput = document.querySelector('input[type="text"]')
  if (firstInput) {
    firstInput.focus()
  }
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

/* Animation for loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Enhanced accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast support */
@media (prefers-contrast: high) {
  input, select, textarea {
    border-width: 2px;
  }
  
  input:focus, select:focus, textarea:focus {
    border-width: 3px;
  }
}

/* Focus styles for better accessibility */
input:focus, select:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:not(:disabled):active {
  transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .cultural-pattern {
    width: 1.25rem;
  }
  
  .pattern-bar-1,
  .pattern-bar-2,
  .pattern-bar-3,
  .pattern-bar-4 {
    height: 0.1875rem;
  }
}

/* Print styles */
@media print {
  .bg-gradient-to-br,
  .shadow-sm,
  .shadow-xl {
    background: white !important;
    box-shadow: none !important;
  }
}
</style>