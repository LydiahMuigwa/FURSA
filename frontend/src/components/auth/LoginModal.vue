<template>
  <!-- FURSA Login Modal - Consistent with Design System -->
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div @click.stop class="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-100">
      <!-- FURSA Branded Header -->
      <div class="text-center mb-8">
        <!-- Cultural Pattern Logo -->
        <div class="cultural-pattern mx-auto mb-4">
          <div class="pattern-bar-1"></div>
          <div class="pattern-bar-2"></div>
          <div class="pattern-bar-3"></div>
          <div class="pattern-bar-4"></div>
        </div>
        
        <div class="mb-4">
          <h3 class="text-2xl font-bold gradient-text mb-2">Welcome Back!</h3>
          <p class="text-gray-600">Sign in to continue your FURSA journey</p>
        </div>
        
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- User Type Selector - FURSA Style -->
      <div class="mb-6">
        <div class="flex bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 border border-gray-200">
          <button @click="selectedUserType = 'provider'"
                  :class="[
                    'flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200',
                    selectedUserType === 'provider' 
                      ? 'bg-white text-fursa-blue shadow-md border border-blue-100' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  ]">
            <div class="flex items-center justify-center">
              <span class="mr-2">🔧</span>
              Service Provider
            </div>
          </button>
          <button @click="selectedUserType = 'talent'"
                  :class="[
                    'flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200',
                    selectedUserType === 'talent' 
                      ? 'bg-white text-fursa-orange shadow-md border border-orange-100' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  ]">
            <div class="flex items-center justify-center">
              <span class="mr-2">🎨</span>
              Creative Talent
            </div>
          </button>
        </div>
      </div>

      <!-- Enhanced Login Form -->
      <form @submit.prevent="submitLogin" class="space-y-5">
        <!-- Email Input with FURSA Styling -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <div class="relative">
            <input v-model="formData.email" 
                   type="email" 
                   required
                   :disabled="authStore.isLoading"
                   placeholder="Enter your email address"
                   class="form-input pl-11 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <!-- Phone Input with Validation -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
          <div class="relative">
            <input v-model="formData.phone" 
                   type="tel" 
                   required
                   :disabled="authStore.isLoading"
                   placeholder="+254 xxx xxx xxx or 07xx xxx xxx"
                   class="form-input pl-11 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <Phone class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <p class="text-xs text-gray-500 mt-1.5 flex items-center">
            <Shield class="w-3 h-3 mr-1" />
            We use email + phone for secure identity verification
          </p>
        </div>

        <!-- Error Message with FURSA Styling -->
        <div v-if="authStore.error" 
             class="p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
          <div class="flex">
            <AlertCircle class="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <p class="text-sm text-red-700">{{ authStore.error }}</p>
          </div>
        </div>

        <!-- Submit Button with Cultural Animation -->
        <button type="submit" 
                :disabled="authStore.isLoading"
                :class="[
                  'w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
                  selectedUserType === 'provider'
                    ? 'bg-gradient-to-r from-fursa-blue to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    : 'bg-gradient-to-r from-fursa-orange to-orange-600 hover:from-orange-600 hover:to-orange-700'
                ]">
          <div v-if="authStore.isLoading" class="flex items-center justify-center">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
            <span>Signing you in...</span>
          </div>
          <div v-else class="flex items-center justify-center">
            <LogIn class="w-5 h-5 mr-3" />
            <span>Sign In to FURSA</span>
          </div>
        </button>
      </form>

      <!-- Register Link with Cultural Touch -->
      <div class="mt-8 pt-6 border-t border-gray-100 text-center">
        <p class="text-sm text-gray-600 mb-4">
          New to FURSA? Join our community!
        </p>
        <div class="flex gap-2">
          <button @click="goToProviderRegister" 
                  class="flex-1 flex items-center justify-center px-4 py-2.5 text-fursa-blue hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg font-medium transition-all duration-200 hover:bg-blue-50">
            <span class="mr-1">🔧</span>
            Join as Provider
          </button>
          <button @click="goToTalentRegister" 
                  class="flex-1 flex items-center justify-center px-4 py-2.5 text-fursa-orange hover:text-orange-700 border border-orange-200 hover:border-orange-300 rounded-lg font-medium transition-all duration-200 hover:bg-orange-50">
            <span class="mr-1">🎨</span>
            Share Your Art
          </button>
        </div>
      </div>

      <!-- Demo Accounts for Testing -->
      <div v-if="showDemoAccounts" class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl border border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Demo Accounts</p>
          <button @click="showDemoAccounts = false" class="text-gray-400 hover:text-gray-600">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-2">
          <button @click="fillDemoProvider" 
                  class="w-full text-left px-3 py-2 text-xs bg-white border border-blue-200 rounded-lg hover:border-blue-300 transition-colors">
            <div class="flex items-center">
              <span class="mr-2">🔧</span>
              <div>
                <div class="font-medium text-fursa-blue">Demo Provider</div>
                <div class="text-gray-500">john@test.com • +254123456789</div>
              </div>
            </div>
          </button>
          <button @click="fillDemoTalent" 
                  class="w-full text-left px-3 py-2 text-xs bg-white border border-orange-200 rounded-lg hover:border-orange-300 transition-colors">
            <div class="flex items-center">
              <span class="mr-2">🎨</span>
              <div>
                <div class="font-medium text-fursa-orange">Demo Talent</div>
                <div class="text-gray-500">mary@test.com • +254987654321</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Show Demo Toggle -->
      <div v-if="!showDemoAccounts" class="mt-4 text-center">
        <button @click="showDemoAccounts = true" 
                class="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          Need test accounts? Click here
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { X, LogIn, Mail, Phone, Shield, AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const router = useRouter()
const authStore = useAuthStore()

// Component state
const selectedUserType = ref('provider')
const showDemoAccounts = ref(false)
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
  authStore.clearError()
  showDemoAccounts.value = false
}

