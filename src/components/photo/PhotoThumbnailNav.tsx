
import React, { useRef, useEffect } from 'react';
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
  const selectedThumbnailRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (selectedPhoto && thumbnailsRef.current && selectedThumbnailRef.current) {
      // Smooth scroll to the selected thumbnail
      const container = thumbnailsRef.current;
      const element = selectedThumbnailRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      // Calculate if element is out of view
      if (elementRect.left < containerRect.left || elementRect.right > containerRect.right) {
        // Scroll to make the element centered in the container
        container.scrollTo({
          left: element.offsetLeft - (container.clientWidth / 2) + (element.offsetWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [selectedPhoto]);
  
  return (
    <div 
      ref={thumbnailsRef}
      className="w-full overflow-x-auto scrollbar-hide py-2"
    >
      <div className="flex space-x-3 min-w-max px-4">
        {photos.map((photo) => (
          <button
            ref={selectedPhoto?.id === photo.id ? selectedThumbnailRef : undefined}
            key={`thumbnail-${photo.id}`}
            onClick={() => onThumbnailClick(photo)}
            className={cn(
              "relative transition-all duration-200 flex-shrink-0 rounded-lg overflow-hidden border-2",
              selectedPhoto?.id === photo.id 
                ? "border-white opacity-100 transform scale-110" 
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
  );
};

export default PhotoThumbnailNav;
