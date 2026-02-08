'use client';

import { useSearchParams } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Paper,
  ThemeIcon,
  Group,
  Loader,
} from '@mantine/core';
import { IconClock, IconReceipt, IconShoppingBag } from '@tabler/icons-react';
import Link from 'next/link';
import { usePaymentStatus } from '@/hooks/usePayments';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES, orderDetailRoute, checkoutSuccessRoute, checkoutFailureRoute } from '@/lib/routes';

export default function CheckoutPendingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const router = useRouter();

  const { data: paymentStatus } = usePaymentStatus(orderId || '');

  // Redirect to success if payment is approved
  useEffect(() => {
    if (paymentStatus?.paymentStatus === 'APPROVED') {
      router.push(checkoutSuccessRoute(orderId!));
    } else if (paymentStatus?.paymentStatus === 'REJECTED') {
      router.push(checkoutFailureRoute(orderId!));
    }
  }, [paymentStatus, orderId, router]);

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="lg" withBorder>
        <Stack align="center" gap="lg">
          <ThemeIcon size={80} radius="xl" color="yellow" variant="light">
            <IconClock size={50} />
          </ThemeIcon>

          <Title order={1} ta="center" c="yellow.8">
            Pago Pendiente
          </Title>

          <Text size="lg" c="dimmed" ta="center">
            Tu pago esta siendo procesado. Esto puede tomar unos minutos.
          </Text>

          <Group>
            <Loader size="sm" />
            <Text size="sm" c="dimmed">
              Verificando estado del pago...
            </Text>
          </Group>

          {orderId && (
            <Paper bg="gray.0" p="md" radius="md" w="100%">
              <Group justify="space-between">
                <Text c="dimmed">Numero de orden:</Text>
                <Text fw={600}>{orderId.slice(0, 8)}...</Text>
              </Group>
            </Paper>
          )}

          <Paper bg="yellow.0" p="md" radius="md" w="100%">
            <Stack gap="xs">
              <Text size="sm" fw={600}>
                Metodos de pago que requieren confirmacion:
              </Text>
              <Text size="sm" c="dimmed">
                - Transferencia bancaria
              </Text>
              <Text size="sm" c="dimmed">
                - Pago en efectivo (Rapipago, Pago Facil)
              </Text>
              <Text size="sm" c="dimmed">
                - Algunos pagos con tarjeta de debito
              </Text>
            </Stack>
          </Paper>

          <Text size="sm" c="dimmed" ta="center">
            Recibiras un email cuando el pago sea confirmado.
          </Text>

          <Group mt="md">
            {orderId && (
              <Button
                component={Link}
                href={orderDetailRoute(orderId)}
                size="lg"
                leftSection={<IconReceipt size={20} />}
              >
                Ver Pedido
              </Button>
            )}
            <Button
              component={Link}
              href={ROUTES.products.list}
              variant="outline"
              size="lg"
              leftSection={<IconShoppingBag size={20} />}
            >
              Seguir Comprando
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
