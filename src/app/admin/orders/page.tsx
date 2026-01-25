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
  Menu,
  ActionIcon,
  Paper,
  SimpleGrid,
  Image,
  TextInput,
  Divider,
  Alert,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPackage,
  IconEye,
  IconDotsVertical,
  IconTruck,
  IconCheck,
  IconX,
  IconClock,
  IconCurrencyDollar,
  IconCash,
  IconAlertCircle,
  IconRefresh,
} from '@tabler/icons-react';
import { useOrdersAdmin, useUpdateOrderStatus, useOrderStats } from '@/hooks/useOrders';
import { useAdminMarkAsPaid, useAdminSyncPayment } from '@/hooks/usePayments';
import { Order, OrderStatus, PaymentStatus } from '@/lib/api/orders';
import { getProductImageSrc } from '@/utils/image';
import { useQueryClient } from '@tanstack/react-query';

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

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  PENDING: <IconClock size={14} />,
  CONFIRMED: <IconCheck size={14} />,
  SHIPPED: <IconTruck size={14} />,
  DELIVERED: <IconPackage size={14} />,
  CANCELLED: <IconX size={14} />,
};

const paymentColors: Record<PaymentStatus, string> = {
  PENDING: 'orange',
  APPROVED: 'green',
  REJECTED: 'red',
  CANCELLED: 'gray',
};

const paymentLabels: Record<PaymentStatus, string> = {
  PENDING: 'Sin pagar',
  APPROVED: 'Pagado',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
};

const paymentIcons: Record<PaymentStatus, React.ReactNode> = {
  PENDING: <IconCash size={14} />,
  APPROVED: <IconCheck size={14} />,
  REJECTED: <IconX size={14} />,
  CANCELLED: <IconX size={14} />,
};

