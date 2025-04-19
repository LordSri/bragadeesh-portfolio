
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
  const selectedThumbnailRef = useRef<HTMLImageElement>(null);

  // Center selected thumbnail when it changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    const thumbnail = selectedThumbnailRef.current;
    
    if (!container || !thumbnail || !selectedPhoto) return;
    
    const containerWidth = container.offsetWidth;
    const thumbnailLeft = thumbnail.offsetLeft;
    const thumbnailWidth = thumbnail.offsetWidth;
    
    // Calculate scroll position to center the selected thumbnail
    const scrollTo = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
    
    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
  }, [selectedPhoto]);

  // Handle horizontal scroll with mouse wheel
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (container.matches(':hover')) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-2 md:pb-4">
      <div 
        ref={scrollContainerRef}
        className="mx-auto px-4 overflow-x-auto scrollbar-hide"
        style={{ maxWidth: '100%' }}
      >
        <div className="flex space-x-2 py-2">
          {photos.map((photo) => (
            <img
              key={`thumbnail-${photo.id}`}
              ref={selectedPhoto?.id === photo.id ? selectedThumbnailRef : null}
              src={photo.src}
              alt={photo.title}
              onClick={() => onThumbnailClick(photo)}
              className={cn(
                "h-10 w-14 object-cover cursor-pointer rounded-sm transition-all duration-300",
                selectedPhoto?.id === photo.id 
                  ? "ring-2 ring-white opacity-100 scale-110" 
                  : "opacity-40 grayscale hover:opacity-70 hover:grayscale-0"
              )}
              loading="lazy"
              onContextMenu={(e) => e.preventDefault()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoThumbnailNav;
