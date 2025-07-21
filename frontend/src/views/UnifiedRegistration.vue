<template>
  <!-- FURSA Unified Registration - Pure CSS Version -->
  <div class="registration-page">
    
    <!-- FURSA Header -->
    <header class="header">
      <div class="header-content">
        <router-link to="/app" class="logo-link">
          <!-- Cultural Pattern Logo -->
          <div class="cultural-pattern">
            <div class="pattern-bar-1"></div>
            <div class="pattern-bar-2"></div>
            <div class="pattern-bar-3"></div>
            <div class="pattern-bar-4"></div>
          </div>
          <div class="logo-text">FURSA</div>
        </router-link>
        
        <div class="header-right">
          <div class="header-subtitle">Already have an account?</div>
          <button @click="showLoginModal = true" class="signin-link">
            Sign in here →
          </button>
        </div>
      </div>
    </header>

    <!-- Registration Form -->
    <main class="main-content">
      
      <!-- User Type Display -->
      <div class="user-type-section">
        <div class="user-type-icon" :class="userType === 'provider' ? 'icon-blue' : 'icon-orange'">
          <span class="user-type-emoji">{{ userType === 'provider' ? '🔧' : '🎨' }}</span>
        </div>
        
        <h1 class="main-title">
          {{ userType === 'provider' ? 'Join as Service Provider' : 'Join as Creative Talent' }}
        </h1>
        <p class="main-subtitle">
          {{ userType === 'provider' 
            ? 'Start getting customers and growing your business' 
            : 'Share your talent and sell to the world' }}
        </p>
        
        <!-- User Type Switcher -->
        <div class="type-switcher">
          <button @click="switchUserType('provider')" 
                  :class="['type-button', userType === 'provider' ? 'type-active-blue' : 'type-inactive']">
            🔧 Service Provider
          </button>
          <button @click="switchUserType('talent')" 
                  :class="['type-button', userType === 'talent' ? 'type-active-orange' : 'type-inactive']">
            🎨 Creative Talent
          </button>
        </div>
      </div>

      <!-- Registration Form -->
      <div class="form-card">
        <form @submit.prevent="submitRegistration" class="registration-form">
          
          <!-- Personal Information -->
          <div class="form-section">
            <h3 class="section-title">👤 Personal Information</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input v-model="formData.name" 
                       type="text" 
                       required
                       placeholder="Enter your full name"
                       class="form-input">
              </div>

              <div class="form-group">
                <label class="form-label">Phone Number *</label>
                <input v-model="formData.phone" 
                       type="tel" 
                       required
                       placeholder="+254 712 345 678"
                       class="form-input"
                       @input="formatPhoneNumber">
                <div v-if="isPhoneValid" class="validation-success">
                  ✓ Valid Kenyan phone number
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input v-model="formData.email" 
                       type="email" 
                       required
                       placeholder="your.email@gmail.com"
                       class="form-input"
                       @blur="checkEmailSuggestion">
                <div v-if="emailSuggestion" class="email-suggestion">
                  <button type="button" 
                          @click="acceptEmailSuggestion"
                          class="suggestion-link">
                    Did you mean: {{ emailSuggestion }}?
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Create Password *</label>
                <div class="password-container">
                  <input v-model="formData.password" 
                         :type="showPassword ? 'text' : 'password'" 
                         required
                         placeholder="Create a secure password"
                         class="form-input password-input"
                         @input="checkPasswordStrength">
                  <button type="button" 
                          @click="showPassword = !showPassword"
                          class="password-toggle">
                    {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                
                <!-- Password Strength -->
                <div class="password-strength">
                  <div class="strength-bars">
                    <div v-for="i in 4" :key="i" 
                         :class="['strength-bar', getStrengthBarClass(i)]">
                    </div>
                  </div>
                  <div class="strength-text">{{ passwordStrengthText }}</div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Location *</label>
              <input v-model="formData.location" 
                     type="text" 
                     required
                     placeholder="City, County, Country"
                     class="form-input">
              <button type="button" @click="detectLocation" class="location-detect">
                📍 Use my current location
              </button>
            </div>
          </div>

          <!-- Professional Information -->
          <div class="form-section">
            <h3 class="section-title">
              {{ userType === 'provider' ? '🔧 Service Information' : '🎨 Creative Information' }}
            </h3>
            
            <div class="form-group">
              <label class="form-label">
                {{ userType === 'provider' ? 'What service do you provide? *' : 'What is your primary skill? *' }}
              </label>
              
              <select v-if="userType === 'provider'" 
                      v-model="formData.serviceType" 
                      required
                      class="form-input">
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
              
              <input v-else
                     v-model="formData.skill" 
                     type="text" 
                     required
                     placeholder="e.g., Beadwork, Wood Carving, Fashion Design"
                     class="form-input">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  {{ userType === 'provider' ? 'Years of Experience' : 'Category' }}
                </label>
                
                <select v-if="userType === 'provider'" 
                        v-model="formData.experience"
                        class="form-input">
                  <option value="">Select experience</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
                
                <select v-else 
                        v-model="formData.category"
                        class="form-input">
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
              <textarea v-model="formData.description" 
                        required
                        rows="4"
                        :placeholder="userType === 'provider' 
                          ? 'Describe your expertise, what makes you different, and why customers should choose you...'
                          : 'Share your journey, inspiration, and what makes your work special...'"
                        class="form-input form-textarea"></textarea>
              <div class="character-count">
                <span>{{ userType === 'provider' ? 'Help customers understand your value' : 'Let your personality shine through' }}</span>
                <span>{{ formData.description.length }}/500</span>
              </div>
            </div>
          </div>

          <!-- Terms and Submit -->
          <div class="form-section">
            <div class="terms-section">
              <label class="checkbox-label">
                <input v-model="formData.agreeToTerms" 
                       type="checkbox" 
                       required
                       class="checkbox-input">
                <span class="checkbox-text">
                  I agree to FURSA's 
                  <a href="/terms" class="link">Terms of Service</a>
                  and 
                  <a href="/privacy" class="link">Privacy Policy</a>
                </span>
              </label>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="error-message">
              <span class="error-icon">⚠️</span>
              <span>{{ error }}</span>
            </div>

            <!-- Submit Button -->
            <button type="submit" 
                    :disabled="!isFormValid || isSubmitting"
                    :class="['submit-button', userType === 'provider' ? 'submit-blue' : 'submit-orange']">
              <div v-if="isSubmitting" class="submit-loading">
                <div class="spinner"></div>
                Creating your account...
              </div>
              <div v-else class="submit-normal">
                <span>Join FURSA</span>
                <span class="submit-arrow">→</span>
              </div>
            </button>
          </div>
        </form>
      </div>

      <!-- Next Steps Preview -->
      <div class="next-steps">
        <h4 class="next-steps-title">🎯 What happens next?</h4>
        <div class="steps-grid">
          <div class="step-item">
            <div class="step-number step-green">1</div>
            <div class="step-content">
              <div class="step-title">Account Created</div>
              <div class="step-desc">You'll be signed in automatically</div>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number step-blue">2</div>
            <div class="step-content">
              <div class="step-title">Complete Your Profile</div>
              <div class="step-desc">Add photos and showcase your work</div>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number step-orange">3</div>
            <div class="step-content">
              <div class="step-title">Start Earning</div>
              <div class="step-desc">
                {{ userType === 'provider' ? 'Get quote requests' : 'Sell your creations' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content" @click.stop>
        <div :class="['success-icon', userType === 'provider' ? 'success-blue' : 'success-orange']">
          ✓
        </div>
        
        <h3 class="modal-title">Welcome to FURSA! 🎉</h3>
        <p class="modal-text">
          Your account has been created successfully. Let's complete your profile to start 
          {{ userType === 'provider' ? 'getting customers' : 'selling your work' }}.
        </p>
        
        <div class="modal-actions">
          <button @click="goToDashboard"
                  :class="['modal-button-primary', userType === 'provider' ? 'button-blue' : 'button-orange']">
            Continue to Dashboard
          </button>
          <button @click="closeSuccessModal" class="modal-button-secondary">
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
    if (passwordStrength.value === 1) return 'strength-weak'
    if (passwordStrength.value === 2) return 'strength-fair'
    if (passwordStrength.value === 3) return 'strength-good'
    return 'strength-strong'
  }
  return 'strength-empty'
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

<style scoped>
/* Base styles */
.registration-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #eff6ff 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.header {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #f3f4f6;
}

.header-content {
  max-width: 1024px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s;
}

.logo-link:hover {
  opacity: 0.8;
}

.cultural-pattern {
  position: relative;
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.pattern-bar-1 { 
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  height: 8px; 
  border-radius: 4px; 
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.pattern-bar-2 { 
  background: linear-gradient(135deg, #f7931e, #fbbf24);
  height: 7px; 
  border-radius: 3.5px; 
  margin-top: 3px; 
  margin-left: 4px; 
  box-shadow: 0 2px 6px rgba(247, 147, 30, 0.3);
}

.pattern-bar-3 { 
  background: linear-gradient(135deg, #10b981, #059669);
  height: 6px; 
  border-radius: 3px; 
  margin-top: 3px; 
  margin-left: 8px; 
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.pattern-bar-4 { 
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  height: 5px; 
  border-radius: 2.5px; 
  margin-top: 3px; 
  margin-left: 12px; 
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #10b981 50%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-right {
  text-align: right;
}

.header-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.signin-link {
  color: #ea580c;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.signin-link:hover {
  color: #dc2626;
}

/* Main Content */
.main-content {
  max-width: 640px;
  margin: 0 auto;
  padding: 48px 16px;
}

.user-type-section {
  text-align: center;
  margin-bottom: 32px;
}

.user-type-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-blue {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.icon-orange {
  background: linear-gradient(135deg, #fed7aa, #fdba74);
}

.user-type-emoji {
  font-size: 48px;
}

.main-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.main-subtitle {
  color: #6b7280;
  font-size: 18px;
  margin-bottom: 24px;
}

.type-switcher {
  display: inline-flex;
  background-color: #f3f4f6;
  border-radius: 12px;
  padding: 4px;
  margin-top: 24px;
}

.type-button {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-active-blue {
  background: white;
  color: #2563eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.type-active-orange {
  background: white;
  color: #ea580c;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.type-inactive {
  background: transparent;
  color: #6b7280;
}

.type-inactive:hover {
  color: #374151;
}

/* Form */
.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #f3f4f6;
  padding: 32px;
  margin-bottom: 32px;
}

.registration-form {
  width: 100%;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #d1d5db;
  border-radius: 12px;
  background-color: white;
  transition: all 0.2s ease;
  font-size: 14px;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.password-container {
  position: relative;
}

.password-input {
  padding-right: 48px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.validation-success {
  font-size: 12px;
  color: #059669;
  margin-top: 4px;
}

.email-suggestion {
  margin-top: 4px;
}

.suggestion-link {
  font-size: 12px;
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
}

.suggestion-link:hover {
  color: #1d4ed8;
}

.location-detect {
  font-size: 12px;
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 4px;
}

.location-detect:hover {
  color: #1d4ed8;
}

.password-strength {
  margin-top: 8px;
}

.strength-bars {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.strength-bar {
  height: 4px;
  flex: 1;
  border-radius: 2px;
  transition: background-color 0.2s;
}

.strength-empty { background-color: #e5e7eb; }
.strength-weak { background-color: #ef4444; }
.strength-fair { background-color: #f59e0b; }
.strength-good { background-color: #3b82f6; }
.strength-strong { background-color: #10b981; }

.strength-text {
  font-size: 12px;
  color: #6b7280;
}

.character-count {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.terms-section {
  margin-bottom: 16px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  cursor: pointer;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  margin-right: 12px;
  margin-top: 2px;
  accent-color: #f97316;
}

.checkbox-text {
  color: #374151;
  line-height: 1.5;
}

.link {
  color: #ea580c;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  color: #dc2626;
}

.error-message {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
  margin-bottom: 16px;
}

.error-icon {
  margin-right: 8px;
}

.submit-button {
  width: 100%;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 18px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.submit-blue {
  background: linear-gradient(to right, #3b82f6, #2563eb);
  color: white;
}

.submit-blue:hover:not(:disabled) {
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
}

.submit-orange {
  background: linear-gradient(to right, #f97316, #ea580c);
  color: white;
}

.submit-orange:hover:not(:disabled) {
  background: linear-gradient(to right, #ea580c, #dc2626);
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(249, 115, 22, 0.3);
}

.submit-loading {
  display: flex;
  align-items: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 12px;
}

.submit-normal {
  display: flex;
  align-items: center;
}

.submit-arrow {
  margin-left: 8px;
  font-size: 20px;
}

/* Next Steps */
.next-steps {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 24px;
}

.next-steps-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
}

.steps-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .steps-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.step-item {
  display: flex;
  align-items: flex-start;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  margin-top: 2px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.step-green { background-color: #10b981; }
.step-blue { background-color: #3b82f6; }
.step-orange { background-color: #f97316; }

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 14px;
  color: #6b7280;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  padding: 32px;
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 40px;
  font-weight: 700;
  color: white;
}

.success-blue {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #2563eb;
}

.success-orange {
  background: linear-gradient(135deg, #fed7aa, #fdba74);
  color: #ea580c;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.modal-text {
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-button-primary {
  width: 100%;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  color: white;
}

.button-blue {
  background: #2563eb;
}

.button-blue:hover {
  background: #1d4ed8;
}

.button-orange {
  background: #ea580c;
}

.button-orange:hover {
  background: #dc2626;
}

.modal-button-secondary {
  width: 100%;
  padding: 12px 24px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.modal-button-secondary:hover {
  background: #f9fafb;
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 640px) {
  .header-content {
    padding: 16px;
  }
  
  .main-content {
    padding: 24px 16px;
  }
  
  .form-card {
    padding: 20px;
  }
  
  .main-title {
    font-size: 24px;
  }
  
  .main-subtitle {
    font-size: 16px;
  }
}
</style>