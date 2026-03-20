import { defineStore } from 'pinia';
import type { Store, Product } from '~/types';

interface StoreState {
  stores: Store[];
  currentStore: Store | null;
  products: Product[];
  isLoading: boolean;
}

export const useStoreStore = defineStore('store', {
  state: (): StoreState => ({
    stores: [],
    currentStore: null,
    products: [],
    isLoading: false,
  }),

  getters: {
    getStoreBySlug: (state) => (slug: string) => {
      return state.stores.find((s) => s.slug === slug);
    },

    getProductBySlug: (state) => (slug: string) => {
      return state.products.find((p) => p.slug === slug);
    },

    getProductsByStore: (state) => (storeId: string) => {
      return state.products.filter((p) => p.store_id === storeId);
    },
  },

  actions: {
    async fetchStores() {
      this.isLoading = true;
      try {
        const pb = useNuxtApp().$pb;
        const records = await pb.collection('stores').getFullList({
          sort: '-created',
        });
        this.stores = records as Store[];
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchStoreBySlug(slug: string) {
      this.isLoading = true;
      try {
        const pb = useNuxtApp().$pb;
        const record = await pb.collection('stores').getFirstListItem(`slug = "${slug}"`);
        this.currentStore = record as Store;
        return this.currentStore;
      } catch (error) {
        console.error('Failed to fetch store:', error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProductsByStore(storeId: string) {
      this.isLoading = true;
      try {
        const pb = useNuxtApp().$pb;
        const records = await pb.collection('products').getFullList({
          filter: `store_id = "${storeId}"`,
          sort: '-created',
        });
        this.products = records as Product[];
        return this.products;
      } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAllProducts() {
      this.isLoading = true;
      try {
        const pb = useNuxtApp().$pb;
        const records = await pb.collection('products').getFullList({
          sort: '-created',
          expand: 'store_id',
        });
        this.products = records as Product[];
        return this.products;
      } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    async createProduct(productData: Partial<Product>) {
      try {
        const pb = useNuxtApp().$pb;
        const record = await pb.collection('products').create(productData);
        this.products.unshift(record as Product);
        return { success: true, data: record };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.message || 'Failed to create product' 
        };
      }
    },

    async updateProduct(productId: string, productData: Partial<Product>) {
      try {
        const pb = useNuxtApp().$pb;
        const record = await pb.collection('products').update(productId, productData);
        const index = this.products.findIndex((p) => p.id === productId);
        if (index > -1) {
          this.products[index] = record as Product;
        }
        return { success: true, data: record };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.message || 'Failed to update product' 
        };
      }
    },

    async deleteProduct(productId: string) {
      try {
        const pb = useNuxtApp().$pb;
        await pb.collection('products').delete(productId);
        this.products = this.products.filter((p) => p.id !== productId);
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.message || 'Failed to delete product' 
        };
      }
    },

    setCurrentStore(store: Store | null) {
      this.currentStore = store;
    },
  },
});
