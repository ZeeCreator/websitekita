export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'seller' | 'buyer';
  created: string;
  updated: string;
}

export interface Store {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  banner?: string;
  whatsapp_number: string;
  created?: string;
  updated?: string;
  expand?: {
    user_id?: User;
  };
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images?: string[];
  created?: string;
  updated?: string;
  expand?: {
    store_id?: Store;
  };
}

export interface Order {
  id: string;
  store_id: string;
  products: Array<{
    product_id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total_price: number;
  buyer_name: string;
  buyer_note: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
  created?: string;
  updated?: string;
  expand?: {
    store_id?: Store;
  };
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  store_id: string;
  store_name: string;
  whatsapp_number: string;
}
