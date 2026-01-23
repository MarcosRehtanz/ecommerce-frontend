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

export interface UpdateProductDto extends Partial<CreateProductDto> {
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
}

export interface HomepageConfig {
  topbar?: TopBarConfig;
  hero?: HeroConfig;
  'special-offer'?: SpecialOfferConfig;
}

// Newsletter types
export interface NewsletterSubscription {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
}
