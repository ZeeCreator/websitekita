import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  whatsapp?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  telegram?: string;
  role: 'admin' | 'creator';
  created?: string;
  updated?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.user;
    },

    isAdmin(): boolean {
      return this.user?.role === 'admin';
    },

    isCreator(): boolean {
      return this.user?.role === 'creator';
    },

    userName(): string {
      return this.user?.name || 'Guest';
    },

    userEmail(): string {
      return this.user?.email || '';
    },
  },

  actions: {
    async initAuth() {
      const pb = useNuxtApp().$pb;
      if (pb.authStore.isValid && pb.authStore.token && pb.authStore.model) {
        this.user = pb.authStore.model as User;
      }
    },

    async login(email: string, password: string) {
      this.isLoading = true;
      try {
        const pb = useNuxtApp().$pb;
        await pb.collection('users').authWithPassword(email, password);
        
        this.user = pb.authStore.model as User;
        
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.message || 'Login failed' 
        };
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      const pb = useNuxtApp().$pb;
      pb.authStore.clear();
      this.user = null;
      navigateTo('/');
    },

    updateUser(user: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...user };
      }
    },
  },
});
