import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteService } from '../services/favoriteService';
import type { AnnouncementSummary } from '../types';
import { API_BASE_URL } from '../config';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { useFavorites } from '../hooks/useFavorites';

const FavoritesPage: React.FC = () => {
  const [favoritesDetails, setFavoritesDetails] = useState<AnnouncementSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { favoriteIds } = useFavorites();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await favoriteService.getList();
        setFavoritesDetails(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  const visibleFavorites = favoritesDetails.filter((item) => favoriteIds.includes(item.id));

  if (loading) return <div className="p-10 text-center">Ładowanie ulubionych...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Obserwowane ogłoszenia</h1>

      {visibleFavorites.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg mb-4">Nie masz jeszcze obserwowanych ogłoszeń.</p>
          <button
            onClick={() => navigate('/search')}
            className="text-blue-600 font-bold hover:underline"
          >
            Przeglądaj ogłoszenia
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleFavorites.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/announcements/${item.id}`)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden group relative"
            >
              <div className="aspect-[4/3] bg-gray-200 relative">
                {item.photoUrl ? (
                  <img
                    src={
                      item.photoUrl.startsWith('http')
                        ? item.photoUrl
                        : `${API_BASE_URL}${item.photoUrl}`
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Brak zdjęcia
                  </div>
                )}

                <div className="absolute top-2 right-2">
                  <FavoriteButton announcementId={item.id} />
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate mb-1">{item.title}</h3>
                <p className="text-blue-600 font-bold text-lg">
                  {item.price.toLocaleString('pl-PL')} PLN
                </p>
                <div className="flex justify-between text-xs text-gray-500 mt-3">
                  <span>{item.location}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
