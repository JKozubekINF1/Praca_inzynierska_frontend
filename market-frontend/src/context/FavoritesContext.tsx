import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
    favoriteIds: number[];
    toggleFavorite: (id: number) => Promise<void>;
    isFavorite: (id: number) => boolean;
    loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavoritesIds = useCallback(async () => {
        if (!isAuthenticated) {
            setFavoriteIds([]);
            setLoading(false);
            return;
        }
        try {
            const ids = await favoriteService.getIds();
            setFavoriteIds(ids);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchFavoritesIds();
    }, [fetchFavoritesIds]);

    const toggleFavorite = async (announcementId: number) => {
        if (!isAuthenticated) {
            toast.error("Musisz być zalogowany.");
            return;
        }

        const isCurrentlyFavorite = favoriteIds.includes(announcementId);
        setFavoriteIds(prev => 
            isCurrentlyFavorite 
                ? prev.filter(id => id !== announcementId)
                : [...prev, announcementId]
        );

        try {
            const response = await favoriteService.toggle(announcementId);
            toast.success(response.message);
        } catch (error) {
            toast.error("Błąd połączenia.");
            setFavoriteIds(prev => 
                isCurrentlyFavorite 
                    ? [...prev, announcementId]
                    : prev.filter(id => id !== announcementId)
            );
        }
    };

    const isFavorite = (id: number) => favoriteIds.includes(id);

    return (
        <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, loading }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within FavoritesProvider');
    }
    return context;
};