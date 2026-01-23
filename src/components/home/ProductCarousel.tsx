'use client';

import {
  Container,
  Title,
  Text,
  Group,
  Anchor,
  Card,
  Image,
  Badge,
  Button,
  Box,
  Skeleton,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import Link from 'next/link';
import { IconArrowRight, IconShoppingCart } from '@tabler/icons-react';
import { useProducts } from '@/hooks/useProducts';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';
import { getProductImageSrc } from '@/utils/image';
import { Product } from '@/types';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  queryParams?: Record<string, unknown>;
}

function ProductCard({ product }: { product: Product }) {
  const { addItem, isAdding } = useUnifiedCart();

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

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Card.Section pos="relative">
        <Image
          src={getProductImageSrc(product.imageData, product.imageUrl, 'https://placehold.co/300x300?text=Producto')}
          height={200}
          alt={product.name}
          fallbackSrc="https://placehold.co/300x300?text=Producto"
        />
        {product.stock < 5 && product.stock > 0 && (
          <Badge pos="absolute" top={10} left={10} color="orange">
            Últimas unidades
          </Badge>
        )}
        {hasDiscount && (
          <Badge pos="absolute" top={10} left={10} color="red">
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
              ${Number(product.originalPrice).toFixed(2)}
            </Text>
          )}
          <Text fw={700} c="blue" size="lg">
            ${Number(product.price).toFixed(2)}
          </Text>
        </Group>

        <Button
          fullWidth
          radius="md"
          leftSection={<IconShoppingCart size={18} />}
          onClick={handleAddToCart}
          loading={isAdding}
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
  queryParams = {},
}: ProductCarouselProps) {
  const { data, isLoading } = useProducts({ limit: 10, ...queryParams });
  const products = data?.data || [];

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
