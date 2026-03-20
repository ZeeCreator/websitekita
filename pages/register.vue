<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <!-- Register Content -->
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
          Buat halaman Anda
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sudah punya akun?
          <NuxtLink to="/login" class="font-medium text-pink-600 hover:text-pink-500">
            Masuk
          </NuxtLink>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10">
          <form class="space-y-6" @submit.prevent="handleRegister">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div class="mt-1">
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div class="mt-1 relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  required
                  pattern="[a-zA-Z0-9._]+"
                  class="input-field pl-8"
                  placeholder="jane"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">Your page will be: websitekita.id/@{{ form.username || 'username' }}</p>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
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
                  minlength="8"
                  class="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label for="passwordConfirm" class="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div class="mt-1">
                <input
                  id="passwordConfirm"
                  v-model="form.passwordConfirm"
                  type="password"
                  required
                  minlength="8"
                  class="input-field"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label for="whatsapp" class="block text-sm font-medium text-gray-700">
                WhatsApp Number (for orders)
              </label>
              <div class="mt-1">
                <input
                  id="whatsapp"
                  v-model="form.whatsapp"
                  type="text"
                  class="input-field"
                  placeholder="081234567890"
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
                :disabled="isLoading || form.password !== form.passwordConfirm"
                class="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isLoading">Creating your page...</span>
                <span v-else>Create Page</span>
              </button>
            </div>

            <p class="text-xs text-gray-500 text-center">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
});

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  whatsapp: '',
});

const error = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  error.value = '';

  if (form.value.password !== form.value.passwordConfirm) {
    error.value = 'Passwords do not match';
    return;
  }

  if (form.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters';
    return;
  }

  if (!/^[a-zA-Z0-9._]+$/.test(form.value.username)) {
    error.value = 'Username can only contain letters, numbers, dots, and underscores';
    return;
  }

  isLoading.value = true;

  try {
    const pb = useNuxtApp().$pb;

    // Create user with creator role
    const userData = {
      email: form.value.email,
      password: form.value.password,
      passwordConfirm: form.value.passwordConfirm,
      name: form.value.name,
      username: form.value.username,
      role: 'creator',
      whatsapp: form.value.whatsapp,
      // Auto-generate default checkout fields (custom_field column)
      custom_field: {
        fields: [
          { name: 'buyer_name', label: 'Your Name', type: 'text', required: true },
          { name: 'email', label: 'Email Address', type: 'email', required: true },
          { name: 'whatsapp', label: 'WhatsApp Number', type: 'tel', required: false },
        ],
      },
      // Auto-generate default WhatsApp message template
      whatsapp_message_template: '🛒 *ORDER BARU*\n\n📦 *Product:* {product}\n💰 *Price:* {price}\n\n📋 *Details:*\n{fields}\n\n_Mohon diproses, terima kasih!_',
    };

    const record = await pb.collection('users').create(userData);

    // Auto login
    await pb.collection('users').authWithPassword(form.value.email, form.value.password);

    await authStore.initAuth();
    router.push(`/@${form.value.username}`);
  } catch (e: any) {
    error.value = e.message || 'Registration failed';
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'Create your page - WebsiteKita',
});
</script>
