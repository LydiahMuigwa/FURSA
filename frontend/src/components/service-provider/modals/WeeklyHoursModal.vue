<!-- WeeklyHoursModal.vue - Set recurring weekly working hours -->
<template>
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h3 class="text-xl font-bold text-gray-900">Set Weekly Hours</h3>
          <p class="text-gray-600">Configure your regular working schedule</p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6">
        <!-- Quick Templates -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Quick Templates
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button @click="applyTemplate('standard')"
                    class="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <div class="font-medium text-gray-900">Standard</div>
              <div class="text-xs text-gray-600">Mon-Fri 9AM-5PM</div>
            </button>
            
            <button @click="applyTemplate('extended')"
                    class="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <div class="font-medium text-gray-900">Extended</div>
              <div class="text-xs text-gray-600">Mon-Sat 8AM-6PM</div>
            </button>
            
            <button @click="applyTemplate('flexible')"
                    class="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <div class="font-medium text-gray-900">Flexible</div>
              <div class="text-xs text-gray-600">7 days, custom hours</div>
            </button>
          </div>
        </div>

        <!-- Daily Schedule Configuration -->
        <div class="space-y-4">
          <div v-for="day in weeklySchedule" :key="day.name" 
               class="border border-gray-200 rounded-lg p-4">
            
            <!-- Day Header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <input v-model="day.enabled" 
                       type="checkbox" 
                       class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3" />
                <label class="text-sm font-medium text-gray-900">
                  {{ day.name }}
                </label>
              </div>
              
              <div v-if="day.enabled" class="text-xs text-gray-500">
                {{ calculateDayHours(day) }} hours
              </div>
            </div>

            <!-- Time Configuration -->
            <div v-if="day.enabled" class="space-y-3">
              <!-- Morning Shift -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">
                    Start Time
                  </label>
                  <select v-model="day.startTime" 
                          class="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option v-for="time in timeSlots" :key="time" :value="time">
                      {{ formatTime(time) }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">
                    End Time
                  </label>
                  <select v-model="day.endTime" 
                          class="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option v-for="time in getAvailableEndTimes(day.startTime)" :key="time" :value="time">
                      {{ formatTime(time) }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Break Time -->
              <div class="flex items-center">
                <input v-model="day.hasBreak" 
                       type="checkbox" 
                       class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2" />
                <label class="text-xs text-gray-600">Include lunch break</label>
              </div>

              <div v-if="day.hasBreak" class="grid grid-cols-2 gap-3 ml-6">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">
                    Break Start
                  </label>
                  <select v-model="day.breakStart" 
                          class="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option v-for="time in getBreakTimes(day)" :key="time" :value="time">
                      {{ formatTime(time) }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">
                    Break End
                  </label>
                  <select v-model="day.breakEnd" 
                          class="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option v-for="time in getAvailableEndTimes(day.breakStart)" :key="time" :value="time">
                      {{ formatTime(time) }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 class="font-medium text-blue-900 mb-2">📅 Weekly Summary</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-blue-700">Working Days:</span>
              <span class="font-medium text-blue-900 ml-2">{{ enabledDaysCount }}</span>
            </div>
            <div>
              <span class="text-blue-700">Total Hours:</span>
              <span class="font-medium text-blue-900 ml-2">{{ totalWeeklyHours }} hours</span>
            </div>
          </div>
          
          <!-- Enabled Days List -->
          <div class="mt-2">
            <span class="text-blue-700 text-sm">Schedule:</span>
            <div class="mt-1 space-y-1">
              <div v-for="day in enabledDays" :key="day.name" class="text-xs text-blue-800">
                <span class="font-medium">{{ day.name }}:</span>
                {{ formatTime(day.startTime) }} - {{ formatTime(day.endTime) }}
                <span v-if="day.hasBreak" class="text-blue-600">
                  (Break: {{ formatTime(day.breakStart) }} - {{ formatTime(day.breakEnd) }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3 mt-6">
          <button @click="closeModal" 
                  class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="saveSchedule" 
                  :disabled="!hasValidSchedule"
                  :class="[
                    'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                    hasValidSchedule 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]">
            Save Weekly Schedule
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// Component state
const weeklySchedule = ref([
  { name: 'Monday', enabled: true, startTime: '09:00', endTime: '17:00', hasBreak: true, breakStart: '12:00', breakEnd: '13:00' },
  { name: 'Tuesday', enabled: true, startTime: '09:00', endTime: '17:00', hasBreak: true, breakStart: '12:00', breakEnd: '13:00' },
  { name: 'Wednesday', enabled: true, startTime: '09:00', endTime: '17:00', hasBreak: true, breakStart: '12:00', breakEnd: '13:00' },
  { name: 'Thursday', enabled: true, startTime: '09:00', endTime: '17:00', hasBreak: true, breakStart: '12:00', breakEnd: '13:00' },
  { name: 'Friday', enabled: true, startTime: '09:00', endTime: '17:00', hasBreak: true, breakStart: '12:00', breakEnd: '13:00' },
  { name: 'Saturday', enabled: false, startTime: '10:00', endTime: '16:00', hasBreak: false, breakStart: '', breakEnd: '' },
  { name: 'Sunday', enabled: false, startTime: '10:00', endTime: '16:00', hasBreak: false, breakStart: '', breakEnd: '' }
])

// Constants
const timeSlots = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00'
]

// Computed properties
const enabledDays = computed(() => {
  return weeklySchedule.value.filter(day => day.enabled)
})

const enabledDaysCount = computed(() => {
  return enabledDays.value.length
})

const totalWeeklyHours = computed(() => {
  return enabledDays.value.reduce((total, day) => {
    return total + calculateDayHours(day)
  }, 0)
})

const hasValidSchedule = computed(() => {
  return enabledDays.value.length > 0 && 
         enabledDays.value.every(day => day.startTime && day.endTime)
})

// Methods
const formatTime = (time) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

const getAvailableEndTimes = (startTime) => {
  if (!startTime) return timeSlots
  const startIndex = timeSlots.indexOf(startTime)
  return timeSlots.slice(startIndex + 1)
}

const getBreakTimes = (day) => {
  if (!day.startTime || !day.endTime) return []
  const startIndex = timeSlots.indexOf(day.startTime)
  const endIndex = timeSlots.indexOf(day.endTime)
  return timeSlots.slice(startIndex + 1, endIndex)
}

const calculateDayHours = (day) => {
  if (!day.enabled || !day.startTime || !day.endTime) return 0
  
  const start = timeSlots.indexOf(day.startTime)
  const end = timeSlots.indexOf(day.endTime)
  let totalSlots = end - start
  
  // Subtract break time if applicable
  if (day.hasBreak && day.breakStart && day.breakEnd) {
    const breakStart = timeSlots.indexOf(day.breakStart)
    const breakEnd = timeSlots.indexOf(day.breakEnd)
    totalSlots -= (breakEnd - breakStart)
  }
  
  return totalSlots * 0.5 // Each slot is 30 minutes
}

const applyTemplate = (template) => {
  switch (template) {
    case 'standard':
      weeklySchedule.value.forEach((day, index) => {
        if (index < 5) { // Monday to Friday
          day.enabled = true
          day.startTime = '09:00'
          day.endTime = '17:00'
          day.hasBreak = true
          day.breakStart = '12:00'
          day.breakEnd = '13:00'
        } else {
          day.enabled = false
        }
      })
      break
      
    case 'extended':
      weeklySchedule.value.forEach((day, index) => {
        if (index < 6) { // Monday to Saturday
          day.enabled = true
          day.startTime = '08:00'
          day.endTime = '18:00'
          day.hasBreak = true
          day.breakStart = '12:00'
          day.breakEnd = '13:00'
        } else {
          day.enabled = false
        }
      })
      break
      
    case 'flexible':
      weeklySchedule.value.forEach(day => {
        day.enabled = true
        day.startTime = '08:00'
        day.endTime = '17:00'
        day.hasBreak = false
      })
      break
  }
}

const saveSchedule = () => {
  const scheduleData = {
    weeklySchedule: weeklySchedule.value.filter(day => day.enabled),
    totalHours: totalWeeklyHours.value,
    enabledDays: enabledDaysCount.value
  }
  
  emit('save', scheduleData)
  closeModal()
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
/* Custom checkbox styling */
input[type="checkbox"] {
  accent-color: #2563eb;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}
</style>