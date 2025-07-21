// src/main.js - Enhanced with Pinia (preserving existing setup)
import { createApp } from 'vue'
import { createPinia } from 'pinia'  // ADD: Pinia for state management
import App from './App.vue'
import router from './router'
import i18n from './i18n'  // Keep your existing i18n
import './style.css'

// Create Vue app
const app = createApp(App)

// Create Pinia store instance
const pinia = createPinia()  // ADD: Create Pinia instance

// Use plugins in order (important!)
app.use(pinia)    // ADD: Use Pinia BEFORE router (state management first)
app.use(router)   // Keep: Your existing router
app.use(i18n)     // Keep: Your existing i18n

// Initialize authentication on app start
import { useAuthStore } from '@/stores/auth'
app.config.globalProperties.$initAuth = async () => {
  const authStore = useAuthStore()
  await authStore.initializeAuth()
}

// Global error handling (optional enhancement)
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  // You could send to error reporting service here
}

// Mount the app
app.mount('#app')

// Initialize auth after mount (in development mode, add logging)
if (import.meta.env.DEV) {
  console.log('🚀 FURSA Platform starting...')
  console.log('📦 Pinia store initialized')
  console.log('🌍 i18n ready')
  console.log('🛣️ Router ready')
}

// Initialize authentication
window.addEventListener('load', async () => {
  try {
    await app.config.globalProperties.$initAuth()
    if (import.meta.env.DEV) {
      console.log('🔐 Authentication initialized')
    }
  } catch (error) {
    console.warn('Auth initialization failed:', error)
  }
})