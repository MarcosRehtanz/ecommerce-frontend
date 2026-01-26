'use client';

import { useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Anchor,
  Alert,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const sessionExpired = searchParams.get('session') === 'expired';
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      notifications.show({
        title: 'Bienvenido',
        message: `Hola, ${data.user.name}!`,
        color: 'green',
      });
      router.push(redirect);
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Credenciales inválidas',
        color: 'red',
      });
    },
  });

  const onSubmit = (values: LoginForm) => {
    loginMutation.mutate(values);
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Iniciar Sesión</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        ¿No tienes una cuenta?{' '}
        <Anchor component={Link} href="/register" size="sm">
          Regístrate
        </Anchor>
      </Text>

      {sessionExpired && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="orange"
          mt="md"
          title="Sesión expirada"
        >
          Tu sesión ha expirado. Por favor, inicia sesión nuevamente.
        </Alert>
      )}

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="tu@email.com"
              required
              {...register('email')}
              error={errors.email?.message}
            />
            <PasswordInput
              label="Contraseña"
              placeholder="Tu contraseña"
              required
              {...register('password')}
              error={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={loginMutation.isPending}
            >
              Iniciar Sesión
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
