// src/composables/useLanguage.js
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLanguage() {
  const { locale, t } = useI18n()
  
  const currentLanguage = computed(() => locale.value)
  
  const availableLanguages = [
    { 
      code: 'en', 
      name: 'English', 
      flag: '🇬🇧', 
      native: 'English',
      direction: 'ltr'
    },
    { 
      code: 'sw', 
      name: 'Kiswahili', 
      flag: '🇰🇪', 
      native: 'Kiswahili',
      direction: 'ltr'
    }
  ]
  
  const switchLanguage = (langCode) => {
    // Validate language code
    const isValidLanguage = availableLanguages.some(lang => lang.code === langCode)
    if (!isValidLanguage) {
      console.warn(`Language code "${langCode}" is not supported`)
      return
    }
    
    // Update locale
    locale.value = langCode
    
    // Persist to localStorage
    localStorage.setItem('fursa-language', langCode)
    
    // Update document direction (for future RTL languages like Arabic)
    const languageInfo = availableLanguages.find(lang => lang.code === langCode)
    document.dir = languageInfo?.direction || 'ltr'
    
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = langCode
    
    console.log(`Language switched to: ${languageInfo?.native} (${langCode})`)
  }
  
  const getCurrentLanguageInfo = computed(() => {
    return availableLanguages.find(lang => lang.code === locale.value) || availableLanguages[0]
  })
  
  return {
    currentLanguage,
    availableLanguages,
    getCurrentLanguageInfo,
    switchLanguage,
    t
  }
}