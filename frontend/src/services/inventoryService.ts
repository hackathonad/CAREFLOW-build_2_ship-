import { api } from './api';
import { InventoryItem, InventoryStatus } from '../types';

export const inventoryService = {
  async getAll(params?: { category?: string; status?: InventoryStatus | 'all'; search?: string }): Promise<InventoryItem[]> {
    const response = await api.get<InventoryItem[]>('/inventory', { params });
    return response.data;
  },

  async getById(id: string): Promise<InventoryItem> {
    const response = await api.get<InventoryItem>(`/inventory/${id}`);
    return response.data;
  },

  async restock(id: string, quantity: number): Promise<InventoryItem> {
    const response = await api.post<InventoryItem>(`/inventory/${id}/restock`, { quantity });
    return response.data;
  },
};
