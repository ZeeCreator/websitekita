<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const cartStore = useCartStore();

onMounted(() => {
  authStore.initAuth();
  cartStore.loadCart();
});
</script>
