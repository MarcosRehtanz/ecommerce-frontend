import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentsApi, CreatePreferenceRequest } from '@/lib/api/payments';
import { notifications } from '@mantine/notifications';

const useSandbox = process.env.NEXT_PUBLIC_MP_SANDBOX === 'true';

export const paymentKeys = {
  all: ['payments'] as const,
  status: (orderId: string) => [...paymentKeys.all, 'status', orderId] as const,
};

export function useCreatePreference() {
  return useMutation({
    mutationFn: (data: CreatePreferenceRequest) => paymentsApi.createPreference(data),
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo crear la preferencia de pago',
        color: 'red',
      });
    },
  });
}

/**
 * Hook to create a payment preference and redirect to MercadoPago
 * Takes just an orderId and handles the full flow
 */
export function useCreatePaymentPreference() {
  return useMutation({
    mutationFn: (orderId: string) => paymentsApi.createPreference({ orderId }),
    onSuccess: (data) => {
      // Redirect to MercadoPago checkout
      const checkoutUrl = useSandbox ? data.sandboxInitPoint : data.initPoint;
      window.location.href = checkoutUrl;
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo iniciar el pago',
        color: 'red',
      });
    },
  });
}

export function usePaymentStatus(orderId: string) {
  return useQuery({
    queryKey: paymentKeys.status(orderId),
    queryFn: () => paymentsApi.getPaymentStatus(orderId),
    enabled: !!orderId,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}

/**
 * Admin: Sync payment from MercadoPago
 */
export function useAdminSyncPayment() {
  return useMutation({
    mutationFn: ({ orderId, paymentId }: { orderId: string; paymentId: string }) =>
      paymentsApi.adminSyncPayment(orderId, paymentId),
    onSuccess: (data) => {
      notifications.show({
        title: 'Pago sincronizado',
        message: data.message,
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo sincronizar el pago',
        color: 'red',
      });
    },
  });
}

/**
 * Admin: Mark order as paid manually
 */
export function useAdminMarkAsPaid() {
  return useMutation({
    mutationFn: ({ orderId, paymentId }: { orderId: string; paymentId?: string }) =>
      paymentsApi.adminMarkAsPaid(orderId, paymentId),
    onSuccess: (data) => {
      notifications.show({
        title: 'Orden actualizada',
        message: data.message,
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo marcar como pagado',
        color: 'red',
      });
    },
  });
}
