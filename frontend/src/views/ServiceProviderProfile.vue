<!-- ServiceProviderProfile.vue - Service Provider Profile Page -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Use SharedNavigation instead of custom navigation -->
    <SharedNavigation variant="app" :show-tagline="false" />

    <!-- Main Profile Content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Profile Header -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div class="relative">
          <!-- Cover Photo -->
          <div class="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          
          <!-- Profile Info -->
          <div class="relative px-6 pb-6">
            <!-- Profile Picture -->
            <div class="absolute -top-16 left-6">
              <div class="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <div v-if="!profileData.avatar" class="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                  <span class="text-4xl">🔧</span>
                </div>
                <img v-else :src="profileData.avatar" :alt="profileData.name" class="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end pt-4 space-x-3">
              <button v-if="!authStore.isAuthenticated" 
                      @click="redirectToLogin"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Contact Provider
              </button>
              <button v-else-if="!isOwnProfile"
                      @click="contactProvider"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Contact Provider
              </button>
              <button v-else
                      @click="editProfile"
                      class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Edit Profile
              </button>
            </div>
            
            <!-- Profile Details -->
            <div class="mt-6 ml-40">
              <h1 class="text-3xl font-bold text-gray-900">{{ profileData.name }}</h1>
              <p class="text-lg text-blue-600 font-medium">{{ profileData.category }}</p>
              <p class="text-gray-600 mt-2">{{ profileData.location }}</p>
              
              <!-- Rating and Stats -->
              <div class="flex items-center space-x-6 mt-4">
                <div class="flex items-center space-x-1">
                  <span class="text-yellow-400">⭐</span>
                  <span class="font-semibold">{{ profileData.rating }}</span>
                  <span class="text-gray-500">({{ profileData.reviewsCount }} reviews)</span>
                </div>
                <div class="text-gray-500">
                  {{ profileData.completedJobs }} jobs completed
                </div>
                <div class="text-green-600 font-semibold">
                  {{ profileData.responseTime }} avg response
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column - About & Services -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- About Section -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">About {{ profileData.name }}</h2>
            <p class="text-gray-600 leading-relaxed">{{ profileData.description }}</p>
          </div>

          <!-- Services Offered -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="service in profileData.services" :key="service.id" 
                   class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 class="font-semibold text-gray-900">{{ service.name }}</h3>
                <p class="text-gray-600 text-sm mt-1">{{ service.description }}</p>
                <div class="flex justify-between items-center mt-3">
                  <span class="text-blue-600 font-semibold">Starting at ${{ service.price }}</span>
                  <span class="text-sm text-gray-500">{{ service.duration }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
            <div class="space-y-4">
              <div v-for="review in profileData.reviews" :key="review.id" 
                   class="border-b border-gray-100 pb-4 last:border-b-0">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-900">{{ review.customerName }}</span>
                    <div class="flex text-yellow-400">
                      <span v-for="star in 5" :key="star">
                        {{ star <= review.rating ? '⭐' : '☆' }}
                      </span>
                    </div>
                  </div>
                  <span class="text-sm text-gray-500">{{ formatDate(review.date) }}</span>
                </div>
                <p class="text-gray-600">{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Contact & Info -->
        <div class="space-y-6">
          
          <!-- Contact Card -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <span class="text-gray-400">📍</span>
                <span class="text-gray-600">{{ profileData.fullAddress }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <span class="text-gray-400">📞</span>
                <span class="text-gray-600">{{ profileData.phone }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <span class="text-gray-400">✉️</span>
                <span class="text-gray-600">{{ profileData.email }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <span class="text-gray-400">🕒</span>
                <span class="text-gray-600">{{ profileData.availability }}</span>
              </div>
            </div>
            
            <!-- Contact Button -->
            <button v-if="!authStore.isAuthenticated" 
                    @click="redirectToLogin"
                    class="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Sign In to Contact
            </button>
            <button v-else-if="!isOwnProfile"
                    @click="contactProvider"
                    class="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Send Message
            </button>
          </div>

          <!-- Skills & Expertise -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Skills & Expertise</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in profileData.skills" :key="skill" 
                    class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Certifications -->
          <div v-if="profileData.certifications?.length" 
               class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Certifications</h3>
            <div class="space-y-3">
              <div v-for="cert in profileData.certifications" :key="cert.id" 
                   class="flex items-center space-x-3">
                <span class="text-green-500">🏆</span>
                <div>
                  <div class="font-medium text-gray-900">{{ cert.name }}</div>
                  <div class="text-sm text-gray-500">{{ cert.issuer }} • {{ cert.year }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SharedNavigation from '@/components/common/SharedNavigation.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Component state
const profileData = ref({
  id: '',
  name: '',
  category: '',
  location: '',
  fullAddress: '',
  phone: '',
  email: '',
  avatar: '',
  description: '',
  rating: 0,
  reviewsCount: 0,
  completedJobs: 0,
  responseTime: '',
  availability: '',
  services: [],
  reviews: [],
  skills: [],
  certifications: []
})

const isLoading = ref(true)
const error = ref('')

// Computed properties
const isOwnProfile = computed(() => {
  return authStore.isAuthenticated && 
         authStore.userType === 'provider' && 
         authStore.userId === profileData.value.id
})

// Methods
const redirectToLogin = () => {
  // Redirect to LoginPage instead of showing modal
  router.push({
    path: '/app/login',
    query: { 
      redirect: route.fullPath,
      action: 'contact_provider'
    }
  })
}

const contactProvider = () => {
  if (!authStore.isAuthenticated) {
    redirectToLogin()
    return
  }
  
  // Handle contacting the provider
  console.log('Contacting provider:', profileData.value.id)
  // TODO: Implement contact functionality
}

const editProfile = () => {
  router.push('/app/provider-dashboard/profile/edit')
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadProviderProfile = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const providerId = route.params.id || route.params.providerId
    
    if (!providerId) {
      throw new Error('Provider ID is required')
    }
    
    console.log('Loading provider profile:', providerId)
    
    // TODO: Replace with actual API call
    // Simulate API call for now
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data - replace with real API call
    profileData.value = {
      id: providerId,
      name: 'John Smith',
      category: 'Electrician',
      location: 'Nairobi, Kenya',
      fullAddress: 'Westlands, Nairobi, Kenya',
      phone: '+254 700 123 456',
      email: 'john.smith@email.com',
      avatar: '',
      description: 'Experienced electrician with over 10 years in residential and commercial electrical work. Specialized in installations, repairs, and maintenance.',
      rating: 4.8,
      reviewsCount: 127,
      completedJobs: 156,
      responseTime: '2 hours',
      availability: 'Mon-Sat, 8AM-6PM',
      services: [
        {
          id: 1,
          name: 'Electrical Installation',
          description: 'Complete electrical installation for homes and offices',
          price: 5000,
          duration: '2-4 hours'
        },
        {
          id: 2,
          name: 'Electrical Repair',
          description: 'Quick fixes for electrical issues',
          price: 2000,
          duration: '1-2 hours'
        }
      ],
      reviews: [
        {
          id: 1,
          customerName: 'Sarah Johnson',
          rating: 5,
          comment: 'Excellent work! Very professional and completed the job quickly.',
          date: '2024-01-15'
        },
        {
          id: 2,
          customerName: 'Michael Brown',
          rating: 4,
          comment: 'Good service, arrived on time and fixed the issue.',
          date: '2024-01-10'
        }
      ],
      skills: ['Electrical Installation', 'Wiring', 'Circuit Repair', 'Safety Inspection'],
      certifications: [
        {
          id: 1,
          name: 'Licensed Electrician',
          issuer: 'Ministry of Energy',
          year: '2020'
        }
      ]
    }
    
  } catch (err) {
    console.error('Failed to load provider profile:', err)
    error.value = err.message || 'Failed to load provider profile'
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadProviderProfile()
})
</script>

<style scoped>
/* Any component-specific styles */
.gradient-text {
  background: linear-gradient(135deg, #2563eb, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Responsive design */
@media (max-width: 640px) {
  .ml-40 {
    margin-left: 0;
    margin-top: 1rem;
  }
}
</style>