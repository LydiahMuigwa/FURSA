<!-- ServiceProviderCard.vue - Service provider card for search results -->
<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
       @click="viewProfile">
    <div class="flex gap-4">
      <!-- Provider Image -->
      <div class="relative flex-shrink-0">
        <div class="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <User v-if="!provider.profileImage" class="w-8 h-8 text-white" />
          <img v-else :src="provider.profileImage" :alt="provider.name" class="w-full h-full object-cover" />
        </div>
        
        <!-- Online Status -->
        <div :class="[
          'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
          provider.isOnline ? 'bg-emerald-500' : 'bg-gray-400'
        ]"></div>
        
        <!-- Verification Badge -->
        <div v-if="provider.verified" class="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1">
          <Check class="w-2.5 h-2.5" />
        </div>
      </div>

      <!-- Provider Info -->
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 truncate">{{ provider.name }}</h3>
            <p class="text-blue-600 text-sm font-medium">{{ provider.serviceType }}</p>
          </div>
          
          <!-- Rating -->
          <div class="flex items-center ml-4">
            <Star class="w-4 h-4 text-yellow-400 fill-current" />
            <span class="text-sm font-medium ml-1">{{ provider.rating }}</span>
            <span class="text-xs text-gray-500 ml-1">({{ provider.reviewCount }})</span>
          </div>
        </div>

        <!-- Location & Distance -->
        <div class="flex items-center text-sm text-gray-600 mb-3">
          <MapPin class="w-4 h-4 mr-1" />
          <span>{{ provider.location }}</span>
          <span class="mx-2">•</span>
          <span class="font-medium text-blue-600">{{ provider.distance }}</span>
        </div>

        <!-- Availability & Response Time -->
        <div class="flex items-center gap-4 mb-3">
          <div class="flex items-center">
            <div :class="[
              'w-2 h-2 rounded-full mr-2',
              provider.availability.status === 'available' ? 'bg-emerald-500' : 
              provider.availability.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
            ]"></div>
            <span :class="[
              'text-xs font-medium',
              provider.availability.status === 'available' ? 'text-emerald-600' : 
              provider.availability.status === 'busy' ? 'text-yellow-600' : 'text-red-600'
            ]">
              {{ provider.availability.message }}
            </span>
          </div>
          
          <div class="flex items-center text-xs text-gray-500">
            <Clock class="w-3 h-3 mr-1" />
            <span>{{ provider.responseTime }} response</span>
          </div>
        </div>

        <!-- Portfolio Preview Section - ADD AFTER response time section -->
<div v-if="provider.stories && provider.stories.length > 0" class="mt-4 pt-4 border-t border-gray-100">
  <div class="flex items-center justify-between mb-2">
    <h4 class="text-sm font-medium text-gray-700 flex items-center">
      <svg class="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>
      Recent Work
    </h4>
    <span class="text-xs text-blue-600">{{ provider.stories.length }} projects</span>
  </div>
  
  <div class="grid grid-cols-2 gap-2">
    <div v-for="story in provider.stories.slice(0, 2)" :key="story.id" 
         class="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer">
      
      <div class="h-16 bg-gray-200 rounded mb-1 overflow-hidden">
        <img v-if="story.projectPhotos?.[0] || story.afterPhotos?.[0]" 
             :src="story.projectPhotos?.[0] || story.afterPhotos?.[0]" 
             :alt="story.title"
             class="w-full h-full object-cover">
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
      </div>
      
      <h5 class="text-xs font-medium text-gray-800 truncate">
        {{ story.title || 'Professional Project' }}
      </h5>
      <p class="text-xs text-gray-500">Recent work</p>
    </div>
  </div>
</div>




        <!-- Services Preview -->
        <div class="mb-4">
          <div class="flex flex-wrap gap-1">
            <span v-for="service in provider.topServices" :key="service"
                  class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {{ service }}
            </span>
          </div>
        </div>

        <!-- Price Range -->
        <div class="flex items-center justify-between">
          <div class="text-sm">
            <span class="text-gray-600">Starting from</span>
            <span class="font-semibold text-gray-900 ml-1">{{ provider.startingPrice }}</span>
          </div>
          
          <!-- Quick Actions -->
          <div class="flex gap-2">
            <button @click.stop="callProvider" 
                    class="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors"
                    title="Call Now">
              <Phone class="w-4 h-4" />
            </button>
            <button @click.stop="whatsappProvider" 
                    class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                    title="WhatsApp">
              <MessageCircle class="w-4 h-4" />
            </button>
            <button @click.stop="requestQuote" 
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">
              Quote
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Trust Indicators -->
    <div v-if="provider.verified || provider.backgroundCheck" class="flex gap-2 mt-4 pt-4 border-t border-gray-100">
      <span v-if="provider.verified" class="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
        ✓ Verified
      </span>
      <span v-if="provider.backgroundCheck" class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
        ✓ Background Check
      </span>
      <span v-if="provider.licensed" class="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium">
        ✓ Licensed
      </span>
    </div>
  </div>
</template>

<script setup>
import { User, Check, MapPin, Star, Clock, Phone, MessageCircle } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  provider: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['call', 'whatsapp', 'quote'])

const viewProfile = () => {
  router.push(`/app/service-provider/${props.provider.id}`)
}

const callProvider = () => {
  window.location.href = `tel:${props.provider.contact.phone}`
  emit('call', props.provider)
}

const whatsappProvider = () => {
  const message = encodeURIComponent(`Hi ${props.provider.name}, I found you on FURSA and would like to discuss a ${props.provider.serviceType} project.`)
  window.open(`https://wa.me/${props.provider.contact.whatsapp.replace('+', '')}?text=${message}`, '_blank')
  emit('whatsapp', props.provider)
}

const requestQuote = () => {
  // This could either open a modal or navigate to a quote request page
  emit('quote', props.provider)
}
</script>

<style scoped>
/* Additional custom styles if needed */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>