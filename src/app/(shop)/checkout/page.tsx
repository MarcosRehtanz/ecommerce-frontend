'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Card,
  Group,
  Text,
  Button,
  Stack,
  Image,
  Divider,
  Paper,
  Textarea,
  TextInput,
  Loader,
  Center,
  Alert,
} from '@mantine/core';
import { IconShoppingCart, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/authStore';

export default function CheckoutPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const { items, totalItems, totalPrice, isLoading: isLoadingCart } = useUnifiedCart();
  const createOrderMutation = useCreateOrder();

  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    createOrderMutation.mutate(
      {
        shippingAddress: shippingAddress || undefined,
        notes: notes || undefined,
      },
      {
        onSuccess: (order) => {
          router.push(`/orders/${order.id}?success=true`);
        },
      }
    );
  };

  // Wait for hydration before checking auth
  if (!hasHydrated || isLoadingCart) {
    return (
      <Container size="md" py="xl">
        <Center mt={100}>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container size="md" py="xl">
        <Stack align="center" gap="lg" mt={50}>
          <IconAlertCircle size={80} color="orange" />
          <Title order={2}>Inicia sesión para continuar</Title>
          <Text c="dimmed">
            Necesitas iniciar sesión para completar tu compra
          </Text>
          <Group>
            <Button component={Link} href="/login?redirect=/checkout" size="lg">
              Iniciar sesión
            </Button>
            <Button component={Link} href="/register" variant="outline" size="lg">
              Registrarse
            </Button>
          </Group>
        </Stack>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container size="md" py="xl">
        <Stack align="center" gap="lg" mt={50}>
          <IconShoppingCart size={80} color="gray" />
          <Title order={2}>Tu carrito está vacío</Title>
          <Text c="dimmed">
            Agrega productos a tu carrito antes de continuar
          </Text>
          <Button component={Link} href="/products" size="lg">
            Ver Productos
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">
        Finalizar Compra
      </Title>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
        {/* Order Details */}
        <Stack gap="lg">
          {/* Shipping Info */}
          <Paper shadow="sm" p="lg" withBorder>
            <Title order={3} mb="md">
              Información de Envío
            </Title>
            <Stack gap="md">
              <TextInput
                label="Dirección de envío"
                placeholder="Calle 123, Ciudad, País"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
              <Textarea
                label="Notas adicionales"
                placeholder="Instrucciones especiales de entrega..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                minRows={3}
              />
            </Stack>
          </Paper>

          {/* Order Items */}
          <Paper shadow="sm" p="lg" withBorder>
            <Title order={3} mb="md">
              Productos ({totalItems})
            </Title>
            <Stack gap="sm">
              {items.map((item) => (
                <Group key={item.productId} wrap="nowrap" justify="space-between">
                  <Group wrap="nowrap">
                    <Image
                      src={item.imageUrl}
                      width={60}
                      height={60}
                      radius="md"
                      alt={item.name}
                      fallbackSrc="https://placehold.co/60x60?text=Producto"
                    />
                    <div>
                      <Text fw={500} lineClamp={1}>
                        {item.name}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Cantidad: {item.quantity}
                      </Text>
                    </div>
                  </Group>
                  <Text fw={500}>
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Stack>

        {/* Order Summary */}
        <Paper shadow="sm" p="lg" withBorder style={{ alignSelf: 'start' }}>
          <Stack gap="md">
            <Title order={3}>Resumen del Pedido</Title>

            <Divider />

            <Group justify="space-between">
              <Text>Subtotal</Text>
              <Text fw={500}>${totalPrice.toFixed(2)}</Text>
            </Group>

            <Group justify="space-between">
              <Text>Envío</Text>
              <Text c="green" fw={500}>
                Gratis
              </Text>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Text size="lg" fw={700}>
                Total
              </Text>
              <Text size="xl" fw={700} c="blue">
                ${totalPrice.toFixed(2)}
              </Text>
            </Group>

            {createOrderMutation.isError && (
              <Alert color="red" icon={<IconAlertCircle size={16} />}>
                {createOrderMutation.error?.message || 'Error al crear el pedido'}
              </Alert>
            )}

            <Button
              size="lg"
              fullWidth
              onClick={handleSubmit}
              loading={createOrderMutation.isPending}
              leftSection={<IconCheck size={20} />}
            >
              Confirmar Pedido
            </Button>

            <Button
              component={Link}
              href="/cart"
              variant="subtle"
              fullWidth
            >
              Volver al carrito
            </Button>
          </Stack>
        </Paper>
      </div>
    </Container>
  );
}
