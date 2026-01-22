import api from './axios';
import { PaginatedResponse, PaginationParams } from '@/types';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderProduct {
  id: string;
  name: string;
  imageUrl?: string;
  imageData?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: OrderProduct;
}

export interface OrderUser {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  user?: OrderUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shippingAddress?: string;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface OrdersQueryParams extends PaginationParams {
  status?: OrderStatus;
  userId?: string;
}

export interface OrderStats {
  totalOrders: number;
  byStatus: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  totalRevenue: number;
}

export const ordersApi = {
  // User endpoints
  create: async (data: CreateOrderRequest = {}): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getMyOrders: async (params: OrdersQueryParams = {}): Promise<PaginatedResponse<Order>> => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getMyOrder: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Admin endpoints
  getAllOrders: async (params: OrdersQueryParams = {}): Promise<PaginatedResponse<Order>> => {
    const response = await api.get('/orders/admin/all', { params });
    return response.data;
  },

  getOrderAdmin: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/admin/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, data: UpdateOrderStatusRequest): Promise<Order> => {
    const response = await api.put(`/orders/admin/${id}/status`, data);
    return response.data;
  },

  getStats: async (): Promise<OrderStats> => {
    const response = await api.get('/orders/admin/stats');
    return response.data;
  },
};
