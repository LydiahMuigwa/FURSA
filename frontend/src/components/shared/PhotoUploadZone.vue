<!-- PhotoUploadZone.vue - Revolutionary drag & drop photo upload -->
<template>
  <div class="photo-upload-zone">
    <!-- Upload Area -->
    <div 
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      :class="[
        'relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer group',
        isDragging 
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
        photos.length === 0 ? 'p-12' : 'p-6'
      ]">
      
      <!-- Empty State -->
      <div v-if="photos.length === 0" class="text-center">
        <div class="mb-4">
          <div :class="[
            'w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-300',
            isDragging ? 'bg-blue-600 text-white scale-110' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
          ]">
            <Upload :class="isDragging ? 'w-8 h-8' : 'w-6 h-6'" />
          </div>
        </div>
        
        <h3 :class="[
          'text-lg font-semibold mb-2 transition-colors',
          isDragging ? 'text-blue-600' : 'text-gray-900'
        ]">
          {{ isDragging ? (t('upload.drop_here') || 'Drop photos here!') : (t('upload.drag_drop') || 'Drag & drop photos here') }}
        </h3>
        
        <p class="text-gray-600 mb-4">
          {{ placeholder || (t('upload.or_click') || 'or click to browse files') }}
        </p>
        
        <div class="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span class="flex items-center">
            <Image class="w-4 h-4 mr-1" />
            {{ t('upload.formats') || 'JPG, PNG, WEBP' }}
          </span>
          <span class="flex items-center">
            <HardDrive class="w-4 h-4 mr-1" />
            {{ t('upload.max_size') || 'Max 5MB each' }}
          </span>
        </div>
      </div>

      <!-- Photos Grid -->
      <div v-else>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <div v-for="(photo, index) in photos" :key="index" 
               class="relative group aspect-square">
            
            <!-- Photo Preview -->
            <div class="w-full h-full rounded-lg overflow-hidden bg-gray-100 relative">
              <img :src="photo.preview || photo.url" 
                   :alt="photo.name || `Photo ${index + 1}`"
                   class="w-full h-full object-cover">
              
              <!-- Overlay -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button @click.stop="viewPhoto(index)"
                          class="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                    <Eye class="w-4 h-4" />
                  </button>
                  <button @click.stop="removePhoto(index)"
                          class="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="photo.uploading" 
                   class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                <div class="text-center">
                  <div class="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p class="text-sm text-gray-600">{{ t('upload.uploading') || 'Uploading...' }}</p>
                </div>
              </div>

              <!-- Photo Number Badge -->
              <div class="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                {{ index + 1 }}
              </div>
            </div>

            <!-- Photo Info -->
            <div class="mt-2">
              <p class="text-xs text-gray-600 truncate">{{ photo.name }}</p>
              <p class="text-xs text-gray-400">{{ formatFileSize(photo.size) }}</p>
            </div>
          </div>

          <!-- Add More Button -->
          <div class="aspect-square">
            <button @click="triggerFileInput"
                    class="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-all duration-200 group">
              <Plus class="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
              <span class="text-sm font-medium">{{ t('upload.add_more') || 'Add more' }}</span>
            </button>
          </div>
        </div>

        <!-- Upload Instructions -->
        <div class="text-center">
          <p class="text-sm text-gray-500">
            {{ t('upload.drag_more') || 'Drag more photos here or click add more button' }}
          </p>
        </div>
      </div>

      <!-- Hidden File Input -->
      <input ref="fileInput" 
             type="file" 
             multiple 
             accept="image/*"
             @change="handleFileSelect"
             class="hidden">
    </div>

    <!-- Upload Progress -->
    <div v-if="uploadProgress > 0 && uploadProgress < 100" 
         class="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
      <div class="bg-blue-600 h-full transition-all duration-300 ease-out" 
           :style="{ width: uploadProgress + '%' }"></div>
    </div>

    <!-- Error Messages -->
    <div v-if="errorMessage" 
         class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
      <AlertCircle class="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
      <p class="text-sm text-red-700">{{ errorMessage }}</p>
      <button @click="errorMessage = ''" class="ml-auto text-red-600 hover:text-red-800">
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Photo Count & Limits -->
    <div v-if="photos.length > 0" class="mt-4 flex justify-between items-center text-sm text-gray-600">
      <span>{{ photos.length }} {{ photos.length === 1 ? (t('upload.photo') || 'photo') : (t('upload.photos') || 'photos') }}</span>
      <span v-if="maxPhotos">{{ photos.length }}/{{ maxPhotos }} {{ t('upload.max_photos') || 'max' }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  Upload, Image, HardDrive, Eye, Trash2, Plus, AlertCircle, X
} from 'lucide-vue-next'

const { t } = useI18n()

// Props
const props = defineProps({
  photos: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: ''
  },
  maxPhotos: {
    type: Number,
    default: 10
  },
  maxFileSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  },
  acceptedFormats: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  }
})

// Emits
const emit = defineEmits(['upload', 'remove', 'view', 'error'])

// Component state
const fileInput = ref(null)
const isDragging = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  
  const files = Array.from(e.dataTransfer.files)
  processFiles(files)
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  processFiles(files)
  e.target.value = '' // Reset input
}

const processFiles = async (files) => {
  errorMessage.value = ''
  
  // Filter valid image files
  const validFiles = files.filter(file => {
    // Check file type
    if (!props.acceptedFormats.includes(file.type)) {
      showError(t('upload.invalid_format', { name: file.name }) || `${file.name} is not a supported format`)
      return false
    }
    
    // Check file size
    if (file.size > props.maxFileSize) {
      showError(t('upload.file_too_large', { name: file.name }) || `${file.name} is too large`)
      return false
    }
    
    return true
  })

  // Check photo count limit
  if (props.photos.length + validFiles.length > props.maxPhotos) {
    showError(t('upload.too_many_photos', { max: props.maxPhotos }) || `Maximum ${props.maxPhotos} photos allowed`)
    return
  }

  // Process each file
  const newPhotos = []
  for (const file of validFiles) {
    try {
      const photoData = await createPhotoData(file)
      newPhotos.push(photoData)
    } catch (error) {
      showError(t('upload.processing_error', { name: file.name }) || `Error processing ${file.name}`)
    }
  }

  // Emit new photos
  if (newPhotos.length > 0) {
    emit('upload', [...props.photos, ...newPhotos])
  }
}

const createPhotoData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      resolve({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: e.target.result,
        uploading: false,
        id: Date.now() + Math.random() // Simple ID generation
      })
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

const removePhoto = (index) => {
  const updatedPhotos = [...props.photos]
  updatedPhotos.splice(index, 1)
  emit('remove', index)
  emit('upload', updatedPhotos)
}

const viewPhoto = (index) => {
  emit('view', index)
}

const showError = (message) => {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.photo-upload-zone {
  @apply w-full;
}

/* Custom animations */
@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.group:hover .bounce {
  animation: bounce-subtle 0.6s ease-in-out;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Photo grid responsive */
.aspect-square {
  aspect-ratio: 1 / 1;
}

/* Hover effects */
.group:hover .scale-110 {
  transform: scale(1.1);
}

/* Focus states for accessibility */
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>