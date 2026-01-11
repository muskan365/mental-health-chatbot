import api from './api';
import { LoginRequest, RegisterRequest, AuthResponseEnvelope } from '@/types/api.types';
import { tokenUtils } from '@/utils/token';

export const authService = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponseEnvelope['data']> => {
    const response = await api.post<AuthResponseEnvelope>('/api/Auth/register', data);
    const payload = response.data.data;

    // Store token if provided
    if ((payload as any).token) {
      tokenUtils.setToken((payload as any).token);
    }
    tokenUtils.setUser({
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    });
    tokenUtils.setUserId(payload.userId);

    return payload;
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponseEnvelope['data']> => {
    const response = await api.post<AuthResponseEnvelope>('/api/Auth/login', data);
    const payload = response.data.data;

    if ((payload as any).token) {
      tokenUtils.setToken((payload as any).token);
    }
    tokenUtils.setUser({
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    });
    tokenUtils.setUserId(payload.userId);

    return payload;
  },

  // Logout user
  logout: () => {
    tokenUtils.clear();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!tokenUtils.getToken() || !!tokenUtils.getUser();
  },

  // Get current user
  getCurrentUser: () => {
    return tokenUtils.getUser();
  },
};
