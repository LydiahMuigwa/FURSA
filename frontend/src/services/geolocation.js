// frontend/src/services/geolocation.js
// Geolocation service for handling location-based features

export class GeolocationService {
  constructor() {
    this.currentPosition = null
    this.watchId = null
    this.isWatching = false
  }

  /**
   * Get user's current position
   * @param {Object} options - Geolocation options
   * @returns {Promise<Object>} - Position object with coordinates and address
   */
  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes cache
    }

    const geolocationOptions = { ...defaultOptions, ...options }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          try {
            // Get human-readable address
            const address = await this.reverseGeocode(latitude, longitude)
            
            const locationData = {
              latitude,
              longitude,
              accuracy: position.coords.accuracy,
              address: address.formatted_address,
              city: address.city,
              country: address.country,
              timestamp: position.timestamp
            }

            this.currentPosition = locationData
            resolve(locationData)
          } catch (error) {
            // If reverse geocoding fails, still return coordinates
            const locationData = {
              latitude,
              longitude,
              accuracy: position.coords.accuracy,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              city: 'Unknown',
              country: 'Unknown',
              timestamp: position.timestamp
            }
            
            this.currentPosition = locationData
            resolve(locationData)
          }
        },
        (error) => {
          let errorMessage = 'Unable to get your location'
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              break
          }
          
          reject(new Error(errorMessage))
        },
        geolocationOptions
      )
    })
  }

  /**
   * Convert coordinates to human-readable address
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} - Address object
   */
  async reverseGeocode(lat, lng) {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FURSA-Platform'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Geocoding service unavailable')
      }

      const data = await response.json()
      
      if (!data || data.error) {
        throw new Error('Address not found')
      }

      // Parse the response to extract useful information
      const address = data.address || {}
      
      return {
        formatted_address: data.display_name || `${lat}, ${lng}`,
        city: address.city || address.town || address.village || address.suburb || 'Unknown',
        region: address.state || address.region || address.county || '',
        country: address.country || 'Unknown',
        country_code: address.country_code || '',
        postcode: address.postcode || '',
        road: address.road || '',
        house_number: address.house_number || '',
        raw: data
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error)
      
      // Fallback: return coordinates as string
      return {
        formatted_address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        city: 'Unknown',
        region: '',
        country: 'Unknown',
        country_code: '',
        postcode: '',
        road: '',
        house_number: '',
        raw: null
      }
    }
  }

  /**
   * Convert address to coordinates
   * @param {string} address - Address string
   * @returns {Promise<Object>} - Coordinates object
   */
  async geocodeAddress(address) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FURSA-Platform'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Geocoding service unavailable')
      }

      const data = await response.json()
      
      if (!data || data.length === 0) {
        throw new Error('Address not found')
      }

      const result = data[0]
      
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formatted_address: result.display_name,
        city: result.address?.city || result.address?.town || 'Unknown',
        country: result.address?.country || 'Unknown',
        bbox: result.boundingbox ? {
          north: parseFloat(result.boundingbox[1]),
          south: parseFloat(result.boundingbox[0]),
          east: parseFloat(result.boundingbox[3]),
          west: parseFloat(result.boundingbox[2])
        } : null
      }
    } catch (error) {
      throw new Error(`Failed to geocode address: ${error.message}`)
    }
  }

  /**
   * Calculate distance between two points (Haversine formula)
   * @param {number} lat1 - First point latitude
   * @param {number} lng1 - First point longitude
   * @param {number} lat2 - Second point latitude
   * @param {number} lng2 - Second point longitude
   * @returns {number} - Distance in kilometers
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    
    return Math.round(distance * 10) / 10 // Round to 1 decimal place
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees 
   * @returns {number}
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }

  /**
   * Format distance for display
   * @param {number} distance - Distance in kilometers
   * @returns {string} - Formatted distance string
   */
  formatDistance(distance) {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    } else if (distance < 10) {
      return `${distance.toFixed(1)}km`
    } else {
      return `${Math.round(distance)}km`
    }
  }

  /**
   * Filter providers by distance
   * @param {Array} providers - Array of service providers
   * @param {Object} userLocation - User's location {latitude, longitude}
   * @param {number} maxDistance - Maximum distance in kilometers
   * @returns {Array} - Filtered providers with distance
   */
  filterProvidersByDistance(providers, userLocation, maxDistance = 50) {
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      return providers
    }

    return providers.map(provider => {
      // Calculate distance if provider has coordinates
      if (provider.latitude && provider.longitude) {
        const distance = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          provider.latitude,
          provider.longitude
        )
        
        return {
          ...provider,
          distance: distance,
          distanceText: this.formatDistance(distance),
          withinRange: distance <= maxDistance
        }
      }
      
      // If no coordinates, estimate based on location text
      return {
        ...provider,
        distance: null,
        distanceText: 'Distance unknown',
        withinRange: true // Include providers without coordinates
      }
    }).filter(provider => provider.withinRange)
      .sort((a, b) => {
        // Sort by distance, putting providers without distance at the end
        if (a.distance === null && b.distance === null) return 0
        if (a.distance === null) return 1
        if (b.distance === null) return -1
        return a.distance - b.distance
      })
  }

  /**
   * Get popular cities in Kenya (fallback/suggestions)
   * @returns {Array} - Array of city objects
   */
  getPopularCities() {
    return [
      { name: 'Nairobi', coordinates: { lat: -1.2921, lng: 36.8219 } },
      { name: 'Mombasa', coordinates: { lat: -4.0435, lng: 39.6682 } },
      { name: 'Kisumu', coordinates: { lat: -0.0917, lng: 34.7680 } },
      { name: 'Nakuru', coordinates: { lat: -0.3031, lng: 36.0800 } },
      { name: 'Eldoret', coordinates: { lat: 0.5143, lng: 35.2698 } },
      { name: 'Thika', coordinates: { lat: -1.0332, lng: 37.0692 } },
      { name: 'Meru', coordinates: { lat: 0.0469, lng: 37.6506 } },
      { name: 'Kakamega', coordinates: { lat: 0.2827, lng: 34.7519 } }
    ]
  }

  /**
   * Watch user's position for real-time updates
   * @param {Function} callback - Callback function to handle position updates
   * @param {Object} options - Watch options
   */
  watchPosition(callback, options = {}) {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported')
    }

    const watchOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000, // 1 minute
      ...options
    }

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          const address = await this.reverseGeocode(latitude, longitude)
          const locationData = {
            latitude,
            longitude,
            accuracy: position.coords.accuracy,
            address: address.formatted_address,
            city: address.city,
            country: address.country,
            timestamp: position.timestamp
          }
          
          this.currentPosition = locationData
          callback(null, locationData)
        } catch (error) {
          callback(error, null)
        }
      },
      (error) => callback(error, null),
      watchOptions
    )

    this.isWatching = true
  }

  /**
   * Stop watching user's position
   */
  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
      this.isWatching = false
    }
  }

  /**
   * Check if geolocation is available
   * @returns {boolean}
   */
  isGeolocationAvailable() {
    return 'geolocation' in navigator
  }

  /**
   * Get current cached position
   * @returns {Object|null}
   */
  getCachedPosition() {
    return this.currentPosition
  }
}

// Create singleton instance
export const geolocationService = new GeolocationService()

// Helper composable for Vue components
export function useGeolocation() {
  return {
    geolocationService,
    getCurrentPosition: (options) => geolocationService.getCurrentPosition(options),
    geocodeAddress: (address) => geolocationService.geocodeAddress(address),
    calculateDistance: (lat1, lng1, lat2, lng2) => geolocationService.calculateDistance(lat1, lng1, lat2, lng2),
    formatDistance: (distance) => geolocationService.formatDistance(distance),
    filterProvidersByDistance: (providers, userLocation, maxDistance) => 
      geolocationService.filterProvidersByDistance(providers, userLocation, maxDistance),
    isGeolocationAvailable: () => geolocationService.isGeolocationAvailable()
  }
}