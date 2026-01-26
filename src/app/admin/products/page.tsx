'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Container,
  Title,
  Button,
  Group,
  TextInput,
  Select,
  Table,
  Badge,
  ActionIcon,
  Menu,
  Pagination,
  Paper,
  Text,
  Skeleton,
  Modal,
  Image,
  Loader,
  Center,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPlus,
  IconSearch,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useProductsAdmin, useDeleteProduct } from '@/hooks/useProducts';
import { Product } from '@/types';
import { getProductImageSrc } from '@/utils/image';

// Lazy load del modal de formulario (no se necesita hasta que el usuario hace clic)
const ProductFormModal = dynamic(
  () => import('./ProductFormModal').then((mod) => mod.ProductFormModal),
  {
    loading: () => (
      <Center p="xl">
        <Loader />
      </Center>
    ),
    ssr: false,
  }
);

const columnHelper = createColumnHelper<Product>();

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const { data, isLoading } = useProductsAdmin({
    page,
    limit: 10,
    search: search || undefined,
    inStock: stockFilter === 'in_stock' ? true : stockFilter === 'out_of_stock' ? false : undefined,
    isActive: activeFilter === 'active' ? true : activeFilter === 'inactive' ? false : undefined,
  });

  const deleteProductMutation = useDeleteProduct();

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    openModal();
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProductMutation.mutate(selectedProduct.id, {
        onSuccess: () => {
          closeDeleteModal();
          setSelectedProduct(null);
        },
      });
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    openModal();
  };

  const columns = [
    columnHelper.display({
      id: 'image',
      header: 'Imagen',
      cell: ({ row }) => (
        <Image
          src={getProductImageSrc(row.original.imageData, row.original.imageUrl, 'https://placehold.co/50x50?text=N/A')}
          alt={row.original.name}
          width={50}
          height={50}
          radius="sm"
          fallbackSrc="https://placehold.co/50x50?text=N/A"
        />
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Nombre',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('price', {
      header: 'Precio',
      cell: (info) => `$${Number(info.getValue()).toLocaleString('es-AR')}`,
    }),
    columnHelper.accessor('stock', {
      header: 'Stock',
      cell: (info) => {
        const stock = info.getValue();
        return (
          <Badge color={stock > 0 ? 'green' : 'red'}>
            {stock > 0 ? stock : 'Agotado'}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('isActive', {
      header: 'Estado',
      cell: (info) => (
        <Badge color={info.getValue() ? 'blue' : 'gray'}>
          {info.getValue() ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Creado',
      cell: (info) =>
        new Date(info.getValue()).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <Menu shadow="md" width={150}>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={() => handleEdit(row.original)}
            >
              Editar
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={14} />}
              color="red"
              onClick={() => handleDelete(row.original)}
            >
              Eliminar
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    }),
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Gestión de Productos</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Nuevo Producto
        </Button>
      </Group>

      {/* Filters */}
      <Paper shadow="xs" p="md" mb="lg" withBorder>
        <Group>
          <TextInput
            placeholder="Buscar por nombre..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ flex: 1, maxWidth: 300 }}
          />
          <Select
            placeholder="Filtrar por stock"
            value={stockFilter}
            onChange={(value) => {
              setStockFilter(value);
              setPage(1);
            }}
            data={[
              { value: 'in_stock', label: 'En stock' },
              { value: 'out_of_stock', label: 'Agotado' },
            ]}
            clearable
            style={{ width: 150 }}
          />
          <Select
            placeholder="Filtrar por estado"
            value={activeFilter}
            onChange={(value) => {
              setActiveFilter(value);
              setPage(1);
            }}
            data={[
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' },
            ]}
            clearable
            style={{ width: 150 }}
          />
        </Group>
      </Paper>

      {/* Table */}
      <Paper shadow="xs" withBorder>
        {isLoading ? (
          <div style={{ padding: 20 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} height={50} mb="sm" />
            ))}
          </div>
        ) : (
          <>
            <Table striped highlightOnHover>
              <Table.Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Table.Th key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Thead>
              <Table.Tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={columns.length}>
                      <Text ta="center" c="dimmed" py="xl">
                        No se encontraron productos
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <Table.Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <Table.Td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>

            {/* Pagination */}
            {data && data.meta.totalPages > 1 && (
              <Group justify="center" p="md">
                <Pagination
                  value={page}
                  onChange={setPage}
                  total={data.meta.totalPages}
                />
              </Group>
            )}
          </>
        )}
      </Paper>

      {/* Product Form Modal */}
      <ProductFormModal
        opened={modalOpened}
        onClose={() => {
          closeModal();
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirmar eliminación"
        centered
      >
        <Text mb="lg">
          ¿Estás seguro de que deseas eliminar el producto{' '}
          <strong>{selectedProduct?.name}</strong>?
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button
            color="red"
            onClick={confirmDelete}
            loading={deleteProductMutation.isPending}
          >
            Eliminar
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
