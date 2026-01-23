'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { newsletterApi, SubscribeDto } from '@/lib/api/newsletter';

export const newsletterKeys = {
  all: ['newsletter'] as const,
  adminList: (page: number, limit: number) => [...newsletterKeys.all, 'admin-list', page, limit] as const,
};

// Public hooks
export function useNewsletterSubscribe() {
  return useMutation({
    mutationFn: (data: SubscribeDto) => newsletterApi.subscribe(data),
    onSuccess: () => {
      notifications.show({
        title: '¡Suscripción exitosa!',
        message: 'Te has suscrito al newsletter. Recibirás las últimas novedades en tu correo.',
        color: 'green',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'No se pudo completar la suscripción';
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    },
  });
}

export function useNewsletterUnsubscribe() {
  return useMutation({
    mutationFn: (email: string) => newsletterApi.unsubscribe(email),
    onSuccess: () => {
      notifications.show({
        title: 'Suscripción cancelada',
        message: 'Has sido dado de baja del newsletter',
        color: 'blue',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'No se pudo cancelar la suscripción';
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    },
  });
}

// Admin hooks
export function useNewsletterSubscriptionsAdmin(page = 1, limit = 10) {
  return useQuery({
    queryKey: newsletterKeys.adminList(page, limit),
    queryFn: () => newsletterApi.getAllAdmin(page, limit),
  });
}

export function useDeleteNewsletterSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => newsletterApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all });
      notifications.show({
        title: 'Suscripción eliminada',
        message: 'La suscripción ha sido eliminada exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo eliminar la suscripción',
        color: 'red',
      });
    },
  });
}
