<!-- SharedNavigation.vue - Unified navigation component for FURSA platform -->
<template>
  <nav :class="[
    'sticky top-0 z-50 transition-all duration-200',
    variant === 'landing' ? 'bg-white shadow-sm' : 'bg-white shadow-sm border-b border-gray-100'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- FURSA Logo -->
        <div class="flex items-center">
          <button @click="goHome" class="flex items-center group">
            <div class="cultural-pattern mr-3 group-hover:scale-105 transition-transform">
              <div class="pattern-bar-1"></div>
              <div class="pattern-bar-2"></div>
              <div class="pattern-bar-3"></div>
              <div class="pattern-bar-4"></div>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">FURSA</h1>
              <span v-if="showTagline" class="text-sm text-gray-600 hidden lg:block">
                Connecting African talent to global opportunities
              </span>
            </div>
          </button>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <!-- Landing Page Navigation -->
          <template v-if="variant === 'landing'">
            <a href="#services" class="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
            <a href="#talent" class="text-gray-700 hover:text-blue-600 transition-colors">Creative Talent</a>
            <a href="#how-it-works" class="text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
            <div class="flex items-center space-x-3">
              <button @click="goToServices" class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Find Services
              </button>
              <button @click="goToTalentBrowse" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Browse Talent
              </button>
            </div>
          </template>

          <!-- App Navigation -->
          <template v-else>
            <!-- Services Dropdown -->
            <div class="relative" @mouseenter="showServicesMenu = true" @mouseleave="showServicesMenu = false">
              <router-link 
                to="/app/services" 
                class="text-gray-700 hover:text-emerald-600 transition-colors font-medium flex items-center"
                :class="{ 'text-emerald-600': isServicesActive }"
              >
                <span>Services</span>
                <ChevronDown class="w-4 h-4 ml-1" />
              </router-link>
              
              <!-- Services Dropdown Menu -->
              <div v-if="showServicesMenu" 
                   class="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <router-link to="/app/services" class="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <div class="font-medium">🔍 All Services</div>
                  <div class="text-sm text-gray-500">Find service providers</div>
                </router-link>
                <div class="border-t border-gray-100 my-2"></div>
                <router-link 
                  v-for="service in quickServices" 
                  :key="service.slug"
                  :to="`/app/services/${service.slug}`" 
                  class="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  {{ service.icon }} {{ service.name }}
                </router-link>
              </div>
            </div>

            <!-- Creative Talent Dropdown -->
            <div class="relative" @mouseenter="showTalentMenu = true" @mouseleave="showTalentMenu = false">
              <router-link 
                to="/app" 
                class="text-gray-700 hover:text-orange-600 transition-colors font-medium flex items-center"
                :class="{ 'text-orange-600': isTalentActive }"
              >
                <span>Creative Talent</span>
                <ChevronDown class="w-4 h-4 ml-1" />
              </router-link>
              
              <!-- Talent Dropdown Menu -->
              <div v-if="showTalentMenu" 
                   class="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <router-link to="/app" class="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                  <div class="font-medium">🏠 Discover</div>
                  <div class="text-sm text-gray-500">Featured talent</div>
                </router-link>
                <router-link to="/app/search" class="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                  <div class="font-medium">🔍 Browse</div>
                  <div class="text-sm text-gray-500">Search all talent</div>
                </router-link>
                <div class="border-t border-gray-100 my-2"></div>
                <router-link to="/app/upload" class="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                  <div class="font-medium">✨ Join as Creative</div>
                  <div class="text-sm text-gray-500">Create your portfolio</div>
                </router-link>
              </div>
            </div>

            <!-- Join Dropdown -->
            <div class="relative" @mouseenter="showJoinMenu = true" @mouseleave="showJoinMenu = false">
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center">
                <Plus class="w-4 h-4 mr-1" />
                Join FURSA
                <ChevronDown class="w-3 h-3 ml-1" />
              </button>
              
              <!-- Join Dropdown Menu -->
              <div v-if="showJoinMenu" 
                   class="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <router-link to="/app/upload" class="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                  <div class="font-medium flex items-center">
                    <span class="mr-3">🎨</span> Creative Portfolio
                  </div>
                  <div class="text-sm text-gray-500">Artists, designers, crafters</div>
                </router-link>
                <router-link to="/app/join-as-provider" class="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <div class="font-medium flex items-center">
                    <span class="mr-3">🔧</span> Service Provider
                  </div>
                  <div class="text-sm text-gray-500">Electricians, plumbers, etc.</div>
                </router-link>
              </div>
            </div>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="showMobileMenu = !showMobileMenu" class="md:hidden text-gray-700 hover:text-gray-900 transition-colors">
          <Menu v-if="!showMobileMenu" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 py-4">
        <!-- Landing Page Mobile Menu -->
        <template v-if="variant === 'landing'">
          <div class="flex flex-col space-y-3">
            <button @click="goToServices" class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-center">
              Find Services Near Me
            </button>
            <button @click="goToTalentBrowse" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
              Browse Creative Talent
            </button>
          </div>
        </template>

        <!-- App Mobile Menu -->
        <template v-else>
          <div class="space-y-4">
            <!-- Services Section -->
            <div>
              <div class="px-4 py-2 text-sm font-semibold text-gray-900">Services</div>
              <div class="space-y-1">
                <router-link 
                  to="/app/services" 
                  @click="closeMobileMenu"
                  class="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors mx-4"
                >
                  🔍 Find Services
                </router-link>
                <router-link 
                  v-for="service in quickServices.slice(0, 4)" 
                  :key="service.slug"
                  :to="`/app/services/${service.slug}`"
                  @click="closeMobileMenu"
                  class="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors mx-4 text-sm"
                >
                  {{ service.icon }} {{ service.name }}
                </router-link>
              </div>
            </div>

            <!-- Creative Talent Section -->
            <div>
              <div class="px-4 py-2 text-sm font-semibold text-gray-900">Creative Talent</div>
              <div class="space-y-1">
                <router-link 
                  to="/app" 
                  @click="closeMobileMenu"
                  class="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors mx-4"
                >
                  🏠 Discover
                </router-link>
                <router-link 
                  to="/app/search" 
                  @click="closeMobileMenu"
                  class="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors mx-4"
                >
                  🔍 Browse Talent
                </router-link>
              </div>
            </div>

            <!-- Join CTAs -->
            <div class="px-4 pt-4 border-t border-gray-100 space-y-3">
              <router-link 
                to="/app/upload" 
                @click="closeMobileMenu"
                class="block px-4 py-3 bg-orange-500 text-white rounded-lg transition-colors text-center font-medium"
              >
                🎨 Join as Creative
              </router-link>
              <router-link 
                to="/app/services" 
                @click="closeMobileMenu"
                class="block px-4 py-3 bg-emerald-500 text-white rounded-lg transition-colors text-center font-medium"
              >
                🔧 Find Services
              </router-link>
            </div>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronDown, Menu, X, Plus } from 'lucide-vue-next'

