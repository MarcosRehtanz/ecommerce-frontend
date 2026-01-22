import api from './axios';

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  imageData?: string;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: CartProduct;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface SyncCartRequest {
  productId: string;
  quantity: number;
}

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addItem: async (data: AddToCartRequest): Promise<Cart> => {
    const response = await api.post('/cart/items', data);
    return response.data;
  },

  updateItem: async (itemId: string, data: UpdateCartItemRequest): Promise<Cart> => {
    const response = await api.put(`/cart/items/${itemId}`, data);
    return response.data;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async (): Promise<Cart> => {
    const response = await api.delete('/cart');
    return response.data;
  },

  syncCart: async (items: SyncCartRequest[]): Promise<Cart> => {
    const response = await api.post('/cart/sync', items);
    return response.data;
  },
};
