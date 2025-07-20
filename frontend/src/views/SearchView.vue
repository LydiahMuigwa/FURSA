<!-- SearchView.vue - Desktop-first talent search and discovery -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Search Header -->
    <section class="bg-white shadow-sm border-b border-gray-100 sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Main Search Bar -->
        <div class="mb-6">
          <div class="relative max-w-2xl">
            <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="searchQuery"
              type="text"
              class="w-full pl-12 pr-4 py-3 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="Search for skills, names, or locations..."
              @input="handleSearch"
              @keydown.enter="performSearch"
            >
            <button 
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Filters Row -->
        <div class="flex flex-wrap items-center gap-4 mb-4">
          <!-- Category Filters -->
          <div class="flex flex-wrap gap-2">
            <span class="text-sm font-medium text-gray-700 mr-2">Categories:</span>
            <button
              v-for="category in categories"
              :key="category"
              @click="toggleCategory(category)"
              :class="[
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                selectedCategories.includes(category)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <!-- Location Filters -->
          <div class="flex flex-wrap gap-2">
            <span class="text-sm font-medium text-gray-700 mr-2">Locations:</span>
            <button
              v-for="location in locations"
              :key="location"
              @click="toggleLocation(location)"
              :class="[
                'px-3 py-1.5 rounded-full text-sm transition-colors',
                selectedLocations.includes(location)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ location }}
            </button>
          </div>
        </div>

        <!-- Active Filters & Controls -->
        <div class="flex justify-between items-center mt-4">
          <!-- Active Filters -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="category in selectedCategories"
              :key="`cat-${category}`"
              class="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-sm rounded-full"
            >
              {{ category }}
              <button @click="removeCategory(category)" class="hover:bg-blue-700 rounded-full p-0.5">
                <X class="w-3 h-3" />
              </button>
            </span>
            <span
              v-for="location in selectedLocations"
              :key="`loc-${location}`"
              class="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white text-sm rounded-full"
            >
              {{ location }}
              <button @click="removeLocation(location)" class="hover:bg-emerald-700 rounded-full p-0.5">
                <X class="w-3 h-3" />
              </button>
            </span>
            <button
              v-if="hasActiveFilters"
              @click="clearAllFilters"
              class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-gray-300 transition-colors"
            >
              Clear All Filters
            </button>
          </div>

          <!-- View Controls -->
          <div class="flex items-center gap-3">
            <div class="relative">
              <button
                @click="toggleSortMenu"
                class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <ArrowUpDown class="w-4 h-4" />
                Sort: {{ sortOptions.find(opt => opt.value === sortBy)?.label }}
              </button>
              <!-- Sort Dropdown -->
              <div v-if="showSortMenu" class="sort-menu absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="setSortBy(option.value)"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm',
                    sortBy === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
            
            <div class="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                @click="setViewMode('grid')"
                :class="[
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                <Grid3X3 class="w-4 h-4" />
              </button>
              <button
                @click="setViewMode('list')"
                :class="[
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                <List class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Results Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            {{ loading ? 'Searching...' : `${totalResults} talents found` }}
          </h1>
          <p v-if="searchQuery" class="text-gray-600">
            Results for "<span class="font-medium">{{ searchQuery }}</span>"
          </p>
          <p v-else class="text-gray-600">
            Discover amazing African talent
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'">
          <div v-for="i in 12" :key="i" class="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
            <div class="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div class="h-4 bg-gray-200 rounded mb-3"></div>
            <div class="h-3 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="filteredTalents.length === 0" class="text-center py-16">
          <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <SearchX class="w-12 h-12 text-gray-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">No talents found</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            We couldn't find any talents matching your criteria. Try adjusting your search or filters.
          </p>
          <div class="flex justify-center gap-3">
            <button
              @click="clearAllFilters"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear All Filters
            </button>
            <button
              @click="goToUpload"
              class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Your Talent
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="talent in filteredTalents"
            :key="talent.id"
            @click="viewProfile(talent.id)"
            class="talent-card group cursor-pointer"
          >
            <!-- Profile Section -->
            <div class="relative mb-4">
              <div class="w-20 h-20 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                   :class="getProfileGradient(talent.id)">
                <User class="w-8 h-8 text-white" />
              </div>
              <div v-if="talent.verified" class="absolute top-0 right-1/4 bg-emerald-500 text-white rounded-full p-1.5">
                <Check class="w-3 h-3" />
              </div>
              <div v-if="talent.featured" class="absolute top-0 left-1/4 bg-orange-500 text-white rounded-full p-1.5">
                <Crown class="w-3 h-3" />
              </div>
            </div>
            
            <!-- Talent Info -->
            <div class="text-center">
              <h3 class="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {{ talent.name }}
              </h3>
              <p class="text-gray-600 mb-2">{{ talent.skill }}</p>
              <p class="text-sm text-gray-500 mb-3 flex items-center justify-center">
                <MapPin class="w-3 h-3 mr-1" />
                {{ talent.location }}
              </p>
              
              <!-- Rating -->
              <div class="flex justify-center items-center mb-4">
                <div class="flex items-center">
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <span class="text-sm ml-1 font-medium">{{ talent.rating }}</span>
                  <span class="text-sm text-gray-500 ml-1">({{ talent.reviewCount }})</span>
                </div>
              </div>
              
              <!-- Tags -->
              <div v-if="talent.tags" class="flex flex-wrap justify-center gap-1 mb-4">
                <span 
                  v-for="tag in talent.tags.slice(0, 3)" 
                  :key="tag"
                  class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
              
              <!-- CTA Button -->
              <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium group-hover:shadow-md">
                View Profile
              </button>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="space-y-4">
          <div
            v-for="talent in filteredTalents"
            :key="talent.id"
            @click="viewProfile(talent.id)"
            class="bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 group"
          >
            <div class="flex items-center">
              <!-- Profile Image -->
              <div class="relative mr-6">
                <div class="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                     :class="getProfileGradient(talent.id)">
                  <User class="w-7 h-7 text-white" />
                </div>
                <div v-if="talent.verified" class="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1">
                  <Check class="w-3 h-3" />
                </div>
                <div v-if="talent.featured" class="absolute -top-1 -left-1 bg-orange-500 text-white rounded-full p-1">
                  <Crown class="w-3 h-3" />
                </div>
              </div>
              
              <!-- Talent Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="font-semibold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {{ talent.name }}
                    </h3>
                    <p class="text-gray-600 mb-2 text-lg">{{ talent.skill }}</p>
                    <p class="text-sm text-gray-500 mb-3 flex items-center">
                      <MapPin class="w-4 h-4 mr-1" />
                      {{ talent.location }}
                    </p>
                    
                    <!-- Tags -->
                    <div v-if="talent.tags" class="flex flex-wrap gap-2">
                      <span 
                        v-for="tag in talent.tags.slice(0, 4)" 
                        :key="tag"
                        class="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Rating & Action -->
                  <div class="text-right ml-4">
                    <div class="flex items-center mb-3">
                      <Star class="w-4 h-4 text-yellow-400 fill-current" />
                      <span class="text-sm ml-1 font-medium">{{ talent.rating }}</span>
                      <span class="text-sm text-gray-500 ml-1">({{ talent.reviewCount }})</span>
                    </div>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
              
              <ChevronRight class="w-5 h-5 text-gray-400 ml-4 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        </div>

        <!-- Load More Section -->
        <div v-if="filteredTalents.length > 0 && hasMore" class="text-center mt-12">
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {{ loadingMore ? 'Loading...' : 'Load More Talent' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Search, ArrowUpDown, Grid3X3, List, X, Star, User, Check,
  Crown, ChevronRight, SearchX, MapPin
} from 'lucide-vue-next'
import { useTalentStore } from '@/stores/talent'

const route = useRoute()
const router = useRouter()
const talentStore = useTalentStore()

// Reactive data
const searchQuery = ref('')
const selectedCategories = ref([])
const selectedLocations = ref([])
const sortBy = ref('rating')
const viewMode = ref('grid')
const showSortMenu = ref(false)
const loading = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(true)

// Sample data - replace with actual API calls
const allTalents = ref([
  {
    id: 1,
    name: 'Lydian Kamau',
    skill: 'Beadwork Artist',
    location: 'Nairobi, Kenya',
    category: 'Artisans',
    rating: 4.8,
    reviewCount: 17,
    verified: true,
    featured: true,
    tags: ['Jewelry', 'Traditional', 'Custom']
  },
  {
    id: 2,
    name: 'John Ochieng',
    skill: 'Wood Carver',
    location: 'Kisumu, Kenya',
    category: 'Artisans',
    rating: 4.5,
    reviewCount: 12,
    verified: true,
    featured: false,
    tags: ['Sculpture', 'Furniture', 'Art']
  },
  {
    id: 3,
    name: 'Sarah Nyong',
    skill: 'Fashion Designer',
    location: 'Lagos, Nigeria',
    category: 'Creatives',
    rating: 4.6,
    reviewCount: 23,
    verified: true,
    featured: false,
    tags: ['Ankara', 'Modern', 'Sustainable']
  },
  {
    id: 4,
    name: 'Moses Kiptoo',
    skill: 'Carpenter',
    location: 'Eldoret, Kenya',
    category: 'Skilled Trades',
    rating: 4.7,
    reviewCount: 8,
    verified: false,
    featured: false,
    tags: ['Furniture', 'Renovation', 'Custom']
  },
  {
    id: 5,
    name: 'Grace Wanjiku',
    skill: 'Photographer',
    location: 'Nairobi, Kenya',
    category: 'Creatives',
    rating: 4.9,
    reviewCount: 31,
    verified: true,
    featured: true,
    tags: ['Portrait', 'Wedding', 'Commercial']
  },
  {
    id: 6,
    name: 'Peter Ssebunya',
    skill: 'Web Developer',
    location: 'Kampala, Uganda',
    category: 'Students',
    rating: 4.4,
    reviewCount: 6,
    verified: false,
    featured: false,
    tags: ['React', 'Vue', 'Node.js']
  },
  {
    id: 7,
    name: 'Amina Hassan',
    skill: 'Textile Artist',
    location: 'Dar es Salaam, Tanzania',
    category: 'Artisans',
    rating: 4.7,
    reviewCount: 14,
    verified: true,
    featured: true,
    tags: ['Weaving', 'Traditional', 'Patterns']
  },
  {
    id: 8,
    name: 'David Mugisha',
    skill: 'Metalworker',
    location: 'Kigali, Rwanda',
    category: 'Skilled Trades',
    rating: 4.6,
    reviewCount: 9,
    verified: true,
    featured: false,
    tags: ['Sculpture', 'Jewelry', 'Tools']
  },
  {
    id: 9,
    name: 'Fatima Diallo',
    skill: 'Graphic Designer',
    location: 'Accra, Ghana',
    category: 'Creatives',
    rating: 4.5,
    reviewCount: 18,
    verified: true,
    featured: false,
    tags: ['Branding', 'Digital', 'Print']
  },
  {
    id: 10,
    name: 'Emmanuel Okoye',
    skill: 'Leather Craftsman',
    location: 'Abuja, Nigeria',
    category: 'Artisans',
    rating: 4.8,
    reviewCount: 25,
    verified: true,
    featured: true,
    tags: ['Bags', 'Shoes', 'Custom']
  }
])

const categories = ref(['All', 'Artisans', 'Creatives', 'Skilled Trades', 'Students'])
const locations = ref(['All', 'Kenya', 'Nigeria', 'Uganda', 'Ghana', 'Rwanda', 'Tanzania'])

const sortOptions = ref([
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Reviews', value: 'reviews' },
  { label: 'Recently Joined', value: 'recent' },
  { label: 'Verified First', value: 'verified' },
  { label: 'Alphabetical', value: 'name' }
])

// Computed properties
const hasActiveFilters = computed(() => {
  return selectedCategories.value.length > 0 ||
    selectedLocations.value.length > 0 ||
    searchQuery.value.trim().length > 0
})

const filteredTalents = computed(() => {
  let filtered = [...allTalents.value]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(talent =>
      talent.name.toLowerCase().includes(query) ||
      talent.skill.toLowerCase().includes(query) ||
      talent.location.toLowerCase().includes(query) ||
      (talent.tags && talent.tags.some(tag => tag.toLowerCase().includes(query)))
    )
  }

  // Category filter
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(talent =>
      selectedCategories.value.includes(talent.category)
    )
  }

  // Location filter
  if (selectedLocations.value.length > 0) {
    filtered = filtered.filter(talent =>
      selectedLocations.value.some(loc => talent.location.includes(loc))
    )
  }

  // Sort
  switch (sortBy.value) {
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'reviews':
      filtered.sort((a, b) => b.reviewCount - a.reviewCount)
      break
    case 'verified':
      filtered.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0))
      break
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'recent':
      filtered.reverse()
      break
  }

  // Featured talents first if sorting by rating
  if (sortBy.value === 'rating') {
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.rating - a.rating
    })
  }

  return filtered
})

