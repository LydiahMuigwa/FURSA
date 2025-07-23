<!-- frontend/src/layouts/ProviderDashboardLayout.vue - ENHANCED: All components connected -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- FURSA Logo -->
            <router-link to="/app" class="flex items-center">
              <div class="cultural-pattern-header">
                <div class="pattern-bar-header-1"></div>
                <div class="pattern-bar-header-2"></div>
                <div class="pattern-bar-header-3"></div>
                <div class="pattern-bar-header-4"></div>
              </div>
              <span class="ml-3 text-xl font-bold gradient-text">FURSA</span>
            </router-link>
            
            <!-- Provider Badge -->
            <div class="ml-6 flex items-center px-3 py-1 bg-blue-50 rounded-full">
              <Briefcase class="w-4 h-4 text-blue-600 mr-2" />
              <span class="text-sm font-medium text-blue-700">Service Provider</span>
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button @click="openAllBookings" 
                    class="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500">
              <Bell class="w-6 h-6" />
              <span v-if="notificationCount > 0" 
                    class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {{ notificationCount }}
              </span>
            </button>

            <!-- Settings -->
            <router-link to="/app/provider-dashboard/settings" 
                        class="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500">
              <Settings class="w-6 h-6" />
            </router-link>

            <!-- Profile Dropdown -->
            <div class="relative">
              <button @click="showProfileMenu = !showProfileMenu" 
                      class="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User class="w-5 h-5 text-white" />
                </div>
                <span class="hidden md:block font-medium text-gray-700">{{ providerName }}</span>
                <ChevronDown class="w-4 h-4 text-gray-500" />
              </button>

              <!-- Dropdown Menu -->
              <div v-if="showProfileMenu" 
                   @click.away="showProfileMenu = false"
                   class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <router-link to="/app/provider-dashboard/profile-edit" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User class="w-4 h-4 inline mr-2" />
                  Your Profile
                </router-link>
                <router-link to="/app/provider-dashboard/settings" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings class="w-4 h-4 inline mr-2" />
                  Settings
                </router-link>
                <hr class="my-1">
                <button @click="logout" 
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <LogOut class="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <div class="flex">
      <!-- Sidebar Navigation -->
      <aside class="w-64 bg-white shadow-sm h-screen sticky top-16 overflow-y-auto">
        <nav class="mt-8 px-4 pb-8">
          <!-- MAIN NAVIGATION -->
          <div class="space-y-2">
            <!-- Dashboard -->
            <router-link to="/app/provider-dashboard" 
                        :class="getSidebarLinkClass('')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <Home class="w-5 h-5 mr-3" />
              Dashboard
            </router-link>

            <!-- Tell Your Story -->
            <router-link to="/app/provider-dashboard/story-builder" 
                        :class="getSidebarLinkClass('story-builder')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <BookOpen class="w-5 h-5 mr-3" />
              Tell Your Story
              <span class="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                New
              </span>
            </router-link>

            <!-- My Stories -->
            <router-link to="/app/provider-dashboard/my-stories" 
                        :class="getSidebarLinkClass('my-stories')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <FileText class="w-5 h-5 mr-3" />
              My Stories
            </router-link>

            <!-- Portfolio Manager -->
            <router-link to="/app/provider-dashboard/portfolio-manager" 
                        :class="getSidebarLinkClass('portfolio-manager')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <Images class="w-5 h-5 mr-3" />
              Portfolio
            </router-link>

            <!-- Profile -->
            <router-link to="/app/provider-dashboard/profile-edit" 
                        :class="getSidebarLinkClass('profile-edit')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <User class="w-5 h-5 mr-3" />
              My Profile
            </router-link>

            <!-- Earnings -->
            <router-link to="/app/provider-dashboard/earnings" 
                        :class="getSidebarLinkClass('earnings')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <DollarSign class="w-5 h-5 mr-3" />
              Earnings
            </router-link>

            <!-- Reviews -->
            <router-link to="/app/provider-dashboard/reviews" 
                        :class="getSidebarLinkClass('reviews')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <Star class="w-5 h-5 mr-3" />
              Reviews
            </router-link>
          </div>

          <!-- SCHEDULE SECTION -->
          <div class="mt-6">
            <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Schedule</h3>
            <div class="mt-2 space-y-1">
              <router-link to="/app/provider-dashboard/modals/schedule-management" 
                          :class="getSidebarLinkClass('schedule-management')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <Calendar class="w-5 h-5 mr-3" />
                Manage Schedule
              </router-link>
              
              <router-link to="/app/provider-dashboard/modals/schedule-appointment" 
                          :class="getSidebarLinkClass('schedule-appointment')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <Clock class="w-5 h-5 mr-3" />
                New Appointment
              </router-link>
              
              <router-link to="/app/provider-dashboard/modals/weekly-hours" 
                          :class="getSidebarLinkClass('weekly-hours')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <Timer class="w-5 h-5 mr-3" />
                Weekly Hours
              </router-link>
            </div>
          </div>

          <!-- BOOKINGS & QUOTES SECTION -->
          <div class="mt-6">
            <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bookings & Quotes</h3>
            <div class="mt-2 space-y-1">
              <router-link to="/app/provider-dashboard/modals/all-bookings" 
                          :class="getSidebarLinkClass('all-bookings')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <Calendar class="w-5 h-5 mr-3" />
                All Bookings
                <span v-if="newBookings > 0" class="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  {{ newBookings }}
                </span>
              </router-link>
              
              <router-link to="/app/provider-dashboard/modals/quote-response" 
                          :class="getSidebarLinkClass('quote-response')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <MessageSquare class="w-5 h-5 mr-3" />
                Quote Responses
              </router-link>
              
              <router-link to="/app/provider-dashboard/forms/quote-request" 
                          :class="getSidebarLinkClass('quote-request')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <FileEdit class="w-5 h-5 mr-3" />
                Quote Requests
              </router-link>
            </div>
          </div>

          <!-- TOOLS & UTILITIES SECTION -->
          <div class="mt-6">
            <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools & Utilities</h3>
            <div class="mt-2 space-y-1">
              <router-link to="/app/provider-dashboard/tools/photo-upload" 
                          :class="getSidebarLinkClass('photo-upload')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <Upload class="w-5 h-5 mr-3" />
                Photo Upload
              </router-link>
              
              <router-link to="/app/provider-dashboard/modals/photo-viewer" 
                          :class="getSidebarLinkClass('photo-viewer')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <Eye class="w-5 h-5 mr-3" />
                Photo Viewer
              </router-link>
              
              <router-link to="/app/provider-dashboard/tools/story-preview" 
                          :class="getSidebarLinkClass('story-preview')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <FilePreview class="w-5 h-5 mr-3" />
                Story Preview
              </router-link>
              
              <router-link to="/app/provider-dashboard/forms/location-picker" 
                          :class="getSidebarLinkClass('location-picker')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <MapPin class="w-5 h-5 mr-3" />
                Location Picker
              </router-link>
            </div>
          </div>

          <!-- COMPONENT SHOWCASE SECTION (FOR TESTING) -->
          <div class="mt-6" v-if="showDevTools">
            <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Component Showcase</h3>
            <div class="mt-2 space-y-1">
              <router-link to="/app/provider-dashboard/showcase/booking-card" 
                          :class="getSidebarLinkClass('booking-card')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <CreditCard class="w-5 h-5 mr-3" />
                Booking Card
              </router-link>
              
              <router-link to="/app/provider-dashboard/showcase/quote-request-card" 
                          :class="getSidebarLinkClass('quote-request-card')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <MessageCircle class="w-5 h-5 mr-3" />
                Quote Request Card
              </router-link>
              
              <router-link to="/app/provider-dashboard/showcase/service-provider-card" 
                          :class="getSidebarLinkClass('service-provider-card')"
                          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
                <UserCheck class="w-5 h-5 mr-3" />
                Provider Card
              </router-link>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Quick Stats</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Profile Complete</span>
                <span class="font-semibold text-green-600">{{ profileCompleteness }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">This Month</span>
                <span class="font-semibold text-blue-600">{{ monthlyStats }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Rating</span>
                <span class="font-semibold text-yellow-600">{{ rating }}★</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">New Bookings</span>
                <span class="font-semibold text-green-600">{{ newBookings }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
            <h3 class="text-sm font-medium text-orange-800 mb-3">Quick Actions</h3>
            <div class="space-y-2">
              <button @click="goToStoryBuilder" 
                      class="w-full bg-orange-100 text-orange-800 px-3 py-2 rounded-md text-xs font-medium hover:bg-orange-200 transition-colors text-left">
                📖 Create New Story
              </button>
              <button @click="openScheduleAppointment" 
                      class="w-full bg-blue-100 text-blue-800 px-3 py-2 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors text-left">
                📅 Schedule Appointment
              </button>
              <button @click="openPhotoUpload" 
                      class="w-full bg-green-100 text-green-800 px-3 py-2 rounded-md text-xs font-medium hover:bg-green-200 transition-colors text-left">
                📸 Upload Photos
              </button>
            </div>
          </div>

          <!-- Help Section -->
          <div class="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 class="text-sm font-medium text-purple-800 mb-2">Need Help?</h3>
            <p class="text-xs text-purple-700 mb-3">Get started with your first customer</p>
            <button @click="openContactSuccess" 
                    class="w-full bg-purple-100 text-purple-800 px-3 py-2 rounded-md text-xs font-medium hover:bg-purple-200 transition-colors">
              📞 Get Support
            </button>
          </div>

          <!-- Dev Tools Toggle -->
          <div class="mt-6">
            <button @click="showDevTools = !showDevTools" 
                    class="w-full text-xs text-gray-500 hover:text-gray-700 transition-colors">
              {{ showDevTools ? '🔧 Hide Dev Tools' : '🔧 Show Dev Tools' }}
            </button>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  Home, BookOpen, User, Calendar, FileText, Images, DollarSign, Star,
  Bell, Settings, Briefcase, ChevronDown, LogOut, Clock, Timer,
  MessageSquare, FileEdit, Upload, Eye, MapPin, CreditCard, 
  MessageCircle, UserCheck
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const showProfileMenu = ref(false)
const showDevTools = ref(false) // Toggle for component showcase
const notificationCount = ref(3)
const profileCompleteness = ref(75)
const monthlyStats = ref(5)
const rating = ref(4.8)
const newBookings = ref(2)

// Computed
const providerName = computed(() => {
  return authStore.user?.name || 'Service Provider'
})

// Methods
const getSidebarLinkClass = (routeName) => {
  const isActive = routeName === '' 
    ? route.name === 'provider-dashboard'
    : route.path.includes(routeName)
  
  return isActive
    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
}

// Navigation methods using the enhanced navigationHelpers
const goToStoryBuilder = () => {
  router.push({ name: 'provider-story-builder' })
}

const openScheduleAppointment = () => {
  router.push({ name: 'provider-schedule-appointment' })
}

const openPhotoUpload = () => {
  router.push({ name: 'provider-photo-upload' })
}

const openContactSuccess = () => {
  router.push({ name: 'provider-contact-success' })
}

const openAllBookings = () => {
  router.push({ name: 'provider-all-bookings' })
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/app')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Load provider data on mount
onMounted(async () => {
  try {
    console.log('Enhanced provider dashboard layout loaded')
    // You can add logic to check if we're in development mode
    showDevTools.value = import.meta.env.DEV || false
  } catch (error) {
    console.error('Failed to load provider data:', error)
  }
})
</script>

<style scoped>
.cultural-pattern-header {
  display: flex;
  flex-direction: column;
  width: 24px;
  height: 24px;
  gap: 2px;
}

.pattern-bar-header-1 { background: #f97316; height: 4px; width: 100%; border-radius: 1px; }
.pattern-bar-header-2 { background: #22c55e; height: 4px; width: 80%; border-radius: 1px; }
.pattern-bar-header-3 { background: #3b82f6; height: 4px; width: 90%; border-radius: 1px; }
.pattern-bar-header-4 { background: #8b5cf6; height: 4px; width: 70%; border-radius: 1px; }

.gradient-text {
  background: linear-gradient(135deg, #f97316 0%, #22c55e 25%, #3b82f6 50%, #8b5cf6 75%, #f97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>