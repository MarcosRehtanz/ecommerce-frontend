import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ordersApi,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  OrdersQueryParams,
} from '@/lib/api/orders';
import { notifications } from '@mantine/notifications';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: OrdersQueryParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  adminLists: () => [...orderKeys.all, 'admin', 'list'] as const,
  adminList: (params: OrdersQueryParams) => [...orderKeys.adminLists(), params] as const,
  adminDetail: (id: string) => [...orderKeys.all, 'admin', 'detail', id] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
};

// ==================== USER HOOKS ====================

export function useMyOrders(params: OrdersQueryParams = {}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.getMyOrders(params),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMyOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getMyOrder(id),
    enabled: !!id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest = {}) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      notifications.show({
        title: 'Pedido creado',
        message: 'Tu pedido ha sido creado exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo crear el pedido',
        color: 'red',
      });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersApi.cancelOrder(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.setQueryData(orderKeys.detail(data.id), data);
      notifications.show({
        title: 'Pedido cancelado',
        message: 'Tu pedido ha sido cancelado',
        color: 'orange',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo cancelar el pedido',
        color: 'red',
      });
    },
  });
}

// ==================== ADMIN HOOKS ====================

export function useOrdersAdmin(params: OrdersQueryParams = {}) {
  return useQuery({
    queryKey: orderKeys.adminList(params),
    queryFn: () => ordersApi.getAllOrders(params),
  });
}

export function useOrderAdmin(id: string) {
  return useQuery({
    queryKey: orderKeys.adminDetail(id),
    queryFn: () => ordersApi.getOrderAdmin(id),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusRequest }) =>
      ordersApi.updateStatus(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.adminLists() });
      queryClient.setQueryData(orderKeys.adminDetail(data.id), data);
      notifications.show({
        title: 'Estado actualizado',
        message: `El pedido ahora está ${getStatusLabel(data.status)}`,
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo actualizar el estado',
        color: 'red',
      });
    },
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: () => ordersApi.getStats(),
  });
}

// Helper function
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };
  return labels[status] || status;
}
