import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { UserDto, ChangePasswordDto, AnnouncementSummary } from '../types';

export const userService = {
    getProfile: async () => {
        const response = await axios.get<UserDto>(`${API_BASE_URL}/api/Users/me`, {
            withCredentials: true
        });
        return response.data;
    },

    updateProfile: async (data: UserDto) => {
        const response = await axios.put<{ message: string }>(`${API_BASE_URL}/api/Users/me`, data, {
            withCredentials: true
        });
        return response.data;
    },

    changePassword: async (data: ChangePasswordDto) => {
        const response = await axios.put<{ message: string }>(`${API_BASE_URL}/api/Users/me/password`, data, {
            withCredentials: true
        });
        return response.data;
    },

    getMyAnnouncements: async () => {
        const response = await axios.get<AnnouncementSummary[]>(`${API_BASE_URL}/api/Announcements/user/me/announcements`, {
            withCredentials: true
        });
        return response.data;
    },

    activateAnnouncement: async (id: number) => {
        const response = await axios.post<{ message: string }>(`${API_BASE_URL}/api/Announcements/${id}/activate`, {}, {
            withCredentials: true
        });
        return response.data;
    },

    renewAnnouncement: async (id: number) => {
        const response = await axios.post<{ message: string }>(`${API_BASE_URL}/api/Announcements/${id}/renew`, {}, {
            withCredentials: true
        });
        return response.data;
    },
    
    deleteAnnouncement: async (id: number) => {
        const response = await axios.delete(`${API_BASE_URL}/api/Announcements/${id}`, {
            withCredentials: true
        });
        return response.data;
    }
};