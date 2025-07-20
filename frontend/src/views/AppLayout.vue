<!-- AppLayout.vue - Main app wrapper for desktop/tablet -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Desktop Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- FURSA Logo -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <div class="cultural-pattern mr-3">
                <div class="pattern-bar-1"></div>
                <div class="pattern-bar-2"></div>
                <div class="pattern-bar-3"></div>
                <div class="pattern-bar-4"></div>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">FURSA</h1>
                <span class="text-xs text-gray-600 hidden lg:block">African Talent • Global Reach</span>
              </div>
            </router-link>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link 
              to="/app" 
              class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              :class="{ 'text-blue-600': $route.name === 'home' }"
            >
              Discover
            </router-link>
            <router-link 
              to="/app/search" 
              class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              :class="{ 'text-blue-600': $route.name === 'search' }"
            >
              Browse
            </router-link>
            <router-link 
              to="/app/upload" 
              class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              ✨ Join FURSA
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
              <X v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-100 py-4">
          <div class="space-y-3">
            <router-link 
              to="/app" 
              @click="mobileMenuOpen = false"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              🏠 Discover
            </router-link>
            <router-link 
              to="/app/search" 
              @click="mobileMenuOpen = false"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              🔍 Browse Talent
            </router-link>
            <router-link 
              to="/app/upload" 
              @click="mobileMenuOpen = false"
              class="block px-4 py-2 bg-orange-500 text-white rounded-lg transition-colors mx-4"
            >
              ✨ Join FURSA
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Global Footer (Optional) -->
    <footer class="bg-white border-t border-gray-100 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center mb-4 md:mb-0">
            <div class="cultural-pattern-sm mr-3">
              <div class="pattern-bar-sm-1"></div>
              <div class="pattern-bar-sm-2"></div>
              <div class="pattern-bar-sm-3"></div>
              <div class="pattern-bar-sm-4"></div>
            </div>
            <div>
              <div class="font-bold text-gray-900">FURSA</div>
              <div class="text-sm text-gray-600">Connecting African talent globally</div>
            </div>
          </div>
          
          <div class="flex space-x-6 text-sm text-gray-600">
            <router-link to="/" class="hover:text-blue-600 transition-colors">About</router-link>
            <a href="#" class="hover:text-blue-600 transition-colors">Help</a>
            <a href="#" class="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const mobileMenuOpen = ref(false)
</script>

<style scoped>
/* Cultural Pattern Styles */
.cultural-pattern {
  position: relative;
  width: 32px;
  height: 32px;
}

.cultural-pattern-sm {
  position: relative;
  width: 24px;
  height: 24px;
}

/* Pattern Colors */
.pattern-bar-1 { 
  background: #ff6b35; 
  height: 6px; 
  border-radius: 3px; 
}

.pattern-bar-2 { 
  background: #f7931e; 
  height: 5px; 
  border-radius: 2.5px; 
  margin-top: 2px; 
  margin-left: 3px; 
}

.pattern-bar-3 { 
  background: #10b981; 
  height: 4px; 
  border-radius: 2px; 
  margin-top: 2px; 
  margin-left: 6px; 
}

.pattern-bar-4 { 
  background: #2563eb; 
  height: 3px; 
  border-radius: 1.5px; 
  margin-top: 2px; 
  margin-left: 9px; 
}

/* Small Pattern Colors */
.pattern-bar-sm-1 { 
  background: #ff6b35; 
  height: 4px; 
  border-radius: 2px; 
}

.pattern-bar-sm-2 { 
  background: #f7931e; 
  height: 3px; 
  border-radius: 1.5px; 
  margin-top: 1px; 
  margin-left: 2px; 
}

.pattern-bar-sm-3 { 
  background: #10b981; 
  height: 3px; 
  border-radius: 1.5px; 
  margin-top: 1px; 
  margin-left: 4px; 
}

.pattern-bar-sm-4 { 
  background: #2563eb; 
  height: 2px; 
  border-radius: 1px; 
  margin-top: 1px; 
  margin-left: 6px; 
}
</style>