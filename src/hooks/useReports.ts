import { useQuery, useMutation } from '@tanstack/react-query';
import { reportsApi, ReportsQueryParams } from '@/lib/api/reports';
import { notifications } from '@mantine/notifications';

export const reportKeys = {
  all: ['reports'] as const,
  dashboard: () => [...reportKeys.all, 'dashboard'] as const,
  sales: (params: ReportsQueryParams) => [...reportKeys.all, 'sales', params] as const,
  topProducts: (limit: number) => [...reportKeys.all, 'top-products', limit] as const,
  lowStock: (threshold: number) => [...reportKeys.all, 'low-stock', threshold] as const,
  recentOrders: (limit: number) => [...reportKeys.all, 'recent-orders', limit] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: reportKeys.dashboard(),
    queryFn: () => reportsApi.getDashboardStats(),
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useSalesReport(params: ReportsQueryParams = {}) {
  return useQuery({
    queryKey: reportKeys.sales(params),
    queryFn: () => reportsApi.getSalesReport(params),
  });
}

export function useTopProducts(limit: number = 10) {
  return useQuery({
    queryKey: reportKeys.topProducts(limit),
    queryFn: () => reportsApi.getTopProducts(limit),
  });
}

export function useLowStockProducts(threshold: number = 5) {
  return useQuery({
    queryKey: reportKeys.lowStock(threshold),
    queryFn: () => reportsApi.getLowStockProducts(threshold),
  });
}

export function useRecentOrders(limit: number = 5) {
  return useQuery({
    queryKey: reportKeys.recentOrders(limit),
    queryFn: () => reportsApi.getRecentOrders(limit),
  });
}

export function useExportOrders() {
  return useMutation({
    mutationFn: (params: ReportsQueryParams = {}) => reportsApi.exportOrders(params),
    onSuccess: (blob) => {
      downloadBlob(blob, `orders-${new Date().toISOString().split('T')[0]}.csv`);
      notifications.show({
        title: 'Exportacion exitosa',
        message: 'El archivo CSV se ha descargado',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo exportar los pedidos',
        color: 'red',
      });
    },
  });
}

export function useExportSalesReport() {
  return useMutation({
    mutationFn: (params: ReportsQueryParams = {}) => reportsApi.exportSalesReport(params),
    onSuccess: (blob) => {
      downloadBlob(blob, `sales-report-${new Date().toISOString().split('T')[0]}.csv`);
      notifications.show({
        title: 'Exportacion exitosa',
        message: 'El reporte de ventas se ha descargado',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'No se pudo exportar el reporte',
        color: 'red',
      });
    },
  });
}

// Helper function to download blob as file
function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
