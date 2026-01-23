import api from './axios';
import { Product, PaginatedResponse, PaginationParams } from '@/types';

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  featured?: boolean;
  stock: number;
  imageUrl?: string;
  imageData?: string;
  categoryId?: string | null;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number | null;
  featured?: boolean;
  stock?: number;
  imageUrl?: string;
  imageData?: string | null;
  isActive?: boolean;
  categoryId?: string | null;
}

export interface ProductsQueryParams extends PaginationParams {
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  featured?: boolean;
  categoryId?: string;
  category?: string; // slug
}

export const productsApi = {
  // Public endpoints
  getAll: async (params?: ProductsQueryParams): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Admin endpoints
  getAllAdmin: async (params?: ProductsQueryParams): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products/admin/all', { params });
    return response.data;
  },

  getByIdAdmin: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/admin/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
