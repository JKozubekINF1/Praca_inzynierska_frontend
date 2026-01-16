import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAnnouncements } from '../../hooks/useUserAnnouncements';
import { API_BASE_URL } from '../../config';

export const UserAnnouncementsList: React.FC = () => {
  const {
    announcements,
    processingId,
    activateAnnouncement,
    renewAnnouncement,
    deleteAnnouncement,
  } = useUserAnnouncements();

  const navigate = useNavigate();

  return (
    <div className="mt-10 border-t pt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Moje ogłoszenia</h3>

      {announcements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4 text-lg">Nie masz jeszcze żadnych ogłoszeń.</p>
          <button
            onClick={() => navigate('/add-announcement')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm"
          >
            Dodaj pierwsze ogłoszenie
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => {
            const isProcessing = processingId === item.id;
            const expiresDate = new Date(item.expiresAt);
            const now = new Date();
            const isExpired = !item.isActive || expiresDate < now;
            const timeDiff = expiresDate.getTime() - now.getTime();
            const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const canRenew = !isExpired && daysLeft <= 7;

            const imageUrl = item.photoUrl
              ? item.photoUrl.startsWith('http')
                ? item.photoUrl
                : `${API_BASE_URL}${item.photoUrl}`
              : null;

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/announcements/${item.id}`)}
                className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row gap-5
                                    ${
                                      isExpired
                                        ? 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                        : 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200'
                                    }`}
              >
                <div className="w-full sm:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative border border-gray-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Brak zdjęcia
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    {isExpired ? (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                        Wygasłe
                      </span>
                    ) : (
                      <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                        Aktywne
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    <div className="text-sm text-gray-500 mb-2">
                      {item.category} • {item.location}
                    </div>

                    <div className="text-blue-600 font-bold text-xl mb-2">
                      {item.price.toLocaleString('pl-PL')} PLN
                    </div>

                    <div
                      className={`text-xs ${
                        daysLeft <= 7 && !isExpired ? 'text-orange-600 font-bold' : 'text-gray-400'
                      }`}
                    >
                      {isExpired
                        ? `Wygasło: ${expiresDate.toLocaleDateString()}`
                        : `Wygasa: ${expiresDate.toLocaleDateString()} ${
                            daysLeft > 0 ? `(za ${daysLeft} dni)` : ''
                          }`}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0 pt-2 border-t sm:border-t-0 border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-announcement/${item.id}`);
                      }}
                      className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition shadow-sm"
                    >
                      Edytuj
                    </button>
                    {isExpired ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          activateAnnouncement(item.id);
                        }}
                        disabled={isProcessing}
                        className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition shadow-sm disabled:opacity-50"
                      >
                        {isProcessing ? '...' : 'Aktywuj'}
                      </button>
                    ) : (
                      canRenew && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            renewAnnouncement(item.id);
                          }}
                          disabled={isProcessing}
                          className="px-4 py-1.5 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition shadow-sm disabled:opacity-50"
                        >
                          {isProcessing ? '...' : 'Przedłuż'}
                        </button>
                      )
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAnnouncement(item.id);
                      }}
                      disabled={isProcessing}
                      className="px-4 py-1.5 bg-white border border-red-200 text-red-600 text-sm font-medium rounded hover:bg-red-50 transition ml-auto"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