const totalResults = computed(() => filteredTalents.value.length)

const getProfileGradient = (id) => {
  const gradients = [
    'bg-gradient-to-br from-orange-400 to-orange-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600', 
    'bg-gradient-to-br from-emerald-400 to-emerald-600',
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
    'bg-gradient-to-br from-teal-400 to-teal-600'
  ]
  return gradients[(id - 1) % gradients.length]
}

// Methods
const handleSearch = () => {
  performSearch()
}

const performSearch = () => {
  console.log('Searching for:', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
}

const toggleCategory = (category) => {
  if (category === 'All') {
    selectedCategories.value = []
  } else {
    const index = selectedCategories.value.indexOf(category)
    if (index > -1) {
      selectedCategories.value.splice(index, 1)
    } else {
      selectedCategories.value.push(category)
    }
  }
  showSortMenu.value = false
}

const toggleLocation = (location) => {
  if (location === 'All') {
    selectedLocations.value = []
  } else {
    const index = selectedLocations.value.indexOf(location)
    if (index > -1) {
      selectedLocations.value.splice(index, 1)
    } else {
      selectedLocations.value.push(location)
    }
  }
  showSortMenu.value = false
}

const removeCategory = (category) => {
  const index = selectedCategories.value.indexOf(category)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  }
}

