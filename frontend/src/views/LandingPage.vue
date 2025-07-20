<!-- LandingPage.vue - Updated to use shared navigation -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Shared Navigation -->
    <SharedNavigation variant="landing" />

    <!-- Hero Section - Dual Purpose -->
    <section class="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <!-- Hero Logo -->
          <div class="flex items-center justify-center mb-8">
            <div class="cultural-pattern-lg mr-6 cultural-fade">
              <div class="pattern-bar-lg-white-1"></div>
              <div class="pattern-bar-lg-white-2"></div>
              <div class="pattern-bar-lg-white-3"></div>
              <div class="pattern-bar-lg-white-4"></div>
            </div>
            <div>
              <h1 class="text-4xl font-bold">FURSA</h1>
              <p class="text-lg opacity-90">Connecting African talent to global opportunities</p>
            </div>
          </div>
          
          <h2 class="text-5xl font-bold mb-6 leading-tight">
            Your Gateway to 
            <span class="text-yellow-300">African Excellence</span>
          </h2>
          <p class="text-xl mb-8 opacity-90 max-w-4xl mx-auto">
            Whether you need local services or want to discover creative talent, FURSA connects you directly with verified African professionals. No middleman, authentic connections.
          </p>
        </div>

        <!-- Dual CTA Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <!-- Service Providers -->
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div class="text-4xl mb-4">🔧</div>
            <h3 class="text-2xl font-bold mb-4">Need Local Services?</h3>
            <p class="text-lg opacity-90 mb-6">
              Find trusted electricians, plumbers, carpenters, cleaners and more in your area. GPS-enabled, verified professionals.
            </p>
            <div class="space-y-3">
              <button @click="goToServices" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                🗺️ Find Services Near Me
              </button>
              <button @click="goToProviderJoin" class="w-full bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                💼 Join as Service Provider
              </button>
            </div>
          </div>

          <!-- Creative Talent -->
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div class="text-4xl mb-4">🎨</div>
            <h3 class="text-2xl font-bold mb-4">Discover Creative Talent</h3>
            <p class="text-lg opacity-90 mb-6">
              Connect with authentic African artists, crafters, designers and creatives through visual portfolios and voice introductions.
            </p>
            <div class="space-y-3">
              <button @click="goToTalentBrowse" class="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                🔍 Browse Creative Talent
              </button>
              <button @click="goToTalentUpload" class="w-full bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                🎨 Create Your Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Services Section -->
    <section id="services" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Popular Services Near You</h2>
          <p class="text-xl text-gray-600">Get help from verified local professionals</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <button 
            v-for="service in popularServices" 
            :key="service.name"
            @click="goToServiceCategory(service.slug)"
            class="flex flex-col items-center p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all hover:shadow-md group"
          >
            <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">{{ service.icon }}</div>
            <h3 class="font-semibold text-gray-900 text-center">{{ service.name }}</h3>
            <p class="text-sm text-gray-600 text-center mt-1">{{ service.desc }}</p>
          </button>
        </div>
        <div class="text-center mt-8">
          <button @click="goToServices" class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            View All Services
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="how-it-works" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">How FURSA Works</h2>
          <p class="text-xl text-gray-600">Simple, direct, authentic connections</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin class="w-8 h-8 text-white" />
            </div>
            <h3 class="font-semibold text-lg mb-2">Find Near You</h3>
            <p class="text-gray-600">Use GPS to find services and talent in your area with real distance calculations</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check class="w-8 h-8 text-white" />
            </div>
            <h3 class="font-semibold text-lg mb-2">Verified Profiles</h3>
            <p class="text-gray-600">All service providers and talent are verified with background checks and reviews</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone class="w-8 h-8 text-white" />
            </div>
            <h3 class="font-semibold text-lg mb-2">Direct Contact</h3>
            <p class="text-gray-600">Call, WhatsApp, or request quotes directly. No platform fees or middleman</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart class="w-8 h-8 text-white" />
            </div>
            <h3 class="font-semibold text-lg mb-2">Authentic Stories</h3>
            <p class="text-gray-600">Voice introductions and visual portfolios showcase real work and personality</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Creative Talent Section -->
    <section id="talent" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold text-gray-900 mb-6">
              Discover Authentic African 
              <span class="text-orange-600">Creative Talent</span>
            </h2>
            <p class="text-xl text-gray-600 mb-8">
              Connect directly with African artists, craftspeople, designers, and creatives. See their work, hear their stories, and commission authentic pieces that celebrate African heritage.
            </p>
            <div class="space-y-4">
              <div class="flex items-center">
                <Mic class="w-6 h-6 text-orange-500 mr-3" />
                <span class="text-gray-700">Voice introductions in multiple African languages</span>
              </div>
              <div class="flex items-center">
                <Camera class="w-6 h-6 text-orange-500 mr-3" />
                <span class="text-gray-700">Visual portfolios showing real work and process</span>
              </div>
              <div class="flex items-center">
                <Globe class="w-6 h-6 text-orange-500 mr-3" />
                <span class="text-gray-700">Global shipping and digital collaboration</span>
              </div>
            </div>
            <div class="mt-8 space-x-4">
              <button @click="goToTalentBrowse" class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Browse Creative Talent
              </button>
              <button @click="goToTalentUpload" class="border border-orange-600 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg font-semibold transition-colors">
                Join as Creative
              </button>
            </div>
          </div>
          <div class="relative">
            <!-- Sample talent card preview -->
            <div class="bg-white rounded-xl p-6 shadow-2xl max-w-md mx-auto">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mr-3 flex items-center justify-center">
                  <User class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">Amara Diallo</h3>
                  <p class="text-sm text-gray-600">Traditional Weaver • Bamako, Mali</p>
                </div>
                <div class="ml-auto bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">✓ Verified</div>
              </div>
              <div class="grid grid-cols-2 gap-2 mb-4">
                <div class="bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg h-20"></div>
                <div class="bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg h-20"></div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-yellow-500">★★★★★</span>
                  <span class="text-sm text-gray-600 ml-2">4.9 (23 reviews)</span>
                </div>
                <button class="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">Contact</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold mb-6">Ready to Connect with African Excellence?</h2>
        <p class="text-xl mb-8 opacity-90">Join thousands already discovering authentic talent and reliable services through direct connections.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 class="text-xl font-bold mb-4">Need Services?</h3>
            <button @click="goToServices" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
              Find Local Professionals
            </button>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 class="text-xl font-bold mb-4">Want Creative Work?</h3>
            <button @click="goToTalentBrowse" class="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
              Discover African Creatives
            </button>
          </div>
        </div>
        <p class="text-sm mt-6 opacity-75">No platform fees • Direct connections • Authentic experiences</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <!-- Footer Logo -->
            <div class="flex items-center mb-4">
              <div class="cultural-pattern-sm mr-3">
                <div class="pattern-bar-sm-white-1"></div>
                <div class="pattern-bar-sm-white-2"></div>
                <div class="pattern-bar-sm-white-3"></div>
                <div class="pattern-bar-sm-white-4"></div>
              </div>
              <h3 class="text-2xl font-bold">FURSA</h3>
            </div>
            <p class="text-gray-400">Connecting African talent to global opportunities through authentic portfolios and direct connections.</p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Services</h4>
            <ul class="space-y-2 text-gray-400">
              <li><button @click="goToServices" class="hover:text-white transition-colors">Find Services</button></li>
              <li><button @click="goToServiceCategory('electrician')" class="hover:text-white transition-colors">Electricians</button></li>
              <li><button @click="goToServiceCategory('plumber')" class="hover:text-white transition-colors">Plumbers</button></li>
              <li><button @click="goToProviderJoin" class="hover:text-white transition-colors">Join as Provider</button></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Creative Talent</h4>
            <ul class="space-y-2 text-gray-400">
              <li><button @click="goToTalentBrowse" class="hover:text-white transition-colors">Browse Talent</button></li>
              <li><button @click="goToTalentUpload" class="hover:text-white transition-colors">Create Portfolio</button></li>
              <li><a href="#" class="hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Support</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" class="hover:text-white transition-colors">About FURSA</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 FURSA. Empowering African talent worldwide.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, Mic, Camera, Check, Heart, MapPin, Phone, Globe } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import SharedNavigation from '@/components/common/SharedNavigation.vue'

