<!-- My Stories Management Component -->
<!-- File: frontend/src/components/service-provider/MyStories.vue -->
<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Page Header -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">📖 My Professional Stories</h1>
          <p class="text-blue-100">Showcase your work to attract more customers</p>
        </div>
        <div class="text-right">
          <div class="text-sm text-blue-200">Published Stories</div>
          <div class="text-3xl font-bold">{{ stories.length }}</div>
          <button @click="goToStoryBuilder" 
                  class="mt-3 bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all">
            ✍️ Tell New Story
          </button>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccessMessage" 
         class="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center justify-between">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
          ✅
        </div>
        <div>
          <h3 class="font-semibold text-green-800">Story Published Successfully!</h3>
          <p class="text-green-700 text-sm">Your work story is now visible to potential customers in search results.</p>
        </div>
      </div>
      <button @click="showSuccessMessage = false" class="text-green-600 hover:text-green-700">
        ✕
      </button>
    </div>

    <!-- No Stories State -->
    <div v-if="stories.length === 0 && !loading" 
         class="text-center py-16 bg-white rounded-2xl shadow-sm border">
      <div class="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
        <BookOpen class="w-12 h-12 text-blue-500" />
      </div>
      <h3 class="text-xl font-semibold text-gray-800 mb-3">No stories yet</h3>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        Start building your professional portfolio by sharing work stories that demonstrate your expertise and quality.
      </p>
      <button @click="goToStoryBuilder" 
              class="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all">
        📝 Tell Your First Story
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 3" :key="n" class="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
        <div class="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div class="h-4 bg-gray-200 rounded mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Stories Grid -->
    <div v-if="stories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="story in stories" :key="story.id" 
           class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border overflow-hidden">
        
        <!-- Story Image -->
        <div class="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          <img v-if="getStoryImage(story)" 
               :src="getStoryImage(story)" 
               :alt="story.title"
               class="w-full h-full object-cover">
          <div v-else class="w-full h-full flex items-center justify-center">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Briefcase class="w-8 h-8 text-blue-600" />
              </div>
              <p class="text-gray-500 text-sm">Professional Work</p>
            </div>
          </div>
          
          <!-- Story Status Badge -->
          <div class="absolute top-3 left-3">
            <span class="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ✓ Published
            </span>
          </div>

          <!-- Story Actions Overlay -->
          <div class="absolute top-3 right-3 flex gap-2">
            <button @click="editStory(story)" 
                    class="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md">
              <Edit3 class="w-4 h-4 text-gray-700" />
            </button>
            <button @click="deleteStory(story)" 
                    class="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-red-50 transition-all shadow-md">
              <Trash2 class="w-4 h-4 text-red-500" />
            </button>
          </div>

          <!-- Voice Note Indicator -->
          <div v-if="story.voiceIntro" class="absolute bottom-3 left-3">
            <div class="bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Volume2 class="w-3 h-3" />
              Voice
            </div>
          </div>
        </div>

        <!-- Story Content -->
        <div class="p-6">
          <h3 class="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
            {{ story.title || 'Professional Project' }}
          </h3>
          
          <p class="text-gray-600 text-sm mb-4 line-clamp-3">
            {{ story.description || 'Professional service completed successfully' }}
          </p>

          <!-- Story Skills/Tags -->
          <div v-if="story.skills && story.skills.length > 0" class="flex flex-wrap gap-2 mb-4">
            <span v-for="skill in story.skills.slice(0, 3)" :key="skill" 
                  class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              {{ skill }}
            </span>
            <span v-if="story.skills.length > 3" 
                  class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              +{{ story.skills.length - 3 }} more
            </span>
          </div>

          <!-- Story Metadata -->
          <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>{{ formatDate(story.createdAt) }}</span>
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1">
                <Eye class="w-3 h-3" />
                {{ story.views || 0 }} views
              </span>
              <span v-if="story.projectType" class="bg-gray-100 px-2 py-1 rounded text-xs">
                {{ formatProjectType(story.projectType) }}
              </span>
            </div>
          </div>

          <!-- Story Actions -->
          <div class="flex gap-2">
            <button @click="previewStory(story)" 
                    class="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-200 transition-all">
              👁️ Preview
            </button>
            <button @click="editStory(story)" 
                    class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all">
              ✏️ Edit
            </button>
            <button @click="shareStory(story)" 
                    class="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-200 transition-all">
              📤
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" 
         class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Delete Story?</h3>
          <p class="text-gray-600 mb-6">
            This will permanently remove "{{ storyToDelete?.title }}" from your portfolio. 
            Customers will no longer be able to see this work example.
          </p>
          <div class="flex gap-3">
            <button @click="showDeleteModal = false" 
                    class="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all">
              Cancel
            </button>
            <button @click="confirmDelete" 
                    class="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-600 transition-all">
              Delete Story
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Portfolio Tips -->
    <div class="mt-12 bg-blue-50 rounded-2xl p-6">
      <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Lightbulb class="w-5 h-5 text-blue-600" />
        Tips for Better Portfolio Impact
      </h3>
      <div class="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-800 font-bold text-xs">1</span>
          </div>
          <div>
            <strong>Add Before & After Photos:</strong> Show the transformation your work creates to build customer confidence.
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-800 font-bold text-xs">2</span>
          </div>
          <div>
            <strong>Update Regularly:</strong> Add new stories monthly to show you're active and growing your skills.
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-800 font-bold text-xs">3</span>
          </div>
          <div>
            <strong>Include Voice Notes:</strong> Let customers hear your passion and expertise in your own voice.
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-blue-800 font-bold text-xs">4</span>
          </div>
          <div>
            <strong>Tag Your Skills:</strong> Help customers find you by highlighting the specific techniques you used.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  BookOpen, Edit3, Trash2, Briefcase, Lightbulb, Volume2, 
  Eye, AlertTriangle, Share2
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// Component state
const loading = ref(true)
const stories = ref([])
const showDeleteModal = ref(false)
const storyToDelete = ref(null)
const showSuccessMessage = ref(false)

