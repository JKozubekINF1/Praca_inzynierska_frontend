import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { LoginDto, RegisterDto, User } from '../types';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (data: LoginDto) => {
    return apiClient.post('/api/auth/login', data);
  },

  register: async (data: RegisterDto) => {
    return apiClient.post('/api/auth/register', data);
  },

  logout: async () => {
    return apiClient.post('/api/auth/logout');
  },

  verify: async () => {
    return apiClient.get<{ user: User }>('/api/auth/verify');
  },

  forgotPassword: async (email: string) => {
    return apiClient.post('/api/auth/forgot-password', { email });
  },

  resetPassword: async (email: string, code: string, newPassword: string) => {
    return apiClient.post('/api/auth/reset-password', {
      email,
      code,
      newPassword,
    });
  },
};
