import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { CreateAnnouncementDto, Announcement, SearchResponse } from '../types';

export const announcementService = {
  getById: async (id: string | number) => {
    const response = await axios.get<Announcement>(`${API_BASE_URL}/api/announcements/${id}`);
    return response.data;
  },
  create: async (data: CreateAnnouncementDto, photos: File[]) => {
    const formData = new FormData();

    formData.append('Title', data.title);
    formData.append('Description', data.description);
    formData.append('Price', data.price.toString());
    formData.append('Category', data.category);
    formData.append('PhoneNumber', data.phoneNumber);
    formData.append('ContactPreference', data.contactPreference);
    formData.append('Location', data.location);

    if (data.latitude) formData.append('Latitude', data.latitude.toString().replace(',', '.'));
    if (data.longitude) formData.append('Longitude', data.longitude.toString().replace(',', '.'));

    if (photos && photos.length > 0) {
      photos.forEach((file) => {
        formData.append('Photos', file);
      });
    }

    if (data.features && data.features.length > 0) {
      data.features.forEach((f) => formData.append('Features', f));
    }

    if (data.category === 'Pojazd' && data.vehicleDetails) {
      const v = data.vehicleDetails;
      Object.keys(v).forEach((key) => {
        const value = v[key as keyof typeof v];
        if (value !== undefined && value !== null && value !== '') {
          const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
          formData.append(`VehicleDetails.${pascalKey}`, value.toString());
        }
      });
    } else if (data.category === 'Część' && data.partDetails) {
      const p = data.partDetails;
      Object.keys(p).forEach((key) => {
        const value = p[key as keyof typeof p];
        if (value !== undefined && value !== null && value !== '') {
          const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
          formData.append(`PartDetails.${pascalKey}`, value.toString());
        }
      });
    }

    const response = await axios.post(`${API_BASE_URL}/api/Announcements`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  update: async (id: number, data: CreateAnnouncementDto, photos: File[]) => {
    const formData = new FormData();

    formData.append('Title', data.title);
    formData.append('Description', data.description);
    formData.append('Price', data.price.toString());
    formData.append('Category', data.category);
    formData.append('PhoneNumber', data.phoneNumber);
    formData.append('ContactPreference', data.contactPreference);
    formData.append('Location', data.location);

    if (data.latitude) formData.append('Latitude', data.latitude.toString().replace(',', '.'));
    if (data.longitude) formData.append('Longitude', data.longitude.toString().replace(',', '.'));

    if (photos && photos.length > 0) {
      photos.forEach((file) => formData.append('Photos', file));
    }

    if (data.features && data.features.length > 0) {
      data.features.forEach((f) => formData.append('Features', f));
    }

    if (data.category === 'Pojazd' && data.vehicleDetails) {
      const v = data.vehicleDetails;
      Object.keys(v).forEach((key) => {
        const value = v[key as keyof typeof v];
        if (value !== undefined && value !== null) {
          const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
          formData.append(`VehicleDetails.${pascalKey}`, value.toString());
        }
      });
    } else if (data.category === 'Część' && data.partDetails) {
      const p = data.partDetails;
      Object.keys(p).forEach((key) => {
        const value = p[key as keyof typeof p];
        if (value !== undefined && value !== null) {
          const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
          formData.append(`PartDetails.${pascalKey}`, value.toString());
        }
      });
    }

    const response = await axios.put(`${API_BASE_URL}/api/Announcements/${id}`, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  search: async (params: any) => {
    const response = await axios.get<SearchResponse>(`${API_BASE_URL}/api/Announcements/search`, {
      params: params,
      withCredentials: true,
    });
    return response.data;
  },

  getUserAnnouncements: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/Announcements/user/me/announcements`, {
      withCredentials: true,
    });
    return response.data;
  },

  activate: async (id: number) => {
    await axios.post(
      `${API_BASE_URL}/api/Announcements/${id}/activate`,
      {},
      { withCredentials: true }
    );
  },

  renew: async (id: number) => {
    await axios.post(
      `${API_BASE_URL}/api/Announcements/${id}/renew`,
      {},
      { withCredentials: true }
    );
  },

  delete: async (id: number) => {
    await axios.delete(`${API_BASE_URL}/api/Announcements/${id}`, { withCredentials: true });
  },
};
