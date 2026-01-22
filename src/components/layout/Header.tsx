'use client';

import {
  Group,
  Button,
  Text,
  Menu,
  Avatar,
  UnstyledButton,
  Indicator,
  Container,
  Burger,
  Drawer,
  Stack,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconShoppingCart,
  IconUser,
  IconLogout,
  IconPackage,
  IconSettings,
  IconChevronDown,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useLogout } from '@/hooks/useAuth';
import { useCartStore } from '@/stores/cartStore';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useUser();
  const logoutMutation = useLogout();
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        backgroundColor: 'white',
      }}
    >
      <Container size="xl" py="md">
        <Group justify="space-between">
          {/* Logo */}
          <Text
            component={Link}
            href="/"
            size="xl"
            fw={700}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            E-Commerce B2C
          </Text>

          {/* Desktop Navigation */}
          <Group gap="md" visibleFrom="sm">
            <Button component={Link} href="/products" variant="subtle">
              Productos
            </Button>

            {/* Cart - visible for all users */}
            <Indicator
              label={totalItems}
              size={18}
              disabled={totalItems === 0}
            >
              <Button
                component={Link}
                href="/cart"
                variant="subtle"
                leftSection={<IconShoppingCart size={20} />}
              >
                Carrito
              </Button>
            </Indicator>

            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <Menu shadow="md" width={200} position="bottom-end">
                  <Menu.Target>
                    <UnstyledButton>
                      <Group gap="xs">
                        <Avatar color="blue" radius="xl" size="sm">
                          {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Text size="sm" fw={500}>
                          {user?.name}
                        </Text>
                        <IconChevronDown size={14} />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Mi cuenta</Menu.Label>
                    <Menu.Item
                      leftSection={<IconUser size={14} />}
                      onClick={() => router.push('/profile')}
                    >
                      Mi perfil
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconPackage size={14} />}
                      onClick={() => router.push('/orders')}
                    >
                      Mis pedidos
                    </Menu.Item>

                    {isAdmin && (
                      <>
                        <Menu.Divider />
                        <Menu.Label>Administración</Menu.Label>
                        <Menu.Item
                          leftSection={<IconSettings size={14} />}
                          onClick={() => router.push('/admin')}
                        >
                          Panel Admin
                        </Menu.Item>
                      </>
                    )}

                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout size={14} />}
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            ) : (
              <Group gap="sm">
                <Button component={Link} href="/login" variant="subtle">
                  Iniciar sesión
                </Button>
                <Button component={Link} href="/register">
                  Registrarse
                </Button>
              </Group>
            )}
          </Group>

          {/* Mobile Burger */}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Menú"
        hiddenFrom="sm"
        zIndex={1000}
      >
        <Stack>
          <Button
            component={Link}
            href="/products"
            variant="subtle"
            fullWidth
            onClick={closeDrawer}
          >
            Productos
          </Button>

          <Button
            component={Link}
            href="/cart"
            variant="subtle"
            fullWidth
            leftSection={<IconShoppingCart size={20} />}
            onClick={closeDrawer}
          >
            Carrito ({totalItems})
          </Button>

          {isAuthenticated ? (
            <>
              <Divider />

              <Button
                component={Link}
                href="/profile"
                variant="subtle"
                fullWidth
                leftSection={<IconUser size={20} />}
                onClick={closeDrawer}
              >
                Mi perfil
              </Button>

              <Button
                component={Link}
                href="/orders"
                variant="subtle"
                fullWidth
                leftSection={<IconPackage size={20} />}
                onClick={closeDrawer}
              >
                Mis pedidos
              </Button>

              {isAdmin && (
                <>
                  <Divider />
                  <Button
                    component={Link}
                    href="/admin"
                    variant="subtle"
                    fullWidth
                    leftSection={<IconSettings size={20} />}
                    onClick={closeDrawer}
                  >
                    Panel Admin
                  </Button>
                </>
              )}

              <Divider />

              <Button
                color="red"
                variant="subtle"
                fullWidth
                leftSection={<IconLogout size={20} />}
                onClick={() => {
                  handleLogout();
                  closeDrawer();
                }}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Divider />
              <Button
                component={Link}
                href="/login"
                variant="subtle"
                fullWidth
                onClick={closeDrawer}
              >
                Iniciar sesión
              </Button>
              <Button
                component={Link}
                href="/register"
                fullWidth
                onClick={closeDrawer}
              >
                Registrarse
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </header>
  );
}
