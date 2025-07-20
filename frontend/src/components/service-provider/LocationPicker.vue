<!-- LocationPicker.vue - Simplified version for service-provider folder -->
<template>
  <div class="location-picker relative">
    <!-- Location Input Field -->
    <div class="relative">
      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
        <MapPin class="w-5 h-5 text-gray-400" />
      </div>
      
      <input
        ref="locationInput"
        v-model="locationQuery"
        type="text"
        :placeholder="placeholder"
        class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
        @input="handleInput"
        @focus="showSuggestions = true"
        @blur="handleBlur"
      />

      <!-- GPS Button -->
      <button
        @click="getCurrentLocation"
        :disabled="gettingLocation"
        :class="[
          'absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-colors',
          gettingLocation 
            ? 'text-blue-600 opacity-50 cursor-not-allowed'
            : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
        ]"
        :title="gettingLocation ? 'Getting location...' : 'Use my current location'"
      >
        <Navigation v-if="!gettingLocation" class="w-4 h-4" />
        <div v-else class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-2 text-sm text-red-600 flex items-center">
      <AlertCircle class="w-4 h-4 mr-1" />
      {{ error }}
    </div>

    <!-- Popular Cities Dropdown -->
    <div v-if="showSuggestions && popularCities.length > 0 && !locationQuery" 
         class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      
      <div class="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
        Popular Cities
      </div>
      <button
        v-for="city in popularCities"
        :key="city.name"
        @mousedown="selectCity(city)"
        class="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
      >
        <div class="font-medium">{{ city.name }}</div>
        <div class="text-sm text-gray-500">Kenya</div>
      </button>
    </div>

    <!-- Location Info Display -->
    <div v-if="selectedLocation" class="mt-3 p-3 bg-blue-50 rounded-lg">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="font-medium text-blue-900">{{ selectedLocation.address }}</div>
          <div class="text-sm text-blue-700 mt-1">
            {{ selectedLocation.city }}, {{ selectedLocation.country }}
          </div>
          <div v-if="selectedLocation.accuracy" class="text-xs text-blue-600 mt-1">
            Accuracy: ~{{ Math.round(selectedLocation.accuracy) }}m
          </div>
        </div>
        <button @click="clearLocation" class="text-blue-600 hover:text-blue-800 ml-2">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { MapPin, Navigation, AlertCircle, X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Enter your location or use GPS'
  },
  autoDetect: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'location-selected', 'location-error'])

// Component state
const locationInput = ref(null)
const locationQuery = ref('')
const showSuggestions = ref(false)
const gettingLocation = ref(false)
const error = ref('')
const selectedLocation = ref(null)

// Popular cities in Kenya
const popularCities = ref([
  { name: 'Nairobi', coordinates: { lat: -1.2921, lng: 36.8219 } },
  { name: 'Mombasa', coordinates: { lat: -4.0435, lng: 39.6682 } },
  { name: 'Kisumu', coordinates: { lat: -0.0917, lng: 34.7680 } },
  { name: 'Nakuru', coordinates: { lat: -0.3031, lng: 36.0800 } },
  { name: 'Eldoret', coordinates: { lat: 0.5143, lng: 35.2698 } },
  { name: 'Thika', coordinates: { lat: -1.0332, lng: 37.0692 } }
])

// Methods
const handleInput = () => {
  error.value = ''
  emit('update:modelValue', locationQuery.value)
}

const handleBlur = () => {
  // Delay hiding suggestions to allow clicks
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const getCurrentLocation = async () => {
  if (!navigator.geolocation) {
    error.value = 'GPS is not available on this device'
    emit('location-error', 'GPS is not available on this device')
    return
  }

  gettingLocation.value = true
  error.value = ''

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      })
    })

    const { latitude, longitude } = position.coords

    // Simple reverse geocoding fallback
    const location = {
      latitude,
      longitude,
      address: 'Current Location',
      city: 'Current Location',
      country: 'Kenya',
      accuracy: position.coords.accuracy
    }

    selectedLocation.value = location
    locationQuery.value = location.address
    showSuggestions.value = false

    emit('update:modelValue', location)
    emit('location-selected', location)

  } catch (err) {
    let errorMessage = 'Unable to get your location'
    
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Location access denied by user'
        break
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable'
        break
      case err.TIMEOUT:
        errorMessage = 'Location request timed out'
        break
    }
    
    error.value = errorMessage
    emit('location-error', errorMessage)
  } finally {
    gettingLocation.value = false
  }
}

const selectCity = (city) => {
  const location = {
    latitude: city.coordinates.lat,
    longitude: city.coordinates.lng,
    address: `${city.name}, Kenya`,
    city: city.name,
    country: 'Kenya'
  }

  selectedLocation.value = location
  locationQuery.value = location.address
  showSuggestions.value = false

  emit('update:modelValue', location)
  emit('location-selected', location)
}

const clearLocation = () => {
  locationQuery.value = ''
  selectedLocation.value = null
  error.value = ''
  
  emit('update:modelValue', '')
  emit('location-selected', null)
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (typeof newValue === 'string') {
    locationQuery.value = newValue
  } else if (newValue && newValue.address) {
    locationQuery.value = newValue.address
    selectedLocation.value = newValue
  }
}, { immediate: true })

// Initialize
onMounted(async () => {
  // Auto-detect location if requested
  if (props.autoDetect && navigator.geolocation) {
    await getCurrentLocation()
  }
})
</script>

<style scoped>
/* Custom scrollbar for suggestions */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
</style>