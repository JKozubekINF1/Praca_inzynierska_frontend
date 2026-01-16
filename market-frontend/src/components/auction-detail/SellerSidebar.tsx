import React from 'react';
import type { Announcement } from '../../types';
import MapComponent from '../common/MapComponent';

interface Props {
  announcement: Announcement;
  onChatClick: () => void;
}

export const SellerSidebar: React.FC<Props> = ({ announcement, onChatClick }) => {
  return (
    <div className="sticky top-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
          {announcement.title}
        </h1>
        <div className="text-sm text-gray-500 mb-6">
          {announcement.vehicleDetails?.year ? `${announcement.vehicleDetails.year} • ` : ''}{' '}
          {announcement.category}
        </div>

        <div className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
          {announcement.price.toLocaleString('pl-PL')}{' '}
          <span className="text-xl font-medium text-gray-500">PLN</span>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 group">
            <span className="group-hover:hidden">Pokaż numer</span>
            <span className="hidden group-hover:inline">{announcement.phoneNumber}</span>
          </button>
          <button
            onClick={onChatClick}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
          >
            Napisz wiadomość
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Sprzedawca
        </h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md">
            {announcement.user?.username.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">
              {announcement.user?.username || 'Użytkownik'}
            </p>
            <p className="text-sm text-gray-500">Osoba prywatna</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 text-sm text-gray-600 space-y-4">
          <div className="flex items-center gap-2 font-medium text-gray-800">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {announcement.location}
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200 h-64">
            <MapComponent
              lat={announcement.latitude}
              lng={announcement.longitude}
              locationName={announcement.location}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
