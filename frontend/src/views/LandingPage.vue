<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <!-- FURSA Logo with Cultural Pattern -->
            <div class="flex items-center">
              <div class="cultural-pattern mr-3">
                <div class="pattern-bar-1"></div>
                <div class="pattern-bar-2"></div>
                <div class="pattern-bar-3"></div>
                <div class="pattern-bar-4"></div>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">FURSA</h1>
                <span class="text-sm text-gray-600 hidden lg:block">Connecting African talent to global opportunities</span>
              </div>
            </div>
          </div>
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
            <a href="#talent" class="text-gray-700 hover:text-blue-600 transition-colors">For Talent</a>
            <a href="#clients" class="text-gray-700 hover:text-blue-600 transition-colors">For Clients</a>
            <button @click="goToApp" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Browse Talent
            </button>
          </div>
          <!-- Mobile menu button -->
          <button @click="goToApp" class="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg">
            Enter App
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <!-- Hero Logo -->
            <div class="flex items-center mb-8">
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
              Connecting African Talent to 
              <span class="text-yellow-300">Global Opportunities</span>
            </h2>
            <p class="text-xl mb-8 opacity-90">
              Discover authentic African artisans, creatives, and skilled workers through visual portfolios and voice introductions. Direct connections, verified profiles, no middleman.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button @click="goToUpload" class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
                🎨 Create Your Portfolio
              </button>
              <button @click="goToSearch" class="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                🔍 Find Talent
              </button>
            </div>
          </div>
          <div class="relative">
            <!-- Sample talent card preview -->
            <div class="bg-white rounded-xl p-6 shadow-2xl max-w-md mx-auto">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                  <User class="w-6 h-6 text-gray-500" />
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
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Contact</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Why FURSA is Different</h2>
          <p class="text-xl text-gray-600">Authentic connections through innovative features</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic class="w-8 h-8 text-white" />
            </div>
            <h3 class="font-semibold text-lg mb-2">Voice Introductions</h3>
            <p class="text-gray-600">Hear talent speak in their own language with translation options</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera class="w-8 h-8 text-white" />
            </div>
            <h3 class="font-semibold text-lg mb-2">Visual Portfolios</h3>
            <p class="text-gray-600">See real work, not just CVs. Photos and videos of actual projects</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check class="w-8 h-8 text-white" />
            </div>
            <h3 class="font-semibold text-lg mb-2">Verified Profiles</h3>
            <p class="text-gray-600">Trust through verification while welcoming emerging talent</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart class="w-8 h-8 text-white" />
            </div>
            <h3 class="font-semibold text-lg mb-2">Direct Connection</h3>
            <p class="text-gray-600">No middleman. Connect directly with talent and clients</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Cultural Heritage Section -->
    <section class="py-20 bg-orange-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="flex items-center justify-center mb-8">
          <div class="cultural-pattern-lg mr-6">
            <div class="pattern-bar-1"></div>
            <div class="pattern-bar-2"></div>
            <div class="pattern-bar-3"></div>
            <div class="pattern-bar-4"></div>
          </div>
          <h2 class="text-4xl font-bold text-gray-900">🎨 Celebrating African Heritage</h2>
        </div>
        <p class="text-xl text-gray-700 mb-6">
          Our cultural pattern represents the <strong>rich layers of African creativity</strong> - from traditional heritage 
          to modern innovation. Each element symbolizes a different aspect of talent: 
          <span class="text-orange-600 font-medium">Heritage</span>, 
          <span class="text-yellow-600 font-medium">Craft</span>, 
          <span class="text-emerald-600 font-medium">Growth</span>, and 
          <span class="text-blue-600 font-medium">Global Reach</span>.
        </p>
        <p class="text-gray-600">
          The flowing, overlapping design reflects traditional African textile patterns 
          while maintaining a modern, digital-friendly aesthetic that bridges cultures and continents.
        </p>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold mb-6">Ready to Connect African Talent with Global Opportunities?</h2>
        <p class="text-xl mb-8 opacity-90">Join thousands of artists, craftspeople, and skilled workers already growing their businesses through authentic connections.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="goToUpload" class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
            Create Your Portfolio - Free
          </button>
          <button @click="goToSearch" class="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Find Talent - No Fees
          </button>
        </div>
        <p class="text-sm mt-4 opacity-75">No platform fees • Direct connections • Global reach</p>
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
            <h4 class="font-semibold mb-4">For Talent</h4>
            <ul class="space-y-2 text-gray-400">
              <li><button @click="goToUpload" class="hover:text-white transition-colors">Create Portfolio</button></li>
              <li><a href="#" class="hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Getting Started</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">For Clients</h4>
            <ul class="space-y-2 text-gray-400">
              <li><button @click="goToSearch" class="hover:text-white transition-colors">Browse Talent</button></li>
              <li><a href="#" class="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Client Stories</a></li>
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
import { User, Mic, Camera, Check, Heart } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToApp = () => {
  router.push('/app')
}

const goToUpload = () => {
  router.push('/upload')
}

const goToSearch = () => {
  router.push('/search')
}
</script>

<style scoped>
/* Cultural Pattern Styles */
.cultural-pattern {
  position: relative;
  width: 40px;
  height: 40px;
}

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

/* Small Pattern Colors */
.pattern-bar-sm-1 { 
  background: #ff6b35; 
  height: 6px; 
  border-radius: 3px; 
}

.pattern-bar-sm-2 { 
  background: #f7931e; 
  height: 5px; 
  border-radius: 2.5px; 
  margin-top: 2px; 
  margin-left: 3px; 
}

.pattern-bar-sm-3 { 
  background: #10b981; 
  height: 4px; 
  border-radius: 2px; 
  margin-top: 2px; 
  margin-left: 6px; 
}

.pattern-bar-sm-4 { 
  background: #2563eb; 
  height: 3px; 
  border-radius: 1.5px; 
  margin-top: 2px; 
  margin-left: 9px; 
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

/* White Pattern Variants for Dark Backgrounds */
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