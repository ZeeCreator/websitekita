<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <!-- Header -->
    <section class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-12">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
        <p class="text-white/90">Complete your order</p>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="!product || !creator" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Invalid Checkout</h3>
        <p class="text-gray-500 mb-4">Product or creator not found</p>
        <NuxtLink to="/" class="text-pink-600 hover:text-pink-700 font-medium">← Back to Home</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Product Info -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm p-4 sticky top-24">
            <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden mb-4">
              <img
                v-if="product.thumbnail"
                :src="getProductThumbnail(product)"
                :alt="product.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 class="font-bold text-gray-900 mb-2">{{ product.title }}</h2>
            <p class="text-2xl font-bold text-pink-600 mb-2">{{ formatPrice(product.price) }}</p>
            <p v-if="product.original_price" class="text-sm text-gray-400 line-through">{{ formatPrice(product.original_price) }}</p>
            <div class="border-t mt-4 pt-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {{ creator.name?.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="font-semibold text-sm">{{ creator.name }}</p>
                  <p class="text-xs text-gray-500">@{{ creator.username }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Your Information</h2>
            <form @submit.prevent="submitOrder" class="space-y-4">
              <div v-for="field in checkoutFields" :key="field.name" class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <input
                  v-if="field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number' || field.type === 'date'"
                  v-model="formData[field.name]"
                  :type="field.type"
                  :required="field.required"
                  :placeholder="`Enter your ${field.label.toLowerCase()}`"
                  class="input-field"
                />
                <textarea
                  v-else-if="field.type === 'textarea'"
                  v-model="formData[field.name]"
                  :required="field.required"
                  :placeholder="`Enter your ${field.label.toLowerCase()}`"
                  rows="3"
                  class="input-field"
                ></textarea>
                <select
                  v-else-if="field.type === 'select'"
                  v-model="formData[field.name]"
                  :required="field.required"
                  class="input-field"
                >
                  <option value="">Select {{ field.label }}</option>
                  <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>

              <div class="border-t pt-4 mt-4">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input v-model="agreeToTerms" type="checkbox" class="w-5 h-5 text-pink-500 rounded mt-0.5" />
                  <div class="text-sm text-gray-600">
                    I agree to the <a href="#" class="text-pink-600 hover:underline">Terms & Conditions</a> and <a href="#" class="text-pink-600 hover:underline">Privacy Policy</a>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting || !agreeToTerms"
                class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Order via WhatsApp
                </span>
              </button>
            </form>
          </div>

          <!-- Order Summary -->
          <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Order Summary</h2>
            <div class="space-y-3">
              <div class="flex justify-between text-gray-600">
                <span>Product</span>
                <span class="font-medium">{{ product.title }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Price</span>
                <span class="font-medium">{{ formatPrice(product.price) }}</span>
              </div>
              <div v-if="product.original_price" class="flex justify-between text-gray-400">
                <span>Original Price</span>
                <span class="line-through">{{ formatPrice(product.original_price) }}</span>
              </div>
              <div class="border-t pt-3 mt-3">
                <div class="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span class="text-pink-600">{{ formatPrice(product.price) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Disqus Comments -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div id="disqus_thread"></div>
            <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

const product = ref<any>(null);
const creator = ref<any>(null);
const checkoutFields = ref<any[]>([]);
const formData = ref<any>({});
const agreeToTerms = ref(false);
const isSubmitting = ref(false);

// Load product and creator data
onMounted(async () => {
  try {
    const pb = useNuxtApp().$pb;
    
    // Get product ID from route
    const productId = route.query.product as string;
    const creatorId = route.query.creator as string;
    
    if (!productId || !creatorId) {
      return;
    }
    
    // Fetch product
    product.value = await pb.collection('products').getOne(productId);
    
    // Fetch creator
    creator.value = await pb.collection('users').getOne(creatorId);
    
    // Fetch custom fields
    if (creator.value.custom_field && Array.isArray(creator.value.custom_field)) {
      checkoutFields.value = creator.value.custom_field;
    } else {
      checkoutFields.value = [
        { name: 'buyer_name', label: 'Buyer Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'whatsapp', label: 'WhatsApp', type: 'tel', required: false },
      ];
    }
    
    // Initialize form data
    checkoutFields.value.forEach((field: any) => {
      formData.value[field.name] = '';
    });
    
    // Load Disqus
    loadDisqus();
  } catch (error) {
    // Error handled silently in production
  }
});

const loadDisqus = () => {
  // Set Disqus config
  (window as any).disqus_config = function () {
    this.page.url = window.location.href;
    this.page.identifier = `product_${product.value?.id}`;
  };
  
  // Remove existing Disqus script if any
  const existingScript = document.querySelector('script[src*="disqus.com"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Load Disqus script
  const script = document.createElement('script');
  script.src = 'https://websitekita-1.disqus.com/embed.js';
  script.setAttribute('data-timestamp', (+new Date()).toString());
  document.body.appendChild(script);
};

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

const submitOrder = () => {
  isSubmitting.value = true;
  
  try {
    // Build message
    let message = '🛒 *ORDER BARU*\n\n';
    message += `📦 *Product:* ${product.value.title}\n`;
    message += `💰 *Price:* ${formatPrice(product.value.price)}\n\n`;
    
    // Add custom fields
    message += '📋 *Details:*\n';
    checkoutFields.value.forEach((field: any) => {
      const value = formData.value[field.name] || '-';
      message += `• ${field.label}: ${value}\n`;
    });
    
    message += '\n_Mohon diproses, terima kasih!_';
    
    // Open WhatsApp
    const whatsappNumber = creator.value.whatsapp?.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  } catch (error) {
    // Error handled silently in production
  } finally {
    isSubmitting.value = false;
  }
};

// Add Disqus type declaration
declare global {
  interface Window {
    disqus_config?: () => void;
  }
}

useHead({
  title: `Checkout - ${product.value?.title || 'WebsiteKita'}`,
});
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  background-color: #f9fafb;
}

.input-field:focus {
  outline: none;
  border-color: #ec4899;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

/* Disqus style matching with WebsiteKita theme */
#disqus_thread {
  color-scheme: light;
}

:deep(#disqus_thread a) {
  color: #ec4899;
}

:deep(#disqus_thread a:hover) {
  color: #db2777;
}
</style>
