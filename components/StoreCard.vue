<template>
  <NuxtLink :to="storeUrl" class="group store-card block">
    <div class="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
      <img
        v-if="store.banner"
        :src="getBannerUrl()"
        :alt="store.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600">
        <span class="text-4xl font-bold text-white">{{ store.name.charAt(0).toUpperCase() }}</span>
      </div>
    </div>
    <div class="flex items-start space-x-3">
      <div class="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
        <img
          v-if="store.logo"
          :src="getLogoUrl()"
          :alt="store.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-pink-600 text-white font-bold">
          {{ store.name.charAt(0).toUpperCase() }}
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-base font-semibold text-gray-900 truncate group-hover:text-pink-600 transition-colors">{{ store.name }}</h3>
        <p class="text-sm text-gray-500 line-clamp-2 mt-1">{{ store.description }}</p>
      </div>
    </div>
    <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
      <span class="flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Indonesia
      </span>
      <span class="text-pink-600 font-medium">Kunjungi Toko →</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Store } from '~/types';

const props = defineProps<{
  store: Store;
}>();

const config = useRuntimeConfig();

const storeUrl = computed(() => `/@${props.store.slug}`);

const getLogoUrl = () => {
  if (!props.store.logo) return '';
  return `${config.public.pocketbaseUrl}api/files/${props.store.id}/${props.store.logo}`;
};

const getBannerUrl = () => {
  if (!props.store.banner) return '';
  return `${config.public.pocketbaseUrl}api/files/${props.store.id}/${props.store.banner}`;
};
</script>
