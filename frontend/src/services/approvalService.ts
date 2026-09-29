import { api } from './api';
import { Approval, ApprovalStatus } from '../types';

export const approvalService = {
  async getAll(status?: ApprovalStatus): Promise<Approval[]> {
    const response = await api.get<Approval[]>('/approvals', { params: { status } });
    return response.data;
  },

  async resolve(id: string, status: 'approved' | 'rejected', approver?: string): Promise<Approval> {
    const response = await api.patch<Approval>(`/approvals/${id}/resolve`, { status, approver });
    return response.data;
  },
};
