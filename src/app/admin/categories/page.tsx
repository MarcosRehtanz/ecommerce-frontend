'use client';

import { useState } from 'react';
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
import { useCategoriesAdmin, useDeleteCategory } from '@/hooks/useCategories';
import { Category } from '@/types';
import { CategoryFormModal } from './CategoryFormModal';
import { getProductImageSrc } from '@/utils/image';

const columnHelper = createColumnHelper<Category>();

export default function AdminCategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const { data, isLoading } = useCategoriesAdmin({
    page,
    limit: 10,
    search: search || undefined,
    isActive: activeFilter === 'active' ? true : activeFilter === 'inactive' ? false : undefined,
  });

  const deleteMutation = useDeleteCategory();

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    openModal();
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteMutation.mutate(selectedCategory.id, {
        onSuccess: () => {
          closeDeleteModal();
          setSelectedCategory(null);
        },
      });
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
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
    columnHelper.accessor('slug', {
      header: 'Slug',
      cell: (info) => (
        <Text size="sm" c="dimmed" ff="monospace">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('displayOrder', {
      header: 'Orden',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'products',
      header: 'Productos',
      cell: ({ row }) => (
        <Badge variant="light">
          {row.original._count?.products ?? 0}
        </Badge>
      ),
    }),
    columnHelper.accessor('isActive', {
      header: 'Estado',
      cell: (info) => (
        <Badge color={info.getValue() ? 'blue' : 'gray'}>
          {info.getValue() ? 'Activa' : 'Inactiva'}
        </Badge>
      ),
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
        <Title order={1}>Gestión de Categorías</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Nueva Categoría
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
            placeholder="Filtrar por estado"
            value={activeFilter}
            onChange={(value) => {
              setActiveFilter(value);
              setPage(1);
            }}
            data={[
              { value: 'active', label: 'Activa' },
              { value: 'inactive', label: 'Inactiva' },
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
                        No se encontraron categorías
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

      {/* Category Form Modal */}
      <CategoryFormModal
        opened={modalOpened}
        onClose={() => {
          closeModal();
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirmar eliminación"
        centered
      >
        <Text mb="lg">
          ¿Estás seguro de que deseas eliminar la categoría{' '}
          <strong>{selectedCategory?.name}</strong>?
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button
            color="red"
            onClick={confirmDelete}
            loading={deleteMutation.isPending}
          >
            Eliminar
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
