<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <!-- Login Content -->
    <div class="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <NuxtLink to="/" class="flex justify-center">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        </NuxtLink>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Masuk ke akun Anda
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Atau
          <NuxtLink to="/register" class="font-medium text-pink-600 hover:text-pink-500">
            buat halaman baru
          </NuxtLink>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10">
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Alamat email
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="input-field"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  class="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div v-if="error" class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isLoading">Masuk...</span>
                <span v-else>Masuk</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
});

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  email: '',
  password: '',
});

const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    const pb = useNuxtApp().$pb;
    await pb.collection('users').authWithPassword(form.value.email, form.value.password);
    
    await authStore.initAuth();
    
    if (authStore.user?.role === 'creator') {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  } catch (e: any) {
    error.value = e.message || 'Login failed';
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'Sign in - WebsiteKita',
});
</script>
