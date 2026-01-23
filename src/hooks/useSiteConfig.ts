'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  siteConfigApi,
  CreateSiteConfigDto,
  UpdateSiteConfigDto,
} from '@/lib/api/site-config';

export const siteConfigKeys = {
  all: ['site-config'] as const,
  homepage: () => [...siteConfigKeys.all, 'homepage'] as const,
  details: () => [...siteConfigKeys.all, 'detail'] as const,
  detail: (key: string) => [...siteConfigKeys.details(), key] as const,
  adminList: () => [...siteConfigKeys.all, 'admin-list'] as const,
};

// Public hooks
export function useHomepageConfig() {
  return useQuery({
    queryKey: siteConfigKeys.homepage(),
    queryFn: () => siteConfigApi.getHomepage(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useSiteConfig(key: string) {
  return useQuery({
    queryKey: siteConfigKeys.detail(key),
    queryFn: () => siteConfigApi.getByKey(key),
    enabled: !!key,
  });
}

// Admin hooks
export function useSiteConfigsAdmin() {
  return useQuery({
    queryKey: siteConfigKeys.adminList(),
    queryFn: () => siteConfigApi.getAllAdmin(),
  });
}

export function useCreateSiteConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSiteConfigDto) => siteConfigApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteConfigKeys.all });
      notifications.show({
        title: 'Configuración creada',
        message: 'La configuración ha sido creada exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo crear la configuración',
        color: 'red',
      });
    },
  });
}

export function useUpdateSiteConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: UpdateSiteConfigDto }) =>
      siteConfigApi.update(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteConfigKeys.all });
      notifications.show({
        title: 'Configuración actualizada',
        message: 'La configuración ha sido actualizada exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo actualizar la configuración',
        color: 'red',
      });
    },
  });
}

export function useDeleteSiteConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => siteConfigApi.delete(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteConfigKeys.all });
      notifications.show({
        title: 'Configuración eliminada',
        message: 'La configuración ha sido eliminada exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo eliminar la configuración',
        color: 'red',
      });
    },
  });
}
