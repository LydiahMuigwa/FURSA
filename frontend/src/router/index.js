import { createRouter, createWebHistory } from 'vue-router'

// Import views
import LandingPage from '../views/LandingPage.vue'
import AppLayout from '../views/AppLayout.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Landing Page (Marketing Site)
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
      meta: {
        title: 'FURSA - Connecting African Talent to Global Opportunities'
      }
    },
    
    // Main App Routes (Nested under /app)
    {
      path: '/app',
      component: AppLayout,
      children: [
        // App Home (Discovery Page)
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: {
            title: 'Discover Talent - FURSA'
          }
        },
        
        // === TALENT ROUTES (Original) ===
        // Search/Browse Talent Page
        {
          path: 'search',
          name: 'search',
          component: () => import('../views/SearchView.vue'),
          meta: {
            title: 'Browse Talent - FURSA'
          }
        },
        
        // Upload/Join Flow for Talent
        {
          path: 'upload',
          name: 'upload',
          component: () => import('../views/UploadFlow.vue'),
          meta: {
            title: 'Join FURSA - Create Your Portfolio'
          }
        },
        
        // Individual Talent Profile
        {
          path: 'talent/:id',
          name: 'talent-profile',
          component: () => import('../views/TalentProfile.vue'),
          meta: {
            title: 'Talent Profile - FURSA'
          },
          props: true // Pass route params as props
        },

        // === SERVICE PROVIDER ROUTES (New) ===
        // Browse Service Providers ("Near Me" functionality)
        {
          path: 'services',
          name: 'services',
          component: () => import('../views/ServiceProviderSearch.vue'),
          meta: {
            title: 'Find Services Near You - FURSA'
          }
        },

        // Service Provider by Category
        {
          path: 'services/:category',
          name: 'services-category',
          component: () => import('../views/ServiceProviderSearch.vue'),
          meta: {
            title: 'Find Services - FURSA'
          },
          props: true
        },

        // Individual Service Provider Profile
        {
          path: 'service-provider/:id',
          name: 'service-provider-profile',
          component: () => import('../views/ServiceProviderProfile.vue'),
          meta: {
            title: 'Service Provider - FURSA'
          },
          props: true
        },

        // Service Provider Dashboard (for managing quotes)
        {
          path: 'provider-dashboard',
          name: 'provider-dashboard',
          component: () => import('../views/ServiceProviderDashboard.vue'),
          meta: {
            title: 'Provider Dashboard - FURSA',
            requiresAuth: true // This would require provider authentication
          }
        }

        // === COMMENTED OUT UNTIL COMPONENTS ARE CREATED ===
        
        // Service Provider Onboarding (commented out until file is created)
        // {
        //   path: 'join-as-provider',
        //   name: 'provider-join',
        //   component: () => import('../views/ServiceProviderOnboarding.vue'),
        //   meta: {
        //     title: 'Join as Service Provider - FURSA'
        //   }
        // },

        // Quote Request Page (optional - could be modal instead)
        // {
        //   path: 'request-quote/:providerId',
        //   name: 'request-quote',
        //   component: () => import('../views/QuoteRequest.vue'),
        //   meta: {
        //     title: 'Request Quote - FURSA'
        //   },
        //   props: true
        // },

        // User Profile/Dashboard (for both talents and service providers)
        // {
        //   path: 'profile',
        //   name: 'user-profile',
        //   component: () => import('../views/UserProfile.vue'),
        //   meta: {
        //     title: 'My Profile - FURSA',
        //     requiresAuth: true
        //   }
        // },

        // Notifications/Messages
        // {
        //   path: 'messages',
        //   name: 'messages',
        //   component: () => import('../views/Messages.vue'),
        //   meta: {
        //     title: 'Messages - FURSA',
        //     requiresAuth: true
        //   }
        // }
      ]
    },
    
    // Keep your existing about route if needed
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About FURSA'
      }
    },

    // Help/Support pages
    // {
    //   path: '/help',
    //   name: 'help',
    //   component: () => import('../views/HelpCenter.vue'),
    //   meta: {
    //     title: 'Help Center - FURSA'
    //   }
    // },
    
    // Redirect old routes for compatibility
    {
      path: '/home',
      redirect: '/app'
    },

    // Service-specific redirects for better UX
    {
      path: '/electrician',
      redirect: '/app/services/electrician'
    },
    {
      path: '/plumber',
      redirect: '/app/services/plumber'
    },
    {
      path: '/carpenter',
      redirect: '/app/services/carpenter'
    },
    
    // 404 Catch-all route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: {
        title: 'Page Not Found - FURSA'
      }
    }
  ],
  
  // Scroll behavior for smooth navigation
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guards
router.beforeEach((to, from, next) => {
  // Update page title dynamically
  const baseTitle = 'FURSA - African Talent Platform'
  
  // Dynamic titles based on route params
  if (to.name === 'service-provider-profile' && to.params.id) {
    document.title = `Service Provider Profile - ${baseTitle}`
  } else if (to.name === 'services-category' && to.params.category) {
    const categoryName = to.params.category.charAt(0).toUpperCase() + to.params.category.slice(1)
    document.title = `Find ${categoryName} Services - FURSA`
  } else if (to.name === 'provider-dashboard') {
    document.title = `Provider Dashboard - ${baseTitle}`
  } else {
    document.title = to.meta.title || baseTitle
  }
  
  // Add auth checks for protected routes
  if (to.meta.requiresAuth) {
    // Check if user is authenticated
    const isAuthenticated = false // Replace with actual auth check
    if (!isAuthenticated) {
      // For now, allow access to dashboard for testing
      // In production, redirect to login: next('/')
      console.warn('Dashboard requires authentication - allowing for development')
    }
  }
  
  next()
})

// Navigation helper functions you can use in components
export const navigationHelpers = {
  // Go to service provider profile
  goToProvider(providerId) {
    return router.push({ name: 'service-provider-profile', params: { id: providerId } })
  },
  
  // Search for specific service
  searchService(category, location = null) {
    const query = location ? { location } : {}
    return router.push({ 
      name: 'services-category', 
      params: { category },
      query 
    })
  },

  // Go to talent profile (existing)
  goToTalent(talentId) {
    return router.push({ name: 'talent-profile', params: { id: talentId } })
  },

  // New helper for provider dashboard
  goToProviderDashboard() {
    return router.push({ name: 'provider-dashboard' })
  }

  // Helper for provider onboarding (commented out until route is uncommented)
  // goToProviderOnboarding() {
  //   return router.push({ name: 'provider-join' })
  // }
}

export default router