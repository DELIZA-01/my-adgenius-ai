import { apiClient } from './client';
import { HealthStatus } from '../types';

export const getBackendHealth = async (): Promise<HealthStatus> => {
  const response = await apiClient.get<HealthStatus>('/health');
  return response.data;
};
