import { HomepageConfig, Product } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Server-side fetch utilities for use in generateMetadata and Server Components.
 * These functions run on the server and don't require auth tokens.
 */

export async function fetchHomepageConfig(): Promise<HomepageConfig | null> {
  try {
    const res = await fetch(`${API_URL}/site-config/homepage`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchProducts(params: {
  page?: number;
  limit?: number;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: string;
  category?: string;
}): Promise<ProductsResponse | null> {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.featured) searchParams.set('featured', 'true');
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    if (params.category) searchParams.set('category', params.category);

    const res = await fetch(`${API_URL}/products?${searchParams.toString()}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<{ id: string; name: string; slug: string; description?: string }[] | null> {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchBestSellers(limit: number = 10): Promise<Product[] | null> {
  try {
    const res = await fetch(`${API_URL}/products/best-sellers?limit=${limit}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
