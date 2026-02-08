'use client';

import { useEffect } from 'react';
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
  Center,
} from '@mantine/core';
import { IconCheck, IconShoppingBag, IconReceipt } from '@tabler/icons-react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { usePaymentStatus } from '@/hooks/usePayments';
import { ROUTES, orderDetailRoute } from '@/lib/routes';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  const { data: paymentStatus, isLoading } = usePaymentStatus(orderId || '');

  // Invalidate cart when payment is successful
  useEffect(() => {
    if (paymentStatus?.paymentStatus === 'APPROVED') {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  }, [paymentStatus, queryClient]);

  if (!orderId) {
    return (
      <Container size="sm" py="xl">
        <Paper shadow="md" p="xl" radius="lg" withBorder>
          <Stack align="center" gap="lg">
            <ThemeIcon size={80} radius="xl" color="red">
              <IconCheck size={50} />
            </ThemeIcon>
            <Title order={2} ta="center">
              Orden no encontrada
            </Title>
            <Text c="dimmed" ta="center">
              No se pudo encontrar la informacion de la orden.
            </Text>
            <Button component={Link} href={ROUTES.products.list} size="lg">
              Ver Productos
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container size="sm" py="xl">
        <Center mt={100}>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="lg" withBorder>
        <Stack align="center" gap="lg">
          <ThemeIcon size={80} radius="xl" color="green" variant="light">
            <IconCheck size={50} />
          </ThemeIcon>

          <Title order={1} ta="center" c="green">
            Pago Exitoso
          </Title>

          <Text size="lg" c="dimmed" ta="center">
            Tu pago ha sido procesado correctamente.
            {paymentStatus?.paymentStatus === 'APPROVED'
              ? ' Tu pedido ha sido confirmado.'
              : ' Estamos procesando tu pedido.'}
          </Text>

          <Paper bg="gray.0" p="md" radius="md" w="100%">
            <Stack gap="xs">
              <Group justify="space-between">
                <Text c="dimmed">Numero de orden:</Text>
                <Text fw={600}>{orderId.slice(0, 8)}...</Text>
              </Group>
              {paymentId && (
                <Group justify="space-between">
                  <Text c="dimmed">ID de pago:</Text>
                  <Text fw={600}>{paymentId}</Text>
                </Group>
              )}
              <Group justify="space-between">
                <Text c="dimmed">Estado:</Text>
                <Text fw={600} c="green">
                  {paymentStatus?.paymentStatus === 'APPROVED' ? 'Confirmado' : 'Procesando'}
                </Text>
              </Group>
            </Stack>
          </Paper>

          <Text size="sm" c="dimmed" ta="center">
            Recibiras un email de confirmacion con los detalles de tu pedido.
          </Text>

          <Group mt="md">
            <Button
              component={Link}
              href={orderDetailRoute(orderId)}
              size="lg"
              leftSection={<IconReceipt size={20} />}
            >
              Ver Pedido
            </Button>
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
