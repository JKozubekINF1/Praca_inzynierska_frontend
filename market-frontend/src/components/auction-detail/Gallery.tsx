import React from 'react';
import type { Announcement } from '../../types';
import { API_BASE_URL } from '../../config';

interface Props {
    announcement: Announcement;
    activePhotoUrl: string | null;
    setActivePhotoUrl: (url: string) => void;
}

export const Gallery: React.FC<Props> = ({ announcement, activePhotoUrl, setActivePhotoUrl }) => {
    const getLink = (path?: string) => {
        if (!path) return 'https://placehold.co/600x400';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path}`;
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center relative h-[450px]">
                {activePhotoUrl ? (
                    <img 
                        src={getLink(activePhotoUrl)} 
                        alt={announcement.title} 
                        className="w-full h-full object-contain bg-gray-900" 
                    />
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <span className="font-medium">Brak zdjęć</span>
                    </div>
                )}
                <div className="absolute top-4 left-4 bg-blue-600/90 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
                    {announcement.category}
                </div>
            </div>
            {announcement.photos && announcement.photos.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto scrollbar-hide bg-white border-t border-gray-100">
                    {announcement.photos.map((photo) => (
                        <button 
                            key={photo.id}
                            onClick={() => setActivePhotoUrl(photo.photoUrl)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                activePhotoUrl === photo.photoUrl 
                                ? 'border-blue-600 ring-2 ring-blue-100' 
                                : 'border-transparent hover:border-gray-300'
                            }`}
                        >
                            <img 
                                src={getLink(photo.photoUrl)} 
                                alt="Miniaturka" 
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};