// Valid status transitions
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [syncPaymentId, setSyncPaymentId] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useOrdersAdmin({
    page,
    limit: 10,
    status: statusFilter as OrderStatus || undefined,
  });

  const { data: stats, isLoading: isLoadingStats } = useOrderStats();
  const updateStatusMutation = useUpdateOrderStatus();
  const syncPaymentMutation = useAdminSyncPayment();
  const markAsPaidMutation = useAdminMarkAsPaid();

  // Filter by payment status (client-side for now)
  const filteredOrders = data?.data.filter(order => {
    if (!paymentFilter) return true;
    return order.paymentStatus === paymentFilter;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setSyncPaymentId(order.paymentId || '');
    openDetails();
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ id: orderId, data: { status: newStatus } });
  };

  const handleSyncPayment = () => {
    if (selectedOrder && syncPaymentId) {
      syncPaymentMutation.mutate(
        { orderId: selectedOrder.id, paymentId: syncPaymentId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            closeDetails();
          },
        }
      );
    }
  };

  const handleMarkAsPaid = () => {
    if (selectedOrder) {
      markAsPaidMutation.mutate(
        { orderId: selectedOrder.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            closeDetails();
          },
        }
      );
    }
  };

  const canConfirm = (order: Order) => order.paymentStatus === 'APPROVED';

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Gestión de Pedidos</Title>
        <Button
          variant="subtle"
          leftSection={<IconRefresh size={16} />}
          onClick={() => refetch()}
        >
          Actualizar
        </Button>
      </Group>

      {/* Stats Cards */}
      {isLoadingStats ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} mb="xl">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={100} radius="md" />
          ))}
        </SimpleGrid>
      ) : stats && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} mb="xl">
          <Paper shadow="sm" p="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Total Pedidos
                </Text>
                <Text size="xl" fw={700}>{stats.totalOrders}</Text>
              </div>
              <IconPackage size={32} color="gray" />
            </Group>
          </Paper>

          <Paper shadow="sm" p="md" withBorder style={{ borderColor: 'var(--mantine-color-orange-4)' }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Sin Pagar
                </Text>
                <Text size="xl" fw={700} c="orange">{stats.byPayment?.pending || 0}</Text>
              </div>
              <IconCash size={32} color="orange" />
            </Group>
          </Paper>

          <Paper shadow="sm" p="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Pendientes
                </Text>
                <Text size="xl" fw={700} c="yellow">{stats.byStatus.pending}</Text>
              </div>
              <IconClock size={32} color="orange" />
            </Group>
          </Paper>

          <Paper shadow="sm" p="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  En Proceso
                </Text>
                <Text size="xl" fw={700} c="blue">
                  {stats.byStatus.confirmed + stats.byStatus.shipped}
                </Text>
              </div>
              <IconTruck size={32} color="blue" />
            </Group>
          </Paper>

          <Paper shadow="sm" p="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Ingresos Totales
                </Text>
                <Text size="xl" fw={700} c="green">
                  ${Number(stats.totalRevenue).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </Text>
              </div>
              <IconCurrencyDollar size={32} color="green" />
            </Group>
          </Paper>
        </SimpleGrid>
      )}

      {/* Filters */}
      <Group justify="flex-end" mb="lg" gap="sm">
        <Select
          placeholder="Estado de pago"
          value={paymentFilter}
          onChange={(value) => {
            setPaymentFilter(value);
            setPage(1);
          }}
          data={[
            { value: 'PENDING', label: 'Sin pagar' },
            { value: 'APPROVED', label: 'Pagado' },
            { value: 'REJECTED', label: 'Rechazado' },
          ]}
          clearable
          style={{ width: 150 }}
        />
        <Select
          placeholder="Estado pedido"
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
          style={{ width: 150 }}
        />
      </Group>

      {/* Orders Table */}
      {isLoading ? (
        <Stack gap="md">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={60} radius="md" />
          ))}
        </Stack>
      ) : !filteredOrders || filteredOrders.length === 0 ? (
        <Card shadow="sm" padding="xl" withBorder>
          <Stack align="center" gap="md">
            <IconPackage size={60} color="gray" />
            <Text c="dimmed">No hay pedidos para mostrar</Text>
          </Stack>
        </Card>
      ) : (
        <>
          <Card shadow="sm" padding={0} withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Cliente</Table.Th>
                  <Table.Th>Pago</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Total</Table.Th>
                  <Table.Th>Fecha</Table.Th>
                  <Table.Th>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredOrders.map((order) => (
                  <Table.Tr key={order.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>#{order.id.slice(0, 8)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size="sm" fw={500}>{order.user?.name || 'N/A'}</Text>
                        <Text size="xs" c="dimmed">{order.user?.email || ''}</Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={paymentColors[order.paymentStatus]}
                        variant={order.paymentStatus === 'APPROVED' ? 'filled' : 'outline'}
                        leftSection={paymentIcons[order.paymentStatus]}
                      >
                        {paymentLabels[order.paymentStatus]}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={statusColors[order.status]}
                        variant="light"
                        leftSection={statusIcons[order.status]}
                      >
                        {statusLabels[order.status]}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        ${Number(order.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {new Date(order.createdAt).toLocaleDateString('es-ES')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          onClick={() => handleViewDetails(order)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                        {validTransitions[order.status].length > 0 && (
                          <Menu shadow="md" width={200}>
                            <Menu.Target>
                              <ActionIcon variant="subtle">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Label>Cambiar estado</Menu.Label>
                              {validTransitions[order.status].map((status) => {
                                const isConfirm = status === 'CONFIRMED';
                                const disabled = isConfirm && !canConfirm(order);
                                return (
                                  <Menu.Item
                                    key={status}
                                    leftSection={statusIcons[status]}
                                    onClick={() => handleStatusChange(order.id, status)}
                                    disabled={disabled}
                                    title={disabled ? 'Requiere pago aprobado' : undefined}
                                  >
                                    {statusLabels[status]}
                                    {disabled && ' (sin pago)'}
                                  </Menu.Item>
                                );
                              })}
                            </Menu.Dropdown>
                          </Menu>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>

          {data && data.meta.totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                value={page}
                onChange={setPage}
                total={data.meta.totalPages}
              />
            </Group>
          )}
        </>
      )}

      {/* Order Details Modal */}
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        title={`Pedido #${selectedOrder?.id.slice(0, 8)}`}
        size="lg"
        centered
      >
        {selectedOrder && (
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="xs">
                <Badge
                  color={paymentColors[selectedOrder.paymentStatus]}
                  variant={selectedOrder.paymentStatus === 'APPROVED' ? 'filled' : 'outline'}
                  size="lg"
                  leftSection={paymentIcons[selectedOrder.paymentStatus]}
                >
                  {paymentLabels[selectedOrder.paymentStatus]}
                </Badge>
                <Badge
                  color={statusColors[selectedOrder.status]}
                  size="lg"
                  leftSection={statusIcons[selectedOrder.status]}
                >
                  {statusLabels[selectedOrder.status]}
                </Badge>
              </Group>
              <Text c="dimmed" size="sm">
                {new Date(selectedOrder.createdAt).toLocaleString('es-ES')}
              </Text>
            </Group>

            {/* Payment warning */}
            {selectedOrder.paymentStatus === 'PENDING' && selectedOrder.status !== 'CANCELLED' && (
              <Alert icon={<IconAlertCircle size={16} />} color="orange" variant="light">
                Este pedido aún no ha sido pagado. No se puede confirmar hasta que el pago sea aprobado.
              </Alert>
            )}

            <Paper withBorder p="md">
              <Text fw={500} mb="xs">Cliente</Text>
              <Text size="sm">{selectedOrder.user?.name || 'N/A'}</Text>
              <Text size="sm" c="dimmed">{selectedOrder.user?.email || ''}</Text>
            </Paper>

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
                {selectedOrder.items.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Image
                          src={getProductImageSrc(item.product.imageData, item.product.imageUrl)}
                          width={40}
                          height={40}
                          radius="sm"
                          alt={item.product.name}
                          fallbackSrc="https://placehold.co/40x40?text=N/A"
                        />
                        <Text size="sm">{item.product.name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                    <Table.Td>${Number(item.price).toFixed(2)}</Table.Td>
                    <Table.Td>${(Number(item.price) * item.quantity).toFixed(2)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Group justify="flex-end">
              <Text size="xl" fw={700}>
                Total: ${Number(selectedOrder.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </Text>
            </Group>

            {/* Payment sync section */}
            {selectedOrder.paymentStatus === 'PENDING' && selectedOrder.status !== 'CANCELLED' && (
              <>
                <Divider label="Gestión de pago" labelPosition="center" />
                <Paper withBorder p="md">
                  <Stack gap="sm">
                    <Text size="sm" fw={500}>Sincronizar pago desde MercadoPago</Text>
                    <Group>
                      <TextInput
                        placeholder="ID de pago de MercadoPago"
                        value={syncPaymentId}
                        onChange={(e) => setSyncPaymentId(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <Button
                        onClick={handleSyncPayment}
                        loading={syncPaymentMutation.isPending}
                        disabled={!syncPaymentId}
                      >
                        Sincronizar
                      </Button>
                    </Group>
                    <Divider label="o" labelPosition="center" />
                    <Button
                      variant="outline"
                      color="green"
                      onClick={handleMarkAsPaid}
                      loading={markAsPaidMutation.isPending}
                      leftSection={<IconCheck size={16} />}
                    >
                      Marcar como pagado manualmente
                    </Button>
                    <Text size="xs" c="dimmed">
                      Usa esta opción solo si tienes confirmación externa del pago.
                    </Text>
                  </Stack>
                </Paper>
              </>
            )}

            {/* Status change section */}
            {validTransitions[selectedOrder.status].length > 0 && (
              <>
                <Divider label="Cambiar estado" labelPosition="center" />
                <Group>
                  {validTransitions[selectedOrder.status].map((status) => {
                    const isConfirm = status === 'CONFIRMED';
                    const disabled = isConfirm && !canConfirm(selectedOrder);
                    return (
                      <Button
                        key={status}
                        variant="light"
                        color={statusColors[status]}
                        leftSection={statusIcons[status]}
                        onClick={() => {
                          handleStatusChange(selectedOrder.id, status);
                          closeDetails();
                        }}
                        loading={updateStatusMutation.isPending}
                        disabled={disabled}
                        title={disabled ? 'Requiere pago aprobado' : undefined}
                      >
                        {statusLabels[status]}
                      </Button>
                    );
                  })}
                </Group>
                {selectedOrder.status === 'PENDING' && !canConfirm(selectedOrder) && (
                  <Text size="xs" c="orange">
                    Para confirmar el pedido, primero debe estar pagado.
                  </Text>
                )}
              </>
            )}
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
