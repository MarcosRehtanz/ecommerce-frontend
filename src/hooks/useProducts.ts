'use client';

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  productsApi,
  CreateProductDto,
  UpdateProductDto,
  ProductsQueryParams,
} from '@/lib/api/products';
import { Product } from '@/types';

export const productsKeys = {
  all: ['products'] as const,
  lists: () => [...productsKeys.all, 'list'] as const,
  list: (params: ProductsQueryParams) => [...productsKeys.lists(), params] as const,
  infinite: (params: Omit<ProductsQueryParams, 'page'>) => [...productsKeys.all, 'infinite', params] as const,
  adminLists: () => [...productsKeys.all, 'admin-list'] as const,
  adminList: (params: ProductsQueryParams) => [...productsKeys.adminLists(), params] as const,
  details: () => [...productsKeys.all, 'detail'] as const,
  detail: (id: string) => [...productsKeys.details(), id] as const,
};

// Public hooks
export function useProducts(params?: ProductsQueryParams) {
  return useQuery({
    queryKey: productsKeys.list(params || {}),
    queryFn: () => productsApi.getAll(params),
  });
}

// Infinite scroll hook
export function useInfiniteProducts(params?: Omit<ProductsQueryParams, 'page'>) {
  const limit = params?.limit || 12;

  return useInfiniteQuery({
    queryKey: productsKeys.infinite(params || {}),
    queryFn: ({ pageParam = 1 }) => productsApi.getAll({ ...params, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    // Prefetch de la siguiente página
    staleTime: 60 * 1000, // 1 minuto
  });
}

export function useProduct(id: string, initialData?: Product | null) {
  return useQuery({
    queryKey: productsKeys.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    initialData: initialData ?? undefined,
  });
}

// Admin hooks
export function useProductsAdmin(params?: ProductsQueryParams) {
  return useQuery({
    queryKey: productsKeys.adminList(params || {}),
    queryFn: () => productsApi.getAllAdmin(params),
  });
}

export function useProductAdmin(id: string) {
  return useQuery({
    queryKey: productsKeys.detail(id),
    queryFn: () => productsApi.getByIdAdmin(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsKeys.adminLists() });
      notifications.show({
        title: 'Producto creado',
        message: 'El producto ha sido creado exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo crear el producto',
        color: 'red',
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(id) });
      notifications.show({
        title: 'Producto actualizado',
        message: 'El producto ha sido actualizado exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo actualizar el producto',
        color: 'red',
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsKeys.adminLists() });
      notifications.show({
        title: 'Producto eliminado',
        message: 'El producto ha sido eliminado exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo eliminar el producto',
        color: 'red',
      });
    },
  });
}
