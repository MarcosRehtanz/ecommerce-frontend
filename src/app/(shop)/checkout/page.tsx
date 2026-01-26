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
  Grid,
} from '@mantine/core';
import { IconShoppingCart, IconAlertCircle, IconCreditCard } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { useCreatePreference } from '@/hooks/usePayments';
import { useAuthStore } from '@/stores/authStore';

export default function CheckoutPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const { items, totalItems, totalPrice, isLoading: isLoadingCart } = useUnifiedCart();
  const createOrderMutation = useCreateOrder();
  const createPreferenceMutation = useCreatePreference();

  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayWithMercadoPago = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create order from cart
      const order = await createOrderMutation.mutateAsync({
        shippingAddress: shippingAddress || undefined,
        notes: notes || undefined,
      });

      // Step 2: Create Mercado Pago preference
      const preference = await createPreferenceMutation.mutateAsync({
        orderId: order.id,
      });

      // Step 3: Redirect to Mercado Pago
      // Use sandbox URL when NEXT_PUBLIC_MP_SANDBOX is "true"
      const useSandbox = process.env.NEXT_PUBLIC_MP_SANDBOX === 'true';
      const redirectUrl = useSandbox
        ? preference.sandboxInitPoint
        : preference.initPoint;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        throw new Error('No se pudo obtener la URL de pago');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setIsProcessing(false);
    }
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
          <Title order={2}>Inicia sesion para continuar</Title>
          <Text c="dimmed">
            Necesitas iniciar sesion para completar tu compra
          </Text>
          <Group>
            <Button component={Link} href="/login?redirect=/checkout" size="lg">
              Iniciar sesion
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
          <Title order={2}>Tu carrito esta vacio</Title>
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

  const isLoading = isProcessing || createOrderMutation.isPending || createPreferenceMutation.isPending;
  const error = createOrderMutation.error || createPreferenceMutation.error;

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">
        Finalizar Compra
      </Title>

      <Grid gutter="lg">
        {/* Order Details */}
        <Grid.Col span={{ base: 12, md: 7 }}>
        <Stack gap="lg">
          {/* Shipping Info */}
          <Paper shadow="sm" p="lg" withBorder>
            <Title order={3} mb="md">
              Informacion de Envio
            </Title>
            <Stack gap="md">
              <TextInput
                label="Direccion de envio"
                placeholder="Calle 123, Ciudad, Pais"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                disabled={isLoading}
              />
              <Textarea
                label="Notas adicionales"
                placeholder="Instrucciones especiales de entrega..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                minRows={3}
                disabled={isLoading}
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

          {/* Payment Methods Info */}
          <Paper shadow="sm" p="lg" withBorder bg="blue.0">
            <Stack gap="sm">
              <Group>
                <IconCreditCard size={24} color="var(--mantine-color-blue-6)" />
                <Text fw={600} c="blue.8">
                  Metodos de Pago Disponibles
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                A traves de Mercado Pago podras pagar con:
              </Text>
              <Group gap="xs">
                <Text size="sm">- Tarjetas de credito y debito</Text>
              </Group>
              <Group gap="xs">
                <Text size="sm">- Transferencia bancaria</Text>
              </Group>
              <Group gap="xs">
                <Text size="sm">- Efectivo en Rapipago o Pago Facil</Text>
              </Group>
            </Stack>
          </Paper>
        </Stack>
        </Grid.Col>

        {/* Order Summary */}
        <Grid.Col span={{ base: 12, md: 5 }}>
        <Paper shadow="sm" p="lg" withBorder style={{ position: 'sticky', top: 20 }}>
          <Stack gap="md">
            <Title order={3}>Resumen del Pedido</Title>

            <Divider />

            <Group justify="space-between">
              <Text>Subtotal</Text>
              <Text fw={500}>${totalPrice.toFixed(2)}</Text>
            </Group>

            <Group justify="space-between">
              <Text>Envio</Text>
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

            {error && (
              <Alert color="red" icon={<IconAlertCircle size={16} />}>
                {error?.message || 'Error al procesar el pago'}
              </Alert>
            )}

            {/* Test Card Info for Evaluators */}
            <Alert color="yellow" title="Tarjeta de Prueba" icon={<IconCreditCard size={16} />}>
              <Text size="xs" mb={4}>
                <strong>Numero:</strong> 5031 7557 3453 0604
              </Text>
              <Text size="xs" mb={4}>
                <strong>Vencimiento:</strong> 11/30 &nbsp; <strong>CVV:</strong> 123
              </Text>
              <Text size="xs" mb={4}>
                <strong>Nombre:</strong> APRO &nbsp; <strong>DNI:</strong> 12345678
              </Text>
            </Alert>

            <Button
              size="lg"
              fullWidth
              onClick={handlePayWithMercadoPago}
              loading={isLoading}
              leftSection={<IconCreditCard size={20} />}
              color="blue"
            >
              Pagar con Mercado Pago
            </Button>

            <Text size="xs" c="dimmed" ta="center">
              Seras redirigido a Mercado Pago para completar el pago de forma segura.
            </Text>

            <Button
              component={Link}
              href="/cart"
              variant="subtle"
              fullWidth
              disabled={isLoading}
            >
              Volver al carrito
            </Button>
          </Stack>
        </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
