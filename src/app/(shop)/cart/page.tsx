'use client';

import {
  Container,
  Title,
  Card,
  Group,
  Text,
  Button,
  Stack,
  Image,
  NumberInput,
  ActionIcon,
  Divider,
  Paper,
  Loader,
  Center,
  Grid,
} from '@mantine/core';
import { IconTrash, IconShoppingCart } from '@tabler/icons-react';
import Link from 'next/link';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    isLoading,
    isSyncing,
    removeItem,
    updateQuantity,
    clearCart,
  } = useUnifiedCart();

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Center mt={100}>
          <Loader size="lg" />
        </Center>
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
            Agrega productos a tu carrito para continuar con la compra
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
      <Group justify="space-between" mb="lg">
        <Title order={1}>Carrito de Compras</Title>
        {isSyncing && <Loader size="sm" />}
      </Group>

      <Grid gutter="lg">
        {/* Cart Items */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            {items.map((item) => (
              <Card key={item.productId} shadow="sm" padding="md" withBorder>
                <Group wrap="nowrap">
                  <Image
                    src={item.imageUrl}
                    width={80}
                    height={80}
                    radius="md"
                    alt={item.name}
                    fallbackSrc="https://placehold.co/80x80?text=Producto"
                  />
                  <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                    <Text fw={500} lineClamp={1}>{item.name}</Text>
                    <Text size="lg" fw={700} c="blue">
                      ${Number(item.price).toFixed(2)}
                    </Text>
                  </Stack>
                  <Group gap="sm" wrap="nowrap">
                    <NumberInput
                      value={item.quantity}
                      onChange={(value) =>
                        updateQuantity(item.productId, Number(value) || 1)
                      }
                      min={1}
                      max={99}
                      style={{ width: 80 }}
                    />
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => removeItem(item.productId)}
                    >
                      <IconTrash size={20} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            ))}

            <Button
              variant="subtle"
              color="red"
              onClick={clearCart}
              style={{ alignSelf: 'flex-start' }}
            >
              Vaciar carrito
            </Button>
          </Stack>
        </Grid.Col>

        {/* Order Summary */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="sm" p="lg" withBorder style={{ position: 'sticky', top: 20 }}>
            <Stack gap="md">
              <Title order={3}>Resumen del Pedido</Title>

              <Divider />

              <Group justify="space-between">
                <Text>Subtotal ({totalItems} productos)</Text>
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

              <Button
                component={Link}
                href="/checkout"
                size="lg"
                fullWidth
                mt="md"
              >
                Proceder al Pago
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
