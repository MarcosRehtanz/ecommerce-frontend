import { Suspense } from 'react';
import { Skeleton, Container, Stack } from '@mantine/core';
import {
  HeroSection,
  CategoryGrid,
  ProductCarousel,
  ValueProposition,
  SpecialOffer,
  Newsletter,
} from '@/components/home';
import { fetchProducts, fetchCategories, fetchBestSellers } from '@/lib/api/server';

// Loading fallback para carruseles
function CarouselSkeleton() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        <Skeleton height={30} width={200} />
        <Skeleton height={20} width={300} />
        <div style={{ display: 'flex', gap: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={350} width={280} radius="md" />
          ))}
        </div>
      </Stack>
    </Container>
  );
}

export default async function HomePage() {
  // Fetch data en paralelo en el servidor (ISR con revalidate de 60s)
  const [bestSellers, newProducts, categories] = await Promise.all([
    fetchBestSellers(10),
    fetchProducts({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
    fetchCategories(),
  ]);

  return (
    <>
      {/* Hero Section - Primera impresión */}
      <HeroSection />

      {/* Categorías Destacadas - Con datos del servidor */}
      <Suspense fallback={<CarouselSkeleton />}>
        <CategoryGrid initialCategories={categories || []} />
      </Suspense>

      {/* Productos más vendidos - Con datos del servidor */}
      <Suspense fallback={<CarouselSkeleton />}>
        <ProductCarousel
          title="Los más vendidos"
          subtitle="Lo que otros están comprando"
          viewAllLink="/products"
          initialProducts={bestSellers || []}
        />
      </Suspense>

      {/* Propuesta de valor */}
      <ValueProposition />

      {/* Oferta especial */}
      <SpecialOffer />

      {/* Novedades - Con datos del servidor */}
      <Suspense fallback={<CarouselSkeleton />}>
        <ProductCarousel
          title="Novedades"
          subtitle="Recién llegados a la tienda"
          viewAllLink="/products?sortBy=createdAt&sortOrder=desc"
          initialProducts={newProducts?.data || []}
        />
      </Suspense>

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
