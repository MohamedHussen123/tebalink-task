<template>
  <div class="dark:bg-gray-900">
    <NuxtPage />
  </div>
</template>

<script setup>
onMounted(() => {
  // Check for dark mode preference on initial load
  const darkMode = localStorage.getItem('darkMode')
  if (darkMode === 'true') {
    document.documentElement.classList.add('dark')
  }
})
</script>