// Check if we're coming from successful story publish
onMounted(() => {
  loadStories()
  
  // Show success message if redirected from story publish
  if (route.query.published === 'true') {
    showSuccessMessage.value = true
    
    // Clean up URL
    const newQuery = { ...route.query }
    delete newQuery.published
    router.replace({ query: newQuery })
    
    // Auto-hide success message after 8 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 8000)
  }
})

// Methods
const loadStories = async () => {
  try {
    loading.value = true
    
    // Get provider ID from localStorage or auth
    const providerId = localStorage.getItem('providerId')
    if (!providerId) {
      console.warn('No provider ID found')
      return
    }
    
    const response = await fetch(`/api/service-providers/${providerId}`)
    const result = await response.json()
    
    if (result.success && result.provider.stories) {
      stories.value = result.provider.stories || []
    } else {
      stories.value = []
    }
  } catch (error) {
    console.error('Failed to load stories:', error)
    stories.value = []
  } finally {
    loading.value = false
  }
}

const goToStoryBuilder = () => {
  router.push('/app/provider-dashboard/story-builder')
}

const editStory = (story) => {
  // Save story data for editing and navigate to story builder
  localStorage.setItem('editingStory', JSON.stringify(story))
  router.push(`/app/provider-dashboard/story-builder?edit=${story.id}`)
}

const previewStory = (story) => {
  // Create a preview modal or new route
  const previewData = {
    title: story.title,
    description: story.description,
    skills: story.skills,
    images: getStoryImages(story),
    hasVoice: !!story.voiceIntro,
    projectType: story.projectType
  }
  
  alert(`Story Preview:\n\nTitle: ${previewData.title}\nDescription: ${previewData.description}\nSkills: ${previewData.skills?.join(', ')}\n\nThis is how customers see your work!`)
}

const shareStory = (story) => {
  // Copy story link to clipboard
  const storyUrl = `${window.location.origin}/provider-story/${story.id}`
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(storyUrl)
    alert('Story link copied to clipboard! You can share this with potential customers.')
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = storyUrl
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert('Story link copied to clipboard!')
  }
}

const deleteStory = (story) => {
  storyToDelete.value = story
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    const providerId = localStorage.getItem('providerId')
    
    // Call API to delete story
    const response = await fetch(`/api/service-providers/${providerId}/stories/${storyToDelete.value.id}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      // Remove from local array
      stories.value = stories.value.filter(s => s.id !== storyToDelete.value.id)
      
      // Show success message briefly
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    } else {
      alert('Failed to delete story. Please try again.')
    }
  } catch (error) {
    console.error('Delete failed:', error)
    alert('Failed to delete story. Please check your connection and try again.')
  } finally {
    showDeleteModal.value = false
    storyToDelete.value = null
  }
}

// Helper functions
const getStoryImage = (story) => {
  return story.projectPhotos?.[0] || 
         story.afterPhotos?.[0] || 
         story.beforePhotos?.[0] || 
         null
}

const getStoryImages = (story) => {
  return [
    ...(story.beforePhotos || []),
    ...(story.processPhotos || []),
    ...(story.afterPhotos || []),
    ...(story.projectPhotos || [])
  ].filter(Boolean)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Recently'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Recently'
  }
}

const formatProjectType = (type) => {
  const typeMap = {
    'emergency': 'Emergency Repair',
    'installation': 'Installation',
    'upgrade': 'Upgrade',
    'maintenance': 'Maintenance',
    'consultation': 'Consultation',
    'custom': 'Custom Project'
  }
  return typeMap[type] || 'Professional Service'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}
</style>