<!-- ScheduleAppointmentModal.vue - Schedule specific customer appointments -->
<template>
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h3 class="text-xl font-bold text-gray-900">Schedule Appointment</h3>
          <p class="text-gray-600">{{ quote?.customerName }} • {{ quote?.serviceType }}</p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6">
        <!-- Customer Request Summary -->
        <div class="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-blue-900 mb-2">📋 Job Details</h4>
          <div class="space-y-2 text-sm">
            <div><span class="text-blue-700">Service:</span> <span class="font-medium text-blue-900">{{ quote?.serviceType }}</span></div>
            <div><span class="text-blue-700">Location:</span> <span class="text-blue-900">{{ quote?.location }}</span></div>
            <div><span class="text-blue-700">Preferred:</span> <span class="text-blue-900">{{ formatTimeline(quote?.timeline) }}</span></div>
            <div v-if="quote?.description" class="pt-2">
              <span class="text-blue-700">Description:</span>
              <p class="text-blue-900 text-xs mt-1">{{ quote?.description }}</p>
            </div>
          </div>
        </div>

        <!-- Date Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Select Date
          </label>
          <div class="grid grid-cols-7 gap-1 mb-3">
            <!-- Day headers -->
            <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day" 
                 class="text-center text-xs font-medium text-gray-500 py-2">
              {{ day }}
            </div>
            
            <!-- Date cells -->
            <button v-for="date in availableDates" :key="date.dateString"
                    @click="selectedDate = date.dateString"
                    :disabled="date.isPast || date.fullyBooked"
                    :class="[
                      'aspect-square text-sm border rounded transition-colors',
                      selectedDate === date.dateString 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : date.isPast || date.fullyBooked
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                          : 'bg-white text-gray-900 border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                    ]">
              {{ date.day }}
              <div v-if="date.availableSlots > 0 && !date.isPast && !date.fullyBooked" 
                   class="text-xs text-green-600 font-medium">
                {{ date.availableSlots }}
              </div>
            </button>
          </div>
        </div>

        <!-- Time Selection -->
        <div v-if="selectedDate" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Available Time Slots
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="slot in availableTimeSlots" :key="slot.time"
                    @click="selectedTime = slot.time"
                    :disabled="slot.booked"
                    :class="[
                      'p-3 text-sm border rounded-lg transition-colors',
                      selectedTime === slot.time 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : slot.booked
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                          : 'bg-white text-gray-900 border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                    ]">
              {{ formatTime(slot.time) }}
              <div v-if="slot.booked" class="text-xs text-red-600">Booked</div>
            </button>
          </div>
        </div>

        <!-- Duration Estimate -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Estimated Duration
          </label>
          <select v-model="estimatedDuration" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
            <option value="4">4 hours</option>
            <option value="6">6 hours</option>
            <option value="8">Full day (8 hours)</option>
          </select>
        </div>

        <!-- Additional Notes -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Notes for Appointment (Optional)
          </label>
          <textarea v-model="appointmentNotes" 
                    placeholder="Any special instructions, preparation needed, or additional details..."
                    rows="3"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
        </div>

        <!-- Contact Confirmation -->
        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 class="font-medium text-green-800 mb-2">📞 Customer Contact</h4>
          <div class="space-y-2 text-sm">
            <div class="flex items-center">
              <Phone class="w-4 h-4 text-green-600 mr-2" />
              <span class="text-green-700">{{ quote?.phone }}</span>
            </div>
            <div class="flex items-center">
              <Mail class="w-4 h-4 text-green-600 mr-2" />
              <span class="text-green-700">{{ quote?.email }}</span>
            </div>
          </div>
          <p class="text-xs text-green-600 mt-2">
            Customer will be notified automatically via SMS and email
          </p>
        </div>

        <!-- Appointment Summary -->
        <div v-if="canSchedule" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 class="font-medium text-blue-800 mb-2">📅 Appointment Summary</h4>
          <div class="space-y-1 text-sm text-blue-700">
            <div><strong>Date:</strong> {{ formatSelectedDate() }}</div>
            <div><strong>Time:</strong> {{ formatTime(selectedTime) }}</div>
            <div><strong>Duration:</strong> {{ estimatedDuration }} hour{{ estimatedDuration > 1 ? 's' : '' }}</div>
            <div><strong>End Time:</strong> {{ calculateEndTime() }}</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button @click="closeModal" 
                  class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="scheduleAppointment" 
                  :disabled="!canSchedule"
                  :class="[
                    'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                    canSchedule 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]">
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, Phone, Mail } from 'lucide-vue-next'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  quote: {
    type: Object,
    default: () => null
  }
})

