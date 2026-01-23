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
  Skeleton,
} from '@mantine/core';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';
import { useCategories } from '@/hooks/useCategories';

// Default images for categories (used when no image is set)
const defaultImages: Record<string, string> = {
  electronica: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600',
  moda: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600',
  hogar: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600',
  deportes: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
  belleza: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600',
};

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <Box py="xl">
        <Container size="xl">
          <Group justify="space-between" mb="lg">
            <div>
              <Title order={2}>Categorías Destacadas</Title>
              <Text c="dimmed">Explora nuestras colecciones</Text>
            </div>
          </Group>
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={200} radius="md" />
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

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
          {categories.map((category) => {
            const imageUrl = category.imageData || category.imageUrl || defaultImages[category.slug] || defaultImages.electronica;

            return (
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
                    backgroundImage: `url(${imageUrl})`,
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
                      {category.description || `${category._count?.products || 0} productos`}
                    </Text>
                  </Box>
                </Box>
              </Card>
            );
          })}
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
