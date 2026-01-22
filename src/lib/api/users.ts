import api from './axios';
import { User, PaginatedResponse, PaginationParams } from '@/types';

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'USER';
}

export interface UpdateUserDto {
  name?: string;
  password?: string;
  role?: 'ADMIN' | 'USER';
}

export interface UpdateProfileDto {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UsersQueryParams extends PaginationParams {
  role?: 'ADMIN' | 'USER';
}

export const usersApi = {
  // Admin endpoints
  getAll: async (params?: UsersQueryParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // User profile endpoint
  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    const response = await api.patch<User>('/users/profile', data);
    return response.data;
  },
};
