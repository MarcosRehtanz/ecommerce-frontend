'use client';

import {
  HeroSection,
  SocialProof,
  CategoryGrid,
  ProductCarousel,
  ValueProposition,
  SpecialOffer,
  Newsletter,
} from '@/components/home';

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Primera impresión */}
      <HeroSection />

      {/* Social Proof - Generar confianza */}
      <SocialProof />

      {/* Categorías Destacadas */}
      <CategoryGrid />

      {/* Productos más vendidos */}
      <ProductCarousel
        title="Los más vendidos"
        subtitle="Lo que otros están comprando"
        viewAllLink="/products?sortBy=price&sortOrder=desc"
        queryParams={{ sortBy: 'price', sortOrder: 'desc' }}
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
        queryParams={{ sortBy: 'createdAt', sortOrder: 'desc' }}
      />

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
