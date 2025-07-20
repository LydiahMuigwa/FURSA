<!-- AllBookingsModal.vue - Complete calendar view with all bookings -->
<template>
  <div v-if="isOpen" @click="closeModal" 
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div @click.stop class="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h3 class="text-xl font-bold text-gray-900">All Bookings</h3>
          <p class="text-gray-600">Complete schedule with past and future appointments</p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6">
        <!-- Calendar Navigation -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <h4 class="text-lg font-semibold text-gray-900">{{ currentMonthDisplay }}</h4>
            <div class="flex items-center space-x-2">
              <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft class="w-5 h-5" />
              </button>
              <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <!-- View Toggle -->
          <div class="flex space-x-2">
            <button @click="currentView = 'month'" 
                    :class="[
                      'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                      currentView === 'month' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]">
              Month
            </button>
            <button @click="currentView = 'list'" 
                    :class="[
                      'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                      currentView === 'list' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]">
              List
            </button>
          </div>
        </div>

        <!-- Month View -->
        <div v-if="currentView === 'month'" class="mb-6">
          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1">
            <!-- Day Headers -->
            <div v-for="day in daysOfWeek" :key="day" 
                 class="text-center text-sm font-medium text-gray-600 py-3 border-b">
              {{ day }}
            </div>
            
            <!-- Date Cells -->
            <div v-for="date in monthDates" :key="date.dateString"
                 :class="[
                   'min-h-[120px] p-2 border border-gray-100 cursor-pointer transition-colors',
                   date.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                   date.isToday ? 'bg-blue-50 border-blue-200' : '',
                   'hover:bg-gray-50'
                 ]"
                 @click="selectDate(date)">
              
              <div :class="[
                'text-sm font-medium mb-1',
                date.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                date.isToday ? 'text-blue-600' : ''
              ]">
                {{ date.day }}
              </div>
              
              <!-- Bookings for this date -->
              <div class="space-y-1">
                <div v-for="booking in getBookingsForDate(date.dateString)" :key="booking.id"
                     :class="[
                       'text-xs p-1 rounded text-white truncate cursor-pointer',
                       booking.status === 'confirmed' ? 'bg-green-500' :
                       booking.status === 'pending' ? 'bg-yellow-500' :
                       booking.status === 'completed' ? 'bg-blue-500' :
                       'bg-gray-500'
                     ]"
                     @click.stop="viewBookingDetails(booking)">
                  {{ booking.time }} {{ booking.customer }}
                </div>
                
                <!-- Show more indicator -->
                <div v-if="getBookingsForDate(date.dateString).length > 3"
                     class="text-xs text-gray-500 font-medium">
                  +{{ getBookingsForDate(date.dateString).length - 3 }} more
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-if="currentView === 'list'" class="space-y-4">
          <!-- Filters -->
          <div class="flex space-x-4 mb-4">
            <select v-model="statusFilter" 
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select v-model="timeFilter" 
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">All Time</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <!-- Booking List -->
          <div class="space-y-3">
            <div v-for="booking in filteredBookings" :key="booking.id"
                 :class="[
                   'border rounded-lg p-4 cursor-pointer transition-colors',
                   booking.status === 'confirmed' ? 'border-green-200 bg-green-50' :
                   booking.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                   booking.status === 'completed' ? 'border-blue-200 bg-blue-50' :
                   'border-gray-200 bg-gray-50'
                 ]"
                 @click="viewBookingDetails(booking)">
              
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h5 class="font-medium text-gray-900">{{ booking.customer }}</h5>
                  <p class="text-sm text-gray-600">{{ booking.service }}</p>
                </div>
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ booking.status }}
                </span>
              </div>
              
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <div class="flex items-center">
                  <Calendar class="w-4 h-4 mr-1" />
                  {{ formatDate(booking.date) }}
                </div>
                <div class="flex items-center">
                  <Clock class="w-4 h-4 mr-1" />
                  {{ formatTime(booking.time) }}
                </div>
                <div class="flex items-center">
                  <MapPin class="w-4 h-4 mr-1" />
                  {{ booking.location }}
                </div>
              </div>
              
              <div v-if="booking.notes" class="mt-2 text-sm text-gray-700">
                {{ booking.notes }}
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ monthStats.total }}</div>
              <div class="text-xs text-gray-500">Total Bookings</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600">{{ monthStats.confirmed }}</div>
              <div class="text-xs text-gray-500">Confirmed</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-yellow-600">{{ monthStats.pending }}</div>
              <div class="text-xs text-gray-500">Pending</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-purple-600">{{ monthStats.revenue }}</div>
              <div class="text-xs text-gray-500">Revenue (KES)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X, ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-vue-next'

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
const currentDate = ref(new Date())
const currentView = ref('month')
const statusFilter = ref('')
const timeFilter = ref('all')
const selectedDate = ref(null)