const props = defineProps({
  variant: {
    type: String,
    default: 'app',
    validator: value => ['landing', 'app'].includes(value)
  },
  showTagline: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const route = useRoute()

// Component state
const showMobileMenu = ref(false)
const showServicesMenu = ref(false)
const showTalentMenu = ref(false)
const showJoinMenu = ref(false)

// Quick services for dropdown
const quickServices = ref([
  { name: 'Electrician', icon: '⚡', slug: 'electrician' },
  { name: 'Plumber', icon: '🔧', slug: 'plumber' },
  { name: 'Carpenter', icon: '🪚', slug: 'carpenter' },
  { name: 'Cleaner', icon: '🧹', slug: 'cleaner' },
  { name: 'Painter', icon: '🎨', slug: 'painter' },
  { name: 'Mechanic', icon: '🔩', slug: 'mechanic' }
])

// Computed properties for active states
const isServicesActive = computed(() => route.path.startsWith('/app/services'))
const isTalentActive = computed(() => 
  route.path === '/app' || 
  route.path.startsWith('/app/search') || 
  route.path.startsWith('/app/talent')
)

// Navigation methods
const goHome = () => {
  if (props.variant === 'landing') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push('/')
  }
}

const goToServices = () => {
  router.push('/app/services')
  closeMobileMenu()
}

const goToTalentBrowse = () => {
  router.push('/app/search')
  closeMobileMenu()
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Close mobile menu when route changes
router.afterEach(() => {
  closeMobileMenu()
})
</script>

<style scoped>
/* Cultural Pattern Styles */
.cultural-pattern {
  position: relative;
  width: 40px;
  height: 40px;
}

.pattern-bar-1 { 
  background: #ff6b35; 
  height: 8px; 
  border-radius: 4px; 
}

.pattern-bar-2 { 
  background: #f7931e; 
  height: 6px; 
  border-radius: 3px; 
  margin-top: 2px; 
  margin-left: 4px; 
}

.pattern-bar-3 { 
  background: #10b981; 
  height: 6px; 
  border-radius: 3px; 
  margin-top: 2px; 
  margin-left: 8px; 
}

.pattern-bar-4 { 
  background: #2563eb; 
  height: 4px; 
  border-radius: 2px; 
  margin-top: 2px; 
  margin-left: 12px; 
}
</style>