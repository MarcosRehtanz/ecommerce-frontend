'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Grid,
  Image,
  Title,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  NumberInput,
  Paper,
  Skeleton,
  Breadcrumbs,
  Anchor,
  Box,
} from '@mantine/core';
import Link from 'next/link';
import { IconShoppingCart, IconArrowLeft } from '@tabler/icons-react';
import { useProduct } from '@/hooks/useProducts';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';
import { getProductImageSrc } from '@/utils/image';
import { Product } from '@/types';
import { ROUTES, productsByCategoryRoute } from '@/lib/routes';

interface ProductDetailClientProps {
  initialProduct: Product | null;
}

export default function ProductDetailClient({ initialProduct }: ProductDetailClientProps) {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id, initialProduct);
  const { addItem } = useUnifiedCart();
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: getProductImageSrc(product.imageData, product.imageUrl),
      },
      quantity
    );
  };

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Skeleton height={400} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack>
              <Skeleton height={30} width="60%" />
              <Skeleton height={20} width="40%" />
              <Skeleton height={100} />
              <Skeleton height={40} width="50%" />
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" gap="md">
          <Text size="xl" c="dimmed">Producto no encontrado</Text>
          <Button component={Link} href={ROUTES.products.list} leftSection={<IconArrowLeft size={16} />}>
            Volver a productos
          </Button>
        </Stack>
      </Container>
    );
  }

  const hasDiscount = product.originalPrice && Number(product.originalPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(product.price) / Number(product.originalPrice)) * 100)
    : 0;

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Breadcrumbs>
          <Anchor component={Link} href={ROUTES.home}>Inicio</Anchor>
          <Anchor component={Link} href={ROUTES.products.list}>Productos</Anchor>
          {product.category && (
            <Anchor component={Link} href={productsByCategoryRoute(product.category.slug)}>
              {product.category.name}
            </Anchor>
          )}
          <Text c="dimmed">{product.name}</Text>
        </Breadcrumbs>

        <Grid gutter="xl">
          {/* Product Image */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder radius="md" p="md" pos="relative">
              <Image
                src={getProductImageSrc(product.imageData, product.imageUrl)}
                alt={product.name}
                height={400}
                fit="contain"
                radius="md"
                fallbackSrc="https://placehold.co/500x400?text=Sin+imagen"
              />
              {hasDiscount && (
                <Badge
                  pos="absolute"
                  top={20}
                  left={20}
                  color="red"
                  size="lg"
                  variant="filled"
                >
                  -{discountPercent}%
                </Badge>
              )}
            </Paper>
          </Grid.Col>

          {/* Product Info */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="md">
              {product.category && (
                <Badge variant="light" color="blue" size="sm">
                  {product.category.name}
                </Badge>
              )}

              <Title order={1} fz={{ base: 24, md: 32 }}>
                {product.name}
              </Title>

              {/* Price */}
              <Box>
                <Group gap="sm" align="baseline">
                  <Text fz={32} fw={700} c="blue">
                    ${Number(product.price).toLocaleString('es-AR')}
                  </Text>
                  {hasDiscount && (
                    <Text fz={20} td="line-through" c="dimmed">
                      ${Number(product.originalPrice).toLocaleString('es-AR')}
                    </Text>
                  )}
                </Group>
                {hasDiscount && (
                  <Text size="sm" c="green" fw={500}>
                    Ahorras ${(Number(product.originalPrice) - Number(product.price)).toLocaleString('es-AR')}
                  </Text>
                )}
              </Box>

              {/* Stock */}
              {product.stock === 0 ? (
                <Badge color="red" size="lg">Agotado</Badge>
              ) : product.stock < 5 ? (
                <Badge color="orange" size="lg">
                  Quedan solo {product.stock} unidades
                </Badge>
              ) : (
                <Badge color="green" size="lg" variant="light">
                  En stock
                </Badge>
              )}

              {/* Description */}
              <Text c="dimmed" size="md" style={{ whiteSpace: 'pre-wrap' }}>
                {product.description}
              </Text>

              {/* Add to Cart */}
              {product.stock > 0 && (
                <Paper withBorder p="md" radius="md">
                  <Stack gap="sm">
                    <Group>
                      <NumberInput
                        label="Cantidad"
                        value={quantity}
                        onChange={(val) => setQuantity(Number(val) || 1)}
                        min={1}
                        max={product.stock}
                        style={{ width: 100 }}
                      />
                      <Text size="sm" c="dimmed" mt={24}>
                        {product.stock} disponibles
                      </Text>
                    </Group>
                    <Button
                      size="lg"
                      fullWidth
                      leftSection={<IconShoppingCart size={20} />}
                      onClick={handleAddToCart}
                    >
                      Agregar al carrito
                    </Button>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
