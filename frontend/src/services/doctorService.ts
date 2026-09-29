import { api } from './api';
import { Doctor } from '../types';

export const doctorService = {
  async getAll(params?: { department?: string; availability?: string; shift?: string }): Promise<Doctor[]> {
    const response = await api.get<Doctor[]>('/doctors', { params });
    return response.data;
  },

  async getById(id: string): Promise<Doctor> {
    const response = await api.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },
};
