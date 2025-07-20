<!-- UploadFlow.vue - Desktop-first professional talent onboarding -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Header -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <!-- FURSA Logo -->
          <div class="flex items-center justify-center mb-6">
            <div class="cultural-pattern mr-4">
              <div class="pattern-bar-white-1"></div>
              <div class="pattern-bar-white-2"></div>
              <div class="pattern-bar-white-3"></div>
              <div class="pattern-bar-white-4"></div>
            </div>
            <h1 class="text-3xl font-bold">Join FURSA</h1>
          </div>
          
          <h2 class="text-2xl font-semibold mb-4">Share Your Talent with the World</h2>
          <p class="text-lg opacity-90 max-w-2xl mx-auto">
            Create your professional portfolio in just 3 simple steps. Connect with global clients who value authentic African craftsmanship.
          </p>
        </div>
      </div>
    </section>

    <!-- Progress Section -->
    <section class="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Step {{ currentStep }} of 3</span>
            <span class="text-sm text-gray-500">{{ Math.round((currentStep / 3) * 100) }}% Complete</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${(currentStep / 3) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Step Labels -->
        <div class="flex justify-between">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="flex items-center"
            :class="{ 'opacity-50': index + 1 > currentStep }"
          >
            <div 
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3',
                index + 1 <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              ]"
            >
              {{ index + 1 }}
            </div>
            <div>
              <div class="font-medium text-gray-900">{{ step.title }}</div>
              <div class="text-sm text-gray-500">{{ step.subtitle }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 1" class="max-w-2xl mx-auto">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h3>
            <p class="text-gray-600">Help clients discover your unique talents and skills</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    class="form-input"
                    placeholder="Enter your full name"
                    required
                  >
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Your Primary Skill/Craft *</label>
                  <input
                    v-model="formData.skill"
                    type="text"
                    class="form-input"
                    placeholder="e.g., Beadwork, Tailoring, Wood Carving"
                    required
                  >
                  <p class="text-xs text-gray-500 mt-1">What are you best known for?</p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select v-model="formData.category" class="form-input">
                    <option value="">Select a category</option>
                    <option value="Artisans">Artisans</option>
                    <option value="Creatives">Creatives</option>
                    <option value="Skilled Trades">Skilled Trades</option>
                    <option value="Students">Students</option>
                  </select>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input
                    v-model="formData.location"
                    type="text"
                    class="form-input"
                    placeholder="City, County, Country"
                    required
                  >
                  <p class="text-xs text-gray-500 mt-1">Where are you based?</p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    class="form-input"
                    placeholder="+254 712 345 678"
                    required
                  >
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="form-input"
                    placeholder="your.email@example.com"
                  >
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="mt-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Tell Your Story *</label>
              <textarea
                v-model="formData.description"
                class="form-input h-32 resize-none"
                placeholder="Share your journey, experience, and what makes your work special. Tell clients why they should choose you..."
                required
              ></textarea>
              <div class="flex justify-between items-center mt-2">
                <p class="text-xs text-gray-500">Describe your experience, style, and passion</p>
                <span class="text-xs text-gray-400">{{ formData.description.length }}/500</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Portfolio Upload -->
        <div v-if="currentStep === 2" class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera class="w-8 h-8 text-orange-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Showcase Your Work</h3>
            <p class="text-gray-600">Upload photos and videos of your best creations</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Upload Area -->
            <div class="lg:col-span-2">
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <!-- Main Upload Zone -->
                <div
                  @click="triggerFileUpload"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop"
                  class="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                >
                  <div class="mb-4">
                    <Upload class="w-12 h-12 mx-auto text-gray-400" />
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Upload Your Portfolio</h4>
                  <p class="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
                  <div class="flex justify-center gap-4 text-sm text-gray-500">
                    <span>📸 Images</span>
                    <span>🎥 Videos</span>
                    <span>Max 10MB each</span>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    class="hidden"
                    @change="handleFileUpload"
                  >
                </div>

                <!-- Uploaded Files Grid -->
                <div v-if="uploadedFiles.length > 0" class="mt-8">
                  <h4 class="font-semibold text-gray-900 mb-4">Your Portfolio ({{ uploadedFiles.length }} items)</h4>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div
                      v-for="file in uploadedFiles"
                      :key="file.id"
                      class="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img 
                        v-if="file.type === 'image'" 
                        :src="file.preview" 
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                        :alt="file.name"
                      >
                      <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                        <Video class="w-8 h-8 text-gray-400" />
                      </div>
                      
                      <!-- File Actions -->
                      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                        <button
                          @click="removeFile(file.id)"
                          class="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-opacity duration-200"
                        >
                          <X class="w-4 h-4" />
                        </button>
                      </div>

                      <!-- File Type Badge -->
                      <div class="absolute top-2 left-2">
                        <span class="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          {{ file.type }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tips Sidebar -->
            <div class="lg:col-span-1">
              <div class="bg-blue-50 rounded-xl p-6 sticky top-32">
                <h4 class="font-semibold text-blue-900 mb-4">📸 Photography Tips</h4>
                <ul class="space-y-3 text-sm text-blue-800">
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Use natural light when possible
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Show yourself with your work
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Include work-in-progress shots
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Capture different angles and details
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Keep backgrounds clean and simple
                  </li>
                </ul>

                <div class="mt-6 p-4 bg-white rounded-lg">
                  <h5 class="font-medium text-gray-900 mb-2">✨ Pro Tip</h5>
                  <p class="text-sm text-gray-600">
                    Show the story behind your work. Clients love seeing the passion and process that goes into your craft.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Voice Introduction -->
        <div v-if="currentStep === 3" class="max-w-2xl mx-auto">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic class="w-8 h-8 text-emerald-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Add Your Voice</h3>
            <p class="text-gray-600">Let clients hear your passion and personality</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <!-- Recording Section -->
            <div class="text-center mb-8">
              <div class="bg-emerald-50 rounded-xl p-8 mb-6">
                <div class="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Mic class="w-10 h-10 text-emerald-600" />
                </div>
                <h4 class="font-semibold text-emerald-900 mb-2">Record Your Introduction</h4>
                <p class="text-emerald-700 mb-6">Share your story in your own voice and language</p>
                
                <!-- Recording Controls -->
                <div class="space-y-4">
                  <button
                    @click="toggleRecording"
                    :class="[
                      'px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center mx-auto',
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    ]"
                  >
                    <span v-if="isRecording" class="flex items-center">
                      <div class="w-3 h-3 bg-white rounded-sm mr-2"></div>
                      Stop Recording
                    </span>
                    <span v-else class="flex items-center">
                      <Mic class="w-4 h-4 mr-2" />
                      Start Recording
                    </span>
                  </button>
                  
                  <div v-if="isRecording" class="flex items-center justify-center space-x-1">
                    <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span class="text-sm text-gray-600">Recording... {{ recordingTime }}s</span>
                  </div>
                  
                  <div v-if="hasRecording" class="bg-white rounded-lg p-4 border border-emerald-200">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                          <Music class="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p class="font-medium text-gray-900">Voice Introduction</p>
                          <p class="text-sm text-gray-500">{{ recordingDuration }}s • {{ formData.language }}</p>
                        </div>
                      </div>
                      <button @click="playRecording" class="text-emerald-600 hover:text-emerald-700">
                        <Play class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Language Selection -->
              <div class="text-left mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Recording Language</label>
                <select v-model="formData.language" class="form-input">
                  <option value="english">English</option>
                  <option value="kiswahili">Kiswahili</option>
                  <option value="kikuyu">Kikuyu</option>
                  <option value="luo">Luo</option>
                  <option value="amharic">Amharic</option>
                  <option value="yoruba">Yoruba</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <!-- Recording Guidelines -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-900 mb-4">🎯 What to Include (30-60 seconds)</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul class="space-y-2 text-sm text-gray-700">
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Your name and location
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Your craft and experience
                  </li>
                </ul>
                <ul class="space-y-2 text-sm text-gray-700">
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    What makes you unique
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Your goals and aspirations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center mt-12 max-w-2xl mx-auto">
          <button
            v-if="currentStep > 1"
            @click="previousStep"
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            Previous
          </button>
          <div v-else></div>

          <button
            @click="nextStep"
            :disabled="!canProceed"
            :class="[
              'px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center',
              canProceed
                ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            {{ currentStep === 3 ? 'Complete Profile' : 'Continue' }}
            <ArrowRight v-if="currentStep < 3" class="w-4 h-4 ml-2" />
            <Check v-else class="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check class="w-8 h-8 text-green-600" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-4">Welcome to FURSA! 🎉</h3>
        <p class="text-gray-600 mb-6">
          Your profile has been submitted for review. We'll notify you once it's approved and live on the platform.
        </p>
        <div class="space-y-3">
          <button 
            @click="goToProfile"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            View Your Profile
          </button>
          <button 
            @click="goToHome"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Explore FURSA
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, ArrowRight, User, Camera, Mic, Upload, Video, X, 
  Check, Play, Music
} from 'lucide-vue-next'

