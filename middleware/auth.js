export default defineNuxtRouteMiddleware((to, from) => {
    // We need to check if we're running on the client side before accessing localStorage
    if (process.client) {
      const currentUser = localStorage.getItem('currentUser')
      
      // If user is not logged in and trying to access protected routes
      if (!currentUser && to.path !== '/login' && to.path !== '/register' && to.path !== '/') {
        return navigateTo('/login')
      }
      
      // If user is logged in and trying to access login/register pages
      if (currentUser && (to.path === '/login' || to.path === '/register')) {
        return navigateTo('/products')
      }
    }
  })