import api from './axios';
import { SiteConfig, HomepageConfig } from '@/types';

export interface CreateSiteConfigDto {
  key: string;
  value: any;
  isActive?: boolean;
}

export interface UpdateSiteConfigDto {
  value?: any;
  isActive?: boolean;
}

export const siteConfigApi = {
  // Public endpoints
  getHomepage: async (): Promise<HomepageConfig> => {
    const response = await api.get<HomepageConfig>('/site-config/homepage');
    return response.data;
  },

  getByKey: async (key: string): Promise<SiteConfig> => {
    const response = await api.get<SiteConfig>(`/site-config/${key}`);
    return response.data;
  },

  // Admin endpoints
  getAllAdmin: async (): Promise<SiteConfig[]> => {
    const response = await api.get<SiteConfig[]>('/site-config/admin/all');
    return response.data;
  },

  create: async (data: CreateSiteConfigDto): Promise<SiteConfig> => {
    const response = await api.post<SiteConfig>('/site-config', data);
    return response.data;
  },

  update: async (key: string, data: UpdateSiteConfigDto): Promise<SiteConfig> => {
    const response = await api.put<SiteConfig>(`/site-config/${key}`, data);
    return response.data;
  },

  delete: async (key: string): Promise<void> => {
    await api.delete(`/site-config/${key}`);
  },
};
