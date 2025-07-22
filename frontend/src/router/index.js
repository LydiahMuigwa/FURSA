// frontend/src/router/index.js - FIXED VERSION
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Public routes
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/LandingPage.vue')
  },
  {
    path: '/login',
    name: 'login-page',
    component: () => import('@/components/auth/LoginPage.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/components/auth/SignupPage.vue')
  },

  // Registration flows - FIXED
  {
    path: '/app/join-as-provider',
    name: 'provider-registration',
    component: () => import('@/components/auth/ProviderRegistration.vue')
  },
  {
    path: '/app/join-as-talent',
    name: 'talent-registration', 
    component: () => import('@/components/auth/TalentRegistration.vue')
  },

  // Main app layout
  {
    path: '/app',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        name: 'app-home',
        component: () => import('@/views/AppHome.vue')
      },
      {
        path: 'services/:category',
        name: 'services-category',
        component: () => import('@/components/services/ServiceCategory.vue'),
        props: true
      },
      {
        path: 'services/:category/:service',
        name: 'service-details',
        component: () => import('@/components/services/ServiceDetails.vue'),
        props: true
      },
      {
        path: 'provider/:id',
        name: 'provider-profile-public',
        component: () => import('@/components/service-provider/PublicProviderProfile.vue'),
        props: true
      }
    ]
  },

  // SERVICE PROVIDER DASHBOARD - COMPLETELY FIXED
  {
    path: '/app/provider-dashboard',
    component: () => import('@/layouts/ProviderDashboardLayout.vue'),
    meta: { requiresAuth: true, userType: 'provider' },
    children: [
      {
        path: '',
        name: 'provider-dashboard',
        component: () => import('@/components/service-provider/modals/ServiceProviderDashboard.vue')
      },
      {
        path: 'story-builder', // FIXED: This was the 404 issue
        name: 'provider-story-builder',
        component: () => import('@/components/service-provider/stories/WorkStoryBuilder.vue')
      },
      {
        path: 'profile',
        name: 'provider-profile-edit',
        component: () => import('@/components/service-provider/ProviderProfileEdit.vue')
      },
    
      {
        path: 'earnings',
        name: 'provider-earnings',
        component: () => import('@/components/service-provider/ProviderEarnings.vue')
      },
      {
        path: 'reviews',
        name: 'provider-reviews',
        component: () => import('@/components/service-provider/ProviderReviews.vue')
      },
      {
        path: 'settings',
        name: 'provider-settings',
        component: () => import('@/components/service-provider/ProviderSettings.vue')
      }
    ]
  },

  // TALENT DASHBOARD
  {
    path: '/app/talent-dashboard',
    component: () => import('@/layouts/TalentDashboardLayout.vue'),
    meta: { requiresAuth: true, userType: 'talent' },
    children: [
      {
        path: '',
        name: 'talent-dashboard',
        component: () => import('@/components/creative-talent/TalentDashboard.vue')
      },
      {
        path: 'portfolio',
        name: 'talent-portfolio',
        component: () => import('@/components/creative-talent/PortfolioBuilder.vue')
      },
      {
        path: 'orders',
        name: 'talent-orders',
        component: () => import('@/components/creative-talent/TalentOrders.vue')
      }
    ]
  },

  // Service search routes
  {
    path: '/app/services/painter',
    name: 'painter-services',
    component: () => import('@/components/services/PainterServices.vue')
  },
  {
    path: '/app/services/electrician',
    name: 'electrician-services',
    component: () => import('@/components/services/ElectricianServices.vue')
  },
  {
    path: '/app/services/plumber',
    name: 'plumber-services',
    component: () => import('@/components/services/PlumberServices.vue')
  },

  // Catch-all 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Enhanced navigation guard with proper auth checking
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  console.log('🔄 Navigation Guard:', {
    to: to.path,
    from: from.path,
    requiresAuth: to.meta.requiresAuth,
    userType: to.meta.userType,
    isAuthenticated: authStore.isAuthenticated,
    currentUserType: authStore.user?.userType
  })

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login')
      return next({ name: 'login-page', query: { redirect: to.fullPath } })
    }

    // Check user type if specified
    if (to.meta.userType && authStore.user?.userType !== to.meta.userType) {
      console.log('❌ Wrong user type, redirecting')
      
      // Redirect to correct dashboard based on actual user type
      if (authStore.user?.userType === 'provider') {
        return next('/app/provider-dashboard')
      } else if (authStore.user?.userType === 'talent') {
        return next('/app/talent-dashboard')
      } else {
        return next('/app')
      }
    }
  }

  next()
})

// Enhanced navigation helper with FIXED paths
export const navigationHelpers = {
  // Service navigation
  goToService(category, service = null) {
    if (service) {
      return router.push({ name: 'service-details', params: { category, service } })
    }
    return router.push({ name: 'services-category', params: { category } })
  },

  goToServiceSearch(category, query = {}, location = {}) {
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
  },

  // FIXED: Provider dashboard navigation
  goToStoryBuilder() {
    return router.push('/app/provider-dashboard/story-builder')
  },

  goToProviderProfile() {
    return router.push('/app/provider-dashboard/profile')
  },

  goToProviderSchedule() {
    return router.push('/app/provider-dashboard/schedule')
  },

  goToProviderEarnings() {
    return router.push('/app/provider-dashboard/earnings')
  },

  goToProviderReviews() {
    return router.push('/app/provider-dashboard/reviews')
  },

  goToProviderSettings() {
    return router.push('/app/provider-dashboard/settings')
  }
}

export default router