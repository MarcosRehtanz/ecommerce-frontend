'use client';

import {
  Container,
  Group,
  Text,
  Stack,
  SimpleGrid,
  Box,
} from '@mantine/core';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandTiktok,
  IconMail,
  IconMapPin,
  IconClock,
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

const contactInfo = [
  { icon: IconMail, text: 'hola@dynnamo.com' },
  { icon: IconMapPin, text: 'Santiago, Chile' },
  { icon: IconClock, text: 'Lun - Vie: 9:00 - 18:00' },
];

export function Footer() {
  const { data: config } = useHomepageConfig();
  const storeName = config?.general?.storeName || 'Dynnamo';
  const storeDescription =
    config?.general?.storeDescription ||
    'Tu destino premium para productos exclusivos. Calidad excepcional, estilo único.';
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
        position: 'relative',
        backgroundColor: 'var(--deep-ink)',
        marginTop: 'auto',
      }}
    >
      {/* Neon border top */}
      <Box
        pos="absolute"
        top={0}
        left={0}
        right={0}
        h={2}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--electric-orchid) 50%, transparent 100%)',
          boxShadow: '0 0 30px 5px rgba(124, 58, 237, 0.4)',
        }}
      />

      {/* Decorative gradient */}
      <Box
        pos="absolute"
        top={0}
        left="50%"
        w={600}
        h={200}
        style={{
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(ellipse at center top, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container size="xl" py={{ base: 60, md: 80 }} pos="relative">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 40, md: 'xl' }}>
          {/* Brand Column */}
          <Stack gap="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Text
                size="sm"
                style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.7 }}
              >
                {storeDescription}
              </Text>
            </motion.div>

            {socialItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Group gap="sm">
                  {socialItems.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
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
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <social.icon size={18} />
                    </motion.a>
                  ))}
                </Group>
              </motion.div>
            )}
          </Stack>

          {/* Tienda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Stack gap="md">
              <Text
                size="xs"
                fw={600}
                tt="uppercase"
                style={{
                  color: 'var(--electric-orchid)',
                  letterSpacing: 2,
                }}
              >
                Tienda
              </Text>
              {shopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ textDecoration: 'none' }}
                >
                  <Text
                    size="sm"
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      transition: 'color 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = 'white')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)')
                    }
                  >
                    {link.label}
                  </Text>
                </Link>
              ))}
            </Stack>
          </motion.div>

          {/* Mi Cuenta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Stack gap="md">
              <Text
                size="xs"
                fw={600}
                tt="uppercase"
                style={{
                  color: 'var(--electric-orchid)',
                  letterSpacing: 2,
                }}
              >
                Mi Cuenta
              </Text>
              {accountLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ textDecoration: 'none' }}
                >
                  <Text
                    size="sm"
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      transition: 'color 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = 'white')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)')
                    }
                  >
                    {link.label}
                  </Text>
                </Link>
              ))}
            </Stack>
          </motion.div>

          {/* Contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Stack gap="md">
              <Text
                size="xs"
                fw={600}
                tt="uppercase"
                style={{
                  color: 'var(--electric-orchid)',
                  letterSpacing: 2,
                }}
              >
                Contacto
              </Text>
              {contactInfo.map((item, index) => (
                <Group key={index} gap="sm" wrap="nowrap">
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: 8,
                      flexShrink: 0,
                    }}
                  >
                    <item.icon
                      size={14}
                      style={{ color: 'var(--jade-mint)' }}
                    />
                  </Box>
                  <Text
                    size="sm"
                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                  >
                    {item.text}
                  </Text>
                </Group>
              ))}
            </Stack>
          </motion.div>
        </SimpleGrid>

        {/* Divider */}
        <Box
          my={{ base: 40, md: 48 }}
          h={1}
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.1) 80%, transparent)',
          }}
        />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Group justify="space-between" wrap="wrap" gap="md">
            <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              &copy; {new Date().getFullYear()} {storeName}. Todos los derechos
              reservados.
            </Text>
            <Group gap="xl">
              {['Términos', 'Privacidad', 'Cookies'].map((item) => (
                <Text
                  key={item}
                  size="sm"
                  style={{
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)')
                  }
                >
                  {item}
                </Text>
              ))}
            </Group>
          </Group>
        </motion.div>
      </Container>
    </footer>
  );
}
