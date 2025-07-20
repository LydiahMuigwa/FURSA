<!-- WorkStoryBuilder.vue - Revolutionary Professional Storytelling Interface -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ t('stories.builder.title') || 'Tell Your Work Story' }}</h1>
            <p class="text-gray-600 mt-1">{{ t('stories.builder.subtitle') || 'Show the world how you work, not just what you do' }}</p>
          </div>
          <button @click="saveDraft" class="text-blue-600 hover:text-blue-700 font-medium">
            {{ t('common.save_draft') || 'Save Draft' }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div v-for="(step, index) in storySteps" :key="index" class="flex items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all',
              currentStep >= index + 1 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-600'
            ]">
              <Check v-if="currentStep > index + 1" class="w-5 h-5" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span :class="[
              'ml-3 text-sm font-medium transition-colors',
              currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-500'
            ]">
              {{ step.title }}
            </span>
            <div v-if="index < storySteps.length - 1" :class="[
              'w-16 h-0.5 mx-6',
              currentStep > index + 1 ? 'bg-blue-600' : 'bg-gray-200'
            ]"></div>
          </div>
        </div>
      </div>

      <!-- Step 1: Story Setup -->
      <div v-if="currentStep === 1" class="bg-white rounded-xl shadow-sm border p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <BookOpen class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">{{ t('stories.setup.title') || 'What story do you want to tell?' }}</h2>
          <p class="text-gray-600">{{ t('stories.setup.subtitle') || 'Every great project has a story. Share yours.' }}</p>
        </div>

        <div class="space-y-6">
          <!-- Story Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('stories.setup.story_title') || 'Story Title' }}
            </label>
            <input v-model="storyData.title" 
                   type="text" 
                   :placeholder="t('stories.setup.title_placeholder') || 'e.g., Emergency Power Restoration in Kilimani'"
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <!-- Project Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              {{ t('stories.setup.project_type') || 'What type of project was this?' }}
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button v-for="type in projectTypes" :key="type.id"
                      @click="storyData.projectType = type.id"
                      :class="[
                        'p-4 border rounded-lg text-center transition-all',
                        storyData.projectType === type.id 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      ]">
                <div class="text-2xl mb-2">{{ type.emoji }}</div>
                <div class="text-sm font-medium">{{ type.name }}</div>
              </button>
            </div>
          </div>

          <!-- Story Introduction -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('stories.setup.intro') || 'How did this project start?' }}
            </label>
            <textarea v-model="storyData.introduction" 
                      rows="4"
                      :placeholder="t('stories.setup.intro_placeholder') || 'e.g., The customer called me at 8pm during a thunderstorm. Their entire house had lost power and they had a newborn baby...'"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
        </div>
      </div>

      <!-- Step 2: Visual Story -->
      <div v-if="currentStep === 2" class="bg-white rounded-xl shadow-sm border p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Camera class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">{{ t('stories.visual.title') || 'Show your work process' }}</h2>
          <p class="text-gray-600">{{ t('stories.visual.subtitle') || 'Upload photos that tell the story from start to finish' }}</p>
        </div>

        <!-- Photo Upload Sections -->
        <div class="space-y-8">
          <!-- Before Photos -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PlayCircle class="w-5 h-5 mr-2 text-gray-600" />
              {{ t('stories.visual.before') || 'Before: The Challenge' }}
            </h3>
            <PhotoUploadZone 
              :photos="storyData.beforePhotos"
              :placeholder="t('stories.visual.before_placeholder') || 'Show the problem or initial state'"
              @upload="(photos) => storyData.beforePhotos = photos"
              @remove="(index) => storyData.beforePhotos.splice(index, 1)"
            />
          </div>

          <!-- Process Photos -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Wrench class="w-5 h-5 mr-2 text-gray-600" />
              {{ t('stories.visual.process') || 'Process: How You Work' }}
            </h3>
            <PhotoUploadZone 
              :photos="storyData.processPhotos"
              :placeholder="t('stories.visual.process_placeholder') || 'Show your tools, techniques, and problem-solving in action'"
              @upload="(photos) => storyData.processPhotos = photos"
              @remove="(index) => storyData.processPhotos.splice(index, 1)"
            />
          </div>

          <!-- After Photos -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle class="w-5 h-5 mr-2 text-gray-600" />
              {{ t('stories.visual.after') || 'After: The Result' }}
            </h3>
            <PhotoUploadZone 
              :photos="storyData.afterPhotos"
              :placeholder="t('stories.visual.after_placeholder') || 'Show the completed work and happy customer'"
              @upload="(photos) => storyData.afterPhotos = photos"
              @remove="(index) => storyData.afterPhotos.splice(index, 1)"
            />
          </div>
        </div>
      </div>

      <!-- Step 3: Voice & Details -->
      <div v-if="currentStep === 3" class="bg-white rounded-xl shadow-sm border p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Mic class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">{{ t('stories.voice.title') || 'Add your voice' }}</h2>
          <p class="text-gray-600">{{ t('stories.voice.subtitle') || 'Let customers hear your expertise and passion' }}</p>
        </div>

        <div class="space-y-8">
          <!-- Voice Recording -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
              <Mic class="w-5 h-5 mr-2" />
              {{ t('stories.voice.record') || 'Record your explanation (optional)' }}
            </h3>
            
            <div v-if="!isRecording && !audioRecording" class="text-center py-8">
              <button @click="startRecording" 
                      class="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                <Mic class="w-5 h-5 mr-2" />
                {{ t('stories.voice.start_recording') || 'Start Recording' }}
              </button>
              <p class="text-sm text-gray-600 mt-2">
                {{ t('stories.voice.record_tip') || 'Tip: Explain your approach, challenges you solved, or what makes you proud of this work' }}
              </p>
            </div>

            <div v-if="isRecording" class="text-center py-8">
              <div class="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                <Mic class="w-8 h-8 text-white" />
              </div>
              <p class="text-lg font-medium text-gray-900 mb-2">{{ t('stories.voice.recording') || 'Recording...' }}</p>
              <p class="text-sm text-gray-600 mb-4">{{ recordingDuration }}s</p>
              <button @click="stopRecording" 
                      class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                {{ t('stories.voice.stop') || 'Stop Recording' }}
              </button>
            </div>

            <div v-if="audioRecording" class="bg-white rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <button @click="playRecording" class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Play class="w-4 h-4" />
                  </button>
                  <span class="ml-3 text-sm text-gray-600">{{ recordingDuration }}s recording</span>
                </div>
                <button @click="deleteRecording" class="text-red-600 hover:text-red-700">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Skills Demonstrated -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">
              {{ t('stories.skills.title') || 'What skills did this project showcase?' }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="skill in availableSkills" :key="skill"
                      @click="toggleSkill(skill)"
                      :class="[
                        'px-3 py-2 rounded-full text-sm font-medium transition-colors',
                        storyData.skills.includes(skill)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      ]">
                {{ skill }}
              </button>
            </div>
          </div>

          <!-- Customer Impact -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('stories.impact.title') || 'What was the impact for the customer?' }}
            </label>
            <textarea v-model="storyData.customerImpact" 
                      rows="3"
                      :placeholder="t('stories.impact.placeholder') || 'e.g., Family could safely stay in their home during the storm, baby stayed warm and comfortable...'"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
        </div>
      </div>

      <!-- Step 4: Story Preview -->
      <div v-if="currentStep === 4" class="bg-white rounded-xl shadow-sm border p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Eye class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">{{ t('stories.preview.title') || 'Your story preview' }}</h2>
          <p class="text-gray-600">{{ t('stories.preview.subtitle') || 'This is how your story will appear to customers' }}</p>
        </div>

        <!-- Story Preview -->
        <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
          <StoryPreview :storyData="storyData" />
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between items-center mt-8 pt-6 border-t">
        <button v-if="currentStep > 1" 
                @click="currentStep--"
                class="flex items-center px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors">
          <ChevronLeft class="w-4 h-4 mr-1" />
          {{ t('common.back') || 'Back' }}
        </button>
        <div v-else></div>

        <button v-if="currentStep < 4" 
                @click="nextStep"
                :disabled="!canProceedToNext"
                class="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {{ t('common.next') || 'Next' }}
          <ChevronRight class="w-4 h-4 ml-1" />
        </button>
        
        <button v-else 
                @click="publishStory"
                :disabled="isPublishing"
                class="flex items-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all shadow-lg">
          <Sparkles v-if="!isPublishing" class="w-4 h-4 mr-2" />
          <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          {{ isPublishing ? (t('stories.publishing') || 'Publishing...') : (t('stories.publish') || 'Publish Story') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  BookOpen, Camera, Mic, Eye, CheckCircle, PlayCircle, Wrench, 
  Play, Trash2, ChevronLeft, ChevronRight, Sparkles, Check
} from 'lucide-vue-next'
import PhotoUploadZone from '@/components/shared/PhotoUploadZone.vue'
import StoryPreview from '@/components/shared/StoryPreview.vue'

const { t } = useI18n()

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

// Configuration
const storySteps = [
  { title: t('stories.steps.setup') || 'Setup' },
  { title: t('stories.steps.photos') || 'Photos' },
  { title: t('stories.steps.voice') || 'Voice' },
  { title: t('stories.steps.preview') || 'Preview' }
]

const projectTypes = [
  { id: 'emergency', name: 'Emergency Repair', emoji: '🚨' },
  { id: 'installation', name: 'New Installation', emoji: '🔌' },
  { id: 'upgrade', name: 'Upgrade/Renovation', emoji: '⚡' },
  { id: 'maintenance', name: 'Maintenance', emoji: '🔧' },
  { id: 'consultation', name: 'Consultation', emoji: '💡' },
  { id: 'custom', name: 'Custom Project', emoji: '🏗️' }
]

const availableSkills = [
  'Problem Diagnosis', 'Emergency Response', 'Customer Communication',
  'Safety Compliance', 'Quality Workmanship', 'Time Management',
  'Creative Solutions', 'Technical Expertise', 'Tool Mastery'
]

// Computed properties
const canProceedToNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return storyData.value.title && storyData.value.projectType && storyData.value.introduction
    case 2:
      return storyData.value.beforePhotos.length > 0 && storyData.value.afterPhotos.length > 0
    case 3:
      return storyData.value.skills.length > 0
    default:
      return true
  }
})

// Methods
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

const startRecording = () => {
  isRecording.value = true
  recordingDuration.value = 0
  // Implement actual recording logic here
}

const stopRecording = () => {
  isRecording.value = false
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
  console.log('Saving draft...', storyData.value)
}

const publishStory = async () => {
  isPublishing.value = true
  try {
    // Publish story logic
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Story published!', storyData.value)
    // Redirect to profile or success page
  } catch (error) {
    console.error('Publishing failed:', error)
  } finally {
    isPublishing.value = false
  }
}

onMounted(() => {
  console.log('Work Story Builder initialized - Ready to revolutionize professional storytelling!')
})
</script>

<style scoped>
/* Custom animations for the revolutionary experience */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>