<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login</h1>
      
      <div v-if="message" :class="['p-4 mb-4 rounded', messageClass]">
        {{ message }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
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
            class="mt-1 block outline-none px-3 py-2 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Login
        </button>

        <div class="text-center">
          <NuxtLink to="/" class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
            Don't have an account? Register
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

const handleLogin = () => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.username === username.value && u.password === password.value)
    
    if (user) {
      
      localStorage.setItem('currentUser', JSON.stringify({ username: user.username }))
      
      message.value = 'Login successful!'
      messageClass.value = 'bg-green-100 text-green-700'
      
      setTimeout(() => {
        router.push('/products')
      }, 500)
    } else {
      message.value = 'Invalid username or password'
      messageClass.value = 'bg-red-100 text-red-700'
    }
  } catch (error) {
    message.value = 'An error occurred during login'
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