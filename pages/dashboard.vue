<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <div class="lg:hidden bg-white border-b sticky top-0 z-20">
      <div class="px-4 py-3 flex justify-between items-center">
        <h1 class="text-lg font-bold text-gray-900">Dashboard</h1>
        <button @click="showSidebar = !showSidebar" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex">
      <!-- Sidebar -->
      <aside
        :class="[
          'fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-white border-r transition-transform duration-300 ease-in-out overflow-y-auto',
          showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
      >
        <!-- Sidebar Header -->
        <div class="p-6 border-b">
          <NuxtLink to="/" class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span class="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">WebsiteKita</span>
          </NuxtLink>
          <p class="text-xs text-gray-500">Kelola konten & toko Anda</p>
        </div>

        <!-- Sidebar Navigation -->
        <nav class="p-4 space-y-1">
          <button
            v-for="item in sidebarItems"
            :key="item.id"
            @click="activeTab = item.id; showSidebar = false"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
              activeTab === item.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-[1.02]'
                : 'text-gray-600 hover:bg-gray-50'
            ]"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
            <span v-if="item.badge" :class="[
              'ml-auto px-2 py-0.5 rounded-full text-xs',
              activeTab === item.id ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-600'
            ]">
              {{ item.badge }}
            </span>
          </button>
        </nav>

        <!-- User Info -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
              {{ userInitial }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-500 truncate">@{{ authStore.user?.username }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Overlay for mobile -->
      <div
        v-if="showSidebar"
        @click="showSidebar = false"
        class="fixed inset-0 bg-black/50 z-20 lg:hidden"
      ></div>

      <!-- Main Content -->
      <main class="flex-1 min-w-0">
        <!-- Desktop Header -->
        <div class="hidden lg:block bg-white border-b px-8 py-6">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p class="text-sm text-gray-500 mt-1">Kelola produk, link, dan pengaturan toko Anda</p>
            </div>
            <div class="flex items-center gap-3">
              <NuxtLink :to="`/@${username}`" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Lihat Toko
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Content Container -->
        <div class="p-4 lg:p-8">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
            <div class="text-center">
              <div class="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto mb-4"></div>
              <p class="text-gray-500">Memuat dashboard...</p>
            </div>
          </div>

          <!-- Overview Tab -->
          <div v-else-if="activeTab === 'overview'" class="space-y-4 sm:space-y-6">
            <!-- Stats -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Produk</p>
                    <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ products.length }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Link</p>
                    <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ links.length }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Aktif</p>
                    <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ links.filter(l => l.is_active).length }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Unggulan</p>
                    <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ products.filter(p => p.is_featured).length }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-2xl shadow-sm p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h2>
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button @click="activeTab = 'products'; openProductModal()" class="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-all group">
                  <div class="w-12 h-12 bg-pink-100 group-hover:bg-pink-200 rounded-xl flex items-center justify-center transition-colors">
                    <svg class="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 group-hover:text-pink-600">Tambah Produk</span>
                </button>
                <button @click="activeTab = 'links'; openLinkModal()" class="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group">
                  <div class="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center transition-colors">
                    <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 group-hover:text-purple-600">Tambah Link</span>
                </button>
                <button @click="activeTab = 'theme'" class="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div class="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 group-hover:text-blue-600">Tema</span>
                </button>
                <button @click="activeTab = 'settings'" class="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group">
                  <div class="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
                    <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 group-hover:text-green-600">Pengaturan</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Products Tab -->
          <div v-if="activeTab === 'products'" class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-lg font-bold text-gray-900">Produk Anda</h2>
                <p class="text-xs text-gray-500">{{ products.length }} produk</p>
              </div>
              <button @click="openProductModal()" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Produk
              </button>
            </div>

            <div v-if="products.length === 0" class="text-center py-12">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p class="text-gray-500 mb-4">Belum ada produk</p>
              <button @click="openProductModal()" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                Tambah Produk Pertama
              </button>
            </div>

            <div v-else class="space-y-3">
              <div v-for="product in products" :key="product.id" class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div class="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                  <img v-if="product.thumbnail" :src="getProductImage(product)" class="w-full h-full object-cover" />
                  <svg v-else class="w-8 h-8 text-gray-400 m-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-900 truncate">{{ product.title }}</h4>
                  <p class="text-sm text-gray-500 capitalize">{{ product.product_type }} • {{ formatPrice(product.price) }}</p>
                </div>
                <div class="flex gap-2">
                  <button @click="openProductModal(product)" class="p-2 text-pink-600 hover:bg-pink-100 rounded-lg transition-colors" title="Edit">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="deleteProduct(product.id)" class="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Hapus">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Links Tab -->
          <div v-if="activeTab === 'links'" class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-lg font-bold text-gray-900">Link Anda</h2>
                <p class="text-xs text-gray-500">{{ links.length }} link</p>
              </div>
              <button @click="openLinkModal()" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Link
              </button>
            </div>

            <div v-if="links.length === 0" class="text-center py-12">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <p class="text-gray-500 mb-4">Belum ada link</p>
              <button @click="openLinkModal()" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                Tambah Link Pertama
              </button>
            </div>

            <div v-else class="space-y-3">
              <div v-for="(link, index) in sortedLinks" :key="link.id" class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span class="text-gray-400 text-sm w-6 font-mono flex-shrink-0 text-center">{{ index + 1 }}</span>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h4 class="font-medium text-gray-900 truncate">{{ link.title }}</h4>
                    <span v-if="link.is_active" class="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs flex-shrink-0">Aktif</span>
                  </div>
                  <p class="text-sm text-gray-500 truncate">{{ link.url }}</p>
                </div>
                <label class="flex items-center flex-shrink-0">
                  <input v-model="link.is_active" type="checkbox" @change="updateLink(link)" class="w-5 h-5 text-pink-500 rounded border-gray-300 focus:ring-pink-500" />
                </label>
                <button @click="openLinkModal(link)" class="p-2 text-pink-600 hover:bg-pink-100 rounded-lg transition-colors" title="Edit">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="deleteLink(link.id)" class="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Hapus">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Theme Tab -->
          <div v-if="activeTab === 'theme'" class="bg-white rounded-2xl shadow-sm p-5">
            <h2 class="text-lg font-bold mb-6">Theme Customization</h2>
            
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div v-for="color in colorInputs" :key="color.key">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ color.label }}</label>
                <div class="flex gap-2">
                  <input v-model="themeSettings.colors[color.key]" type="color" class="w-12 h-10 rounded-lg border cursor-pointer" />
                  <input v-model="themeSettings.colors[color.key]" type="text" class="input-field flex-1" />
                </div>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Quick Presets</h3>
              <div class="flex flex-wrap gap-2">
                <button @click="applyPreset('default')" class="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">Default</button>
                <button @click="applyPreset('ocean')" class="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg">Ocean</button>
                <button @click="applyPreset('sunset')" class="px-4 py-2 text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg">Sunset</button>
                <button @click="applyPreset('forest')" class="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg">Forest</button>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Preview</h3>
              <div class="border rounded-xl overflow-hidden">
                <div class="h-24" :style="previewBannerStyle"></div>
                <div class="p-4 bg-white">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full" :style="previewAvatarStyle"></div>
                    <div>
                      <p class="font-semibold">Your Profile</p>
                      <p class="text-xs text-gray-500">@yourusername</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button @click="resetThemeSettings" class="px-4 py-2.5 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50">Reset</button>
              <button @click="saveThemeSettings" :disabled="isSaving" class="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 rounded-xl font-medium hover:opacity-90 disabled:opacity-50">
                {{ isSaving ? 'Saving...' : 'Save Theme' }}
              </button>
            </div>
          </div>

          <!-- Settings Tab -->
          <div v-if="activeTab === 'settings'" class="space-y-6">
            <!-- Profile -->
            <div class="bg-white rounded-2xl shadow-sm p-5">
              <h2 class="text-lg font-bold mb-4">Profile Settings</h2>
              <form @submit.prevent="updateProfile" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input v-model="profile.name" type="text" class="input-field" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                    <input 
                      v-model="profile.whatsapp" 
                      type="text" 
                      class="input-field" 
                      placeholder="081234567890 atau 6281234567890"
                      @input="normalizeWhatsApp"
                    />
                    <p class="text-xs text-gray-500 mt-1">Format otomatis: 08xx akan diubah menjadi 628xx</p>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea v-model="profile.bio" rows="3" class="input-field"></textarea>
                </div>
                <button type="submit" :disabled="isSaving" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 disabled:opacity-50">
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
              </form>
            </div>

            <!-- Message Settings -->
            <div class="bg-white rounded-2xl shadow-sm p-5">
              <h2 class="text-lg font-bold mb-4">Message Settings</h2>
              <p class="text-sm text-gray-500 mb-4">Customize your WhatsApp message template for orders</p>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp Message Template</label>
                  <textarea 
                    v-model="messageSettings.whatsappTemplate" 
                    rows="6" 
                    class="input-field font-mono text-sm"
                    placeholder="🛒 *ORDER BARU*&#10;&#10;📦 *Product:* {product}&#10;💰 *Price:* {price}&#10;&#10;📋 *Details:*&#10;{fields}&#10;&#10;_Mohon diproses, terima kasih!_"
                  ></textarea>
                  <p class="text-xs text-gray-500 mt-2">
                    Available variables: <code class="bg-gray-100 px-2 py-1 rounded">{product}</code>, <code class="bg-gray-100 px-2 py-1 rounded">{price}</code>, <code class="bg-gray-100 px-2 py-1 rounded">{fields}</code>
                  </p>
                </div>

                <div class="border-t pt-4">
                  <h3 class="text-sm font-medium text-gray-700 mb-3">Include in Message</h3>
                  <div class="space-y-3">
                    <label class="flex items-center gap-3 cursor-pointer">
                      <input v-model="messageSettings.includeDescription" type="checkbox" class="w-5 h-5 text-pink-500 rounded" />
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-700">Product Description</p>
                        <p class="text-xs text-gray-500">Include product description in the message</p>
                      </div>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer">
                      <input v-model="messageSettings.includeStock" type="checkbox" class="w-5 h-5 text-pink-500 rounded" />
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-700">Stock Information</p>
                        <p class="text-xs text-gray-500">Include available stock count</p>
                      </div>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer">
                      <input v-model="messageSettings.includeCategory" type="checkbox" class="w-5 h-5 text-pink-500 rounded" />
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-700">Product Category</p>
                        <p class="text-xs text-gray-500">Include product type/category</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button @click="saveMessageSettings" :disabled="isSaving" class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:opacity-90 disabled:opacity-50">
                  {{ isSaving ? 'Saving...' : 'Save Message Settings' }}
                </button>
              </div>
            </div>

            <!-- Custom Fields -->
            <div class="bg-white rounded-2xl shadow-sm p-5">
              <div class="flex justify-between items-center mb-4">
                <div>
                  <h2 class="text-lg font-bold">Checkout Custom Fields</h2>
                  <p class="text-sm text-gray-500">Customize buyer information fields</p>
                </div>
              </div>

              <div v-if="customFields.length === 0" class="text-center py-8 text-gray-500">
                <p>No custom fields. Click "Add Custom Field" to create one.</p>
              </div>

              <div v-else class="space-y-2 mb-4">
                <div v-for="(field, index) in customFields" :key="index" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="font-medium text-sm truncate">{{ field.label }}</p>
                      <span v-if="field.required" class="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">Required</span>
                      <span v-else class="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs">Optional</span>
                    </div>
                    <p class="text-xs text-gray-500">
                      <code class="bg-gray-200 px-1.5 py-0.5 rounded">{ field.name }</code> • <span class="capitalize">{{ field.type }}</span>
                    </p>
                  </div>
                  <div class="flex gap-1 flex-shrink-0">
                    <button @click="moveFieldUp(index)" :disabled="index === 0" class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button @click="moveFieldDown(index)" :disabled="index === customFields.length - 1" class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button @click="removeCustomField(index)" class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex gap-3 mt-4">
                <button @click="openFieldModal" class="flex-1 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-pink-500 hover:text-pink-600 hover:bg-pink-50 font-medium text-sm transition-colors">
                  + Add Custom Field
                </button>
                <button @click="resetCustomFields" class="px-4 py-2.5 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-medium text-sm transition-colors">
                  Reset
                </button>
              </div>

              <button @click="saveCustomFields" :disabled="isSaving" class="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                {{ isSaving ? 'Saving...' : 'Save Custom Fields' }}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Product Modal -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 class="font-bold text-lg">{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h3>
          <button @click="showProductModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveProduct" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input v-model="productForm.title" type="text" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
            <select v-model="productForm.product_type" class="input-field">
              <option value="digital">Digital</option>
              <option value="ebook">E-book</option>
              <option value="course">Course</option>
              <option value="preset">Preset</option>
              <option value="template">Template</option>
              <option value="physical">Physical</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input v-model.number="productForm.price" type="number" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
              <input v-model.number="productForm.original_price" type="number" class="input-field" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea v-model="productForm.description" rows="3" class="input-field"></textarea>
          </div>

          <!-- Thumbnail Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Thumbnail</label>
            <div class="mt-2">
              <!-- Preview -->
              <div v-if="thumbnailPreview" class="mb-4">
                <div class="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img :src="thumbnailPreview" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    @click="removeThumbnail"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Upload Button -->
              <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-sm text-gray-500">
                    <span class="font-semibold text-pink-600">Click to upload</span> or drag and drop
                  </p>
                  <p class="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleThumbnailUpload"
                  class="hidden"
                />
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button type="button" @click="showProductModal = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" :disabled="isSaving" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Link Modal -->
    <div v-if="showLinkModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 class="font-bold text-lg">{{ editingLink ? 'Edit Link' : 'Add Link' }}</h3>
          <button @click="showLinkModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveLink" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input v-model="linkForm.title" type="text" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">URL</label>
            <input v-model="linkForm.url" type="url" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <input v-model.number="linkForm.order" type="number" min="0" class="input-field" />
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="showLinkModal = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" :disabled="isSaving" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Custom Field Modal -->
    <div v-if="showFieldModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-md w-full">
        <div class="border-b px-6 py-4 flex justify-between items-center">
          <h3 class="font-bold text-lg">Add Custom Field</h3>
          <button @click="showFieldModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Field Name (Variable) <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="fieldForm.name" 
              type="text" 
              placeholder="e.g., buyer_name, phone, address"
              class="input-field"
              autofocus
            />
            <p class="text-xs text-gray-500 mt-1">Use lowercase and underscores. This will be used as {fields} variable.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Field Label (Display Name) <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="fieldForm.label" 
              type="text" 
              placeholder="e.g., Buyer Name, Phone Number, Address"
              class="input-field"
            />
            <p class="text-xs text-gray-500 mt-1">This will be displayed to buyers during checkout</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Field Type <span class="text-red-500">*</span>
            </label>
            <select v-model="fieldForm.type" class="input-field">
              <option value="text">Text (Single line)</option>
              <option value="textarea">Textarea (Multiple lines)</option>
              <option value="email">Email</option>
              <option value="tel">Phone Number</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
          </div>

          <div>
            <label class="flex items-center gap-3 cursor-pointer">
              <input v-model="fieldForm.required" type="checkbox" class="w-5 h-5 text-pink-500 rounded" />
              <div>
                <p class="text-sm font-medium text-gray-700">Required Field</p>
                <p class="text-xs text-gray-500">Buyers must fill this field before checkout</p>
              </div>
            </label>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="showFieldModal = false" class="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button type="button" @click="saveCustomField" class="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 rounded-xl font-medium hover:opacity-90">
              Add Field
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'creator',
});

