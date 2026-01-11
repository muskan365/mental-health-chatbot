import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenUtils } from '@/utils/token';
import { ApiError } from '@/types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7202';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // For localhost HTTPS with self-signed certificates
  withCredentials: false,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An error occurred',
      status: error.response?.status,
    };

    if (error.response) {
      // Server responded with error
      const data = error.response.data as any;
      apiError.message = data?.message || data?.title || error.message;
      apiError.errors = data?.errors;

      // Handle 401 - Unauthorized
      if (error.response.status === 401) {
        tokenUtils.clear();
        // Redirect to login if needed
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Request made but no response
      apiError.message = 'No response from server. Please check your connection.';
    } else {
      // Something else happened
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  }
);

export default api;
