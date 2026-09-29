import { api } from './api';
import { Task, TaskPriority, TaskStatus } from '../types';

export const taskService = {
  async getAll(params?: {
    department?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
  }): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  },

  async create(task: {
    title: string;
    description: string;
    department: string;
    assigned_employee?: string;
    priority?: TaskPriority;
    due_time?: string;
    source_workflow?: string;
  }): Promise<Task> {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}`, updates);
    return response.data;
  },
};
