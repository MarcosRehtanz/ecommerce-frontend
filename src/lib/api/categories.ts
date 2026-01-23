import api from './axios';
import { Category, PaginatedResponse, PaginationParams } from '@/types';

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  imageData?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  imageData?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CategoriesQueryParams extends PaginationParams {
  isActive?: boolean;
}

export const categoriesApi = {
  // Public endpoints
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${slug}`);
    return response.data;
  },

  // Admin endpoints
  getAllAdmin: async (params?: CategoriesQueryParams): Promise<PaginatedResponse<Category>> => {
    const response = await api.get<PaginatedResponse<Category>>('/categories/admin/all', { params });
    return response.data;
  },

  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
