<!-- ScheduleManagementModal.vue - Fixed template structure -->
<template>
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h3 class="text-xl font-bold text-gray-900">Schedule Management</h3>
          <p class="text-gray-600">Manage your availability and prevent double-booking</p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6">
        <!-- Current Week View -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-semibold text-gray-900">This Week's Schedule</h4>
            <div class="flex items-center space-x-2">
              <button @click="previousWeek" class="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft class="w-5 h-5" />
              </button>
              <span class="text-sm font-medium px-3">{{ currentWeekDisplay }}</span>
              <button @click="nextWeek" class="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-2 mb-4">
            <!-- Day Headers -->
            <div v-for="day in daysOfWeek" :key="day" 
                 class="text-center text-sm font-medium text-gray-600 py-2">
              {{ day }}
            </div>
            
            <!-- Date Cells -->
            <div v-for="date in weekDates" :key="date.dateString"
                 :class="[
                   'border rounded-lg p-2 min-h-[120px] cursor-pointer transition-colors',
                   date.isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300',
                   date.isPast ? 'bg-gray-50 cursor-not-allowed' : ''
                 ]"
                 @click="!date.isPast && selectDate(date)">
              
              <div class="text-sm font-medium mb-1" :class="date.isPast ? 'text-gray-400' : 'text-gray-900'">
                {{ date.day }}
              </div>
              
              <!-- Bookings for this date -->
              <div class="space-y-1">
                <div v-for="booking in getBookingsForDate(date.dateString)" :key="booking.id"
                     :class="[
                       'text-xs p-1 rounded text-white truncate',
                       booking.status === 'confirmed' ? 'bg-green-500' :
                       booking.status === 'pending' ? 'bg-yellow-500' :
                       'bg-blue-500'
                     ]">
                  {{ booking.time }} - {{ booking.service }}
                </div>
                
                <!-- Available slots indicator -->
                <div v-if="getAvailableSlots(date.dateString) > 0 && !date.isPast"
                     class="text-xs text-green-600 font-medium">
                  {{ getAvailableSlots(date.dateString) }} slots available
                </div>
                
                <!-- Fully booked indicator -->
                <div v-if="getAvailableSlots(date.dateString) === 0 && !date.isPast"
                     class="text-xs text-red-600 font-medium">
                  Fully booked
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Requests Requiring Schedule -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">
            Pending Quote Responses
            <span class="text-sm font-normal text-gray-600">({{ pendingQuotes.length }} need scheduling)</span>
          </h4>
          
          <div class="space-y-3">
            <div v-for="quote in pendingQuotes" :key="quote.id"
                 class="border border-orange-200 bg-orange-50 rounded-lg p-4">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h5 class="font-medium text-gray-900">{{ quote.customerName }}</h5>
                  <p class="text-sm text-gray-600">{{ quote.serviceType }} - {{ quote.location }}</p>
                </div>
                <span class="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
                  Needs Scheduling
                </span>
              </div>
              
              <p class="text-sm text-gray-700 mb-3">{{ quote.description }}</p>
              
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600">
                  <span class="font-medium">Preferred:</span> {{ formatTimeline(quote.timeline) }}
                </div>
                <button @click="scheduleQuote(quote)"
                        class="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
                  Schedule Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button @click="blockTimeSlot"
                  class="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <div class="text-center">
              <Clock class="w-6 h-6 text-gray-500 mx-auto mb-2" />
              <div class="text-sm font-medium text-gray-700">Block Time Slot</div>
              <div class="text-xs text-gray-500">Mark as unavailable</div>
            </div>
          </button>
          
          <button @click="setRecurringAvailability"
                  class="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <div class="text-center">
              <Calendar class="w-6 h-6 text-gray-500 mx-auto mb-2" />
              <div class="text-sm font-medium text-gray-700">Set Weekly Hours</div>
              <div class="text-xs text-gray-500">Recurring availability</div>
            </div>
          </button>
          
          <button @click="viewAllBookings"
                  class="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <div class="text-center">
              <FileText class="w-6 h-6 text-gray-500 mx-auto mb-2" />
              <div class="text-sm font-medium text-gray-700">All Bookings</div>
              <div class="text-xs text-gray-500">Complete schedule</div>
            </div>
          </button>
        </div>

        <!-- Schedule Summary -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h5 class="font-medium text-gray-900 mb-3">This Week's Summary</h5>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ weekStats.totalBookings }}</div>
              <div class="text-xs text-gray-500">Total Bookings</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600">{{ weekStats.confirmedJobs }}</div>
              <div class="text-xs text-gray-500">Confirmed Jobs</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-yellow-600">{{ weekStats.pendingQuotes }}</div>
              <div class="text-xs text-gray-500">Pending Quotes</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-purple-600">{{ weekStats.availableSlots }}</div>
              <div class="text-xs text-gray-500">Available Slots</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Time Block Modal -->
    <TimeBlockModal 
      :is-open="showTimeBlockModal"
      @close="showTimeBlockModal = false"
      @block="handleTimeBlock"
    />

    <!-- Weekly Hours Modal -->
    <WeeklyHoursModal 
      :is-open="showWeeklyHoursModal"
      @close="showWeeklyHoursModal = false"
      @save="handleWeeklySchedule"
    />

    <!-- Schedule Appointment Modal -->
    <ScheduleAppointmentModal 
      :is-open="showAppointmentModal"
      :quote="selectedQuoteForScheduling"
      @close="showAppointmentModal = false"
      @schedule="handleAppointmentScheduled"
    />

    <!-- All Bookings Modal -->
    <AllBookingsModal 
      :is-open="showAllBookingsModal"
      @close="showAllBookingsModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { X, ChevronLeft, ChevronRight, Clock, Calendar, FileText } from 'lucide-vue-next'

