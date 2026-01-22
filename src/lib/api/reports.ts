import api from './axios';

export type ReportPeriod = 'daily' | 'weekly' | 'monthly';

export interface ReportsQueryParams {
  startDate?: string;
  endDate?: string;
  period?: ReportPeriod;
}

export interface DashboardStats {
  products: {
    total: number;
    active: number;
    lowStock: number;
  };
  users: {
    total: number;
  };
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    inProgress: number;
  };
  revenue: {
    total: number;
  };
}

export interface SalesDataPoint {
  date: string;
  orders: number;
  sales: number;
}

export interface SalesReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  summary: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  data: SalesDataPoint[];
}

export interface TopProduct {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  imageData?: string;
  totalSold: number;
  totalRevenue: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  price: number;
  imageUrl?: string;
  imageData?: string;
}

export interface RecentOrder {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: {
    quantity: number;
  }[];
}

export const reportsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },

  getSalesReport: async (params: ReportsQueryParams = {}): Promise<SalesReport> => {
    const response = await api.get('/reports/sales', { params });
    return response.data;
  },

  getTopProducts: async (limit: number = 10): Promise<TopProduct[]> => {
    const response = await api.get('/reports/top-products', { params: { limit } });
    return response.data;
  },

  getLowStockProducts: async (threshold: number = 5): Promise<LowStockProduct[]> => {
    const response = await api.get('/reports/low-stock', { params: { threshold } });
    return response.data;
  },

  getRecentOrders: async (limit: number = 5): Promise<RecentOrder[]> => {
    const response = await api.get('/reports/recent-orders', { params: { limit } });
    return response.data;
  },

  exportOrders: async (params: ReportsQueryParams = {}): Promise<Blob> => {
    const response = await api.get('/reports/export/orders', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  exportSalesReport: async (params: ReportsQueryParams = {}): Promise<Blob> => {
    const response = await api.get('/reports/export/sales', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
