'use client';

import {
  Box,
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Overlay,
} from '@mantine/core';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';

export function HeroSection() {
  return (
    <Box
      pos="relative"
      h={{ base: 400, sm: 500, md: 600 }}
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%)"
        opacity={1}
        zIndex={1}
      />

      <Container size="xl" h="100%" pos="relative" style={{ zIndex: 2 }}>
        <Stack
          justify="center"
          h="100%"
          maw={600}
          gap="lg"
        >
          <Title
            order={1}
            c="white"
            fz={{ base: 32, sm: 42, md: 52 }}
            fw={800}
            lh={1.1}
          >
            Descubre tu estilo único
          </Title>

          <Text
            c="white"
            fz={{ base: 'md', sm: 'lg', md: 'xl' }}
            opacity={0.9}
          >
            Productos de alta calidad seleccionados para ti.
            Envío gratis en tu primera compra.
          </Text>

          <Group mt="md">
            <Button
              component={Link}
              href="/products"
              size="lg"
              radius="md"
              rightSection={<IconArrowRight size={18} />}
            >
              Ver Colección
            </Button>
            <Button
              component={Link}
              href="/products?sort=newest"
              size="lg"
              radius="md"
              variant="white"
              c="dark"
            >
              Novedades
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
