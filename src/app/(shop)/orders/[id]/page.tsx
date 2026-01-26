'use client';

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
  Skeleton,
  Paper,
  Image,
  Alert,
  Timeline,
  Divider,
  Modal,
  Grid,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPackage,
  IconCheck,
  IconTruck,
  IconClock,
  IconX,
  IconArrowLeft,
  IconConfetti,
  IconRefresh,
  IconCreditCard,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMyOrder, useCancelOrder } from '@/hooks/useOrders';
import { useCreatePreference } from '@/hooks/usePayments';
import { OrderStatus, PaymentStatus } from '@/lib/api/orders';
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

const statusDescriptions: Record<OrderStatus, string> = {
  PENDING: 'Tu pedido está siendo procesado',
  CONFIRMED: 'Tu pedido ha sido confirmado',
  SHIPPED: 'Tu pedido está en camino',
  DELIVERED: 'Tu pedido ha sido entregado',
  CANCELLED: 'Este pedido fue cancelado',
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  PENDING: 'yellow',
  APPROVED: 'green',
  REJECTED: 'red',
  CANCELLED: 'gray',
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
};

interface PageProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [cancelOpened, { open: openCancel, close: closeCancel }] = useDisclosure(false);

  const { data: order, isLoading, error, refetch, isFetching } = useMyOrder(params.id);
  const cancelOrderMutation = useCancelOrder();
  const createPreferenceMutation = useCreatePreference();

  const handleRetryPayment = async () => {
    if (!order) return;

    try {
      const preference = await createPreferenceMutation.mutateAsync({
        orderId: order.id,
      });

      // Redirect to MercadoPago
      const useSandbox = process.env.NEXT_PUBLIC_MP_SANDBOX === 'true';
      const redirectUrl = useSandbox
        ? preference.sandboxInitPoint
        : preference.initPoint;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error('Error retrying payment:', error);
    }
  };

  const confirmCancel = () => {
    if (order) {
      cancelOrderMutation.mutate(order.id, {
        onSuccess: () => {
          closeCancel();
          router.push('/orders');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Skeleton height={40} width={300} mb="lg" />
        <Stack gap="md">
          <Skeleton height={100} radius="md" />
          <Skeleton height={200} radius="md" />
        </Stack>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container size="md" py="xl">
        <Stack align="center" gap="lg" mt={50}>
          <IconPackage size={80} color="gray" />
          <Title order={2}>Pedido no encontrado</Title>
          <Text c="dimmed">
            No pudimos encontrar el pedido que buscas
          </Text>
          <Button component={Link} href="/orders" size="lg">
            Ver mis pedidos
          </Button>
        </Stack>
      </Container>
    );
  }

  const statusOrder: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const currentStatusIndex = statusOrder.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <Container size="lg" py="xl">
      {isSuccess && (
        <Alert
          color="green"
          icon={<IconConfetti size={20} />}
          title="Pedido realizado con exito"
          mb="lg"
          withCloseButton
        >
          Tu pedido ha sido creado exitosamente. Te notificaremos cuando sea confirmado.
        </Alert>
      )}

      <Group justify="space-between" mb="lg">
        <div>
          <Button
            component={Link}
            href="/orders"
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            mb="sm"
          >
            Volver a mis pedidos
          </Button>
          <Title order={1}>Pedido #{order.id.slice(0, 8)}</Title>
        </div>
        <Group gap="sm">
          <Button
            variant="subtle"
            leftSection={<IconRefresh size={16} />}
            onClick={() => refetch()}
            loading={isFetching && !isLoading}
          >
            Actualizar
          </Button>
          <Badge color={statusColors[order.status]} size="xl">
            {statusLabels[order.status]}
          </Badge>
        </Group>
      </Group>

      <Grid gutter="lg">
        {/* Order Items */}
        <Grid.Col span={{ base: 12, md: 8 }}>
        <Stack gap="lg">
          <Card shadow="sm" padding="lg" withBorder>
            <Title order={3} mb="md">Productos</Title>
            <Table.ScrollContainer minWidth={500}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Producto</Table.Th>
                  <Table.Th>Cantidad</Table.Th>
                  <Table.Th>Precio</Table.Th>
                  <Table.Th>Subtotal</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {order.items.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Image
                          src={getProductImageSrc(item.product.imageData, item.product.imageUrl)}
                          width={50}
                          height={50}
                          radius="sm"
                          alt={item.product.name}
                          fallbackSrc="https://placehold.co/50x50?text=N/A"
                        />
                        <Text size="sm" fw={500}>{item.product.name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                    <Table.Td>${Number(item.price).toFixed(2)}</Table.Td>
                    <Table.Td fw={500}>${(Number(item.price) * item.quantity).toFixed(2)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            </Table.ScrollContainer>
          </Card>

          {/* Order Timeline */}
          <Card shadow="sm" padding="lg" withBorder>
            <Title order={3} mb="md">Estado del pedido</Title>
            {isCancelled ? (
              <Alert color="red" icon={<IconX size={20} />}>
                {statusDescriptions.CANCELLED}
              </Alert>
            ) : (
              <Timeline active={currentStatusIndex} bulletSize={24} lineWidth={2}>
                <Timeline.Item
                  bullet={<IconClock size={14} />}
                  title="Pendiente"
                  color={currentStatusIndex >= 0 ? 'yellow' : 'gray'}
                >
                  <Text size="sm" c="dimmed">
                    Pedido recibido y en espera de confirmacion
                  </Text>
                </Timeline.Item>
                <Timeline.Item
                  bullet={<IconCheck size={14} />}
                  title="Confirmado"
                  color={currentStatusIndex >= 1 ? 'blue' : 'gray'}
                >
                  <Text size="sm" c="dimmed">
                    Pedido confirmado y en preparacion
                  </Text>
                </Timeline.Item>
                <Timeline.Item
                  bullet={<IconTruck size={14} />}
                  title="Enviado"
                  color={currentStatusIndex >= 2 ? 'cyan' : 'gray'}
                >
                  <Text size="sm" c="dimmed">
                    Pedido en camino a tu direccion
                  </Text>
                </Timeline.Item>
                <Timeline.Item
                  bullet={<IconPackage size={14} />}
                  title="Entregado"
                  color={currentStatusIndex >= 3 ? 'green' : 'gray'}
                >
                  <Text size="sm" c="dimmed">
                    Pedido entregado exitosamente
                  </Text>
                </Timeline.Item>
              </Timeline>
            )}
          </Card>
        </Stack>
        </Grid.Col>

        {/* Order Summary */}
        <Grid.Col span={{ base: 12, md: 4 }}>
        <Paper shadow="sm" p="lg" withBorder style={{ position: 'sticky', top: 20 }}>
          <Stack gap="md">
            <Title order={3}>Resumen</Title>

            <Divider />

            <Group justify="space-between">
              <Text c="dimmed">Fecha del pedido</Text>
              <Text fw={500}>
                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text c="dimmed">Estado</Text>
              <Badge color={statusColors[order.status]}>
                {statusLabels[order.status]}
              </Badge>
            </Group>

            <Group justify="space-between">
              <Text c="dimmed">Estado de pago</Text>
              <Badge color={paymentStatusColors[order.paymentStatus]}>
                {paymentStatusLabels[order.paymentStatus]}
              </Badge>
            </Group>

            <Group justify="space-between">
              <Text c="dimmed">Productos</Text>
              <Text fw={500}>{order.items.length}</Text>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Text c="dimmed">Subtotal</Text>
              <Text fw={500}>${Number(order.total).toFixed(2)}</Text>
            </Group>

            <Group justify="space-between">
              <Text c="dimmed">Envio</Text>
              <Text fw={500} c="green">Gratis</Text>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Text size="lg" fw={700}>Total</Text>
              <Text size="xl" fw={700} c="blue">
                ${Number(order.total).toFixed(2)}
              </Text>
            </Group>

            {/* Retry payment button - show when payment is pending or rejected */}
            {order.status === 'PENDING' &&
             (order.paymentStatus === 'PENDING' || order.paymentStatus === 'REJECTED') && (
              <Button
                color="blue"
                fullWidth
                mt="md"
                leftSection={<IconCreditCard size={18} />}
                onClick={handleRetryPayment}
                loading={createPreferenceMutation.isPending}
              >
                {order.paymentStatus === 'REJECTED' ? 'Reintentar pago' : 'Pagar ahora'}
              </Button>
            )}

            {order.status === 'PENDING' && (
              <Button
                color="red"
                variant="light"
                fullWidth
                mt="xs"
                onClick={openCancel}
              >
                Cancelar pedido
              </Button>
            )}

            <Button
              component={Link}
              href="/products"
              variant="light"
              fullWidth
              mt="xs"
            >
              Seguir comprando
            </Button>
          </Stack>
        </Paper>
        </Grid.Col>
      </Grid>

      {/* Cancel Confirmation Modal */}
      <Modal
        opened={cancelOpened}
        onClose={closeCancel}
        title="Cancelar pedido"
        centered
      >
        <Text mb="lg">
          ¿Estás seguro de que deseas cancelar el pedido{' '}
          <strong>#{order.id.slice(0, 8)}</strong>?
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
