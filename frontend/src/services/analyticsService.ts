import { api } from './api';
import { NetworkFacility, DashboardStats, AuditLog } from '../types';

export const networkService = {
  async getFacilities(params?: {
    search?: string;
    state?: string;
    district?: string;
    facilityType?: string;
  }): Promise<NetworkFacility[]> {
    const response = await api.get<NetworkFacility[]>('/network/facilities', { params });
    return response.data;
  },

  async getAmbulanceReference(): Promise<any> {
    const response = await api.get('/network/ambulance-reference');
    return response.data;
  },
};

export const analyticsService = {
  async getDashboard(): Promise<{
    stats: DashboardStats;
    bedDistribution: Record<string, { total: number; occupied: number }>;
    alerts: { id: string; type: string; title: string; message: string; time: string }[];
  }> {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  async getMetrics(): Promise<any> {
    const response = await api.get('/analytics/metrics');
    return response.data;
  },
};

export const activityService = {
  async getTimeline(): Promise<any[]> {
    const response = await api.get('/activity/timeline');
    return response.data;
  },
};