// Emits
const emit = defineEmits(['close', 'schedule'])

// Component state
const selectedDate = ref('')
const selectedTime = ref('')
const estimatedDuration = ref('2')
const appointmentNotes = ref('')

// Sample data - would come from API
const existingBookings = ref([
  { date: '2025-07-21', time: '09:00', duration: 4 },
  { date: '2025-07-22', time: '14:00', duration: 2 },
  { date: '2025-07-23', time: '10:00', duration: 3 }
])

const workingHours = { start: 8, end: 18 }

// Computed properties
const availableDates = computed(() => {
  const dates = []
  const today = new Date()
  
  // Generate next 14 days
  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const dateString = date.toISOString().split('T')[0]
    const dayBookings = existingBookings.value.filter(b => b.date === dateString)
    const maxSlots = (workingHours.end - workingHours.start) / 2 // 2-hour slots
    const availableSlots = maxSlots - dayBookings.length
    
    dates.push({
      date: date,
      day: date.getDate(),
      dateString: dateString,
      isPast: date < today,
      availableSlots: Math.max(0, availableSlots),
      fullyBooked: availableSlots <= 0
    })
  }
  
  return dates
})

const availableTimeSlots = computed(() => {
  if (!selectedDate.value) return []
  
  const slots = []
  const dayBookings = existingBookings.value.filter(b => b.date === selectedDate.value)
  
  // Generate 2-hour slots from 8 AM to 6 PM
  for (let hour = workingHours.start; hour < workingHours.end; hour += 2) {
    const time = `${hour.toString().padStart(2, '0')}:00`
    const isBooked = dayBookings.some(booking => booking.time === time)
    
    slots.push({
      time: time,
      booked: isBooked
    })
  }
  
  return slots
})

const canSchedule = computed(() => {
  return selectedDate.value && selectedTime.value && estimatedDuration.value
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

const formatTimeline = (timeline) => {
  const timelineMap = {
    'asap': 'ASAP',
    'today': 'Today',
    'this_week': 'This week',
    'next_week': 'Next week',
    'within_month': 'Within a month',
    'flexible': 'Flexible'
  }
  return timelineMap[timeline] || timeline
}

const formatSelectedDate = () => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const calculateEndTime = () => {
  if (!selectedTime.value || !estimatedDuration.value) return ''
  
  const [hours, minutes] = selectedTime.value.split(':')
  const startHour = parseInt(hours)
  const endHour = startHour + parseInt(estimatedDuration.value)
  
  const endTime = `${endHour.toString().padStart(2, '0')}:${minutes}`
  return formatTime(endTime)
}

const scheduleAppointment = () => {
  const appointmentData = {
    quote: props.quote,
    date: selectedDate.value,
    time: selectedTime.value,
    duration: parseInt(estimatedDuration.value),
    notes: appointmentNotes.value,
    scheduledAt: new Date().toISOString()
  }
  
  emit('schedule', appointmentData)
  resetForm()
  closeModal()
}

const resetForm = () => {
  selectedDate.value = ''
  selectedTime.value = ''
  estimatedDuration.value = '2'
  appointmentNotes.value = ''
}

const closeModal = () => {
  emit('close')
}

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})
</script>

<style scoped>
/* Custom styling */
.aspect-square {
  aspect-ratio: 1 / 1;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}
</style>