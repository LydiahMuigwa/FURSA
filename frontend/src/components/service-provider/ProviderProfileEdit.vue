<!-- frontend/src/components/service-provider/ProviderProfileEdit.vue -->
<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
      <p class="text-gray-600">Keep your information up to date to help customers find you</p>
    </div>

    <!-- Profile Completion Progress -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Profile Completion</h2>
        <span class="text-2xl font-bold text-blue-600">{{ profileCompleteness }}%</span>
      </div>
      
      <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div class="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
             :style="{ width: `${profileCompleteness}%` }"></div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="flex items-center">
          <Check v-if="formData.fullName" class="w-4 h-4 text-green-500 mr-2" />
          <X v-else class="w-4 h-4 text-red-500 mr-2" />
          <span :class="formData.fullName ? 'text-green-700' : 'text-red-700'">Basic Info</span>
        </div>
        <div class="flex items-center">
          <Check v-if="formData.description" class="w-4 h-4 text-green-500 mr-2" />
          <X v-else class="w-4 h-4 text-red-500 mr-2" />
          <span :class="formData.description ? 'text-green-700' : 'text-red-700'">Description</span>
        </div>
        <div class="flex items-center">
          <Check v-if="formData.skills.length > 0" class="w-4 h-4 text-green-500 mr-2" />
          <X v-else class="w-4 h-4 text-red-500 mr-2" />
          <span :class="formData.skills.length > 0 ? 'text-green-700' : 'text-red-700'">Skills</span>
        </div>
        <div class="flex items-center">
          <Check v-if="hasProfilePhoto" class="w-4 h-4 text-green-500 mr-2" />
          <X v-else class="w-4 h-4 text-red-500 mr-2" />
          <span :class="hasProfilePhoto ? 'text-green-700' : 'text-red-700'">Photo</span>
        </div>
      </div>
    </div>

    <form @submit.prevent="saveProfile" class="space-y-8">
      <!-- Basic Information -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Basic Information</h3>
        </div>
        <div class="p-6 space-y-6">
          <!-- Profile Photo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
            <div class="flex items-center space-x-6">
              <div class="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                <img v-if="profilePhoto" :src="profilePhoto" alt="Profile" class="w-full h-full object-cover" />
                <User v-else class="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <button type="button" @click="$refs.photoInput.click()" 
                        class="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Change Photo
                </button>
                <input ref="photoInput" type="file" accept="image/*" @change="handlePhotoUpload" class="hidden" />
                <p class="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
              </div>
            </div>
          </div>

          <!-- Full Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name *</label>
              <input v-model="formData.fullName" 
                     type="text" 
                     id="fullName"
                     required
                     class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="businessName" class="block text-sm font-medium text-gray-700">Business Name</label>
              <input v-model="formData.businessName" 
                     type="text" 
                     id="businessName"
                     class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <!-- Contact Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address *</label>
              <input v-model="formData.email" 
                     type="email" 
                     id="email"
                     required
                     class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number *</label>
              <input v-model="formData.phone" 
                     type="tel" 
                     id="phone"
                     required
                     class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <!-- Location -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700">Location *</label>
            <input v-model="formData.location" 
                   type="text" 
                   id="location"
                   required
                   placeholder="City, Area"
                   class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>

      <!-- Service Information -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Service Information</h3>
        </div>
        <div class="p-6 space-y-6">
          <!-- Service Type -->
          <div>
            <label for="serviceType" class="block text-sm font-medium text-gray-700">What service do you provide? *</label>
            <select v-model="formData.serviceType" 
                    id="serviceType"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select a service</option>
              <option value="painter">🎨 House Painting</option>
              <option value="plumber">🔧 Plumbing Services</option>
              <option value="electrician">⚡ Electrical Work</option>
              <option value="carpenter">🪵 Carpentry</option>
              <option value="cleaner">🧹 Cleaning Services</option>
              <option value="mechanic">🔩 Auto Repair</option>
              <option value="gardener">🌱 Gardening</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Experience -->
          <div>
            <label for="experience" class="block text-sm font-medium text-gray-700">Years of Experience *</label>
            <select v-model="formData.experience" 
                    id="experience"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select experience</option>
              <option value="0-1">Less than 1 year</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">More than 10 years</option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">About Your Service *</label>
            <textarea v-model="formData.description" 
                      id="description"
                      rows="4"
                      required
                      placeholder="Tell customers what makes your service special..."
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            <p class="mt-1 text-sm text-gray-500">{{ formData.description.length }}/500 characters</p>
          </div>

          <!-- Skills -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Skills & Specialties</label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div v-for="skill in availableSkills" :key="skill" class="flex items-center">
                <input :id="'skill-' + skill" 
                       type="checkbox" 
                       :value="skill"
                       v-model="formData.skills"
                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label :for="'skill-' + skill" class="ml-2 text-sm text-gray-700">{{ skill }}</label>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="minPrice" class="block text-sm font-medium text-gray-700">Starting Price (KES)</label>
              <input v-model.number="formData.minPrice" 
                     type="number" 
                     id="minPrice"
                     min="0"
                     placeholder="e.g. 2500"
                     class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="availability" class="block text-sm font-medium text-gray-700">Availability</label>
              <select v-model="formData.availability" 
                      id="availability"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="flexible">Flexible Hours</option>
                <option value="business">Business Hours</option>
                <option value="weekends">Weekends Only</option>
                <option value="emergency">24/7 Emergency</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between">
        <button type="button" 
                @click="$router.go(-1)"
                class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" 
                :disabled="saving"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
          <span v-if="saving">Saving...</span>
          <span v-else>Save Profile</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Check, X, User } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const saving = ref(false)