const submitLogin = async () => {
  try {
    await authStore.login(formData.value, selectedUserType.value)
    
    // Login successful - redirect based on user type with welcome message
    closeModal()
    
    const redirectPath = selectedUserType.value === 'provider' 
      ? '/app/provider-dashboard' 
      : '/app/talent-dashboard'
    
    await router.push({ 
      path: redirectPath,
      query: { welcome: 'true' }
    })
    
  } catch (error) {
    // Error is already handled in the store
    console.error('Login failed:', error)
  }
}

const goToProviderRegister = () => {
  closeModal()
  router.push('/app/join-as-provider')
}

const goToTalentRegister = () => {
  closeModal()
  router.push('/app/upload')
}

// Demo account helpers
const fillDemoProvider = () => {
  formData.value = {
    email: 'john@test.com',
    phone: '+254123456789'
  }
  selectedUserType.value = 'provider'
  showDemoAccounts.value = false
}

const fillDemoTalent = () => {
  formData.value = {
    email: 'mary@test.com', 
    phone: '+254987654321'
  }
  selectedUserType.value = 'talent'
  showDemoAccounts.value = false
}

// Auto-focus first input when modal opens
onMounted(() => {
  if (props.isOpen) {
    nextTick(() => {
      const firstInput = document.querySelector('input[type="email"]')
      if (firstInput) firstInput.focus()
    })
  }
})
</script>

<style scoped>
/* FURSA Cultural Pattern Styles */
.cultural-pattern {
  position: relative;
  width: 48px;
  height: 48px;
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

/* FURSA Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #10b981 50%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Form Input Styling - Consistent with FURSA Design */
.form-input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-xl 
         focus:ring-2 focus:ring-offset-0 focus:border-transparent 
         transition-all duration-200 bg-white;
}

.form-input:focus {
  @apply ring-2 ring-offset-0;
}

.form-input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

/* Loading spinner animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth entrance animations */
.animate-in {
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fadeIn;
}

.slide-in-from-top-1 {
  animation-name: slideInFromTop;
}

.duration-300 {
  animation-duration: 300ms;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromTop {
  from { transform: translateY(-4px); }
  to { transform: translateY(0); }
}

/* Hover effects with FURSA touch */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>