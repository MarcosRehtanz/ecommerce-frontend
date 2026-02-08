'use client';

import {
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Anchor,
  Box,
} from '@mantine/core';
import { motion } from 'framer-motion';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/routes';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

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
      router.push(ROUTES.home);
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Stack gap={0}>
        <motion.div variants={itemVariants}>
          <Text
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.5px',
            }}
          >
            Crear Cuenta
          </Text>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Text size="sm" mt={6} style={{ color: 'rgba(255,255,255,0.5)' }}>
            Completa tus datos para registrarte.{' '}
            <Anchor
              component={Link}
              href={ROUTES.auth.login}
              size="sm"
              style={{ color: 'var(--electric-orchid)' }}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Anchor>
          </Text>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box
            mt={28}
            p={28}
            style={{
              background: 'var(--glass-white)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="md">
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
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    mt="sm"
                    loading={registerMutation.isPending}
                    size="md"
                    styles={{
                      root: {
                        background: 'var(--electric-orchid)',
                        borderRadius: 'var(--radius-full)',
                        boxShadow: 'var(--glow-orchid)',
                        transition: 'all var(--transition-normal)',
                        '&:hover': {
                          boxShadow: 'var(--glow-orchid-hover)',
                        },
                      },
                    }}
                  >
                    Registrarse
                  </Button>
                </motion.div>
              </Stack>
            </form>
          </Box>
        </motion.div>
      </Stack>
    </motion.div>
  );
}