const profilePhoto = ref(null)

const formData = ref({
  fullName: '',
  businessName: '',
  email: '',
  phone: '',
  location: '',
  serviceType: '',
  experience: '',
  description: '',
  skills: [],
  minPrice: null,
  availability: 'flexible'
})

const availableSkills = [
  'Interior Painting', 'Exterior Painting', 'Wall Preparation', 'Color Consultation',
  'Residential Plumbing', 'Commercial Plumbing', 'Emergency Repairs', 'Installation',
  'Wiring', 'Lighting', 'Panel Upgrades', 'Troubleshooting',
  'Custom Furniture', 'Repairs', 'Installations', 'Kitchen Cabinets',
  'Deep Cleaning', 'Regular Maintenance', 'Move-in/Move-out', 'Office Cleaning',
  'Engine Repair', 'Brake Service', 'Oil Changes', 'Diagnostics'
]

// Computed
const profileCompleteness = computed(() => {
  const requiredFields = ['fullName', 'email', 'phone', 'location', 'serviceType', 'experience', 'description']
  const completedFields = requiredFields.filter(field => formData.value[field]).length
  const skillsBonus = formData.value.skills.length > 0 ? 1 : 0
  const photoBonus = profilePhoto.value ? 1 : 0
  
  return Math.round(((completedFields + skillsBonus + photoBonus) / (requiredFields.length + 2)) * 100)
})

const hasProfilePhoto = computed(() => !!profilePhoto.value)

// Methods
const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profilePhoto.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    const profileData = {
      ...formData.value,
      profilePhoto: profilePhoto.value,
      updatedAt: new Date()
    }

    // TODO: Call API to save profile
    const response = await fetch('/api/service-providers/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    })

    if (response.ok) {
      console.log('Profile saved successfully!')
      router.push('/app/provider-dashboard')
    }
  } catch (error) {
    console.error('Failed to save profile:', error)
  } finally {
    saving.value = false
  }
}

const loadProfile = async () => {
  try {
    // TODO: Load existing profile data
    // For now, use demo data
    formData.value = {
      fullName: 'John Doe',
      businessName: 'John\'s Painting Services',
      email: 'john@example.com',
      phone: '+254712345678',
      location: 'Nairobi, Kenya',
      serviceType: 'painter',
      experience: '5-10',
      description: 'Professional house painting with 8 years of experience. I specialize in both interior and exterior painting.',
      skills: ['Interior Painting', 'Exterior Painting', 'Wall Preparation'],
      minPrice: 2500,
      availability: 'flexible'
    }
  } catch (error) {
    console.error('Failed to load profile:', error)
  }
}

// Load profile data on mount
onMounted(() => {
  loadProfile()
})
</script>