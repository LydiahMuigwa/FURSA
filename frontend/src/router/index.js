// frontend/src/router/index.js - COMPLETE VERSION (All components connected)

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/LandingPage.vue'),
    meta: { title: 'FURSA - African Talent Platform' }
  },
  
  // App routes with simple AppLayout wrapper
  {
    path: '/app',
    component: () => import('../layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: { title: 'Discover African Talent - FURSA' }
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
        meta: { title: 'About FURSA - African Talent Platform' }
      },
      {
        path: 'login',
        name: 'login-page',
        component: () => import('../views/LoginPage.vue'),
        meta: { title: 'Sign In - FURSA', requiresGuest: true }
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('../views/SearchView.vue'),
        meta: { title: 'Search Talent - FURSA' }
      },
      {
        path: 'talent/:id',
        name: 'talent-profile',
        component: () => import('../views/TalentProfile.vue'),
        meta: { title: 'Talent Profile - FURSA' },
        props: true
      },
      {
        path: 'services',
        name: 'services',
        component: () => import('../views/ServiceProviderSearch.vue'),
        meta: { title: 'Find Services Near You - FURSA' }
      },
      {
        path: 'services/:category',
        name: 'services-category',
        component: () => import('../views/ServiceProviderSearch.vue'),
        meta: { title: 'Find Services - FURSA' },
        props: true
      },
      {
        path: 'service-provider/:id',
        name: 'service-provider-profile',
        component: () => import('../views/ServiceProviderProfile.vue'),
        meta: { title: 'Service Provider - FURSA' },
        props: true
      },
      {
        path: 'join-as-provider',
        name: 'provider-registration',
        component: () => import('../views/UnifiedRegistration.vue'),
        meta: { title: 'Join as Service Provider - FURSA', userType: 'provider', requiresGuest: true }
      },
      {
        path: 'upload',
        name: 'talent-registration',
        component: () => import('../views/UnifiedRegistration.vue'),
        meta: { title: 'Join as Creative Talent - FURSA', userType: 'talent', requiresGuest: true }
      },
      {
        path: 'profile',
        name: 'user-profile',
        component: () => import('../views/UserProfile.vue'),
        meta: { title: 'My Profile - FURSA', requiresAuth: true }
      }
    ]
  },

  // Provider Dashboard - Using your existing ProviderDashboardLayout
  {
    path: '/app/provider-dashboard',
    component: () => import('../layouts/ProviderDashboardLayout.vue'),
    meta: { requiresAuth: true, userType: 'provider' },
    children: [
      // Main Dashboard
      {
        path: '',
        name: 'provider-dashboard',
        component: () => import('../components/service-provider/modals/ServiceProviderDashboard.vue'),
        meta: { title: 'Provider Dashboard - FURSA' }
      },

      // ✅ STORY & PORTFOLIO MANAGEMENT
      {
        path: 'story-builder',
        name: 'provider-story-builder',
        component: () => import('../components/service-provider/stories/WorkStoryBuilder.vue'),
        meta: { title: 'Tell Your Story - FURSA' }
      },
      {
        path: 'my-stories',
        name: 'provider-my-stories',
        component: () => import('../components/service-provider/MyStories.vue'),
        meta: { title: 'My Stories - FURSA' }
      },
      {
        path: 'portfolio-manager',
        name: 'provider-portfolio-manager',
        component: () => import('../components/service-provider/PortfolioManager.vue'),
        meta: { title: 'Portfolio Manager - FURSA' }
      },

      // ✅ PROFILE MANAGEMENT
      {
        path: 'profile-edit',
        name: 'provider-profile-edit',
        component: () => import('../components/service-provider/ProviderProfileEdit.vue'),
        meta: { title: 'Edit Profile - FURSA' }
      },
      {
        path: 'contact-success',
        name: 'provider-contact-success',
        component: () => import('../components/service-provider/ContactSuccessModal.vue'),
        meta: { title: 'Contact Success - FURSA' }
      },

      // ✅ MODAL ROUTES - Display modals as overlay pages
      {
        path: 'modals/all-bookings',
        name: 'provider-all-bookings',
        component: () => import('../components/service-provider/modals/AllBookingsModal.vue'),
        meta: { title: 'All Bookings - FURSA', displayMode: 'modal' }
      },
      {
        path: 'modals/photo-viewer',
        name: 'provider-photo-viewer',
        component: () => import('../components/service-provider/modals/PhotoViewerModal.vue'),
        meta: { title: 'Photo Viewer - FURSA', displayMode: 'modal' }
      },
      {
        path: 'modals/quote-response',
        name: 'provider-quote-response',
        component: () => import('../components/service-provider/modals/QuoteResponseModal.vue'),
        meta: { title: 'Quote Response - FURSA', displayMode: 'modal' }
      },
      {
        path: 'modals/quote-response-success',
        name: 'provider-quote-response-success',
        component: () => import('../components/service-provider/modals/QuoteResponseSuccessModal.vue'),
        meta: { title: 'Quote Response Success - FURSA', displayMode: 'modal' }
      },
      {
        path: 'modals/schedule-appointment',
        name: 'provider-schedule-appointment',
        component: () => import('../components/service-provider/modals/ScheduleAppointmentModal.vue'),
        meta: { title: 'Schedule Appointment - FURSA', displayMode: 'modal' }
      },
      {
        path: 'modals/schedule-management',
        name: 'provider-schedule-management',
        component: () => import('../components/service-provider/modals/ScheduleManagementModal.vue'),
        meta: { title: 'Schedule Management - FURSA', displayMode: 'modal' }
      },
      {
        path: 'modals/time-block',
        name: 'provider-time-block',
        component: () => import('../components/service-provider/modals/TimeBlockModal.vue'),
        meta: { title: 'Time Block - FURSA', displayMode: 'modal' }
      },
      {
        path: 'modals/weekly-hours',
        name: 'provider-weekly-hours',
        component: () => import('../components/service-provider/modals/WeeklyHoursModal.vue'),
        meta: { title: 'Weekly Hours - FURSA', displayMode: 'modal' }
      },

      // ✅ FORM ROUTES - Display forms as full-page components
      {
        path: 'forms/location-picker',
        name: 'provider-location-picker',
        component: () => import('../components/service-provider/forms/LocationPicker.vue'),
        meta: { title: 'Location Picker - FURSA' }
      },
      {
        path: 'forms/quote-request',
        name: 'provider-quote-request-form',
        component: () => import('../components/service-provider/forms/QuoteRequestModal.vue'),
        meta: { title: 'Quote Request - FURSA' }
      },

      // ✅ CARD SHOWCASE ROUTES - Display cards for testing/showcase
      {
        path: 'showcase/booking-card',
        name: 'provider-booking-card-showcase',
        component: () => import('../components/service-provider/cards/BookingCard.vue'),
        meta: { title: 'Booking Card Showcase - FURSA' }
      },
      {
        path: 'showcase/quote-request-card',
        name: 'provider-quote-request-card-showcase',
        component: () => import('../components/service-provider/cards/QuoteRequestCard.vue'),
        meta: { title: 'Quote Request Card Showcase - FURSA' }
      },
      {
        path: 'showcase/service-provider-card',
        name: 'provider-service-provider-card-showcase',
        component: () => import('../components/service-provider/cards/ServiceProviderCard.vue'),
        meta: { title: 'Service Provider Card Showcase - FURSA' }
      },

      // ✅ SHARED COMPONENT ROUTES - For testing/configuration
      {
        path: 'tools/language-selector',
        name: 'provider-language-selector',
        component: () => import('../components/shared/LanguageSelector.vue'),
        meta: { title: 'Language Selector - FURSA' }
      },
      {
        path: 'tools/photo-upload',
        name: 'provider-photo-upload',
        component: () => import('../components/shared/PhotoUploadZone.vue'),
        meta: { title: 'Photo Upload - FURSA' }
      },
      {
        path: 'tools/story-preview',
        name: 'provider-story-preview',
        component: () => import('../components/shared/StoryPreview.vue'),
        meta: { title: 'Story Preview - FURSA' }
      },

      // ✅ FUTURE ROUTES (Ready to uncomment when needed)
      //{
       // path: 'earnings',
       // name: 'provider-earnings',
       // component: () => import('../views/provider/ProviderEarnings.vue'),
       // meta: { title: 'Earnings - FURSA' }
     // },
     // {
       // path: 'reviews',
       // name: 'provider-reviews',
       // component: () => import('../views/provider/ProviderReviews.vue'),
       // meta: { title: 'Reviews - FURSA' }
      //},
      //{
       // path: 'settings',
       // name: 'provider-settings',
       // component: () => import('../views/provider/ProviderSettings.vue'),
       // meta: { title: 'Settings - FURSA' }
      //}
    ]
  },

  // Talent Dashboard - Simple view for now
  {
    path: '/app/talent-dashboard',
    name: 'talent-dashboard',
    component: () => import('../components/talent/TalentDashboard.vue'),
    meta: { requiresAuth: true, userType: 'talent', title: 'Talent Dashboard - FURSA' }
  },

  // 404 Route
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Page Not Found - FURSA' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Authentication guards
router.beforeEach(async (to, from, next) => {
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()

  if (!authStore.user && !authStore.isLoading) {
    await authStore.initializeAuth()
  }

  const baseTitle = 'FURSA - African Talent Platform'
  document.title = to.meta.title || baseTitle

  console.log('🧭 Navigating to:', to.path, 'User type:', authStore.userType, 'Authenticated:', authStore.isAuthenticated)

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('🔒 Authentication required, redirecting to login page')
      next({ name: 'login-page', query: { redirectTo: to.fullPath } })
      return
    }
    
    if (to.meta.userType && authStore.userType !== to.meta.userType) {
      console.log(`🚫 User type mismatch. Route requires: ${to.meta.userType}, User is: ${authStore.userType}`)
      
      if (authStore.userType === 'provider') {
        console.log('👷 Redirecting provider to provider dashboard')
        next('/app/provider-dashboard')
      } else if (authStore.userType === 'talent') {
        console.log('🎨 Redirecting talent to talent dashboard')
        next('/app/talent-dashboard')
      } else {
        console.log('❓ Unknown user type, redirecting to home')
        next('/app')
      }
      return
    }
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('👤 Already authenticated user trying to access guest route')
    
    if (authStore.userType === 'provider') {
      console.log('👷 Authenticated provider redirected to provider dashboard')
      next('/app/provider-dashboard')
    } else if (authStore.userType === 'talent') {
      console.log('🎨 Authenticated talent redirected to talent dashboard')
      next('/app/talent-dashboard')
    } else {
      next('/app')
    }
    return
  }

  next()
})

