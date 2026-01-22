'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Card,
  Group,
  Text,
  Badge,
  Stack,
  Button,
  Table,
  Select,
  Pagination,
  Skeleton,
  Modal,
  Image,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPackage, IconEye, IconRefresh } from '@tabler/icons-react';
import Link from 'next/link';
import { useMyOrders, useCancelOrder } from '@/hooks/useOrders';
import { Order, OrderStatus } from '@/lib/api/orders';
import { getProductImageSrc } from '@/utils/image';

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  SHIPPED: 'cyan',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelOpened, { open: openCancel, close: closeCancel }] = useDisclosure(false);

  const { data, isLoading, refetch, isFetching } = useMyOrders({
    page,
    limit: 10,
    status: statusFilter as OrderStatus || undefined,
  });

  const cancelOrderMutation = useCancelOrder();

  const handleCancelClick = (order: Order) => {
    setSelectedOrder(order);
    openCancel();
  };

  const confirmCancel = () => {
    if (selectedOrder) {
      cancelOrderMutation.mutate(selectedOrder.id, {
        onSuccess: () => {
          closeCancel();
          setSelectedOrder(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Title order={1} mb="lg">Mis Pedidos</Title>
        <Stack gap="md">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={100} radius="md" />
          ))}
        </Stack>
      </Container>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Container size="md" py="xl">
        <Stack align="center" gap="lg" mt={50}>
          <IconPackage size={80} color="gray" />
          <Title order={2}>No tienes pedidos</Title>
          <Text c="dimmed">
            Cuando realices una compra, tus pedidos aparecerán aquí
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
        <Title order={1}>Mis Pedidos</Title>
        <Group gap="sm">
          <Button
            variant="subtle"
            leftSection={<IconRefresh size={16} />}
            onClick={() => refetch()}
            loading={isFetching && !isLoading}
          >
            Actualizar
          </Button>
          <Select
            placeholder="Filtrar por estado"
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            data={[
              { value: 'PENDING', label: 'Pendiente' },
              { value: 'CONFIRMED', label: 'Confirmado' },
              { value: 'SHIPPED', label: 'Enviado' },
              { value: 'DELIVERED', label: 'Entregado' },
              { value: 'CANCELLED', label: 'Cancelado' },
            ]}
            clearable
            style={{ width: 180 }}
          />
        </Group>
      </Group>

      <Stack gap="md">
        {data.data.map((order) => (
          <Card key={order.id} shadow="sm" padding="lg" withBorder>
            <Group justify="space-between" mb="md">
              <Group>
                <Text fw={500}>Pedido #{order.id.slice(0, 8)}</Text>
                <Badge color={statusColors[order.status]}>
                  {statusLabels[order.status]}
                </Badge>
              </Group>
              <Text c="dimmed" size="sm">
                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </Group>

            <Group gap="xs" mb="md">
              {order.items.slice(0, 3).map((item) => (
                <Image
                  key={item.id}
                  src={getProductImageSrc(item.product.imageData, item.product.imageUrl)}
                  width={50}
                  height={50}
                  radius="sm"
                  alt={item.product.name}
                  fallbackSrc="https://placehold.co/50x50?text=N/A"
                />
              ))}
              {order.items.length > 3 && (
                <Text size="sm" c="dimmed">
                  +{order.items.length - 3} más
                </Text>
              )}
            </Group>

            <Group justify="space-between">
              <Text size="lg" fw={700}>
                Total: ${Number(order.total).toFixed(2)}
              </Text>
              <Group gap="sm">
                {order.status === 'PENDING' && (
                  <Button
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => handleCancelClick(order)}
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  component={Link}
                  href={`/orders/${order.id}`}
                  variant="light"
                  size="sm"
                  leftSection={<IconEye size={16} />}
                >
                  Ver detalles
                </Button>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>

      {data.meta.totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={page}
            onChange={setPage}
            total={data.meta.totalPages}
          />
        </Group>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        opened={cancelOpened}
        onClose={closeCancel}
        title="Cancelar pedido"
        centered
      >
        <Text mb="lg">
          ¿Estás seguro de que deseas cancelar el pedido{' '}
          <strong>#{selectedOrder?.id.slice(0, 8)}</strong>?
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={closeCancel}>
            No, mantener
          </Button>
          <Button
            color="red"
            onClick={confirmCancel}
            loading={cancelOrderMutation.isPending}
          >
            Sí, cancelar
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
