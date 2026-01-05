import React, { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import type { Announcement } from '../../types';
import { API_BASE_URL } from '../../config';

interface Props {
  announcement: Announcement;
}

export const Gallery: React.FC<Props> = ({ announcement }) => {
  const [items, setItems] = useState<any[]>([]);

  
  const getFullUrl = (path?: string): string => {
    if (!path) return 'https://placehold.co/800x600?text=Brak+zdjęcia';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    if (!announcement.photos || announcement.photos.length === 0) {
      setItems([
        {
          original: 'https://placehold.co/800x600?text=Brak+zdjęć',
          thumbnail: 'https://placehold.co/150x100?text=Brak+zdjęć',
          description: 'Brak zdjęć dla tego ogłoszenia',
        },
      ]);
      return;
    }

    const galleryItems = announcement.photos.map((photo) => ({
      original: getFullUrl(photo.photoUrl),
      thumbnail: getFullUrl(photo.photoUrl),
      originalAlt: `${announcement.title} - ${announcement.category}`,
      thumbnailAlt: 'Miniaturka',
      
      
    }));

    setItems(galleryItems);
  }, [announcement]);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {}
      <div className="absolute top-6 left-6 z-10 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider shadow-lg">
        {announcement.category}
      </div>

      {}
      <div className="relative">
        {items.length > 0 ? (
          <ImageGallery
            items={items}
            showPlayButton={true}           
            showFullscreenButton={true}      
            showNav={true}                   
            showThumbnails={true}            
            thumbnailPosition="bottom"       
            useBrowserFullscreen={true}
            lazyLoad={true}                  
            slideDuration={450}
            slideInterval={4000}
            additionalClass="auction-gallery"
            
            autoPlay={false}
            
            showIndex={true}
            renderItem={(item) => (
              <div className="image-gallery-image">
                <img
                  src={item.original}
                  alt={item.originalAlt}
                  className="w-full h-full object-contain bg-black"
                  loading="lazy"
                />
              </div>
            )}
          />
        ) : (
          <div className="aspect-w-16 aspect-h-9 bg-gray-900 flex items-center justify-center h-[500px]">
            <span className="text-gray-400 text-xl font-medium">Ładowanie zdjęć...</span>
          </div>
        )}
      </div>

      {}
      {announcement.photos && announcement.photos.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 text-center text-sm text-gray-600">
          {announcement.photos.length} zdjęć • Kliknij w miniaturkę lub użyj strzałek
        </div>
      )}
    </div>
  );
};