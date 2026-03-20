<template>
  <nav class="bg-white border-b sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span class="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">WebsiteKita</span>
        </NuxtLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-6">
          <NuxtLink to="/" class="text-gray-600 hover:text-pink-600 transition-colors">Home</NuxtLink>
          <NuxtLink to="/products" class="text-gray-600 hover:text-pink-600 transition-colors">Products</NuxtLink>
          <NuxtLink to="/links" class="text-gray-600 hover:text-pink-600 transition-colors">Links</NuxtLink>
        </div>

        <!-- Auth Buttons & Mobile Menu Toggle -->
        <div class="flex items-center gap-3">
          <template v-if="!authStore.user">
            <NuxtLink to="/login" class="hidden md:block text-gray-600 hover:text-pink-600 transition-colors">
              Masuk
            </NuxtLink>
            <NuxtLink to="/register" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Daftar
            </NuxtLink>
          </template>
          <div v-else class="flex items-center gap-3">
            <NuxtLink to="/dashboard" class="hidden md:block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Dashboard
            </NuxtLink>
            <!-- Mobile menu button -->
            <button @click="toggleMobileMenu" class="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t py-4 space-y-3">
        <NuxtLink to="/" class="block px-4 py-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">Home</NuxtLink>
        <NuxtLink to="/products" class="block px-4 py-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">Products</NuxtLink>
        <NuxtLink to="/links" class="block px-4 py-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">Links</NuxtLink>
        <template v-if="!authStore.user">
          <NuxtLink to="/login" class="block px-4 py-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">Masuk</NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/dashboard" class="block px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors font-medium">Dashboard</NuxtLink>
          <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">Logout</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const router = useRouter();
const showMobileMenu = ref(false);

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const handleLogout = async () => {
  const pb = useNuxtApp().$pb;
  await pb.authStore.clear();
  await authStore.initAuth();
  showMobileMenu.value = false;
  router.push('/');
};
</script>
