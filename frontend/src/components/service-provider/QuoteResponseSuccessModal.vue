<!-- QuoteResponseSuccessModal.vue - Professional success modal for provider dashboard -->
<template>
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white rounded-xl max-w-md w-full max-h-[85vh] overflow-y-auto">
      <!-- Success Animation -->
      <div class="text-center p-6">
        <!-- Animated Success Icon -->
        <div class="relative w-16 h-16 mx-auto mb-4">
          <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center animate-bounce-in">
            <Check class="w-8 h-8 text-white animate-checkmark" />
          </div>
          <!-- Celebration particles -->
          <div class="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping-delayed-1"></div>
          <div class="absolute -top-1 -right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping-delayed-2"></div>
          <div class="absolute -bottom-1 -left-2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping-delayed-3"></div>
          <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping-delayed-4"></div>
        </div>
        
        <h3 class="text-xl font-bold text-gray-900 mb-2">Quote Response Sent! 🎉</h3>
        <p class="text-gray-600 mb-4 text-base">
          Your professional quote has been sent to <strong class="text-emerald-600">{{ customerName }}</strong>.
        </p>

        <!-- Quote Summary Badge -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div class="flex items-center justify-center text-blue-700">
            <DollarSign class="w-4 h-4 mr-2" />
            <span class="text-lg font-bold">KES {{ formatAmount(quoteAmount) }}</span>
          </div>
          <p class="text-xs text-blue-600 mt-1">Quote Amount</p>
        </div>

        <!-- What Happens Next -->
        <div class="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-4 mb-4 text-left">
          <h4 class="font-semibold text-gray-800 mb-3 flex items-center text-sm">
            <Clock class="w-4 h-4 mr-2 text-blue-600" />
            What happens next?
          </h4>
          
          <div class="space-y-3">
            <!-- Step 1 -->
            <div class="flex items-start">
              <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <p class="font-medium text-gray-800 text-sm">Customer receives your quote</p>
                <p class="text-xs text-gray-600">Via {{ contactMethod }} with all details included</p>
              </div>
            </div>
            
            <!-- Step 2 -->
            <div class="flex items-start">
              <div class="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <p class="font-medium text-gray-800 text-sm">They'll contact you to discuss</p>
                <p class="text-xs text-gray-600">
                  <span class="text-emerald-600 font-medium">{{ customerName }}</span> will reach out to finalize details
                </p>
              </div>
            </div>
            
            <!-- Step 3 -->
            <div class="flex items-start">
              <div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span class="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <p class="font-medium text-gray-800 text-sm">Schedule and complete the work</p>
                <p class="text-xs text-gray-600">Get paid and earn a 5-star review!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Boost -->
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div class="flex items-center justify-center mb-1">
            <Star class="w-4 h-4 text-yellow-500 mr-2" />
            <span class="font-semibold text-gray-800 text-sm">Performance Boost!</span>
          </div>
          <p class="text-xs text-gray-700">
            Quick responses like yours help maintain your <strong class="text-yellow-600">4.8-star rating</strong> 
            and improve your visibility to new customers.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 mb-4">
          <button @click="viewResponded" 
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-sm">
            View All Responded Quotes
          </button>
          
          <button @click="closeModal" 
                  class="w-full border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
            Continue Working
          </button>
        </div>

        <!-- Quick Stats -->
        <div class="pt-4 border-t border-gray-200">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-lg font-bold text-blue-600">{{ totalQuotes }}</div>
              <div class="text-xs text-gray-500">Total Quotes</div>
            </div>
            <div>
              <div class="text-lg font-bold text-emerald-600">{{ responseRate }}%</div>
              <div class="text-xs text-gray-500">Response Rate</div>
            </div>
            <div>
              <div class="text-lg font-bold text-purple-600">{{ avgResponseTime }}</div>
              <div class="text-xs text-gray-500">Avg Response</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, DollarSign, Clock, Star } from 'lucide-vue-next'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  customerName: {
    type: String,
    default: 'Customer'
  },
  quoteAmount: {
    type: [String, Number],
    default: 0
  },
  contactMethod: {
    type: String,
    default: 'email'
  },
  totalQuotes: {
    type: Number,
    default: 24
  },
  responseRate: {
    type: Number,
    default: 95
  },
  avgResponseTime: {
    type: String,
    default: '2.3h'
  }
})

// Emits
const emit = defineEmits(['close', 'view-responded'])

// Methods
const formatAmount = (amount) => {
  if (typeof amount === 'string') {
    return amount.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const closeModal = () => {
  emit('close')
}

const viewResponded = () => {
  emit('view-responded')
  closeModal()
}

// Computed
const contactMethodDisplay = computed(() => {
  const methods = {
    phone: 'phone call',
    whatsapp: 'WhatsApp',
    email: 'email'
  }
  return methods[props.contactMethod] || props.contactMethod
})
</script>

<style scoped>
/* Custom animations */
@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(45deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes ping-delayed-1 {
  0%, 20% {
    transform: scale(0);
    opacity: 1;
  }
  40%, 100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes ping-delayed-2 {
  0%, 40% {
    transform: scale(0);
    opacity: 1;
  }
  60%, 100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes ping-delayed-3 {
  0%, 60% {
    transform: scale(0);
    opacity: 1;
  }
  80%, 100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes ping-delayed-4 {
  0%, 80% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out;
}

.animate-checkmark {
  animation: checkmark 0.8s ease-out 0.2s both;
}

.animate-ping-delayed-1 {
  animation: ping-delayed-1 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-ping-delayed-2 {
  animation: ping-delayed-2 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-ping-delayed-3 {
  animation: ping-delayed-3 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-ping-delayed-4 {
  animation: ping-delayed-4 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}
</style>