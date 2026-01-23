'use client';

import {
  AppShell,
  NavLink,
  Group,
  Text,
  Avatar,
  Stack,
  Divider,
} from '@mantine/core';
import {
  IconDashboard,
  IconPackage,
  IconCategory,
  IconUsers,
  IconShoppingCart,
  IconSettings,
  IconArrowLeft,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/auth/AuthGuard';

const navItems = [
  { label: 'Dashboard', icon: IconDashboard, href: '/admin' },
  { label: 'Productos', icon: IconPackage, href: '/admin/products' },
  { label: 'Categorías', icon: IconCategory, href: '/admin/categories' },
  { label: 'Pedidos', icon: IconShoppingCart, href: '/admin/orders' },
  { label: 'Usuarios', icon: IconUsers, href: '/admin/users' },
  { label: 'Configuración', icon: IconSettings, href: '/admin/site-config' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <AuthGuard requireAdmin>
      <AppShell
        navbar={{
          width: 280,
          breakpoint: 'sm',
        }}
        padding="md"
      >
        <AppShell.Navbar p="md">
          <Stack gap="md" h="100%">
            {/* Header */}
            <Group>
              <Text size="xl" fw={700} c="blue">
                Admin Panel
              </Text>
            </Group>

            <Divider />

            {/* User Info */}
            <Group>
              <Avatar color="blue" radius="xl">
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Stack gap={0}>
                <Text size="sm" fw={500}>
                  {user?.name}
                </Text>
                <Text size="xs" c="dimmed">
                  Administrador
                </Text>
              </Stack>
            </Group>

            <Divider />

            {/* Navigation */}
            <Stack gap={4} style={{ flex: 1 }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  component={Link}
                  href={item.href}
                  label={item.label}
                  leftSection={<item.icon size={20} />}
                  active={
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href)
                  }
                />
              ))}
            </Stack>

            <Divider />

            {/* Back to store */}
            <NavLink
              component={Link}
              href="/"
              label="Volver a la tienda"
              leftSection={<IconArrowLeft size={20} />}
            />
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </AuthGuard>
  );
}
