export const ROUTES = {
  home: '/',
  auth: {
    login: '/login',
    register: '/register',
  },
  products: {
    list: '/products',
  },
  cart: '/cart',
  profile: '/profile',
  orders: {
    list: '/orders',
  },
  checkout: {
    index: '/checkout',
    success: '/checkout/success',
    failure: '/checkout/failure',
    pending: '/checkout/pending',
  },
  admin: {
    dashboard: '/admin',
    products: '/admin/products',
    categories: '/admin/categories',
    orders: '/admin/orders',
    users: '/admin/users',
    siteConfig: '/admin/site-config',
  },
} as const;

// Helpers for dynamic routes (with parameters)

export function productDetailRoute(id: string) {
  return `/products/${id}` as const;
}

export function orderDetailRoute(id: string) {
  return `/orders/${id}` as const;
}

export function productsByCategoryRoute(slug: string) {
  return `/products?category=${slug}` as const;
}

export function productsSearchRoute(term: string) {
  return `/products?search=${encodeURIComponent(term)}` as const;
}

export function productsSortNewestRoute() {
  return '/products?sortBy=createdAt&sortOrder=desc' as const;
}

export function productsFeaturedRoute() {
  return '/products?featured=true' as const;
}

export function productsOnSaleRoute() {
  return '/products?onSale=true' as const;
}

export function loginWithRedirectRoute(redirectPath: string) {
  return `/login?redirect=${redirectPath}` as const;
}

export function checkoutSuccessRoute(orderId: string) {
  return `/checkout/success?order_id=${orderId}` as const;
}

export function checkoutFailureRoute(orderId: string) {
  return `/checkout/failure?order_id=${orderId}` as const;
}
