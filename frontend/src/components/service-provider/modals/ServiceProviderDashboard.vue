<!-- ServiceProviderDashboard.vue - Complete implementation with working language selector -->
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

    <!-- Dashboard Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- New Requests -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell class="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ t('dashboard.provider.stats.new_requests') }}</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.newRequests }}</p>
            </div>
          </div>
        </div>

        <!-- Active Quotes -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <DollarSign class="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ t('dashboard.provider.stats.active_quotes') }}</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeQuotes }}</p>
            </div>
          </div>
        </div>

        <!-- Rating -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star class="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ t('dashboard.provider.stats.rating') }}</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.rating }}</p>
            </div>
          </div>
        </div>

        <!-- This Month -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar class="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">{{ t('dashboard.provider.stats.this_month') }}</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.monthlyJobs }}</p>
            </div>
          </div>
        </div>
      </div>

       <!-- STORY BUILDER CALL-TO-ACTION CARD -->
  <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-xl p-6 mb-8 text-white">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <h3 class="text-xl font-bold mb-2">{{ t('stories.cta.title') || 'Share Your Professional Story' }}</h3>
        <p class="text-purple-100 mb-4">{{ t('stories.cta.subtitle') || 'Show customers how you work, not just what you do. Build your visual portfolio today.' }}</p>
        <div class="flex items-center text-sm text-purple-100">
          <span class="mr-4">📸 Visual portfolios</span>
          <span class="mr-4">🎥 Voice introductions</span>
          <span>⭐ Stand out from competition</span>
        </div>
      </div>
      <div class="ml-6">
        <button @click="$router.push('/app/provider/story-builder')"
                class="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg flex items-center">
          <BookOpen class="w-5 h-5 mr-2" />
          {{ t('stories.cta.button') || 'Tell Your Story' }}
        </button>
      </div>
    </div>
  </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Quote Requests -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">{{ t('dashboard.provider.quote_requests.title') }}</h2>
              
              <!-- Tabs -->
              <div class="mt-4">
                <div class="border-b border-gray-200">
                  <nav class="-mb-px flex space-x-8">
                    <button @click="activeTab = 'new'"
                            :class="[
                              'py-2 px-1 border-b-2 font-medium text-sm',
                              activeTab === 'new' 
                                ? 'border-blue-500 text-blue-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            ]">
                      {{ t('dashboard.provider.quote_requests.new') }} ({{ newQuotes.length }})
                    </button>
                    <button @click="activeTab = 'responded'"
                            :class="[
                              'py-2 px-1 border-b-2 font-medium text-sm',
                              activeTab === 'responded' 
                                ? 'border-blue-500 text-blue-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            ]">
                      {{ t('dashboard.provider.quote_requests.responded') }} ({{ respondedQuotes.length }})
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            <!-- Quote List -->
            <div class="divide-y divide-gray-200">
              <!-- New Quotes Tab -->
              <div v-if="activeTab === 'new'">
                <div v-if="newQuotes.length === 0" class="p-8 text-center">
                  <Bell class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('dashboard.provider.quote_requests.no_new_requests') }}</h3>
                  <p class="mt-1 text-sm text-gray-500">{{ t('dashboard.provider.quote_requests.no_new_requests_desc') }}</p>
                </div>
                
                <div v-for="quote in newQuotes" :key="quote.id" class="p-6 hover:bg-gray-50">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-medium text-gray-900">{{ quote.customerName }}</h3>
                        <span class="text-xs text-gray-500">{{ formatTimeAgo(quote.submittedAt) }}</span>
                      </div>
                      
                      <p class="text-sm text-blue-600 font-medium mb-1">{{ quote.serviceType }}</p>
                      <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ quote.description }}</p>
                      
                      <div class="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                        <div class="flex items-center">
                          <MapPin class="w-3 h-3 mr-1" />
                          {{ quote.location }}
                        </div>
                        <div class="flex items-center">
                          <DollarSign class="w-3 h-3 mr-1" />
                          {{ formatBudget(quote.budget) }}
                        </div>
                        <div class="flex items-center">
                          <Clock class="w-3 h-3 mr-1" />
                          {{ formatTimeline(quote.timeline) }}
                        </div>
                      </div>
                      
                      <!-- Photos -->
                      <div v-if="quote.photos && quote.photos.length > 0" class="flex space-x-2 mb-3">
                        <button v-for="(photo, index) in quote.photos.slice(0, 3)" :key="index"
                                @click="openPhotoModal(quote.photos, index)"
                                class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 hover:opacity-75 transition-opacity">
                          <img :src="photo" :alt="`Photo ${index + 1}`" class="w-full h-full object-cover" />
                        </button>
                        <button v-if="quote.photos.length > 3"
                                @click="openPhotoModal(quote.photos, 3)"
                                class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                          +{{ quote.photos.length - 3 }}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Actions -->
                  <div class="flex items-center justify-between mt-4">
  <button @click="respondToQuote(quote)"
          class="flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
    <MessageSquare class="w-4 h-4 mr-2" />
    {{ t('quotes.respond') }}
  </button>
  
  <div class="flex items-center space-x-2">
    <button @click="callCustomer(quote.phone)" class="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
      <Phone class="w-5 h-5" />
    </button>
    <button @click="whatsappCustomer(quote)" class="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
      <MessageCircle class="w-5 h-5" />
    </button>
  </div>
