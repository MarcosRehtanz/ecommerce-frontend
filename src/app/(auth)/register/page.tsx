'use client';

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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';

const registerSchema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      notifications.show({
        title: 'Cuenta creada',
        message: 'Tu cuenta ha sido creada exitosamente',
        color: 'green',
      });
      router.push('/');
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo crear la cuenta',
        color: 'red',
      });
    },
  });

  const onSubmit = (values: RegisterForm) => {
    const { confirmPassword, ...data } = values;
    registerMutation.mutate(data);
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Crear Cuenta</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        ¿Ya tienes una cuenta?{' '}
        <Anchor component={Link} href="/login" size="sm">
          Inicia sesión
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Nombre"
              placeholder="Tu nombre"
              required
              {...register('name')}
              error={errors.name?.message}
            />
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
            <PasswordInput
              label="Confirmar Contraseña"
              placeholder="Confirma tu contraseña"
              required
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={registerMutation.isPending}
            >
              Registrarse
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
