import api from './api';
import { User, ApiEnvelope } from '@/types/api.types';

export const userService = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiEnvelope<User>>('/api/User');
    return response.data.data;
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<User> => {
    const response = await api.get<ApiEnvelope<User>>(`/api/User/${userId}`);
    return response.data.data;
  },

  // Update user profile
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiEnvelope<User>>(`/api/User/${userId}`, data);
    return response.data.data;
  },

  // Delete user account
  deleteAccount: async (userId: string): Promise<void> => {
    await api.delete(`/api/User/${userId}`);
  },
};
