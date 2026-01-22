'use client';

import { Container, Group, Text, Anchor } from '@mantine/core';
import Link from 'next/link';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--mantine-color-gray-3)',
        backgroundColor: 'white',
        marginTop: 'auto',
      }}
    >
      <Container size="xl" py="md">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            © {new Date().getFullYear()} E-Commerce B2C. Todos los derechos
            reservados.
          </Text>
          <Group gap="md">
            <Anchor component={Link} href="/products" size="sm" c="dimmed">
              Productos
            </Anchor>
            <Anchor component={Link} href="/about" size="sm" c="dimmed">
              Acerca de
            </Anchor>
            <Anchor component={Link} href="/contact" size="sm" c="dimmed">
              Contacto
            </Anchor>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