// Sample comprehensive booking data
const allBookings = ref([
  // Past bookings
  { id: 1, date: '2025-07-15', time: '09:00', customer: 'Sarah Johnson', service: 'Home Wiring', location: 'Karen', status: 'completed', duration: 4, notes: 'Customer very satisfied', revenue: 25000 },
  { id: 2, date: '2025-07-16', time: '14:00', customer: 'Mike Chen', service: 'Socket Install', location: 'Westlands', status: 'completed', duration: 2, revenue: 8500 },
  
  // Current/Future bookings
  { id: 3, date: '2025-07-21', time: '09:00', customer: 'David Kimani', service: 'Electrical Repair', location: 'Kilimani', status: 'confirmed', duration: 3, revenue: 12000 },
  { id: 4, date: '2025-07-22', time: '14:00', customer: 'Grace Wanjiku', service: 'Fan Installation', location: 'Lavington', status: 'pending', duration: 2, revenue: 15000 },
  { id: 5, date: '2025-07-23', time: '10:00', customer: 'John Mutua', service: 'Inspection', location: 'Karen', status: 'confirmed', duration: 1, revenue: 5000 },
  
  // Future bookings
  { id: 6, date: '2025-07-25', time: '11:00', customer: 'Mary Wanjiru', service: 'Ceiling Fans', location: 'Kilimani', status: 'pending', duration: 4, revenue: 18000 },
  { id: 7, date: '2025-07-28', time: '09:00', customer: 'Peter Kiprotich', service: 'Solar Setup', location: 'Kiambu', status: 'confirmed', duration: 6, revenue: 45000 }
])

// Constants
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Computed properties
const currentMonthDisplay = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
})

const monthDates = computed(() => {
  const dates = []
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // Get first day of month and adjust for Monday start
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  const dayOfWeek = (firstDay.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
  startDate.setDate(firstDay.getDate() - dayOfWeek)
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    dates.push({
      date: date,
      day: date.getDate(),
      dateString: date.toISOString().split('T')[0],
      isCurrentMonth: date.getMonth() === month,
      isToday: date.getTime() === today.getTime()
    })
  }
  
  return dates
})

const filteredBookings = computed(() => {
  let filtered = allBookings.value
  
  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(booking => booking.status === statusFilter.value)
  }
  
  // Filter by time
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]
  
  switch (timeFilter.value) {
    case 'upcoming':
      filtered = filtered.filter(booking => booking.date >= todayString)
      break
    case 'past':
      filtered = filtered.filter(booking => booking.date < todayString)
      break
    case 'today':
      filtered = filtered.filter(booking => booking.date === todayString)
      break
    case 'week':
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay() + 1)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date)
        return bookingDate >= weekStart && bookingDate <= weekEnd
      })
      break
    case 'month':
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date)
        return bookingDate.getMonth() === today.getMonth() && 
               bookingDate.getFullYear() === today.getFullYear()
      })
      break
  }
  
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const monthStats = computed(() => {
  const monthBookings = allBookings.value.filter(booking => {
    const bookingDate = new Date(booking.date)
    return bookingDate.getMonth() === currentDate.value.getMonth() && 
           bookingDate.getFullYear() === currentDate.value.getFullYear()
  })
  
  return {
    total: monthBookings.length,
    confirmed: monthBookings.filter(b => b.status === 'confirmed').length,
    pending: monthBookings.filter(b => b.status === 'pending').length,
    revenue: monthBookings.reduce((sum, b) => sum + (b.revenue || 0), 0).toLocaleString()
  }
})

// Methods
const getBookingsForDate = (dateString) => {
  return allBookings.value.filter(booking => booking.date === dateString)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

const previousMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

const selectDate = (date) => {
  selectedDate.value = date
  console.log('Selected date:', date.dateString)
}

const viewBookingDetails = (booking) => {
  console.log('View booking details:', booking)
  alert(`Booking Details:\n\nCustomer: ${booking.customer}\nService: ${booking.service}\nDate: ${formatDate(booking.date)}\nTime: ${formatTime(booking.time)}\nStatus: ${booking.status}\nLocation: ${booking.location}`)
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
/* Custom grid styling */
.grid-cols-7 > div:nth-child(7n) {
  border-right: none;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}

/* Calendar cell hover effects */
.min-h-\[120px\]:hover {
  background-color: #f9fafb;
}
</style>