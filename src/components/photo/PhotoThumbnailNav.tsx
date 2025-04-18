
import React, { useEffect, useRef } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle horizontal scroll with mouse wheel
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener('wheel', handleWheel);
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50">
      <div 
        ref={scrollContainerRef}
        className="mx-auto px-4 overflow-x-auto scrollbar-hide max-w-[2000px]"
      >
        <div className="flex space-x-2 pb-2">
          {photos.map((photo) => (
            <img
              key={`thumbnail-${photo.id}`}
              src={photo.src}
              alt={photo.title}
              onClick={() => onThumbnailClick(photo)}
              className={cn(
                "h-16 w-24 object-cover cursor-pointer rounded transition-all duration-300",
                selectedPhoto?.id === photo.id 
                  ? "ring-2 ring-white opacity-100" 
                  : "opacity-50 grayscale hover:opacity-75 hover:grayscale-0"
              )}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoThumbnailNav;
