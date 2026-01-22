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
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Product } from '@/types';
import { fileToBase64, validateFileSize, getProductImageSrc } from '@/utils/image';

const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  stock: z.number().min(0, 'El stock debe ser mayor o igual a 0'),
  imageUrl: z.string().url('URL inválida').or(z.literal('')),
  isActive: z.boolean(),
});

type ProductForm = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  opened: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ProductFormModal({ opened, onClose, product }: ProductFormModalProps) {
  const isEditing = !!product;
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  // State for uploaded image (base64)
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
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      imageUrl: '',
      isActive: true,
    },
  });

  const imageUrlValue = watch('imageUrl');

  useEffect(() => {
    if (product) {
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', Number(product.price));
      setValue('stock', product.stock);
      setValue('imageUrl', product.imageUrl || '');
      setValue('isActive', product.isActive);
      setImageData(product.imageData || null);
    } else {
      reset();
      setImageData(null);
    }
  }, [product, opened, setValue, reset]);

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
      notifications.show({
        title: 'Imagen cargada',
        message: 'La imagen se cargó correctamente',
        color: 'green',
      });
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

  const handleReject = (fileRejections: { file: File; errors: { code: string }[] }[]) => {
    const rejection = fileRejections[0];
    if (!rejection) return;

    const error = rejection.errors[0];
    let message = 'No se pudo cargar la imagen';

    if (error?.code === 'file-too-large') {
      const sizeMB = (rejection.file.size / (1024 * 1024)).toFixed(1);
      message = `La imagen pesa ${sizeMB}MB. El máximo permitido es 2MB.`;
    } else if (error?.code === 'file-invalid-type') {
      message = 'Formato no válido. Usa PNG, JPG, GIF o WEBP.';
    }

    notifications.show({
      title: 'Imagen rechazada',
      message,
      color: 'red',
    });
  };

  const onSubmit = (values: ProductForm) => {
    if (isEditing) {
      const updateData = {
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        imageUrl: values.imageUrl || undefined,
        imageData: imageData,
        isActive: values.isActive,
      };
      updateProductMutation.mutate(
        { id: product.id, data: updateData },
        {
          onSuccess: () => {
            onClose();
            reset();
            setImageData(null);
          },
        }
      );
    } else {
      const createData = {
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        imageUrl: values.imageUrl || undefined,
        imageData: imageData || undefined,
      };
      createProductMutation.mutate(createData, {
        onSuccess: () => {
          onClose();
          reset();
          setImageData(null);
        },
      });
    }
  };

  const isLoading = createProductMutation.isPending || updateProductMutation.isPending;

  // Current image preview (prioritize imageData over imageUrl)
  const currentImageSrc = getProductImageSrc(imageData, imageUrlValue, '');

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEditing ? 'Editar Producto' : 'Nuevo Producto'}
      centered
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label="Nombre"
            placeholder="Nombre del producto"
            required
            {...register('name')}
            error={errors.name?.message}
          />
          <Textarea
            label="Descripción"
            placeholder="Descripción del producto"
            required
            minRows={3}
            {...register('description')}
            error={errors.description?.message}
          />
          <Group grow>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Precio"
                  placeholder="0.00"
                  required
                  min={0}
                  decimalScale={2}
                  prefix="$"
                  value={field.value}
                  onChange={(val) => field.onChange(val || 0)}
                  error={errors.price?.message}
                />
              )}
            />
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Stock"
                  placeholder="0"
                  required
                  min={0}
                  value={field.value}
                  onChange={(val) => field.onChange(val || 0)}
                  error={errors.stock?.message}
                />
              )}
            />
          </Group>

          {/* Image Upload Section */}
          <Box>
            <Text size="sm" fw={500} mb={4}>
              Imagen del producto
            </Text>

            {/* Preview de imagen actual */}
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
                {imageData && (
                  <Text size="xs" c="dimmed" ta="center" mt="xs">
                    Imagen subida (tiene prioridad sobre URL)
                  </Text>
                )}
              </Paper>
            )}

            {/* Dropzone siempre visible */}
            <Dropzone
              onDrop={handleDrop}
              onReject={handleReject}
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
                    {currentImageSrc ? 'Arrastra o haz clic para cambiar la imagen' : 'Arrastra una imagen aquí o haz clic para seleccionar'}
                  </Text>
                  <Text size="xs" c="dimmed" inline mt={7}>
                    PNG, JPG, GIF o WEBP. Máximo 2MB.
                  </Text>
                </div>
              </Group>
            </Dropzone>

            {/* URL input as alternative */}
            <TextInput
              label="O ingresa URL de imagen"
              placeholder="https://ejemplo.com/imagen.jpg"
              mt="sm"
              {...register('imageUrl')}
              error={errors.imageUrl?.message}
              description={imageData ? 'La imagen subida tiene prioridad sobre la URL' : undefined}
            />
          </Box>

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                label="Producto activo"
                description="Los productos inactivos no se muestran en la tienda"
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
              {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
