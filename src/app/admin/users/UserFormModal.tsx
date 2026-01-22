'use client';

import {
  Modal,
  TextInput,
  PasswordInput,
  Select,
  Button,
  Stack,
  Group,
} from '@mantine/core';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateUser, useUpdateUser } from '@/hooks/useUsers';
import { User } from '@/types';

const createUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['ADMIN', 'USER']),
});

const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .or(z.literal('')),
  role: z.enum(['ADMIN', 'USER']),
});

type UserForm = z.infer<typeof createUserSchema>;

interface UserFormModalProps {
  opened: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserFormModal({ opened, onClose, user }: UserFormModalProps) {
  const isEditing = !!user;
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('password', '');
      setValue('role', user.role);
    } else {
      reset();
    }
  }, [user, opened, setValue, reset]);

  const onSubmit = (values: UserForm) => {
    if (isEditing) {
      const updateData: { name?: string; password?: string; role?: 'ADMIN' | 'USER' } = {
        name: values.name,
        role: values.role,
      };
      if (values.password) {
        updateData.password = values.password;
      }
      updateUserMutation.mutate(
        { id: user.id, data: updateData },
        {
          onSuccess: () => {
            onClose();
            reset();
          },
        }
      );
    } else {
      createUserMutation.mutate(values, {
        onSuccess: () => {
          onClose();
          reset();
        },
      });
    }
  };

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label="Nombre"
            placeholder="Nombre completo"
            required
            {...register('name')}
            error={errors.name?.message}
          />
          <TextInput
            label="Email"
            placeholder="email@ejemplo.com"
            required
            disabled={isEditing}
            {...register('email')}
            error={errors.email?.message}
          />
          <PasswordInput
            label={isEditing ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}
            placeholder="Contraseña"
            required={!isEditing}
            {...register('password')}
            error={errors.password?.message}
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                label="Rol"
                placeholder="Selecciona un rol"
                required
                data={[
                  { value: 'USER', label: 'Usuario' },
                  { value: 'ADMIN', label: 'Administrador' },
                ]}
                value={field.value}
                onChange={(val) => field.onChange(val || 'USER')}
                error={errors.role?.message}
              />
            )}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
