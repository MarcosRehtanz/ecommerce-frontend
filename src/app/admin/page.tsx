'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  SimpleGrid,
  Card,
  Text,
  Group,
  ThemeIcon,
  Stack,
  Paper,
  Badge,
  Table,
  Skeleton,
  Select,
  Button,
  Image,
  Alert,
} from '@mantine/core';
import { AreaChart, DonutChart } from '@mantine/charts';
import {
  IconPackage,
  IconShoppingCart,
  IconUsers,
  IconCurrencyDollar,
  IconAlertTriangle,
  IconTrendingUp,
  IconDownload,
  IconAlertCircle,
} from '@tabler/icons-react';
import {
  useDashboardStats,
  useSalesReport,
  useTopProducts,
  useLowStockProducts,
  useRecentOrders,
  useExportOrders,
  useExportSalesReport,
} from '@/hooks/useReports';
import { ReportPeriod } from '@/lib/api/reports';
import { getProductImageSrc } from '@/utils/image';

const statusColors: Record<string, string> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  SHIPPED: 'cyan',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

export default function AdminDashboard() {
  const [salesPeriod, setSalesPeriod] = useState<ReportPeriod>('daily');

  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: salesData, isLoading: isLoadingSales } = useSalesReport({ period: salesPeriod });
  const { data: topProducts, isLoading: isLoadingTopProducts } = useTopProducts(5);
  const { data: lowStockProducts } = useLowStockProducts(5);
  const { data: recentOrders, isLoading: isLoadingRecentOrders } = useRecentOrders(5);

  const exportOrdersMutation = useExportOrders();
  const exportSalesMutation = useExportSalesReport();

  // Prepare chart data for donut
  const orderStatusData = stats
    ? [
        { name: 'Pendientes', value: stats.orders.pending, color: 'yellow' },
        { name: 'Confirmados', value: stats.orders.confirmed, color: 'blue' },
        { name: 'Enviados', value: stats.orders.shipped, color: 'cyan' },
        { name: 'Entregados', value: stats.orders.delivered, color: 'green' },
        { name: 'Cancelados', value: stats.orders.cancelled, color: 'red' },
      ].filter((item) => item.value > 0)
    : [];

  // Prepare chart data for area chart
  const salesChartData = salesData?.data.map((item) => ({
    date: item.date,
    Ventas: item.sales,
    Pedidos: item.orders,
  })) || [];

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Dashboard</Title>
        <Group gap="sm">
          <Button
            variant="light"
            leftSection={<IconDownload size={16} />}
            onClick={() => exportOrdersMutation.mutate({})}
            loading={exportOrdersMutation.isPending}
          >
            Exportar Pedidos
          </Button>
          <Button
            variant="light"
            leftSection={<IconDownload size={16} />}
            onClick={() => exportSalesMutation.mutate({ period: salesPeriod })}
            loading={exportSalesMutation.isPending}
          >
            Exportar Ventas
          </Button>
        </Group>
      </Group>

      {/* Stats Cards */}
      {isLoadingStats ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={100} radius="md" />
          ))}
        </SimpleGrid>
      ) : stats ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Productos
                </Text>
                <Text size="xl" fw={700}>
                  {stats.products.total}
                </Text>
                <Text size="xs" c="dimmed">
                  {stats.products.active} activos
                </Text>
              </div>
              <ThemeIcon size="xl" radius="md" color="blue" variant="light">
                <IconPackage size={28} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Pedidos
                </Text>
                <Text size="xl" fw={700}>
                  {stats.orders.total}
                </Text>
                <Text size="xs" c="dimmed">
                  {stats.orders.pending} pendientes
                </Text>
              </div>
              <ThemeIcon size="xl" radius="md" color="green" variant="light">
                <IconShoppingCart size={28} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Usuarios
                </Text>
                <Text size="xl" fw={700}>
                  {stats.users.total}
                </Text>
                <Text size="xs" c="dimmed">
                  registrados
                </Text>
              </div>
              <ThemeIcon size="xl" radius="md" color="violet" variant="light">
                <IconUsers size={28} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Ingresos
                </Text>
                <Text size="xl" fw={700}>
                  ${stats.revenue.total.toLocaleString('es-AR')}
                </Text>
                <Text size="xs" c="dimmed">
                  total ventas
                </Text>
              </div>
              <ThemeIcon size="xl" radius="md" color="orange" variant="light">
                <IconCurrencyDollar size={28} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>
      ) : null}

      {/* Low Stock Alert */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <Alert
          color="orange"
          icon={<IconAlertTriangle size={20} />}
          title="Productos con bajo stock"
          mb="xl"
        >
          {lowStockProducts.length} producto(s) tienen 5 o menos unidades en stock:{' '}
          {lowStockProducts.map((p) => p.name).join(', ')}
        </Alert>
      )}

      {/* Charts Section */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mb="xl">
        {/* Sales Trend Chart */}
        <Paper shadow="sm" p="lg" withBorder>
          <Group justify="space-between" mb="md">
            <Group gap="xs">
              <IconTrendingUp size={20} />
              <Title order={4}>Tendencia de Ventas</Title>
            </Group>
            <Select
              size="xs"
              value={salesPeriod}
              onChange={(value) => setSalesPeriod(value as ReportPeriod)}
              data={[
                { value: 'daily', label: 'Diario' },
                { value: 'weekly', label: 'Semanal' },
                { value: 'monthly', label: 'Mensual' },
              ]}
              style={{ width: 120 }}
            />
          </Group>
          {isLoadingSales ? (
            <Skeleton height={250} />
          ) : salesChartData.length > 0 ? (
            <>
              <AreaChart
                h={250}
                data={salesChartData}
                dataKey="date"
                series={[
                  { name: 'Ventas', color: 'blue.6' },
                ]}
                curveType="monotone"
                withLegend
                withTooltip
                gridAxis="xy"
              />
              {salesData && (
                <Group justify="center" mt="md" gap="xl">
                  <div style={{ textAlign: 'center' }}>
                    <Text size="xs" c="dimmed">Total Ventas</Text>
                    <Text fw={700}>${salesData.summary.totalSales.toLocaleString('es-AR')}</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Text size="xs" c="dimmed">Total Pedidos</Text>
                    <Text fw={700}>{salesData.summary.totalOrders}</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Text size="xs" c="dimmed">Promedio</Text>
                    <Text fw={700}>${salesData.summary.averageOrderValue.toLocaleString('es-AR')}</Text>
                  </div>
                </Group>
              )}
            </>
          ) : (
            <Stack align="center" justify="center" h={250}>
              <IconAlertCircle size={40} color="gray" />
              <Text c="dimmed">No hay datos de ventas en este periodo</Text>
            </Stack>
          )}
        </Paper>

        {/* Orders by Status Chart */}
        <Paper shadow="sm" p="lg" withBorder>
          <Group gap="xs" mb="md">
            <IconShoppingCart size={20} />
            <Title order={4}>Pedidos por Estado</Title>
          </Group>
          {isLoadingStats ? (
            <Skeleton height={250} />
          ) : orderStatusData.length > 0 ? (
            <DonutChart
              h={250}
              data={orderStatusData}
              withLabelsLine
              withLabels
              tooltipDataSource="segment"
              chartLabel={`${stats?.orders.total || 0} total`}
            />
          ) : (
            <Stack align="center" justify="center" h={250}>
              <IconAlertCircle size={40} color="gray" />
              <Text c="dimmed">No hay pedidos registrados</Text>
            </Stack>
          )}
        </Paper>
      </SimpleGrid>

      {/* Tables Section */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        {/* Top Products */}
        <Paper shadow="sm" p="lg" withBorder>
          <Group gap="xs" mb="md">
            <IconTrendingUp size={20} />
            <Title order={4}>Productos Mas Vendidos</Title>
          </Group>
          {isLoadingTopProducts ? (
            <Stack gap="sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={50} />
              ))}
            </Stack>
          ) : topProducts && topProducts.length > 0 ? (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Producto</Table.Th>
                  <Table.Th>Vendidos</Table.Th>
                  <Table.Th>Ingresos</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {topProducts.map((product) => (
                  <Table.Tr key={product.productId}>
                    <Table.Td>
                      <Group gap="sm">
                        <Image
                          src={getProductImageSrc(product.imageData, product.imageUrl)}
                          width={32}
                          height={32}
                          radius="sm"
                          alt={product.name}
                          fallbackSrc="https://placehold.co/32x32?text=N/A"
                        />
                        <Text size="sm" fw={500} lineClamp={1}>
                          {product.name}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{product.totalSold}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        ${product.totalRevenue.toLocaleString('es-AR')}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Stack align="center" py="xl">
              <Text c="dimmed">No hay datos de ventas</Text>
            </Stack>
          )}
        </Paper>

        {/* Recent Orders */}
        <Paper shadow="sm" p="lg" withBorder>
          <Group gap="xs" mb="md">
            <IconShoppingCart size={20} />
            <Title order={4}>Pedidos Recientes</Title>
          </Group>
          {isLoadingRecentOrders ? (
            <Stack gap="sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={50} />
              ))}
            </Stack>
          ) : recentOrders && recentOrders.length > 0 ? (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Pedido</Table.Th>
                  <Table.Th>Cliente</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Total</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentOrders.map((order) => (
                  <Table.Tr key={order.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        #{order.id.slice(0, 8)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={1}>
                        {order.user?.name || 'N/A'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={statusColors[order.status]} size="sm">
                        {statusLabels[order.status]}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        ${Number(order.total).toLocaleString('es-AR')}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Stack align="center" py="xl">
              <Text c="dimmed">No hay pedidos recientes</Text>
            </Stack>
          )}
        </Paper>
      </SimpleGrid>
    </Container>
  );
}
