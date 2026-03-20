export default function useAuth() {
  const authStore = useAuthStore();

  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const user = computed(() => authStore.user);
  const isAdmin = computed(() => authStore.isAdmin);
  const isSeller = computed(() => authStore.isSeller);
  const isBuyer = computed(() => authStore.isBuyer);

  const login = async (email: string, password: string) => {
    return await authStore.login(email, password);
  };

  const register = async (email: string, password: string, name: string, role: 'seller' | 'buyer' = 'buyer') => {
    return await authStore.register(email, password, name, role);
  };

  const logout = async () => {
    await authStore.logout();
  };

  return {
    isAuthenticated,
    user,
    isAdmin,
    isSeller,
    isBuyer,
    login,
    register,
    logout,
  };
}
