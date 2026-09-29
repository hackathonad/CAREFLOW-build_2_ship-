import { api } from './api';
import { Appointment, AppointmentStatus } from '../types';

export const appointmentService = {
  async getAll(params?: { status?: AppointmentStatus | 'all'; date?: string }): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>('/appointments', { params });
    return response.data;
  },

  async create(data: {
    patient_name: string;
    doctor_name?: string;
    department?: string;
    date?: string;
    time?: string;
    type?: string;
    notes?: string;
  }): Promise<Appointment> {
    const response = await api.post<Appointment>('/appointments', data);
    return response.data;
  },
};
