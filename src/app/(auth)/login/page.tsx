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
  Group,
  UnstyledButton,
  ThemeIcon,
} from '@mantine/core';
import { IconAlertCircle, IconUser, IconShield } from '@tabler/icons-react';
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
    setValue,
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

  const fillCredentials = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
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

      {/* Test credentials for evaluators */}
      <Paper withBorder p="md" mt="lg" radius="md" bg="gray.0">
        <Text size="sm" fw={600} mb="sm">
          Usuarios de prueba
        </Text>
        <Stack gap="xs">
          <UnstyledButton
            onClick={() => fillCredentials('admin@example.com', 'Admin123!')}
            style={{ border: '1px solid var(--mantine-color-blue-3)', borderRadius: 8, padding: '10px 14px' }}
          >
            <Group gap="sm" justify="space-between">
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon color="blue" variant="light" size="md">
                  <IconShield size={16} />
                </ThemeIcon>
                <div>
                  <Text size="sm" fw={600}>Administrador</Text>
                  <Text size="xs" c="dimmed">admin@example.com</Text>
                </div>
              </Group>
              <Text size="xs" c="dimmed" ff="monospace">Admin123!</Text>
            </Group>
          </UnstyledButton>
          <UnstyledButton
            onClick={() => fillCredentials('user@example.com', 'User123!')}
            style={{ border: '1px solid var(--mantine-color-green-3)', borderRadius: 8, padding: '10px 14px' }}
          >
            <Group gap="sm" justify="space-between">
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon color="green" variant="light" size="md">
                  <IconUser size={16} />
                </ThemeIcon>
                <div>
                  <Text size="sm" fw={600}>Cliente</Text>
                  <Text size="xs" c="dimmed">user@example.com</Text>
                </div>
              </Group>
              <Text size="xs" c="dimmed" ff="monospace">User123!</Text>
            </Group>
          </UnstyledButton>
        </Stack>
      </Paper>
    </Container>
  );
}
