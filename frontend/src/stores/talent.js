import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTalentStore = defineStore('talent', () => {
  const talents = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Sample data
  const sampleTalents = ref([
    {
      id: 1,
      name: 'Lydian Kamau',
      skill: 'Beadwork Artist',
      location: 'Nairobi, Kenya',
      rating: 4.8,
      reviewCount: 17,
      description: 'Handcrafted African beaded jewelry using traditional techniques passed down through generations.',
      phone: '+254 712 345 678',
      email: 'lydian.kamau@email.com',
      portfolio: [
        { id: 1, title: 'Necklace', image: '/images/necklace1.jpg' },
        { id: 2, title: 'Bracelet', image: '/images/bracelet1.jpg' },
        { id: 3, title: 'Earrings', image: '/images/earrings1.jpg' },
        { id: 4, title: 'Anklet', image: '/images/anklet1.jpg' }
      ],
      verified: true,
      category: 'Artisans'
    },
    {
      id: 2,
      name: 'John Ochieng',
      skill: 'Wood Carver',
      location: 'Kisumu, Kenya',
      rating: 4.5,
      reviewCount: 12,
      description: 'Traditional wood carving with modern artistic touches. Creating functional and decorative pieces.',
      phone: '+254 723 456 789',
      email: 'john.ochieng@email.com',
      portfolio: [
        { id: 1, title: 'Sculpture', image: '/images/sculpture1.jpg' },
        { id: 2, title: 'Bowl', image: '/images/bowl1.jpg' }
      ],
      verified: true,
      category: 'Artisans'
    }
  ])

  // Getters
  const featuredTalents = computed(() =>
    sampleTalents.value.filter(talent => talent.verified).slice(0, 4)
  )

  const getTalentById = computed(() => (id) =>
    sampleTalents.value.find(talent => talent.id === parseInt(id))
  )

  // Actions
  const fetchTalents = async (filters = {}) => {
    loading.value = true
    try {
      // In real app, make API call here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      talents.value = sampleTalents.value

      // Apply filters
      if (filters.category && filters.category !== 'All') {
        talents.value = talents.value.filter(talent => talent.category === filters.category)
      }

      if (filters.location) {
        talents.value = talents.value.filter(talent =>
          talent.location.toLowerCase().includes(filters.location.toLowerCase())
        )
      }

      if (filters.search) {
        talents.value = talents.value.filter(talent =>
          talent.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          talent.skill.toLowerCase().includes(filters.search.toLowerCase())
        )
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createTalent = async (talentData) => {
    loading.value = true
    try {
      // In real app, make API call here
      const newTalent = {
        id: Date.now(),
        ...talentData,
        rating: 0,
        reviewCount: 0,
        verified: false,
        portfolio: []
      }
      sampleTalents.value.push(newTalent)
      return newTalent
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    talents,
    loading,
    error,
    featuredTalents,
    getTalentById,
    fetchTalents,
    createTalent
  }
})