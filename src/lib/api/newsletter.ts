import api from './axios';
import { NewsletterSubscription, PaginatedResponse } from '@/types';

export interface SubscribeDto {
  email: string;
}

export interface SubscriptionResponse {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
}

export const newsletterApi = {
  // Public endpoints
  subscribe: async (data: SubscribeDto): Promise<SubscriptionResponse> => {
    const response = await api.post<SubscriptionResponse>('/newsletter/subscribe', data);
    return response.data;
  },

  unsubscribe: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/newsletter/unsubscribe', { email });
    return response.data;
  },

  // Admin endpoints
  getAllAdmin: async (page = 1, limit = 10): Promise<PaginatedResponse<NewsletterSubscription>> => {
    const response = await api.get<PaginatedResponse<NewsletterSubscription>>('/newsletter/admin/all', {
      params: { page, limit },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/newsletter/admin/${id}`);
  },
};
