<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <!-- Header -->
    <section class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-16 lg:py-20">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <span>Marketplace</span>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold mb-4">Products Marketplace</h1>
        <p class="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">Temukan produk digital terbaik dari creator favoritmu</p>
      </div>
    </section>

    <!-- Products Grid -->
    <div class="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mb-4"></div>
        <p class="text-gray-500">Loading products...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="allProducts.length === 0" class="text-center py-20">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No Products Yet</h3>
        <p class="text-gray-500 mb-6">Be the first to add your product!</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        <div
          v-for="item in allProducts"
          :key="item.product.id"
          class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
          @click="openProduct(item)"
        >
          <!-- Product Image -->
          <div class="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <img
              v-if="item.product.thumbnail"
              :src="getProductThumbnail(item.product)"
              :alt="item.product.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- Product Type Badge -->
            <div class="absolute top-3 left-3">
              <span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full capitalize shadow-sm">
                {{ item.product.product_type }}
              </span>
            </div>

            <!-- Featured Badge -->
            <div v-if="item.product.is_featured" class="absolute top-3 right-3">
              <span class="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-xs font-bold text-white rounded-full shadow-sm">
                ⭐ Featured
              </span>
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-pink-600 transition-colors">
              {{ item.product.title }}
            </h3>

            <div class="flex items-center gap-2 mb-3">
              <div class="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                {{ item.creator.name?.charAt(0).toUpperCase() }}
              </div>
              <p class="text-xs text-gray-500 truncate">{{ item.creator.name }}</p>
            </div>

            <!-- Price -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <span class="text-lg font-bold text-pink-600">{{ formatPrice(item.product.price) }}</span>
                <span v-if="item.product.original_price" class="text-xs text-gray-400 line-through ml-2">{{ formatPrice(item.product.original_price) }}</span>
              </div>
              <div v-if="item.product.stock" class="text-xs text-gray-500">
                Stock: {{ item.product.stock }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal with Checkout -->
    <div v-if="selectedProduct" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="selectedProduct = null">
      <div class="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center z-10">
          <h3 class="font-bold text-xl">{{ selectedProduct.product.title }}</h3>
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
                  v-if="selectedProduct.product.thumbnail"
                  :src="getProductThumbnail(selectedProduct.product)"
                  :alt="selectedProduct.product.title"
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
                  📦 {{ selectedProduct.product.product_type }}
                </span>
                <span v-if="selectedProduct.product.stock" class="px-4 py-2 bg-green-100 text-sm font-medium text-green-700 rounded-full">
                  ✅ In Stock
                </span>
                <span v-else class="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-700 rounded-full">
                  ⚠️ Made to Order
                </span>
              </div>

              <!-- Description -->
              <div v-if="selectedProduct.product.description" class="bg-white border rounded-xl p-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Description
                </h4>
                <p class="text-gray-600 text-sm leading-relaxed">{{ selectedProduct.product.description }}</p>
              </div>

              <!-- Price -->
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-gray-500 mb-1">Price</p>
                    <div class="flex items-center gap-2">
                      <span class="text-3xl font-bold text-pink-600">{{ formatPrice(selectedProduct.product.price) }}</span>
                      <span v-if="selectedProduct.product.original_price" class="text-sm text-gray-400 line-through">{{ formatPrice(selectedProduct.product.original_price) }}</span>
                    </div>
                  </div>
                  <div v-if="selectedProduct.product.stock" class="text-right">
                    <p class="text-xs text-gray-500 mb-1">Available Stock</p>
                    <p class="text-lg font-bold text-green-600">{{ selectedProduct.product.stock }} units</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Creator & Checkout Form -->
            <div class="space-y-4">
              <!-- Creator Info -->
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                    {{ selectedProduct.creator.name?.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ selectedProduct.creator.name }}</p>
                    <p class="text-xs text-gray-500">@{{ selectedProduct.creator.username }}</p>
                  </div>
                </div>
              </div>

              <!-- Checkout Form -->
              <div class="bg-white border rounded-xl p-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Your Information
                </h4>
                <form @submit.prevent="submitOrder" class="space-y-3">
                  <div v-for="field in checkoutFields" :key="field.name">
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      {{ field.label }}
                      <span v-if="field.required" class="text-red-500">*</span>
                    </label>
                    <input
                      v-if="field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number'"
                      v-model="formData[field.name]"
                      :type="field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'"
                      :required="field.required"
                      :placeholder="`Enter your ${field.label.toLowerCase()}`"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <textarea
                      v-else-if="field.type === 'textarea'"
                      v-model="formData[field.name]"
                      :required="field.required"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    ></textarea>
                  </div>

                  <div class="border-t pt-3 mt-3">
                    <label class="flex items-start gap-2 cursor-pointer">
                      <input v-model="agreeToTerms" type="checkbox" class="w-4 h-4 text-pink-500 rounded mt-0.5" />
                      <span class="text-xs text-gray-600">
                        I agree to the <a href="#" class="text-pink-600 hover:underline">Terms & Conditions</a>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    :disabled="isSubmitting || !agreeToTerms"
                    class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
interface ProductWithCreator {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    original_price?: number;
    product_type: string;
    thumbnail?: string;
    stock?: number;
    collectionId?: string;
  };
  creator: {
    id: string;
    name: string;
    username: string;
    whatsapp?: string;
  };
}

