import { createRouter, createWebHistory } from 'vue-router'

// Import views (keep all your existing imports)
import LandingPage from '../views/LandingPage.vue'
import AppLayout from '../views/AppLayout.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Landing Page (Marketing Site) - UNCHANGED
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
      meta: {
        title: 'FURSA - Connecting African Talent to Global Opportunities'
      }
    },
    
    // Main App Routes (Nested under /app) - ENHANCED
    {
      path: '/app',
      component: AppLayout,
      children: [
        // App Home (Discovery Page) - UNCHANGED
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: {
            title: 'Discover Talent - FURSA'
          }
        },
        
        // === TALENT ROUTES (Updated with Unified Registration) ===
        {
          path: 'search',
          name: 'search',
          component: () => import('../views/SearchView.vue'),
          meta: {
            title: 'Browse Talent - FURSA'
          }
        },
        
        // UPDATED: Creative Talent Registration
        {
          path: 'upload',
          name: 'talent-registration',
          component: () => import('../views/UnifiedRegistration.vue'),
          meta: {
            title: 'Join as Creative Talent - FURSA',
            userType: 'talent'
          }
        },
        
        {
          path: 'talent/:id',
          name: 'talent-profile',
          component: () => import('../views/TalentProfile.vue'),
          meta: {
            title: 'Talent Profile - FURSA'
          },
          props: true
        },

        // === SERVICE PROVIDER ROUTES - UNCHANGED ===
        {
          path: 'services',
          name: 'services',
          component: () => import('../views/ServiceProviderSearch.vue'),
          meta: {
            title: 'Find Services Near You - FURSA'
          }
        },

        {
          path: 'services/:category',
          name: 'services-category',
          component: () => import('../views/ServiceProviderSearch.vue'),
          meta: {
            title: 'Find Services - FURSA'
          },
          props: true
        },

        {
          path: 'service-provider/:id',
          name: 'service-provider-profile',
          component: () => import('../views/ServiceProviderProfile.vue'),
          meta: {
            title: 'Service Provider - FURSA'
          },
          props: true
        },

        // === PROTECTED ROUTES - ENHANCED WITH PROPER AUTH ===
        {
          path: 'provider-dashboard',
          name: 'provider-dashboard',
          component: () => import('../components/service-provider/modals/ServiceProviderDashboard.vue'),
          meta: {
            title: 'Provider Dashboard - FURSA',
            requiresAuth: true,
            userType: 'provider'
          }
        }, 

        {
          path: 'talent-dashboard',
          name: 'talent-dashboard',
          component: () => import('../components/talent/TalentDashboard.vue'),
          meta: {
            title: 'Talent Dashboard - FURSA',
            requiresAuth: true,
            userType: 'talent'
          }
        },

        // === REGISTRATION ROUTES - UPDATED WITH UNIFIED SYSTEM ===
        
        // UPDATED: Service Provider Registration  
        {
          path: 'join-as-provider',
          name: 'provider-registration',
          component: () => import('../views/UnifiedRegistration.vue'),
          meta: {
            title: 'Join as Service Provider - FURSA',
            userType: 'provider'
          }
        }, 

        // === AUTHENTICATION ROUTES - ENHANCED ===
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/LoginPage.vue'),
          meta: {
            title: 'Login - FURSA',
            requiresGuest: true
          }
        },

        // === ADDITIONAL PROTECTED ROUTES ===
        
        // User Profile Route
        {
          path: 'profile',
          name: 'user-profile',
          component: () => import('../views/UserProfile.vue'),
          meta: {
            title: 'My Profile - FURSA',
            requiresAuth: true
          }
        },

        // Work Story Builder - ENHANCED
        {
          path: 'provider/story-builder',
          name: 'WorkStoryBuilder', 
          component: () => import('@/components/service-provider/stories/WorkStoryBuilder.vue'),
          meta: {
            title: 'Tell Your Work Story - FURSA',
            requiresAuth: true,
            userType: 'provider'
          }
        }

        // === FUTURE ROUTES (Keep commented for now) ===
        // Messages route for future
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
    
    // About page - UNCHANGED
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About FURSA'
      }
    },

    // Redirects - UNCHANGED
    {
      path: '/home',
      redirect: '/app'
    },

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
    
    // 404 Catch-all - UNCHANGED
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: {
        title: 'Page Not Found - FURSA'
      }
    }
  ],
  
  // Scroll behavior - UNCHANGED
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// ENHANCED: Global navigation guards with proper authentication
router.beforeEach(async (to, from, next) => {
  // Import auth store dynamically to avoid circular imports
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()

  // Initialize auth if not already done
  if (!authStore.user && !authStore.isLoading) {
    await authStore.initializeAuth()
  }

  // Update page title (UNCHANGED)
  const baseTitle = 'FURSA - African Talent Platform'
  
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

  // ENHANCED: Authentication guards
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('🔒 Authentication required, redirecting to home with login prompt')
      next({ 
        name: 'home', 
        query: { 
          redirectTo: to.fullPath,
          showLogin: 'true' 
        } 
      })
      return
    }
    
    // Check user type if specified
    if (to.meta.userType && authStore.userType !== to.meta.userType) {
      console.log(`🚫 Wrong user type. Required: ${to.meta.userType}, Current: ${authStore.userType}`)
      // Redirect to appropriate dashboard
      if (authStore.userType === 'provider') {
        next('/app/provider-dashboard')
      } else if (authStore.userType === 'talent') {
        next('/app/talent-dashboard')
      } else {
        next('/app')
      }
      return
    }
  }

  // NEW: Guest-only routes (like login)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('👤 Already authenticated, redirecting to dashboard')
    // Redirect authenticated users to their dashboard
    if (authStore.userType === 'provider') {
      next('/app/provider-dashboard')
    } else if (authStore.userType === 'talent') {
      next('/app/talent-dashboard')
    } else {
      next('/app')
    }
    return
  }

  next()
})

// ENHANCED: Navigation helper functions
export const navigationHelpers = {
  // Existing helpers - UNCHANGED
  goToProvider(providerId) {
    return router.push({ name: 'service-provider-profile', params: { id: providerId } })
  },
  
  searchService(category, location = null) {
    const query = location ? { location } : {}
    return router.push({ 
      name: 'services-category', 
      params: { category },
      query 
    })
  },

  goToTalent(talentId) {
    return router.push({ name: 'talent-profile', params: { id: talentId } })
  },

  goToProviderDashboard() {
    return router.push({ name: 'provider-dashboard' })
  }, 

  // UPDATED: Registration helpers
  goToProviderOnboarding() {
    return router.push({ name: 'provider-registration' })  // Updated name
  },

  goToTalentRegistration() {
    return router.push({ name: 'talent-registration' })    // Updated name
  },

  // NEW: Authentication helpers
  goToDashboard() {
    // Import dynamically to avoid circular dependency
    import('@/stores/auth').then(({ useAuthStore }) => {
      const authStore = useAuthStore()
      if (authStore.userType === 'provider') {
        return router.push('/app/provider-dashboard')
      } else if (authStore.userType === 'talent') {
        return router.push('/app/talent-dashboard')
      } else {
        return router.push('/app')
      }
    })
  },

  requireLogin() {
    return router.push({ name: 'home', query: { showLogin: 'true' } })
  }
}

export default router