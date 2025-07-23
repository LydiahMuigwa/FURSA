<!-- frontend/src/layouts/AppLayout.vue - Simple layout using SharedNavigation -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Use your existing SharedNavigation -->
    <SharedNavigation />
    
    <!-- Main content area -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import SharedNavigation from '@/components/common/SharedNavigation.vue'
</script>