<template>
  <div class="bg-gray-50 min-h-screen flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <div class="flex-1 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Keranjang Belanja</h1>

        <!-- Empty Cart -->
        <div v-if="cartStore.isEmpty" class="bg-white rounded-lg shadow-md p-12 text-center">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Keranjang Anda Kosong</h2>
        <p class="text-gray-500 mb-6">Mulai belanja untuk menambahkan produk ke keranjang.</p>
        <NuxtLink to="/" class="btn-primary inline-block">
          Mulai Belanja
        </NuxtLink>
        </div>

        <!-- Cart Items -->
        <div v-else>
          <!-- Grouped by Store -->
          <div
            v-for="(items, storeId) in cartStore.groupedByStore"
            :key="storeId"
            class="bg-white rounded-lg shadow-md mb-6 overflow-hidden"
          >
            <div class="bg-gray-50 px-6 py-4 border-b">
              <h3 class="font-semibold text-gray-900">{{ items[0]?.store_name || 'Toko' }}</h3>
            </div>
            <div class="divide-y">
              <div
                v-for="item in items"
              :key="item.product_id"
              class="p-6 flex items-center space-x-4"
            >
              <!-- Product Image -->
              <div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  v-if="item.image"
                  :src="getImageUrl(item)"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 truncate">{{ item.name }}</h4>
                <p class="text-tokopedia-green font-bold mt-1">{{ formatCurrency(item.price) }}</p>
              </div>

              <!-- Quantity -->
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  @click="updateQuantity(item.product_id, item.quantity - 1)"
                  class="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="w-12 text-center">{{ item.quantity }}</span>
                <button
                  @click="updateQuantity(item.product_id, item.quantity + 1)"
                  class="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <!-- Subtotal -->
              <div class="text-right min-w-[100px]">
                <p class="font-bold text-gray-900">{{ formatCurrency(item.price * item.quantity) }}</p>
              </div>

              <!-- Remove Button -->
              <button
                @click="removeItem(item.product_id)"
                class="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            </div>
          </div>
        </div>

        <!-- Checkout Section -->
        <div class="bg-white rounded-lg shadow-md p-6 sticky bottom-4">
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-600">Total ({{ cartStore.totalItems }} item):</span>
            <span class="text-2xl font-bold text-tokopedia-green">{{ cartStore.formattedTotalPrice }}</span>
          </div>

          <!-- Buyer Info -->
          <div class="mb-4">
            <label for="buyerName" class="block text-sm font-medium text-gray-700 mb-2">
              Nama Penerima
            </label>
            <input
              id="buyerName"
              v-model="buyerName"
              type="text"
              class="input-field"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div class="mb-6">
            <label for="buyerNote" class="block text-sm font-medium text-gray-700 mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              id="buyerNote"
              v-model="buyerNote"
              rows="3"
              class="input-field"
              placeholder="Catatan untuk penjual (alamat, permintaan khusus, dll)"
            />
          </div>

          <!-- Checkout Buttons per Store -->
          <div class="space-y-3">
            <button
              v-for="(items, storeId) in cartStore.groupedByStore"
              :key="storeId"
              @click="checkoutToWhatsApp(storeId)"
              class="w-full flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Checkout ke WhatsApp - {{ items[0]?.store_name }}
            </button>
          </div>

          <button
            @click="clearCart"
            class="w-full mt-4 px-6 py-3 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Kosongkan Keranjang
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore();
const { openWhatsApp, cartCheckoutWhatsApp } = useWhatsApp();
const storeStore = useStoreStore();

const buyerName = ref('');
const buyerNote = ref('');

const config = useRuntimeConfig();

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const getImageUrl = (item: any) => {
  if (!item.image) return '';
  return `${config.public.pocketbaseUrl}api/files/${item.store_id}/${item.image}`;
};

const updateQuantity = (productId: string, quantity: number) => {
  cartStore.updateQuantity(productId, quantity);
};

const removeItem = (productId: string) => {
  cartStore.removeItem(productId);
};

const clearCart = () => {
  if (confirm('Yakin ingin mengosongkan keranjang?')) {
    cartStore.clearCart();
  }
};

const getStoreWhatsApp = async (storeId: string) => {
  const stores = await storeStore.fetchStores();
  const store = stores.find(s => s.id === storeId);
  return store?.whatsapp_number || '';
};

const checkoutToWhatsApp = async (storeId: string) => {
  if (!buyerName.value.trim()) {
    alert('Mohon isi nama penerima');
    return;
  }

  const items = cartStore.groupedByStore[storeId];
  if (!items) return;

  const whatsappNumber = await getStoreWhatsApp(storeId);
  if (!whatsappNumber) {
    alert('Nomor WhatsApp toko tidak tersedia');
    return;
  }

  const orderItems = items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const whatsappUrl = cartCheckoutWhatsApp(
    whatsappNumber,
    orderItems,
    total,
    buyerName.value,
    buyerNote.value
  );

  openWhatsApp(whatsappUrl);

  // Clear cart after checkout
  items.forEach(item => cartStore.removeItem(item.product_id));
};

useHead({
  title: 'Keranjang Belanja - Marketplace',
});
</script>
