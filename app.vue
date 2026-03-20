<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const cartStore = useCartStore();

onMounted(async () => {
  if (process.client) {
    await authStore.initAuth();
    await cartStore.loadCart();
  }
});
</script>
