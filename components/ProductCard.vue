<template>
  <NuxtLink :to="productUrl" class="group product-card block">
    <div class="relative aspect-square overflow-hidden bg-gray-100">
      <img
        v-if="product.images && product.images.length > 0"
        :src="getImageUrl(product.images[0])"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div
        v-if="product.stock <= 0"
        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Habis
        </span>
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors">
        {{ product.name }}
      </h3>
      <p class="text-lg font-bold text-pink-600 mb-1">
        {{ formatCurrency(product.price) }}
      </p>
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span v-if="product.stock > 0">Stok: {{ product.stock }}</span>
        <span>{{ product.category || 'Umum' }}</span>
      </div>
      <div v-if="showStore && storeName" class="mt-2 pt-2 border-t border-gray-100">
        <p class="text-xs text-gray-600 truncate">{{ storeName }}</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from '~/types';

const props = defineProps<{
  product: Product;
  showStore?: boolean;
}>();

const config = useRuntimeConfig();

const getImageUrl = (filename: string) => {
  if (!filename) return '';
  return `${config.public.pocketbaseUrl}api/files/${props.product.store_id}/${filename}`;
};

const productUrl = computed(() => {
  if (props.product.expand?.store_id) {
    return `/@${props.product.expand.store_id.slug}/product/${props.product.slug}`;
  }
  return `/product/${props.product.slug}`;
});

const storeName = computed(() => {
  return props.product.expand?.store_id?.name || '';
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};
</script>