const removeLocation = (location) => {
  const index = selectedLocations.value.indexOf(location)
  if (index > -1) {
    selectedLocations.value.splice(index, 1)
  }
}

const clearAllFilters = () => {
  selectedCategories.value = []
  selectedLocations.value = []
  searchQuery.value = ''
  showSortMenu.value = false
}

const toggleSortMenu = () => {
  showSortMenu.value = !showSortMenu.value
}

const setSortBy = (value) => {
  sortBy.value = value
  showSortMenu.value = false
}

const setViewMode = (mode) => {
  viewMode.value = mode
}

const viewProfile = (id) => {
  router.push(`/app/talent/${id}`)
}

const goToUpload = () => {
  router.push('/app/upload')
}

const loadMore = async () => {
  loadingMore.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    page.value++
    if (page.value >= 3) {
      hasMore.value = false
    }
  } catch (error) {
    console.error('Error loading more talents:', error)
  } finally {
    loadingMore.value = false
  }
}

// Watch route params for initial filters
watch(() => route.query, (newQuery) => {
  if (newQuery.category && newQuery.category !== 'All') {
    selectedCategories.value = [newQuery.category]
  }
  if (newQuery.q) {
    searchQuery.value = newQuery.q
  }
}, { immediate: true })

// Click outside to close sort menu
const handleClickOutside = (event) => {
  if (!event.target.closest('.sort-menu')) {
    showSortMenu.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await talentStore.fetchTalents()
    document.addEventListener('click', handleClickOutside)
  } catch (error) {
    console.error('Error loading talents:', error)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Talent Card Styles */
.talent-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.talent-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-0.5rem);
  border-color: #e5e7eb;
}
</style>