'use client';

import { useState } from 'react';
import {
  Group,
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
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import {
  IconShoppingCart,
  IconUser,
  IconLogout,
  IconPackage,
  IconSettings,
  IconChevronDown,
  IconSearch,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useLogout } from '@/hooks/useAuth';
import { useCartStore } from '@/stores/cartStore';
import { useHomepageConfig } from '@/hooks/useSiteConfig';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useUser();
  const logoutMutation = useLogout();
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: config } = useHomepageConfig();
  const storeName = config?.general?.storeName || 'Dynnamo';

  const handleSearch = () => {
    const trimmed = searchValue.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      setSearchValue('');
      setSearchOpen(false);
      closeDrawer();
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container size="xl" py="md">
        <Group justify="space-between">
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Text
              size="xl"
              fw={700}
              style={{
                fontFamily: 'var(--font-display)',
                color: 'white',
                letterSpacing: '-0.5px',
              }}
            >
              {storeName}
            </Text>
          </Link>

          {/* Desktop Navigation */}
          <Group gap="sm" visibleFrom="sm">
            {/* Nav Links */}
            <Link href="/products" style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Text
                  size="sm"
                  fw={500}
                  px="md"
                  py="xs"
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    transition: 'color 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')
                  }
                >
                  Productos
                </Text>
              </motion.div>
            </Link>

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <IconSearch size={18} />
            </motion.button>

            {/* Cart */}
            <Link href="/cart" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 12,
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <IconShoppingCart size={18} />
                {totalItems > 0 && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      minWidth: 20,
                      height: 20,
                      padding: '0 6px',
                      background: 'var(--electric-orchid)',
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text size="xs" fw={600} c="white">
                      {totalItems}
                    </Text>
                  </Box>
                )}
              </motion.div>
            </Link>

            {isAuthenticated ? (
              <Menu
                shadow="md"
                width={220}
                position="bottom-end"
                styles={{
                  dropdown: {
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 16,
                  },
                  item: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                  label: {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                  divider: {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Menu.Target>
                  <UnstyledButton>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 12,
                      }}
                    >
                      <Avatar
                        size="sm"
                        radius="xl"
                        style={{
                          background: 'rgba(124, 58, 237, 0.3)',
                          border: '1px solid rgba(124, 58, 237, 0.5)',
                        }}
                      >
                        <Text size="xs" fw={600} c="white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </Text>
                      </Avatar>
                      <Text size="sm" fw={500} c="white">
                        {user?.name?.split(' ')[0]}
                      </Text>
                      <IconChevronDown
                        size={14}
                        style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      />
                    </motion.div>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Mi cuenta</Menu.Label>
                  <Menu.Item
                    leftSection={<IconUser size={16} />}
                    onClick={() => router.push('/profile')}
                  >
                    Mi perfil
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconPackage size={16} />}
                    onClick={() => router.push('/orders')}
                  >
                    Mis pedidos
                  </Menu.Item>

                  {isAdmin && (
                    <>
                      <Menu.Divider />
                      <Menu.Label>Administración</Menu.Label>
                      <Menu.Item
                        leftSection={<IconSettings size={16} />}
                        onClick={() => router.push('/admin')}
                      >
                        Panel Admin
                      </Menu.Item>
                    </>
                  )}

                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={16} />}
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Group gap="sm">
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <Text
                    size="sm"
                    fw={500}
                    px="md"
                    py="xs"
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')
                    }
                  >
                    Iniciar sesión
                  </Text>
                </Link>
                <Link href="/register" style={{ textDecoration: 'none' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '10px 20px',
                      background: 'var(--electric-orchid)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
                    }}
                  >
                    Registrarse
                  </motion.button>
                </Link>
              </Group>
            )}
          </Group>

          {/* Mobile Burger */}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
            color="white"
          />
        </Group>

        {/* Search Bar (expandable) */}
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginTop: 16 }}
          >
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              autoFocus
              className="input-glass"
              style={{
                width: '100%',
                padding: '14px 20px',
              }}
            />
          </motion.div>
        )}
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="xl"
        title={
          <Text
            fw={700}
            size="lg"
            style={{ fontFamily: 'var(--font-display)', color: 'white' }}
          >
            {storeName}
          </Text>
        }
        hiddenFrom="sm"
        zIndex={1000}
        styles={{
          content: {
            background: 'var(--deep-ink)',
          },
          header: {
            background: 'var(--deep-ink)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          },
          close: {
            color: 'white',
          },
        }}
      >
        <Stack gap="md">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="input-glass"
          />

          <Link
            href="/products"
            onClick={closeDrawer}
            style={{ textDecoration: 'none' }}
          >
            <Box
              p="md"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                color: 'white',
              }}
            >
              Productos
            </Box>
          </Link>

          <Link
            href="/cart"
            onClick={closeDrawer}
            style={{ textDecoration: 'none' }}
          >
            <Box
              p="md"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <IconShoppingCart size={20} />
              Carrito ({totalItems})
            </Box>
          </Link>

          <Divider color="rgba(255, 255, 255, 0.1)" />

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                onClick={closeDrawer}
                style={{ textDecoration: 'none' }}
              >
                <Box
                  p="md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 12,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <IconUser size={20} />
                  Mi perfil
                </Box>
              </Link>

              <Link
                href="/orders"
                onClick={closeDrawer}
                style={{ textDecoration: 'none' }}
              >
                <Box
                  p="md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 12,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <IconPackage size={20} />
                  Mis pedidos
                </Box>
              </Link>

              {isAdmin && (
                <>
                  <Divider color="rgba(255, 255, 255, 0.1)" />
                  <Link
                    href="/admin"
                    onClick={closeDrawer}
                    style={{ textDecoration: 'none' }}
                  >
                    <Box
                      p="md"
                      style={{
                        background: 'rgba(124, 58, 237, 0.2)',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        borderRadius: 12,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <IconSettings size={20} />
                      Panel Admin
                    </Box>
                  </Link>
                </>
              )}

              <Divider color="rgba(255, 255, 255, 0.1)" />

              <Box
                p="md"
                onClick={() => {
                  handleLogout();
                  closeDrawer();
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 12,
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                }}
              >
                <IconLogout size={20} />
                Cerrar sesión
              </Box>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeDrawer}
                style={{ textDecoration: 'none' }}
              >
                <Box
                  p="md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 12,
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  Iniciar sesión
                </Box>
              </Link>

              <Link
                href="/register"
                onClick={closeDrawer}
                style={{ textDecoration: 'none' }}
              >
                <Box
                  p="md"
                  style={{
                    background: 'var(--electric-orchid)',
                    borderRadius: 12,
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  Registrarse
                </Box>
              </Link>
            </>
          )}
        </Stack>
      </Drawer>
    </header>
  );
}
