
import React, { useRef, useEffect, useState } from 'react';
import { Photo } from '@/utils/photoUtils';
import { cn } from '@/lib/utils';
import { ChevronUp } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
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
      className={cn(
        "fixed bottom-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out",
        !isExpanded && "transform translate-y-[85%]"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="w-full bg-black/80 backdrop-blur-xl border-t border-red-500/20">
        <div className="flex justify-center mb-2">
          <ChevronUp 
            className={cn(
              "w-6 h-6 text-white/60 transition-transform duration-300",
              isExpanded && "rotate-180"
            )} 
          />
        </div>
        <div 
          ref={thumbnailsRef}
          className="w-full pb-4 px-4 overflow-x-auto scrollbar-hide"
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
                    ? "border-red-500 opacity-100 transform scale-110" 
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
    </div>
  );
};

export default PhotoThumbnailNav;