// Import the new modals
import TimeBlockModal from './TimeBlockModal.vue'
import WeeklyHoursModal from './WeeklyHoursModal.vue'
import ScheduleAppointmentModal from './ScheduleAppointmentModal.vue'
import AllBookingsModal from './AllBookingsModal.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// Component state
const currentWeekStart = ref(new Date())
const selectedDate = ref(null)

// Modal states
const showTimeBlockModal = ref(false)
const showWeeklyHoursModal = ref(false)
const showAppointmentModal = ref(false)
const showAllBookingsModal = ref(false)
const selectedQuoteForScheduling = ref(null)

// Sample data - would come from API
const bookings = ref([
  {
    id: 1,
    date: '2025-07-21',
    time: '09:00',
    service: 'Home Wiring',
    customer: 'Sarah Johnson',
    status: 'confirmed',
    duration: 4
  },
  {
    id: 2,
    date: '2025-07-22',
    time: '14:00',
    service: 'Socket Install',
    customer: 'David Kimani',
    status: 'pending',
    duration: 2
  },
  {
    id: 3,
    date: '2025-07-23',
    time: '10:00',
    service: 'Emergency Repair',
    customer: 'Grace Wanjiku',
    status: 'confirmed',
    duration: 3
  }
])

const pendingQuotes = ref([
  {
    id: 4,
    customerName: 'Mary Wanjiru',
    serviceType: 'Ceiling Fan Installation',
    location: 'Kilimani, Nairobi',
    description: 'Install 3 ceiling fans in bedrooms',
    timeline: 'this_week',
    quoteAmount: 12000
  },
  {
    id: 5,
    customerName: 'John Mutua',
    serviceType: 'Electrical Inspection',
    location: 'Karen, Nairobi',
    description: 'Full house electrical safety inspection',
    timeline: 'next_week',
    quoteAmount: 8000
  }
])

// Constants
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const workingHours = { start: 8, end: 18 } // 8 AM to 6 PM
const slotDuration = 2 // 2 hours per slot

// Computed properties
const currentWeekDisplay = computed(() => {
  const start = new Date(currentWeekStart.value)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
})

