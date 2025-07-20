<!-- QuoteResponseModal.vue - Modal for providers to respond to quote requests -->
<template>
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h3 class="text-xl font-bold text-gray-900">Respond to Quote Request</h3>
          <p class="text-gray-600">{{ quote?.customerName }} • Ref: #{{ quote?.referenceNumber }}</p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6">
        <!-- Customer Request Summary -->
        <div class="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 class="font-semibold text-gray-900 mb-4">Customer Request</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span class="text-sm font-medium text-gray-600">Service:</span>
              <p class="text-gray-900">{{ quote?.serviceType }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">Location:</span>
              <p class="text-gray-900">{{ quote?.location }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">Timeline:</span>
              <p class="text-gray-900">{{ formatTimeline(quote?.timeline) }}</p>
            </div>
            <div v-if="quote?.budget">
              <span class="text-sm font-medium text-gray-600">Budget:</span>
              <p class="text-gray-900">{{ formatBudget(quote?.budget) }}</p>
            </div>
          </div>

          <div class="mb-4">
            <span class="text-sm font-medium text-gray-600">Description:</span>
            <p class="text-gray-900 mt-1">{{ quote?.description }}</p>
          </div>

          <!-- Customer Photos -->
          <div v-if="quote?.photos && quote.photos.length > 0">
            <span class="text-sm font-medium text-gray-600">Photos:</span>
            <div class="flex space-x-2 mt-2">
              <img v-for="(photo, index) in quote.photos" 
                   :key="index"
                   :src="photo.preview" 
                   :alt="`Photo ${index + 1}`"
                   class="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                   @click="openPhotoViewer(index)" />
            </div>
          </div>
        </div>

        <!-- Response Form -->
        <form @submit.prevent="submitResponse">
          <div class="space-y-6">
            <!-- Quick Response Templates -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Quick Response Templates
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button v-for="template in responseTemplates" 
                        :key="template.id"
                        type="button"
                        @click="useTemplate(template)"
                        class="p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <p class="font-medium text-gray-900 text-sm">{{ template.title }}</p>
                  <p class="text-xs text-gray-600 mt-1">{{ template.preview }}</p>
                </button>
              </div>
            </div>

            <!-- Custom Response Message -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Your Response Message <span class="text-red-500">*</span>
              </label>
              <textarea v-model="responseData.message" 
                        placeholder="Write your detailed response to the customer..."
                        rows="6" 
                        maxlength="1000"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        required></textarea>
              <p class="text-sm text-gray-500 mt-1">{{ responseData.message.length }}/1000 characters</p>
            </div>

            <!-- Quote Amount -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Quote Amount <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-3 text-gray-500">KES</span>
                  <input v-model="responseData.amount" 
                         type="number" 
                         min="0"
                         step="500"
                         placeholder="0"
                         class="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         required />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration
                </label>
                <select v-model="responseData.duration" 
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select duration</option>
                  <option value="1-2 hours">1-2 hours</option>
                  <option value="Half day">Half day</option>
                  <option value="1 day">1 day</option>
                  <option value="2-3 days">2-3 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                </select>
              </div>
            </div>

            <!-- Availability -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Your Availability
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label v-for="slot in availabilitySlots" 
                       :key="slot.value"
                       :class="[
                         'p-3 border-2 rounded-lg cursor-pointer transition-all text-center',
                         responseData.availability.includes(slot.value)
                           ? 'border-blue-500 bg-blue-50' 
                           : 'border-gray-200 hover:border-gray-300'
                       ]">
                  <input type="checkbox" 
                         :value="slot.value" 
                         v-model="responseData.availability" 
                         class="sr-only" />
                  <div class="font-medium text-sm">{{ slot.label }}</div>
                  <div class="text-xs text-gray-500">{{ slot.time }}</div>
                </label>
              </div>
            </div>

            <!-- Additional Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea v-model="responseData.notes" 
                        placeholder="Any additional information, terms, or conditions..."
                        rows="3" 
                        maxlength="500"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
              <p class="text-sm text-gray-500 mt-1">{{ responseData.notes.length }}/500 characters</p>
            </div>

            <!-- Contact Preferences -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                How should the customer contact you?
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label :class="[
                         'p-4 border-2 rounded-lg cursor-pointer transition-all text-center',
                         responseData.contactPreference === 'phone' 
                           ? 'border-blue-500 bg-blue-50' 
                           : 'border-gray-200 hover:border-gray-300'
                       ]">
                  <input type="radio" 
                         value="phone" 
                         v-model="responseData.contactPreference" 
                         class="sr-only" />
                  <Phone class="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div class="font-medium text-gray-900">Phone Call</div>
                  <div class="text-xs text-gray-500 mt-1">Direct discussion</div>
                </label>
                
                <label :class="[
                         'p-4 border-2 rounded-lg cursor-pointer transition-all text-center',
                         responseData.contactPreference === 'whatsapp' 
                           ? 'border-blue-500 bg-blue-50' 
                           : 'border-gray-200 hover:border-gray-300'
                       ]">
                  <input type="radio" 
                         value="whatsapp" 
                         v-model="responseData.contactPreference" 
                         class="sr-only" />
                  <MessageCircle class="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div class="font-medium text-gray-900">WhatsApp</div>
                  <div class="text-xs text-gray-500 mt-1">Chat & photos</div>
                </label>
                
                <label :class="[
                         'p-4 border-2 rounded-lg cursor-pointer transition-all text-center',
                         responseData.contactPreference === 'email' 
                           ? 'border-blue-500 bg-blue-50' 
                           : 'border-gray-200 hover:border-gray-300'
                       ]">
                  <input type="radio" 
                         value="email" 
                         v-model="responseData.contactPreference" 
                         class="sr-only" />
                  <Mail class="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div class="font-medium text-gray-900">Email</div>
                  <div class="text-xs text-gray-500 mt-1">Detailed response</div>
                </label>
              </div>
            </div>

            <!-- Quote Summary -->
            <div class="bg-blue-50 rounded-lg p-6">
              <h4 class="font-semibold text-blue-900 mb-4">Quote Summary</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-blue-700">Service:</span>
                  <span class="font-medium text-blue-900">{{ quote?.serviceType }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-blue-700">Quote Amount:</span>
                  <span class="font-medium text-blue-900">
                    KES {{ responseData.amount ? Number(responseData.amount).toLocaleString() : '0' }}
                  </span>
                </div>
                <div v-if="responseData.duration" class="flex justify-between">
                  <span class="text-blue-700">Duration:</span>
                  <span class="font-medium text-blue-900">{{ responseData.duration }}</span>
                </div>
                <div v-if="responseData.availability.length > 0" class="flex justify-between">
                  <span class="text-blue-700">Available:</span>
                  <span class="font-medium text-blue-900">{{ responseData.availability.join(', ') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Actions -->
          <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button type="button" 
                    @click="closeModal"
                    class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
              Cancel
            </button>

            <div class="flex space-x-3">
              <button type="button" 
                      @click="saveAsDraft"
                      class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Save Draft
              </button>
              <button type="submit"
                      :disabled="!canSubmit"
                      :class="[
                        'px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center',
                        canSubmit
                          ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      ]">
                <Send class="w-4 h-4 mr-2" />
                Send Quote Response
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, Phone, MessageCircle, Mail, Send } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  quote: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

// Component state
const responseData = ref({
  message: '',
  amount: '',
  duration: '',
  availability: [],
  notes: '',
  contactPreference: 'phone'
})

const responseTemplates = [
  {
    id: 1,
    title: 'Standard Quote',
    preview: 'Thank you for your request. I can help you with...',
    message: `Thank you for your request through FURSA. I'd be happy to help you with your ${props.quote?.serviceType || 'electrical'} project.\n\nBased on your requirements, I can provide a comprehensive solution that includes all necessary materials and professional installation. I have extensive experience with similar projects and am fully licensed and insured.\n\nI'm available to discuss the details and answer any questions you may have. Looking forward to working with you!`
  },
  {
    id: 2,
    title: 'Detailed Breakdown',
    preview: 'Here\'s a detailed breakdown of the work...',
    message: `Thank you for reaching out! I've reviewed your project requirements and can provide the following:\n\n✓ Site assessment and planning\n✓ All necessary materials and equipment\n✓ Professional installation\n✓ Testing and quality assurance\n✓ Clean-up and waste disposal\n\nThe work will be completed to the highest standards with full warranty coverage. I'm committed to delivering excellent results on time and within budget.`
  },
  {
    id: 3,
    title: 'Emergency Response',
    preview: 'I understand this is urgent and can help...',
    message: `I understand this is an urgent matter and I can help you right away. Safety is my top priority, and I have the experience and tools needed to resolve this issue quickly and safely.\n\nI can be available for emergency callout and will ensure the problem is fixed properly. All work comes with a guarantee for your peace of mind.`
  },
  {
    id: 4,
    title: 'Consultation First',
    preview: 'I\'d like to schedule a consultation...',
    message: `Thank you for your interest! For a project of this scope, I'd recommend scheduling a brief consultation to assess the site and provide you with the most accurate quote.\n\nThe consultation is free and will allow me to:\n• Evaluate the current setup\n• Discuss your specific needs\n• Provide detailed recommendations\n• Give you a precise timeline and cost\n\nThis ensures you get exactly what you need with no surprises.`
  }
]

const availabilitySlots = [
  { value: 'Today', label: 'Today', time: 'Emergency' },
  { value: 'Tomorrow', label: 'Tomorrow', time: 'Next day' },
  { value: 'This Week', label: 'This Week', time: 'Mon-Fri' },
  { value: 'Weekend', label: 'Weekend', time: 'Sat-Sun' },
  { value: 'Next Week', label: 'Next Week', time: '7+ days' },
  { value: 'Evenings', label: 'Evenings', time: '5-8 PM' },
  { value: 'Mornings', label: 'Mornings', time: '8-12 PM' },
  { value: 'Flexible', label: 'Flexible', time: 'Anytime' }
]

// Computed properties
const canSubmit = computed(() => {
  return responseData.value.message.trim().length > 20 && 
         responseData.value.amount && 
         responseData.value.contactPreference
})

// Methods
const formatTimeline = (timeline) => {
  const timelineMap = {
    'asap': 'ASAP',
    'today': 'Today',
    'this_week': 'This week',
    'next_week': 'Next week',
    'within_month': 'Within a month',
    'flexible': 'Flexible'
  }
  return timelineMap?.[timeline] || timeline
}

const formatBudget = (budget) => {
  const budgetMap = {
    'under_5k': 'Under KES 5,000',
    '5k_15k': 'KES 5,000 - 15,000',
    '15k_50k': 'KES 15,000 - 50,000',
    '50k_100k': 'KES 50,000 - 100,000',
    'over_100k': 'Over KES 100,000'
  }
  return budgetMap?.[budget] || budget
}

const useTemplate = (template) => {
  responseData.value.message = template.message
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  responseData.value = {
    message: '',
    amount: '',
    duration: '',
    availability: [],
    notes: '',
    contactPreference: 'phone'
  }
}

const saveAsDraft = () => {
  // Save to local storage or send to API
  console.log('Saving draft:', responseData.value)
  alert('Draft saved successfully!')
}

const submitResponse = () => {
  if (!canSubmit.value) return
  
  emit('submit', {
    ...responseData.value,
    quoteId: props.quote?.id,
    submittedAt: new Date().toISOString()
  })
  
  resetForm()
}

const openPhotoViewer = (index) => {
  // Open photo viewer modal
  console.log('Open photo viewer at index:', index)
}

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})
</script>

<style scoped>
/* Custom styles */
.resize-none {
  resize: none;
}

/* Radio and checkbox styling */
input[type="radio"], input[type="checkbox"] {
  accent-color: #2563eb;
}
</style>