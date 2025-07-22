<template>
  <!-- FURSA Login Modal - Uses your enhanced design system -->
  <div v-if="isOpen" @click="closeModal" class="modal-overlay">
    <div @click.stop class="modal-card">
      <!-- FURSA Branded Header -->
      <div class="modal-header">
        <!-- Cultural Pattern Logo -->
        <div class="cultural-pattern mx-auto mb-4">
          <div class="pattern-bar-1"></div>
          <div class="pattern-bar-2"></div>
          <div class="pattern-bar-3"></div>
          <div class="pattern-bar-4"></div>
        </div>
        
        <h3 class="modal-title gradient-text">Welcome Back!</h3>
        <p class="modal-subtitle">Sign in to continue your FURSA journey</p>
        
        <button @click="closeModal" class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- User Type Selector -->
      <div class="mb-6">
        <div class="flex bg-gray-100 rounded-xl p-1.5">
          <button 
            @click="selectedUserType = 'provider'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2',
              selectedUserType === 'provider' 
                ? 'bg-white text-fursa-blue shadow-sm' 
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
                ? 'bg-white text-fursa-orange shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            <span>🎨</span>
            Creative Talent
          </button>
        </div>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="submitLogin" class="modal-body">
        <!-- Error Display -->
        <div v-if="authStore.error" class="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <AlertCircle class="w-5 h-5 flex-shrink-0" />
          <span class="text-sm">{{ authStore.error }}</span>
        </div>

        <!-- Email Input -->
        <div class="form-group">
          <label for="email" class="form-label flex items-center gap-2">
            <Mail class="w-4 h-4" />
            Email Address
          </label>
          <input 
            id="email"
            v-model="formData.email"
            type="email" 
            required
            placeholder="Enter your email"
            class="form-input"
            :disabled="authStore.isLoading"
            autocomplete="email"
          />
        </div>

        <!-- Phone Input -->
        <div class="form-group">
          <label for="phone" class="form-label flex items-center gap-2">
            <Phone class="w-4 h-4" />
            Phone Number
          </label>
          <input 
            id="phone"
            v-model="formData.phone"
            type="tel" 
            required
            placeholder="+254 700 000 000"
            class="form-input"
            :disabled="authStore.isLoading"
            autocomplete="tel"
          />
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="authStore.isLoading || !formData.email || !formData.phone"
          :class="[
            'w-full flex items-center justify-center gap-2',
            selectedUserType === 'provider' ? 'btn-primary' : 'btn-secondary'
          ]"
        >
          <div v-if="authStore.isLoading" class="loading-spinner"></div>
          <LogIn v-else class="w-5 h-5" />
          {{ authStore.isLoading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <!-- Demo Accounts Section -->
      <div class="border-t border-gray-100 pt-4 mb-6">
        <button 
          @click="showDemoAccounts = !showDemoAccounts" 
          class="flex items-center justify-center gap-2 w-full text-sm text-gray-600 hover:text-gray-800 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Shield class="w-4 h-4" />
          {{ showDemoAccounts ? 'Hide' : 'Try' }} Demo Accounts
        </button>
        
        <div v-if="showDemoAccounts" class="mt-3 space-y-2">
          <button 
            @click="fillDemoProvider" 
            class="w-full p-3 text-left text-sm border border-blue-200 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            🔧 Provider Demo (john@test.com)
          </button>
          <button 
            @click="fillDemoTalent" 
            class="w-full p-3 text-left text-sm border border-orange-200 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
          >
            🎨 Talent Demo (mary@test.com)
          </button>
        </div>
      </div>

      <!-- Registration Links -->
      <div class="modal-footer border-t border-gray-100 pt-4">
        <p class="text-center text-sm text-gray-600 mb-3">
          Don't have an account?
        </p>
        <div class="space-y-2">
          <button 
            @click="goToProviderRegister" 
            class="btn-outline btn-sm w-full"
          >
            Join as Service Provider
          </button>
          <button 
            @click="goToTalentRegister" 
            class="btn-ghost btn-sm w-full"
          >
            Join as Creative Talent
          </button>
        </div>
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

// FIXED: Login with proper routing based on actual user type
const submitLogin = async () => {
  try {
    console.log('🔑 Login attempt:', { selectedType: selectedUserType.value, email: formData.value.email })
    
    // Call the enhanced auth store login method
    const result = await authStore.login(formData.value, selectedUserType.value)
    
    console.log('✅ Login successful, result:', result)
    
    // Close modal first
    closeModal()
    
    // CRITICAL: Use the actual user type from auth store, not the selected type
    const actualUserType = authStore.userType
    
    console.log('🧭 Redirecting based on actual user type:', actualUserType)
    
    // Redirect based on the ACTUAL user type from auth store
    if (actualUserType === 'provider') {
      console.log('👷 Redirecting to provider dashboard')
      await router.push({ 
        path: '/app/provider-dashboard',
        query: { welcome: 'true' }
      })
    } else if (actualUserType === 'talent') {
      console.log('🎨 Redirecting to talent dashboard')
      await router.push({ 
        path: '/app/talent-dashboard',
        query: { welcome: 'true' }
      })
    } else {
      console.log('❓ Unknown user type, redirecting to home')
      await router.push('/app')
    }
    
  } catch (error) {
    console.error('❌ Login failed:', error)
    // Error is already handled in the store and displayed in the UI
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