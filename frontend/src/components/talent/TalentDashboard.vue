<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-orange-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Cultural Pattern Integration -->
            <div class="cultural-pattern-header">
              <div class="pattern-bar-header-1"></div>
              <div class="pattern-bar-header-2"></div>
              <div class="pattern-bar-header-3"></div>
              <div class="pattern-bar-header-4"></div>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Creative Talent Dashboard</h1>
              <!-- FIXED: Use auth store for name display -->
              <p class="text-gray-600">Welcome back, {{ authStore.userDisplayName }}!</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Language Selector -->
            <GlobalLanguageSelector size="compact" />
            <!-- Logout Button -->
            <button @click="logout" 
                    class="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all text-sm">
              <LogOut class="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Portfolio Views -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Eye class="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Portfolio Views</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.views }}</p>
            </div>
          </div>
        </div>

        <!-- Active Projects -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase class="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Active Projects</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeProjects }}</p>
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
              <p class="text-sm font-medium text-gray-500">Rating</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.rating }}</p>
            </div>
          </div>
        </div>

        <!-- Completed Works -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle class="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Completed Works</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.completedWorks }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Portfolio Enhancement CTA -->
      <div class="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-xl p-6 mb-8 text-white">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-xl font-bold mb-2">Enhance Your Portfolio</h3>
            <p class="text-orange-100 mb-4">Add more work samples, voice introductions, and showcase your creative process to attract more clients.</p>
            <div class="flex items-center text-sm text-orange-100">
              <span class="mr-4">📸 Upload more work</span>
              <span class="mr-4">🎤 Add voice intro</span>
              <span>⭐ Stand out globally</span>
            </div>
          </div>
          <div class="ml-6">
            <router-link to="/app/upload" 
                        class="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg flex items-center">
              <Plus class="w-5 h-5 mr-2" />
              Add to Portfolio
            </router-link>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Inquiries -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Recent Client Inquiries</h2>
            </div>
            
            <div class="p-6">
              <div class="text-center py-8">
                <MessageCircle class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No inquiries yet</h3>
                <p class="mt-1 text-sm text-gray-500">
                  When clients are interested in your work, their messages will appear here.
                </p>
                <div class="mt-6">
                  <router-link to="/app/upload" 
                              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
                    <Plus class="w-4 h-4 mr-2" />
                    Enhance Portfolio
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="space-y-6">
          <!-- Portfolio Stats -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Portfolio Status</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Portfolio Completeness</span>
                <span class="text-sm font-semibold text-gray-900">{{ portfolioCompleteness }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-orange-500 h-2 rounded-full transition-all" 
                     :style="{ width: portfolioCompleteness + '%' }"></div>
              </div>
              <div class="text-xs text-gray-500">
                Add more work samples and voice intro to improve visibility
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <router-link to="/app/upload" 
                          class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Camera class="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div class="text-sm font-medium text-gray-900">Add Work Samples</div>
                  <div class="text-xs text-gray-500">Upload photos of your latest work</div>
                </div>
              </router-link>
              
              <button class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Mic class="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div class="text-sm font-medium text-gray-900">Record Voice Intro</div>
                  <div class="text-xs text-gray-500">Tell your story in your own voice</div>
                </div>
              </button>
              
              <router-link to="/app/search" 
                          class="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Users class="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div class="text-sm font-medium text-gray-900">Browse Community</div>
                  <div class="text-xs text-gray-500">See other talented creators</div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Eye, Star, Briefcase, CheckCircle, MessageCircle, Camera, Mic, Users,
  Plus, LogOut
} from 'lucide-vue-next'
import GlobalLanguageSelector from '@/components/shared/GlobalLanguageSelector.vue'
import { useAuthStore } from '@/stores/auth' // FIXED: Import auth store

const router = useRouter()
const authStore = useAuthStore() // FIXED: Use auth store

// Sample stats (replace with real data later)
const stats = ref({
  views: 234,
  activeProjects: 2,
  rating: 4.8,
  completedWorks: 15
})

// FIXED: Portfolio completeness based on auth store data
const portfolioCompleteness = computed(() => {
  if (!authStore.user) return 0
  
  let completeness = 0
  
  // Basic info (40%)
  if (authStore.user.name) completeness += 10
  if (authStore.user.email) completeness += 10
  if (authStore.user.phone) completeness += 10
  if (authStore.user.description) completeness += 10
  
  // Skills and category (30%)
  if (authStore.user.skill) completeness += 15
  if (authStore.user.category) completeness += 15
  
  // Portfolio items (30%)
  const portfolioCount = authStore.user.portfolio?.length || 0
  if (portfolioCount >= 1) completeness += 10
  if (portfolioCount >= 3) completeness += 10
  if (portfolioCount >= 5) completeness += 10
  
  return Math.min(completeness, 100)
})

// FIXED: Load talent data from auth store
const loadTalentData = () => {
  console.log('🎨 Loading talent dashboard...')
  
  // FIXED: Check authentication using auth store
  if (!authStore.isAuthenticated) {
    console.log('❌ No authenticated user, redirecting to home')
    router.push('/app')
    return
  }
  
  // FIXED: Check user type using auth store
  if (!authStore.isTalent) {
    console.log('❌ User is not a talent, redirecting to appropriate dashboard')
    if (authStore.isProvider) {
      console.log('👷 Redirecting provider to provider dashboard')
      router.push('/app/provider-dashboard')
    } else {
      console.log('❓ Unknown user type, redirecting to home')
      router.push('/app')
    }
    return
  }
  
  console.log('✅ Talent dashboard loaded for:', authStore.userDisplayName)
  
  // FIXED: Load additional stats from user data
  if (authStore.user) {
    // Update stats based on user data if available
    if (authStore.user.stats) {
      stats.value = {
        views: authStore.user.stats.views || 234,
        activeProjects: authStore.user.stats.activeProjects || 2,
        rating: authStore.user.rating?.average || 4.8,
        completedWorks: authStore.user.stats.completedWorks || 15
      }
    }
    
    // You could also load real data from API here using authStore.user.id
    // const userId = authStore.user._id || authStore.user.id
    // loadTalentStats(userId)
  }
}

// FIXED: Logout using auth store
const logout = () => {
  console.log('🚪 Talent logging out...')
  authStore.logout()
  router.push('/app')
}

onMounted(() => {
  loadTalentData()
})
</script>

<style scoped>
/* Cultural Pattern Styles */
.cultural-pattern-header {
  position: relative;
  width: 48px;
  height: 48px;
  margin-right: 12px;
}

.pattern-bar-header-1 { 
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  height: 8px; 
  border-radius: 4px; 
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.pattern-bar-header-2 { 
  background: linear-gradient(135deg, #f7931e, #fbbf24);
  height: 7px; 
  border-radius: 3.5px; 
  margin-top: 3px; 
  margin-left: 4px; 
  box-shadow: 0 2px 6px rgba(247, 147, 30, 0.3);
}

.pattern-bar-header-3 { 
  background: linear-gradient(135deg, #10b981, #059669);
  height: 6px; 
  border-radius: 3px; 
  margin-top: 3px; 
  margin-left: 8px; 
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.pattern-bar-header-4 { 
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  height: 5px; 
  border-radius: 2.5px; 
  margin-top: 3px; 
  margin-left: 12px; 
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
}

/* Smooth transitions */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>