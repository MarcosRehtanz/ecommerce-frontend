'use client';

import {
  Container,
  Group,
  Text,
  Anchor,
  Stack,
  SimpleGrid,
  Title,
  ActionIcon,
  Divider,
} from '@mantine/core';
import Link from 'next/link';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandTiktok,
} from '@tabler/icons-react';
import { useHomepageConfig } from '@/hooks/useSiteConfig';

const shopLinks = [
  { label: 'Todos los productos', href: '/products' },
  { label: 'Novedades', href: '/products?sortBy=createdAt&sortOrder=desc' },
  { label: 'Los más populares', href: '/products?featured=true' },
];

const accountLinks = [
  { label: 'Iniciar sesión', href: '/login' },
  { label: 'Crear cuenta', href: '/register' },
  { label: 'Mis pedidos', href: '/orders' },
  { label: 'Mi carrito', href: '/cart' },
];

export function Footer() {
  const { data: config } = useHomepageConfig();
  const storeName = config?.general?.storeName || 'Mi Tienda';
  const storeDescription = config?.general?.storeDescription || 'Tu tienda online de confianza.';
  const socialLinks = config?.general?.socialLinks;

  const socialItems = [
    { icon: IconBrandFacebook, href: socialLinks?.facebook, label: 'Facebook' },
    { icon: IconBrandInstagram, href: socialLinks?.instagram, label: 'Instagram' },
    { icon: IconBrandTwitter, href: socialLinks?.twitter, label: 'Twitter' },
    { icon: IconBrandTiktok, href: socialLinks?.tiktok, label: 'TikTok' },
  ].filter((s) => s.href);

  return (
    <footer
      style={{
        backgroundColor: 'var(--mantine-color-gray-0)',
        marginTop: 'auto',
      }}
    >
      <Container size="xl" py="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
          {/* Brand Column */}
          <Stack gap="md">
            <Text size="xl" fw={700}>
              {storeName}
            </Text>
            <Text size="sm" c="dimmed">
              {storeDescription}
            </Text>
            {socialItems.length > 0 && (
              <Group gap="xs">
                {socialItems.map((social) => (
                  <ActionIcon
                    key={social.label}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="subtle"
                    color="gray"
                    size="lg"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </ActionIcon>
                ))}
              </Group>
            )}
          </Stack>

          {/* Tienda */}
          <Stack gap="xs">
            <Title order={6} tt="uppercase" c="dimmed">
              Tienda
            </Title>
            {shopLinks.map((link) => (
              <Anchor
                key={link.href}
                component={Link}
                href={link.href}
                size="sm"
                c="dark.6"
              >
                {link.label}
              </Anchor>
            ))}
          </Stack>

          {/* Mi Cuenta */}
          <Stack gap="xs">
            <Title order={6} tt="uppercase" c="dimmed">
              Mi Cuenta
            </Title>
            {accountLinks.map((link) => (
              <Anchor
                key={link.href}
                component={Link}
                href={link.href}
                size="sm"
                c="dark.6"
              >
                {link.label}
              </Anchor>
            ))}
          </Stack>

          {/* Info */}
          <Stack gap="xs">
            <Title order={6} tt="uppercase" c="dimmed">
              Información
            </Title>
            <Text size="sm" c="dimmed">
              Envío en 24-48h a todo el país.
            </Text>
            <Text size="sm" c="dimmed">
              Devoluciones gratuitas hasta 30 días.
            </Text>
            <Text size="sm" c="dimmed">
              Pago seguro con tarjeta o PayPal.
            </Text>
          </Stack>
        </SimpleGrid>

        <Divider my="xl" />

        <Group justify="center">
          <Text size="sm" c="dimmed">
            &copy; {new Date().getFullYear()} {storeName}. Todos los derechos reservados.
          </Text>
        </Group>
      </Container>
    </footer>
  );
}
