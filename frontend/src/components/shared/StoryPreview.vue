<!-- StoryPreview.vue - Shows how the story will look to customers -->
<template>
  <div class="story-preview bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Story Header -->
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ storyData.title || 'Your Story Title' }}</h3>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span v-if="storyData.projectType" class="flex items-center">
                <span class="mr-1">{{ getProjectTypeEmoji() }}</span>
                {{ getProjectTypeName() }}
              </span>
              <span class="flex items-center">
                <Clock class="w-4 h-4 mr-1" />
                {{ formatDate(new Date()) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Story Content -->
      <div class="p-6">
        <!-- Introduction -->
        <div v-if="storyData.introduction" class="mb-6">
          <h4 class="font-semibold text-gray-900 mb-2">The Challenge</h4>
          <p class="text-gray-700 leading-relaxed">{{ storyData.introduction }}</p>
        </div>

        <!-- Photo Journey -->
        <div class="space-y-6">
          <!-- Before Photos -->
          <div v-if="storyData.beforePhotos && storyData.beforePhotos.length > 0">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
              <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                <PlayCircle class="w-4 h-4 text-red-600" />
              </div>
              Before: The Problem
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="(photo, index) in storyData.beforePhotos" :key="index"
                   class="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img :src="photo.preview || photo.url" 
                     :alt="`Before photo ${index + 1}`"
                     class="w-full h-full object-cover">
              </div>
            </div>
          </div>

          <!-- Process Photos -->
          <div v-if="storyData.processPhotos && storyData.processPhotos.length > 0">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
              <div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                <Wrench class="w-4 h-4 text-yellow-600" />
              </div>
              My Process
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div v-for="(photo, index) in storyData.processPhotos" :key="index"
                   class="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img :src="photo.preview || photo.url" 
                     :alt="`Process photo ${index + 1}`"
                     class="w-full h-full object-cover">
              </div>
            </div>
          </div>

          <!-- After Photos -->
          <div v-if="storyData.afterPhotos && storyData.afterPhotos.length > 0">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
              <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <CheckCircle class="w-4 h-4 text-green-600" />
              </div>
              After: The Result
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="(photo, index) in storyData.afterPhotos" :key="index"
                   class="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img :src="photo.preview || photo.url" 
                     :alt="`After photo ${index + 1}`"
                     class="w-full h-full object-cover">
              </div>
            </div>
          </div>
        </div>

        <!-- Voice Recording -->
        <div v-if="storyData.voiceRecording" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
            <Mic class="w-5 h-5 mr-2 text-blue-600" />
            Listen to My Explanation
          </h4>
          <div class="flex items-center space-x-3">
            <button class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <Play class="w-4 h-4" />
            </button>
            <div class="flex-1">
              <div class="h-2 bg-blue-200 rounded-full">
                <div class="h-full bg-blue-600 rounded-full w-0 transition-all duration-300"></div>
              </div>
            </div>
            <span class="text-sm text-blue-600 font-medium">{{ formatTime(storyData.voiceRecording.duration || 0) }}</span>
          </div>
        </div>

        <!-- Skills Demonstrated -->
        <div v-if="storyData.skills && storyData.skills.length > 0" class="mt-6">
          <h4 class="font-semibold text-gray-900 mb-3">Skills Demonstrated</h4>
          <div class="flex flex-wrap gap-2">
            <span v-for="skill in storyData.skills" :key="skill"
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Customer Impact -->
        <div v-if="storyData.customerImpact" class="mt-6">
          <h4 class="font-semibold text-gray-900 mb-2">Customer Impact</h4>
          <div class="p-4 bg-green-50 rounded-lg border border-green-200">
            <p class="text-green-800 leading-relaxed">{{ storyData.customerImpact }}</p>
          </div>
        </div>
      </div>

      <!-- Story Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button class="flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <Heart class="w-4 h-4 mr-1" />
              Like this story
            </button>
            <button class="flex items-center text-gray-600 hover:text-gray-700">
              <Share2 class="w-4 h-4 mr-1" />
              Share
            </button>
          </div>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Request Quote
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  Clock, PlayCircle, Wrench, CheckCircle, Mic, Play, Heart, Share2
} from 'lucide-vue-next'

const props = defineProps({
  storyData: {
    type: Object,
    required: true
  }
})

const projectTypes = {
  emergency: { name: 'Emergency Repair', emoji: '🚨' },
  installation: { name: 'New Installation', emoji: '🔌' },
  upgrade: { name: 'Upgrade/Renovation', emoji: '⚡' },
  maintenance: { name: 'Maintenance', emoji: '🔧' },
  consultation: { name: 'Consultation', emoji: '💡' },
  custom: { name: 'Custom Project', emoji: '🏗️' }
}

const getProjectTypeEmoji = () => {
  return projectTypes[props.storyData.projectType]?.emoji || '🔧'
}

const getProjectTypeName = () => {
  return projectTypes[props.storyData.projectType]?.name || 'Project'
}

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}
</style>