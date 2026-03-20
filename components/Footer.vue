<template>
  <footer class="bg-white border-t mt-auto">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="md:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span class="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">WebsiteKita</span>
          </div>
          <p class="text-sm text-gray-600 mb-4">Platform link-in-bio untuk creator menjual produk digital dan berbagi link sosial media.</p>
          <div class="flex gap-3">
            <a href="#" class="w-8 h-8 bg-gray-100 hover:bg-pink-100 rounded-full flex items-center justify-center text-gray-600 hover:text-pink-600 transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" class="w-8 h-8 bg-gray-100 hover:bg-pink-100 rounded-full flex items-center justify-center text-gray-600 hover:text-pink-600 transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        <!-- Menu -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Menu</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/" class="text-gray-600 hover:text-pink-600 transition-colors">Home</NuxtLink></li>
            <li><NuxtLink to="/products" class="text-gray-600 hover:text-pink-600 transition-colors">Products</NuxtLink></li>
            <li><NuxtLink to="/links" class="text-gray-600 hover:text-pink-600 transition-colors">Links</NuxtLink></li>
          </ul>
        </div>

        <!-- Akun -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Akun</h3>
          <ul class="space-y-2 text-sm">
            <li v-if="!authStore.user">
              <NuxtLink to="/login" class="text-gray-600 hover:text-pink-600 transition-colors">Masuk</NuxtLink>
            </li>
            <li v-if="!authStore.user">
              <NuxtLink to="/register" class="text-gray-600 hover:text-pink-600 transition-colors">Daftar</NuxtLink>
            </li>
            <li v-else>
              <NuxtLink to="/dashboard" class="text-gray-600 hover:text-pink-600 transition-colors">Dashboard</NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t mt-8 pt-8 text-center text-sm text-gray-600">
        <p>&copy; {{ new Date().getFullYear() }} WebsiteKita. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
</script>
