export default function useCart() {
  const cartStore = useCartStore();

  const items = computed(() => cartStore.items);
  const totalItems = computed(() => cartStore.totalItems);
  const totalPrice = computed(() => cartStore.totalPrice);
  const formattedTotalPrice = computed(() => cartStore.formattedTotalPrice);
  const isEmpty = computed(() => cartStore.isEmpty);
  const groupedByStore = computed(() => cartStore.groupedByStore);

  const addItem = (item: any) => {
    cartStore.addItem(item);
  };

  const removeItem = (productId: string) => {
    cartStore.removeItem(productId);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    cartStore.updateQuantity(productId, quantity);
  };

  const clearCart = () => {
    cartStore.clearCart();
  };

  const formatPrice = (price: number) => {
    return cartStore.formatPrice(price);
  };

  return {
    items,
    totalItems,
    totalPrice,
    formattedTotalPrice,
    isEmpty,
    groupedByStore,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    formatPrice,
  };
}
