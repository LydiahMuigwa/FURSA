<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ t('dashboard.provider.title') }}</h1>
            <p class="text-gray-600">{{ t('dashboard.provider.welcome', { name: authStore.userDisplayName }) }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Language Dropdown -->
            <div class="relative">
              <button 
                @click="showLanguageDropdown = !showLanguageDropdown"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors bg-white"
                aria-label="Select Language"
              >
                <span class="text-lg">{{ currentLanguageFlag }}</span>
                <span class="text-sm font-medium text-gray-700">{{ currentLanguageName }}</span>
                <ChevronDown :class="[
                  'w-4 h-4 text-gray-500 transition-transform',
                  showLanguageDropdown ? 'rotate-180' : ''
                ]" />
              </button>

              <div 
                v-if="showLanguageDropdown" 
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <button 
                  @click="switchToLanguage('en')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between',
                    currentLanguage === 'en' ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  ]"
                >
                  <div class="flex items-center space-x-3">
                    <span class="text-lg">🇬🇧</span>
                    <div>
                      <div class="text-sm font-medium text-gray-900">English</div>
                      <div class="text-xs text-gray-500">English</div>
                    </div>
                  </div>
                  <Check v-if="currentLanguage === 'en'" class="w-4 h-4 text-blue-600" />
                </button>
                
                <button 
                  @click="switchToLanguage('sw')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between',
                    currentLanguage === 'sw' ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  ]"
                >
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
            
            <button 
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell class="w-6 h-6" />
            </button>
            
            <button 
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Settings"
            >
              <Settings class="w-6 h-6" />
            </button>

            <button 
              @click="handleLogout" 
              class="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all text-sm"
            >
              <LogOut class="w-4 h-4 mr-2" />
              {{ t('auth.logout') }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Dashboard Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">{{ t('common.loading') }}</span>
      </div>

      <!-- Error State -->
      <div v-else-if="errorState" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{{ t('errors.load_failed') }}</h3>
            <p class="mt-1 text-sm text-red-700">{{ errorState }}</p>
            <button 
              @click="loadDashboardData" 
              class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              {{ t('common.try_again') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- New Requests -->
          <div class="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
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
          <div class="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
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
          
          <!-- Published Stories -->
          <div 
            @click="$router.push('/app/provider-dashboard/my-stories')" 
            class="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen class="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">{{ t('dashboard.provider.stats.published_stories') }}</p>
                <p class="text-2xl font-semibold text-gray-900">{{ provider.totalStories || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Rating -->
          <div class="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star class="w-4 h-4 text-yellow-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">{{ t('dashboard.provider.stats.rating') }}</p>
                <p class="text-2xl font-semibold text-gray-900">{{ formatRating(stats.rating) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Story Builder CTA -->
        <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2">{{ t('stories.cta.title') }}</h3>
              <p class="text-purple-100 mb-4">{{ t('stories.cta.subtitle') }}</p>
              <div class="flex items-center text-sm text-purple-100">
                <span class="mr-4">📸 {{ t('stories.cta.benefits.visual') }}</span>
                <span class="mr-4">🎥 {{ t('stories.cta.benefits.voice') }}</span>
                <span>⭐ {{ t('stories.cta.benefits.standout') }}</span>
              </div>
            </div>
            <div class="ml-6">
              <button 
                @click="goToStoryBuilder"
                class="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg flex items-center"
              >
                <BookOpen class="w-5 h-5 mr-2" />
                {{ t('stories.cta.button') }}
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
                      <button 
                        @click="activeTab = 'new'"
                        :class="[
                          'py-2 px-1 border-b-2 font-medium text-sm',
                          activeTab === 'new' 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        ]"
                      >
                        {{ t('dashboard.provider.quote_requests.new') }} ({{ newQuotes.length }})
                      </button>
                      <button 
                        @click="activeTab = 'responded'"
                        :class="[
                          'py-2 px-1 border-b-2 font-medium text-sm',
                          activeTab === 'responded' 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        ]"
                      >
                        {{ t('dashboard.provider.quote_requests.responded') }} ({{ respondedQuotes.length }})
                      </button>
                    </nav>
                  </div>
                </div>
              </div>

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
                        <h3 class="text-lg font-medium text-gray-900">{{ quote.customerName }}</h3>
                        <p class="text-sm text-gray-500">{{ quote.serviceType }}</p>
                        <p class="mt-2 text-sm text-gray-700 line-clamp-2">{{ quote.description }}</p>
                      </div>
                      <div class="flex items-center space-x-2 ml-4">
                        <button 
                          @click="respondToQuote(quote)"
                          class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                          {{ t('common.respond') }}
                        </button>
                        <button 
                          v-if="quote.photos && quote.photos.length > 0"
                          @click="openPhotoModal(quote.photos, 0)"
                          class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          :aria-label="`View ${quote.photos.length} photos`"
                        >
                          <Image class="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div class="flex items-center">
                        <MapPin class="w-4 h-4 text-gray-400 mr-2" />
                        <span>{{ quote.location }}</span>
                      </div>
                      <div class="flex items-center">
                        <DollarSign class="w-4 h-4 text-gray-400 mr-2" />
                        <span>{{ formatBudget(quote.budget) }}</span>
                      </div>
                      <div class="flex items-center">
                        <Clock class="w-4 h-4 text-gray-400 mr-2" />
                        <span>{{ formatTimeline(quote.timeline) }}</span>
                      </div>
                      <div class="flex items-center">
                        <Calendar class="w-4 h-4 text-gray-400 mr-2" />
                        <span>{{ formatDate(quote.submittedAt) }}</span>
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
                        <h3 class="text-lg font-medium text-gray-900">{{ quote.customerName }}</h3>
                        <p class="text-sm text-gray-500">{{ quote.serviceType }}</p>
                        <p class="mt-2 text-sm text-gray-700">{{ quote.response }}</p>
                      </div>
                      <div class="flex items-center space-x-2 ml-4">
                        <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {{ quote.status === 'accepted' ? t('common.accepted') : t('common.quoted') }}
                        </span>
                      </div>
                    </div>
                    <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div class="flex items-center">
                        <DollarSign class="w-4 h-4 text-gray-400 mr-2" />
                        <span class="font-medium">{{ quote.quoteAmount }}</span>
                      </div>
                      <div class="flex items-center">
                        <Calendar class="w-4 h-4 text-gray-400 mr-2" />
                        <span>{{ formatDate(quote.respondedAt) }}</span>
                      </div>
                    </div>
                    <div class="mt-4 flex space-x-3">
                      <button 
                        @click="callCustomer(quote.phone)"
                        class="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <Phone class="w-4 h-4 mr-2" />
                        {{ t('common.call') }}
                      </button>
                      <button 
                        @click="whatsappCustomer(quote)"
                        class="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <MessageCircle class="w-4 h-4 mr-2" />
                        WhatsApp
                      </button>
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
                <button 
                  @click="showScheduleModal = true"
                  class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Calendar class="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ t('dashboard.provider.quick_actions.schedule') }}</div>
                    <div class="text-xs text-gray-500">{{ t('dashboard.provider.quick_actions.schedule_desc') }}</div>
                  </div>
                </button>
                
                <button 
                  @click="$router.push('/app/provider-dashboard/earnings')"
                  class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <DollarSign class="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ t('dashboard.provider.quick_actions.earnings') }}</div>
                    <div class="text-xs text-gray-500">{{ t('dashboard.provider.quick_actions.earnings_desc') }}</div>
                  </div>
                </button>
                
                <button 
                  @click="$router.push('/app/provider-dashboard/reviews')"
                  class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Star class="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ t('dashboard.provider.quick_actions.reviews') }}</div>
                    <div class="text-xs text-gray-500">{{ t('dashboard.provider.quick_actions.reviews_desc') }}</div>
                  </div>
                </button>
                
                <button 
                  @click="$router.push('/app/provider-dashboard/settings')"
                  class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
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
                    <div 
                      class="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                      :style="{ width: performance.responseRate + '%' }"
                    ></div>
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
                      getActivityColor(activity.type)
                    ]">
                      <component :is="getActivityIcon(activity.type)" class="w-4 h-4" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-900">{{ activity.description }}</p>
                    <p class="text-xs text-gray-500">{{ formatTimeAgo(activity.timestamp) }}</p>
                  </div>
                </div>
                <div v-if="recentActivity.length === 0" class="text-center py-4 text-sm text-gray-500">
                  {{ t('dashboard.provider.recent_activity.empty') }}
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

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Bell, DollarSign, Star, Calendar, MapPin, Clock, Phone, MessageCircle,
  CheckCircle, Settings, ChevronDown, Check, BookOpen, LogOut, Image
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import ApiService from '@/services/api'

// Modal imports
import QuoteResponseModal from '@/components/service-provider/modals/QuoteResponseModal.vue'
import PhotoViewerModal from '@/components/service-provider/modals/PhotoViewerModal.vue'
import QuoteResponseSuccessModal from '@/components/service-provider/modals/QuoteResponseSuccessModal.vue'
import ScheduleManagementModal from '@/components/service-provider/modals/ScheduleManagementModal.vue'

// Composables
const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()

// Component state
const activeTab = ref('new')
const showResponseModal = ref(false)
const showPhotoModal = ref(false)
const showSuccessModal = ref(false)
const showScheduleModal = ref(false)
const showLanguageDropdown = ref(false)
const selectedQuote = ref(null)
const selectedPhotos = ref([])
const selectedPhotoIndex = ref(0)
const lastQuoteResponse = ref(null)
const isLoading = ref(true)
const errorState = ref(null)

// Auto-refresh interval
let refreshInterval = null

// Dashboard data
const provider = ref({
  totalStories: 0,
  hasStories: false
})

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

const currentLanguage = computed(() => locale.value)
const currentLanguageFlag = computed(() => {
  return currentLanguage.value === 'sw' ? '🇰🇪' : '🇬🇧'
})
const currentLanguageName = computed(() => {
  return currentLanguage.value === 'sw' ? 'Kiswahili' : 'English'
})

// Methods
const validateUserAccess = () => {
  if (!authStore.isAuthenticated) {
    router.push('/app')
    throw new Error('User not authenticated')
  }
  
  if (!authStore.isProvider) {
    const redirectPath = authStore.isTalent ? '/app/talent-dashboard' : '/app'
    router.push(redirectPath)
    throw new Error('User is not a provider')
  }
}

const loadDashboardData = async () => {
  try {
    isLoading.value = true
    errorState.value = null
    
    const providerId = authStore.user._id || authStore.user.id
    
    if (!providerId) {
      throw new Error(t('errors.provider_not_found'))
    }
    
    // Load all data in parallel for better performance
    const [
      providerResponse,
      statsResponse,
      performanceResponse,
      quotesResponse,
      activityResponse
    ] = await Promise.allSettled([
      ApiService.getServiceProviderProfile(providerId),
      ApiService.getServiceProviderStats(providerId),
      ApiService.getProviderPerformance(providerId),
      ApiService.getProviderQuotes(providerId),
      ApiService.getProviderActivity(providerId)
    ])
    
    // Handle provider profile
    if (providerResponse.status === 'fulfilled') {
      provider.value = {
        ...providerResponse.value,
        totalStories: providerResponse.value.stories?.length || 0,
        hasStories: (providerResponse.value.stories?.length || 0) > 0
      }
    }
    
    // Handle stats
    if (statsResponse.status === 'fulfilled') {
      stats.value = {
        newRequests: statsResponse.value.pendingQuotes || 0,
        activeQuotes: statsResponse.value.activeQuotes || 0,
        rating: statsResponse.value.averageRating || 0,
        monthlyJobs: statsResponse.value.monthlyJobs || 0
      }
    }
    
    // Handle performance metrics
    if (performanceResponse.status === 'fulfilled') {
      performance.value = {
        responseRate: performanceResponse.value.responseRate || 0,
        avgResponseTime: performanceResponse.value.avgResponseTime || t('dashboard.provider.performance.no_data'),
        jobsCompleted: performanceResponse.value.completedJobs || 0
      }
    }
    
    // Handle quotes
    if (quotesResponse.status === 'fulfilled') {
      quotes.value = quotesResponse.value.map(transformQuote)
    }
    
    // Handle recent activity
    if (activityResponse.status === 'fulfilled') {
      recentActivity.value = activityResponse.value.map(transformActivity)
    }
    
    // Log any failed requests
    const failedRequests = [providerResponse, statsResponse, performanceResponse, quotesResponse, activityResponse]
      .filter(result => result.status === 'rejected')
    
    if (failedRequests.length > 0) {
      console.warn('Some dashboard data failed to load:', failedRequests)
    }
    
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    errorState.value = error.message || t('errors.load_dashboard_failed')
  } finally {
    isLoading.value = false
  }
}

const refreshData = async () => {
  try {
    const providerId = authStore.user._id || authStore.user.id
    const [statsResponse, quotesResponse] = await Promise.allSettled([
      ApiService.getServiceProviderStats(providerId),
      ApiService.getProviderQuotes(providerId)
    ])
    
    if (statsResponse.status === 'fulfilled') {
      stats.value.newRequests = statsResponse.value.pendingQuotes || 0
      stats.value.activeQuotes = statsResponse.value.activeQuotes || 0
    }
    
    if (quotesResponse.status === 'fulfilled') {
      quotes.value = quotesResponse.value.map(transformQuote)
    }
    
  } catch (error) {
    console.warn('Failed to refresh dashboard data:', error)
  }
}

const transformQuote = (quote) => ({
  id: quote.id,
  customerName: quote.customer?.name || 'Unknown Customer',
  serviceType: quote.serviceType,
  description: quote.description,
  location: quote.location,
  budget: quote.budgetRange,
  timeline: quote.timeline,
  phone: quote.customer?.phone || '',
  status: quote.status,
  submittedAt: new Date(quote.createdAt),
  respondedAt: quote.respondedAt ? new Date(quote.respondedAt) : null,
  referenceNumber: quote.referenceNumber,
  response: quote.providerResponse,
  quoteAmount: quote.quoteAmount ? `${t('common.currency')} ${quote.quoteAmount.toLocaleString()}` : null,
  photos: quote.attachments || []
})

const transformActivity = (activity) => ({
  id: activity.id,
  type: activity.type,
  description: activity.description,
  timestamp: new Date(activity.createdAt)
})

const setupAutoRefresh = () => {
  // Refresh data every 5 minutes
  refreshInterval = setInterval(() => {
    refreshData()
  }, 5 * 60 * 1000)
}

const handleUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  
  if (urlParams.get('story') === 'published') {
    console.log('Story published successfully!')
    cleanupUrl('story')
  }
  
  if (urlParams.get('tab')) {
    activeTab.value = urlParams.get('tab')
    cleanupUrl('tab')
  }
}

const cleanupUrl = (param) => {
  const url = new URL(window.location)
  url.searchParams.delete(param)
  window.history.replaceState({}, '', url)
}

const initializeDashboard = async () => {
  try {
    validateUserAccess()
    await loadDashboardData()
    setupAutoRefresh()
    handleUrlParams()
  } catch (error) {
    console.error('Dashboard initialization failed:', error)
    if (error.message !== 'User not authenticated' && error.message !== 'User is not a provider') {
      errorState.value = error.message || t('errors.initialization_failed')
    }
  }
}

// Language switching
const switchToLanguage = async (langCode) => {
  try {
    locale.value = langCode
    localStorage.setItem('fursa-language', langCode)
    showLanguageDropdown.value = false
    
    if (authStore.user) {
      await updateLanguagePreference(langCode)
    }
  } catch (error) {
    console.error('Failed to switch language:', error)
  }
}

const updateLanguagePreference = async (langCode) => {
  try {
    const providerId = authStore.user._id || authStore.user.id
    await ApiService.updateProviderPreferences(providerId, {
      language: langCode
    })
  } catch (error) {
    console.error('Failed to update language preference:', error)
  }
}

// Quote handling
const respondToQuote = (quote) => {
  selectedQuote.value = quote
  showResponseModal.value = true
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
      quotes.value[quoteIndex].quoteAmount = `${t('common.currency')} ${responseData.amount.toLocaleString()}`
      quotes.value[quoteIndex].respondedAt = new Date()
      
      // Update stats
      stats.value.activeQuotes += 1
      stats.value.newRequests = Math.max(0, stats.value.newRequests - 1)
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

const openPhotoModal = (photos, index = 0) => {
  if (!photos || photos.length === 0) {
    console.warn('No photos to display')
    return
  }
  
  selectedPhotos.value = photos
  selectedPhotoIndex.value = index
  showPhotoModal.value = true
}

const callCustomer = (phone) => {
  if (!phone) {
    console.warn('No phone number provided')
    return
  }
  
  // Validate and clean phone number
  const cleanPhone = phone.replace(/[\s+()-]/g, '')
  if (!/^\d{7,15}$/.test(cleanPhone)) {
    console.warn('Invalid phone number format:', phone)
    return
  }
  
  window.location.href = `tel:${phone}`
}

const whatsappCustomer = (quote) => {
  if (!quote?.phone) {
    console.warn('No phone number available for WhatsApp')
    return
  }
  
  const message = encodeURIComponent(
    t('messages.whatsapp_template', {
      customerName: quote.customerName,
      referenceNumber: quote.referenceNumber || 'N/A',
      serviceType: quote.serviceType
    })
  )
  
  const cleanPhone = quote.phone.replace(/[\s+()-]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
}

const goToStoryBuilder = () => {
  router.push('/app/provider-dashboard/story-builder')
}

const handleViewResponded = () => {
  activeTab.value = 'responded'
  showSuccessModal.value = false
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/app')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Formatting functions
const formatTimeAgo = (date) => {
  if (!date) return ''
  
  try {
    const now = new Date()
    const diff = now - new Date(date)
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days > 0) {
      return t('time_ago.days', { count: days })
    } else if (hours > 0) {
      return t('time_ago.hours', { count: hours })
    } else {
      return t('time_ago.minutes', { count: Math.max(1, minutes) })
    }
  } catch (error) {
    console.warn('Error formatting time ago:', error)
    return 'Recently'
  }
}

const formatDate = (date) => {
  if (!date) return ''
  
  try {
    return new Date(date).toLocaleDateString(currentLanguage.value === 'sw' ? 'sw-KE' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch (error) {
    console.warn('Error formatting date:', error)
    return 'Invalid date'
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

const formatRating = (rating) => {
  if (!rating || rating === 0) return 'N/A'
  return rating.toFixed(1)
}

const getActivityColor = (type) => {
  const colorMap = {
    'quote': 'bg-blue-100 text-blue-600',
    'review': 'bg-yellow-100 text-yellow-600',
    'job': 'bg-emerald-100 text-emerald-600',
    'payment': 'bg-green-100 text-green-600',
    'profile': 'bg-purple-100 text-purple-600',
    'default': 'bg-gray-100 text-gray-600'
  }
  return colorMap[type] || colorMap.default
}

const getActivityIcon = (type) => {
  const iconMap = {
    'quote': Bell,
    'review': Star,
    'job': CheckCircle,
    'payment': DollarSign,
    'profile': Settings,
    'default': Bell
  }
  return iconMap[type] || iconMap.default
}

// Lifecycle hooks
onMounted(() => {
  // Initialize language from localStorage
  const savedLanguage = localStorage.getItem('fursa-language')
  if (savedLanguage && ['en', 'sw'].includes(savedLanguage)) {
    locale.value = savedLanguage
  }
  
  initializeDashboard()
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
})

// Click outside handler for dropdown
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.language-dropdown')
  if (!dropdown && showLanguageDropdown.value) {
    showLanguageDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s ease-in-out;
}

/* Custom line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced hover effects */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Focus styles for accessibility */
button:focus-visible,
a:focus-visible {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
  ring-offset: 2px;
}

/* Gradient background for CTA */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-purple-600 {
  --tw-gradient-from: #9333ea;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(147, 51, 234, 0));
}

.via-pink-600 {
  --tw-gradient-stops: var(--tw-gradient-from), #db2777, var(--tw-gradient-to, rgba(219, 39, 119, 0));
}

.to-orange-500 {
  --tw-gradient-to: #f97316;
}

/* Custom scrollbar for activity feed */
.activity-scroll {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

.activity-scroll::-webkit-scrollbar {
  width: 6px;
}

.activity-scroll::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.activity-scroll::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.activity-scroll::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Language dropdown positioning */
.language-dropdown {
  position: relative;
}

/* Stats card hover animation */
.stats-card {
  transform: translateY(0);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.stats-card:hover {
  transform: translateY(-2px);
}

/* Progress bar animation */
.progress-bar {
  transition: width 0.5s ease-in-out;
}

/* Quote card hover effect */
.quote-card:hover {
  background-color: #f9fafb;
  border-left: 4px solid #3b82f6;
  padding-left: calc(1.5rem - 4px);
}

/* Button loading state */
.btn-loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-loading::after {
  content: '';
  width: 16px;
  height: 16px;
  margin-left: 8px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

/* Error state styling */
.error-card {
  border-left: 4px solid #ef4444;
}

/* Success state styling */
.success-card {
  border-left: 4px solid #10b981;
}

/* Tab active state */
.tab-active {
  border-bottom-color: #3b82f6;
  color: #3b82f6;
}

/* Modal backdrop */
.modal-backdrop {
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.5);
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .quote-details-grid {
    grid-template-columns: 1fr;
  }
}

/* Dark mode support (if needed) */
@media (prefers-color-scheme: dark) {
  .dark-mode {
    --bg-primary: #1f2937;
    --bg-secondary: #374151;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #4b5563;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .dashboard-container {
    background: white !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .high-contrast {
    --border-width: 2px;
    --text-contrast: black;
    --bg-contrast: white;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>