const router = useRouter()

// Popular services data
const popularServices = ref([
  { name: 'Electrician', icon: '⚡', slug: 'electrician', desc: 'Wiring & Repairs' },
  { name: 'Plumber', icon: '🔧', slug: 'plumber', desc: 'Pipes & Fixtures' },
  { name: 'Carpenter', icon: '🪚', slug: 'carpenter', desc: 'Furniture & Repair' },
  { name: 'Cleaner', icon: '🧹', slug: 'cleaner', desc: 'Home & Office' },
  { name: 'Painter', icon: '🎨', slug: 'painter', desc: 'Interior & Exterior' },
  { name: 'Mechanic', icon: '🔩', slug: 'mechanic', desc: 'Auto Repair' }
])

// Navigation methods - FIXED ROUTES
const goToServices = () => {
  router.push('/app/services')
}

const goToServiceCategory = (category) => {
  router.push(`/app/services/${category}`)
}

const goToProviderJoin = () => {
  router.push('/app/join-as-provider')
}

const goToTalentBrowse = () => {
  router.push('/app/search')
}

const goToTalentUpload = () => {
  router.push('/app/upload')
}
</script>

<style scoped>
/* Cultural Pattern Styles */
.cultural-pattern-sm {
  position: relative;
  width: 32px;
  height: 32px;
}

.cultural-pattern-lg {
  position: relative;
  width: 48px;
  height: 48px;
}

/* Large Pattern Colors */
.pattern-bar-lg-white-1 { 
  background: rgba(255,255,255,0.9); 
  height: 10px; 
  border-radius: 5px; 
}

.pattern-bar-lg-white-2 { 
  background: rgba(255,255,255,0.8); 
  height: 8px; 
  border-radius: 4px; 
  margin-top: 3px; 
  margin-left: 5px; 
}

.pattern-bar-lg-white-3 { 
  background: rgba(255,255,255,0.7); 
  height: 7px; 
  border-radius: 3.5px; 
  margin-top: 3px; 
  margin-left: 10px; 
}

.pattern-bar-lg-white-4 { 
  background: rgba(255,255,255,0.6); 
  height: 5px; 
  border-radius: 2.5px; 
  margin-top: 3px; 
  margin-left: 15px; 
}

.pattern-bar-sm-white-1 { 
  background: rgba(255,255,255,0.9); 
  height: 6px; 
  border-radius: 3px; 
}

.pattern-bar-sm-white-2 { 
  background: rgba(255,255,255,0.8); 
  height: 5px; 
  border-radius: 2.5px; 
  margin-top: 2px; 
  margin-left: 3px; 
}

.pattern-bar-sm-white-3 { 
  background: rgba(255,255,255,0.7); 
  height: 4px; 
  border-radius: 2px; 
  margin-top: 2px; 
  margin-left: 6px; 
}

.pattern-bar-sm-white-4 { 
  background: rgba(255,255,255,0.6); 
  height: 3px; 
  border-radius: 1.5px; 
  margin-top: 2px; 
  margin-left: 9px; 
}

/* Animation */
.cultural-fade {
  animation: culturalPulse 3s ease-in-out infinite;
}

@keyframes culturalPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>