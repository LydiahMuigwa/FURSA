// router/index.js - COMPLETE: Fixed routing with login page

import { createRouter, createWebHistory } from 'vue-router'

// Route definitions
const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/LandingPage.vue'),
    meta: {
      title: 'FURSA - African Talent Platform'
    }
  },
  
  // App routes
  {
    path: '/app',
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: {
          title: 'Discover African Talent - FURSA'
        }
      },

      // ADDED: Login route - this was missing!
      {
        path: 'login',
        name: 'login-page',
        component: () => import('../views/LoginPage.vue'),
        meta: {
          title: 'Sign In - FURSA',
          requiresGuest: true
        }
      },

      // Search and Browse
      {
        path: 'search',
        name: 'search',
        component: () => import('../views/SearchView.vue'),
        meta: {
          title: 'Search Talent - FURSA'
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

      // Service Provider Routes
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

      // === PROTECTED DASHBOARD ROUTES ===
      {
        path: 'provider-dashboard',
        name: 'provider-dashboard',
        // FIXED: Correct path to ServiceProviderDashboard component (it's in modals folder)
        component: () => import('../components/service-provider/modals/ServiceProviderDashboard.vue'),
        meta: {
          title: 'Provider Dashboard - FURSA',
          requiresAuth: true,
          userType: 'provider' // CRITICAL: Only providers can access
        }
      }, 

      {
  path: '/app/provider-dashboard/story-builder',
  name: 'provider-story-builder',
  component: () => import('../components/service-provider/stories/WorkStoryBuilder.vue'),
  meta: {
    title: 'Tell Your Story - FURSA',
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
          userType: 'talent' // CRITICAL: Only talents can access
        }
      },

      // Registration Routes
      {
        path: 'join-as-provider',
        name: 'provider-registration',
        component: () => import('../views/UnifiedRegistration.vue'),
        meta: {
          title: 'Join as Service Provider - FURSA',
          userType: 'provider',
          requiresGuest: true
        }
      },

      {
        path: 'upload',
        name: 'talent-registration',
        component: () => import('../views/UnifiedRegistration.vue'),
        meta: {
          title: 'Join as Creative Talent - FURSA',
          userType: 'talent',
          requiresGuest: true
        }
      },

      // Profile Routes
      {
        path: 'profile',
        name: 'user-profile',
        component: () => import('../views/UserProfile.vue'),
        meta: {
          title: 'My Profile - FURSA',
          requiresAuth: true
        }
      }
    ]
  },

  // 404 Route
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: 'Page Not Found - FURSA'
    }
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

// ENHANCED: Authentication guards with login route handling
router.beforeEach(async (to, from, next) => {
  // Import auth store dynamically to avoid circular imports
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()

  // Initialize auth if not already done
  if (!authStore.user && !authStore.isLoading) {
    await authStore.initializeAuth()
  }

  // Update page title
  const baseTitle = 'FURSA - African Talent Platform'
  document.title = to.meta.title || baseTitle

  console.log('🧭 Navigating to:', to.path, 'User type:', authStore.userType, 'Authenticated:', authStore.isAuthenticated)

  // FIXED: Authentication guards with proper user type checking
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('🔒 Authentication required, redirecting to login page')
      next({ 
        name: 'login-page', 
        query: { 
          redirectTo: to.fullPath
        } 
      })
      return
    }
    
    // CRITICAL: Check if user type matches required route type
    if (to.meta.userType && authStore.userType !== to.meta.userType) {
      console.log(`🚫 User type mismatch. Route requires: ${to.meta.userType}, User is: ${authStore.userType}`)
      
      // Redirect to appropriate dashboard based on actual user type
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

  // ENHANCED: Guest-only routes (registration/login)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('👤 Already authenticated user trying to access guest route')
    
    // Redirect authenticated users to their appropriate dashboard
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

// ENHANCED: Navigation helper functions
export const navigationHelpers = {
  // Dashboard navigation - FIXED to check user type
  goToDashboard() {
    return new Promise((resolve) => {
      import('@/stores/auth').then(({ useAuthStore }) => {
        const authStore = useAuthStore()
        
        console.log('🧭 goToDashboard called. User type:', authStore.userType)
        
        if (!authStore.isAuthenticated) {
          console.log('❌ User not authenticated, redirecting to login')
          router.push('/app/login')
          resolve()
          return
        }
        
        if (authStore.userType === 'provider') {
          console.log('👷 Navigating to provider dashboard')
          router.push('/app/provider-dashboard')
        } else if (authStore.userType === 'talent') {
          console.log('🎨 Navigating to talent dashboard')
          router.push('/app/talent-dashboard')
        } else {
          console.log('❓ Unknown user type, redirecting to home')
          router.push('/app')
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

  // Authentication - ENHANCED with login page
  requireLogin() {
    return router.push({ name: 'login-page' })
  },

  goToLogin() {
    return router.push({ name: 'login-page' })
  },

  // FIXED: After login redirection
  redirectAfterLogin(userType) {
    console.log('🔄 Redirecting after login. User type:', userType)
    
    if (userType === 'provider') {
      console.log('👷 Provider logged in, going to provider dashboard')
      return router.push('/app/provider-dashboard')
    } else if (userType === 'talent') {
      console.log('🎨 Talent logged in, going to talent dashboard')
      return router.push('/app/talent-dashboard')
    } else {
      console.log('❓ Unknown user type after login')
      return router.push('/app')
    }
  },

  // FIXED: After registration redirection
  redirectAfterRegistration(userType) {
    console.log('🎉 Redirecting after registration. User type:', userType)
    
    if (userType === 'provider') {
      console.log('👷 Provider registered, going to provider dashboard')
      return router.push('/app/provider-dashboard')
    } else if (userType === 'talent') {
      console.log('🎨 Talent registered, going to talent dashboard')
      return router.push('/app/talent-dashboard')
    } else {
      console.log('❓ Unknown user type after registration')
      return router.push('/app')
    }
  }
}

export default router