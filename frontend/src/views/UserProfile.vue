<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
              <p class="text-gray-600">Manage your account information</p>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500">
                {{ authStore.isProvider ? '🔧 Service Provider' : '🎨 Creative Talent' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Account Information</h2>
            </div>
            
            <form @submit.prevent="updateProfile" class="p-6 space-y-6">
              <!-- Basic Info -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input v-model="profileForm.name" 
                         type="text" 
                         required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input v-model="profileForm.email" 
                         type="email" 
                         required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input v-model="profileForm.phone" 
                         type="tel" 
                         required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input v-model="profileForm.location" 
                         type="text" 
                         placeholder="City, Country"
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                </div>
              </div>

              <!-- Service-specific fields -->
              <div v-if="authStore.isProvider">
                <label class="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select v-model="profileForm.serviceType" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option value="">Select your service</option>
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="carpenter">Carpenter</option>
                  <option value="painter">Painter</option>
                  <option value="gardener">Gardener</option>
                  <option value="cleaner">Cleaning Service</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Description/Bio -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ authStore.isProvider ? 'Service Description' : 'About You' }}
                </label>
                <textarea v-model="profileForm.description" 
                          rows="4"
                          placeholder="Tell people about yourself and your work..."
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"></textarea>
              </div>

              <!-- Error/Success Messages -->
              <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-700">{{ error }}</p>
              </div>

              <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-sm text-green-700">{{ success }}</p>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end">
                <button type="submit" 
                        :disabled="isLoading"
                        class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50">
                  <div v-if="isLoading" class="flex items-center">
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </div>
                  <div v-else>Save Changes</div>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Profile Actions -->
        <div class="space-y-6">
          <!-- Account Stats -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Member Since</span>
                <span class="text-sm font-medium">{{ formatDate(authStore.user?.createdAt) }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Profile Views</span>
                <span class="text-sm font-medium">{{ authStore.user?.profileViews || 0 }}</span>
              </div>
              
              <div v-if="authStore.isProvider" class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Jobs Completed</span>
                <span class="text-sm font-medium">{{ authStore.user?.completedJobs || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div class="space-y-3">
              <router-link :to="authStore.isProvider ? '/app/provider-dashboard' : '/app/talent-dashboard'"
                           class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <BarChart class="w-5 h-5 text-gray-400 mr-3" />
                <div class="text-sm font-medium text-gray-900">View Dashboard</div>
              </router-link>
              
              <button @click="showDeleteModal = true"
                      class="w-full flex items-center p-3 text-left rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
                <Trash2 class="w-5 h-5 text-red-400 mr-3" />
                <div class="text-sm font-medium text-red-600">Delete Account</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteModal" 
         @click="showDeleteModal = false"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div @click.stop class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <AlertTriangle class="w-6 h-6 text-red-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Delete Account</h3>
        </div>
        
        <p class="text-gray-600 mb-6">
          This action cannot be undone. This will permanently delete your account and remove all your data.
        </p>
        
        <div class="flex space-x-3">
          <button @click="showDeleteModal = false"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="deleteAccount"
                  :disabled="isDeleting"
                  class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50">
            <div v-if="isDeleting">Deleting...</div>
            <div v-else>Delete Account</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BarChart, Trash2, AlertTriangle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import ApiService from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

// Component state
const isLoading = ref(false)
const isDeleting = ref(false)
const error = ref('')
const success = ref('')
const showDeleteModal = ref(false)

// Form data
const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  location: '',
  serviceType: '',
  description: ''
})

// Initialize form with user data
const initializeForm = () => {
  const user = authStore.user
  if (user) {
    profileForm.name = user.name || ''
    profileForm.email = user.email || ''
    profileForm.phone = user.phone || ''
    profileForm.location = user.location || ''
    profileForm.serviceType = user.serviceType || ''
    profileForm.description = user.description || ''
  }
}

// Update profile
const updateProfile = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await ApiService.updateUserProfile(authStore.user.id, profileForm)
    
    // Update auth store
    authStore.updateUser(response)
    
    success.value = 'Profile updated successfully!'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = ''
    }, 3000)

  } catch (err) {
    console.error('Profile update failed:', err)
    error.value = err.message || 'Failed to update profile. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Delete account
const deleteAccount = async () => {
  isDeleting.value = true

  try {
    await ApiService.deleteUserAccount(authStore.user.id)
    
    // Logout user
    authStore.logout()
    
    // Redirect to home
    router.push('/app')
    
  } catch (err) {
    console.error('Account deletion failed:', err)
    error.value = 'Failed to delete account. Please try again.'
    showDeleteModal.value = false
  } finally {
    isDeleting.value = false
  }
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (err) {
    return 'Unknown'
  }
}

// Initialize on mount
onMounted(() => {
  initializeForm()
})
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