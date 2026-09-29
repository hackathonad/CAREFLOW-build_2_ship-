import { api } from './api';
import { Bed, Ward, Room, BedStatus } from '../types';

export const bedService = {
  async getBeds(params?: { wardId?: string; status?: BedStatus }): Promise<Bed[]> {
    const response = await api.get<Bed[]>('/beds', { params });
    return response.data;
  },

  async getWards(): Promise<Ward[]> {
    const response = await api.get<Ward[]>('/beds/wards');
    return response.data;
  },

  async getRooms(wardId?: string): Promise<Room[]> {
    const response = await api.get<Room[]>('/beds/rooms', { params: { wardId } });
    return response.data;
  },

  async updateBedStatus(id: string, status: BedStatus, patientName?: string): Promise<Bed> {
    const response = await api.patch<Bed>(`/beds/${id}/status`, { status, patientName });
    return response.data;
  },
};
