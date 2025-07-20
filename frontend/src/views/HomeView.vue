<!-- HomeView.vue - Desktop-first app discovery page -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-orange-50 to-blue-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="flex items-center justify-center mb-6">
            <div class="cultural-pattern mr-4 cultural-fade">
              <div class="pattern-bar-1"></div>
              <div class="pattern-bar-2"></div>
              <div class="pattern-bar-3"></div>
              <div class="pattern-bar-4"></div>
            </div>
            <div class="text-left">
              <h1 class="text-3xl font-bold text-gray-900">Discover African Talent</h1>
              <p class="text-gray-600">Visual portfolios • Voice introductions • Direct connections</p>
            </div>
          </div>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto mb-8">
            <div class="relative">
              <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search for artists, skills, or locations..."
                class="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                @keydown.enter="performSearch"
              >
              <button 
                @click="performSearch"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
          
          <p class="text-gray-600 text-lg">
            Discover authentic African artisans, creatives, and skilled workers
          </p>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p class="text-gray-600 text-lg">Find the perfect talent for your needs</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="category in categories"
            :key="category.name"
            @click="selectCategory(category.name)"
            class="bg-white rounded-xl p-8 text-center cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 group"
            :class="getCategoryHoverColor(category.name)"
          >
            <div class="text-5xl mb-4 group-hover:scale-110 transition-transform">{{ category.icon }}</div>
            <h3 class="font-semibold text-xl text-gray-900 mb-2">{{ category.name }}</h3>
            <p class="text-gray-600 mb-3">{{ category.description }}</p>
            <div class="text-sm font-medium text-blue-600">{{ category.count }} talents</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Talent Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Featured Talent</h2>
            <p class="text-gray-600 text-lg">Verified artists making waves globally</p>
          </div>
          <button
            @click="viewAllTalent"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View All Talent →
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
            <div class="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div class="h-4 bg-gray-200 rounded mb-3"></div>
            <div class="h-3 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>

        <!-- Talent Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="talent in featuredTalent"
            :key="talent.id"
            @click="viewProfile(talent.id)"
            class="talent-card group"
          >
            <!-- Profile Image -->
            <div class="relative mb-4">
              <div class="w-20 h-20 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform"
                   :class="getProfileGradient(talent.id)">
                <User class="w-8 h-8 text-white" />
              </div>
              <div v-if="talent.verified" class="absolute top-0 right-1/4 bg-emerald-500 text-white rounded-full p-1.5">
                <Check class="w-3 h-3" />
              </div>
              <div v-if="talent.featured" class="absolute top-0 left-1/4 bg-orange-500 text-white rounded-full p-1.5">
                <Crown class="w-3 h-3" />
              </div>
            </div>
            
            <!-- Talent Info -->
            <div class="text-center">
              <h3 class="font-semibold text-lg text-gray-900 mb-1">{{ talent.name }}</h3>
              <p class="text-gray-600 mb-2">{{ talent.skill }}</p>
              <p class="text-sm text-gray-500 mb-3">{{ talent.location }}</p>
              
              <!-- Rating -->
              <div class="flex justify-center items-center mb-3">
                <div class="flex items-center">
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <span class="text-sm ml-1 font-medium">{{ talent.rating }}</span>
                  <span class="text-sm text-gray-500 ml-1">({{ talent.reviewCount }})</span>
                </div>
              </div>
              
              <!-- Tags -->
              <div v-if="talent.tags" class="flex flex-wrap justify-center gap-1 mb-4">
                <span 
                  v-for="tag in talent.tags.slice(0, 2)" 
                  :key="tag"
                  class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
              
              <!-- CTA Button -->
              <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cultural Heritage Section -->
    <section class="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="flex items-center justify-center mb-8">
          <div class="cultural-pattern-lg mr-6">
            <div class="pattern-bar-lg-1"></div>
            <div class="pattern-bar-lg-2"></div>
            <div class="pattern-bar-lg-3"></div>
            <div class="pattern-bar-lg-4"></div>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">🎨 Celebrating African Heritage</h2>
        </div>
        <p class="text-xl text-gray-700 mb-6 leading-relaxed">
          Our cultural pattern represents the <strong>rich layers of African creativity</strong> - from traditional heritage 
          to modern innovation. Each element symbolizes a different aspect of talent: 
          <span class="text-orange-600 font-medium">Heritage</span>, 
          <span class="text-yellow-600 font-medium">Craft</span>, 
          <span class="text-emerald-600 font-medium">Growth</span>, and 
          <span class="text-blue-600 font-medium">Global Reach</span>.
        </p>
        <p class="text-gray-600 text-lg">
          The flowing, overlapping design reflects traditional African textile patterns 
          while maintaining a modern, digital-friendly aesthetic that bridges cultures and continents.
        </p>
      </div>
    </section>

    <!-- Success Stories -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p class="text-gray-600 text-lg">Real impact, real connections</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp class="w-8 h-8" />
            </div>
            <div class="text-3xl font-bold mb-2">500+</div>
            <div class="text-blue-100 mb-4">Talents Connected</div>
            <p class="text-sm opacity-90">
              "FURSA helped me connect with customers in Germany. My beadwork business has grown 300%!"
            </p>
            <p class="text-xs mt-3 opacity-75">- Grace, Beadwork Artist</p>
          </div>
          
          <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-8 text-white text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe class="w-8 h-8" />
            </div>
            <div class="text-3xl font-bold mb-2">25+</div>
            <div class="text-emerald-100 mb-4">Countries Reached</div>
            <p class="text-sm opacity-90">
              "Found amazing furniture makers in Kenya. Quality exceeded expectations!"
            </p>
            <p class="text-xs mt-3 opacity-75">- Michael, Interior Designer</p>
          </div>
          
          <div class="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 text-white text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart class="w-8 h-8" />
            </div>
            <div class="text-3xl font-bold mb-2">$2M+</div>
            <div class="text-orange-100 mb-4">Earned by Talent</div>
            <p class="text-sm opacity-90">
              "FURSA opened doors I never knew existed. Now I export globally!"
            </p>
            <p class="text-xs mt-3 opacity-75">- Samuel, Wood Carver</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gray-900 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold mb-6">Ready to Discover Amazing Talent?</h2>
        <p class="text-xl mb-8 text-gray-300">
          Join thousands already connecting through authentic portfolios and direct relationships
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="goToUpload"
            class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
          >
            Create Your Portfolio - Free
          </button>
          <button
            @click="viewAllTalent"
            class="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Browse All Talent
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, Star, User, Check, Crown, TrendingUp, Globe, Heart } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useTalentStore } from '@/stores/talent'

