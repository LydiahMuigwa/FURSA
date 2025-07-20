<!-- ContactSuccessModal.vue - Enhanced success confirmation after quote submission -->
<template>
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white rounded-xl max-w-lg w-full">
      <!-- Success Animation -->
      <div class="text-center p-8">
        <!-- Animated Success Icon -->
        <div class="relative w-20 h-20 mx-auto mb-6">
          <div class="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center animate-bounce-in">
            <Check class="w-10 h-10 text-white animate-checkmark" />
          </div>
          <!-- Celebration particles -->
          <div class="absolute -top-2 -left-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping-delayed-1"></div>
          <div class="absolute -top-1 -right-3 w-2 h-2 bg-blue-400 rounded-full animate-ping-delayed-2"></div>
          <div class="absolute -bottom-1 -left-3 w-2 h-2 bg-pink-400 rounded-full animate-ping-delayed-3"></div>
          <div class="absolute -bottom-2 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-ping-delayed-4"></div>
        </div>
        
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Quote Request Sent! 🎉</h3>
        <p class="text-gray-600 mb-6 text-lg">
          Your request has been sent to <strong class="text-emerald-600">{{ providerName }}</strong>.
        </p>

        <!-- Reference Number Badge -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-center text-blue-700">
            <FileText class="w-4 h-4 mr-2" />
            <span class="text-sm font-medium">Reference #{{ referenceNumber }}</span>
          </div>
          <p class="text-xs text-blue-600 mt-1">Save this number for tracking</p>
        </div>

        <!-- Response Timeline -->
        <div class="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-6 mb-6 text-left">
          <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
            <Clock class="w-5 h-5 mr-2 text-blue-600" />
            What happens next?
          </h4>
          
          <div class="space-y-4">
            <!-- Step 1 -->
            <div class="flex items-start">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span class="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <p class="font-medium text-gray-800">{{ providerName }} receives your request</p>
                <p class="text-sm text-gray-600">They'll review your photos and requirements</p>
              </div>
            </div>
            
            <!-- Step 2 -->
            <div class="flex items-start">
              <div class="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span class="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <p class="font-medium text-gray-800">You'll get a detailed quote</p>
                <p class="text-sm text-gray-600">
                  Typically within <strong>{{ responseTime }}</strong> via {{ contactMethodDisplay }}
                </p>
              </div>
            </div>
            
            <!-- Step 3 -->
            <div class="flex items-start">
              <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span class="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <p class="font-medium text-gray-800">Schedule your service</p>
                <p class="text-sm text-gray-600">Discuss details and book a convenient time</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Contact Actions -->
        <div class="space-y-3 mb-6">
          <p class="text-sm text-gray-600 font-medium">Want to follow up right away?</p>
          
          <div class="grid grid-cols-2 gap-3">
            <button @click="callProvider" 
                    class="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group transform hover:scale-105">
              <Phone class="w-4 h-4 mr-2 group-hover:animate-bounce" />
              Call Now
            </button>
            <button @click="whatsappProvider" 
                    class="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group transform hover:scale-105">
              <MessageCircle class="w-4 h-4 mr-2 group-hover:animate-bounce" />
              WhatsApp
            </button>
          </div>
        </div>

        <!-- Additional Actions -->
        <div class="space-y-3">
          <button @click="browseMore" 
                  class="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center">
            <Search class="w-4 h-4 mr-2" />
            Browse More Providers
          </button>
          
          <button @click="closeModal" 
                  class="w-full text-gray-500 hover:text-gray-700 transition-colors py-2">
            Done
          </button>
        </div>

        <!-- Trust & Support -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-center text-sm text-gray-500 mb-3">
            <Shield class="w-4 h-4 mr-2" />
            <span>Protected by FURSA guarantee</span>
          </div>
          <p class="text-xs text-gray-400">
            Need help? Contact FURSA support anytime
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, Clock, Phone, MessageCircle, FileText, Search, Shield } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  providerName: {
    type: String,
    required: true
  },
  responseTime: {
    type: String,
    default: '2 hours'
  },
  contactMethod: {
    type: String,
    default: 'phone'
  },
  providerContact: {
    type: Object,
    required: true
  },
  referenceNumber: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])
const router = useRouter()

const contactMethodDisplay = computed(() => {
  const methods = {
    phone: 'phone call',
    whatsapp: 'WhatsApp',
    email: 'email'
  }
  return methods[props.contactMethod] || 'your preferred method'
})

const closeModal = () => {
  emit('close')
}

const callProvider = () => {
  window.location.href = `tel:${props.providerContact.phone}`
  closeModal()
}

const whatsappProvider = () => {
  const message = encodeURIComponent(`Hi ${props.providerName}! I just sent a quote request through FURSA (Ref: #${props.referenceNumber}). Looking forward to hearing from you! 😊`)
  window.open(`https://wa.me/${props.providerContact.whatsapp.replace('+', '')}?text=${message}`, '_blank')
  closeModal()
}

const browseMore = () => {
  closeModal()
  router.push('/app/services')
}
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
</style>