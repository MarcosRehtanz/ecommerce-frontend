'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  categoriesApi,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoriesQueryParams,
} from '@/lib/api/categories';

export const categoriesKeys = {
  all: ['categories'] as const,
  lists: () => [...categoriesKeys.all, 'list'] as const,
  list: () => [...categoriesKeys.lists(), 'public'] as const,
  adminLists: () => [...categoriesKeys.all, 'admin-list'] as const,
  adminList: (params: CategoriesQueryParams) => [...categoriesKeys.adminLists(), params] as const,
  details: () => [...categoriesKeys.all, 'detail'] as const,
  detail: (slug: string) => [...categoriesKeys.details(), slug] as const,
};

// Public hooks
export function useCategories() {
  return useQuery({
    queryKey: categoriesKeys.list(),
    queryFn: () => categoriesApi.getAll(),
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: categoriesKeys.detail(slug),
    queryFn: () => categoriesApi.getBySlug(slug),
    enabled: !!slug,
  });
}

// Admin hooks
export function useCategoriesAdmin(params?: CategoriesQueryParams) {
  return useQuery({
    queryKey: categoriesKeys.adminList(params || {}),
    queryFn: () => categoriesApi.getAllAdmin(params),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.adminLists() });
      notifications.show({
        title: 'Categoría creada',
        message: 'La categoría ha sido creada exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo crear la categoría',
        color: 'red',
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.details() });
      notifications.show({
        title: 'Categoría actualizada',
        message: 'La categoría ha sido actualizada exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo actualizar la categoría',
        color: 'red',
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.adminLists() });
      notifications.show({
        title: 'Categoría eliminada',
        message: 'La categoría ha sido eliminada exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo eliminar la categoría',
        color: 'red',
      });
    },
  });
}