const router = useRouter()
const talentStore = useTalentStore()

const loading = ref(false)
const searchQuery = ref('')

const categories = ref([
  { 
    name: 'Artisans', 
    icon: '🎨', 
    count: 150,
    description: 'Traditional crafts & handmade goods'
  },
  { 
    name: 'Creatives', 
    icon: '✨', 
    count: 89,
    description: 'Designers, artists & digital creators'
  },
  { 
    name: 'Skilled Trades', 
    icon: '🔧', 
    count: 203,
    description: 'Construction, repair & technical skills'
  },
  { 
    name: 'Students', 
    icon: '🎓', 
    count: 76,
    description: 'Emerging talent & fresh perspectives'
  }
])

const featuredTalent = ref([
  {
    id: 1,
    name: 'Lydian Kamau',
    skill: 'Beadwork Artist',
    location: 'Nairobi, Kenya',
    rating: 4.8,
    reviewCount: 17,
    verified: true,
    featured: true,
    tags: ['Jewelry', 'Traditional', 'Custom']
  },
  {
    id: 2,
    name: 'John Ochieng',
    skill: 'Wood Carver',
    location: 'Kisumu, Kenya',
    rating: 4.5,
    reviewCount: 12,
    verified: true,
    featured: false,
    tags: ['Sculpture', 'Furniture']
  },
  {
    id: 3,
    name: 'Sarah Nyong',
    skill: 'Fashion Designer',
    location: 'Lagos, Nigeria',
    rating: 4.6,
    reviewCount: 23,
    verified: true,
    featured: true,
    tags: ['Ankara', 'Modern']
  },
  {
    id: 4,
    name: 'Moses Kiptoo',
    skill: 'Carpenter',
    location: 'Eldoret, Kenya',
    rating: 4.7,
    reviewCount: 8,
    verified: false,
    featured: false,
    tags: ['Furniture', 'Custom']
  },
  {
    id: 5,
    name: 'Grace Wanjiku',
    skill: 'Photographer',
    location: 'Nairobi, Kenya',
    rating: 4.9,
    reviewCount: 31,
    verified: true,
    featured: true,
    tags: ['Portrait', 'Wedding']
  },
  {
    id: 6,
    name: 'Peter Ssebunya',
    skill: 'Web Developer',
    location: 'Kampala, Uganda',
    rating: 4.4,
    reviewCount: 6,
    verified: false,
    featured: false,
    tags: ['React', 'Node.js']
  },
  {
    id: 7,
    name: 'Amina Hassan',
    skill: 'Textile Artist',
    location: 'Dar es Salaam, Tanzania',
    rating: 4.7,
    reviewCount: 14,
    verified: true,
    featured: true,
    tags: ['Weaving', 'Traditional']
  },
  {
    id: 8,
    name: 'David Mugisha',
    skill: 'Metalworker',
    location: 'Kigali, Rwanda',
    rating: 4.6,
    reviewCount: 9,
    verified: true,
    featured: false,
    tags: ['Sculpture', 'Jewelry']
  }
])

