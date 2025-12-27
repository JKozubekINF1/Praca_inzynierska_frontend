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
        deleteAnnouncement 
    } = useUserAnnouncements();
    
    const navigate = useNavigate();

    return (
        <div className="mt-10 border-t pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Moje ogłoszenia</h3>
            
            {announcements.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">Nie masz jeszcze żadnych ogłoszeń.</p>
                    <button onClick={() => navigate('/add-announcement')} className="text-blue-600 font-bold hover:underline">
                        Dodaj pierwsze ogłoszenie
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map(item => {
                        const isProcessing = processingId === item.id;
                        const expiresDate = new Date(item.expiresAt);
                        const now = new Date();
                        const isExpired = !item.isActive || expiresDate < now;
                        const timeDiff = expiresDate.getTime() - now.getTime();
                        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        const canRenew = !isExpired && daysLeft <= 7;
                        const imageUrl = item.photoUrl 
                            ? (item.photoUrl.startsWith('http') ? item.photoUrl : `${API_BASE_URL}${item.photoUrl}`)
                            : null;

                        return (
                            <div key={item.id} className={`p-4 rounded-lg border flex flex-col md:flex-row gap-4 ${isExpired ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                                <div className="w-full md:w-32 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Brak zdjęcia</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h4 className="font-bold text-lg text-black">{item.title}</h4>
                                        {isExpired ? (
                                            <span className="text-xs font-bold text-red-600 uppercase bg-red-100 px-2 py-0.5 rounded border border-red-200">Wygasłe</span>
                                        ) : (
                                            <span className="text-xs font-bold text-green-600 uppercase bg-green-100 px-2 py-0.5 rounded border border-green-200">Aktywne</span>
                                        )}
                                    </div>
                                    
                                    <div className="text-sm text-gray-500 mb-1">
                                        {item.category} • {item.location}
                                    </div>

                                    <div className={`text-sm ${daysLeft <= 7 && !isExpired ? 'text-orange-600 font-bold' : 'text-gray-500'}`}>
                                        Wygasa: {expiresDate.toLocaleDateString()} 
                                        {!isExpired && daysLeft > 0 && <span className="ml-1">(zostało {daysLeft} dni)</span>}
                                    </div>

                                    <div className="text-blue-600 font-bold mt-2 text-lg">
                                        {item.price.toLocaleString('pl-PL')} PLN
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-2 justify-center min-w-[140px]">
                                    <button 
                                        onClick={() => navigate(`/announcements/${item.id}`)} 
                                        className="flex-1 text-sm bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded border border-gray-300 font-medium transition"
                                    >
                                        Podgląd
                                    </button>
                                    {isExpired ? (
                                        <button 
                                            onClick={() => activateAnnouncement(item.id)} 
                                            disabled={isProcessing}
                                            className="flex-1 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium shadow-sm disabled:opacity-50 transition"
                                        >
                                            {isProcessing ? '...' : 'Aktywuj'}
                                        </button>
                                    ) : (
                                        canRenew && (
                                            <button 
                                                onClick={() => renewAnnouncement(item.id)} 
                                                disabled={isProcessing}
                                                className="flex-1 text-sm bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded font-medium shadow-sm disabled:opacity-50 transition"
                                            >
                                                {isProcessing ? '...' : 'Przedłuż'}
                                            </button>
                                        )
                                    )}

                                    <button 
                                        onClick={() => deleteAnnouncement(item.id)} 
                                        disabled={isProcessing}
                                        className="flex-1 text-sm bg-white hover:bg-red-50 text-red-600 px-3 py-2 rounded border border-red-200 font-medium transition"
                                    >
                                        Usuń
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};