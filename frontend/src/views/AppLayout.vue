<!-- AppLayout.vue - Clean implementation using SharedNavigation -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Shared Navigation Component -->
    <SharedNavigation variant="app" />

    <!-- Main Content Area -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Enhanced Footer -->
    <footer class="bg-white border-t border-gray-100 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Logo Section -->
          <div>
            <div class="flex items-center mb-4">
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
            <p class="text-sm text-gray-500">Authentic connections through visual portfolios and direct communication.</p>
          </div>
          
          <!-- Services Links -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Services</h4>
            <div class="space-y-2 text-sm">
              <router-link to="/app/services" class="block text-gray-600 hover:text-emerald-600 transition-colors">Find Services</router-link>
              <router-link to="/app/services/electrician" class="block text-gray-600 hover:text-emerald-600 transition-colors">Electricians</router-link>
              <router-link to="/app/services/plumber" class="block text-gray-600 hover:text-emerald-600 transition-colors">Plumbers</router-link>
              <router-link to="/app/services/carpenter" class="block text-gray-600 hover:text-emerald-600 transition-colors">Carpenters</router-link>
            </div>
          </div>

          <!-- Creative Talent Links -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Creative Talent</h4>
            <div class="space-y-2 text-sm">
              <router-link to="/app" class="block text-gray-600 hover:text-orange-600 transition-colors">Discover</router-link>
              <router-link to="/app/search" class="block text-gray-600 hover:text-orange-600 transition-colors">Browse Talent</router-link>
              <router-link to="/app/upload" class="block text-gray-600 hover:text-orange-600 transition-colors">Create Portfolio</router-link>
              <a href="#" class="block text-gray-600 hover:text-orange-600 transition-colors">Success Stories</a>
            </div>
          </div>

          <!-- General Links -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Support</h4>
            <div class="space-y-2 text-sm">
              <router-link to="/" class="block text-gray-600 hover:text-blue-600 transition-colors">About</router-link>
              <a href="#" class="block text-gray-600 hover:text-blue-600 transition-colors">Help</a>
              <a href="#" class="block text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <a href="#" class="block text-gray-600 hover:text-blue-600 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
        
        <!-- Copyright -->
        <div class="border-t border-gray-100 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 FURSA. Connecting African talent to global opportunities.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import SharedNavigation from '@/components/common/SharedNavigation.vue'
</script>

<style scoped>
/* Cultural Pattern Styles for Footer */
.cultural-pattern-sm {
  position: relative;
  width: 32px;
  height: 32px;
}

.pattern-bar-sm-1 { 
  background: #ff6b35; 
  height: 6px; 
  border-radius: 3px; 
}

.pattern-bar-sm-2 { 
  background: #f7931e; 
  height: 5px; 
  border-radius: 2.5px; 
  margin-top: 2px; 
  margin-left: 3px; 
}

.pattern-bar-sm-3 { 
  background: #10b981; 
  height: 4px; 
  border-radius: 2px; 
  margin-top: 2px; 
  margin-left: 6px; 
}

.pattern-bar-sm-4 { 
  background: #2563eb; 
  height: 3px; 
  border-radius: 1.5px; 
  margin-top: 2px; 
  margin-left: 9px; 
}
</style>