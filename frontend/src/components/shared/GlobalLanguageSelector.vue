<!-- GlobalLanguageSelector.vue - Reusable global language selector -->
<template>
  <div class="relative" ref="dropdownRef">
    <!-- Compact version for mobile -->
    <button v-if="size === 'compact'" 
            @click="toggleLanguageDropdown"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
      <span class="text-lg">{{ currentLanguageFlag }}</span>
    </button>
    
    <!-- Full version for desktop -->
    <button v-else
            @click="toggleLanguageDropdown"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors bg-white">
      <span class="text-lg">{{ currentLanguageFlag }}</span>
      <span class="text-sm font-medium text-gray-700">{{ currentLanguageName }}</span>
      <ChevronDown :class="[
        'w-4 h-4 text-gray-500 transition-transform',
        showLanguageDropdown ? 'rotate-180' : ''
      ]" />
    </button>

    <!-- Dropdown Menu -->
    <transition name="dropdown">
      <div v-if="showLanguageDropdown" 
           @click.stop
           class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-sm font-medium text-gray-900">{{ t('common.language') || 'Choose Language' }}</p>
          <p class="text-xs text-gray-500">{{ t('common.language_desc') || 'Select your preferred language' }}</p>
        </div>

        <!-- Language Options -->
        <div class="py-2">
          <!-- English Option -->
          <button @click="switchToLanguage('en')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between',
                    currentLanguage === 'en' ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  ]">
            <div class="flex items-center space-x-3">
              <span class="text-lg">🇬🇧</span>
              <div>
                <div class="text-sm font-medium text-gray-900">English</div>
                <div class="text-xs text-gray-500">English</div>
              </div>
            </div>
            <Check v-if="currentLanguage === 'en'" class="w-4 h-4 text-blue-600" />
          </button>
          
          <!-- Swahili Option -->
          <button @click="switchToLanguage('sw')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between',
                    currentLanguage === 'sw' ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  ]">
            <div class="flex items-center space-x-3">
              <span class="text-lg">🇰🇪</span>
              <div>
                <div class="text-sm font-medium text-gray-900">Kiswahili</div>
                <div class="text-xs text-gray-500">Swahili</div>
              </div>
            </div>
            <Check v-if="currentLanguage === 'sw'" class="w-4 h-4 text-blue-600" />
          </button>
        </div>

        <!-- Footer -->
        <div class="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p class="text-xs text-gray-600 text-center">
            {{ t('common.more_languages') || 'More languages coming soon' }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, Check } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  size: {
    type: String,
    default: 'full', // 'full' or 'compact'
    validator: (value) => ['full', 'compact'].includes(value)
  }
})

// Vue I18n setup
const { locale, t } = useI18n()

// Component state
const dropdownRef = ref(null)
const showLanguageDropdown = ref(false)

// Computed properties
const currentLanguage = computed(() => locale.value)
const currentLanguageFlag = computed(() => {
  return currentLanguage.value === 'sw' ? '🇰🇪' : '🇬🇧'
})
const currentLanguageName = computed(() => {
  return currentLanguage.value === 'sw' ? 'Kiswahili' : 'English'
})

// Methods
const toggleLanguageDropdown = () => {
  showLanguageDropdown.value = !showLanguageDropdown.value
}

const switchToLanguage = (langCode) => {
  // Update global locale
  locale.value = langCode
  
  // Persist to localStorage
  localStorage.setItem('fursa-language', langCode)
  
  // Close dropdown
  showLanguageDropdown.value = false
  
  // Update document language for accessibility
  document.documentElement.lang = langCode
  
  // Log success
  const languageName = langCode === 'sw' ? 'Kiswahili' : 'English'
  console.log(`🌍 Global language switched to ${languageName}`)
  
  // Optional: You can emit an event or show a toast notification here
  // emit('language-changed', { code: langCode, name: languageName })
}

// Close dropdown when clicking outside
onClickOutside(dropdownRef, () => {
  showLanguageDropdown.value = false
})

// Initialize language on mount
onMounted(() => {
  const savedLanguage = localStorage.getItem('fursa-language')
  if (savedLanguage && ['en', 'sw'].includes(savedLanguage)) {
    locale.value = savedLanguage
    document.documentElement.lang = savedLanguage
  }
})
</script>

<style scoped>
/* Dropdown transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Smooth transitions for interactive elements */
* {
  transition: all 0.15s ease;
}
</style>