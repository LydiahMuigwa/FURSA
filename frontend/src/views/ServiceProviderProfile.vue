<!-- ServiceProviderProfile.vue - Updated with enhanced quote system -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <section class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Provider Info -->
          <div class="flex-1">
            <div class="flex items-start gap-6 mb-6">
              <!-- Profile Image -->
              <div class="relative">
                <div class="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User v-if="!provider.profileImage" class="w-12 h-12 text-white" />
                  <img v-else :src="provider.profileImage" :alt="provider.name" class="w-full h-full object-cover" />
                </div>
                <!-- Verification Badge -->
                <div v-if="provider.verified" class="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5">
                  <Check class="w-3 h-3" />
                </div>
                <!-- Online Status -->
                <div :class="[
                  'absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white',
                  provider.isOnline ? 'bg-emerald-500' : 'bg-gray-400'
                ]"></div>
              </div>

              <!-- Basic Info -->
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ provider.name }}</h1>
                <p class="text-xl text-blue-600 font-medium mb-3">{{ provider.serviceType }}</p>
                
                <!-- Location & Availability -->
                <div class="flex flex-wrap items-center gap-4 mb-4">
                  <div class="flex items-center text-gray-600">
                    <MapPin class="w-4 h-4 mr-2" />
                    <span>{{ provider.location }} ({{ provider.serviceRadius }}km radius)</span>
                  </div>
                  <div class="flex items-center">
                    <div :class="[
                      'w-2 h-2 rounded-full mr-2',
                      provider.availability.status === 'available' ? 'bg-emerald-500' : 
                      provider.availability.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                    ]"></div>
                    <span :class="[
                      'text-sm font-medium',
                      provider.availability.status === 'available' ? 'text-emerald-600' : 
                      provider.availability.status === 'busy' ? 'text-yellow-600' : 'text-red-600'
                    ]">
                      {{ provider.availability.message }}
                    </span>
                  </div>
                </div>

                <!-- Rating & Stats -->
                <div class="flex items-center gap-6 mb-4">
                  <div class="flex items-center">
                    <div class="flex mr-2">
                      <Star v-for="i in 5" :key="i" 
                           :class="i <= Math.floor(provider.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                           class="w-5 h-5" />
                    </div>
                    <span class="text-lg font-semibold">{{ provider.rating }}</span>
                    <span class="text-gray-600 ml-1">({{ provider.reviewCount }} reviews)</span>
                  </div>
                  <div class="text-gray-600">
                    <span class="font-medium">{{ provider.completedJobs }}</span> jobs completed
                  </div>
                  <div class="text-gray-600">
                    <span class="font-medium">{{ provider.responseTime }}</span> avg response
                  </div>
                </div>

                <!-- Badges -->
                <div class="flex flex-wrap gap-2">
                  <span v-if="provider.verified" class="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ ID Verified
                  </span>
                  <span v-if="provider.backgroundCheck" class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Background Checked
                  </span>
                  <span v-if="provider.licensed" class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Licensed Professional
                  </span>
                  <span v-if="provider.insured" class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Insured
                  </span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">About</h3>
              <p class="text-gray-700 leading-relaxed">{{ provider.description }}</p>
            </div>

            <!-- Specialties -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="specialty in provider.specialties" :key="specialty"
                      class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {{ specialty }}
                </span>
              </div>
            </div>
          </div>

          <!-- Enhanced Contact Sidebar -->
          <div class="lg:w-80">
            <div class="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
              <h3 class="text-lg font-semibold mb-4">Get in Touch</h3>
              
              <!-- Enhanced Contact Options -->
              <div class="space-y-3 mb-6">
                <!-- Primary CTA - Request Quote -->
                <button 
                  @click="openQuoteModal"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  <FileText class="w-4 h-4 mr-2" />
                  Request Detailed Quote
                </button>
                
                <!-- Quick Contact Options -->
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    @click="callProvider"
                    class="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Phone class="w-4 h-4 mr-2" />
                    Call
                  </button>
                  <button 
                    @click="whatsappProvider"
                    class="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <MessageCircle class="w-4 h-4 mr-2" />
                    WhatsApp
                  </button>
                </div>
              </div>

              <!-- Response Time -->
              <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Response Time</span>
                  <Clock class="w-4 h-4 text-gray-500" />
                </div>
                <p class="text-lg font-semibold text-gray-900">{{ provider.responseTime }}</p>
                <p class="text-sm text-gray-600">Usually responds within this time</p>
              </div>

              <!-- Trust Indicators -->
              <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Identity verified</span>
                  <Check class="w-4 h-4 text-emerald-500" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Background checked</span>
                  <Check class="w-4 h-4 text-emerald-500" />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Payment protected</span>
                  <Shield class="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-600">
                  <div class="flex items-center mb-2">
                    <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span>Last active: {{ getLastActiveTime() }}</span>
                  </div>
                  <div class="flex items-center">
                    <Star class="w-3 h-3 text-yellow-400 mr-2" />
                    <span>{{ getRecentReviews() }} recent reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services & Pricing -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Services & Pricing</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="service in provider.services" :key="service.name"
               class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">{{ service.name }}</h3>
                <p class="text-sm text-gray-600">{{ service.description }}</p>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900">{{ service.priceRange }}</div>
                <div class="text-sm text-gray-500">{{ service.unit }}</div>
              </div>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Duration: {{ service.duration }}</span>
              <button @click="openQuoteModal" class="text-blue-600 hover:text-blue-700 font-medium">
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Work Gallery -->
    <section class="py-8 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Recent Work</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="work in provider.workGallery" :key="work.id"
               @click="openWorkModal(work)"
               class="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
            <img v-if="work.image" :src="work.image" :alt="work.title" 
                 class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Image class="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <div class="text-right">
            <div class="text-3xl font-bold text-gray-900">{{ provider.rating }}</div>
            <div class="text-sm text-gray-600">{{ provider.reviewCount }} reviews</div>
          </div>
        </div>

        <!-- Review Summary -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div v-for="(count, stars) in provider.ratingBreakdown" :key="stars"
                 class="flex items-center">
              <span class="text-sm font-medium w-8">{{ stars }}★</span>
              <div class="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                <div class="bg-yellow-400 h-2 rounded-full" 
                     :style="{ width: `${(count / provider.reviewCount) * 100}%` }"></div>
              </div>
              <span class="text-sm text-gray-600 w-8">{{ count }}</span>
            </div>
          </div>
        </div>

        <!-- Individual Reviews -->
        <div class="space-y-6">
          <div v-for="review in provider.recentReviews" :key="review.id"
               class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
                  <User class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">{{ review.customerName }}</h4>
                  <div class="flex items-center">
                    <div class="flex mr-2">
                      <Star v-for="i in review.rating" :key="i" class="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <span class="text-sm text-gray-600">{{ review.serviceType }}</span>
                  </div>
                </div>
              </div>
              <span class="text-sm text-gray-500">{{ review.date }}</span>
            </div>
            <p class="text-gray-700 leading-relaxed">{{ review.comment }}</p>
            <div v-if="review.images" class="flex gap-2 mt-4">
              <img v-for="image in review.images" :key="image" 
                   :src="image" class="w-16 h-16 rounded-lg object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Quote Request Modal -->
    <QuoteRequestModal 
      :is-open="showQuoteModal" 
      :provider="provider"
      @close="showQuoteModal = false"
      @submit="handleQuoteSubmit"
    />

    <!-- Contact Success Modal -->
    <ContactSuccessModal 
      :is-open="showSuccessModal"
      :provider-name="provider.name"
      :response-time="provider.responseTime"
      :contact-method="lastContactMethod"
      :provider-contact="provider.contact"
      :reference-number="quoteReferenceNumber"
      @close="showSuccessModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  User, Check, MapPin, Star, Phone, MessageCircle, FileText, Clock, 
  Shield, Image 
} from 'lucide-vue-next'
import QuoteRequestModal from '@/components/service-provider/forms/QuoteRequestModal.vue'
import ContactSuccessModal from '@/components/service-provider/ContactSuccessModal.vue'

