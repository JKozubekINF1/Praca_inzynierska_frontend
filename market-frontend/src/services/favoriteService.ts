import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { AnnouncementSummary } from '../types';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export interface FavoriteResponse {
    isFavorite: boolean;
    message: string;
}

export const favoriteService = {
    toggle: async (announcementId: number): Promise<FavoriteResponse> => {
        const response = await apiClient.post<FavoriteResponse>(`/api/favorites/${announcementId}`);
        return response.data;
    },

    getIds: async (): Promise<number[]> => {
        const response = await apiClient.get<number[]>('/api/favorites/ids');
        return response.data;
    },

    getList: async (): Promise<AnnouncementSummary[]> => {
        const response = await apiClient.get<AnnouncementSummary[]>('/api/favorites');
        return response.data;
    }
};