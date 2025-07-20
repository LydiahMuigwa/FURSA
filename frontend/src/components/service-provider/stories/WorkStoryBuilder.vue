<!-- Enhanced WorkStoryBuilder.vue - Integrated with FURSA Platform Design System -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
    <!-- Enhanced Header with FURSA Branding -->
    <div class="bg-white shadow-lg border-b border-orange-100">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Cultural Pattern Integration -->
            <div class="cultural-pattern-header">
              <div class="pattern-bar-header-1"></div>
              <div class="pattern-bar-header-2"></div>
              <div class="pattern-bar-header-3"></div>
              <div class="pattern-bar-header-4"></div>
            </div>
            <div>
              <h1 class="text-3xl font-bold gradient-text">{{ t('stories.builder.title') || 'Tell Your Work Story' }}</h1>
              <p class="text-gray-600 mt-1 flex items-center">
                <Sparkles class="w-4 h-4 mr-2 text-orange-500" />
                {{ t('stories.builder.subtitle') || 'Share your craft with the world - Show how you work, not just what you do' }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Save Draft with Cultural Touch -->
            <button @click="saveDraft" 
                    class="flex items-center px-4 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all font-medium border border-orange-200">
              <Heart class="w-4 h-4 mr-2" />
              {{ t('common.save_draft') || 'Save Draft' }}
            </button>
            <!-- Back to Dashboard -->
            <router-link to="/app/provider/dashboard" 
                        class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
              <ArrowLeft class="w-4 h-4 mr-2" />
              Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Enhanced Progress Steps with Cultural Elements -->
      <div class="mb-12">
        <div class="relative">
          <!-- Progress Background Line -->
          <div class="absolute top-5 left-5 right-5 h-1 bg-gradient-to-r from-orange-200 via-yellow-200 via-green-200 to-blue-200 rounded-full"></div>
          <div :style="{ width: `${((currentStep - 1) / 3) * 100}%` }" 
               class="absolute top-5 left-5 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 via-green-500 to-blue-500 rounded-full transition-all duration-500"></div>
          
          <div class="relative flex items-center justify-between">
            <div v-for="(step, index) in storySteps" :key="index" 
                 class="flex flex-col items-center group">
              <!-- Step Circle with Cultural Colors -->
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2',
                currentStep >= index + 1 
                  ? getStepActiveColor(index)
                  : 'bg-white border-gray-300 text-gray-400',
                currentStep === index + 1 ? 'scale-110 shadow-lg' : ''
              ]">
                <Check v-if="currentStep > index + 1" class="w-5 h-5" />
                <component v-else-if="currentStep === index + 1" :is="step.icon" class="w-5 h-5" />
                <span v-else>{{ index + 1 }}</span>
              </div>
              
              <!-- Step Label -->
              <div class="mt-3 text-center">
                <div :class="[
                  'text-sm font-semibold transition-colors',
                  currentStep >= index + 1 ? getStepTextColor(index) : 'text-gray-500'
                ]">
                  {{ step.title }}
                </div>
                <div class="text-xs text-gray-500 mt-1 max-w-20">{{ step.subtitle }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 1: Story Setup with Enhanced Cultural Design -->
      <div v-if="currentStep === 1" class="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
        <!-- Header Section with Cultural Pattern -->
        <div class="bg-gradient-to-r from-orange-500 to-yellow-500 p-8 text-white relative overflow-hidden">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-20">
            <div class="cultural-pattern-bg">
              <div v-for="i in 6" :key="i" class="pattern-line" :style="{ left: `${i * 15}%` }"></div>
            </div>
          </div>
          
          <div class="relative text-center">
            <div class="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center backdrop-blur-sm">
              <BookOpen class="w-10 h-10 text-white" />
            </div>
            <h2 class="text-2xl font-bold mb-3">{{ t('stories.setup.title') || 'What story do you want to tell?' }}</h2>
            <p class="text-orange-100 text-lg">{{ t('stories.setup.subtitle') || 'Every great project has a story. Share yours with the world.' }}</p>
          </div>
        </div>

        <div class="p-8 space-y-8">
          <!-- Story Title with Enhanced Design -->
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <Edit3 class="w-4 h-4 mr-2 text-orange-500" />
              {{ t('stories.setup.story_title') || 'Story Title' }}
              <span class="text-red-500 ml-1">*</span>
            </label>
            <input v-model="storyData.title" 
                   type="text" 
                   :placeholder="t('stories.setup.title_placeholder') || 'e.g., Emergency Power Restoration in Kilimani'"
                   class="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 text-lg transition-all">
          </div>

          <!-- Project Type with Cultural Colors -->
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-4 flex items-center">
              <Briefcase class="w-4 h-4 mr-2 text-orange-500" />
              {{ t('stories.setup.project_type') || 'What type of project was this?' }}
              <span class="text-red-500 ml-1">*</span>
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button v-for="type in projectTypes" :key="type.id"
                      @click="storyData.projectType = type.id"
                      :class="[
                        'p-6 border-2 rounded-xl text-center transition-all duration-200 hover:scale-105',
                        storyData.projectType === type.id 
                          ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700 shadow-lg` 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      ]">
                <div class="text-3xl mb-3">{{ type.emoji }}</div>
                <div class="text-sm font-semibold">{{ type.name }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ type.description }}</div>
              </button>
            </div>
          </div>

          <!-- Story Introduction with Rich Text Support -->
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <MessageSquare class="w-4 h-4 mr-2 text-orange-500" />
              {{ t('stories.setup.intro') || 'How did this project start?' }}
              <span class="text-red-500 ml-1">*</span>
            </label>
            <div class="relative">
              <textarea v-model="storyData.introduction" 
                        rows="5"
                        :placeholder="t('stories.setup.intro_placeholder') || 'Tell the story: How did the customer find you? What was the challenge? What made this project special?'"
                        class="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 text-lg transition-all resize-none"></textarea>
              <div class="absolute bottom-3 right-3 text-xs text-gray-400">
                {{ storyData.introduction.length }}/500 characters
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Enhanced Photo Upload with Cultural Design -->
      <div v-if="currentStep === 2" class="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white relative overflow-hidden">
          <div class="relative text-center">
            <div class="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center backdrop-blur-sm">
              <Camera class="w-10 h-10 text-white" />
            </div>
            <h2 class="text-2xl font-bold mb-3">{{ t('stories.visual.title') || 'Show Your Craft Visually' }}</h2>
            <p class="text-green-100 text-lg">Pictures tell the story of your expertise and attention to detail</p>
          </div>
        </div>

        <div class="p-8 space-y-10">
          <!-- Before Photos -->
          <div class="relative">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle class="w-6 h-6 mr-3 text-red-500" />
              {{ t('stories.visual.before') || 'Before: The Challenge' }}
              <span class="text-red-500 ml-1">*</span>
            </h3>
            <p class="text-gray-600 mb-6">Show what the customer was facing - the problem that needed your expertise</p>
            <PhotoUploadZone 
              :photos="storyData.beforePhotos"
              :placeholder="'Upload photos showing the initial problem or challenge'"
              upload-type="before"
              @upload="(photos) => storyData.beforePhotos = photos"
              @remove="(index) => storyData.beforePhotos.splice(index, 1)"
            />
          </div>

          <!-- Process Photos -->
          <div class="relative">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Wrench class="w-6 h-6 mr-3 text-blue-500" />
              {{ t('stories.visual.process') || 'Process: Your Expertise in Action' }}
            </h3>
            <p class="text-gray-600 mb-6">Show your tools, techniques, and problem-solving skills at work</p>
            <PhotoUploadZone 
              :photos="storyData.processPhotos"
              :placeholder="'Show your tools, techniques, and craftsmanship'"
              upload-type="process"
              @upload="(photos) => storyData.processPhotos = photos"
              @remove="(index) => storyData.processPhotos.splice(index, 1)"
            />
          </div>

          <!-- After Photos -->
          <div class="relative">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle class="w-6 h-6 mr-3 text-green-500" />
              {{ t('stories.visual.after') || 'After: The Amazing Result' }}
              <span class="text-red-500 ml-1">*</span>
            </h3>
            <p class="text-gray-600 mb-6">Show the completed work and the impact on your customer's life</p>
            <PhotoUploadZone 
              :photos="storyData.afterPhotos"
              :placeholder="'Show the completed work and happy customer'"
              upload-type="after"
              @upload="(photos) => storyData.afterPhotos = photos"
              @remove="(index) => storyData.afterPhotos.splice(index, 1)"
            />
          </div>
        </div>
      </div>

      <!-- Step 3: Enhanced Voice & Skills with Cultural Elements -->
      <div v-if="currentStep === 3" class="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-8 text-white relative overflow-hidden">
          <div class="relative text-center">
            <div class="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center backdrop-blur-sm">
              <Mic class="w-10 h-10 text-white" />
            </div>
            <h2 class="text-2xl font-bold mb-3">{{ t('stories.voice.title') || 'Add Your Voice & Skills' }}</h2>
            <p class="text-blue-100 text-lg">Let customers hear your passion and expertise</p>
          </div>
        </div>

        <div class="p-8 space-y-10">
          <!-- Voice Recording Section -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Volume2 class="w-6 h-6 mr-3 text-blue-500" />
              {{ t('stories.voice.recording') || 'Voice Introduction (Optional)' }}
            </h3>
            <p class="text-gray-600 mb-6">Record a 30-60 second voice note telling your story in your own words</p>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <div v-if="!audioRecording" class="text-center">
                <button @click="startRecording" 
                        :disabled="isRecording"
                        :class="[
                          'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all',
                          isRecording 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                        ]">
                  <Mic class="w-8 h-8" />
                </button>
                <p class="text-sm text-gray-600">
                  {{ isRecording ? 'Recording... Click to stop' : 'Click to start recording' }}
                </p>
                <div v-if="isRecording" class="mt-2 text-lg font-mono text-red-600">
                  {{ formatTime(recordingDuration) }}
                </div>
              </div>
              
              <!-- Playback Controls -->
              <div v-else class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <button @click="playRecording" 
                          class="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-all hover:scale-105">
                    <Play class="w-5 h-5" />
                  </button>
                  <div>
                    <p class="font-medium text-gray-900">Voice Recording</p>
                    <p class="text-sm text-gray-600">{{ formatTime(audioRecording.duration) }}</p>
                  </div>
                </div>
                <button @click="deleteRecording" 
                        class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Skills Showcase with Cultural Design -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Award class="w-6 h-6 mr-3 text-blue-500" />
              {{ t('stories.skills.title') || 'Skills Demonstrated' }}
              <span class="text-red-500 ml-1">*</span>
            </h3>
            <p class="text-gray-600 mb-6">Select the skills you demonstrated in this project</p>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button v-for="skill in availableSkills" :key="skill"
                      @click="toggleSkill(skill)"
                      :class="[
                        'p-4 border-2 rounded-xl text-left transition-all duration-200 hover:scale-105',
                        storyData.skills.includes(skill)
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg' 
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      ]">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">{{ skill }}</span>
                  <Check v-if="storyData.skills.includes(skill)" class="w-4 h-4 text-blue-500" />
                </div>
              </button>
            </div>
          </div>

          <!-- Customer Impact -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Heart class="w-6 h-6 mr-3 text-red-500" />
              {{ t('stories.impact.title') || 'Customer Impact' }}
            </h3>
            <p class="text-gray-600 mb-6">How did your work make a difference in the customer's life?</p>
            <textarea v-model="storyData.customerImpact" 
                      rows="4"
                      placeholder="e.g., The family now has reliable power during storms, and the elderly grandmother can use her medical equipment safely."
                      class="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"></textarea>
          </div>
        </div>
      </div>

      <!-- Step 4: Enhanced Preview with Cultural Design -->
      <div v-if="currentStep === 4" class="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white relative overflow-hidden">
          <div class="relative text-center">
            <div class="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center backdrop-blur-sm">
              <Eye class="w-10 h-10 text-white" />
            </div>
            <h2 class="text-2xl font-bold mb-3">{{ t('stories.preview.title') || 'Preview Your Story' }}</h2>
            <p class="text-purple-100 text-lg">See how your story will appear to potential customers</p>
          </div>
        </div>

        <div class="p-8">
          <StoryPreview :story-data="storyData" />
        </div>
      </div>

      <!-- Enhanced Navigation -->
      <div class="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
        <!-- Back Button -->
        <button v-if="currentStep > 1" 
                @click="currentStep--"
                class="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all font-medium">
          <ChevronLeft class="w-5 h-5 mr-2" />
          Previous Step
        </button>
        <div v-else></div>

        <!-- Progress Info -->
        <div class="text-center">
          <div class="text-sm text-gray-500 mb-1">Step {{ currentStep }} of {{ storySteps.length }}</div>
          <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div :style="{ width: `${(currentStep / storySteps.length) * 100}%` }" 
                 class="h-full bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 transition-all duration-500"></div>
          </div>
        </div>

        <!-- Next/Publish Button -->
        <button v-if="currentStep < 4" 
                @click="nextStep"
                :disabled="!canProceedToNext"
                :class="[
                  'flex items-center px-8 py-3 rounded-xl font-medium transition-all',
                  canProceedToNext
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                ]">
          Next Step
          <ChevronRight class="w-5 h-5 ml-2" />
        </button>
        
        <button v-else 
                @click="publishStory"
                :disabled="isPublishing"
                class="flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50">
          <Sparkles v-if="!isPublishing" class="w-5 h-5 mr-2" />
          <div v-else class="w-5 h-5 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
          {{ isPublishing ? (t('stories.publishing') || 'Publishing...') : (t('stories.publish') || 'Publish Your Story') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { 
  BookOpen, Camera, Mic, Eye, CheckCircle, PlayCircle, Wrench, 
  Play, Trash2, ChevronLeft, ChevronRight, Sparkles, Check,
  Edit3, Briefcase, MessageSquare, AlertTriangle, Volume2, Award, Heart,
  ArrowLeft, User
} from 'lucide-vue-next'
import PhotoUploadZone from '@/components/shared/PhotoUploadZone.vue'
import StoryPreview from '@/components/shared/StoryPreview.vue'

const { t } = useI18n()
const router = useRouter()

// Component state
const currentStep = ref(1)
const isRecording = ref(false)
const audioRecording = ref(null)
const recordingDuration = ref(0)
const isPublishing = ref(false)

// Story data
const storyData = ref({
  title: '',
  projectType: '',
  introduction: '',
  beforePhotos: [],
  processPhotos: [],
  afterPhotos: [],
  voiceRecording: null,
  skills: [],
  customerImpact: ''
})

// Enhanced Configuration with Cultural Elements
const storySteps = [
  { 
    title: t('stories.steps.setup') || 'Setup', 
    subtitle: 'Project details',
    icon: BookOpen,
    color: 'orange'
  },
  { 
    title: t('stories.steps.photos') || 'Photos', 
    subtitle: 'Visual story',
    icon: Camera,
    color: 'green'
  },
  { 
    title: t('stories.steps.voice') || 'Voice & Skills', 
    subtitle: 'Your expertise',
    icon: Mic,
    color: 'blue'
  },
  { 
    title: t('stories.steps.preview') || 'Preview', 
    subtitle: 'Final review',
    icon: Eye,
    color: 'purple'
  }
]

const projectTypes = [
  { 
    id: 'emergency', 
    name: 'Emergency Repair', 
    emoji: '🚨', 
    color: 'red',
    description: 'Urgent fixes'
  },
  { 
    id: 'installation', 
    name: 'New Installation', 
    emoji: '🔌', 
    color: 'blue',
    description: 'Fresh setups'
  },
  { 
    id: 'upgrade', 
    name: 'Upgrade/Renovation', 
    emoji: '⚡', 
    color: 'yellow',
    description: 'Improvements'
  },
  { 
    id: 'maintenance', 
    name: 'Maintenance', 
    emoji: '🔧', 
    color: 'green',
    description: 'Regular care'
  },
  { 
    id: 'consultation', 
    name: 'Consultation', 
    emoji: '💡', 
    color: 'purple',
    description: 'Expert advice'
  },
  { 
    id: 'custom', 
    name: 'Custom Project', 
    emoji: '🏗️', 
    color: 'orange',
    description: 'Unique solutions'
  }
]

const availableSkills = [
  'Problem Diagnosis', 'Emergency Response', 'Customer Communication',
  'Safety Compliance', 'Quality Workmanship', 'Time Management',
  'Creative Solutions', 'Technical Expertise', 'Tool Mastery',
  'Cultural Sensitivity', 'Multilingual Support', 'Innovation'
]

// Enhanced Computed Properties
const canProceedToNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return storyData.value.title.trim() && 
             storyData.value.projectType && 
             storyData.value.introduction.trim()
    case 2:
      return storyData.value.beforePhotos.length > 0 && 
             storyData.value.afterPhotos.length > 0
    case 3:
      return storyData.value.skills.length > 0
    default:
      return true
  }
})

// Enhanced Methods
const getStepActiveColor = (index) => {
  const colors = [
    'bg-orange-500 border-orange-500 text-white',
    'bg-green-500 border-green-500 text-white', 
    'bg-blue-500 border-blue-500 text-white',
    'bg-purple-500 border-purple-500 text-white'
  ]
  return colors[index] || 'bg-gray-500 border-gray-500 text-white'
}

const getStepTextColor = (index) => {
  const colors = ['text-orange-600', 'text-green-600', 'text-blue-600', 'text-purple-600']
  return colors[index] || 'text-gray-600'
}

const nextStep = () => {
  if (canProceedToNext.value && currentStep.value < 4) {
    currentStep.value++
  }
}

const toggleSkill = (skill) => {
  const index = storyData.value.skills.indexOf(skill)
  if (index > -1) {
    storyData.value.skills.splice(index, 1)
  } else {
    storyData.value.skills.push(skill)
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startRecording = () => {
  isRecording.value = true
  recordingDuration.value = 0
  
  // Simulate recording duration counter
  const interval = setInterval(() => {
    recordingDuration.value++
    if (recordingDuration.value >= 60) {
      stopRecording()
      clearInterval(interval)
    }
  }, 1000)
  
  // Store interval to clear later
  window.recordingInterval = interval
}

const stopRecording = () => {
  isRecording.value = false
  if (window.recordingInterval) {
    clearInterval(window.recordingInterval)
  }
  // Save recording
  audioRecording.value = { duration: recordingDuration.value }
}

const playRecording = () => {
  // Implement playback
  console.log('Playing recording...')
}

const deleteRecording = () => {
  audioRecording.value = null
  recordingDuration.value = 0
}

const saveDraft = () => {
  // Save to localStorage or API
  localStorage.setItem('workStoryDraft', JSON.stringify(storyData.value))
  console.log('Draft saved!', storyData.value)
  
  // Show toast notification
  // You could integrate with your notification system here
}

const publishStory = async () => {
  isPublishing.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Story published!', storyData.value)
    
    // Clear draft
    localStorage.removeItem('workStoryDraft')
    
    // Redirect to success page or provider dashboard
    router.push('/app/provider/dashboard?story=published')
    
  } catch (error) {
    console.error('Publishing failed:', error)
    // Handle error - show notification
  } finally {
    isPublishing.value = false
  }
}

// Load draft on mount
onMounted(() => {
  // Load existing draft if available
  const savedDraft = localStorage.getItem('workStoryDraft')
  if (savedDraft) {
    try {
      const draftData = JSON.parse(savedDraft)
      storyData.value = { ...storyData.value, ...draftData }
    } catch (error) {
      console.error('Error loading draft:', error)
    }
  }
  
  console.log('Enhanced Work Story Builder initialized - Showcasing African craftsmanship!')
})
</script>

<style scoped>
/* Enhanced Cultural Pattern Styles */
.cultural-pattern-header {
  position: relative;
  width: 48px;
  height: 48px;
  margin-right: 12px;
}

.pattern-bar-header-1 { 
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  height: 8px; 
  border-radius: 4px; 
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.pattern-bar-header-2 { 
  background: linear-gradient(135deg, #f7931e, #fbbf24);
  height: 7px; 
  border-radius: 3.5px; 
  margin-top: 3px; 
  margin-left: 4px; 
  box-shadow: 0 2px 6px rgba(247, 147, 30, 0.3);
}

.pattern-bar-header-3 { 
  background: linear-gradient(135deg, #10b981, #059669);
  height: 6px; 
  border-radius: 3px; 
  margin-top: 3px; 
  margin-left: 8px; 
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.pattern-bar-header-4 { 
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  height: 5px; 
  border-radius: 2.5px; 
  margin-top: 3px; 
  margin-left: 12px; 
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
}

/* Background Cultural Pattern */
.cultural-pattern-bg {
  position: absolute;
  inset: 0;
}

.pattern-line {
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  transform: skew(-15deg);
  animation: slidePattern 8s ease-in-out infinite;
}

@keyframes slidePattern {
  0%, 100% { transform: skew(-15deg) translateY(0); }
  50% { transform: skew(-15deg) translateY(-10px); }
}

/* Enhanced Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #10b981 50%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Enhanced Transitions and Animations */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Cultural-inspired animations */
@keyframes pulseAfrican {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.animate-pulse-african {
  animation: pulseAfrican 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Enhanced focus states with cultural colors */
input:focus, textarea:focus {
  box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
}

/* Custom scrollbar for textareas */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #f7931e, #ff6b35);
}

/* Loading spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive enhancements */
@media (max-width: 768px) {
  .cultural-pattern-header {
    width: 36px;
    height: 36px;
  }
  
  .pattern-bar-header-1, 
  .pattern-bar-header-2, 
  .pattern-bar-header-3, 
  .pattern-bar-header-4 {
    height: 4px;
    margin-top: 2px;
  }
}

/* Print styles for story preview */
@media print {
  .bg-gradient-to-r,
  .bg-gradient-to-br {
    background: white !important;
    color: black !important;
  }
}
</style>