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
} from '@mantine/core';
import { IconX, IconShoppingCart, IconRefresh } from '@tabler/icons-react';
import Link from 'next/link';

export default function CheckoutFailurePage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="lg" withBorder>
        <Stack align="center" gap="lg">
          <ThemeIcon size={80} radius="xl" color="red" variant="light">
            <IconX size={50} />
          </ThemeIcon>

          <Title order={1} ta="center" c="red">
            Pago Rechazado
          </Title>

          <Text size="lg" c="dimmed" ta="center">
            Tu pago no pudo ser procesado. Esto puede ocurrir por varias razones:
          </Text>

          <Paper bg="gray.0" p="md" radius="md" w="100%">
            <Stack gap="xs">
              <Text size="sm">- Fondos insuficientes</Text>
              <Text size="sm">- Tarjeta vencida o invalida</Text>
              <Text size="sm">- Datos incorrectos</Text>
              <Text size="sm">- Limite de compra excedido</Text>
            </Stack>
          </Paper>

          {orderId && (
            <Paper bg="gray.0" p="md" radius="md" w="100%">
              <Group justify="space-between">
                <Text c="dimmed">Numero de orden:</Text>
                <Text fw={600}>{orderId.slice(0, 8)}...</Text>
              </Group>
            </Paper>
          )}

          <Text size="sm" c="dimmed" ta="center">
            Puedes intentar nuevamente con otro metodo de pago.
          </Text>

          <Group mt="md">
            {orderId && (
              <Button
                component={Link}
                href={`/orders/${orderId}`}
                size="lg"
                leftSection={<IconRefresh size={20} />}
              >
                Reintentar Pago
              </Button>
            )}
            <Button
              component={Link}
              href="/products"
              variant="outline"
              size="lg"
              leftSection={<IconShoppingCart size={20} />}
            >
              Ver Productos
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