const allProducts = ref<ProductWithCreator[]>([]);
const isLoading = ref(true);
const selectedProduct = ref<ProductWithCreator | null>(null);

// Checkout form state
const checkoutFields = ref<any[]>([
  { name: 'buyer_name', label: 'Buyer Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'whatsapp', label: 'WhatsApp', type: 'tel', required: false },
]);
const formData = ref<any>({});
const agreeToTerms = ref(false);
const isSubmitting = ref(false);

const config = useRuntimeConfig();

const getProductThumbnail = (product: any) => {
  if (!product.thumbnail) return '';
  const collectionId = product.collectionId || '5mkjdelz8eeumqc';
  const recordId = product.id;
  return `${config.public.pocketbaseUrl}api/files/${collectionId}/${recordId}/${product.thumbnail}`;
};

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const openProduct = (item: ProductWithCreator) => {
  selectedProduct.value = item;
  // Initialize form data
  checkoutFields.value = item.creator.custom_field || [
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
    message += `📦 *Product:* ${selectedProduct.value?.product.title}\n`;
    message += `💰 *Price:* ${formatPrice(selectedProduct.value?.product.price)}\n\n`;
    
    // Add custom fields
    message += '📋 *Details:*\n';
    checkoutFields.value.forEach((field: any) => {
      const value = formData.value[field.name] || '-';
      message += `• ${field.label}: ${value}\n`;
    });
    
    message += '\n_Mohon diproses, terima kasih!_';
    
    // Open WhatsApp
    const whatsappNumber = selectedProduct.value?.creator.whatsapp?.replace(/[^0-9]/g, '');
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

    // Fetch all products
    const products = await pb.collection('products').getFullList({
      sort: '-is_featured,-created',
    });

    // Get creator info for each product
    for (const product of products) {
      try {
        const creator = await pb.collection('users').getOne(product.creator_id);
        allProducts.value.push({
          product: {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            original_price: product.original_price,
            product_type: product.product_type,
            thumbnail: product.thumbnail,
            stock: product.stock,
            collectionId: product.collectionId,
          },
          creator: {
            id: creator.id,
            name: creator.name,
            username: creator.username,
            whatsapp: creator.whatsapp,
          },
        });
      } catch (error) {
        // Skip products with invalid creator
      }
    }
  } catch (error) {
    // Error handled silently in production
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: 'Products Marketplace | WebsiteKita',
});
</script>
