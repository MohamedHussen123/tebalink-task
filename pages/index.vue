<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h1 class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Create Account</h1>
        
        <div v-if="message" :class="['p-4 mb-4 rounded', messageClass]">
          {{ message }}
        </div>
  
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="mt-1 outline-none px-3 py-2 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
  
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="mt-1 outline-none px-3 py-2 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Password must be at least 8 characters long and contain at least one number
            </p>
          </div>
  
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Register
          </button>
  
          <div class="text-center">
            <NuxtLink to="/login" class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              Already have an account? Login
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  const username = ref('')
  const password = ref('')
  const message = ref('')
  const messageClass = ref('')
  const router = useRouter()
  
  const validatePassword = (password) => {
    return password.length >= 8 && /\d/.test(password)
  }
  
  const handleRegister = async () => {
    
    message.value = ''
    if (!validatePassword(password.value)) {
      message.value = 'Password must be at least 8 characters long and contain at least one number'
      messageClass.value = 'bg-red-100 text-red-700'
      return
    }
  
    try {
  
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      if (existingUsers.some(user => user.username === username.value)) {
        message.value = 'Username already exists'
        messageClass.value = 'bg-red-100 text-red-700'
        return
      }
  
      existingUsers.push({
        username: username.value,
        password: password.value
      })
      localStorage.setItem('users', JSON.stringify(existingUsers))
  
  
      message.value = 'Registration successful! Redirecting to login...'
      messageClass.value = 'bg-green-100 text-green-700'
  
      username.value = ''
      password.value = ''
  
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/login')
    } catch (error) {
      message.value = 'An error occurred during registration'
      messageClass.value = 'bg-red-100 text-red-700'
    }
  }
  
  
  onMounted(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      router.push('/products')
    }
  })
  </script>