'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Title,
  Grid,
  Card,
  Image,
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
  Pagination,
} from '@mantine/core';
import { IconSearch, IconShoppingCart } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';
import { Product } from '@/types';
import { getProductImageSrc } from '@/utils/image';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(categoryParam);
  const [sortBy, setSortBy] = useState<string | null>('createdAt');
  const [sortOrder, setSortOrder] = useState<string | null>('desc');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  const { data: categoriesData } = useCategories();

  const { data, isLoading } = useProducts({
    page,
    limit: 12,
    search: search || undefined,
    category: category || undefined,
    sortBy: sortBy || 'createdAt',
    sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
    minPrice: minPrice !== '' ? minPrice : undefined,
    maxPrice: maxPrice !== '' ? maxPrice : undefined,
  });

  const { addItem } = useUnifiedCart();

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
        <Title order={1}>Productos</Title>

        {/* Filters */}
        <Paper shadow="xs" p="md" withBorder>
          <Group align="flex-end">
            <TextInput
              placeholder="Buscar productos..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{ flex: 1, maxWidth: 300 }}
            />
            <NumberInput
              placeholder="Min"
              label="Precio mínimo"
              prefix="$"
              min={0}
              value={minPrice}
              onChange={(value) => {
                setMinPrice(value as number | '');
                setPage(1);
              }}
              style={{ width: 120 }}
            />
            <NumberInput
              placeholder="Max"
              label="Precio máximo"
              prefix="$"
              min={0}
              value={maxPrice}
              onChange={(value) => {
                setMaxPrice(value as number | '');
                setPage(1);
              }}
              style={{ width: 120 }}
            />
            <Select
              label="Categoría"
              placeholder="Todas"
              value={category}
              onChange={(value) => {
                setCategory(value);
                setPage(1);
              }}
              data={categoriesData?.map((c) => ({ value: c.slug, label: c.name })) || []}
              clearable
              style={{ width: 160 }}
            />
            <Select
              label="Ordenar por"
              value={sortBy}
              onChange={(value) => {
                setSortBy(value);
                setPage(1);
              }}
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
              onChange={(value) => {
                setSortOrder(value);
                setPage(1);
              }}
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
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <Skeleton height={350} radius="md" />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <>
            <Grid>
              {data?.data.map((product) => (
                <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                    <Card.Section>
                      <Image
                        src={getProductImageSrc(product.imageData, product.imageUrl)}
                        height={200}
                        alt={product.name}
                        fallbackSrc="https://placehold.co/300x200?text=Sin+imagen"
                      />
                    </Card.Section>

                    <Stack gap="sm" mt="md" style={{ flex: 1 }}>
                      <Group justify="space-between">
                        <Text fw={500} lineClamp={1}>
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
                        <Text size="xl" fw={700} c="blue">
                          ${Number(product.price).toFixed(2)}
                        </Text>
                        <Button
                          leftSection={<IconShoppingCart size={16} />}
                          disabled={product.stock === 0}
                          onClick={() => handleAddToCart(product)}
                        >
                          Agregar
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>

            {/* Pagination */}
            {data && data.meta.totalPages > 1 && (
              <Group justify="center" mt="xl">
                <Pagination
                  value={page}
                  onChange={setPage}
                  total={data.meta.totalPages}
                />
              </Group>
            )}

            {data?.data.length === 0 && (
              <Text c="dimmed" ta="center" py="xl">
                No se encontraron productos
              </Text>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}
