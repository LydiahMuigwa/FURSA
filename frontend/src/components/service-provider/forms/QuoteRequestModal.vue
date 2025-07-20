<!-- QuoteRequestModal.vue - Comprehensive quote request system -->
<template>
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mr-4 flex items-center justify-center">
            <User v-if="!provider.profileImage" class="w-6 h-6 text-white" />
            <img v-else :src="provider.profileImage" :alt="provider.name" class="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Request Quote</h3>
            <p class="text-gray-600">{{ provider.name }} • {{ provider.serviceType }}</p>
          </div>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Quote Request Form -->
      <form @submit.prevent="submitQuote" class="p-6">
        <!-- Step Indicator -->
        <div class="flex items-center justify-between mb-8">
          <div v-for="(step, index) in steps" :key="index" class="flex items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              currentStep >= index + 1 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            ]">
              {{ index + 1 }}
            </div>
            <span :class="[
              'ml-2 text-sm font-medium',
              currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-500'
            ]">
              {{ step }}
            </span>
            <div v-if="index < steps.length - 1" :class="[
              'w-8 h-0.5 mx-4',
              currentStep > index + 1 ? 'bg-blue-600' : 'bg-gray-200'
            ]"></div>
          </div>
        </div>

        <!-- Step 1: Service Details -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              What service do you need? <span class="text-red-500">*</span>
            </label>
            <select v-model="quoteData.serviceType" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required>
              <option value="">Select a service...</option>
              <option v-for="service in provider.services" :key="service.name" :value="service.name">
                {{ service.name }} - {{ service.priceRange }}
              </option>
              <option value="custom">Other (please specify)</option>
            </select>
          </div>

          <div v-if="quoteData.serviceType === 'custom'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Custom Service Description <span class="text-red-500">*</span>
            </label>
            <input v-model="quoteData.customService" 
                   type="text" 
                   placeholder="Describe the service you need"
                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Describe your project in detail <span class="text-red-500">*</span>
            </label>
            <textarea v-model="quoteData.description" 
                      rows="4"
                      placeholder="Please provide as much detail as possible about what you need done, including size, materials, timeline, etc."
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required></textarea>
            <p class="text-sm text-gray-500 mt-1">{{ quoteData.description.length }}/500 characters</p>
          </div>

          <!-- Photo Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Upload photos (optional)
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input ref="fileInput" 
                     type="file" 
                     multiple 
                     accept="image/*"
                     @change="handleFileUpload"
                     class="hidden" />
              <Camera class="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <button type="button" @click="$refs.fileInput.click()" 
                      class="text-blue-600 hover:text-blue-700 font-medium">
                Click to upload photos
              </button>
              <p class="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
            </div>
            
            <!-- Preview uploaded photos -->
            <div v-if="uploadedPhotos.length > 0" class="grid grid-cols-3 gap-3 mt-4">
              <div v-for="(photo, index) in uploadedPhotos" :key="index" 
                   class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img :src="photo.preview" :alt="`Upload ${index + 1}`" 
                     class="w-full h-full object-cover" />
                <button @click="removePhoto(index)" 
                        class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                  <X class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Location & Timeline -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Service Location <span class="text-red-500">*</span>
            </label>
            <input v-model="quoteData.location" 
                   type="text" 
                   placeholder="Enter the address where service is needed"
                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   required />
            <p class="text-sm text-gray-500 mt-1">This helps the provider calculate travel time and costs</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              When do you need this done? <span class="text-red-500">*</span>
            </label>
            <select v-model="quoteData.timeline" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required>
              <option value="">Select timeline...</option>
              <option value="asap">As soon as possible</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this_week">This week</option>
              <option value="next_week">Next week</option>
              <option value="within_month">Within a month</option>
              <option value="flexible">I'm flexible</option>
            </select>
          </div>

          <div v-if="quoteData.timeline === 'flexible'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Preferred time frame
            </label>
            <textarea v-model="quoteData.flexibleDetails" 
                      rows="2"
                      placeholder="Let us know your preferred timeframe or any scheduling constraints"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Budget Range (optional)
            </label>
            <select v-model="quoteData.budget" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Not sure / Want estimate</option>
              <option value="under_5k">Under KES 5,000</option>
              <option value="5k_15k">KES 5,000 - 15,000</option>
              <option value="15k_50k">KES 15,000 - 50,000</option>
              <option value="50k_100k">KES 50,000 - 100,000</option>
              <option value="over_100k">Over KES 100,000</option>
            </select>
          </div>
        </div>

        <!-- Step 3: Contact Information -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span class="text-red-500">*</span>
              </label>
              <input v-model="quoteData.customerName" 
                     type="text" 
                     placeholder="John Doe"
                     class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span class="text-red-500">*</span>
              </label>
              <input v-model="quoteData.phone" 
                     type="tel" 
                     placeholder="+254 712 345 678"
                     class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span class="text-red-500">*</span>
            </label>
            <input v-model="quoteData.email" 
                   type="email" 
                   placeholder="john@example.com"
                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Preferred contact method
            </label>
            <div class="grid grid-cols-3 gap-3">
              <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input v-model="quoteData.contactPreference" 
                       type="radio" 
                       value="phone" 
                       class="mr-2" />
                <Phone class="w-4 h-4 mr-2" />
                <span class="text-sm">Phone</span>
              </label>
              <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input v-model="quoteData.contactPreference" 
                       type="radio" 
                       value="whatsapp" 
                       class="mr-2" />
                <MessageCircle class="w-4 h-4 mr-2" />
                <span class="text-sm">WhatsApp</span>
              </label>
              <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input v-model="quoteData.contactPreference" 
                       type="radio" 
                       value="email" 
                       class="mr-2" />
                <Mail class="w-4 h-4 mr-2" />
                <span class="text-sm">Email</span>
              </label>
            </div>
          </div>

          <!-- Quote Summary -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">Quote Request Summary</h4>
            <div class="space-y-2 text-sm">
              <div><span class="font-medium">Service:</span> {{ getServiceDisplay() }}</div>
              <div><span class="font-medium">Timeline:</span> {{ getTimelineDisplay() }}</div>
              <div><span class="font-medium">Location:</span> {{ quoteData.location }}</div>
              <div v-if="quoteData.budget"><span class="font-medium">Budget:</span> {{ getBudgetDisplay() }}</div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button v-if="currentStep > 1" 
                  type="button" 
                  @click="currentStep--"
                  class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <div v-else></div>

          <button v-if="currentStep < 3" 
                  type="button" 
                  @click="nextStep"
                  :disabled="!canProceed"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Next
          </button>
          <button v-else 
                  type="submit" 
                  :disabled="isSubmitting || !canSubmit"
                  class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center">
            <Send v-if="!isSubmitting" class="w-4 h-4 mr-2" />
            <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            {{ isSubmitting ? 'Sending...' : 'Send Quote Request' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, User, Camera, Phone, MessageCircle, Mail, Send } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  provider: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

// Component state
const currentStep = ref(1)
const isSubmitting = ref(false)
const uploadedPhotos = ref([])

const steps = ['Service Details', 'Location & Timeline', 'Contact Info']

// Form data
const quoteData = ref({
  serviceType: '',
  customService: '',
  description: '',
  location: '',
  timeline: '',
  flexibleDetails: '',
  budget: '',
  customerName: '',
  phone: '',
  email: '',
  contactPreference: 'phone'
})

// Validation
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return quoteData.value.serviceType && 
             quoteData.value.description.trim().length > 10 &&
             (quoteData.value.serviceType !== 'custom' || quoteData.value.customService.trim())
    case 2:
      return quoteData.value.location.trim() && quoteData.value.timeline
    case 3:
      return quoteData.value.customerName.trim() && 
             quoteData.value.phone.trim() && 
             quoteData.value.email.trim() &&
             quoteData.value.contactPreference
    default:
      return false
  }
})

