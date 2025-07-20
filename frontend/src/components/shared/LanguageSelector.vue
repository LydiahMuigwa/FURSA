<!-- LanguageSelector.vue - Professional language switcher -->
<template>
  <div class="relative">
    <!-- Language Toggle Button -->
    <button @click="showDropdown = !showDropdown"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors bg-white">
      <span class="text-lg">{{ getCurrentLanguageInfo.flag }}</span>
      <span class="text-sm font-medium text-gray-700">{{ getCurrentLanguageInfo.native }}</span>
      <ChevronDown :class="[
        'w-4 h-4 text-gray-500 transition-transform',
        showDropdown ? 'rotate-180' : ''
      ]" />
    </button>

    <!-- Language Dropdown -->
    <div v-if="showDropdown" 
         v-click-outside="() => showDropdown = false"
         class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-100">
        <p class="text-sm font-medium text-gray-900">{{ t('common.language') || 'Choose Language' }}</p>
        <p class="text-xs text-gray-500">{{ t('common.language_desc') || 'Chagua lugha' }}</p>
      </div>

      <!-- Language Options -->
      <div class="py-2">
        <button v-for="language in availableLanguages" :key="language.code"
                @click="switchToLanguage(language.code)"
                :class="[
                  'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between',
                  currentLanguage === language.code ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                ]">
          <div class="flex items-center space-x-3">
            <span class="text-lg">{{ language.flag }}</span>
            <div>
              <div class="text-sm font-medium text-gray-900">{{ language.native }}</div>
              <div class="text-xs text-gray-500">{{ language.name }}</div>
            </div>
          </div>
          
          <!-- Check mark for current language -->
          <Check v-if="currentLanguage === language.code" 
                 class="w-4 h-4 text-blue-600" />
        </button>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <p class="text-xs text-gray-600 text-center">
          {{ t('common.more_languages') || 'More languages coming soon' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { useLanguage } from '../composables/useLanguage.js'

// Language management
const { 
  currentLanguage, 
  availableLanguages, 
  switchLanguage, 
  getCurrentLanguageInfo,
  t 
} = useLanguage()

// Component state
const showDropdown = ref(false)

// Methods
const switchToLanguage = (langCode) => {
  switchLanguage(langCode)
  showDropdown.value = false
  
  // Show success notification
  const languageName = availableLanguages.find(l => l.code === langCode)?.native
  console.log(`Language switched to ${languageName}`)
  
  // Optional: Show toast notification
  // toast.success(`Language changed to ${languageName}`)
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
/* Smooth animations */
* {
  transition: all 0.2s ease;
}

/* Dropdown animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>