const router = useRouter()

// Reactive data
const currentStep = ref(1)
const isRecording = ref(false)
const hasRecording = ref(false)
const recordingTime = ref(0)
const recordingDuration = ref(0)
const showSuccessModal = ref(false)
const fileInput = ref(null)
const uploadedFiles = ref([])

const formData = ref({
  name: '',
  skill: '',
  category: '',
  location: '',
  phone: '',
  email: '',
  description: '',
  language: 'english'
})

// Step configuration
const steps = ref([
  { title: 'Basic Info', subtitle: 'Tell us about yourself' },
  { title: 'Portfolio', subtitle: 'Show your work' },
  { title: 'Voice Intro', subtitle: 'Add your personal touch' }
])

// Computed properties
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return formData.value.name && formData.value.skill && formData.value.location && 
             formData.value.phone && formData.value.description
    case 2:
      return uploadedFiles.value.length > 0
    case 3:
      return hasRecording.value
    default:
      return false
  }
})

// Methods
const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    router.go(-1)
  }
}

const nextStep = () => {
  if (!canProceed.value) return
  
  if (currentStep.value < 3) {
    currentStep.value++
  } else {
    submitProfile()
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

const handleFileDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const processFiles = (files) => {
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert(`File ${file.name} is too large. Maximum size is 10MB.`)
      return
    }
    
    const fileObj = {
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }
    uploadedFiles.value.push(fileObj)
  })
}

