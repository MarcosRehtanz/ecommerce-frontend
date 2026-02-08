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
import { fetchProducts, fetchCategories, fetchBestSellers, fetchHomepageConfig } from '@/lib/api/server';
import { ROUTES, productsSortNewestRoute } from '@/lib/routes';

export default async function HomePage() {
  // Fetch data en paralelo en el servidor (ISR con revalidate de 60s)
  const [bestSellers, newProducts, categories, homepageConfig] = await Promise.all([
    fetchBestSellers(10),
    fetchProducts({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
    fetchCategories(),
    fetchHomepageConfig(),
  ]);

  const carouselsConfig = homepageConfig?.['product-carousels'];
  const showBestSellers = carouselsConfig?.bestSellers?.isVisible !== false;
  const showNewProducts = carouselsConfig?.newProducts?.isVisible !== false;

  return (
    <>
      {/* Hero Section - Primera impresión */}
      <HeroSection config={homepageConfig?.hero} />

      {/* Barra de confianza + Categorías - fondo oscuro continuo */}
      <div style={{ backgroundColor: 'var(--deep-ink, #0F172A)' }}>
        <TrustBar config={homepageConfig?.['trust-bar']} />
        <CategoryGrid initialCategories={categories || []} config={homepageConfig?.['category-grid']} />
      </div>

      {/* Productos más vendidos */}
      {showBestSellers && (
        <ProductCarousel
          title={carouselsConfig?.bestSellers?.title || 'Los más vendidos'}
          subtitle={carouselsConfig?.bestSellers?.subtitle || 'Lo que otros están comprando'}
          viewAllLink={ROUTES.products.list}
          initialProducts={bestSellers || []}
        />
      )}

      {/* Propuesta de valor */}
      <ValueProposition config={homepageConfig?.['value-proposition']} />

      {/* Oferta especial */}
      <SpecialOffer config={homepageConfig?.['special-offer']} />

      {/* Novedades */}
      {showNewProducts && (
        <ProductCarousel
          title={carouselsConfig?.newProducts?.title || 'Novedades'}
          subtitle={carouselsConfig?.newProducts?.subtitle || 'Recién llegados a la tienda'}
          viewAllLink={productsSortNewestRoute()}
          initialProducts={newProducts?.data || []}
        />
      )}

      {/* Testimonios de clientes */}
      <Testimonials config={homepageConfig?.testimonials} />

      {/* Newsletter */}
      <Newsletter config={homepageConfig?.newsletter} />
    </>
  );
}
