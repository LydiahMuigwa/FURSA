<!-- ServiceProviderSearch.vue - Complete version with real geolocation -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Search Header -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Page Title -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ pageTitle }}
          </h1>
          <p class="text-gray-600 mt-2">
            {{ pageDescription }}
          </p>
        </div>

        <!-- Search Bar -->
        <div class="flex flex-col lg:flex-row gap-4 mb-6">
          <!-- Service Type Search -->
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search for services (electrician, plumber, carpenter...)"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="handleSearch"
              />
            </div>
          </div>

          <!-- Location Input with LocationPicker -->
          <div class="lg:w-80">
            <LocationPicker
              v-model="userLocation"
              placeholder="Enter your location"
              :auto-detect="false"
              @location-selected="handleLocationSelected"
              @location-error="handleLocationError"
            />
          </div>

          <!-- Search Button -->
          <button
            @click="performSearch"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <Search class="w-4 h-4 mr-2" />
            Search
          </button>
        </div>

        <!-- Quick Service Categories -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button
            v-for="service in quickServices"
            :key="service.name"
            @click="selectService(service.name.toLowerCase())"
            :class="[
              'flex flex-col items-center p-4 rounded-lg border-2 transition-all',
              selectedCategory === service.name.toLowerCase()
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            ]"
          >
            <div class="text-2xl mb-2">{{ service.icon }}</div>
            <span class="text-sm font-medium">{{ service.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Filters & Results -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Filters Sidebar -->
        <div class="lg:w-80">
          <div class="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            
            <!-- Distance Filter -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Distance: {{ filters.distance }}km
              </label>
              <input
                v-model="filters.distance"
                type="range"
                min="1"
                max="50"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                @input="applyFilters"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>1km</span>
                <span>50km</span>
              </div>
            </div>

            <!-- Rating Filter -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select 
                v-model="filters.minRating" 
                class="w-full p-2 border border-gray-300 rounded-lg"
                @change="applyFilters"
              >
                <option value="0">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <!-- Availability Filter -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    v-model="filters.availableToday" 
                    type="checkbox" 
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    @change="applyFilters"
                  />
                  <span class="ml-2 text-sm text-gray-700">Available today</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="filters.verified" 
                    type="checkbox" 
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    @change="applyFilters"
                  />
                  <span class="ml-2 text-sm text-gray-700">Verified providers only</span>
                </label>
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select 
                v-model="filters.priceRange" 
                class="w-full p-2 border border-gray-300 rounded-lg"
                @change="applyFilters"
              >
                <option value="">Any Price</option>
                <option value="budget">Budget (Under KES 5,000)</option>
                <option value="mid">Mid-range (KES 5,000 - 20,000)</option>
                <option value="premium">Premium (KES 20,000+)</option>
              </select>
            </div>

            <!-- Clear Filters -->
            <button
              @click="clearFilters"
              class="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        <!-- Results Area -->
        <div class="flex-1">
          <!-- Results Header -->
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">
                {{ filteredProviders.length }} service providers found
              </h2>
              <p v-if="userLocationText" class="text-sm text-gray-600">
                Near {{ userLocationText }}
              </p>
            </div>

            <!-- Sort Options -->
            <select 
              v-model="sortBy" 
              class="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              @change="applySorting"
            >
              <option value="distance">Nearest First</option>
              <option value="rating">Highest Rated</option>
              <option value="price">Lowest Price</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Finding service providers...</span>
          </div>

          <!-- No Results -->
          <div v-else-if="filteredProviders.length === 0 && !loading" class="text-center py-12">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No service providers found</h3>
            <p class="text-gray-600 mb-4">Try adjusting your search criteria or expanding your search radius.</p>
            <button
              @click="clearFilters"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>

          <!-- Results Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ServiceProviderCard
              v-for="provider in filteredProviders"
              :key="provider.id"
              :provider="provider"
              @call="handleCall"
              @whatsapp="handleWhatsapp"
              @quote="handleQuoteRequest"
            />
          </div>

          <!-- Load More Button -->
          <div v-if="hasMoreResults" class="text-center mt-8">
            <button
              @click="loadMoreResults"
              :disabled="loadingMore"
              class="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <span v-if="loadingMore">Loading...</span>
              <span v-else>Load More Providers</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Quote Request Modal -->
    <div v-if="showQuoteModal" @click="showQuoteModal = false"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div @click.stop class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Quick Quote Request</h3>
          <button @click="showQuoteModal = false">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="text-center py-4">
          <p class="text-gray-600">Quote request functionality will be implemented soon!</p>
          <button
            @click="showQuoteModal = false"
            class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, X } from 'lucide-vue-next'
import ServiceProviderCard from '@/components/service-provider/cards/ServiceProviderCard.vue'
import LocationPicker from '@/components/service-provider/forms/LocationPicker.vue'

const route = useRoute()
const router = useRouter()

// Reactive data
const searchQuery = ref('')
const userLocation = ref(null)
const userLocationText = ref('')
const selectedCategory = ref('')
const loading = ref(false)
const loadingMore = ref(false)
const hasMoreResults = ref(true)
const showQuoteModal = ref(false)

// Filters
const filters = ref({
  distance: 15,
  minRating: 0,
  availableToday: false,
  verified: false,
  priceRange: ''
})

const sortBy = ref('distance')

// Quick service categories
const quickServices = ref([
  { name: 'Electrician', icon: '⚡' },
  { name: 'Plumber', icon: '🔧' },
  { name: 'Carpenter', icon: '🪚' },
  { name: 'Cleaner', icon: '🧹' },
  { name: 'Painter', icon: '🎨' },
  { name: 'Mechanic', icon: '🔩' }
])

// Sample service providers data with real coordinates (replace with API call)
const allProviders = ref([
  {
    id: 1,
    name: 'John Mwangi',
    serviceType: 'Licensed Electrician',
    location: 'Westlands, Nairobi',
    latitude: -1.2634,
    longitude: 36.8078,
    profileImage: null,
    verified: true,
    backgroundCheck: true,
    licensed: true,
    isOnline: true,
    rating: 4.8,
    reviewCount: 47,
    responseTime: '2 hours',
    startingPrice: 'KES 2,000',
    availability: { status: 'available', message: 'Available today' },
    topServices: ['Home Wiring', 'Solar Installation', 'Emergency Repairs'],
    contact: { phone: '+254712345678', whatsapp: '+254712345678' }
  },
  {
    id: 2,
    name: 'Sarah Wanjiku',
    serviceType: 'Professional Plumber',
    location: 'Karen, Nairobi',
    latitude: -1.3197,
    longitude: 36.7025,
    profileImage: null,
    verified: true,
    backgroundCheck: true,
    licensed: true,
    isOnline: false,
    rating: 4.6,
    reviewCount: 32,
    responseTime: '1 hour',
    startingPrice: 'KES 1,500',
    availability: { status: 'busy', message: 'Available tomorrow' },
    topServices: ['Pipe Repairs', 'Bathroom Installation', 'Drain Cleaning'],
    contact: { phone: '+254723456789', whatsapp: '+254723456789' }
  },
  {
    id: 3,
    name: 'David Kipchoge',
    serviceType: 'Master Carpenter',
    location: 'Kilimani, Nairobi',
    latitude: -1.2921,
    longitude: 36.7833,
    profileImage: null,
    verified: true,
    backgroundCheck: false,
    licensed: true,
    isOnline: true,
    rating: 4.9,
    reviewCount: 28,
    responseTime: '30 minutes',
    startingPrice: 'KES 3,000',
    availability: { status: 'available', message: 'Available now' },
    topServices: ['Custom Furniture', 'Kitchen Cabinets', 'Door Installation'],
    contact: { phone: '+254734567890', whatsapp: '+254734567890' }
  },
  {
    id: 4,
    name: 'Grace Muthoni',
    serviceType: 'Professional Cleaner',
    location: 'CBD, Nairobi',
    latitude: -1.2864,
    longitude: 36.8172,
    profileImage: null,
    verified: true,
    backgroundCheck: true,
    licensed: false,
    isOnline: true,
    rating: 4.7,
    reviewCount: 65,
    responseTime: '1 hour',
    startingPrice: 'KES 1,000',
    availability: { status: 'available', message: 'Available today' },
    topServices: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning'],
    contact: { phone: '+254745678901', whatsapp: '+254745678901' }
  },
  {
    id: 5,
    name: 'Peter Kimani',
    serviceType: 'House Painter',
    location: 'Eastleigh, Nairobi',
    latitude: -1.2921,
    longitude: 36.8577,
    profileImage: null,
    verified: false,
    backgroundCheck: true,
    licensed: true,
    isOnline: false,
    rating: 4.3,
    reviewCount: 19,
    responseTime: '3 hours',
    startingPrice: 'KES 2,500',
    availability: { status: 'available', message: 'Available this week' },
    topServices: ['Interior Painting', 'Exterior Painting', 'Wall Preparation'],
    contact: { phone: '+254756789012', whatsapp: '+254756789012' }
  }
])

// Computed properties
const pageTitle = computed(() => {
  if (route.params.category) {
    const category = route.params.category.charAt(0).toUpperCase() + route.params.category.slice(1)
    return `Find ${category} Services`
  }
  return 'Find Services Near You'
})

const pageDescription = computed(() => {
  if (route.params.category) {
    return `Professional ${route.params.category} services in your area`
  }
  return 'Connect with verified service providers in your area'
})

// Calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180)
}

