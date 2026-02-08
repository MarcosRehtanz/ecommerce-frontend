'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { authApi, LoginDto, RegisterDto } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/routes';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      notifications.show({
        title: 'Bienvenido',
        message: `Hola, ${data.user.name}!`,
        color: 'green',
      });
      router.push(ROUTES.home);
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error de inicio de sesión',
        message: error.message || 'Credenciales inválidas',
        color: 'red',
      });
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      notifications.show({
        title: 'Cuenta creada',
        message: 'Tu cuenta ha sido creada exitosamente',
        color: 'green',
      });
      router.push(ROUTES.home);
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error de registro',
        message: error.message || 'No se pudo crear la cuenta',
        color: 'red',
      });
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      notifications.show({
        title: 'Sesión cerrada',
        message: 'Has cerrado sesión correctamente',
        color: 'blue',
      });
      router.push(ROUTES.home);
    },
    onError: () => {
      // Even if the API call fails, logout locally
      logout();
      queryClient.clear();
      router.push(ROUTES.home);
    },
  });
}

export function useMe() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authApi.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUser() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'ADMIN',
  };
}
