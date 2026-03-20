<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <div class="flex-1">
    <!-- Profile Header -->
    <div class="relative">
      <!-- Banner -->
      <div class="h-48 md:h-64 overflow-hidden" :style="bannerGradientStyle">
        <img
          v-if="creator?.banner"
          :src="getBannerUrl()"
          :alt="creator.name"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Avatar & Info -->
      <div class="relative max-w-4xl mx-auto px-4">
        <div class="flex flex-col items-center -mt-20">
          <div class="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
            <img
              v-if="creator?.avatar"
              :src="getAvatarUrl()"
              :alt="creator.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-white text-5xl font-bold" :style="avatarGradientStyle">
              {{ creator?.name?.charAt(0).toUpperCase() }}
            </div>
          </div>

          <div class="text-center mt-6">
            <h1 class="text-3xl font-bold text-gray-900">{{ creator?.name }}</h1>
            <p class="text-gray-500 text-lg">@{{ username }}</p>
            <p v-if="creator?.bio" class="text-gray-600 mt-3 max-w-lg">{{ creator.bio }}</p>
          </div>

          <!-- Social Links -->
          <div v-if="hasSocialLinks && creator" class="flex items-center gap-3 mt-6 flex-wrap justify-center">
            <a
              v-if="creator?.whatsapp"
              :href="getWhatsAppLink()"
              target="_blank"
              class="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a
              v-if="creator?.instagram"
              :href="creator.instagram"
              target="_blank"
              class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:opacity-80 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              v-if="creator?.tiktok"
              :href="creator.tiktok"
              target="_blank"
              class="w-12 h-12 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
            <a
              v-if="creator?.twitter"
              :href="creator.twitter"
              target="_blank"
              class="w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              v-if="creator?.youtube"
              :href="creator.youtube"
              target="_blank"
              class="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              v-if="creator?.telegram"
              :href="`https://t.me/${creator.telegram}`"
              target="_blank"
              class="w-12 h-12 rounded-full bg-sky-400 hover:bg-sky-500 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div :key="creator?.id" v-if="creator" class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex gap-3 mb-6 justify-center">
        <button
          @click="activeTab = 'products'"
          :class="['flex-1 sm:flex-none sm:px-8 py-3 rounded-xl font-semibold transition-all', activeTab === 'products' ? 'text-white shadow-lg scale-105' : 'text-gray-600 hover:bg-gray-100']"
          :style="activeTab === 'products' ? buttonStyles : { backgroundColor: themeSettings.colors.cardBg }"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Products
          </span>
        </button>
        <button
          @click="activeTab = 'links'"
          :class="['flex-1 sm:flex-none sm:px-8 py-3 rounded-xl font-semibold transition-all', activeTab === 'links' ? 'text-white shadow-lg scale-105' : 'text-gray-600 hover:bg-gray-100']"
          :style="activeTab === 'links' ? buttonStyles : { backgroundColor: themeSettings.colors.cardBg }"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Links
          </span>
        </button>
      </div>

      <!-- Products Tab -->
      <div v-if="activeTab === 'products'">
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-16">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p class="text-gray-500">Belum ada produk</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="product in products"
            :key="product.id"
            class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
            @click="openProduct(product)"
          >
            <div class="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
              <img
                v-if="product.thumbnail"
                :src="getProductThumbnail(product)"
                :alt="product.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div v-if="product.is_featured" class="absolute top-2 right-2">
                <span class="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-xs font-bold text-white rounded-full shadow-sm">
                  ⭐ Featured
                </span>
              </div>
            </div>

            <div class="p-4">
              <h3 class="font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-pink-600 transition-colors">{{ product.title }}</h3>
              <p class="text-xs text-gray-500 mb-3 capitalize">{{ product.product_type }}</p>
              <div class="flex items-center justify-between pt-3 border-t">
                <span class="text-lg font-bold" :style="{ color: themeSettings.colors.primary }">{{ formatPrice(product.price) }}</span>
                <span v-if="product.original_price" class="text-xs text-gray-400 line-through">{{ formatPrice(product.original_price) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Links Tab -->
      <div v-else-if="activeTab === 'links'">
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
        </div>

        <div v-else-if="links.length === 0" class="text-center py-16">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p class="text-gray-500">Belum ada link</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            v-for="link in sortedLinks"
            :key="link.id"
            :href="link.url"
            target="_blank"
            class="block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 text-center hover:-translate-y-1"
          >
            <div class="flex items-center justify-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span class="font-semibold text-gray-900">{{ link.title }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-2 truncate">{{ link.url }}</p>
          </a>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal with Checkout -->
    <div v-if="selectedProduct" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="selectedProduct = null">
      <div class="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center z-10">
          <h3 class="font-bold text-xl">{{ selectedProduct.title }}</h3>
          <button @click="selectedProduct = null" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left: Product Info -->
            <div class="space-y-4">
              <!-- Product Image -->
              <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-md">
                <img
                  v-if="selectedProduct.thumbnail"
                  :src="getProductThumbnail(selectedProduct)"
                  :alt="selectedProduct.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                  <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <!-- Badges -->
              <div class="flex flex-wrap gap-2">
                <span class="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-sm font-medium text-pink-700 rounded-full capitalize">
                  📦 {{ selectedProduct.product_type }}
                </span>
                <span v-if="selectedProduct.stock" class="px-4 py-2 bg-green-100 text-sm font-medium text-green-700 rounded-full">
                  ✅ In Stock
                </span>
                <span v-else class="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-700 rounded-full">
                  ⚠️ Made to Order
                </span>
              </div>

              <!-- Description -->
              <div v-if="selectedProduct.description" class="bg-white border rounded-xl p-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Description
                </h4>
                <p class="text-gray-600 text-sm leading-relaxed">{{ selectedProduct.description }}</p>
              </div>

              <!-- Price -->
              <div :style="{ backgroundColor: themeSettings.colors.cardBg }" class="rounded-xl p-4 border">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs" :style="{ color: themeSettings.colors.text }">Price</p>
                    <div class="flex items-center gap-2">
                      <span class="text-3xl font-bold" :style="{ color: themeSettings.colors.primary }">{{ formatPrice(selectedProduct.price) }}</span>
                      <span v-if="selectedProduct.original_price" class="text-sm" :style="{ color: themeSettings.colors.text }">{{ formatPrice(selectedProduct.original_price) }}</span>
                    </div>
                  </div>
                  <div v-if="selectedProduct.stock" class="text-right">
                    <p class="text-xs" :style="{ color: themeSettings.colors.text }">Stock</p>
                    <p class="text-lg font-bold" :style="{ color: themeSettings.colors.primary }">{{ selectedProduct.stock }} units</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Creator & Checkout Form -->
            <div class="space-y-4">
              <!-- Creator Info -->
              <div :style="{ backgroundColor: themeSettings.colors.cardBg }" class="rounded-xl p-4 border">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full" :style="avatarGradientStyle"></div>
                  <div>
                    <p class="font-semibold" :style="{ color: themeSettings.colors.text }">{{ creator.name }}</p>
                    <p class="text-xs" :style="{ color: themeSettings.colors.text }">@{{ username }}</p>
                  </div>
                </div>
              </div>

              <!-- Checkout Form -->
              <div :style="{ backgroundColor: themeSettings.colors.cardBg }" class="rounded-xl p-4 border">
                <h4 class="text-sm font-semibold mb-3 flex items-center gap-2" :style="{ color: themeSettings.colors.text }">
                  <svg class="w-5 h-5" :style="{ color: themeSettings.colors.primary }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Your Information
                </h4>
                <form @submit.prevent="submitOrder" class="space-y-3">
                  <div v-for="field in checkoutFields" :key="field.name">
                    <label class="block text-xs font-medium mb-1" :style="{ color: themeSettings.colors.text }">
                      {{ field.label }}
                      <span v-if="field.required" class="text-red-500">*</span>
                    </label>
                    <input
                      v-if="field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number'"
                      v-model="formData[field.name]"
                      :type="field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'"
                      :required="field.required"
                      class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2" :style="{ borderColor: themeSettings.colors.primary, '--tw-ring-color': themeSettings.colors.primary }"
                    />
                    <textarea
                      v-else-if="field.type === 'textarea'"
                      v-model="formData[field.name]"
                      :required="field.required"
                      rows="2"
                      class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2" :style="{ borderColor: themeSettings.colors.primary, '--tw-ring-color': themeSettings.colors.primary }"
                    ></textarea>
                  </div>

                  <div class="border-t pt-3 mt-3">
                    <label class="flex items-start gap-2 cursor-pointer">
                      <input v-model="agreeToTerms" type="checkbox" class="w-4 h-4 rounded mt-0.5" :style="{ color: themeSettings.colors.primary }" />
                      <span class="text-xs" :style="{ color: themeSettings.colors.text }">
                        I agree to the <a href="#" class="hover:underline" :style="{ color: themeSettings.colors.primary }">Terms & Conditions</a>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    :disabled="isSubmitting || !agreeToTerms"
                    class="w-full text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50" :style="{ background: buttonStyles.background }"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Order via WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
// No layout override - use default layout
const route = useRoute();
const config = useRuntimeConfig();

const creator = ref<any>(null);
const products = ref<any[]>([]);
const links = ref<any[]>([]);
const isLoading = ref(true);
const selectedProduct = ref<any>(null);
const activeTab = ref<'products' | 'links'>('products');

// Checkout form state
const checkoutFields = ref<any[]>([]);
const formData = ref<any>({});
const agreeToTerms = ref(false);
const isSubmitting = ref(false);

// Remove '@' prefix from username if present
const username = computed(() => {
  const rawUsername = route.params.username as string;
  return rawUsername.startsWith('@') ? rawUsername.substring(1) : rawUsername;
});

const hasSocialLinks = computed(() => {
  return creator.value && (
    creator.value.whatsapp ||
    creator.value.instagram ||
    creator.value.tiktok ||
    creator.value.twitter ||
    creator.value.youtube ||
    creator.value.telegram
  );
});

const sortedLinks = computed(() => {
  return [...links.value].sort((a, b) => (a.order || 0) - (b.order || 0));
});

// Theme settings computed from creator's theme_settings field
const themeSettings = computed(() => {
  const defaultSettings = {
    colors: {
      primary: '#a855f7',
      secondary: '#ec4899',
      accent: '#fb923c',
      background: '#faf5ff',
      text: '#1f2937',
      cardBg: '#ffffff',
      button: '#a855f7',
    },
    font: 'sans',
    bannerStyle: 'gradient',
    layout: {
      avatarPosition: 'center',
    },
    showProductCount: true,
    showSocialLinks: true,
  };
  
  if (creator.value?.theme_settings) {
    return { ...defaultSettings, ...creator.value.theme_settings };
  }
  return defaultSettings;
});

const pageStyles = computed(() => {
  const fontFamilies: Record<string, string> = {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  };
  
  return {
    backgroundColor: themeSettings.value.colors.background,
    fontFamily: fontFamilies[themeSettings.value.font] || fontFamilies.sans,
    color: themeSettings.value.colors.text,
  };
});

const bannerGradientStyle = computed(() => {
  if (!creator.value) return {};
  if (themeSettings.value.bannerStyle === 'solid') {
    return {
      background: themeSettings.value.colors.primary,
    };
  }
  if (themeSettings.value.bannerStyle === 'image-only') {
    return {};
  }
  return {
    background: `linear-gradient(to right, ${themeSettings.value.colors.primary}, ${themeSettings.value.colors.secondary}, ${themeSettings.value.colors.accent})`,
  };
});

const avatarGradientStyle = computed(() => {
  if (!creator.value) return {};
  return {
    background: `linear-gradient(to bottom right, ${themeSettings.value.colors.primary}, ${themeSettings.value.colors.secondary})`,
  };
});

const cardStyles = computed(() => {
  return {
    backgroundColor: themeSettings.value.colors.cardBg,
  };
});

const buttonStyles = computed(() => {
  if (!creator.value) return {};
  return {
    background: `linear-gradient(to right, ${themeSettings.value.colors.primary}, ${themeSettings.value.colors.secondary})`,
  };
});

const getAvatarUrl = () => {
  if (!creator.value?.avatar || !creator.value.id) return '';
  return `${config.public.pocketbaseUrl}api/files/_pb_users_auth_/${creator.value.id}/${creator.value.avatar}`;
};

const getBannerUrl = () => {
  if (!creator.value?.banner || !creator.value.id) return '';
  return `${config.public.pocketbaseUrl}api/files/_pb_users_auth_/${creator.value.id}/${creator.value.banner}`;
};

const getProductThumbnail = (product: any) => {
  if (!product.thumbnail) return '';
  const collectionId = product.collectionId || '5mkjdelz8eeumqc';
  const recordId = product.id;
  return `${config.public.pocketbaseUrl}api/files/${collectionId}/${recordId}/${product.thumbnail}`;
};

const getWhatsAppLink = () => {
  if (!creator.value?.whatsapp) return '#';
  const message = 'Hi, I want to ask about your products.';
  const cleanPhone = creator.value.whatsapp.replace(/[^0-9]/g, '');
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
};

const getBuyLink = (product: any) => {
  if (!creator.value?.whatsapp) return '#';
  const message = `Hi, I want to buy:\n\nProduct: ${product.title}\nPrice: ${formatPrice(product.price)}\n\nPlease process my order. Thank you!`;
  const cleanPhone = creator.value.whatsapp.replace(/[^0-9]/g, '');
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
};

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const openProduct = (product: any) => {
  selectedProduct.value = product;
  // Initialize checkout fields from creator's custom_field
  checkoutFields.value = creator.value?.custom_field || [
    { name: 'buyer_name', label: 'Buyer Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'whatsapp', label: 'WhatsApp', type: 'tel', required: false },
  ];
  formData.value = {};
  agreeToTerms.value = false;
};

const submitOrder = () => {
  isSubmitting.value = true;
  
  try {
    // Build message
    let message = '🛒 *ORDER BARU*\n\n';
    message += `📦 *Product:* ${selectedProduct.value?.title}\n`;
    message += `💰 *Price:* ${formatPrice(selectedProduct.value?.price)}\n\n`;
    
    // Add custom fields
    message += '📋 *Details:*\n';
    checkoutFields.value.forEach((field: any) => {
      const value = formData.value[field.name] || '-';
      message += `• ${field.label}: ${value}\n`;
    });
    
    message += '\n_Mohon diproses, terima kasih!_';
    
    // Open WhatsApp
    const whatsappNumber = creator.value?.whatsapp?.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  } catch (error) {
    // Error handled silently
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    const pb = useNuxtApp().$pb;

    // Fetch all users and filter manually
    const allUsers = await pb.collection('users').getFullList();

    // Find user by username manually
    const foundUser = allUsers.find((u: any) => u.username === username.value);

    if (foundUser) {
      creator.value = foundUser;

      // Fetch products
      products.value = await pb.collection('products').getFullList({
        filter: `creator_id = "${creator.value.id}"`,
        sort: '-is_featured,-created',
      });

      // Fetch links
      links.value = await pb.collection('links').getFullList({
        filter: `creator_id = "${creator.value.id}" && is_active = true`,
        sort: 'order',
      });
    }
  } catch (error) {
    // Error handled silently in production
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: creator.value ? `${creator.value.name} | WebsiteKita` : 'Profile | WebsiteKita',
});
</script>
