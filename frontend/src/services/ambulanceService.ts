import { api } from './api';
import { Ambulance, AmbulanceStatus } from '../types';

export const ambulanceService = {
  async getAll(status?: AmbulanceStatus): Promise<Ambulance[]> {
    const response = await api.get<Ambulance[]>('/ambulances', { params: { status } });
    return response.data;
  },

  async getById(id: string): Promise<Ambulance> {
    const response = await api.get<Ambulance>(`/ambulances/${id}`);
    return response.data;
  },

  async dispatch(
    id: string,
    destination: string,
    request: string,
    urgency: 'normal' | 'high' | 'critical' = 'high'
  ): Promise<Ambulance> {
    const response = await api.post<Ambulance>(`/ambulances/${id}/dispatch`, {
      destination,
      request,
      urgency,
    });
    return response.data;
  },
};
