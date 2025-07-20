// src/main.js - Your main application file
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'  // Import the i18n instance
import './style.css'

const app = createApp(App)

app.use(router)
app.use(i18n)  // Add i18n to the app

app.mount('#app')