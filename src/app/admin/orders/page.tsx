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
} from '@tabler/icons-react';
import { useOrdersAdmin, useUpdateOrderStatus, useOrderStats } from '@/hooks/useOrders';
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

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  PENDING: <IconClock size={14} />,
  CONFIRMED: <IconCheck size={14} />,
  SHIPPED: <IconTruck size={14} />,
  DELIVERED: <IconPackage size={14} />,
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);

  const { data, isLoading } = useOrdersAdmin({
    page,
    limit: 10,
    status: statusFilter as OrderStatus || undefined,
  });

  const { data: stats, isLoading: isLoadingStats } = useOrderStats();
  const updateStatusMutation = useUpdateOrderStatus();

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    openDetails();
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ id: orderId, data: { status: newStatus } });
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="lg">Gestión de Pedidos</Title>

      {/* Stats Cards */}
      {isLoadingStats ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={100} radius="md" />
          ))}
        </SimpleGrid>
      ) : stats && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
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
                  ${Number(stats.totalRevenue).toFixed(2)}
                </Text>
              </div>
              <IconCurrencyDollar size={32} color="green" />
            </Group>
          </Paper>
        </SimpleGrid>
      )}

      {/* Filters */}
      <Group justify="flex-end" mb="lg">
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

      {/* Orders Table */}
      {isLoading ? (
        <Stack gap="md">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={60} radius="md" />
          ))}
        </Stack>
      ) : !data || data.data.length === 0 ? (
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
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Items</Table.Th>
                  <Table.Th>Total</Table.Th>
                  <Table.Th>Fecha</Table.Th>
                  <Table.Th>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.data.map((order) => (
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
                        color={statusColors[order.status]}
                        leftSection={statusIcons[order.status]}
                      >
                        {statusLabels[order.status]}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{order.items.length} productos</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>${Number(order.total).toFixed(2)}</Text>
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
                              {validTransitions[order.status].map((status) => (
                                <Menu.Item
                                  key={status}
                                  leftSection={statusIcons[status]}
                                  onClick={() => handleStatusChange(order.id, status)}
                                >
                                  {statusLabels[status]}
                                </Menu.Item>
                              ))}
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

          {data.meta.totalPages > 1 && (
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
              <Badge color={statusColors[selectedOrder.status]} size="lg">
                {statusLabels[selectedOrder.status]}
              </Badge>
              <Text c="dimmed" size="sm">
                {new Date(selectedOrder.createdAt).toLocaleString('es-ES')}
              </Text>
            </Group>

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
                Total: ${Number(selectedOrder.total).toFixed(2)}
              </Text>
            </Group>

            {validTransitions[selectedOrder.status].length > 0 && (
              <>
                <Text fw={500}>Cambiar estado:</Text>
                <Group>
                  {validTransitions[selectedOrder.status].map((status) => (
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
                    >
                      {statusLabels[status]}
                    </Button>
                  ))}
                </Group>
              </>
            )}
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
