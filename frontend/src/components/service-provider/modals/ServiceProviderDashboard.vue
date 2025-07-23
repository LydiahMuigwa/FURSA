<!-- ServiceProviderDashboard.vue - INTEGRATED VERSION (works inside ProviderDashboardLayout) -->
<template>
  <div class="space-y-6">
    <!-- Welcome Header (replaces the standalone header) -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Welcome back, {{ authStore.userDisplayName }}!</h1>
          <p class="text-gray-600 mt-1">Here's what's happening with your business today.</p>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Language Dropdown (moved from header to dashboard content) -->
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
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Loading your dashboard...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="errorState" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Failed to load dashboard</h3>
          <p class="mt-1 text-sm text-red-700">{{ errorState }}</p>
          <button 
            @click="loadDashboardData" 
            class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-6">
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
              <p class="text-sm font-medium text-gray-500">New Requests</p>
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
              <p class="text-sm font-medium text-gray-500">Active Quotes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeQuotes }}</p>
            </div>
          </div>
        </div>
        
        <!-- Published Stories -->
        <div 
          @click="goToStoryBuilder" 
          class="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <BookOpen class="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Published Stories</p>
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
              <p class="text-sm font-medium text-gray-500">Rating</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formatRating(stats.rating) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Story Builder CTA -->
      <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-xl font-bold mb-2">Tell Your Professional Story</h3>
            <p class="text-purple-100 mb-4">Share your work and expertise to attract more customers</p>
            <div class="flex flex-wrap items-center text-sm text-purple-100 gap-4">
              <span class="flex items-center">📸 Showcase your work</span>
              <span class="flex items-center">🎥 Add voice introduction</span>
              <span class="flex items-center">⭐ Stand out from competition</span>
            </div>
          </div>
          <div class="ml-6">
            <button 
              @click="goToStoryBuilder"
              class="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg flex items-center"
            >
              <BookOpen class="w-5 h-5 mr-2" />
              Create Story
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quote Requests -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Quote Requests</h2>
              
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
                      New ({{ newQuotes.length }})
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
                      Responded ({{ respondedQuotes.length }})
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
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No new requests</h3>
                  <p class="mt-1 text-sm text-gray-500">New quote requests will appear here when customers contact you.</p>
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
                        Respond
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
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No responses yet</h3>
                  <p class="mt-1 text-sm text-gray-500">Quotes you've responded to will appear here.</p>
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
                        {{ quote.status === 'accepted' ? 'Accepted' : 'Quoted' }}
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
                      Call
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
          <!-- Performance This Month -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm text-gray-600">Response Rate</span>
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
                  <span class="text-sm text-gray-600">Avg Response Time</span>
                  <span class="text-sm font-semibold text-gray-900">{{ performance.avgResponseTime }}</span>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Jobs Completed</span>
                  <span class="text-sm font-semibold text-gray-900">{{ performance.jobsCompleted }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
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
                No recent activity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { 
  Bell, DollarSign, Star, Calendar, MapPin, Clock, Phone, MessageCircle,
  CheckCircle, ChevronDown, Check, BookOpen
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import ApiService from '@/services/api'

// Composables
const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()

// Component state
const activeTab = ref('new')
const showLanguageDropdown = ref(false)
const isLoading = ref(false)
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
  responseRate: 85,
  avgResponseTime: '2 hours',
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

// ✅ FIXED: Enhanced user access validation
const validateUserAccess = () => {
  console.log('🔐 Validating user access...')
  
  if (!authStore.isAuthenticated) {
    console.log('❌ User not authenticated, redirecting to login')
    router.push('/app/login')
    throw new Error('User not authenticated')
  }
  
  if (!authStore.isProvider) {
    console.log('❌ User is not a provider, redirecting to appropriate dashboard')
    const redirectPath = authStore.isTalent ? '/app/talent-dashboard' : '/app'
    router.push(redirectPath)
    throw new Error('User is not a provider')
  }
  
  // Check if user has required fields
  if (!authStore.user || (!authStore.user._id && !authStore.user.id)) {
    console.error('❌ User object missing ID field')
    throw new Error('Invalid user data')
  }
  
  console.log('✅ User access validated for provider:', authStore.userDisplayName)
}

// ✅ FIXED: Complete dashboard data loading using your backend endpoints
const loadDashboardData = async () => {
  try {
    console.log('📊 Loading provider dashboard data...')
    isLoading.value = true
    errorState.value = null
    
    const providerId = authStore.user._id || authStore.user.id
    
    if (!providerId) {
      throw new Error('Provider ID not found')
    }
    
    console.log('🆔 Using provider ID:', providerId)
    
    // ✅ FIXED: Load data using your existing backend endpoints
    const [
      providerResponse,
      statsResponse,
      performanceResponse
    ] = await Promise.allSettled([
      ApiService.getServiceProviderProfile(providerId),
      ApiService.getServiceProviderStats(providerId),
      ApiService.getProviderPerformance(providerId)
    ])
    
    // Handle provider profile
    if (providerResponse.status === 'fulfilled') {
      console.log('✅ Provider profile loaded:', providerResponse.value)
      provider.value = {
        ...providerResponse.value,
        totalStories: providerResponse.value.stories?.length || 0,
        hasStories: (providerResponse.value.stories?.length || 0) > 0
      }
    } else {
      console.warn('⚠️ Failed to load provider profile:', providerResponse.reason?.message)
    }
    
    // Handle stats
    if (statsResponse.status === 'fulfilled') {
      console.log('✅ Provider stats loaded:', statsResponse.value)
      stats.value = {
        newRequests: statsResponse.value.pendingQuotes || 0,
        activeQuotes: statsResponse.value.activeQuotes || 0,
        rating: statsResponse.value.averageRating || 0,
        monthlyJobs: statsResponse.value.monthlyJobs || 0
      }
    } else {
      console.warn('⚠️ Failed to load provider stats:', statsResponse.reason?.message)
      // Use default stats
      stats.value = {
        newRequests: 0,
        activeQuotes: 0,
        rating: 0,
        monthlyJobs: 0
      }
    }
    
    // Handle performance metrics
    if (performanceResponse.status === 'fulfilled') {
      console.log('✅ Provider performance loaded:', performanceResponse.value)
      performance.value = {
        responseRate: performanceResponse.value.responseRate || 85,
        avgResponseTime: performanceResponse.value.avgResponseTime || '2 hours',
        jobsCompleted: performanceResponse.value.completedJobs || 0
      }
    } else {
      console.warn('⚠️ Failed to load provider performance:', performanceResponse.reason?.message)
      // Use default performance
      performance.value = {
        responseRate: 85,
        avgResponseTime: '2 hours',
        jobsCompleted: 0
      }
    }
    
    // Try to load quotes (may not be implemented yet)
    try {
      const quotesResponse = await ApiService.getProviderQuotes(providerId)
      console.log('✅ Provider quotes loaded:', quotesResponse)
      quotes.value = quotesResponse.map(transformQuote)
    } catch (error) {
      console.warn('⚠️ Quotes endpoint not available yet:', error.message)
      quotes.value = []
    }
    
    // Try to load activity (from dashboard endpoint)
    try {
      const activityResponse = await ApiService.getProviderActivity(providerId)
      console.log('✅ Provider activity loaded:', activityResponse)
      recentActivity.value = activityResponse.map(transformActivity)
    } catch (error) {
      console.warn('⚠️ Activity data not available yet:', error.message)
      recentActivity.value = []
    }
    
    console.log('✅ Dashboard data loading completed')
    
  } catch (error) {
    console.error('❌ Error loading dashboard data:', error)
    errorState.value = error.message || 'Failed to load dashboard data'
  } finally {
    isLoading.value = false
  }
}

// ✅ FIXED: Better error handling and data transformation
const transformQuote = (quote) => {
  try {
    return {
      id: quote.id || quote._id,
      customerName: quote.customer?.name || quote.customerName || 'Unknown Customer',
      serviceType: quote.serviceType || 'General Service',
      description: quote.description || 'No description provided',
      location: quote.location || 'Location not specified',
      budget: quote.budgetRange || quote.budget || 'Budget not specified',
      timeline: quote.timeline || 'Timeline not specified',
      phone: quote.customer?.phone || quote.customerPhone || '',
      status: quote.status || 'new',
      submittedAt: quote.createdAt ? new Date(quote.createdAt) : new Date(),
      respondedAt: quote.respondedAt ? new Date(quote.respondedAt) : null,
      referenceNumber: quote.referenceNumber || quote.id || 'N/A',
      response: quote.providerResponse || '',
      quoteAmount: quote.quoteAmount ? `KES ${quote.quoteAmount.toLocaleString()}` : null,
      photos: quote.attachments || quote.photos || []
    }
  } catch (error) {
    console.warn('Error transforming quote:', error)
    return {
      id: 'unknown',
      customerName: 'Unknown Customer',
      serviceType: 'General Service',
      description: 'Error loading quote details',
      location: 'Unknown',
      budget: 'Unknown',
      timeline: 'Unknown',
      phone: '',
      status: 'new',
      submittedAt: new Date(),
      respondedAt: null,
      referenceNumber: 'ERROR',
      response: '',
      quoteAmount: null,
      photos: []
    }
  }
}

const transformActivity = (activity) => {
  try {
    return {
      id: activity.id || activity._id || Math.random().toString(36).substr(2, 9),
      type: activity.type || 'general',
      description: activity.description || 'Activity description not available',
      timestamp: activity.createdAt ? new Date(activity.createdAt) : new Date()
    }
  } catch (error) {
    console.warn('Error transforming activity:', error)
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: 'general',
      description: 'Error loading activity details',
      timestamp: new Date()
    }
  }
}

// ✅ FIXED: Robust initialization with better error handling
const initializeDashboard = async () => {
  try {
    console.log('🚀 Initializing provider dashboard...')
    validateUserAccess()
    await loadDashboardData()
    setupAutoRefresh()
    handleUrlParams()
    console.log('✅ Dashboard initialization completed')
  } catch (error) {
    console.error('❌ Dashboard initialization failed:', error)
    
    // Don't show error for authentication/authorization issues (already handled by redirects)
    if (error.message !== 'User not authenticated' && error.message !== 'User is not a provider') {
      errorState.value = error.message || 'Failed to initialize dashboard'
    }
  }
}

// ✅ FIXED: More robust auto-refresh with error handling
const refreshData = async () => {
  try {
    console.log('🔄 Refreshing dashboard data...')
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
    
    console.log('✅ Dashboard data refreshed')
    
  } catch (error) {
    console.warn('⚠️ Failed to refresh dashboard data:', error)
    // Don't throw error for refresh failures, just log it
  }
}

// ✅ FIXED: Setup auto-refresh with proper cleanup
const setupAutoRefresh = () => {
  // Clear any existing interval
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  
  // Refresh data every 5 minutes
  refreshInterval = setInterval(() => {
    if (authStore.isAuthenticated && authStore.isProvider) {
      refreshData()
    } else {
      console.log('🛑 Stopping auto-refresh: user not authenticated or not a provider')
      if (refreshInterval) {
        clearInterval(refreshInterval)
        refreshInterval = null
      }
    }
  }, 5 * 60 * 1000)
  
  console.log('⏰ Auto-refresh setup completed (5 min intervals)')
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

// Language switching
const switchToLanguage = async (langCode) => {
  try {
    locale.value = langCode
    localStorage.setItem('fursa-language', langCode)
    showLanguageDropdown.value = false
    console.log('🌐 Language switched to:', langCode)
  } catch (error) {
    console.error('❌ Failed to switch language:', error)
  }
}

// Navigation methods (use router navigation to work with layout)
const goToStoryBuilder = () => {
  router.push({ name: 'provider-story-builder' })
}

// Quote handling methods
const respondToQuote = (quote) => {
  console.log('💬 Responding to quote:', quote.id)
  // Navigate to quote response modal/page
  router.push({ 
    name: 'provider-quote-response',
    query: { quoteId: quote.id }
  })
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
    `Hello ${quote.customerName}, this is regarding your ${quote.serviceType} request. Reference: ${quote.referenceNumber}`
  )
  
  const cleanPhone = quote.phone.replace(/[\s+()-]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
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
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      return `${Math.max(1, minutes)} minute${minutes > 1 ? 's' : ''} ago`
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
  console.log('🚀 ServiceProviderDashboard mounted')
  
  // Initialize language from localStorage
  const savedLanguage = localStorage.getItem('fursa-language')
  if (savedLanguage && ['en', 'sw'].includes(savedLanguage)) {
    locale.value = savedLanguage
  }
  
  initializeDashboard()
})

onUnmounted(() => {
  console.log('🧹 ServiceProviderDashboard unmounted')
  
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

/* Progress bar animation */
.progress-bar {
  transition: width 0.5s ease-in-out;
}

/* Responsive design */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-4 {
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

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast support */
@media (prefers-contrast: high) {
  .form-input {
    border-width: 2px;
  }
  
  .btn-primary {
    border: 2px solid currentColor;
  }
}
</style>