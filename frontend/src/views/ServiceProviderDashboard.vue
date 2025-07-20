<!-- ServiceProviderDashboard.vue - Updated with working modals -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
            <p class="text-gray-600">Welcome back, {{ providerName }}!</p>
          </div>
          <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell class="w-6 h-6" />
            </button>
            <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg">
              <Bell class="w-6 h-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">New Requests</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.newRequests }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <DollarSign class="w-6 h-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Active Quotes</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.activeQuotes }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-lg">
              <Star class="w-6 h-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Rating</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.rating }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-lg">
              <Calendar class="w-6 h-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">This Month</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.monthlyJobs }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Quote Requests -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
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
                  <div class="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <span class="flex items-center">
                      <Phone class="w-4 h-4 mr-1" />
                      {{ quote.phone }}
                    </span>
                    <span class="flex items-center">
                      <Mail class="w-4 h-4 mr-1" />
                      {{ quote.email }}
                    </span>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center space-x-3">
                    <button @click="respondToQuote(quote)"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Respond
                    </button>
                    <button @click="callCustomer(quote.phone)"
                            class="p-2 text-gray-400 hover:text-green-600 transition-colors">
                      <Phone class="w-5 h-5" />
                    </button>
                    <button @click="whatsappCustomer(quote)"
                            class="p-2 text-gray-400 hover:text-green-600 transition-colors">
                      <MessageCircle class="w-5 h-5" />
                    </button>
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
          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-4">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start">
                <div :class="[
                  'w-3 h-3 rounded-full mt-2 mr-3 flex-shrink-0',
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

    <!-- Quote Response Modal -->
    <QuoteResponseModal 
      :is-open="showResponseModal"
      :quote="selectedQuote"
      @close="showResponseModal = false"
      @submit="handleQuoteResponse"
    />

    <!-- Photo Viewer Modal -->
    <PhotoViewerModal 
      :is-open="showPhotoModal"
      :photos="selectedPhotos"
      :initial-index="selectedPhotoIndex"
      @close="showPhotoModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Bell, DollarSign, Star, Calendar, MapPin, Clock, Phone, Mail, MessageCircle,
  CheckCircle, Settings
} from 'lucide-vue-next'

// WORKING MODAL IMPORTS
import QuoteResponseModal from '@/components/service-provider/QuoteResponseModal.vue'
import PhotoViewerModal from '@/components/service-provider/PhotoViewerModal.vue'

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
    description: 'Need electrical wiring for a new extension. The room is about 4×5 meters and needs 4 power outlets, 2 light switches, and ceiling lighting.',
    photos: [
      { name: 'room_view.jpg', preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop' },
      { name: 'electrical_panel.jpg', preview: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop' },
      { name: 'roof_view.jpg', preview: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop' }
    ],
    urgency: 'soon',
    submittedAt: new Date('2025-07-20T15:30:00'),
    phone: '+254712345678',
    email: 'sarah.j@email.com',
    timeline: 'this_week',
    budget: '15k_50k',
    status: 'new',
    referenceNumber: 'QR123456'
  },
  {
    id: 2,
    customerName: 'David Kimani',
    serviceType: 'Socket Installation',
    location: 'Westlands, Nairobi',
    description: 'I need 3 additional power outlets installed in my living room. The room already has electrical wiring but I need more outlets for my home office setup.',
    photos: [
      { name: 'living_room.jpg', preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop' }
    ],
    urgency: 'normal',
    submittedAt: new Date('2025-07-20T08:15:00'),
    phone: '+254723456789',
    email: 'david.k@email.com',
    timeline: 'next_week',
    budget: '5k_15k',
    status: 'new',
    referenceNumber: 'QR123457'
  },
  {
    id: 3,
    customerName: 'Grace Wanjiku',
    serviceType: 'Emergency Repair',
    location: 'Kilimani, Nairobi',
    description: 'Power outage in my apartment. The main breaker keeps tripping and I smell something burning. This is urgent and needs immediate attention.',
    photos: [],
    urgency: 'urgent',
    submittedAt: new Date('2025-07-20T14:45:00'),
    phone: '+254734567890',
    email: 'grace.w@email.com',
    timeline: 'asap',
    budget: 'under_5k',
    status: 'new',
    referenceNumber: 'QR123458'
  },
  {
    id: 4,
    customerName: 'Michael Ochieng',
    serviceType: 'Electrical Maintenance',
    location: 'Lavington, Nairobi',
    description: 'Annual electrical maintenance check for my 3-bedroom house. Need inspection of all wiring, outlets, and electrical panel. Customer was very satisfied with the work quality.',
    photos: [],
    submittedAt: new Date('2025-07-19T09:00:00'),
    respondedAt: new Date('2025-07-19T11:30:00'),
    phone: '+254744567890',
    email: 'michael.o@email.com',
    timeline: 'this_week',
    budget: '5k_15k',
    status: 'quoted',
    response: 'I can install 3 additional power outlets in your living room. The work will include running new cables, installing outlets, and testing. All materials and labor included.',
    quoteAmount: 'KES 8,500',
    referenceNumber: 'QR123459'
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

// WORKING MODAL FUNCTIONS
const respondToQuote = (quote) => {
  selectedQuote.value = quote
  showResponseModal.value = true
}

const openPhotoModal = (photos, index) => {
  selectedPhotos.value = photos
  selectedPhotoIndex.value = index
  showPhotoModal.value = true
}

const handleQuoteResponse = (responseData) => {
  console.log('Quote response submitted:', responseData)
  
  // Update the quote status
  const quoteIndex = quotes.value.findIndex(q => q.id === responseData.quoteId)
  if (quoteIndex !== -1) {
    quotes.value[quoteIndex].status = 'quoted'
    quotes.value[quoteIndex].response = responseData.message
    quotes.value[quoteIndex].quoteAmount = `KES ${responseData.amount}`
    quotes.value[quoteIndex].respondedAt = new Date()
  }
  
  // Close modal
  showResponseModal.value = false
  
  // Show success message
  alert('Quote response sent successfully!')
}

const callCustomer = (phone) => {
  window.location.href = `tel:${phone}`
}

const whatsappCustomer = (quote) => {
  const message = encodeURIComponent(`Hi ${quote.customerName}! I received your quote request through FURSA (Ref: #${quote.referenceNumber}). I'd like to discuss your ${quote.serviceType} project. When would be a good time to talk?`)
  window.open(`https://wa.me/${quote.phone.replace('+', '')}?text=${message}`, '_blank')
}

onMounted(() => {
  console.log('Dashboard loaded with working modals!')
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