// Enhanced Navigation helper functions
export const navigationHelpers = {
  // Dashboard navigation
  goToDashboard() {
    return new Promise((resolve) => {
      import('@/stores/auth').then(({ useAuthStore }) => {
        const authStore = useAuthStore()
        
        console.log('🧭 goToDashboard called. User type:', authStore.userType)
        
        if (!authStore.isAuthenticated) {
          console.log('❌ User not authenticated, redirecting to login')
          router.push({ name: 'login-page' })
          resolve()
          return
        }
        
        if (authStore.userType === 'provider') {
          console.log('👷 Navigating to provider dashboard')
          router.push({ name: 'provider-dashboard' })
        } else if (authStore.userType === 'talent') {
          console.log('🎨 Navigating to talent dashboard')
          router.push({ name: 'talent-dashboard' })
        } else {
          console.log('❓ Unknown user type, redirecting to home')
          router.push({ name: 'home' })
        }
        resolve()
      })
    })
  },

  // Profile navigation
  goToProvider(providerId) {
    return router.push({ name: 'service-provider-profile', params: { id: providerId } })
  },
  
  goToTalent(talentId) {
    return router.push({ name: 'talent-profile', params: { id: talentId } })
  },

  // Service search
  searchService(category, location = null) {
    const query = location ? { location } : {}
    return router.push({ 
      name: 'services-category', 
      params: { category },
      query 
    })
  },

  // Registration flows
  goToProviderRegistration() {
    return router.push({ name: 'provider-registration' })
  },

  goToTalentRegistration() {
    return router.push({ name: 'talent-registration' })
  },

  // Authentication
  requireLogin() {
    return router.push({ name: 'login-page' })
  },

  goToLogin() {
    return router.push({ name: 'login-page' })
  },

  redirectAfterLogin(userType) {
    console.log('🔄 Redirecting after login. User type:', userType)
    
    if (userType === 'provider') {
      console.log('👷 Provider logged in, going to provider dashboard')
      return router.push({ name: 'provider-dashboard' })
    } else if (userType === 'talent') {
      console.log('🎨 Talent logged in, going to talent dashboard')
      return router.push({ name: 'talent-dashboard' })
    } else {
      console.log('❓ Unknown user type after login')
      return router.push({ name: 'home' })
    }
  },

  redirectAfterRegistration(userType) {
    console.log('🎉 Redirecting after registration. User type:', userType)
    
    if (userType === 'provider') {
      console.log('👷 Provider registered, going to provider dashboard')
      return router.push({ name: 'provider-dashboard' })
    } else if (userType === 'talent') {
      console.log('🎨 Talent registered, going to talent dashboard')
      return router.push({ name: 'talent-dashboard' })
    } else {
      console.log('❓ Unknown user type after registration')
      return router.push({ name: 'home' })
    }
  },

  // ✅ NEW: Component-specific navigation helpers
  // Modal helpers
  openAllBookings() {
    return router.push({ name: 'provider-all-bookings' })
  },

  openPhotoViewer(photoId = null) {
    return router.push({ 
      name: 'provider-photo-viewer',
      query: photoId ? { photoId } : {}
    })
  },

  openQuoteResponse(quoteId = null) {
    return router.push({ 
      name: 'provider-quote-response',
      query: quoteId ? { quoteId } : {}
    })
  },

  openScheduleAppointment() {
    return router.push({ name: 'provider-schedule-appointment' })
  },

  openScheduleManagement() {
    return router.push({ name: 'provider-schedule-management' })
  },

  openTimeBlock() {
    return router.push({ name: 'provider-time-block' })
  },

  openWeeklyHours() {
    return router.push({ name: 'provider-weekly-hours' })
  },

  // Form helpers
  goToLocationPicker() {
    return router.push({ name: 'provider-location-picker' })
  },

  goToQuoteRequestForm() {
    return router.push({ name: 'provider-quote-request-form' })
  },

  // Tool helpers
  goToLanguageSelector() {
    return router.push({ name: 'provider-language-selector' })
  },

  goToPhotoUpload() {
    return router.push({ name: 'provider-photo-upload' })
  },

  goToStoryPreview(storyId = null) {
    return router.push({ 
      name: 'provider-story-preview',
      query: storyId ? { storyId } : {}
    })
  },

  // Showcase helpers (for testing components)
  showBookingCard() {
    return router.push({ name: 'provider-booking-card-showcase' })
  },

  showQuoteRequestCard() {
    return router.push({ name: 'provider-quote-request-card-showcase' })
  },

  showServiceProviderCard() {
    return router.push({ name: 'provider-service-provider-card-showcase' })
  }
}

export default router