const weekDates = computed(() => {
  const dates = []
  const start = new Date(currentWeekStart.value)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    dates.push({
      date: date,
      day: date.getDate(),
      dateString: date.toISOString().split('T')[0],
      isToday: date.getTime() === today.getTime(),
      isPast: date < today
    })
  }
  
  return dates
})

const weekStats = computed(() => {
  const weekStart = currentWeekStart.value
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  
  const weekBookings = bookings.value.filter(booking => {
    const bookingDate = new Date(booking.date)
    return bookingDate >= weekStart && bookingDate <= weekEnd
  })
  
  return {
    totalBookings: weekBookings.length,
    confirmedJobs: weekBookings.filter(b => b.status === 'confirmed').length,
    pendingQuotes: pendingQuotes.value.length,
    availableSlots: calculateAvailableSlots()
  }
})

// Methods
const getBookingsForDate = (dateString) => {
  return bookings.value.filter(booking => booking.date === dateString)
}

const getAvailableSlots = (dateString) => {
  const dayBookings = getBookingsForDate(dateString)
  const maxSlots = Math.floor((workingHours.end - workingHours.start) / slotDuration)
  return maxSlots - dayBookings.length
}

const calculateAvailableSlots = () => {
  let totalAvailable = 0
  weekDates.value.forEach(date => {
    if (!date.isPast) {
      totalAvailable += getAvailableSlots(date.dateString)
    }
  })
  return totalAvailable
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

const previousWeek = () => {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() - 7)
  currentWeekStart.value = newStart
}

const nextWeek = () => {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() + 7)
  currentWeekStart.value = newStart
}

const selectDate = (date) => {
  selectedDate.value = date
  console.log('Selected date:', date.dateString)
  // Could open a time slot selection modal here
}

const scheduleQuote = (quote) => {
  selectedQuoteForScheduling.value = quote
  showAppointmentModal.value = true
}

const blockTimeSlot = () => {
  showTimeBlockModal.value = true
}

const setRecurringAvailability = () => {
  showWeeklyHoursModal.value = true
}

const viewAllBookings = () => {
  showAllBookingsModal.value = true
}

const handleTimeBlock = (blockData) => {
  console.log('Time blocked:', blockData)
  // Add to blocked slots
  alert(`Time slot blocked: ${blockData.date} from ${blockData.startTime} to ${blockData.endTime}`)
}

const handleWeeklySchedule = (scheduleData) => {
  console.log('Weekly schedule saved:', scheduleData)
  alert(`Weekly schedule updated: ${scheduleData.enabledDays} working days, ${scheduleData.totalHours} hours total`)
}

const handleAppointmentScheduled = (appointmentData) => {
  console.log('Appointment scheduled:', appointmentData)
  // Add to bookings
  const newBooking = {
    id: Date.now(),
    date: appointmentData.date,
    time: appointmentData.time,
    service: appointmentData.quote.serviceType,
    customer: appointmentData.quote.customerName,
    status: 'confirmed',
    duration: appointmentData.duration
  }
  
  bookings.value.push(newBooking)
  
  // Remove from pending quotes
  const quoteIndex = pendingQuotes.value.findIndex(q => q.id === appointmentData.quote.id)
  if (quoteIndex !== -1) {
    pendingQuotes.value.splice(quoteIndex, 1)
  }
  
  alert(`Appointment scheduled for ${appointmentData.quote.customerName} on ${appointmentData.date} at ${appointmentData.time}`)
}

const closeModal = () => {
  emit('close')
}

// Initialize current week to start on Monday
onMounted(() => {
  const today = new Date()
  const monday = new Date(today)
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)
  currentWeekStart.value = monday
})
</script>

<style scoped>
/* Calendar specific styles */
.grid-cols-7 > div {
  min-height: 2rem;
}

/* Hover effects */
.hover\:border-gray-300:hover {
  border-color: #d1d5db;
}

.hover\:border-gray-400:hover {
  border-color: #9ca3af;
}

/* Booking status colors */
.bg-green-500 {
  background-color: #10b981;
}

.bg-yellow-500 {
  background-color: #f59e0b;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}
</style>