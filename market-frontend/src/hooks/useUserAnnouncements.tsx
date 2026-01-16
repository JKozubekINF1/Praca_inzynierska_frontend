import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { announcementService } from '../services/announcementService';
import type { AnnouncementSummary } from '../types';

export const useUserAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementService.getUserAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error(error);
      toast.error('Nie udało się pobrać listy ogłoszeń.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const activateAnnouncement = async (id: number) => {
    setProcessingId(id);
    const toastId = toast.loading('Aktywowanie ogłoszenia...');
    try {
      await announcementService.activate(id);
      toast.success('Ogłoszenie aktywowane!', { id: toastId });
      await fetchAnnouncements();
    } catch (error) {
      console.error('Błąd aktywacji', error);
      toast.error('Błąd podczas aktywacji.', { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  const renewAnnouncement = async (id: number) => {
    setProcessingId(id);
    const toastId = toast.loading('Przedłużanie ogłoszenia...');
    try {
      await announcementService.renew(id);
      toast.success('Ogłoszenie przedłużone o 30 dni!', { id: toastId });
      await fetchAnnouncements();
    } catch (error: any) {
      console.error('Błąd przedłużania', error);
      const msg = error.response?.data?.message || 'Błąd podczas przedłużania.';
      toast.error(msg, { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  const deleteAnnouncement = (id: number) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <div>
            <strong className="block text-gray-900">Usunąć ogłoszenie?</strong>
            <span className="text-sm text-gray-500">Tej operacji nie można cofnąć.</span>
          </div>
          <div className="flex justify-end gap-3 mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition"
            >
              Anuluj
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                executeDelete(id);
              }}
              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition shadow-sm"
            >
              Usuń
            </button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        position: 'top-center',
        style: {
          minWidth: '300px',
          padding: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      }
    );
  };

  const executeDelete = async (id: number) => {
    setProcessingId(id);
    const toastId = toast.loading('Usuwanie...');
    try {
      await announcementService.delete(id);
      toast.success('Ogłoszenie usunięte.', { id: toastId });
      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Błąd usuwania', error);
      toast.error('Nie udało się usunąć ogłoszenia.', { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  return {
    announcements,
    loading,
    processingId,
    activateAnnouncement,
    renewAnnouncement,
    deleteAnnouncement,
  };
};
