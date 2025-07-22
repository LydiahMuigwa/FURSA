<!-- frontend/src/layouts/ProviderDashboardLayout.vue -->
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
            <button class="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500">
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
                <router-link to="/app/provider-dashboard/profile" 
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
      <aside class="w-64 bg-white shadow-sm h-screen sticky top-16">
        <nav class="mt-8 px-4">
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

            <!-- Profile -->
            <router-link to="/app/provider-dashboard/profile" 
                        :class="getSidebarLinkClass('profile')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <User class="w-5 h-5 mr-3" />
              My Profile
            </router-link>

            <!-- Schedule -->
            <router-link to="/app/provider-dashboard/schedule" 
                        :class="getSidebarLinkClass('schedule')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <Calendar class="w-5 h-5 mr-3" />
              Schedule
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
            </div>
          </div>

          <!-- Help Section -->
          <div class="mt-6 p-4 bg-orange-50 rounded-lg">
            <h3 class="text-sm font-medium text-orange-800 mb-2">Need Help?</h3>
            <p class="text-xs text-orange-700 mb-3">Get started with your first customer</p>
            <button class="w-full bg-orange-100 text-orange-800 px-3 py-2 rounded-md text-xs font-medium hover:bg-orange-200 transition-colors">
              📞 Get Support
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
  Home, BookOpen, User, Calendar, DollarSign, Star, 
  Bell, Settings, Briefcase, ChevronDown, LogOut 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const showProfileMenu = ref(false)
const notificationCount = ref(3)
const profileCompleteness = ref(75)
const monthlyStats = ref(5)
const rating = ref(4.8)

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
    // Load provider dashboard data
    // This would typically come from an API call
    console.log('Provider dashboard layout loaded')
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