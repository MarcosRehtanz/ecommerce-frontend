// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  imageData?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  featured: boolean;
  stock: number;
  imageUrl?: string;
  imageData?: string;
  isActive: boolean;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  imageData?: string;
}

export interface UpdateProductDto extends Partial<Omit<CreateProductDto, 'imageData'>> {
  isActive?: boolean;
  imageData?: string | null;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

// Order types
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Error type
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Site Configuration types
export interface SiteConfig {
  id: string;
  key: string;
  value: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TopBarConfig {
  message: string;
  isVisible: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
  badge?: string;
  trustIndicators?: { value: string; label: string }[];
  floatingBadge?: string;
  priceOriginal?: string;
  priceDiscounted?: string;
  isVisible: boolean;
}

export interface SpecialOfferConfig {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  discountText?: string;
  discountSubtext?: string;
  endDate?: string;
  isVisible: boolean;
  backgroundColor?: string;
  trustText?: string;
}

export interface GeneralConfig {
  storeName: string;
  storeDescription?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  faviconUrl?: string;
  ogImage?: string;
  keywords?: string;
  titleSuffix?: string;
}

export interface TestimonialsConfig {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  isVisible: boolean;
  items: {
    name: string;
    rating: number;
    text: string;
    product: string;
  }[];
  metrics?: {
    averageRating: string;
    totalCustomers: string;
    recommendRate: string;
    averageRatingLabel?: string;
    totalCustomersLabel?: string;
    recommendRateLabel?: string;
  };
}

export interface ValuePropositionConfig {
  sectionLabel?: string;
  title?: string;
  isVisible: boolean;
  items: {
    icon: string;
    title: string;
    description: string;
    colorScheme: 'orchid' | 'jade';
  }[];
}

export interface TrustBarConfig {
  isVisible: boolean;
  items: {
    icon: string;
    text: string;
  }[];
}

export interface ProductCarouselsConfig {
  bestSellers?: { title: string; subtitle?: string; isVisible?: boolean };
  newProducts?: { title: string; subtitle?: string; isVisible?: boolean };
}

export interface CategoryGridConfig {
  sectionLabel?: string;
  title?: string;
  isVisible: boolean;
}

export interface NewsletterConfig {
  badge?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  successTitle?: string;
  successMessage?: string;
  trustText?: string;
  benefits?: string[];
  isVisible: boolean;
}

export interface HomepageConfig {
  general?: GeneralConfig;
  topbar?: TopBarConfig;
  hero?: HeroConfig;
  'special-offer'?: SpecialOfferConfig;
  testimonials?: TestimonialsConfig;
  'value-proposition'?: ValuePropositionConfig;
  'trust-bar'?: TrustBarConfig;
  'product-carousels'?: ProductCarouselsConfig;
  newsletter?: NewsletterConfig;
  'category-grid'?: CategoryGridConfig;
}

// Newsletter types
export interface NewsletterSubscription {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
}
