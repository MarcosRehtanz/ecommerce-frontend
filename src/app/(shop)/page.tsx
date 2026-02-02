import {
  HeroSection,
  CategoryGrid,
  ProductCarousel,
  ValueProposition,
  SpecialOffer,
  Newsletter,
  TrustBar,
  Testimonials,
} from '@/components/home';
import { fetchProducts, fetchCategories, fetchBestSellers } from '@/lib/api/server';

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

      {/* Barra de confianza + Categorías - fondo oscuro continuo */}
      <div style={{ backgroundColor: 'var(--deep-ink, #0F172A)' }}>
        <TrustBar />
        <CategoryGrid initialCategories={categories || []} />
      </div>

      {/* Productos más vendidos */}
      <ProductCarousel
        title="Los más vendidos"
        subtitle="Lo que otros están comprando"
        viewAllLink="/products"
        initialProducts={bestSellers || []}
      />

      {/* Propuesta de valor */}
      <ValueProposition />

      {/* Oferta especial */}
      <SpecialOffer />

      {/* Novedades */}
      <ProductCarousel
        title="Novedades"
        subtitle="Recién llegados a la tienda"
        viewAllLink="/products?sortBy=createdAt&sortOrder=desc"
        initialProducts={newProducts?.data || []}
      />

      {/* Testimonios de clientes */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
