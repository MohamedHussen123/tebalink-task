<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <!-- Header with Profile Icon -->
      <div class="max-w-4xl mx-auto flex justify-end mb-4">
        <NuxtLink
          to="/profile"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </NuxtLink>
      </div>
  
      <!-- Add Product Form -->
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add New Product</h2>
        <form @submit.prevent="handleAddProduct" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              v-model="newProduct.name"
              type="text"
              required
              class="mt-1 outline-none px-3 py-2 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
            <input
              v-model="newProduct.price"
              type="number"
              step="0.01"
              required
              class="mt-1 block w-full outline-none px-3 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              v-model="newProduct.category"
              required
              class="mt-1 outline-none px-3 py-2 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Food">Food</option>
            </select>
          </div>
          <div class="md:col-span-3">
            <button
              type="submit"
              class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
  
      <!-- Products Table -->
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
            <div class="flex items-center space-x-4">
              <button
                @click="toggleDarkMode"
                class="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {{ isDarkMode ? '🌞' : '🌙' }}
              </button>
              <select
                v-model="sortBy"
                class="rounded-md outline-none px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="category">Sort by Category</option>
              </select>
              <button
                @click="toggleSortDirection"
                class="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </button>
            </div>
          </div>
  
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-if="editingProduct?.id === product.id"
                      v-model="editingProduct.name"
                      class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span v-else class="text-gray-900 dark:text-white">{{ product.name }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-if="editingProduct?.id === product.id"
                      v-model="editingProduct.price"
                      type="number"
                      step="0.01"
                      class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span v-else class="text-gray-900 dark:text-white">${{ product.price }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <select
                      v-if="editingProduct?.id === product.id"
                      v-model="editingProduct.category"
                      class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Books">Books</option>
                      <option value="Food">Food</option>
                    </select>
                    <span v-else class="text-gray-900 dark:text-white">{{ product.category }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <template v-if="editingProduct?.id === product.id">
                      <button
                        @click="saveEdit"
                        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Save
                      </button>
                      <button
                        @click="cancelEdit"
                        class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </template>
                    <template v-else>
                      <button
                        @click="startEdit(product)"
                        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteProduct(product.id)"
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Pagination -->
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center">
              <label class="mr-2 text-sm text-gray-700 dark:text-gray-300">Items per page:</label>
              <select
                v-model="itemsPerPage"
                class="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
              </select>
            </div>
            <div class="flex space-x-2">
              <button
                :disabled="currentPage === 1"
                @click="currentPage--"
                :class="[
                  'px-3 py-1 rounded-md',
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                ]"
              >
                Previous
              </button>
              <button
                :disabled="currentPage >= totalPages"
                @click="currentPage++"
                :class="[
                  'px-3 py-1 rounded-md',
                  currentPage >= totalPages
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                ]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const isDarkMode = ref(false)
  const products = ref([])
  const newProduct = ref({
    name: '',
    price: '',
    category: 'Electronics'
  })
  const editingProduct = ref(null)
  const sortBy = ref('name')
  const sortDirection = ref('asc')
  const currentPage = ref(1)
  const itemsPerPage = ref(5)
  
  onMounted(() => {
    const darkModePreference = localStorage.getItem('darkMode')
    if (darkModePreference === 'true') {
      isDarkMode.value = true
      document.documentElement.classList.add('dark')
    }
  
    const storedProducts = localStorage.getItem('products')
    if (storedProducts) {
      products.value = JSON.parse(storedProducts)
    } else {
  
      products.value = [
        { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
        { id: 2, name: 'T-Shirt', price: 19.99, category: 'Clothing' },
        { id: 3, name: 'Book', price: 9.99, category: 'Books' },
        { id: 4, name: 'Smartphone', price: 699.99, category: 'Electronics' },
        { id: 5, name: 'Jeans', price: 49.99, category: 'Clothing' }
      ]
      saveToLocalStorage()
    }
  })
  
  
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value)
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  
  const sortedProducts = computed(() => {
    return [...products.value].sort((a, b) => {
      const aValue = sortBy.value === 'price' ? Number(a[sortBy.value]) : a[sortBy.value]
      const bValue = sortBy.value === 'price' ? Number(b[sortBy.value]) : b[sortBy.value]
      
      if (sortDirection.value === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  })
  
  const toggleSortDirection = () => {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  }
  
  
  const totalPages = computed(() => Math.ceil(sortedProducts.value.length / itemsPerPage.value))
  
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return sortedProducts.value.slice(start, end)
  })
  
  watch([itemsPerPage, sortedProducts], () => {
    currentPage.value = 1
  })
  
  const handleAddProduct = () => {
    const product = {
      id: Date.now(),
      name: newProduct.value.name,
      price: Number(newProduct.value.price),
      category: newProduct.value.category
    }
    products.value.push(product)
    saveToLocalStorage()
    newProduct.value = {
      name: '',
      price: '',
      category: 'Electronics'
    }
  }
  
  const startEdit = (product) => {
    editingProduct.value = { ...product }
  }
  
  const saveEdit = () => {
    const index = products.value.findIndex(p => p.id === editingProduct.value.id)
    if (index !== -1) {
      products.value[index] = {
        ...editingProduct.value,
        price: Number(editingProduct.value.price)
      }
      saveToLocalStorage()
    }
    editingProduct.value = null
  }
  
  const cancelEdit = () => {
    editingProduct.value = null
  }
  
  const deleteProduct = (id) => {
    products.value = products.value.filter(p => p.id !== id)
    saveToLocalStorage()
  }
  
  const saveToLocalStorage = () => {
    localStorage.setItem('products', JSON.stringify(products.value))
  }
  </script>
  
  <style>
  /* Add Tailwind dark mode support */
  :root {
    color-scheme: light dark;
  }
  </style>