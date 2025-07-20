<!-- ServiceProviderDashboard.vue - CLEAN VERSION WITHOUT NAVIGATION -->
<template>
  <!-- SIMPLE CONTAINER - NO NAVIGATION, NO FULL SCREEN -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Dashboard Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome back, {{ providerName }}!</h2>
      <p class="text-gray-600">Manage your quote requests and grow your business</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <Bell class="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">New Requests</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.newRequests }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <DollarSign class="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Active Quotes</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.activeQuotes }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
            <Star class="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Rating</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.rating }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
            <Calendar class="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">This Month</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.monthlyJobs }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Quote Requests List -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">Quote Requests</h3>
              <div class="flex space-x-2">
                <button @click="activeTab = 'new'" 
                        :class="[
                          'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                          activeTab === 'new' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'text-gray-600 hover:text-gray-900'
                        ]">
                  New ({{ newQuotes.length }})
                </button>
                <button @click="activeTab = 'responded'" 
                        :class="[
                          'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                          activeTab === 'responded' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'text-gray-600 hover:text-gray-900'
                        ]">
                  Responded ({{ respondedQuotes.length }})
                </button>
              </div>
            </div>
          </div>

          <div class="divide-y divide-gray-200">
            <!-- New Quote Requests -->
            <div v-if="activeTab === 'new'">
              <div v-if="newQuotes.length === 0" class="p-8 text-center">
                <Bell class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 class="text-lg font-medium text-gray-900 mb-2">No new requests</h4>
                <p class="text-gray-600">New quote requests will appear here</p>
              </div>
              
              <div v-for="quote in newQuotes" :key="quote.id" 
                   class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ quote.customerName }}</h4>
                    <p class="text-sm text-gray-600">{{ quote.serviceType }}</p>
                    <div class="flex items-center mt-1 text-xs text-gray-500">
                      <MapPin class="w-3 h-3 mr-1" />
                      {{ quote.location }}
                      <span class="mx-2">•</span>
                      <Clock class="w-3 h-3 mr-1" />
                      {{ formatTimeAgo(quote.submittedAt) }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      quote.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                      quote.urgency === 'soon' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    ]">
                      {{ quote.urgency }}
                    </span>
                    <span class="text-xs text-gray-500">#{{ quote.referenceNumber }}</span>
                  </div>
                </div>

                <p class="text-gray-700 mb-4 line-clamp-2">{{ quote.description }}</p>

                <!-- Photos -->
                <div v-if="quote.photos && quote.photos.length > 0" class="mb-4">
                  <div class="flex space-x-2">
                    <img v-for="(photo, index) in quote.photos.slice(0, 3)" 
                         :key="index"
                         :src="photo.preview" 
                         :alt="`Photo ${index + 1}`"
                         class="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                         @click="openPhotoModal(quote.photos, index)" />
                    <div v-if="quote.photos.length > 3" 
                         class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors"
                         @click="openPhotoModal(quote.photos, 3)">
                      +{{ quote.photos.length - 3 }}
                    </div>
                  </div>
                </div>

                <!-- Budget and Timeline -->
                <div class="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  <div v-if="quote.budget" class="flex items-center">
                    <DollarSign class="w-4 h-4 mr-1" />
                    {{ formatBudget(quote.budget) }}
                  </div>
                  <div class="flex items-center">
                    <Calendar class="w-4 h-4 mr-1" />
                    {{ formatTimeline(quote.timeline) }}
                  </div>
                </div>

                <!-- Contact Info -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <div class="flex items-center">
                      <Phone class="w-4 h-4 mr-1" />
                      {{ quote.phone }}
                    </div>
                    <div class="flex items-center">
                      <Mail class="w-4 h-4 mr-1" />
                      {{ quote.email }}
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="respondToQuote(quote)" 
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Respond
                    </button>
                    <button @click="callCustomer(quote.phone)" 
                            class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors">
                      <Phone class="w-4 h-4" />
                    </button>
                    <button @click="whatsappCustomer(quote)" 
                            class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition-colors">
                      <MessageCircle class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Responded Quotes -->
            <div v-if="activeTab === 'responded'">
              <div v-if="respondedQuotes.length === 0" class="p-8 text-center">
                <CheckCircle class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 class="text-lg font-medium text-gray-900 mb-2">No responses yet</h4>
                <p class="text-gray-600">Quotes you've responded to will appear here</p>
              </div>
              
              <div v-for="quote in respondedQuotes" :key="quote.id" 
                   class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ quote.customerName }}</h4>
                    <p class="text-sm text-gray-600">{{ quote.serviceType }}</p>
                    <div class="flex items-center mt-1 text-xs text-gray-500">
                      <Clock class="w-3 h-3 mr-1" />
                      Responded {{ formatTimeAgo(quote.respondedAt) }}
                    </div>
                  </div>
                  <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {{ quote.status }}
                  </span>
                </div>
                
                <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-700">{{ quote.response }}</p>
                  <p class="text-sm font-medium text-gray-900 mt-2">Quote: {{ quote.quoteAmount }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
              <Settings class="w-4 h-4 mr-2" />
              Update Profile
            </button>
            <button class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
              <Calendar class="w-4 h-4 mr-2" />
              Set Availability
            </button>
            <button class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
              <DollarSign class="w-4 h-4 mr-2" />
              Update Pricing
            </button>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div class="space-y-4">
            <div v-for="activity in recentActivity" :key="activity.id" 
                 class="flex items-start space-x-3">
              <div :class="[
                'w-2 h-2 rounded-full mt-2',
                activity.type === 'new_quote' ? 'bg-blue-500' :
                activity.type === 'response_sent' ? 'bg-green-500' :
                'bg-yellow-500'
              ]"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">{{ activity.message }}</p>
                <p class="text-xs text-gray-500">{{ formatTimeAgo(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Response Rate</span>
              <span class="text-sm font-medium text-gray-900">{{ performance.responseRate }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Avg Response Time</span>
              <span class="text-sm font-medium text-gray-900">{{ performance.avgResponseTime }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Jobs Completed</span>
              <span class="text-sm font-medium text-gray-900">{{ performance.jobsCompleted }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Bell, DollarSign, Star, Calendar, MapPin, Clock, Phone, Mail, MessageCircle,
  CheckCircle, Settings
} from 'lucide-vue-next'

// Modal imports commented out until files are created
// import QuoteResponseModal from '@/components/service-provider/QuoteResponseModal.vue'
// import PhotoViewerModal from '@/components/service-provider/PhotoViewerModal.vue'

// Component state
const activeTab = ref('new')
const showResponseModal = ref(false)
const showPhotoModal = ref(false)
const selectedQuote = ref(null)
const selectedPhotos = ref([])
const selectedPhotoIndex = ref(0)

// Provider data (would come from API/auth)
const providerName = ref('John Mwangi')

const stats = ref({
  newRequests: 3,
  activeQuotes: 7,
  rating: 4.8,
  monthlyJobs: 12
})

const performance = ref({
  responseRate: 95,
  avgResponseTime: '2.3 hours',
  jobsCompleted: 12
})

// Sample quote data (would come from API)
const quotes = ref([
  {
    id: 1,
    customerName: 'Sarah Johnson',
    serviceType: 'Home Wiring',
    location: 'Karen, Nairobi',
    description: 'Need electrical wiring for a new extension. The room is about 4x5 meters and needs 4 power outlets, 2 light switches, and ceiling lighting.',
    submittedAt: new Date('2025-07-20T10:30:00'),
    phone: '+254701234567',
    email: 'sarah.j@email.com',
    contactPreference: 'phone',
    timeline: 'this_week',
    budget: '15k_50k',
    urgency: 'soon',
    referenceNumber: 'QR123456',
    status: 'new',
    photos: [
      { preview: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', name: 'room_overview.jpg' },
      { preview: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400', name: 'wall_layout.jpg' }
    ]
  },
  {
    id: 2,
    customerName: 'David Kimani',
    serviceType: 'Solar Installation',
    location: 'Westlands, Nairobi',
    description: 'Looking to install solar panels for a 3-bedroom house. Want to reduce electricity bills and have backup power during outages.',
    submittedAt: new Date('2025-07-20T08:15:00'),
    phone: '+254722345678',
    email: 'david.k@email.com',
    contactPreference: 'whatsapp',
    timeline: 'within_month',
    budget: 'over_100k',
    urgency: 'flexible',
    referenceNumber: 'QR123457',
    status: 'new',
    photos: [
      { preview: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', name: 'roof_view.jpg' },
      { preview: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400', name: 'electrical_panel.jpg' },
      { preview: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400', name: 'house_front.jpg' }
    ]
  },
  {
    id: 3,
    customerName: 'Grace Wanjiku',
    serviceType: 'Emergency Repair',
    location: 'Kilimani, Nairobi',
    description: 'Power socket in kitchen is sparking and not working. Need urgent repair as it\'s a safety concern.',
    submittedAt: new Date('2025-07-20T14:45:00'),
    phone: '+254733456789',
    email: 'grace.w@email.com',
    contactPreference: 'phone',
    timeline: 'asap',
    budget: 'under_5k',
    urgency: 'urgent',
    referenceNumber: 'QR123458',
    status: 'new',
    photos: [
      { preview: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', name: 'sparking_socket.jpg' }
    ]
  },
  {
    id: 4,
    customerName: 'Michael Ochieng',
    serviceType: 'Socket Installation',
    location: 'Langata, Nairobi',
    description: 'Installed 3 additional power outlets in the living room. Customer was very satisfied with the work quality.',
    submittedAt: new Date('2025-07-19T09:00:00'),
    respondedAt: new Date('2025-07-19T11:30:00'),
    phone: '+254744567890',
    email: 'michael.o@email.com',
    timeline: 'this_week',
    budget: '5k_15k',
    status: 'quoted',
    response: 'I can install 3 additional power outlets in your living room. The work will include running new cables, installing outlets, and testing. All materials and labor included.',
    quoteAmount: 'KES 8,500'
  }
])

const recentActivity = ref([
  {
    id: 1,
    type: 'new_quote',
    message: 'New quote request from Grace Wanjiku',
    timestamp: new Date('2025-07-20T14:45:00')
  },
  {
    id: 2,
    type: 'response_sent',
    message: 'Quote sent to Sarah Johnson',
    timestamp: new Date('2025-07-20T12:00:00')
  },
  {
    id: 3,
    type: 'new_quote',
    message: 'New quote request from David Kimani',
    timestamp: new Date('2025-07-20T08:15:00')
  }
])

// Computed properties
const newQuotes = computed(() => {
  return quotes.value.filter(quote => quote.status === 'new')
})

const respondedQuotes = computed(() => {
  return quotes.value.filter(quote => quote.status === 'quoted')
})

// Methods
const formatTimeAgo = (date) => {
  const now = new Date()
  const diff = now - date
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ago`
  } else {
    return `${minutes}m ago`
  }
}

const formatBudget = (budget) => {
  const budgetMap = {
    'under_5k': 'Under KES 5,000',
    '5k_15k': 'KES 5,000 - 15,000',
    '15k_50k': 'KES 15,000 - 50,000',
    '50k_100k': 'KES 50,000 - 100,000',
    'over_100k': 'Over KES 100,000'
  }
  return budgetMap[budget] || budget
}

const formatTimeline = (timeline) => {
  const timelineMap = {
    'asap': 'ASAP',
    'today': 'Today',
    'this_week': 'This week',
    'next_week': 'Next week',
    'within_month': 'Within a month',
    'flexible': 'Flexible'
  }
  return timelineMap[timeline] || timeline
}

const respondToQuote = (quote) => {
  // Temporarily show alert instead of modal
  alert(`Would open response modal for ${quote.customerName}`)
  // selectedQuote.value = quote
  // showResponseModal.value = true
}

const callCustomer = (phone) => {
  window.location.href = `tel:${phone}`
}

const whatsappCustomer = (quote) => {
  const message = encodeURIComponent(`Hi ${quote.customerName}! I received your quote request through FURSA (Ref: #${quote.referenceNumber}). I'd like to discuss your ${quote.serviceType} project. When would be a good time to talk?`)
  window.open(`https://wa.me/${quote.phone.replace('+', '')}?text=${message}`, '_blank')
}

const openPhotoModal = (photos, index) => {
  // Temporarily show alert instead of modal
  alert(`Would open photo viewer for ${photos[index].name}`)
  // selectedPhotos.value = photos
  // selectedPhotoIndex.value = index
  // showPhotoModal.value = true
}

const handleQuoteResponse = (responseData) => {
  // This will be implemented when modal is created
  console.log('Quote response:', responseData)
}

onMounted(() => {
  console.log('Dashboard loaded')
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>