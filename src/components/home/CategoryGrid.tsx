'use client';

import {
  Container,
  SimpleGrid,
  Card,
  Text,
  Title,
  Box,
  Overlay,
  Group,
  Anchor,
} from '@mantine/core';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';

const categories = [
  {
    id: 1,
    name: 'Electrónica',
    description: 'Lo último en tecnología',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600',
    slug: 'electronica',
  },
  {
    id: 2,
    name: 'Moda',
    description: 'Tendencias de temporada',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600',
    slug: 'moda',
  },
  {
    id: 3,
    name: 'Hogar',
    description: 'Para tu espacio',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600',
    slug: 'hogar',
  },
  {
    id: 4,
    name: 'Deportes',
    description: 'Equípate para ganar',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
    slug: 'deportes',
  },
];

export function CategoryGrid() {
  return (
    <Box py="xl">
      <Container size="xl">
        <Group justify="space-between" mb="lg">
          <div>
            <Title order={2}>Categorías Destacadas</Title>
            <Text c="dimmed">Explora nuestras colecciones</Text>
          </div>
          <Anchor
            component={Link}
            href="/products"
            c="blue"
            fw={500}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            Ver todas <IconArrowRight size={16} />
          </Anchor>
        </Group>

        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          {categories.map((category) => (
            <Card
              key={category.id}
              component={Link}
              href={`/products?category=${category.slug}`}
              p={0}
              radius="md"
              style={{
                overflow: 'hidden',
                textDecoration: 'none',
                aspectRatio: '1',
              }}
            >
              <Box
                pos="relative"
                h="100%"
                style={{
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.3s ease',
                }}
                className="category-image"
              >
                <Overlay
                  gradient="linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)"
                  opacity={1}
                />
                <Box pos="absolute" bottom={0} left={0} right={0} p="md" style={{ zIndex: 1 }}>
                  <Text c="white" fw={700} fz="lg">
                    {category.name}
                  </Text>
                  <Text c="white" size="sm" opacity={0.8}>
                    {category.description}
                  </Text>
                </Box>
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      <style>{`
        .category-image:hover {
          transform: scale(1.05);
        }
      `}</style>
    </Box>
  );
}
