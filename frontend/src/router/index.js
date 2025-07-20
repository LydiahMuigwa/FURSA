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
        
        // Search/Browse Page
        {
          path: 'search',
          name: 'search',
          component: () => import('../views/SearchView.vue'),
          meta: {
            title: 'Browse Talent - FURSA'
          }
        },
        
        // Upload/Join Flow
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
        }
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
    
    // Redirect old routes for compatibility
    {
      path: '/home',
      redirect: '/app'
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
  // Update page title
  document.title = to.meta.title || 'FURSA - African Talent Platform'
  
  // Add any auth checks here later
  // if (to.meta.requiresAuth && !isAuthenticated()) {
  //   next('/login')
  // } else {
  //   next()
  // }
  
  next()
})

export default router