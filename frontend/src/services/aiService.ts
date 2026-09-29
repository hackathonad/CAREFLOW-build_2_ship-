import { api } from './api';
import { CommandProcessingResult } from '../types';

export const aiService = {
  async sendCommand(message: string, execute: boolean = true): Promise<CommandProcessingResult> {
    const response = await api.post<CommandProcessingResult>('/ai/command', {
      message,
      execute,
    });
    return response.data;
  },
};
