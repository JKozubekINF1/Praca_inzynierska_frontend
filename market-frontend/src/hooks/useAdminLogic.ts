import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import type {
  AdminUser,
  AdminAnnouncement,
  SystemLog,
  DashboardStats,
  TabType,
  ModalState,
  PagedResult,
} from '../types/admin';

export const useAdminLogic = (activeTab: TabType) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const [data, setData] = useState<{
    users: AdminUser[];
    announcements: AdminAnnouncement[];
    logs: SystemLog[];
    stats: DashboardStats | null;
  }>({
    users: [],
    announcements: [],
    logs: [],
    stats: null,
  });

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    id: null,
    title: '',
    message: '',
  });

  useEffect(() => {
    setPage(1);
    setSearch('');
    setTotalPages(1);
  }, [activeTab]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const config = { withCredentials: true };
    const queryParams = `?pageNumber=${page}&pageSize=10&search=${encodeURIComponent(search)}`;

    try {
      if (activeTab === 'dashboard') {
        const res = await axios.get(`${API_BASE_URL}/api/admin/stats`, config);
        setData((prev) => ({ ...prev, stats: res.data }));
      } else if (activeTab === 'users') {
        const res = await axios.get<PagedResult<AdminUser>>(
          `${API_BASE_URL}/api/admin/users${queryParams}`,
          config
        );
        setData((prev) => ({ ...prev, users: res.data.items }));
        setTotalPages(res.data.totalPages);
      } else if (activeTab === 'announcements') {
        const res = await axios.get<PagedResult<AdminAnnouncement>>(
          `${API_BASE_URL}/api/admin/announcements${queryParams}`,
          config
        );
        setData((prev) => ({ ...prev, announcements: res.data.items }));
        setTotalPages(res.data.totalPages);
      } else if (activeTab === 'logs') {
        const res = await axios.get(`${API_BASE_URL}/api/admin/logs`, config);
        setData((prev) => ({ ...prev, logs: res.data }));
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error('Sesja wygasła.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, search, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const executeAction = async () => {
    if (!modal.id) return;
    setModal((prev) => ({ ...prev, isOpen: false }));
    const config = { withCredentials: true };

    try {
      if (modal.type === 'deleteUser') {
        await axios.delete(`${API_BASE_URL}/api/admin/users/${modal.id}`, config);
        toast.success('Użytkownik usunięty.');
      } else if (modal.type === 'toggleBan') {
        await axios.post(`${API_BASE_URL}/api/admin/users/${modal.id}/toggle-ban`, {}, config);
        toast.success('Status zmieniony.');
      } else if (modal.type === 'deleteAnnouncement') {
        await axios.delete(`${API_BASE_URL}/api/admin/announcements/${modal.id}`, config);
        toast.success('Ogłoszenie usunięte.');
      }
      fetchData();
    } catch (error) {
      toast.error('Błąd operacji.');
    }
  };

  const openModal = (type: ModalState['type'], id: number, title: string, message: string) => {
    setModal({ isOpen: true, type, id, title, message });
  };

  return {
    data,
    loading,
    modal,
    setModal,
    openModal,
    executeAction,
    navigate,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
  };
};
