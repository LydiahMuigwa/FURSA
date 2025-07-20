<!-- ServiceProviderDashboard.vue - Updated with working language selector -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ t('dashboard.provider.title') }}</h1>
            <p class="text-gray-600">{{ t('dashboard.provider.welcome', { name: providerName }) }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Working Language Dropdown -->
            <div class="relative">
              <button @click="showLanguageDropdown = !showLanguageDropdown"
                      class="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors bg-white">
                <span class="text-lg">{{ currentLanguageFlag }}</span>
                <span class="text-sm font-medium text-gray-700">{{ currentLanguageName }}</span>
                <ChevronDown :class="[
                  'w-4 h-4 text-gray-500 transition-transform',
                  showLanguageDropdown ? 'rotate-180' : ''
                ]" />
              </button>

              <!-- Dropdown Menu -->
              <div v-if="showLanguageDropdown" 
                   class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                
                <!-- English Option -->
                <button @click="switchToLanguage('en')"
                        :class="[
                          'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between',
                          currentLanguage === 'en' ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        ]">
                  <div class="flex items-center space-x-3">
                    <span class="text-lg">🇬🇧</span>
                    <div>
                      <div class="text-sm font-medium text-gray-900">English</div>
                      <div class="text-xs text-gray-500">English</div>
                    </div>
                  </div>
                  <Check v-if="currentLanguage === 'en'" class="w-4 h-4 text-blue-600" />
                </button>
                
                <!-- Swahili Option -->
                <button @click="switchToLanguage('sw')"
                        :class="[
                          'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between',
                          currentLanguage === 'sw' ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        ]">
                  <div class="flex items-center space-x-3">
                    <span class="text-lg">🇰🇪</span>
                    <div>
                      <div class="text-sm font-medium text-gray-900">Kiswahili</div>
                      <div class="text-xs text-gray-500">Swahili</div>
                    </div>
                  </div>
                  <Check v-if="currentLanguage === 'sw'" class="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
            
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

    <!-- Rest of your dashboard content remains exactly the same -->
    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- ... existing stats cards ... -->
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- ... all your existing dashboard content ... -->
      </div>
    </div>

    <!-- All your existing modals -->
    <QuoteResponseModal 
      :is-open="showResponseModal"
      :quote="selectedQuote"
      @close="showResponseModal = false"
      @submit="handleQuoteResponse"
    />

    <PhotoViewerModal 
      :is-open="showPhotoModal"
      :photos="selectedPhotos"
      :initial-index="selectedPhotoIndex"
      @close="showPhotoModal = false"
    />

    <QuoteResponseSuccessModal 
      :is-open="showSuccessModal"
      :customer-name="lastQuoteResponse?.customerName"
      :quote-amount="lastQuoteResponse?.quoteAmount"
      :contact-method="lastQuoteResponse?.contactMethod"
      :total-quotes="quotes.length"
      :response-rate="performance.responseRate"
      :avg-response-time="performance.avgResponseTime"
      @close="showSuccessModal = false"
      @view-responded="handleViewResponded"
    />

    <ScheduleManagementModal 
      :is-open="showScheduleModal"
      @close="showScheduleModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Bell, DollarSign, Star, Calendar, MapPin, Clock, Phone, Mail, MessageCircle,
  CheckCircle, Settings, ChevronDown, Check
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

// Modal imports
import QuoteResponseModal from '@/components/service-provider/modals/QuoteResponseModal.vue'
import PhotoViewerModal from '@/components/service-provider/modals/PhotoViewerModal.vue'
import QuoteResponseSuccessModal from '@/components/service-provider/modals/QuoteResponseSuccessModal.vue'
import ScheduleManagementModal from '@/components/service-provider/modals/ScheduleManagementModal.vue'

// Component state
const activeTab = ref('new')
const { t, locale } = useI18n()
const showResponseModal = ref(false)
const showPhotoModal = ref(false)
const showSuccessModal = ref(false)
const showScheduleModal = ref(false)
const selectedQuote = ref(null)
const selectedPhotos = ref([])
const selectedPhotoIndex = ref(0)
const lastQuoteResponse = ref(null)

// Language selector state
const showLanguageDropdown = ref(false)
const currentLanguage = computed(() => locale.value)
const currentLanguageFlag = computed(() => {
  return currentLanguage.value === 'sw' ? '🇰🇪' : '🇬🇧'
})
const currentLanguageName = computed(() => {
  return currentLanguage.value === 'sw' ? 'Kiswahili' : 'English'
})

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
  // ... your existing quote data ...
])

const recentActivity = ref([
  // ... your existing activity data ...
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

// Language switching function
const switchToLanguage = (langCode) => {
  locale.value = langCode
  localStorage.setItem('fursa-language', langCode)
  showLanguageDropdown.value = false
  
  const languageName = langCode === 'sw' ? 'Kiswahili' : 'English'
  console.log(`Language switched to ${languageName}`)
}

// Modal functions
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
  
  // Store response data for success modal
  lastQuoteResponse.value = {
    customerName: selectedQuote.value?.customerName,
    quoteAmount: responseData.amount,
    contactMethod: responseData.contactPreference
  }
  
  // Close response modal and show success modal
  showResponseModal.value = false
  showSuccessModal.value = true
}

const callCustomer = (phone) => {
  window.location.href = `tel:${phone}`
}

const whatsappCustomer = (quote) => {
  const message = encodeURIComponent(`Hi ${quote.customerName}! I received your quote request through FURSA (Ref: #${quote.referenceNumber}). I'd like to discuss your ${quote.serviceType} project. When would be a good time to talk?`)
  window.open(`https://wa.me/${quote.phone.replace('+', '')}?text=${message}`, '_blank')
}

const handleViewResponded = () => {
  activeTab.value = 'responded'
}

onMounted(() => {
  // Initialize language from localStorage if available
  const savedLanguage = localStorage.getItem('fursa-language')
  if (savedLanguage) {
    locale.value = savedLanguage
  }
  console.log('Dashboard loaded with working language selector!')
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions for dropdown */
* {
  transition: all 0.2s ease;
}
</style>