import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import type { SearchResultItem, Announcement } from '../../types';
import { FavoriteButton } from './FavoriteButton';

interface Props {
  announcement: SearchResultItem | Announcement | any;
}

export const AnnouncementCard: React.FC<Props> = ({ announcement }) => {
  const navigate = useNavigate();

  if (!announcement) return null;
  const rawId = announcement.id || announcement.objectID;
  const id = Number(rawId);

  const getImageUrl = (url?: string) => {
    if (!url) return 'https://placehold.co/600x400?text=Brak+Zdjecia';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const formatDate = (dateVal?: string | number) => {
    if (!dateVal) return '';
    try {
      return new Date(dateVal).toLocaleDateString();
    } catch (e) {
      return '';
    }
  };

  return (
    <div
      onClick={() => navigate(`/announcements/${id}`)}
      className="bg-white border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col h-full group relative"
    >
      <div className="h-48 bg-gray-100 w-full relative overflow-hidden">
        <img
          src={getImageUrl(announcement.photoUrl)}
          alt={announcement.title || 'Ogłoszenie'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Brak+Zdjecia';
          }}
        />
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton announcementId={id} />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1">
          {announcement.title || 'Bez tytułu'}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          {announcement.location || 'Polska'} • {announcement.category}
        </p>
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-blue-600 font-bold text-xl">
            {announcement.price?.toLocaleString('pl-PL')} PLN
          </span>
          <span className="text-xs text-gray-400">
            {announcement.year ? `${announcement.year} r.` : formatDate(announcement.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};
