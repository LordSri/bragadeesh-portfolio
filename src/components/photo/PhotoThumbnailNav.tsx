
import React from 'react';
import { Photo } from '@/utils/photoUtils';
import { cn } from '@/lib/utils';

interface PhotoThumbnailNavProps {
  photos: Photo[];
  selectedPhoto: Photo | null;
  onThumbnailClick: (photo: Photo) => void;
}

const PhotoThumbnailNav: React.FC<PhotoThumbnailNavProps> = ({
  photos,
  selectedPhoto,
  onThumbnailClick
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 py-3 z-50">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex space-x-3 px-4 max-w-[2000px] mx-auto">
          {photos.map((photo) => (
            <button
              key={`thumbnail-${photo.id}`}
              onClick={() => onThumbnailClick(photo)}
              className={cn(
                "relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300",
                selectedPhoto?.id === photo.id 
                  ? "border-white opacity-100" 
                  : "border-transparent opacity-70 grayscale hover:opacity-90 hover:grayscale-0"
              )}
              style={{ width: '100px', height: '75px' }}
            >
              <img 
                src={photo.src} 
                alt={photo.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoThumbnailNav;