const getCategoryHoverColor = (categoryName) => {
  const colors = {
    'Artisans': 'hover:border-orange-300 hover:bg-orange-50',
    'Creatives': 'hover:border-yellow-300 hover:bg-yellow-50',
    'Skilled Trades': 'hover:border-emerald-300 hover:bg-emerald-50',
    'Students': 'hover:border-blue-300 hover:bg-blue-50'
  }
  return colors[categoryName] || 'hover:border-gray-300'
}

const getProfileGradient = (id) => {
  const gradients = [
    'bg-gradient-to-br from-orange-400 to-orange-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600', 
    'bg-gradient-to-br from-emerald-400 to-emerald-600',
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
    'bg-gradient-to-br from-teal-400 to-teal-600'
  ]
  return gradients[(id - 1) % gradients.length]
}

const selectCategory = (category) => {
  router.push(`/app/search?category=${category}`)
}

const viewProfile = (id) => {
  router.push(`/app/talent/${id}`)
}

const viewAllTalent = () => {
  router.push('/app/search')
}

const goToUpload = () => {
  router.push('/app/upload')
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/app/search?q=${encodeURIComponent(searchQuery.value)}`)
  } else {
    router.push('/app/search')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    // Load featured talents from store
    await talentStore.fetchTalents({ featured: true })
    // You could replace featuredTalent.value with talentStore.featuredTalents
  } catch (error) {
    console.error('Error loading featured talents:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Cultural Pattern Styles */
.cultural-pattern {
  position: relative;
  width: 40px;
  height: 40px;
}

.cultural-pattern-lg {
  position: relative;
  width: 48px;
  height: 48px;
}

/* Standard Pattern Colors */
.pattern-bar-1 { 
  background: #ff6b35; 
  height: 8px; 
  border-radius: 4px; 
}

.pattern-bar-2 { 
  background: #f7931e; 
  height: 6px; 
  border-radius: 3px; 
  margin-top: 2px; 
  margin-left: 4px; 
}

.pattern-bar-3 { 
  background: #10b981; 
  height: 6px; 
  border-radius: 3px; 
  margin-top: 2px; 
  margin-left: 8px; 
}

.pattern-bar-4 { 
  background: #2563eb; 
  height: 4px; 
  border-radius: 2px; 
  margin-top: 2px; 
  margin-left: 12px; 
}

/* Large Pattern Colors */
.pattern-bar-lg-1 { 
  background: #ff6b35; 
  height: 10px; 
  border-radius: 5px; 
}

.pattern-bar-lg-2 { 
  background: #f7931e; 
  height: 8px; 
  border-radius: 4px; 
  margin-top: 3px; 
  margin-left: 5px; 
}

.pattern-bar-lg-3 { 
  background: #10b981; 
  height: 7px; 
  border-radius: 3.5px; 
  margin-top: 3px; 
  margin-left: 10px; 
}

.pattern-bar-lg-4 { 
  background: #2563eb; 
  height: 5px; 
  border-radius: 2.5px; 
  margin-top: 3px; 
  margin-left: 15px; 
}

/* Animation */
.cultural-fade {
  animation: culturalPulse 3s ease-in-out infinite;
}

@keyframes culturalPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Talent Card Styles */
.talent-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.talent-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-0.5rem);
  border-color: #e5e7eb;
}
</style>