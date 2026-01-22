'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  usersApi,
  CreateUserDto,
  UpdateUserDto,
  UpdateProfileDto,
  UsersQueryParams,
} from '@/lib/api/users';
import { useAuthStore } from '@/stores/authStore';

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params: UsersQueryParams) => [...usersKeys.lists(), params] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

export function useUsers(params?: UsersQueryParams) {
  return useQuery({
    queryKey: usersKeys.list(params || {}),
    queryFn: () => usersApi.getAll(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      notifications.show({
        title: 'Usuario creado',
        message: 'El usuario ha sido creado exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo crear el usuario',
        color: 'red',
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      usersApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
      notifications.show({
        title: 'Usuario actualizado',
        message: 'El usuario ha sido actualizado exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo actualizar el usuario',
        color: 'red',
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      notifications.show({
        title: 'Usuario eliminado',
        message: 'El usuario ha sido eliminado exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo eliminar el usuario',
        color: 'red',
      });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: (data: UpdateProfileDto) => usersApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update the user in the auth store
      if (accessToken && refreshToken) {
        setAuth(updatedUser, accessToken, refreshToken);
      }
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      notifications.show({
        title: 'Perfil actualizado',
        message: 'Tu perfil ha sido actualizado exitosamente',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo actualizar el perfil',
        color: 'red',
      });
    },
  });
}
