import type { Metadata } from 'next';
import { fetchProduct, fetchHomepageConfig } from '@/lib/api/server';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [product, config] = await Promise.all([
    fetchProduct(id),
    fetchHomepageConfig(),
  ]);

  const storeName = config?.general?.storeName || 'Mi Tienda';

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  const description = product.description.substring(0, 160);

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | ${storeName}`,
      description,
      type: 'website',
    },
  };
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