const canSubmit = computed(() => {
  return canProceed.value
})

// Methods
const nextStep = () => {
  if (canProceed.value && currentStep.value < 3) {
    currentStep.value++
  }
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  currentStep.value = 1
  quoteData.value = {
    serviceType: '',
    customService: '',
    description: '',
    location: '',
    timeline: '',
    flexibleDetails: '',
    budget: '',
    customerName: '',
    phone: '',
    email: '',
    contactPreference: 'phone'
  }
  uploadedPhotos.value = []
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert(`File ${file.name} is too large. Please choose files under 5MB.`)
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedPhotos.value.push({
        file,
        preview: e.target.result,
        name: file.name
      })
    }
    reader.readAsDataURL(file)
  })
  
  // Reset input
  event.target.value = ''
}

const removePhoto = (index) => {
  uploadedPhotos.value.splice(index, 1)
}

const getServiceDisplay = () => {
  if (quoteData.value.serviceType === 'custom') {
    return quoteData.value.customService
  }
  return quoteData.value.serviceType
}

const getTimelineDisplay = () => {
  const timelineMap = {
    'asap': 'As soon as possible',
    'today': 'Today',
    'tomorrow': 'Tomorrow',
    'this_week': 'This week',
    'next_week': 'Next week',
    'within_month': 'Within a month',
    'flexible': 'Flexible'
  }
  return timelineMap[quoteData.value.timeline] || quoteData.value.timeline
}

const getBudgetDisplay = () => {
  const budgetMap = {
    'under_5k': 'Under KES 5,000',
    '5k_15k': 'KES 5,000 - 15,000',
    '15k_50k': 'KES 15,000 - 50,000',
    '50k_100k': 'KES 50,000 - 100,000',
    'over_100k': 'Over KES 100,000'
  }
  return budgetMap[quoteData.value.budget] || quoteData.value.budget
}

const submitQuote = async () => {
  if (!canSubmit.value) return
  
  isSubmitting.value = true
  
  try {
    const quoteRequest = {
      providerId: props.provider.id,
      providerName: props.provider.name,
      providerService: props.provider.serviceType,
      ...quoteData.value,
      photos: uploadedPhotos.value,
      submittedAt: new Date().toISOString()
    }
    
    // Emit to parent component
    emit('submit', quoteRequest)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Success - close modal
    closeModal()
    
  } catch (error) {
    console.error('Error submitting quote:', error)
    alert('There was an error sending your quote request. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})
</script>

<style scoped>
/* Custom styles for better UX */
.resize-none {
  resize: none;
}

/* Radio button styling */
input[type="radio"] {
  accent-color: #2563eb;
}

/* File input styling */
input[type="file"] {
  display: none;
}
</style>