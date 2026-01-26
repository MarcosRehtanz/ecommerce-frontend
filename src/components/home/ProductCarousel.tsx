'use client';

import {
  Container,
  Title,
  Text,
  Group,
  Anchor,
  Card,
  Badge,
  Button,
  Box,
  Skeleton,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import Image from 'next/image';
import Link from 'next/link';
import { IconArrowRight, IconShoppingCart } from '@tabler/icons-react';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';
import { getProductImageSrc } from '@/utils/image';
import { Product } from '@/types';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  initialProducts?: Product[];
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useUnifiedCart();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: getProductImageSrc(product.imageData, product.imageUrl),
    });
  };

  const hasDiscount = product.originalPrice && Number(product.originalPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(product.price) / Number(product.originalPrice)) * 100)
    : 0;

  const imageSrc = getProductImageSrc(product.imageData, product.imageUrl, 'https://placehold.co/300x300?text=Producto');
  const isBase64 = imageSrc?.startsWith('data:');

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Card.Section pos="relative" style={{ height: 200 }}>
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 280px"
          style={{ objectFit: 'cover' }}
          unoptimized={isBase64}
        />
        {product.stock < 5 && product.stock > 0 && (
          <Badge pos="absolute" top={10} left={10} color="orange" style={{ zIndex: 2 }}>
            Últimas unidades
          </Badge>
        )}
        {hasDiscount && (
          <Badge pos="absolute" top={10} left={product.stock < 5 && product.stock > 0 ? 'auto' : 10} right={product.stock < 5 && product.stock > 0 ? 10 : 'auto'} color="red" style={{ zIndex: 2 }}>
            -{discountPercent}%
          </Badge>
        )}
      </Card.Section>

      <Box mt="md" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Text
          component={Link}
          href={`/products/${product.id}`}
          fw={500}
          lineClamp={2}
          style={{ textDecoration: 'none', color: 'inherit', minHeight: '2.8em' }}
        >
          {product.name}
        </Text>

        <Group mt="xs" gap="xs">
          {hasDiscount && (
            <Text td="line-through" c="dimmed" size="sm">
              ${Number(product.originalPrice).toLocaleString('es-AR')}
            </Text>
          )}
          <Text fw={700} c="blue" size="lg">
            ${Number(product.price).toLocaleString('es-AR')}
          </Text>
        </Group>

        <Button
          fullWidth
          radius="md"
          leftSection={<IconShoppingCart size={18} />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{ marginTop: 'auto' }}
        >
          {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
        </Button>
      </Box>
    </Card>
  );
}

export function ProductCarousel({
  title,
  subtitle,
  viewAllLink = '/products',
  initialProducts = [],
}: ProductCarouselProps) {
  // Usar datos iniciales del servidor directamente
  const products = initialProducts;
  const isLoading = false; // Los datos ya vienen del servidor

  return (
    <Box py="xl">
      <Container size="xl">
        <Group justify="space-between" mb="lg">
          <div>
            <Title order={2}>{title}</Title>
            {subtitle && <Text c="dimmed">{subtitle}</Text>}
          </div>
          <Anchor
            component={Link}
            href={viewAllLink}
            c="blue"
            fw={500}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            Ver todos <IconArrowRight size={16} />
          </Anchor>
        </Group>

        {isLoading ? (
          <Group>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={350} width={280} radius="md" />
            ))}
          </Group>
        ) : products.length > 0 ? (
          <Carousel
            slideSize={{ base: '100%', xs: '50%', sm: '33.333333%', md: '25%' }}
            slideGap="md"
            align="start"
            slidesToScroll={{ base: 1, xs: 1, sm: 2, md: 3 }}
            withControls
            loop={products.length > 4}
            styles={{
              control: {
                backgroundColor: 'white',
                border: '1px solid var(--mantine-color-gray-3)',
                boxShadow: 'var(--mantine-shadow-sm)',
              },
            }}
          >
            {products.map((product) => (
              <Carousel.Slide key={product.id}>
                <ProductCard product={product} />
              </Carousel.Slide>
            ))}
          </Carousel>
        ) : (
          <Text c="dimmed" ta="center" py="xl">
            No hay productos disponibles
          </Text>
        )}
      </Container>
    </Box>
  );
}
