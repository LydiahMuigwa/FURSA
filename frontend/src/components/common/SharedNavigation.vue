<!-- SharedNavigation.vue - Navigation component for FURSA with Global Language Selector -->
<template>
  <nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo Section -->
        <div class="flex items-center">
          <button @click="goHome" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <!-- Cultural Pattern Logo -->
            <div class="cultural-pattern">
              <div class="pattern-bar-1"></div>
              <div class="pattern-bar-2"></div>
              <div class="pattern-bar-3"></div>
              <div class="pattern-bar-4"></div>
            </div>
            
            <!-- Brand Text -->
            <div class="flex flex-col">
              <div class="font-bold text-xl text-gray-900">{{ t('app.name') }}</div>
              <div v-if="showTagline" class="text-xs text-gray-600 -mt-1">{{ t('app.tagline') }}</div>
            </div>
          </button>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <!-- Services Navigation -->
          <div class="relative group">
            <button @click="toggleServicesMenu" 
                    :class="[
                      'text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center',
                      isServicesActive ? 'text-blue-600 bg-blue-50' : ''
                    ]">
              {{ t('navigation.services') }}
              <ChevronDown class="ml-1 h-4 w-4" />
            </button>
            
            <!-- Services Dropdown -->
            <div v-if="showServicesMenu" 
                 @click.stop
                 class="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button @click="goToServices" 
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                🔍 {{ t('navigation.find_services') || 'Find Services Near Me' }}
              </button>
              <div class="border-t border-gray-100 my-2"></div>
              <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {{ t('navigation.popular_services') || 'Popular Services' }}
              </div>
              <button v-for="service in quickServices" :key="service.slug"
                      @click="goToService(service.slug)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                <span class="mr-2">{{ service.icon }}</span>
                {{ service.name }}
              </button>
            </div>
          </div>

          <!-- Creative Talent Navigation -->
          <div class="relative group">
            <button @click="toggleTalentMenu"
                    :class="[
                      'text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center',
                      isTalentActive ? 'text-orange-600 bg-orange-50' : ''
                    ]">
              {{ t('navigation.talent') }}
              <ChevronDown class="ml-1 h-4 w-4" />
            </button>
            
            <!-- Talent Dropdown -->
            <div v-if="showTalentMenu" 
                 @click.stop
                 class="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button @click="goToTalentBrowse" 
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                🎨 {{ t('navigation.browse_talent') || 'Browse Creative Talent' }}
              </button>
              <button @click="goToTalentUpload" 
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                📸 {{ t('navigation.create_portfolio') || 'Create Your Portfolio' }}
              </button>
            </div>
          </div>

          <!-- Join/Get Started -->
          <div class="relative group">
            <button @click="toggleJoinMenu"
                    class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
              {{ t('navigation.join_fursa') }}
              <ChevronDown class="ml-1 h-4 w-4" />
            </button>
            
            <!-- Join Dropdown -->
            <!-- Join Dropdown -->
<div v-if="showJoinMenu" 
     @click.stop
     class="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
  
  <!-- Add Login Option -->
  <button @click="goToLogin" 
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
    🔑 Sign In to Your Account
  </button>
  
  <button @click="goToTalentUpload" 
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
    🎨 {{ t('navigation.join_creative') || 'Join as Creative Talent' }}
  </button>
  <button @click="goToProviderOnboarding" 
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
    🔧 {{ t('navigation.join_provider') || 'Join as Service Provider' }}
  </button>
</div>
          </div>

          <!-- GLOBAL LANGUAGE SELECTOR - Added here -->
          <GlobalLanguageSelector />

          <!-- CTA Button -->
          <button @click="goToTalentUpload" 
                  class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105">
            {{ t('navigation.get_started') }}
          </button>
        </div>

        <!-- Mobile menu button + Compact Language Selector -->
        <div class="md:hidden flex items-center space-x-2">
          <!-- Compact Language Selector for Mobile -->
          <GlobalLanguageSelector size="compact" />
          
          <button @click="showMobileMenu = !showMobileMenu" 
                  class="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 p-2">
            <Menu v-if="!showMobileMenu" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 bg-white">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <!-- Services Mobile -->
        <div class="space-y-1">
          <button @click="goToServices" 
                  class="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left">
            🔍 {{ t('navigation.find_services') || 'Find Services' }}
          </button>
          <div class="pl-4 space-y-1">
            <button v-for="service in quickServices" :key="service.slug"
                    @click="goToService(service.slug)"
                    class="text-gray-600 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-sm transition-colors w-full text-left">
              {{ service.icon }} {{ service.name }}
            </button>
          </div>
        </div>

        <!-- Talent Mobile -->
        <div class="border-t border-gray-100 pt-2 space-y-1">
          <button @click="goToTalentBrowse" 
                  class="text-gray-700 hover:text-orange-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left">
            🎨 {{ t('navigation.browse_talent') || 'Browse Talent' }}
          </button>
          <button @click="goToTalentUpload" 
                  class="text-gray-700 hover:text-orange-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left">
            📸 {{ t('navigation.create_portfolio') || 'Create Portfolio' }}
          </button>
        </div>

        <!-- Join Mobile -->
        <div class="border-t border-gray-100 pt-2 space-y-1">
          <button @click="goToProviderOnboarding" 
        class="text-gray-700 hover:text-green-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left">
  🔧 {{ t('navigation.join_provider') || 'Join as Service Provider' }}</button>
        </div>

        <!-- CTA Mobile -->
        <div class="border-t border-gray-100 pt-2">
          <button @click="goToTalentUpload" 
                  class="bg-gradient-to-r from-blue-600 to-purple-600 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-center">
            {{ t('navigation.get_started') }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronDown, Menu, X } from 'lucide-vue-next'
import GlobalLanguageSelector from '@/components/shared/GlobalLanguageSelector.vue'

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
const { t } = useI18n()

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

// Toggle functions for dropdowns
const toggleServicesMenu = () => {
  showServicesMenu.value = !showServicesMenu.value
  showTalentMenu.value = false
  showJoinMenu.value = false
}

const toggleTalentMenu = () => {
  showTalentMenu.value = !showTalentMenu.value
  showServicesMenu.value = false
  showJoinMenu.value = false
}

const toggleJoinMenu = () => {
  showJoinMenu.value = !showJoinMenu.value
  showServicesMenu.value = false
  showTalentMenu.value = false
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const target = event.target
  const isDropdownClick = target.closest('.group')
  if (!isDropdownClick) {
    showServicesMenu.value = false
    showTalentMenu.value = false
    showJoinMenu.value = false
  }
}

// Navigation methods
const goHome = () => {
  if (props.variant === 'landing') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push('/')
  }
  closeMobileMenu()
}

const goToServices = () => {
  router.push('/app/services')
  closeMobileMenu()
}

const goToService = (category) => {
  router.push(`/app/services/${category}`)
  closeMobileMenu()
}

const goToTalentBrowse = () => {
  router.push('/app/search')
  closeMobileMenu()
}

const goToTalentUpload = () => {
  router.push('/app/upload')
  closeMobileMenu()
}

const goToProviderDashboard = () => {
  router.push('/app/provider-dashboard')
  closeMobileMenu()
}
const goToProviderOnboarding = () => {
  router.push('/app/join-as-provider')
  closeMobileMenu()
}
const goToLogin = () => {
  router.push('/app/login')
  closeMobileMenu()
}
const closeMobileMenu = () => {
  showMobileMenu.value = false
  showServicesMenu.value = false
  showTalentMenu.value = false
  showJoinMenu.value = false
}

// Close mobile menu when route changes
router.afterEach(() => {
  closeMobileMenu()
})

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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