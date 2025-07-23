<!-- frontend/src/layouts/TalentDashboardLayout.vue - RICH DESIGN VERSION -->
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
            
            <!-- Talent Badge -->
            <div class="ml-6 flex items-center px-3 py-1 bg-purple-50 rounded-full">
              <Palette class="w-4 h-4 text-purple-600 mr-2" />
              <span class="text-sm font-medium text-purple-700">Creative Talent</span>
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

            <!-- Messages -->
            <button class="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500">
              <MessageCircle class="w-6 h-6" />
              <span v-if="messageCount > 0" 
                    class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-green-600 rounded-full">
                {{ messageCount }}
              </span>
            </button>

            <!-- Settings -->
            <router-link to="/app/talent-dashboard/settings" 
                        class="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500">
              <Settings class="w-6 h-6" />
            </router-link>

            <!-- Profile Dropdown -->
            <div class="relative">
              <button @click="showProfileMenu = !showProfileMenu" 
                      class="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <User class="w-5 h-5 text-white" />
                </div>
                <span class="hidden md:block font-medium text-gray-700">{{ talentName }}</span>
                <ChevronDown class="w-4 h-4 text-gray-500" />
              </button>

              <!-- Dropdown Menu -->
              <div v-if="showProfileMenu" 
                   @click.away="showProfileMenu = false"
                   class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <router-link to="/app/talent-dashboard/profile" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User class="w-4 h-4 inline mr-2" />
                  Your Profile
                </router-link>
                <router-link to="/app/talent-dashboard/portfolio" 
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Briefcase class="w-4 h-4 inline mr-2" />
                  Portfolio
                </router-link>
                <router-link to="/app/talent-dashboard/settings" 
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
            <router-link to="/app/talent-dashboard" 
                        :class="getSidebarLinkClass('')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <Home class="w-5 h-5 mr-3" />
              Dashboard
            </router-link>

            <!-- Portfolio -->
            <router-link to="/app/talent-dashboard/portfolio" 
                        :class="getSidebarLinkClass('portfolio')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <Briefcase class="w-5 h-5 mr-3" />
              My Portfolio
              <span v-if="portfolioItems > 0" class="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                {{ portfolioItems }}
              </span>
            </router-link>

            <!-- Profile -->
            <router-link to="/app/talent-dashboard/profile" 
                        :class="getSidebarLinkClass('profile')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <User class="w-5 h-5 mr-3" />
              My Profile
            </router-link>

            <!-- Opportunities -->
            <router-link to="/app/talent-dashboard/opportunities" 
                        :class="getSidebarLinkClass('opportunities')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <Search class="w-5 h-5 mr-3" />
              Opportunities
              <span v-if="newOpportunities > 0" class="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                {{ newOpportunities }} New
              </span>
            </router-link>

            <!-- Messages -->
            <router-link to="/app/talent-dashboard/messages" 
                        :class="getSidebarLinkClass('messages')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <MessageCircle class="w-5 h-5 mr-3" />
              Messages
              <span v-if="unreadMessages > 0" class="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {{ unreadMessages }}
              </span>
            </router-link>

            <!-- Reviews -->
            <router-link to="/app/talent-dashboard/reviews" 
                        :class="getSidebarLinkClass('reviews')"
                        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors">
              <Star class="w-5 h-5 mr-3" />
              Reviews
            </router-link>
          </div>

          <!-- Quick Stats -->
          <div class="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Quick Stats</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Profile Complete</span>
                <span class="font-semibold text-green-600">{{ profileCompleteness }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Portfolio Items</span>
                <span class="font-semibold text-purple-600">{{ portfolioItems }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Rating</span>
                <span class="font-semibold text-yellow-600">{{ rating }}★</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Views</span>
                <span class="font-semibold text-blue-600">{{ profileViews }}</span>
              </div>
            </div>
          </div>

          <!-- Creative Boost Section -->
          <div class="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
            <h3 class="text-sm font-medium text-orange-800 mb-2">🎨 Boost Your Visibility</h3>
            <p class="text-xs text-orange-700 mb-3">Complete your portfolio to get more clients</p>
            <button @click="openPortfolioBuilder" 
                    class="w-full bg-orange-100 text-orange-800 px-3 py-2 rounded-md text-xs font-medium hover:bg-orange-200 transition-colors">
              ✨ Enhance Portfolio
            </button>
          </div>

          <!-- Help Section -->
          <div class="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Need Help?</h3>
            <p class="text-xs text-blue-700 mb-3">Tips to showcase your talent</p>
            <button @click="openHelpModal" 
                    class="w-full bg-blue-100 text-blue-800 px-3 py-2 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors">
              📚 Get Tips
            </button>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <router-view />
      </main>
    </div>

    <!-- Modals -->
    <PortfolioBuilderModal 
      :is-open="showPortfolioModal"
      @close="showPortfolioModal = false"
    />
    
    <HelpTipsModal 
      :is-open="showHelpModal"
      @close="showHelpModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  Home, Briefcase, User, Search, MessageCircle, Star, 
  Bell, Settings, Palette, ChevronDown, LogOut 
} from 'lucide-vue-next'

// Import modals (create these if they don't exist)
import PortfolioBuilderModal from '@/components/talent/modals/PortfolioBuilderModal.vue'
import HelpTipsModal from '@/components/talent/modals/HelpTipsModal.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const showProfileMenu = ref(false)
const showPortfolioModal = ref(false)
const showHelpModal = ref(false)
const notificationCount = ref(2)
const messageCount = ref(1)
const profileCompleteness = ref(85)
const portfolioItems = ref(8)
const rating = ref(4.6)
const profileViews = ref(127)
const newOpportunities = ref(3)
const unreadMessages = ref(2)

// Computed
const talentName = computed(() => {
  return authStore.user?.name || 'Creative Talent'
})

// Methods
const getSidebarLinkClass = (routeName) => {
  const isActive = routeName === '' 
    ? route.name === 'talent-dashboard'
    : route.path.includes(routeName)
  
  return isActive
    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500'
    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
}

const openPortfolioBuilder = () => {
  showPortfolioModal.value = true
}

const openHelpModal = () => {
  showHelpModal.value = true
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/app')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Load talent data on mount
onMounted(async () => {
  try {
    // Load talent dashboard data
    console.log('Talent dashboard layout loaded')
  } catch (error) {
    console.error('Failed to load talent data:', error)
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