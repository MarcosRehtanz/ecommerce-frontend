'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppShell,
  NavLink,
  Group,
  Text,
  Avatar,
  Stack,
  Divider,
  Skeleton,
  Center,
  Loader,
  Burger,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
import { useAuthStore } from '@/stores/authStore';

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
  const router = useRouter();
  const [opened, { toggle, close }] = useDisclosure();
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  // Close navbar on navigation (mobile)
  useEffect(() => {
    close();
  }, [pathname, close]);

  const isCheckingAuth = !_hasHydrated || !isAuthenticated || user?.role !== 'ADMIN';

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text size="xl" fw={700} c="blue">
            Admin Panel
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="md" h="100%">
          {/* User Info */}
          <Group>
            {isCheckingAuth ? (
              <>
                <Skeleton circle height={38} />
                <Stack gap={4}>
                  <Skeleton height={14} width={100} />
                  <Skeleton height={12} width={80} />
                </Stack>
              </>
            ) : (
              <>
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
              </>
            )}
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

      <AppShell.Main>
        {isCheckingAuth ? (
          <Center h="60vh">
            <Loader size="lg" />
          </Center>
        ) : (
          children
        )}
      </AppShell.Main>
    </AppShell>
  );
}
