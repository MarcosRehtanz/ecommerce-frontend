'use client';

import {
  Container,
  Title,
  Card,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Group,
  Avatar,
  Text,
  Badge,
  Divider,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@/hooks/useAuth';
import { useUpdateProfile } from '@/hooks/useUsers';

const profileSchema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'Debes ingresar tu contraseña actual',
      path: ['currentPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length < 6) {
        return false;
      }
      return true;
    },
    {
      message: 'La nueva contraseña debe tener al menos 6 caracteres',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }
  );

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isAdmin } = useUser();
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: ProfileForm) => {
    const data: { name?: string; currentPassword?: string; newPassword?: string } = {};

    if (values.name !== user?.name) {
      data.name = values.name;
    }

    if (values.newPassword) {
      data.currentPassword = values.currentPassword;
      data.newPassword = values.newPassword;
    }

    if (Object.keys(data).length > 0) {
      updateProfileMutation.mutate(data, {
        onSuccess: () => {
          setValue('currentPassword', '');
          setValue('newPassword', '');
          setValue('confirmPassword', '');
        },
      });
    }
  };

  return (
    <Container size="sm" py="xl">
      <Title order={1} mb="lg">
        Mi Perfil
      </Title>

      <Card shadow="sm" padding="lg" withBorder>
        <Stack gap="lg">
          {/* User Avatar and Role */}
          <Group>
            <Avatar size="xl" color="blue" radius="xl">
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Stack gap={4}>
              <Text size="xl" fw={500}>
                {user?.name}
              </Text>
              <Group gap="xs">
                <Text c="dimmed">{user?.email}</Text>
                <Badge color={isAdmin ? 'red' : 'blue'}>
                  {isAdmin ? 'Administrador' : 'Usuario'}
                </Badge>
              </Group>
            </Stack>
          </Group>

          <Divider />

          {/* Profile Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <Title order={4}>Información Personal</Title>
              <TextInput
                label="Nombre"
                placeholder="Tu nombre"
                {...register('name')}
                error={errors.name?.message}
              />
              <TextInput
                label="Email"
                placeholder="tu@email.com"
                disabled
                value={user?.email || ''}
              />

              <Divider my="sm" />

              <Title order={4}>Cambiar Contraseña</Title>
              <Text size="sm" c="dimmed">
                Deja estos campos vacíos si no deseas cambiar tu contraseña
              </Text>

              <PasswordInput
                label="Contraseña Actual"
                placeholder="Tu contraseña actual"
                {...register('currentPassword')}
                error={errors.currentPassword?.message}
              />
              <PasswordInput
                label="Nueva Contraseña"
                placeholder="Nueva contraseña"
                {...register('newPassword')}
                error={errors.newPassword?.message}
              />
              <PasswordInput
                label="Confirmar Nueva Contraseña"
                placeholder="Confirma tu nueva contraseña"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />

              <Button
                type="submit"
                mt="md"
                loading={updateProfileMutation.isPending}
              >
                Guardar Cambios
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Container>
  );
}
