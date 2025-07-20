// src/i18n/index.js - i18n configuration only
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import sw from './locales/sw.json'

const messages = {
  en,
  sw
}

// Detect user's preferred language
function detectLanguage() {
  // Check localStorage first
  const saved = localStorage.getItem('fursa-language')
  if (saved) return saved
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0]
  if (browserLang === 'sw') return 'sw'
  
  // Default to English
  return 'en'
}

const i18n = createI18n({
  locale: detectLanguage(),
  fallbackLocale: 'en',
  messages,
  legacy: false, // Use Composition API mode
  globalInjection: true
})

export default i18n