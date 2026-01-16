import axios from 'axios';
import { API_BASE_URL } from '../config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface OrderData {
  announcementId: number;
  deliveryMethod: string;
  deliveryPointName?: string | null;
  deliveryAddress?: string | null;
}

export interface OrderHistoryItem {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  deliveryMethod: string;
  deliveryPointName?: string;
  deliveryAddress?: string;
  announcementTitle: string;
  announcementPhotoUrl?: string;
}

export const transactionService = {
  getBalance: async (): Promise<number> => {
    const response = await apiClient.get('/api/transaction/balance');
    return response.data.balance;
  },

  topUp: async (amount: number): Promise<void> => {
    await apiClient.post('/api/transaction/top-up', { amount });
  },

  buyItem: async (data: OrderData): Promise<void> => {
    await apiClient.post('/api/transaction/buy', data);
  },

  getMyOrders: async (): Promise<OrderHistoryItem[]> => {
    const response = await apiClient.get('/api/transaction/history');
    return response.data;
  },
};
