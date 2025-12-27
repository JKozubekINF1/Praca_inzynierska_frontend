import { useState, useEffect } from 'react';
import type { AnnouncementSummary } from '../types';
import { userService } from '../services/userService';

export const useUserAnnouncements = () => {
    const [announcements, setAnnouncements] = useState<AnnouncementSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const fetchAnnouncements = async () => {
        try {
            const data = await userService.getMyAnnouncements();
            setAnnouncements(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);
    const activateAnnouncement = async (id: number) => {
        setProcessingId(id);
        try {
            await userService.activateAnnouncement(id);
            await fetchAnnouncements(); 
        } catch (err) {
            console.error("Błąd aktywacji", err);
            alert("Nie udało się aktywować ogłoszenia.");
        } finally {
            setProcessingId(null);
        }
    };
    const renewAnnouncement = async (id: number) => {
        setProcessingId(id);
        try {
            await userService.renewAnnouncement(id);
            await fetchAnnouncements();
            alert("Ogłoszenie przedłużone o 30 dni.");
        } catch (err) {
            console.error("Błąd przedłużania", err);
            alert("Nie udało się przedłużyć ogłoszenia.");
        } finally {
            setProcessingId(null);
        }
    };

    const deleteAnnouncement = async (id: number) => {
        if (!window.confirm("Czy na pewno chcesz usunąć to ogłoszenie? Tej operacji nie można cofnąć.")) {
            return;
        }

        setProcessingId(id);
        try {
            await userService.deleteAnnouncement(id);
            setAnnouncements(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error("Błąd usuwania", err);
            alert("Nie udało się usunąć ogłoszenia.");
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
        deleteAnnouncement 
    };
};