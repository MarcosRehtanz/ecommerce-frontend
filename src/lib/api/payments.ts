import api from './axios';

export interface CreatePreferenceRequest {
  orderId: string;
}

export interface PreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

export interface PaymentStatusResponse {
  id: string;
  status: string;
  paymentStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  paymentId: string | null;
  mercadoPagoId: string | null;
}

export interface AdminSyncResponse {
  success: boolean;
  message: string;
  paymentStatus?: string;
  orderStatus?: string;
}

export const paymentsApi = {
  createPreference: async (data: CreatePreferenceRequest): Promise<PreferenceResponse> => {
    const response = await api.post<PreferenceResponse>('/payments/create-preference', data);
    return response.data;
  },

  getPaymentStatus: async (orderId: string): Promise<PaymentStatusResponse> => {
    const response = await api.get<PaymentStatusResponse>(`/payments/${orderId}`);
    return response.data;
  },

  // Admin endpoints
  adminSyncPayment: async (orderId: string, paymentId: string): Promise<AdminSyncResponse> => {
    const response = await api.post<AdminSyncResponse>(`/payments/admin/sync/${orderId}`, { paymentId });
    return response.data;
  },

  adminMarkAsPaid: async (orderId: string, paymentId?: string): Promise<AdminSyncResponse> => {
    const response = await api.post<AdminSyncResponse>(`/payments/admin/mark-paid/${orderId}`, { paymentId });
    return response.data;
  },
};
