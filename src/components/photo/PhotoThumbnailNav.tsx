
import React, { useRef } from 'react';
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
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  
  return (
    <div 
      ref={thumbnailsRef}
      className="w-full mt-4 pb-4 px-4 overflow-x-auto scrollbar-hide"
    >
      <div className="flex space-x-2 min-w-max px-4">
        {photos.map((photo) => (
          <button
            key={`thumbnail-${photo.id}`}
            id={`thumbnail-${photo.id}`}
            onClick={() => onThumbnailClick(photo)}
            className={cn(
              "relative transition-all duration-200 flex-shrink-0 rounded-md overflow-hidden border-2",
              selectedPhoto?.id === photo.id 
                ? "border-blue-500 opacity-100 transform scale-105" 
                : "border-transparent opacity-70 grayscale hover:opacity-90 hover:grayscale-0"
            )}
            style={{ width: '80px', height: '60px' }}
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
  );
};

export default PhotoThumbnailNav;
