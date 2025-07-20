<!-- PhotoViewerModal.vue - Modal for viewing customer photos -->
<template>
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <div @click.stop class="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center p-4">
      <!-- Close Button -->
      <button @click="closeModal" 
              class="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-colors">
        <X class="w-6 h-6" />
      </button>

      <!-- Navigation Buttons -->
      <button v-if="photos.length > 1" 
              @click="previousPhoto"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-colors">
        <ChevronLeft class="w-6 h-6" />
      </button>

      <button v-if="photos.length > 1" 
              @click="nextPhoto"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-colors">
        <ChevronRight class="w-6 h-6" />
      </button>

      <!-- Main Image -->
      <div class="flex flex-col items-center justify-center w-full h-full">
        <img v-if="currentPhoto" 
             :src="currentPhoto.preview" 
             :alt="currentPhoto.name"
             class="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
        
        <!-- Photo Info -->
        <div class="mt-4 text-center">
          <p class="text-white font-medium">{{ currentPhoto?.name }}</p>
          <p v-if="photos.length > 1" class="text-gray-300 text-sm mt-1">
            {{ currentIndex + 1 }} of {{ photos.length }}
          </p>
        </div>
      </div>

      <!-- Thumbnail Strip (for multiple photos) -->
      <div v-if="photos.length > 1" 
           class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2">
        <button v-for="(photo, index) in photos" 
                :key="index"
                @click="currentIndex = index"
                :class="[
                  'w-12 h-12 rounded overflow-hidden border-2 transition-colors',
                  currentIndex === index ? 'border-white' : 'border-transparent hover:border-gray-300'
                ]">
          <img :src="photo.preview" 
               :alt="photo.name" 
               class="w-full h-full object-cover" />
        </button>
      </div>

      <!-- Keyboard shortcuts info -->
      <div class="absolute bottom-4 left-4 text-white text-xs bg-black bg-opacity-50 rounded px-2 py-1">
        <p>Press ← → to navigate • ESC to close</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  photos: {
    type: Array,
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])

// Component state
const currentIndex = ref(0)

// Computed properties
const currentPhoto = computed(() => {
  return props.photos[currentIndex.value] || null
})

// Methods
const closeModal = () => {
  emit('close')
}

const previousPhoto = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = props.photos.length - 1
  }
}

const nextPhoto = () => {
  if (currentIndex.value < props.photos.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

// Keyboard navigation
const handleKeydown = (event) => {
  if (!props.isOpen) return
  
  switch (event.key) {
    case 'Escape':
      closeModal()
      break
    case 'ArrowLeft':
      event.preventDefault()
      previousPhoto()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextPhoto()
      break
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Watch for changes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    currentIndex.value = props.initialIndex
  }
})

watch(() => props.initialIndex, (newIndex) => {
  currentIndex.value = newIndex
})
</script>

<style scoped>
/* Prevent body scroll when modal is open */
.modal-open {
  overflow: hidden;
}
</style>