const removeFile = (id) => {
  const fileIndex = uploadedFiles.value.findIndex(file => file.id === id)
  if (fileIndex > -1) {
    // Clean up object URL
    if (uploadedFiles.value[fileIndex].preview) {
      URL.revokeObjectURL(uploadedFiles.value[fileIndex].preview)
    }
    uploadedFiles.value.splice(fileIndex, 1)
  }
}

const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const startRecording = () => {
  isRecording.value = true
  recordingTime.value = 0
  
  // Simulate recording timer
  const timer = setInterval(() => {
    recordingTime.value++
    if (recordingTime.value >= 60) {
      stopRecording()
    }
  }, 1000)
  
  // Store timer to clear it later
  window.recordingTimer = timer
}

const stopRecording = () => {
  isRecording.value = false
  hasRecording.value = true
  recordingDuration.value = recordingTime.value
  
  if (window.recordingTimer) {
    clearInterval(window.recordingTimer)
  }
}

const playRecording = () => {
  // Implement audio playback
  alert('Audio playback functionality to be implemented')
}

const submitProfile = async () => {
  try {
    // Simulate API submission
    console.log('Submitting profile:', {
      formData: formData.value,
      files: uploadedFiles.value,
      hasVoiceIntro: hasRecording.value
    })
    
    // Show success modal
    showSuccessModal.value = true
  } catch (error) {
    console.error('Error submitting profile:', error)
    alert('Error submitting profile. Please try again.')
  }
}

const goToProfile = () => {
  showSuccessModal.value = false
  router.push('/app/talent/new') // Redirect to new profile
}

const goToHome = () => {
  showSuccessModal.value = false
  router.push('/app')
}
</script>

<style scoped>
/* Cultural Pattern Styles */
.cultural-pattern {
  position: relative;
  width: 40px;
  height: 40px;
}

.pattern-bar-white-1 { 
  background: rgba(255,255,255,0.9); 
  height: 8px; 
  border-radius: 4px; 
}

.pattern-bar-white-2 { 
  background: rgba(255,255,255,0.8); 
  height: 6px; 
  border-radius: 3px; 
  margin-top: 2px; 
  margin-left: 4px; 
}

.pattern-bar-white-3 { 
  background: rgba(255,255,255,0.7); 
  height: 6px; 
  border-radius: 3px; 
  margin-top: 2px; 
  margin-left: 8px; 
}

.pattern-bar-white-4 { 
  background: rgba(255,255,255,0.6); 
  height: 4px; 
  border-radius: 2px; 
  margin-top: 2px; 
  margin-left: 12px; 
}

/* Form Styles 
.form-input {
  @apply w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all;
}*/

/* 
.form-input:focus {
  @apply shadow-sm;
}
/* 

/* Upload zone animation */
.upload-zone {
  transition: all 0.3s ease;
}

.upload-zone:hover {
  transform: translateY(-2px);
}

/* Recording pulse animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>