const route = useRoute()

// Component state
const showQuoteModal = ref(false)
const showSuccessModal = ref(false)
const lastContactMethod = ref('phone')
const quoteReferenceNumber = ref('')

// Sample provider data (replace with API call)
const provider = ref({
  id: route.params.id,
  name: 'John Mwangi',
  serviceType: 'Licensed Electrician',
  location: 'Westlands, Nairobi',
  serviceRadius: 15,
  profileImage: null,
  verified: true,
  backgroundCheck: true,
  licensed: true,
  insured: true,
  isOnline: true,
  rating: 4.8,
  reviewCount: 47,
  completedJobs: 156,
  responseTime: '2 hours',
  availability: {
    status: 'available',
    message: 'Available today'
  },
  description: 'Professional electrician with 10+ years of experience in residential and commercial electrical work. Specializing in solar installations, home wiring, and emergency repairs. Licensed, insured, and committed to safety and quality.',
  specialties: ['Home Wiring', 'Solar Installation', 'Emergency Repairs', 'Commercial Work', 'LED Lighting'],
  services: [
    {
      name: 'Home Wiring',
      description: 'Complete home electrical wiring and rewiring',
      priceRange: 'KES 5,000 - 25,000',
      unit: 'per room',
      duration: '1-3 days'
    },
    {
      name: 'Solar Installation',
      description: 'Solar panel system design and installation',
      priceRange: 'KES 80,000 - 300,000',
      unit: 'complete system',
      duration: '2-5 days'
    },
    {
      name: 'Emergency Repairs',
      description: '24/7 emergency electrical repairs',
      priceRange: 'KES 2,000 - 8,000',
      unit: 'per visit',
      duration: '2-4 hours'
    }
  ],
  workGallery: [
    { id: 1, title: 'Solar Installation', image: null },
    { id: 2, title: 'Kitchen Wiring', image: null },
    { id: 3, title: 'LED Lighting', image: null },
    { id: 4, title: 'Panel Upgrade', image: null }
  ],
  ratingBreakdown: {
    5: 35,
    4: 8,
    3: 3,
    2: 1,
    1: 0
  },
  recentReviews: [
    {
      id: 1,
      customerName: 'Sarah K.',
      rating: 5,
      serviceType: 'Home Wiring',
      date: '2 weeks ago',
      comment: 'Excellent work! John was professional, punctual, and completed the job efficiently. Very knowledgeable and explained everything clearly.',
      images: null
    },
    {
      id: 2,
      customerName: 'Michael O.',
      rating: 5,
      serviceType: 'Solar Installation',
      date: '1 month ago',
      comment: 'Amazing solar installation. The system is working perfectly and John provided great after-sales support. Highly recommended!',
      images: null
    }
  ],
  contact: {
    phone: '+254712345678',
    whatsapp: '+254712345678',
    email: 'john.mwangi@example.com'
  }
})

