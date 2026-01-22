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
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { User } from '@/types';
import { UserFormModal } from './UserFormModal';

const columnHelper = createColumnHelper<User>();

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const { data, isLoading } = useUsers({
    page,
    limit: 10,
    search: search || undefined,
    role: roleFilter as 'ADMIN' | 'USER' | undefined,
  });

  const deleteUserMutation = useDeleteUser();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    openModal();
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id, {
        onSuccess: () => {
          closeDeleteModal();
          setSelectedUser(null);
        },
      });
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    openModal();
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Nombre',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('role', {
      header: 'Rol',
      cell: (info) => (
        <Badge color={info.getValue() === 'ADMIN' ? 'red' : 'blue'}>
          {info.getValue() === 'ADMIN' ? 'Administrador' : 'Usuario'}
        </Badge>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Fecha de registro',
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
        <Title order={1}>Gestión de Usuarios</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Nuevo Usuario
        </Button>
      </Group>

      {/* Filters */}
      <Paper shadow="xs" p="md" mb="lg" withBorder>
        <Group>
          <TextInput
            placeholder="Buscar por nombre o email..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ flex: 1, maxWidth: 300 }}
          />
          <Select
            placeholder="Filtrar por rol"
            value={roleFilter}
            onChange={(value) => {
              setRoleFilter(value);
              setPage(1);
            }}
            data={[
              { value: 'ADMIN', label: 'Administrador' },
              { value: 'USER', label: 'Usuario' },
            ]}
            clearable
            style={{ width: 180 }}
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
                        No se encontraron usuarios
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

      {/* User Form Modal */}
      <UserFormModal
        opened={modalOpened}
        onClose={() => {
          closeModal();
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirmar eliminación"
        centered
      >
        <Text mb="lg">
          ¿Estás seguro de que deseas eliminar al usuario{' '}
          <strong>{selectedUser?.name}</strong>?
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button
            color="red"
            onClick={confirmDelete}
            loading={deleteUserMutation.isPending}
          >
            Eliminar
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
