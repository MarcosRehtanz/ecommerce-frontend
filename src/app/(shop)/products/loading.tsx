'use client';

import {
  Container,
  Title,
  Grid,
  Stack,
  Skeleton,
  Paper,
  Group,
  TextInput,
  NumberInput,
  Select,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';

export default function ProductsLoading() {
  const searchParams = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category');
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1}>Productos</Title>
        </Group>

        {/* Filtros reales con valores del URL */}
        <Paper shadow="xs" p="md" withBorder>
          <Group align="flex-end" wrap="wrap">
            <TextInput
              placeholder="Buscar productos..."
              leftSection={<IconSearch size={16} />}
              value={search}
              readOnly
              style={{ flex: 1, minWidth: 200, maxWidth: 300 }}
            />
            <NumberInput
              placeholder="Min"
              label="Precio mínimo"
              prefix="$"
              min={0}
              value={minPrice ? Number(minPrice) : ''}
              readOnly
              style={{ width: 120 }}
            />
            <NumberInput
              placeholder="Max"
              label="Precio máximo"
              prefix="$"
              min={0}
              value={maxPrice ? Number(maxPrice) : ''}
              readOnly
              style={{ width: 120 }}
            />
            <Select
              label="Categoría"
              placeholder={category || 'Todas'}
              value={null}
              data={[]}
              disabled
              style={{ width: 160 }}
            />
            <Select
              label="Ordenar por"
              value={sortBy}
              data={[
                { value: 'createdAt', label: 'Más recientes' },
                { value: 'name', label: 'Nombre' },
                { value: 'price', label: 'Precio' },
              ]}
              readOnly
              style={{ width: 150 }}
            />
            <Select
              label="Orden"
              value={sortOrder}
              data={[
                { value: 'asc', label: 'Ascendente' },
                { value: 'desc', label: 'Descendente' },
              ]}
              readOnly
              style={{ width: 130 }}
            />
          </Group>
        </Paper>

        {/* Products grid skeleton */}
        <Grid>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton height={350} radius="md" />
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
