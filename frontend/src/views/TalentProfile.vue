<!-- TalentProfile.vue - Desktop-first professional talent showcase -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          <!-- Profile Image & Basic Info -->
          <div class="flex-shrink-0 text-center lg:text-left">
            <div class="relative inline-block mb-6">
              <div class="w-32 h-32 rounded-full mx-auto lg:mx-0 flex items-center justify-center"
                   :class="getProfileGradient(talent.id)">
                <User class="w-16 h-16 text-white" />
              </div>
              <!-- Verification Badge -->
              <div v-if="talent.verified" class="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-2">
                <Check class="w-4 h-4" />
              </div>
              <!-- Featured Badge -->
              <div v-if="talent.featured" class="absolute -top-2 -left-2 bg-orange-500 text-white rounded-full p-2">
                <Crown class="w-4 h-4" />
              </div>
            </div>
            
            <!-- Voice Introduction -->
            <div class="bg-blue-50 rounded-xl p-4 mb-6 max-w-sm mx-auto lg:mx-0">
              <div class="flex items-center justify-center mb-3">
                <Mic class="w-5 h-5 text-blue-600 mr-2" />
                <span class="font-medium text-blue-900">Voice Introduction</span>
              </div>
              <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                <Play class="w-4 h-4 mr-2" />
                Listen (Kiswahili)
              </button>
              <p class="text-xs text-blue-700 mt-2 text-center">30-second introduction</p>
            </div>
          </div>

          <!-- Main Info -->
          <div class="flex-1 min-w-0">
            <!-- Name & Title -->
            <div class="mb-6">
              <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ talent.name }}</h1>
              <p class="text-xl text-gray-600 mb-4">{{ talent.skill }}</p>
              <div class="flex items-center text-gray-500 mb-4">
                <MapPin class="w-5 h-5 mr-2" />
                <span class="text-lg">{{ talent.location }}</span>
              </div>
              
              <!-- Status & Badges -->
              <div class="flex flex-wrap gap-3 mb-6">
                <span v-if="talent.verified" class="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                  <Check class="w-4 h-4 mr-1" />
                  Verified Artist
                </span>
                <span v-if="talent.featured" class="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                  <Crown class="w-4 h-4 mr-1" />
                  Featured Talent
                </span>
                <span class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  <Globe class="w-4 h-4 mr-1" />
                  Global Shipping
                </span>
              </div>

              <!-- Rating & Stats -->
              <div class="flex items-center gap-6 mb-6">
                <div class="flex items-center">
                  <div class="flex mr-2">
                    <Star v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                  <span class="text-xl font-semibold text-gray-900">{{ talent.rating }}</span>
                  <span class="text-gray-600 ml-2">({{ talent.reviewCount }} reviews)</span>
                </div>
                <div class="text-gray-600">
                  <span class="font-medium">{{ talent.completedProjects || 42 }}</span> projects completed
                </div>
                <div class="text-gray-600">
                  <span class="font-medium">{{ talent.responseTime || '2 hours' }}</span> avg response
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">About</h3>
              <p class="text-gray-700 text-lg leading-relaxed">
                {{ talent.description }}
              </p>
            </div>

            <!-- Skills & Tags -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in talent.tags || ['Traditional Techniques', 'Custom Design', 'Jewelry Making', 'Cultural Heritage']" 
                  :key="tag"
                  class="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Contact Sidebar -->
          <div class="w-full lg:w-80 flex-shrink-0">
            <div class="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
              
              <!-- Contact Info -->
              <div class="space-y-4 mb-6">
                <div class="flex items-center">
                  <Phone class="w-5 h-5 text-gray-400 mr-3" />
                  <span class="text-gray-700">{{ talent.phone }}</span>
                </div>
                <div class="flex items-center">
                  <Mail class="w-5 h-5 text-gray-400 mr-3" />
                  <span class="text-gray-700">{{ talent.email }}</span>
                </div>
                <div class="flex items-center">
                  <Clock class="w-5 h-5 text-gray-400 mr-3" />
                  <span class="text-gray-700">Usually responds in {{ talent.responseTime || '2 hours' }}</span>
                </div>
              </div>

              <!-- Contact Actions -->
              <div class="space-y-3">
                <button 
                  @click="contactArtist"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <MessageCircle class="w-4 h-4 mr-2" />
                  Send Message
                </button>
                <button 
                  @click="requestQuote"
                  class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Calculator class="w-4 h-4 mr-2" />
                  Request Quote
                </button>
                <button 
                  @click="shareProfile"
                  class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Share2 class="w-4 h-4 mr-2" />
                  Share Profile
                </button>
              </div>

              <!-- Trust Indicators -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <div class="flex items-center justify-between text-sm text-gray-600">
                  <span>Identity verified</span>
                  <Check class="w-4 h-4 text-green-500" />
                </div>
                <div class="flex items-center justify-between text-sm text-gray-600 mt-2">
                  <span>Background checked</span>
                  <Check class="w-4 h-4 text-green-500" />
                </div>
                <div class="flex items-center justify-between text-sm text-gray-600 mt-2">
                  <span>Payment protected</span>
                  <Shield class="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Portfolio Section -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Portfolio</h2>
          <div class="flex items-center gap-4">
            <div class="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                @click="portfolioView = 'grid'"
                :class="[
                  'p-2 rounded-md transition-colors',
                  portfolioView === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                ]"
              >
                <Grid3X3 class="w-4 h-4" />
              </button>
              <button
                @click="portfolioView = 'masonry'"
                :class="[
                  'p-2 rounded-md transition-colors',
                  portfolioView === 'masonry' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                ]"
              >
                <Layout class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Portfolio Grid -->
        <div v-if="portfolioView === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="work in talent.portfolio"
            :key="work.id"
            @click="openLightbox(work)"
            class="portfolio-item group cursor-pointer"
          >
            <div class="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
              <div class="w-full h-full flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform duration-300">
                <div class="text-center">
                  <Image class="w-12 h-12 mx-auto mb-2 opacity-60" />
                  <p class="text-sm font-medium">{{ work.title }}</p>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <h4 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{{ work.title }}</h4>
              <p class="text-sm text-gray-600">{{ work.description || 'Handcrafted with traditional techniques' }}</p>
            </div>
          </div>
        </div>

        <!-- Masonry View -->
        <div v-else class="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
          <div
            v-for="(work, index) in talent.portfolio"
            :key="work.id"
            @click="openLightbox(work)"
            class="portfolio-item break-inside-avoid mb-6 group cursor-pointer"
          >
            <div 
              :class="[
                'bg-gradient-to-br rounded-xl overflow-hidden',
                getPortfolioHeight(index),
                getPortfolioGradient(index)
              ]"
            >
              <div class="w-full h-full flex items-center justify-center text-white p-8 group-hover:scale-105 transition-transform duration-300">
                <div class="text-center">
                  <Image class="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p class="text-lg font-semibold">{{ work.title }}</p>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <h4 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{{ work.title }}</h4>
              <p class="text-sm text-gray-600">{{ work.description || 'Handcrafted with traditional techniques' }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews Section -->
    <section class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Client Reviews</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="review in talent.reviews || sampleReviews"
            :key="review.id"
            class="bg-gray-50 rounded-xl p-6"
          >
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
                <User class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 class="font-medium text-gray-900">{{ review.name }}</h4>
                <div class="flex">
                  <Star v-for="i in review.rating" :key="i" class="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>
            </div>
            <p class="text-gray-700 text-sm leading-relaxed">{{ review.comment }}</p>
            <p class="text-xs text-gray-500 mt-3">{{ review.date }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Similar Talent Section -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Similar Talent</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="similarTalent in similarTalents"
            :key="similarTalent.id"
            @click="viewSimilarProfile(similarTalent.id)"
            class="bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 group"
          >
            <div class="text-center">
              <div class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                   :class="getProfileGradient(similarTalent.id)">
                <User class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{{ similarTalent.name }}</h3>
              <p class="text-gray-600 text-sm mb-2">{{ similarTalent.skill }}</p>
              <p class="text-gray-500 text-xs mb-3">{{ similarTalent.location }}</p>
              <div class="flex justify-center items-center">
                <Star class="w-4 h-4 text-yellow-400 fill-current" />
                <span class="text-sm ml-1 font-medium">{{ similarTalent.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    <div v-if="lightboxOpen" @click="closeLightbox" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div @click.stop class="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">{{ selectedWork?.title }}</h3>
            <button @click="closeLightbox" class="p-2 hover:bg-gray-100 rounded-lg">
              <X class="w-5 h-5" />
            </button>
          </div>
          <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
            <div class="text-center text-gray-500">
              <Image class="w-24 h-24 mx-auto mb-4 opacity-60" />
              <p class="text-lg">{{ selectedWork?.title }}</p>
              <p class="text-sm">High-quality image would be displayed here</p>
            </div>
          </div>
          <p class="text-gray-700">{{ selectedWork?.description || 'Beautiful handcrafted piece showcasing traditional African artistry.' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, MoreHorizontal, User, Star, Phone, Mail, Globe, Check, Crown, 
  MapPin, Mic, Play, MessageCircle, Calculator, Share2, Shield, Clock,
  Grid3X3, Layout, Image, X
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const portfolioView = ref('grid')
const lightboxOpen = ref(false)
const selectedWork = ref(null)

const talent = ref({
  id: 1,
  name: 'Lydian Kamau',
  skill: 'Beadwork Artist',
  location: 'Nairobi, Kenya',
  rating: 4.8,
  reviewCount: 17,
  verified: true,
  featured: true,
  responseTime: '2 hours',
  completedProjects: 42,
  description: 'Handcrafted African beaded jewelry using traditional techniques passed down through generations. Specializing in custom designs for special occasions. Each piece tells a story of cultural heritage while embracing modern aesthetics.',
  phone: '+254 712 345 678',
  email: 'lydian.kamau@email.com',
  tags: ['Traditional Techniques', 'Custom Design', 'Jewelry Making', 'Cultural Heritage', 'Maasai Beadwork'],
  portfolio: [
    { id: 1, title: 'Traditional Necklace', description: 'Colorful beaded necklace with traditional Maasai patterns' },
    { id: 2, title: 'Maasai Bracelet', description: 'Handwoven bracelet using authentic techniques' },
    { id: 3, title: 'Modern Earrings', description: 'Contemporary design with traditional materials' },
    { id: 4, title: 'Wedding Set', description: 'Complete jewelry set for special occasions' },
    { id: 5, title: 'Custom Anklet', description: 'Personalized design with cultural significance' },
    { id: 6, title: 'Ceremonial Piece', description: 'Traditional piece for cultural ceremonies' }
  ]
})

const sampleReviews = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely beautiful work! The attention to detail is incredible and the cultural significance makes each piece special.',
    date: '2 weeks ago'
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 5,
    comment: 'Ordered a custom set for my wife. Lydian was professional, responsive, and the final product exceeded expectations.',
    date: '1 month ago'
  },
  {
    id: 3,
    name: 'Emma Williams',
    rating: 4,
    comment: 'Great quality and fast shipping. Love supporting authentic African artisans. Will definitely order again!',
    date: '2 months ago'
  }
])

const similarTalents = ref([
  { id: 2, name: 'Grace Wanjiku', skill: 'Textile Artist', location: 'Nairobi, Kenya', rating: 4.9 },
  { id: 3, name: 'Amina Hassan', skill: 'Jewelry Designer', location: 'Dar es Salaam, Tanzania', rating: 4.7 },
  { id: 4, name: 'Fatima Diallo', skill: 'Beadwork Specialist', location: 'Accra, Ghana', rating: 4.6 }
])

const getProfileGradient = (id) => {
  const gradients = [
    'bg-gradient-to-br from-orange-400 to-orange-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600',
    'bg-gradient-to-br from-emerald-400 to-emerald-600',
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-pink-400 to-pink-600'
  ]
  return gradients[(id - 1) % gradients.length]
}

const getPortfolioGradient = (index) => {
  const gradients = [
    'from-orange-400 to-red-500',
    'from-blue-400 to-purple-500', 
    'from-emerald-400 to-teal-500',
    'from-yellow-400 to-orange-500',
    'from-purple-400 to-pink-500',
    'from-teal-400 to-blue-500'
  ]
  return gradients[index % gradients.length]
}

const getPortfolioHeight = (index) => {
  const heights = ['h-48', 'h-64', 'h-56', 'h-72', 'h-60', 'h-52']
  return heights[index % heights.length]
}

const goBack = () => {
  router.go(-1)
}

const contactArtist = () => {
  // Implement contact functionality
  alert('Contact functionality to be implemented')
}

const requestQuote = () => {
  alert('Quote request functionality to be implemented')
}

const shareProfile = () => {
  if (navigator.share) {
    navigator.share({
      title: `${talent.value.name} - ${talent.value.skill}`,
      text: talent.value.description,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Profile link copied to clipboard!')
  }
}

const openLightbox = (work) => {
  selectedWork.value = work
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
  selectedWork.value = null
}

const viewSimilarProfile = (id) => {
  router.push(`/app/talent/${id}`)
}

onMounted(() => {
  // Load talent data based on route.params.id
  console.log('Loading talent profile for ID:', route.params.id)
  // In real app, fetch data from API based on route.params.id
})
</script>

<style scoped>
.portfolio-item {
  transition: all 0.3s ease;
}

.portfolio-item:hover {
  transform: translateY(-4px);
}

/* Masonry layout support */
.columns-1 { column-count: 1; }
.columns-2 { column-count: 2; }
.columns-3 { column-count: 3; }
.columns-4 { column-count: 4; }

@media (max-width: 768px) {
  .columns-2 { column-count: 1; }
  .columns-3 { column-count: 1; }
  .columns-4 { column-count: 1; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .columns-3 { column-count: 2; }
  .columns-4 { column-count: 2; }
}
</style>