const authStore = useAuthStore();
const { success, error: showError, confirm } = useAlert();
const config = useRuntimeConfig();
const { errors: validationErrors, validateProductForm, validateLinkForm, validateCustomField, validateProfile } = useValidation();

const showSidebar = ref(false);
const activeTab = ref('overview');
const isSaving = ref(false);
const isLoading = ref(true);

const sidebarItems = [
  { id: 'overview', label: 'Ringkasan', icon: '📊' },
  { id: 'products', label: 'Produk', icon: '📦' },
  { id: 'links', label: 'Link', icon: '🔗' },
  { id: 'theme', label: 'Tema', icon: '🎨' },
  { id: 'settings', label: 'Pengaturan', icon: '⚙️' },
];

const colorInputs = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'background', label: 'Background' },
];

const profile = ref({ name: '', bio: '', whatsapp: '' });
const customFields = ref<any[]>([
  { name: 'buyer_name', label: 'Buyer Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'whatsapp', label: 'WhatsApp', type: 'tel', required: false },
]);

const messageSettings = ref({
  whatsappTemplate: '🛒 *ORDER BARU*\n\n📦 *Product:* {product}\n💰 *Price:* {price}\n\n📋 *Details:*\n{fields}\n\n_Mohon diproses, terima kasih!_',
  includeDescription: true,
  includeStock: true,
  includeCategory: true,
});

const themeSettings = ref({
  colors: {
    primary: '#a855f7',
    secondary: '#ec4899',
    accent: '#fb923c',
    background: '#faf5ff',
  },
});

const products = ref<any[]>([]);
const links = ref<any[]>([]);
const showProductModal = ref(false);
const showLinkModal = ref(false);
const showFieldModal = ref(false);
const editingProduct = ref<any>(null);
const editingLink = ref<any>(null);

const productForm = ref({ title: '', product_type: 'digital', price: 0, original_price: null, description: '', stock: null, thumbnail: null });
const linkForm = ref({ title: '', url: '', order: 0 });
const fieldForm = ref({ name: '', label: '', type: 'text', required: false });

const thumbnailFile = ref<File | null>(null);
const thumbnailPreview = ref<string>('');

const username = computed(() => authStore.user?.username || '');
const userInitial = computed(() => authStore.user?.name?.charAt(0) || 'U');
const sortedLinks = computed(() => [...links.value].sort((a, b) => (a.order || 0) - (b.order || 0)));

const previewBannerStyle = computed(() => ({
  background: `linear-gradient(to right, ${themeSettings.value.colors.primary}, ${themeSettings.value.colors.secondary}, ${themeSettings.value.colors.accent})`,
}));

const previewAvatarStyle = computed(() => ({
  background: `linear-gradient(to bottom right, ${themeSettings.value.colors.primary}, ${themeSettings.value.colors.secondary})`,
}));

const getProductImage = (product: any) => {
  if (!product.thumbnail) return '';
  return `${config.public.pocketbaseUrl}api/files/${product.collectionId || '5mkjdelz8eeumqc'}/${product.id}/${product.thumbnail}`;
};

const formatPrice = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

// Normalize WhatsApp number: convert 08xx to 628xx
const normalizeWhatsApp = () => {
  if (!profile.value.whatsapp) return;
  
  // Remove all non-digit characters except +
  let phone = profile.value.whatsapp.replace(/[^\d+]/g, '');
  
  // Remove leading + if present
  if (phone.startsWith('+')) {
    phone = phone.slice(1);
  }
  
  // Convert 62 prefix to 0 if user typed 62 but we want to normalize to 62
  // Convert 0 prefix to 62
  if (phone.startsWith('0') && phone.length > 1) {
    phone = '62' + phone.slice(1);
  }
  
  profile.value.whatsapp = phone;
};

// Profile
const updateProfile = async () => {
  // Check if profile is loaded
  if (!profile.value.name?.trim()) {
    showError('Name is required');
    return;
  }

  // Validate form
  if (!validateProfile(profile.value)) {
    const errorMsg = validationErrors.value.join(', ');
    showError(errorMsg || 'Please check the form for errors');
    return;
  }

  isSaving.value = true;
  try {
    const pb = useNuxtApp().$pb;
    if (!authStore.user) return;
    await pb.collection('users').update(authStore.user.id, profile.value);
    await authStore.initAuth();
    success('Profile updated!', 'Success');
  } catch (e: any) {
    showError(e.message || 'Failed to update');
  } finally {
    isSaving.value = false;
  }
};

// Theme
const saveThemeSettings = async () => {
  isSaving.value = true;
  try {
    const pb = useNuxtApp().$pb;
    if (!authStore.user) return;
    await pb.collection('users').update(authStore.user.id, { theme_settings: themeSettings.value });
    await authStore.initAuth();
    success('Theme saved!', 'Success');
  } catch (e: any) {
    showError(e.message || 'Failed to save');
  } finally {
    isSaving.value = false;
  }
};

const resetThemeSettings = () => {
  themeSettings.value = {
    colors: { primary: '#a855f7', secondary: '#ec4899', accent: '#fb923c', background: '#faf5ff' },
  };
};

const applyPreset = (preset: string) => {
  const presets: Record<string, any> = {
    default: { primary: '#a855f7', secondary: '#ec4899', accent: '#fb923c', background: '#faf5ff' },
    ocean: { primary: '#0284c7', secondary: '#06b6d4', accent: '#22d3ee', background: '#f0f9ff' },
    sunset: { primary: '#f97316', secondary: '#ef4444', accent: '#f43f5e', background: '#fff7ed' },
    forest: { primary: '#16a34a', secondary: '#059669', accent: '#10b981', background: '#f0fdf4' },
  };
  if (presets[preset]) {
    themeSettings.value.colors = { ...themeSettings.value.colors, ...presets[preset] };
  }
};

// Products
const fetchProducts = async () => {
  const pb = useNuxtApp().$pb;
  products.value = await pb.collection('products').getFullList({ filter: `creator_id = "${authStore.user?.id}"`, sort: '-created' });
};

const openProductModal = (product?: any) => {
  editingProduct.value = product || null;
  if (product) {
    productForm.value = { ...product };
    if (product.thumbnail) {
      thumbnailPreview.value = getProductImage(product);
    }
  } else {
    productForm.value = { title: '', product_type: 'digital', price: 0, original_price: null, description: '', stock: null, thumbnail: null };
    thumbnailPreview.value = '';
  }
  thumbnailFile.value = null;
  showProductModal.value = true;
};

const handleThumbnailUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    thumbnailFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      thumbnailPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeThumbnail = () => {
  thumbnailFile.value = null;
  thumbnailPreview.value = '';
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (input) {
    input.value = '';
  }
};

const saveProduct = async () => {
  // Validate form
  if (!validateProductForm(productForm.value)) {
    const errorMsg = validationErrors.value.join(', ');
    showError(errorMsg || 'Please check the form for errors');
    return;
  }

  isSaving.value = true;
  try {
    const pb = useNuxtApp().$pb;
    const data: any = { 
      ...productForm.value, 
      creator_id: authStore.user?.id 
    };
    
    // Handle thumbnail upload
    if (thumbnailFile.value) {
      // Validate file
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(thumbnailFile.value.type)) {
        showError('Invalid file type. Please upload JPEG, PNG, GIF, or WebP.');
        return;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (thumbnailFile.value.size > maxSize) {
        showError('File size must be less than 5MB');
        return;
      }
      
      data.thumbnail = thumbnailFile.value;
    } else if (thumbnailPreview.value === '' && editingProduct.value) {
      data.thumbnail = null;
    }
    
    if (editingProduct.value) {
      await pb.collection('products').update(editingProduct.value.id, data);
    } else {
      await pb.collection('products').create(data);
    }
    await fetchProducts();
    showProductModal.value = false;
    success('Product saved!', 'Success');
  } catch (e: any) {
    showError(e.message || 'Failed to save');
  } finally {
    isSaving.value = false;
  }
};

const deleteProduct = async (id: string) => {
  if (!confirm('Delete this product?')) return;
  const pb = useNuxtApp().$pb;
  await pb.collection('products').delete(id);
  await fetchProducts();
  success('Product deleted', 'Success');
};

// Links
const fetchLinks = async () => {
  const pb = useNuxtApp().$pb;
  links.value = await pb.collection('links').getFullList({ filter: `creator_id = "${authStore.user?.id}"`, sort: 'order' });
};

const openLinkModal = (link?: any) => {
  editingLink.value = link || null;
  if (link) {
    linkForm.value = { ...link };
  } else {
    linkForm.value = { title: '', url: '', order: 0 };
  }
  showLinkModal.value = true;
};

const saveLink = async () => {
  // Validate form
  if (!validateLinkForm(linkForm.value)) {
    const errorMsg = validationErrors.value.join(', ');
    showError(errorMsg || 'Please check the form for errors');
    return;
  }

  isSaving.value = true;
  try {
    const pb = useNuxtApp().$pb;
    const data = { ...linkForm.value, creator_id: authStore.user?.id, is_active: true };
    if (editingLink.value) {
      await pb.collection('links').update(editingLink.value.id, data);
    } else {
      await pb.collection('links').create(data);
    }
    await fetchLinks();
    showLinkModal.value = false;
    success('Link saved!', 'Success');
  } catch (e: any) {
    showError(e.message || 'Failed to save');
  } finally {
    isSaving.value = false;
  }
};

const deleteLink = async (id: string) => {
  if (!confirm('Delete this link?')) return;
  const pb = useNuxtApp().$pb;
  await pb.collection('links').delete(id);
  await fetchLinks();
  success('Link deleted', 'Success');
};

const updateLink = async (link: any) => {
  const pb = useNuxtApp().$pb;
  await pb.collection('links').update(link.id, { is_active: link.is_active });
};

// Custom Fields
const openFieldModal = () => {
  fieldForm.value = { name: '', label: '', type: 'text', required: false };
  showFieldModal.value = true;
};

const saveCustomField = () => {
  // Validate form
  if (!validateCustomField(fieldForm.value)) {
    showError('Please check the field for errors');
    return;
  }

  customFields.value.push({
    name: fieldForm.value.name.toLowerCase().replace(/\s+/g, '_'),
    label: fieldForm.value.label,
    type: fieldForm.value.type,
    required: fieldForm.value.required,
  });

  showFieldModal.value = false;
};

const removeCustomField = (index: number) => {
  if (index >= 0 && index < customFields.value.length) {
    customFields.value.splice(index, 1);
  }
};

const moveFieldUp = (index: number) => {
  if (index > 0 && index < customFields.value.length) {
    const temp = customFields.value[index];
    customFields.value[index] = customFields.value[index - 1];
    customFields.value[index - 1] = temp;
  }
};

const moveFieldDown = (index: number) => {
  if (index >= 0 && index < customFields.value.length - 1) {
    const temp = customFields.value[index];
    customFields.value[index] = customFields.value[index + 1];
    customFields.value[index + 1] = temp;
  }
};

const resetCustomFields = () => {
  customFields.value = [
    { name: 'buyer_name', label: 'Buyer Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'whatsapp', label: 'WhatsApp', type: 'tel', required: false },
  ];
};

const saveCustomFields = async () => {
  isSaving.value = true;
  try {
    const pb = useNuxtApp().$pb;
    if (!authStore.user) return;
    await pb.collection('users').update(authStore.user.id, { custom_field: customFields.value });
    success('Custom fields saved!', 'Success');
  } catch (e: any) {
    showError(e.message || 'Failed to save');
  } finally {
    isSaving.value = false;
  }
};

const saveMessageSettings = async () => {
  isSaving.value = true;
  try {
    const pb = useNuxtApp().$pb;
    if (!authStore.user) return;
    await pb.collection('users').update(authStore.user.id, { 
      message_settings: messageSettings.value 
    });
    success('Message settings saved!', 'Success');
  } catch (e: any) {
    showError(e.message || 'Failed to save');
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await authStore.initAuth();
    if (authStore.user) {
      profile.value = { name: authStore.user.name || '', bio: authStore.user.bio || '', whatsapp: authStore.user.whatsapp || '' };
      
      // Load theme settings
      if (authStore.user.theme_settings) {
        themeSettings.value = authStore.user.theme_settings;
      }
      
      // Load message settings
      if (authStore.user.message_settings) {
        messageSettings.value = authStore.user.message_settings;
      }
      
      // Load custom fields - ensure it's an array
      if (authStore.user.custom_field && Array.isArray(authStore.user.custom_field)) {
        customFields.value = authStore.user.custom_field;
      } else {
        customFields.value = [
          { name: 'buyer_name', label: 'Buyer Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'whatsapp', label: 'WhatsApp', type: 'tel', required: false },
        ];
      }
      
      await fetchProducts();
      await fetchLinks();
    }
  } catch (error) {
    // Error handled silently in production
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
