<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Professional Header -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold mb-2">🏆 My Professional Portfolio</h1>
          <p class="text-indigo-100">Showcase your expertise to attract premium clients</p>
        </div>
        <div class="text-right">
          <div class="text-sm text-indigo-200">Portfolio Items</div>
          <div class="text-3xl font-bold">{{ portfolioItems.length }}</div>
        </div>
      </div>
    </div>

    <!-- Portfolio Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-xl p-4 shadow-sm text-center">
        <div class="text-2xl font-bold text-blue-600">{{ portfolioItems.length }}</div>
        <div class="text-sm text-gray-600">Projects Showcased</div>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm text-center">
        <div class="text-2xl font-bold text-green-600">{{ portfolioViewsCount }}</div>
        <div class="text-sm text-gray-600">Portfolio Views</div>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm text-center">
        <div class="text-2xl font-bold text-purple-600">{{ uniqueSkillsCount }}</div>
        <div class="text-sm text-gray-600">Skills Demonstrated</div>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm text-center">
        <div class="text-2xl font-bold text-orange-600">{{ avgProjectValue }}</div>
        <div class="text-sm text-gray-600">Avg Project Value</div>
      </div>
    </div>

    <!-- Portfolio Items Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Add New Portfolio Item -->
      <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
           @click="addNewPortfolioItem">
        <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Plus class="w-8 h-8 text-blue-600" />
        </div>
        <h3 class="font-semibold text-gray-800 mb-2">Add New Project</h3>
        <p class="text-gray-600 text-sm">Share another success story with potential clients</p>
      </div>

      <!-- Existing Portfolio Items -->
      <div v-for="item in portfolioItems" :key="item.id" 
           class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
        
        <!-- Portfolio Item Image -->
        <div class="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          <img v-if="item.images && item.images[0]" 
               :src="item.images[0]" 
               :alt="item.title"
               class="w-full h-full object-cover">
          <div v-else class="w-full h-full flex items-center justify-center">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Briefcase class="w-8 h-8 text-blue-600" />
              </div>
              <p class="text-gray-500 text-sm">Professional Project</p>
            </div>
          </div>
          
          <!-- Professional Status Badge -->
          <div class="absolute top-3 left-3">
            <span class="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ✓ Verified Work
            </span>
          </div>

          <!-- Portfolio Actions -->
          <div class="absolute top-3 right-3 flex gap-2">
            <button @click="editPortfolioItem(item)" 
                    class="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md">
              <Edit3 class="w-4 h-4 text-gray-700" />
            </button>
            <button @click="deletePortfolioItem(item)" 
                    class="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-red-50 transition-all shadow-md">
              <Trash2 class="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        <!-- Portfolio Item Details -->
        <div class="p-5">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="font-semibold text-gray-800 mb-1">{{ item.title }}</h3>
              <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {{ item.type || 'Professional Service' }}
              </span>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-green-600">{{ item.estimatedValue || 'KES 15,000' }}</div>
              <div class="text-xs text-gray-500">Project Value</div>
            </div>
          </div>
          
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ item.description }}</p>
          
          <!-- Skills Demonstrated -->
          <div v-if="item.skills && item.skills.length > 0" class="flex flex-wrap gap-2 mb-4">
            <span v-for="skill in item.skills.slice(0, 3)" :key="skill" 
                  class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              {{ skill }}
            </span>
            <span v-if="item.skills.length > 3" 
                  class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              +{{ item.skills.length - 3 }}
            </span>
          </div>

          <!-- Portfolio Actions -->
          <div class="flex gap-2">
            <button @click="previewPortfolioItem(item)" 
                    class="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all">
              👁️ Preview
            </button>
            <button @click="sharePortfolioItem(item)" 
                    class="flex-1 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-all">
              📤 Share
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Professional Tips -->
    <div class="mt-12 bg-blue-50 rounded-2xl p-6">
      <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Lightbulb class="w-5 h-5 text-blue-600" />
        Portfolio Tips for Maximum Impact
      </h3>
      <div class="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-800 font-bold text-xs">1</span>
          </div>
          <div>
            <strong>Show Before & After:</strong> Photos that demonstrate transformation build trust and showcase your impact.
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-800 font-bold text-xs">2</span>
          </div>
          <div>
            <strong>Highlight Skills:</strong> Tag the specific techniques and expertise you used in each project.
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-800 font-bold text-xs">3</span>
          </div>
          <div>
            <strong>Add Voice Notes:</strong> Let clients hear your passion and expertise in your own voice.
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-800 font-bold text-xs">4</span>
          </div>
          <div>
            <strong>Regular Updates:</strong> Add new projects monthly to show you're active and growing.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, Edit3, Trash2, Briefcase, Lightbulb, Share2, 
  Eye, TrendingUp, Award
} from 'lucide-vue-next'

const router = useRouter()

// Component state
const portfolioItems = ref([])
const portfolioStats = ref({})
const loading = ref(true)

// Computed properties
const uniqueSkillsCount = computed(() => {
  const allSkills = portfolioItems.value.flatMap(item => item.skills || [])
  return [...new Set(allSkills)].length
})

const portfolioViewsCount = computed(() => {
  return portfolioItems.value.reduce((total, item) => total + (item.views || 0), 0)
})

const avgProjectValue = computed(() => {
  if (!portfolioItems.value.length) return 'KES 0'
  const total = portfolioItems.value.reduce((sum, item) => sum + (item.estimatedValue || 15000), 0)
  const avg = total / portfolioItems.value.length
  return `KES ${avg.toLocaleString()}`
})

// Methods
const addNewPortfolioItem = () => {
  router.push('/app/provider-dashboard/story-builder')
}

const editPortfolioItem = (item) => {
  localStorage.setItem('editingPortfolioItem', JSON.stringify(item))
  router.push(`/app/provider-dashboard/story-builder?edit=${item.id}`)
}

const deletePortfolioItem = async (item) => {
  if (confirm(`Delete "${item.title}"? This cannot be undone.`)) {
    try {
      const providerId = localStorage.getItem('providerId')
      const response = await fetch(`/api/service-providers/${providerId}/portfolio/${item.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        portfolioItems.value = portfolioItems.value.filter(p => p.id !== item.id)
        alert('Portfolio item deleted successfully')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete item. Please try again.')
    }
  }
}

const previewPortfolioItem = (item) => {
  // Open preview modal or navigate to preview page
  alert(`Preview: ${item.title}\n\n${item.description}`)
}

const sharePortfolioItem = (item) => {
  // Share individual portfolio item
  const shareUrl = `${window.location.origin}/portfolio/${item.id}`
  navigator.clipboard.writeText(shareUrl)
  alert('Portfolio item link copied to clipboard!')
}

const loadPortfolio = async () => {
  try {
    loading.value = true
    const providerId = localStorage.getItem('providerId')
    
    const response = await fetch(`/api/service-providers/${providerId}/portfolio`)
    const data = await response.json()
    
    if (data.success) {
      portfolioItems.value = data.portfolio.items || []
      portfolioStats.value = data.portfolio.metrics || {}
    }
  } catch (error) {
    console.error('Failed to load portfolio:', error)
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  loadPortfolio()
})
</script>