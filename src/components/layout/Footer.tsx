'use client';

import {
  Container,
  Group,
  Text,
  Anchor,
  Stack,
  SimpleGrid,
  Title,
  Box,
  ActionIcon,
  Divider,
  Image,
} from '@mantine/core';
import Link from 'next/link';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandTiktok,
} from '@tabler/icons-react';

const footerLinks = {
  tienda: [
    { label: 'Todos los productos', href: '/products' },
    { label: 'Novedades', href: '/products?sort=newest' },
    { label: 'Ofertas', href: '/products?onSale=true' },
    { label: 'Más vendidos', href: '/products?sort=best-sellers' },
  ],
  ayuda: [
    { label: 'Preguntas frecuentes', href: '/faq' },
    { label: 'Envíos y entregas', href: '/shipping' },
    { label: 'Devoluciones', href: '/returns' },
    { label: 'Contacto', href: '/contact' },
  ],
  empresa: [
    { label: 'Sobre nosotros', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Trabaja con nosotros', href: '/careers' },
  ],
  legal: [
    { label: 'Términos y condiciones', href: '/terms' },
    { label: 'Política de privacidad', href: '/privacy' },
    { label: 'Cookies', href: '/cookies' },
  ],
};

const socialLinks = [
  { icon: IconBrandFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: IconBrandInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: IconBrandTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: IconBrandTiktok, href: 'https://tiktok.com', label: 'TikTok' },
];

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--mantine-color-gray-0)',
        marginTop: 'auto',
      }}
    >
      <Container size="xl" py="xl">
        <SimpleGrid cols={{ base: 2, sm: 2, md: 5 }} spacing="xl">
          {/* Brand Column */}
          <Stack gap="md" style={{ gridColumn: 'span 1' }}>
            <Text size="xl" fw={700}>
              E-Commerce B2C
            </Text>
            <Text size="sm" c="dimmed">
              Tu tienda online de confianza. Productos de calidad con envío a todo el país.
            </Text>
            <Group gap="xs">
              {socialLinks.map((social) => (
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
          </Stack>

          {/* Tienda */}
          <Stack gap="xs">
            <Title order={6} tt="uppercase" c="dimmed">
              Tienda
            </Title>
            {footerLinks.tienda.map((link) => (
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

          {/* Ayuda */}
          <Stack gap="xs">
            <Title order={6} tt="uppercase" c="dimmed">
              Ayuda
            </Title>
            {footerLinks.ayuda.map((link) => (
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

          {/* Empresa */}
          <Stack gap="xs">
            <Title order={6} tt="uppercase" c="dimmed">
              Empresa
            </Title>
            {footerLinks.empresa.map((link) => (
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

          {/* Legal */}
          <Stack gap="xs">
            <Title order={6} tt="uppercase" c="dimmed">
              Legal
            </Title>
            {footerLinks.legal.map((link) => (
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
        </SimpleGrid>

        <Divider my="xl" />

        {/* Bottom Section */}
        <Group justify="space-between" wrap="wrap" gap="md">
          <Text size="sm" c="dimmed">
            © {new Date().getFullYear()} E-Commerce B2C. Todos los derechos reservados.
          </Text>

          {/* Payment Methods */}
          <Group gap="xs">
            <Text size="xs" c="dimmed">
              Métodos de pago:
            </Text>
            <Group gap={4}>
              {['Visa', 'MC', 'Amex', 'PayPal'].map((method) => (
                <Box
                  key={method}
                  px="xs"
                  py={2}
                  bg="white"
                  style={{
                    borderRadius: 4,
                    border: '1px solid var(--mantine-color-gray-3)',
                  }}
                >
                  <Text size="xs" fw={500}>
                    {method}
                  </Text>
                </Box>
              ))}
            </Group>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
