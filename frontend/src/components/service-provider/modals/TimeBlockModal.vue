<!-- TimeBlockModal.vue - Block specific time slots as unavailable -->
<template>
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white rounded-xl max-w-md w-full">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h3 class="text-xl font-bold text-gray-900">Block Time Slot</h3>
          <p class="text-gray-600">Mark specific times as unavailable</p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6">
        <!-- Date Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input v-model="selectedDate" 
                 type="date" 
                 :min="today"
                 class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <!-- Time Range Selection -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <select v-model="startTime" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select start time</option>
              <option v-for="time in timeSlots" :key="time" :value="time">
                {{ formatTime(time) }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <select v-model="endTime" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select end time</option>
              <option v-for="time in availableEndTimes" :key="time" :value="time">
                {{ formatTime(time) }}
              </option>
            </select>
          </div>
        </div>

        <!-- Reason for Blocking -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Reason (Optional)
          </label>
          <select v-model="reason" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3">
            <option value="">Select reason</option>
            <option value="personal">Personal Time</option>
            <option value="maintenance">Equipment Maintenance</option>
            <option value="travel">Travel Time</option>
            <option value="break">Break/Lunch</option>
            <option value="meeting">Meeting/Appointment</option>
            <option value="other">Other</option>
          </select>
          
          <textarea v-if="reason === 'other'" 
                    v-model="customReason" 
                    placeholder="Enter specific reason..."
                    rows="2"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
        </div>

        <!-- Recurring Options -->
        <div class="mb-6">
          <label class="flex items-center">
            <input v-model="isRecurring" 
                   type="checkbox" 
                   class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span class="ml-2 text-sm font-medium text-gray-700">Make this recurring</span>
          </label>
          
          <div v-if="isRecurring" class="mt-3 p-3 bg-blue-50 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Repeat every:
            </label>
            <div class="flex flex-wrap gap-2">
              <label v-for="day in daysOfWeek" :key="day.value" 
                     class="flex items-center">
                <input v-model="recurringDays" 
                       :value="day.value" 
                       type="checkbox" 
                       class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span class="ml-1 text-sm text-gray-700">{{ day.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div v-if="canPreview" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 class="font-medium text-red-800 mb-2">⚠️ Time Block Preview</h4>
          <div class="text-sm text-red-700">
            <p><strong>Date:</strong> {{ formatDate(selectedDate) }}</p>
            <p><strong>Time:</strong> {{ formatTime(startTime) }} - {{ formatTime(endTime) }}</p>
            <p v-if="reason"><strong>Reason:</strong> {{ getReasonDisplay() }}</p>
            <p v-if="isRecurring"><strong>Recurring:</strong> Every {{ recurringDays.join(', ') }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button @click="closeModal" 
                  class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="blockTimeSlot" 
                  :disabled="!canBlock"
                  :class="[
                    'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                    canBlock 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]">
            Block Time Slot
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
const emit = defineEmits(['close', 'block'])

// Component state
const selectedDate = ref('')
const startTime = ref('')
const endTime = ref('')
const reason = ref('')
const customReason = ref('')
const isRecurring = ref(false)
const recurringDays = ref([])

// Constants
const today = new Date().toISOString().split('T')[0]

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
]

const daysOfWeek = [
  { value: 'Mon', label: 'Mon' },
  { value: 'Tue', label: 'Tue' },
  { value: 'Wed', label: 'Wed' },
  { value: 'Thu', label: 'Thu' },
  { value: 'Fri', label: 'Fri' },
  { value: 'Sat', label: 'Sat' },
  { value: 'Sun', label: 'Sun' }
]

// Computed properties
const availableEndTimes = computed(() => {
  if (!startTime.value) return []
  const startIndex = timeSlots.indexOf(startTime.value)
  return timeSlots.slice(startIndex + 1)
})

const canBlock = computed(() => {
  return selectedDate.value && startTime.value && endTime.value
})

const canPreview = computed(() => {
  return selectedDate.value && startTime.value && endTime.value
})

// Methods
const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getReasonDisplay = () => {
  const reasonMap = {
    'personal': 'Personal Time',
    'maintenance': 'Equipment Maintenance',
    'travel': 'Travel Time',
    'break': 'Break/Lunch',
    'meeting': 'Meeting/Appointment',
    'other': customReason.value || 'Other'
  }
  return reasonMap[reason.value] || reason.value
}

const blockTimeSlot = () => {
  const blockData = {
    date: selectedDate.value,
    startTime: startTime.value,
    endTime: endTime.value,
    reason: reason.value,
    customReason: customReason.value,
    isRecurring: isRecurring.value,
    recurringDays: isRecurring.value ? recurringDays.value : []
  }
  
  emit('block', blockData)
  resetForm()
  closeModal()
}

const resetForm = () => {
  selectedDate.value = ''
  startTime.value = ''
  endTime.value = ''
  reason.value = ''
  customReason.value = ''
  isRecurring.value = false
  recurringDays.value = []
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