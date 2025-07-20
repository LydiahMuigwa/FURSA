<!-- ContactSuccessModal.vue - Success confirmation after quote submission -->
<template>
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white rounded-xl max-w-md w-full">
      <!-- Success Animation -->
      <div class="text-center p-8">
        <div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Check class="w-8 h-8 text-white" />
        </div>
        
        <h3 class="text-xl font-bold text-gray-900 mb-2">Quote Request Sent!</h3>
        <p class="text-gray-600 mb-6">
          Your quote request has been sent to <strong>{{ providerName }}</strong>. 
          They typically respond within {{ responseTime }}.
        </p>

        <!-- What Happens Next -->
        <div class="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h4 class="font-medium text-blue-900 mb-3 flex items-center">
            <Clock class="w-4 h-4 mr-2" />
            What happens next?
          </h4>
          <ul class="space-y-2 text-sm text-blue-800">
            <li class="flex items-start">
              <span class="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              <span>{{ providerName }} will review your request and respond via {{ contactMethod }}</span>
            </li>
            <li class="flex items-start">
              <span class="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              <span>They'll provide a detailed quote with pricing and timeline</span>
            </li>
            <li class="flex items-start">
              <span class="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              <span>You can discuss details and schedule the service directly</span>
            </li>
          </ul>
        </div>

        <!-- Quick Actions -->
        <div class="space-y-3">
          <div class="flex gap-3">
            <button @click="callProvider" 
                    class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
              <Phone class="w-4 h-4 mr-2" />
              Call Now
            </button>
            <button @click="whatsappProvider" 
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
              <MessageCircle class="w-4 h-4 mr-2" />
              WhatsApp
            </button>
          </div>
          
          <button @click="browseMore" 
                  class="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Browse More Providers
          </button>
          
          <button @click="closeModal" 
                  class="w-full text-gray-500 hover:text-gray-700 transition-colors">
            Close
          </button>
        </div>

        <!-- Reference Number -->
        <div class="mt-6 pt-4 border-t border-gray-200">
          <p class="text-xs text-gray-500">
            Reference: #{{ referenceNumber }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, Clock, Phone, MessageCircle } from 'lucide-vue-next'
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

const contactMethod = computed(() => {
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
  const message = encodeURIComponent(`Hi ${props.providerName}, I just sent a quote request through FURSA (Ref: #${props.referenceNumber}). Looking forward to hearing from you!`)
  window.open(`https://wa.me/${props.providerContact.whatsapp.replace('+', '')}?text=${message}`, '_blank')
  closeModal()
}

const browseMore = () => {
  closeModal()
  router.push('/app/services')
}
</script>

<style scoped>
/* Success animation */
@keyframes checkmark {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-pulse {
  animation: checkmark 0.6s ease-out;
}
</style>