'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  TextInput,
  Select,
  Skeleton,
  NumberInput,
  Paper,
  Loader,
  Center,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconShoppingCart } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useInfiniteProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Product } from '@/types';
import { getProductImageSrc } from '@/utils/image';

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  const imageSrc = getProductImageSrc(product.imageData, product.imageUrl, 'https://placehold.co/300x200?text=Sin+imagen');
  const isBase64 = imageSrc?.startsWith('data:');

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Card.Section component={Link} href={`/products/${product.id}`} pos="relative" style={{ height: 200 }}>
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          style={{ objectFit: 'cover' }}
          unoptimized={isBase64}
        />
      </Card.Section>

      <Stack gap="sm" mt="md" style={{ flex: 1 }}>
        <Group justify="space-between">
          <Text
            component={Link}
            href={`/products/${product.id}`}
            fw={500}
            lineClamp={1}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {product.name}
          </Text>
          {product.stock === 0 && (
            <Badge color="red">Agotado</Badge>
          )}
        </Group>

        <Text size="sm" c="dimmed" lineClamp={2}>
          {product.description}
        </Text>

        <Group justify="space-between" mt="auto">
          <Stack gap={0}>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <Text size="sm" td="line-through" c="dimmed">
                ${Number(product.originalPrice).toFixed(2)}
              </Text>
            )}
            <Text size="xl" fw={700} c="blue">
              ${Number(product.price).toFixed(2)}
            </Text>
          </Stack>
          <Button
            leftSection={<IconShoppingCart size={16} />}
            disabled={product.stock === 0}
            onClick={onAddToCart}
          >
            Agregar
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();

  // Estado de filtros
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState<string | null>(searchParams.get('category'));
  const [sortBy, setSortBy] = useState<string | null>(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState<string | null>(searchParams.get('sortOrder') || 'desc');
  const [minPrice, setMinPrice] = useState<number | ''>(searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : '');
  const [maxPrice, setMaxPrice] = useState<number | ''>(searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : '');
  const featured = searchParams.get('featured') === 'true' ? true : undefined;

  // Debounce búsqueda para evitar muchas llamadas
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const { data: categoriesData } = useCategories();
  const { addItem } = useUnifiedCart();

  // Parámetros de consulta (sin página - la maneja infinite query)
  const queryParams = useMemo(() => ({
    limit: 12,
    search: debouncedSearch || undefined,
    category: category || undefined,
    sortBy: sortBy || 'createdAt',
    sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
    minPrice: minPrice !== '' ? minPrice : undefined,
    maxPrice: maxPrice !== '' ? maxPrice : undefined,
    featured,
  }), [debouncedSearch, category, sortBy, sortOrder, minPrice, maxPrice, featured]);

  // Infinite query
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteProducts(queryParams);

  // Intersection observer para cargar más productos
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: '200px', // Cargar antes de llegar al final
  });

  // Cargar más cuando el elemento sea visible
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Aplanar todas las páginas de productos
  const products = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  const totalProducts = data?.pages[0]?.meta.total || 0;

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: getProductImageSrc(product.imageData, product.imageUrl),
    });
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1}>Productos</Title>
          {totalProducts > 0 && (
            <Text c="dimmed">{totalProducts} productos encontrados</Text>
          )}
        </Group>

        {/* Filters */}
        <Paper shadow="xs" p="md" withBorder>
          <Group align="flex-end" wrap="wrap">
            <TextInput
              placeholder="Buscar productos..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200, maxWidth: 300 }}
            />
            <NumberInput
              placeholder="Min"
              label="Precio mínimo"
              prefix="$"
              min={0}
              value={minPrice}
              onChange={(value) => setMinPrice(value as number | '')}
              style={{ width: 120 }}
            />
            <NumberInput
              placeholder="Max"
              label="Precio máximo"
              prefix="$"
              min={0}
              value={maxPrice}
              onChange={(value) => setMaxPrice(value as number | '')}
              style={{ width: 120 }}
            />
            <Select
              label="Categoría"
              placeholder="Todas"
              value={category}
              onChange={setCategory}
              data={categoriesData?.map((c) => ({ value: c.slug, label: c.name })) || []}
              clearable
              style={{ width: 160 }}
            />
            <Select
              label="Ordenar por"
              value={sortBy}
              onChange={setSortBy}
              data={[
                { value: 'createdAt', label: 'Más recientes' },
                { value: 'name', label: 'Nombre' },
                { value: 'price', label: 'Precio' },
              ]}
              style={{ width: 150 }}
            />
            <Select
              label="Orden"
              value={sortOrder}
              onChange={setSortOrder}
              data={[
                { value: 'asc', label: 'Ascendente' },
                { value: 'desc', label: 'Descendente' },
              ]}
              style={{ width: 130 }}
            />
          </Group>
        </Paper>

        {/* Products Grid */}
        {isLoading ? (
          <Grid>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <Skeleton height={350} radius="md" />
              </Grid.Col>
            ))}
          </Grid>
        ) : products.length > 0 ? (
          <>
            <Grid>
              {products.map((product) => (
                <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                  <ProductCard
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </Grid.Col>
              ))}
            </Grid>

            {/* Load more trigger */}
            <div ref={loadMoreRef} style={{ height: 20, marginTop: 20 }}>
              {isFetchingNextPage && (
                <Center>
                  <Loader size="md" />
                </Center>
              )}
            </div>

            {!hasNextPage && products.length > 0 && (
              <Text c="dimmed" ta="center" py="md">
                Has visto todos los productos
              </Text>
            )}
          </>
        ) : (
          <Text c="dimmed" ta="center" py="xl">
            No se encontraron productos
          </Text>
        )}
      </Stack>
    </Container>
  );
}
