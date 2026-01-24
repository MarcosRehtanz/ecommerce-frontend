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
