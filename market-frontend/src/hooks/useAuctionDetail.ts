import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Announcement, AnnouncementPhoto } from '../types'; 
import { announcementService } from '../services/announcementService';

export const useAuctionDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const data = await announcementService.getById(id);
                setAnnouncement(data);

                if (data.photos && data.photos.length > 0) {
                    const mainPhoto = data.photos.find((p: AnnouncementPhoto) => p.isMain) || data.photos[0];
                    setActivePhotoUrl(mainPhoto.photoUrl);
                }
            } catch (err) {
                console.error(err);
                setError("Nie udało się pobrać ogłoszenia.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    return { 
        announcement, loading, error, activePhotoUrl, 
        setActivePhotoUrl 
    };
};