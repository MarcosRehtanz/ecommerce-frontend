'use client';

import { useState } from 'react';
import {
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Anchor,
  Alert,
  Group,
  UnstyledButton,
  Box,
  Collapse,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconUser,
  IconShield,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/routes';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || ROUTES.home;
  const sessionExpired = searchParams.get('session') === 'expired';
  const setAuth = useAuthStore((state) => state.setAuth);
  const [testOpen, setTestOpen] = useState(false);

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
            Bienvenido
          </Text>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Text size="sm" mt={6} style={{ color: 'rgba(255,255,255,0.5)' }}>
            Inicia sesión en tu cuenta.{' '}
            <Anchor
              component={Link}
              href={ROUTES.auth.register}
              size="sm"
              style={{ color: 'var(--electric-orchid)' }}
            >
              ¿No tienes cuenta? Regístrate
            </Anchor>
          </Text>
        </motion.div>

        {sessionExpired && (
          <motion.div variants={itemVariants}>
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="orange"
              mt="md"
              title="Sesión expirada"
              radius="md"
              styles={{
                root: {
                  background: 'rgba(251, 146, 60, 0.1)',
                  border: '1px solid rgba(251, 146, 60, 0.3)',
                },
              }}
            >
              Tu sesión ha expirado. Por favor, inicia sesión nuevamente.
            </Alert>
          </motion.div>
        )}

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
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    mt="sm"
                    loading={loginMutation.isPending}
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
                    Iniciar Sesión
                  </Button>
                </motion.div>
              </Stack>
            </form>
          </Box>
        </motion.div>

        {/* Test credentials — collapsible */}
        <motion.div variants={itemVariants}>
          <Box mt="lg">
            <UnstyledButton
              onClick={() => setTestOpen((o) => !o)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: 'rgba(255,255,255,0.4)',
                fontSize: 13,
              }}
            >
              Usuarios de prueba
              {testOpen ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
            </UnstyledButton>
            <Collapse in={testOpen}>
              <Stack gap="xs" mt="xs">
                <UnstyledButton
                  onClick={() => fillCredentials('admin@example.com', 'Admin123!')}
                  style={{
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    background: 'rgba(124, 58, 237, 0.08)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <Group gap="sm" justify="space-between">
                    <Group gap="sm" wrap="nowrap">
                      <IconShield size={16} style={{ color: 'var(--electric-orchid)' }} />
                      <div>
                        <Text size="sm" fw={600} c="white">Administrador</Text>
                        <Text size="xs" style={{ color: 'rgba(255,255,255,0.45)' }}>admin@example.com</Text>
                      </div>
                    </Group>
                    <Text size="xs" ff="monospace" style={{ color: 'rgba(255,255,255,0.4)' }}>Admin123!</Text>
                  </Group>
                </UnstyledButton>
                <UnstyledButton
                  onClick={() => fillCredentials('user@example.com', 'User123!')}
                  style={{
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <Group gap="sm" justify="space-between">
                    <Group gap="sm" wrap="nowrap">
                      <IconUser size={16} style={{ color: 'var(--jade-mint)' }} />
                      <div>
                        <Text size="sm" fw={600} c="white">Cliente</Text>
                        <Text size="xs" style={{ color: 'rgba(255,255,255,0.45)' }}>user@example.com</Text>
                      </div>
                    </Group>
                    <Text size="xs" ff="monospace" style={{ color: 'rgba(255,255,255,0.4)' }}>User123!</Text>
                  </Group>
                </UnstyledButton>
              </Stack>
            </Collapse>
          </Box>
        </motion.div>
      </Stack>
    </motion.div>
  );
}
