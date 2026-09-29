import { api } from './api';
import { Patient, PatientStatus } from '../types';

export const patientService = {
  async getAll(params?: {
    status?: PatientStatus | 'all';
    department?: string;
    search?: string;
  }): Promise<Patient[]> {
    const response = await api.get<Patient[]>('/patients', { params });
    return response.data;
  },

  async getById(id: string): Promise<Patient> {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  async create(patient: Partial<Patient>): Promise<Patient> {
    const response = await api.post<Patient>('/patients', patient);
    return response.data;
  },

  async update(id: string, updates: Partial<Patient>): Promise<Patient> {
    const response = await api.patch<Patient>(`/patients/${id}`, updates);
    return response.data;
  },
};
