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

      {/* Productos destacados */}
      <ProductCarousel
        title="Los más populares"
        subtitle="Lo que otros están eligiendo"
        viewAllLink="/products"
        queryParams={{ featured: true }}
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
