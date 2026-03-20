<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          Satu Link, Semua Konten
        </h1>
        <p class="text-xl md:text-2xl text-white/90 mb-8">
          Bagikan semua yang kamu buat dalam satu halaman keren
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/register" class="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors">
            Buat Halaman - Gratis!
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Creators -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4">Creator Terkenal</h2>
        <p class="text-gray-600 text-center mb-12">Temukan creator keren dan produk mereka</p>

        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>

        <div v-else-if="creators.length === 0" class="text-center py-12 text-gray-500">
          <p>Belum ada creator. Jadilah yang pertama!</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="creator in creators"
            :key="creator.id"
            class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            @click="navigateTo(`/@${creator.username}`)"
          >
            <div class="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-5xl font-bold">
              {{ creator.name?.charAt(0).toUpperCase() }}
            </div>
            <div class="p-4 text-center">
              <h3 class="font-semibold text-gray-900">{{ creator.name }}</h3>
              <p class="text-sm text-gray-500">@{{ creator.username }}</p>
              <p class="text-xs text-pink-600 mt-2">{{ creator.productCount || 0 }} Products</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Browse Links & Products -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4">Jelajahi Konten</h2>
        <p class="text-gray-600 text-center mb-12">Temukan link dan produk dari creator favoritmu</p>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Links Card -->
          <NuxtLink to="/links" class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
            <div class="bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-white text-center">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <h3 class="text-2xl font-bold mb-2">Creator Links</h3>
              <p class="text-white/90">Kumpulan link menarik dari creator</p>
            </div>
            <div class="p-6 text-center">
              <span class="text-pink-600 font-semibold group-hover:text-pink-700">Lihat Semua Links →</span>
            </div>
          </NuxtLink>

          <!-- Products Card -->
          <NuxtLink to="/products" class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
            <div class="bg-gradient-to-br from-pink-500 to-orange-500 p-8 text-white text-center">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 class="text-2xl font-bold mb-2">Products Marketplace</h3>
              <p class="text-white/90">Produk digital dari creator keren</p>
            </div>
            <div class="p-6 text-center">
              <span class="text-pink-600 font-semibold group-hover:text-pink-700">Lihat Semua Produk →</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Kenapa WebsiteKita?</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Satu Link untuk Semua</h3>
            <p class="text-gray-600">Bagikan semua produk, sosial media, dan konten dalam satu halaman keren</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Jual Produk Digital</h3>
            <p class="text-gray-600">Jual ebook, course, preset, template, dan lainnya dengan mudah</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Langsung ke WhatsApp</h3>
            <p class="text-gray-600">Pembeli order langsung melalui WhatsApp - tanpa biaya komisi</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Siap Membuat Halaman Kamu?</h2>
        <p class="text-xl text-white/90 mb-8">Bergabung dengan ribuan creator yang membagikan karya mereka</p>
        <NuxtLink to="/register" class="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors inline-block">
          Mulai Gratis
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
interface CreatorWithCount {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  productCount?: number;
}

const creators = ref<CreatorWithCount[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const pb = useNuxtApp().$pb;

    // Fetch creators (users with role 'creator')
    const users = await pb.collection('users').getFullList({
      filter: 'role = "creator"',
    });

    // Get product counts for each creator
    for (const user of users) {
      const products = await pb.collection('products').getFullList({
        filter: `creator_id = "${user.id}"`,
      });
      creators.value.push({
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        productCount: products.length,
      });
    }
  } catch (error) {
    // Error handled silently in production
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: 'WebsiteKita - One Link, All Your Content',
});
</script>