const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`
  } else {
    return `${Math.round(distance)}km`
  }
}

const filteredProviders = computed(() => {
  let providers = [...allProviders.value]

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    providers = providers.filter(p => 
      p.serviceType.toLowerCase().includes(query) ||
      p.topServices.some(service => service.toLowerCase().includes(query))
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    providers = providers.filter(p => 
      p.serviceType.toLowerCase().includes(selectedCategory.value)
    )
  }

  // Filter by route category
  if (route.params.category) {
    providers = providers.filter(p => 
      p.serviceType.toLowerCase().includes(route.params.category.toLowerCase())
    )
  }

  // Apply filters
  if (filters.value.minRating > 0) {
    providers = providers.filter(p => p.rating >= filters.value.minRating)
  }

  if (filters.value.availableToday) {
    providers = providers.filter(p => p.availability.status === 'available')
  }

  if (filters.value.verified) {
    providers = providers.filter(p => p.verified)
  }

  // Calculate distances and filter by distance if user location is available
  if (userLocation.value && userLocation.value.latitude && userLocation.value.longitude) {
    providers = providers.map(provider => {
      if (provider.latitude && provider.longitude) {
        const distance = calculateDistance(
          userLocation.value.latitude,
          userLocation.value.longitude,
          provider.latitude,
          provider.longitude
        )
        
        return {
          ...provider,
          distance: distance,
          distanceText: formatDistance(distance),
          withinRange: distance <= filters.value.distance
        }
      }
      
      return {
        ...provider,
        distance: null,
        distanceText: 'Distance unknown',
        withinRange: true
      }
    }).filter(provider => provider.withinRange)
  }

  // Sort providers
  providers.sort((a, b) => {
    switch (sortBy.value) {
      case 'rating':
        return b.rating - a.rating
      case 'price':
        return parseInt(a.startingPrice.replace(/[^\d]/g, '')) - parseInt(b.startingPrice.replace(/[^\d]/g, ''))
      case 'reviews':
        return b.reviewCount - a.reviewCount
      case 'distance':
      default:
        // If we have distance data, sort by it; otherwise maintain original order
        if (a.distance !== undefined && b.distance !== undefined && a.distance !== null && b.distance !== null) {
          return a.distance - b.distance
        }
        return 0
    }
  })

  return providers
})

// Methods
const handleSearch = () => {
  // Debounced search
  clearTimeout(handleSearch.timeout)
  handleSearch.timeout = setTimeout(() => {
    performSearch()
  }, 300)
}

const performSearch = () => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const handleLocationSelected = (location) => {
  if (location) {
    userLocation.value = location
    userLocationText.value = location.address || location.city || 'Current Location'
  } else {
    userLocation.value = null
    userLocationText.value = ''
  }
  performSearch()
}

const handleLocationError = (error) => {
  console.error('Location error:', error)
  // You could show a toast notification here
}

const selectService = (serviceName) => {
  selectedCategory.value = selectedCategory.value === serviceName ? '' : serviceName
  searchQuery.value = serviceName
  performSearch()
}

const applyFilters = () => {
  // Filters are applied automatically via computed property
}

const applySorting = () => {
  // Sorting is applied automatically via computed property
}

const clearFilters = () => {
  filters.value = {
    distance: 15,
    minRating: 0,
    availableToday: false,
    verified: false,
    priceRange: ''
  }
  searchQuery.value = ''
  selectedCategory.value = ''
}

const loadMoreResults = () => {
  loadingMore.value = true
  // Simulate loading more results
  setTimeout(() => {
    loadingMore.value = false
    hasMoreResults.value = false // No more results for demo
  }, 1000)
}

// Event handlers
const handleCall = (provider) => {
  console.log('Calling provider:', provider.name)
}

const handleWhatsapp = (provider) => {
  console.log('Opening WhatsApp for provider:', provider.name)
}

const handleQuoteRequest = (provider) => {
  console.log('Quote request for provider:', provider.name)
  showQuoteModal.value = true
}

// Watch route changes
watch(() => route.params.category, (newCategory) => {
  if (newCategory) {
    selectedCategory.value = newCategory.toLowerCase()
    searchQuery.value = newCategory
  }
}, { immediate: true })

// Initialize on mount
onMounted(() => {
  // Load initial data
  performSearch()
})
</script>

<style scoped>
/* Custom slider styles */
input[type="range"] {
  -webkit-appearance: none;
  background: transparent;
}

input[type="range"]::-webkit-slider-track {
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  background: #2563eb;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-track {
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
  border: none;
}

input[type="range"]::-moz-range-thumb {
  background: #2563eb;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>