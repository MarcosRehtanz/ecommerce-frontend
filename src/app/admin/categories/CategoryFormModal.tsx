'use client';

import {
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Button,
  Stack,
  Group,
  Text,
  Image,
  Box,
  ActionIcon,
  Paper,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IconUpload, IconPhoto, IconX, IconTrash } from '@tabler/icons-react';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { Category } from '@/types';
import { fileToBase64, validateFileSize, getProductImageSrc } from '@/utils/image';

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z
    .string()
    .min(2, 'El slug debe tener al menos 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  description: z.string(),
  imageUrl: z.string().url('URL inválida').or(z.literal('')),
  displayOrder: z.number().min(0, 'El orden debe ser mayor o igual a 0'),
  isActive: z.boolean(),
});

type CategoryForm = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  opened: boolean;
  onClose: () => void;
  category: Category | null;
}

export function CategoryFormModal({ opened, onClose, category }: CategoryFormModalProps) {
  const isEditing = !!category;
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const [imageData, setImageData] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      displayOrder: 0,
      isActive: true,
    },
  });

  const nameValue = watch('name');
  const imageUrlValue = watch('imageUrl');

  // Auto-generate slug from name (only when creating)
  useEffect(() => {
    if (!isEditing && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  }, [nameValue, isEditing, setValue]);

  useEffect(() => {
    if (category) {
      setValue('name', category.name);
      setValue('slug', category.slug);
      setValue('description', category.description || '');
      setValue('imageUrl', category.imageUrl || '');
      setValue('displayOrder', category.displayOrder);
      setValue('isActive', category.isActive);
      setImageData(category.imageData || null);
    } else {
      reset();
      setImageData(null);
    }
  }, [category, opened, setValue, reset]);

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (!validateFileSize(file, 2)) {
      notifications.show({
        title: 'Error',
        message: 'La imagen no debe superar 2MB',
        color: 'red',
      });
      return;
    }

    setIsUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setImageData(base64);
    } catch {
      notifications.show({
        title: 'Error',
        message: 'No se pudo cargar la imagen',
        color: 'red',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageData(null);
  };

  const onSubmit = (values: CategoryForm) => {
    if (isEditing) {
      updateMutation.mutate(
        {
          id: category.id,
          data: {
            name: values.name,
            slug: values.slug,
            description: values.description || null,
            imageUrl: values.imageUrl || null,
            imageData: imageData,
            displayOrder: values.displayOrder,
            isActive: values.isActive,
          },
        },
        {
          onSuccess: () => {
            onClose();
            reset();
            setImageData(null);
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          name: values.name,
          slug: values.slug,
          description: values.description || undefined,
          imageUrl: values.imageUrl || undefined,
          imageData: imageData || undefined,
          displayOrder: values.displayOrder,
          isActive: values.isActive,
        },
        {
          onSuccess: () => {
            onClose();
            reset();
            setImageData(null);
          },
        }
      );
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const currentImageSrc = getProductImageSrc(imageData, imageUrlValue, '');

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
      centered
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label="Nombre"
            placeholder="Nombre de la categoría"
            required
            {...register('name')}
            error={errors.name?.message}
          />
          <TextInput
            label="Slug"
            placeholder="nombre-de-la-categoria"
            description="Identificador URL (se genera automáticamente del nombre)"
            required
            {...register('slug')}
            error={errors.slug?.message}
          />
          <Textarea
            label="Descripción"
            placeholder="Descripción de la categoría"
            minRows={2}
            {...register('description')}
            error={errors.description?.message}
          />
          <Controller
            name="displayOrder"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Orden de visualización"
                description="Menor número = aparece primero"
                min={0}
                value={field.value}
                onChange={(val) => field.onChange(val || 0)}
                error={errors.displayOrder?.message}
                style={{ maxWidth: 200 }}
              />
            )}
          />

          {/* Image Section */}
          <Box>
            <Text size="sm" fw={500} mb={4}>
              Imagen de la categoría
            </Text>

            {currentImageSrc && (
              <Paper withBorder p="xs" radius="md" mb="sm">
                <Group justify="center" pos="relative">
                  <Image
                    src={currentImageSrc}
                    alt="Vista previa"
                    height={150}
                    fit="contain"
                    radius="md"
                  />
                  {imageData && (
                    <ActionIcon
                      color="red"
                      variant="filled"
                      pos="absolute"
                      top={5}
                      right={5}
                      onClick={handleRemoveImage}
                      title="Eliminar imagen subida"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  )}
                </Group>
              </Paper>
            )}

            <Dropzone
              onDrop={handleDrop}
              accept={IMAGE_MIME_TYPE}
              maxSize={2 * 1024 * 1024}
              multiple={false}
              loading={isUploading}
            >
              <Group justify="center" gap="xl" mih={80} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <IconUpload size={40} stroke={1.5} color="var(--mantine-color-blue-6)" />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={40} stroke={1.5} color="var(--mantine-color-red-6)" />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={40} stroke={1.5} color="var(--mantine-color-dimmed)" />
                </Dropzone.Idle>

                <div>
                  <Text size="sm" inline>
                    {currentImageSrc ? 'Cambiar imagen' : 'Arrastra una imagen o haz clic para seleccionar'}
                  </Text>
                  <Text size="xs" c="dimmed" inline mt={7}>
                    PNG, JPG, GIF o WEBP. Máximo 2MB.
                  </Text>
                </div>
              </Group>
            </Dropzone>

            <TextInput
              label="O ingresa URL de imagen"
              placeholder="https://ejemplo.com/imagen.jpg"
              mt="sm"
              {...register('imageUrl')}
              error={errors.imageUrl?.message}
            />
          </Box>

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                label="Categoría activa"
                description="Las categorías inactivas no se muestran en la tienda"
                checked={field.value}
                onChange={(event) => field.onChange(event.currentTarget.checked)}
              />
            )}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
