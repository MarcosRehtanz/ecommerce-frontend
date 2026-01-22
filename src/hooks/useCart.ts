import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, Cart, AddToCartRequest, UpdateCartItemRequest, SyncCartRequest } from '@/lib/api/cart';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '@/stores/authStore';

export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

export function useServerCart() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useAddToCartServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartApi.addItem(data),
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo agregar al carrito',
        color: 'red',
      });
    },
  });
}

export function useUpdateCartItemServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateCartItemRequest }) =>
      cartApi.updateItem(itemId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo actualizar el carrito',
        color: 'red',
      });
    },
  });
}

export function useRemoveCartItemServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo eliminar del carrito',
        color: 'red',
      });
    },
  });
}

export function useClearCartServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo vaciar el carrito',
        color: 'red',
      });
    },
  });
}

export function useSyncCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: SyncCartRequest[]) => cartApi.syncCart(items),
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
    },
  });
}