// Computed properties
const getLastActiveTime = () => {
  return provider.value.isOnline ? 'Online now' : '2 hours ago'
}

const getRecentReviews = () => {
  const recentCount = provider.value.recentReviews.filter(review => 
    review.date.includes('week') || review.date.includes('day')
  ).length
  return recentCount
}

// Methods
const openQuoteModal = () => {
  showQuoteModal.value = true
}

const callProvider = () => {
  window.location.href = `tel:${provider.value.contact.phone}`
  lastContactMethod.value = 'phone'
}

const whatsappProvider = () => {
  const message = encodeURIComponent(`Hi ${provider.value.name}, I found you on FURSA and would like to discuss a ${provider.value.serviceType} project.`)
  window.open(`https://wa.me/${provider.value.contact.whatsapp.replace('+', '')}?text=${message}`, '_blank')
  lastContactMethod.value = 'whatsapp'
}

const openWorkModal = (work) => {
  console.log('Opening work modal for:', work.title)
}

const handleQuoteSubmit = async (quoteRequest) => {
  try {
    // Generate reference number
    quoteReferenceNumber.value = 'QR' + Date.now().toString().slice(-6)
    
    // Store the contact method preference
    lastContactMethod.value = quoteRequest.contactPreference
    
    // Here you would send to your backend API
    console.log('Quote request submitted:', {
      ...quoteRequest,
      referenceNumber: quoteReferenceNumber.value
    })
    
    // For now, just show success modal
    showSuccessModal.value = true
    
    // You could also send email notifications here
    await sendQuoteNotification(quoteRequest)
    
  } catch (error) {
    console.error('Error processing quote request:', error)
    alert('There was an error processing your request. Please try again.')
  }
}

const sendQuoteNotification = async (quoteRequest) => {
  // This would integrate with your email service
  // For now, just log what would be sent
  console.log('Would send email notification:', {
    to: provider.value.contact.email,
    subject: `New Quote Request from ${quoteRequest.customerName}`,
    template: 'quote-request',
    data: {
      providerName: provider.value.name,
      customerName: quoteRequest.customerName,
      serviceType: quoteRequest.serviceType,
      description: quoteRequest.description,
      location: quoteRequest.location,
      timeline: quoteRequest.timeline,
      budget: quoteRequest.budget,
      contactInfo: {
        phone: quoteRequest.phone,
        email: quoteRequest.email,
        preference: quoteRequest.contactPreference
      },
      referenceNumber: quoteReferenceNumber.value
    }
  })
}

onMounted(() => {
  // Load provider data based on route.params.id
  console.log('Loading service provider:', route.params.id)
})
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>