<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h1 class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Profile</h1>
        
        <div v-if="message" :class="['p-4 mb-4 rounded', messageClass]">
          {{ message }}
        </div>
  
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Username</h2>
          <p class="text-gray-700 dark:text-gray-300">{{ currentUser?.username }}</p>
        </div>
  
        <form @submit.prevent="handlePasswordUpdate" class="space-y-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
            <input
              id="currentPassword"
              v-model="currentPassword"
              type="password"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
  
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm outline-none px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Password must be at least 8 characters long and contain at least one number
            </p>
          </div>
  
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="mt-1 outline-none px-3 py-2 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
  
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update Password
          </button>
        </form>
  
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="handleLogout"
            class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const currentPassword = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const message = ref('')
  const messageClass = ref('')
  const router = useRouter()
  const currentUser = ref(null)
  
  onMounted(() => {
    const loggedInUser = localStorage.getItem('currentUser')
    if (!loggedInUser) {
      router.push('/login')
      return
    }
    currentUser.value = JSON.parse(loggedInUser)
  })
  
  const validatePassword = (password) => {
    return password.length >= 8 && /\d/.test(password)
  }
  
  const handlePasswordUpdate = () => {
    
    message.value = ''
    
    if (!validatePassword(newPassword.value)) {
      message.value = 'New password must be at least 8 characters long and contain at least one number'
      messageClass.value = 'bg-red-100 text-red-700'
      return
    }
  
    if (newPassword.value !== confirmPassword.value) {
      message.value = 'New passwords do not match'
      messageClass.value = 'bg-red-100 text-red-700'
      return
    }
  
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex(u => u.username === currentUser.value.username)
      
      if (userIndex === -1) {
        message.value = 'User not found'
        messageClass.value = 'bg-red-100 text-red-700'
        return
      }

      if (users[userIndex].password !== currentPassword.value) {
        message.value = 'Current password is incorrect'
        messageClass.value = 'bg-red-100 text-red-700'
        return
      }
  
      
      users[userIndex].password = newPassword.value
      localStorage.setItem('users', JSON.stringify(users))
      message.value = 'Password updated successfully'
      messageClass.value = 'bg-green-100 text-green-700'
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    } catch (error) {
      message.value = 'An error occurred while updating password'
      messageClass.value = 'bg-red-100 text-red-700'
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }
  </script>