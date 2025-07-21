<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <!-- Cultural Pattern Logo -->
            <div class="cultural-pattern">
              <div class="pattern-bar-1"></div>
              <div class="pattern-bar-2"></div>
              <div class="pattern-bar-3"></div>
              <div class="pattern-bar-4"></div>
            </div>
            <div class="font-bold text-xl text-gray-900">FURSA</div>
          </router-link>
          <router-link to="/" class="text-gray-600 hover:text-gray-800 transition-colors">
            ← Back to Home
          </router-link>
        </div>
      </div>
    </div>

    <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <LoginModal :is-open="true" @close="goHome" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import LoginModal from '@/components/auth/LoginModal.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
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