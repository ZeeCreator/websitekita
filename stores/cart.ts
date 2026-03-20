import { defineStore } from 'pinia';
import type { CartItem } from '~/types';

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    totalItems(): number {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    totalPrice(): number {
      return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    formattedTotalPrice(): string {
      return this.formatPrice(this.totalPrice);
    },

    groupedByStore(): Record<string, CartItem[]> {
      return this.items.reduce((groups, item) => {
        if (!groups[item.store_id]) {
          groups[item.store_id] = [];
        }
        groups[item.store_id].push(item);
        return groups;
      }, {} as Record<string, CartItem[]>);
    },

    isEmpty(): boolean {
      return this.items.length === 0;
    },
  },

  actions: {
    formatPrice(price: number): string {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(price);
    },

    addItem(item: CartItem) {
      const existingIndex = this.items.findIndex(
        (i) => i.product_id === item.product_id
      );

      if (existingIndex > -1) {
        this.items[existingIndex].quantity += item.quantity;
      } else {
        this.items.push(item);
      }

      this.persistCart();
    },

    removeItem(productId: string) {
      this.items = this.items.filter((i) => i.product_id !== productId);
      this.persistCart();
    },

    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find((i) => i.product_id === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId);
        } else {
          item.quantity = quantity;
          this.persistCart();
        }
      }
    },

    clearCart() {
      this.items = [];
      this.persistCart();
    },

    persistCart() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.items));
      }
    },

    loadCart() {
      if (process.client) {
        const saved = localStorage.getItem('cart');
        if (saved) {
          try {
            this.items = JSON.parse(saved);
          } catch (e) {
            this.items = [];
          }
        }
      }
    },
  },
});
