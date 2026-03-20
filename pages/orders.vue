<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <div class="flex-1 py-8">
      <div class="max-w-6xl mx-auto px-4">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Orders Management</h1>

        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>

        <div v-else-if="orders.length === 0" class="bg-white rounded-2xl shadow-md p-12 text-center">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
          <p class="text-gray-500">Orders will appear here when customers checkout</p>
        </div>

        <div v-else class="space-y-4">
          <!-- Order Card -->
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-bold text-lg">Order #{{ order.id.slice(0, 8) }}</h3>
                  <p class="text-sm text-gray-500">{{ formatDate(order.created) }}</p>
                </div>
                <span
                  :class="{
                    'bg-yellow-100 text-yellow-800': order.status === 'pending',
                    'bg-blue-100 text-blue-800': order.status === 'paid',
                    'bg-purple-100 text-purple-800': order.status === 'delivered',
                    'bg-green-100 text-green-800': order.status === 'completed',
                    'bg-red-100 text-red-800': order.status === 'cancelled',
                    'bg-orange-100 text-orange-800': order.status === 'refunded',
                  }"
                  class="px-3 py-1 text-xs font-medium rounded-full capitalize"
                >
                  {{ order.status }}
                </span>
              </div>

              <!-- Product Info -->
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4">
                <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img v-if="productsMap[order.product_id]?.thumbnail" :src="getProductImage(productsMap[order.product_id])" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <p class="font-medium">{{ productsMap[order.product_id]?.title || 'Product' }}</p>
                  <p class="text-pink-600 font-bold">{{ formatPrice(order.price) }}</p>
                </div>
              </div>

              <!-- Buyer Info -->
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-sm text-gray-500">Buyer</p>
                  <p class="font-medium">{{ order.buyer_name }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Contact</p>
                  <p class="font-medium">{{ order.buyer_email || order.buyer_whatsapp || '-' }}</p>
                </div>
              </div>

              <!-- Custom Fields -->
              <div v-if="order.custom_fields && Object.keys(order.custom_fields).length > 0" class="mb-4 p-4 bg-gray-50 rounded-xl">
                <p class="text-sm text-gray-500 mb-2">Order Details:</p>
                <div class="space-y-1">
                  <div v-for="(value, key) in order.custom_fields" :key="key">
                    <span class="text-sm text-gray-600 capitalize">{{ key }}:</span>
                    <span class="text-sm font-medium ml-2">{{ value }}</span>
                  </div>
                </div>
              </div>

              <!-- Note -->
              <div v-if="order.note" class="mb-4 p-4 bg-gray-50 rounded-xl">
                <p class="text-sm text-gray-500">Note:</p>
                <p class="text-sm text-gray-700">{{ order.note }}</p>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <select
                  v-model="order.status"
                  @change="updateOrderStatus(order)"
                  class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
                <a
                  :href="getWhatsAppLink(order)"
                  target="_blank"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <svg class="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
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
definePageMeta({
  middleware: 'creator',
});

const authStore = useAuthStore();
const { success, error: showError } = useAlert();
const config = useRuntimeConfig();

const orders = ref<any[]>([]);
const productsMap = ref<Record<string, any>>({});
const isLoading = ref(true);

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

const getProductImage = (product: any) => {
  if (!product.thumbnail) return '';
  const collectionId = product.collectionId || '5mkjdelz8eeumqc';
  return `${config.public.pocketbaseUrl}api/files/${collectionId}/${product.id}/${product.thumbnail}`;
};

const getWhatsAppLink = (order: any) => {
  const message = `Hi ${order.buyer_name}, thank you for your order! Your order #${order.id.slice(0, 8)} is being processed.`;
  const whatsappNumber = order.buyer_whatsapp?.replace(/[^0-9]/g, '') || '';
  return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
};

const updateOrderStatus = async (order: any) => {
  try {
    const pb = useNuxtApp().$pb;
    await pb.collection('orders').update(order.id, {
      status: order.status,
    });
    success(`Order status updated to ${order.status}!`, 'Updated');
  } catch (e: any) {
    showError(e.message || 'Failed to update status', 'Error');
  }
};

onMounted(async () => {
  try {
    const pb = useNuxtApp().$pb;
    if (!authStore.user) return;

    // Fetch orders for this creator
    orders.value = await pb.collection('orders').getFullList({
      filter: `creator_id = "${authStore.user.id}"`,
      sort: '-created',
    });

    // Fetch products to map product details
    const products = await pb.collection('products').getFullList();
    products.forEach((p: any) => {
      productsMap.value[p.id] = p;
    });
  } catch (error) {
    // Error handled silently in production
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: 'Orders - Dashboard',
});
</script>