</div>
                </div>
              </div>

              <!-- Responded Quotes Tab -->
              <div v-if="activeTab === 'responded'">
                <div v-if="respondedQuotes.length === 0" class="p-8 text-center">
                  <CheckCircle class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('dashboard.provider.quote_requests.no_responses') }}</h3>
                  <p class="mt-1 text-sm text-gray-500">{{ t('dashboard.provider.quote_requests.no_responses_desc') }}</p>
                </div>
                
                <div v-for="quote in respondedQuotes" :key="quote.id" class="p-6 hover:bg-gray-50">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-medium text-gray-900">{{ quote.customerName }}</h3>
                        <span class="text-xs text-emerald-600 font-medium">{{ quote.quoteAmount }}</span>
                      </div>
                      
                      <p class="text-sm text-blue-600 font-medium mb-1">{{ quote.serviceType }}</p>
                      <p class="text-sm text-gray-600 mb-2">{{ quote.response }}</p>
                      
                      <div class="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Responded {{ formatTimeAgo(quote.respondedAt) }}</span>
                        <span>•</span>
                        <span>Ref: #{{ quote.referenceNumber }}</span>
                      </div>
                    </div>
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
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('dashboard.provider.quick_actions.title') }}</h3>
            <div class="space-y-3">
              <button @click="showScheduleModal = true"
                      class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Calendar class="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ t('dashboard.provider.quick_actions.schedule') }}</div>
                  <div class="text-xs text-gray-500">{{ t('dashboard.provider.quick_actions.schedule_desc') }}</div>
                </div>
              </button>
              
              <button class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <DollarSign class="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ t('dashboard.provider.quick_actions.earnings') }}</div>
                  <div class="text-xs text-gray-500">{{ t('dashboard.provider.quick_actions.earnings_desc') }}</div>
                </div>
              </button>
              
              <button class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Star class="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ t('dashboard.provider.quick_actions.reviews') }}</div>
                  <div class="text-xs text-gray-500">{{ t('dashboard.provider.quick_actions.reviews_desc') }}</div>
                </div>
              </button>
              
              <button class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Settings class="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ t('dashboard.provider.quick_actions.settings') }}</div>
                  <div class="text-xs text-gray-500">{{ t('dashboard.provider.quick_actions.settings_desc') }}</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Performance This Month -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('dashboard.provider.performance.title') }}</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm text-gray-600">{{ t('dashboard.provider.performance.response_rate') }}</span>
                  <span class="text-sm font-semibold text-gray-900">{{ performance.responseRate }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-emerald-500 h-2 rounded-full" :style="{ width: performance.responseRate + '%' }"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">{{ t('dashboard.provider.performance.avg_response_time') }}</span>
                  <span class="text-sm font-semibold text-gray-900">{{ performance.avgResponseTime }}</span>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">{{ t('dashboard.provider.performance.jobs_completed') }}</span>
                  <span class="text-sm font-semibold text-gray-900">{{ performance.jobsCompleted }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('dashboard.provider.recent_activity.title') }}</h3>
            <div class="space-y-3">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    activity.type === 'quote' ? 'bg-blue-100' :
                    activity.type === 'review' ? 'bg-yellow-100' :
                    activity.type === 'job' ? 'bg-emerald-100' : 'bg-gray-100'
                  ]">
                    <Bell v-if="activity.type === 'quote'" class="w-4 h-4 text-blue-600" />
                    <Star v-else-if="activity.type === 'review'" class="w-4 h-4 text-yellow-600" />
                    <CheckCircle v-else-if="activity.type === 'job'" class="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500">{{ formatTimeAgo(activity.timestamp) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
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

<template>
  <!-- [Previous template content remains exactly the same] -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Bell, DollarSign, Star, Calendar, MapPin, Clock, Phone, Mail, MessageCircle,
  CheckCircle, Settings, ChevronDown, Check, BookOpen
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ApiService from '@/services/api'
import { useRouter } from 'vue-router'

// Modal imports
import QuoteResponseModal from '@/components/service-provider/modals/QuoteResponseModal.vue'
import PhotoViewerModal from '@/components/service-provider/modals/PhotoViewerModal.vue'
import QuoteResponseSuccessModal from '@/components/service-provider/modals/QuoteResponseSuccessModal.vue'
import ScheduleManagementModal from '@/components/service-provider/modals/ScheduleManagementModal.vue'

// Router
const router = useRouter()

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
const isLoading = ref(true)
const errorState = ref(null)

// Language selector state
const showLanguageDropdown = ref(false)
const currentLanguage = computed(() => locale.value)
const currentLanguageFlag = computed(() => {
  return currentLanguage.value === 'sw' ? '🇰🇪' : '🇬🇧'
})
const currentLanguageName = computed(() => {
  return currentLanguage.value === 'sw' ? 'Kiswahili' : 'English'
})

// Provider data
const providerData = ref(null)
const providerName = ref('')

// Dashboard data
const stats = ref({
  newRequests: 0,
  activeQuotes: 0,
  rating: 0,
  monthlyJobs: 0
})

const performance = ref({
  responseRate: 0,
  avgResponseTime: '0 hours',
  jobsCompleted: 0
})

const quotes = ref([])
const recentActivity = ref([])

// Computed properties
const newQuotes = computed(() => {
  return quotes.value.filter(quote => quote.status === 'new')
})

const respondedQuotes = computed(() => {
  return quotes.value.filter(quote => quote.status === 'quoted' || quote.status === 'accepted')
})

// Methods
const loadProviderData = async () => {
  const providerId = localStorage.getItem('fursa-provider-id')
  if (providerId) {
    try {
      const provider = await ApiService.getServiceProvider(providerId)
      providerData.value = provider
      providerName.value = provider.name
      
      // Load dashboard data after provider data is loaded
      await loadDashboardData()
    } catch (error) {
      console.error('Error loading provider data:', error)
      errorState.value = t('errors.load_provider_failed')
      providerName.value = t('defaults.provider_name')
    }
  } else {
    // Redirect to login if no provider ID found
    router.push('/login?redirect=/app/provider-dashboard')
  }
}

const loadDashboardData = async () => {
  try {
    isLoading.value = true
    
    // Load stats
    const statsResponse = await ApiService.getServiceProviderStats(providerData.value.id)
    stats.value = {
      newRequests: statsResponse.pendingQuotes || 0,
      activeQuotes: statsResponse.activeQuotes || 0,
      rating: statsResponse.averageRating || 0,
      monthlyJobs: statsResponse.monthlyJobs || 0
    }
    
    // Load performance metrics
    const performanceResponse = await ApiService.getProviderPerformance(providerData.value.id)
    performance.value = {
      responseRate: performanceResponse.responseRate || 0,
      avgResponseTime: performanceResponse.avgResponseTime || '0 hours',
      jobsCompleted: performanceResponse.completedJobs || 0
    }
    
    // Load recent quotes
    const quotesResponse = await ApiService.getProviderQuotes(providerData.value.id)
    quotes.value = quotesResponse.map(quote => ({
      id: quote.id,
      customerName: quote.customer.name,
      serviceType: quote.serviceType,
      description: quote.description,
      location: quote.location,
      budget: quote.budgetRange,
      timeline: quote.timeline,
      phone: quote.customer.phone,
      status: quote.status,
      submittedAt: new Date(quote.createdAt),
      respondedAt: quote.respondedAt ? new Date(quote.respondedAt) : null,
      referenceNumber: quote.referenceNumber,
      response: quote.providerResponse,
      quoteAmount: quote.quoteAmount ? `KES ${quote.quoteAmount.toLocaleString()}` : null,
      photos: quote.attachments || []
    }))
    
    // Load recent activity
    const activityResponse = await ApiService.getProviderActivity(providerData.value.id)
    recentActivity.value = activityResponse.map(activity => ({
      id: activity.id,
      type: activity.type,
      description: activity.description,
      timestamp: new Date(activity.createdAt)
    }))
    
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    errorState.value = t('errors.load_dashboard_failed')
  } finally {
    isLoading.value = false
  }
}

const formatTimeAgo = (date) => {
  const now = new Date()
  const diff = now - date
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days > 0) {
    return `${days}d ago`
  } else if (hours > 0) {
    return `${hours}h ago`
  } else {
    return `${minutes}m ago`
  }
}

const formatBudget = (budget) => {
  const budgetMap = {
    'under_5k': t('formats.budget.under_5k'),
    '5k_15k': t('formats.budget.5k_15k'),
    '15k_50k': t('formats.budget.15k_50k'),
    '50k_100k': t('formats.budget.50k_100k'),
    'over_100k': t('formats.budget.over_100k')
  }
  return budgetMap[budget] || budget
}

const formatTimeline = (timeline) => {
  const timelineMap = {
    'asap': t('formats.timeline.asap'),
    'today': t('formats.timeline.today'),
    'this_week': t('formats.timeline.this_week'),
    'next_week': t('formats.timeline.next_week'),
    'within_month': t('formats.timeline.within_month'),
    'flexible': t('formats.timeline.flexible')
  }
  return timelineMap[timeline] || timeline
}

// Language switching function
const switchToLanguage = (langCode) => {
  locale.value = langCode
  localStorage.setItem('fursa-language', langCode)
  showLanguageDropdown.value = false
  
  // Update language preference on server if logged in
  if (providerData.value) {
    updateLanguagePreference(langCode)
  }
}

const updateLanguagePreference = async (langCode) => {
  try {
    await ApiService.updateProviderPreferences(providerData.value.id, {
      language: langCode
    })
  } catch (error) {
    console.error('Failed to update language preference:', error)
  }
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

const handleQuoteResponse = async (responseData) => {
  try {
    const response = await ApiService.respondToQuote(
      selectedQuote.value.id,
      {
        amount: responseData.amount,
        message: responseData.message,
        contactPreference: responseData.contactPreference
      }
    )
    
    // Update local state
    const quoteIndex = quotes.value.findIndex(q => q.id === selectedQuote.value.id)
    if (quoteIndex !== -1) {
      quotes.value[quoteIndex].status = 'quoted'
      quotes.value[quoteIndex].response = responseData.message
      quotes.value[quoteIndex].quoteAmount = `KES ${responseData.amount}`
      quotes.value[quoteIndex].respondedAt = new Date()
      
      // Update stats
      stats.value.activeQuotes += 1
      stats.value.newRequests -= 1
    }
    
    // Store response data for success modal
    lastQuoteResponse.value = {
      customerName: selectedQuote.value.customerName,
      quoteAmount: responseData.amount,
      contactMethod: responseData.contactPreference
    }
    
    // Close response modal and show success modal
    showResponseModal.value = false
    showSuccessModal.value = true
    
  } catch (error) {
    console.error('Error submitting quote response:', error)
    errorState.value = t('errors.quote_response_failed')
  }
}

const callCustomer = (phone) => {
  window.location.href = `tel:${phone}`
}

const whatsappCustomer = (quote) => {
  const message = encodeURIComponent(
    t('messages.whatsapp_template', {
      customerName: quote.customerName,
      referenceNumber: quote.referenceNumber,
      serviceType: quote.serviceType
    })
  )
  window.open(`https://wa.me/${quote.phone.replace('+', '')}?text=${message}`, '_blank')
}

const handleViewResponded = () => {
  activeTab.value = 'responded'
  showSuccessModal.value = false
}

// Initialize
onMounted(() => {
  // Initialize language from localStorage if available
  const savedLanguage = localStorage.getItem('fursa-language')
  if (savedLanguage) {
    locale.value = savedLanguage
  }
  
  // Load provider data
  loadProviderData()
  
  // Check for story published success
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('story') === 'published') {
    // You could show a toast notification here
    console.log('🎉 Story published successfully!')
    
    // Clean up URL
    const url = new URL(window.location)
    url.searchParams.delete('story')
    window.history.replaceState({}, '', url)
  }
})
</script>

<style scoped>
/* [Previous styles remain the same] */
</style>

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