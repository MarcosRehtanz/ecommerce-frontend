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
  Select,
  Pagination,
  Skeleton,
  Modal,
  Box,
  Flex,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPackage,
  IconEye,
  IconRefresh,
  IconCreditCard,
  IconX,
  IconCash,
  IconClock,
  IconCheck,
  IconTruck,
  IconCircleCheck,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useMyOrders, useCancelOrder } from '@/hooks/useOrders';
import { ROUTES, orderDetailRoute } from '@/lib/routes';
import { useCreatePaymentPreference } from '@/hooks/usePayments';
import { Order, OrderStatus, PaymentStatus } from '@/lib/api/orders';

const statusConfig: Record<OrderStatus, { color: string; label: string; icon: React.ReactNode }> = {
  PENDING: { color: 'yellow', label: 'Pendiente', icon: <IconClock size={14} /> },
  CONFIRMED: { color: 'blue', label: 'Confirmado', icon: <IconCheck size={14} /> },
  SHIPPED: { color: 'cyan', label: 'Enviado', icon: <IconTruck size={14} /> },
  DELIVERED: { color: 'green', label: 'Entregado', icon: <IconCircleCheck size={14} /> },
  CANCELLED: { color: 'red', label: 'Cancelado', icon: <IconX size={14} /> },
};

const paymentConfig: Record<PaymentStatus, { color: string; label: string; icon: React.ReactNode }> = {
  PENDING: { color: 'orange', label: 'Pago pendiente', icon: <IconCash size={14} /> },
  APPROVED: { color: 'green', label: 'Pagado', icon: <IconCheck size={14} /> },
  REJECTED: { color: 'red', label: 'Rechazado', icon: <IconX size={14} /> },
  CANCELLED: { color: 'gray', label: 'Cancelado', icon: <IconX size={14} /> },
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [cancelOpened, { open: openCancel, close: closeCancel }] = useDisclosure(false);

  const { data, isLoading, refetch, isFetching } = useMyOrders({
    page,
    limit: 10,
    status: statusFilter as OrderStatus || undefined,
  });

  const cancelOrderMutation = useCancelOrder();
  const createPreferenceMutation = useCreatePaymentPreference();

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

  const handlePay = (orderId: string) => {
    setPayingOrderId(orderId);
    createPreferenceMutation.mutate(orderId);
  };

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Title order={1} mb="lg">Mis Pedidos</Title>
        <Stack gap="sm">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={72} radius="md" />
          ))}
        </Stack>
      </Container>
    );
  }

  const hasNoOrders = (!data || data.data.length === 0) && !statusFilter;

  if (hasNoOrders) {
    return (
      <Container size="md" py="xl">
        <Stack align="center" gap="lg" mt={50}>
          <IconPackage size={80} color="gray" />
          <Title order={2}>No tienes pedidos</Title>
          <Text c="dimmed">
            Cuando realices una compra, tus pedidos aparecerán aquí
          </Text>
          <Button component={Link} href={ROUTES.products.list} size="lg">
            Ver Productos
          </Button>
        </Stack>
      </Container>
    );
  }

  const orders = data?.data ?? [];
  const filterLabel = statusFilter ? statusConfig[statusFilter as OrderStatus]?.label : null;

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
            size="sm"
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
            size="sm"
            style={{ width: 160 }}
          />
        </Group>
      </Group>

      {orders.length === 0 ? (
        <Stack align="center" gap="md" py={50}>
          <IconPackage size={60} color="gray" />
          <Text c="dimmed" ta="center">
            No hay pedidos con estado <strong>{filterLabel}</strong>
          </Text>
          <Button
            variant="light"
            size="sm"
            onClick={() => {
              setStatusFilter(null);
              setPage(1);
            }}
          >
            Limpiar filtro
          </Button>
        </Stack>
      ) : (
      <Stack gap="xs">
        {orders.map((order) => {
          const status = statusConfig[order.status];
          const payment = paymentConfig[order.paymentStatus];
          const canPay = order.status === 'PENDING' && order.paymentStatus === 'PENDING';
          const canCancel = order.status === 'PENDING';
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <Card key={order.id} shadow="xs" padding="md" withBorder radius="md">
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                justify="space-between"
                align={{ base: 'stretch', sm: 'center' }}
                gap="sm"
              >
                {/* Order info */}
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Group gap="xs" mb={4}>
                    <Text fw={600} size="sm">
                      #{order.id.slice(0, 8)}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {new Date(order.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                    {order.items.length > 0 && ` · ${order.items.map(i => i.product.name).slice(0, 2).join(', ')}${order.items.length > 2 ? '...' : ''}`}
                  </Text>
                </Box>

                {/* Status badges */}
                <Group gap="xs" wrap="nowrap">
                  <Badge
                    color={status.color}
                    variant="light"
                    size="sm"
                    leftSection={status.icon}
                  >
                    {status.label}
                  </Badge>
                  <Badge
                    color={payment.color}
                    variant={order.paymentStatus === 'APPROVED' ? 'filled' : 'outline'}
                    size="sm"
                    leftSection={payment.icon}
                  >
                    {payment.label}
                  </Badge>
                </Group>

                {/* Total */}
                <Text fw={700} size="md" style={{ minWidth: 90, textAlign: 'right' }}>
                  ${Number(order.total).toLocaleString('es-AR')}
                </Text>

                {/* Actions */}
                <Group gap="xs" wrap="nowrap">
                  {canPay && (
                    <Button
                      size="xs"
                      color="green"
                      leftSection={<IconCreditCard size={14} />}
                      onClick={() => handlePay(order.id)}
                      loading={payingOrderId === order.id && createPreferenceMutation.isPending}
                      disabled={createPreferenceMutation.isPending && payingOrderId !== order.id}
                    >
                      Pagar
                    </Button>
                  )}
                  {canCancel && (
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      onClick={() => handleCancelClick(order)}
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button
                    component={Link}
                    href={orderDetailRoute(order.id)}
                    size="xs"
                    variant="light"
                    leftSection={<IconEye size={14} />}
                  >
                    Ver
                  </Button>
                </Group>
              </Flex>
            </Card>
          );
        })}
      </Stack>
      )}

      {data && data.meta.totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={page}
            onChange={setPage}
            total={data.meta.totalPages}
            size="sm"
          />
        </Group>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        opened={cancelOpened}
        onClose={closeCancel}
        title="Cancelar pedido"
        centered
        size="sm"
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
