'use client';

import { Container, Grid, Skeleton, Stack, Group } from '@mantine/core';

export default function ProductDetailLoading() {
  return (
    <Container size="lg" py="xl">
      <Grid gutter="xl">
        {/* Image */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Skeleton height={400} radius="md" />
        </Grid.Col>

        {/* Details */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <Skeleton height={36} width="80%" />
            <Group gap="xs">
              <Skeleton height={28} width={100} />
              <Skeleton height={20} width={80} />
            </Group>
            <Skeleton height={20} width={120} />
            <Skeleton height={100} />
            <Skeleton height={24} width={150} />
            <Group>
              <Skeleton height={42} width={120} />
              <Skeleton height={42} style={{ flex: 1 }} />
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
