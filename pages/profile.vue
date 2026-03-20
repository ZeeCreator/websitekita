<template>
  <div class="bg-gray-50 min-h-screen flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <div class="flex-1 py-8">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-center space-x-4 mb-6">
            <div class="w-20 h-20 rounded-full bg-gray-100 overflow-hidden">
              <div class="w-full h-full flex items-center justify-center bg-tokopedia-green text-white text-3xl font-bold">
                {{ authStore.user?.name?.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ authStore.user?.name }}</h2>
              <p class="text-gray-500">{{ authStore.user?.email }}</p>
              <span
                :class="{
                  'bg-green-100 text-green-800': authStore.user?.role === 'seller',
                  'bg-blue-100 text-blue-800': authStore.user?.role === 'buyer',
                  'bg-purple-100 text-purple-800': authStore.user?.role === 'admin',
                }"
                class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 capitalize"
              >
                {{ authStore.user?.role }}
              </span>
            </div>
          </div>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="input-field"
                disabled
              />
              <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div v-if="error" class="rounded-md bg-red-50 p-4">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>

            <div v-if="success" class="rounded-md bg-green-50 p-4">
              <p class="text-sm text-green-800">{{ success }}</p>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isLoading"
                class="btn-primary"
              >
                {{ isLoading ? 'Saving...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                v-model="passwordForm.oldPassword"
                type="password"
                required
                class="input-field"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                minlength="8"
                class="input-field"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                v-model="passwordForm.newPasswordConfirm"
                type="password"
                required
                minlength="8"
                class="input-field"
              />
            </div>

            <div v-if="passwordError" class="rounded-md bg-red-50 p-4">
              <p class="text-sm text-red-800">{{ passwordError }}</p>
            </div>

            <div v-if="passwordSuccess" class="rounded-md bg-green-50 p-4">
              <p class="text-sm text-green-800">{{ passwordSuccess }}</p>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isPasswordLoading"
                class="btn-primary"
              >
                {{ isPasswordLoading ? 'Changing...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Danger Zone -->
        <div class="bg-white rounded-lg shadow-md p-6 border border-red-200">
          <h3 class="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
          <p class="text-sm text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button
            @click="deleteAccount"
            class="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
});

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
});

const isLoading = ref(false);
const isPasswordLoading = ref(false);
const error = ref('');
const success = ref('');
const passwordError = ref('');
const passwordSuccess = ref('');

const updateProfile = async () => {
  error.value = '';
  success.value = '';
  isLoading.value = true;

  try {
    const pb = useNuxtApp().$pb;
    if (!authStore.user) throw new Error('Not authenticated');

    await pb.collection('users').update(authStore.user.id, {
      name: form.value.name,
    });

    authStore.updateUser({ name: form.value.name });
    success.value = 'Profile updated successfully!';
  } catch (e: any) {
    error.value = e.message || 'Failed to update profile';
  } finally {
    isLoading.value = false;
  }
};

const changePassword = async () => {
  passwordError.value = '';
  passwordSuccess.value = '';

  if (passwordForm.value.newPassword !== passwordForm.value.newPasswordConfirm) {
    passwordError.value = 'New passwords do not match';
    return;
  }

  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'Password must be at least 8 characters';
    return;
  }

  isPasswordLoading.value = true;

  try {
    const pb = useNuxtApp().$pb;
    if (!authStore.user) throw new Error('Not authenticated');

    await pb.collection('users').update(authStore.user.id, {
      oldPassword: passwordForm.value.oldPassword,
      password: passwordForm.value.newPassword,
      passwordConfirm: passwordForm.value.newPasswordConfirm,
    });

    passwordForm.value = { oldPassword: '', newPassword: '', newPasswordConfirm: '' };
    passwordSuccess.value = 'Password changed successfully!';
  } catch (e: any) {
    passwordError.value = e.message || 'Failed to change password';
  } finally {
    isPasswordLoading.value = false;
  }
};

const deleteAccount = async () => {
  if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    return;
  }

  try {
    const pb = useNuxtApp().$pb;
    if (!authStore.user) throw new Error('Not authenticated');

    await pb.collection('users').delete(authStore.user.id);
    authStore.logout();
    router.push('/');
  } catch (e: any) {
    alert('Failed to delete account: ' + e.message);
  }
};

useHead({
  title: 'Profile - Marketplace',
});
</script>
