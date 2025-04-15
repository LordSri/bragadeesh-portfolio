
import React, { useEffect, useRef } from 'react';
import { Photo } from '@/utils/photoUtils';
import { cn } from '@/lib/utils';
import { Award } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
  const masonryRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleResize = () => {
      // Force re-render on resize to adjust masonry layout
      if (masonryRef.current) {
        const columns = window.innerWidth < 640 ? 1 : 
                       window.innerWidth < 1024 ? 2 : 3;
        
        const columnElements = Array.from(masonryRef.current.children) as HTMLElement[];
        
        // Reset heights before recalculating
        columnElements.forEach(col => {
          col.style.height = 'auto';
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [photos]);

  // Sort photos by aspect ratio to better organize them
  const sortedPhotos = [...photos].sort((a, b) => {
    // Sort vertically oriented photos first
    const aIsVertical = a.aspectRatio === "3/4" || a.aspectRatio === "9/16";
    const bIsVertical = b.aspectRatio === "3/4" || b.aspectRatio === "9/16";
    
    if (aIsVertical && !bIsVertical) return -1;
    if (!aIsVertical && bIsVertical) return 1;
    return 0;
  });

  return (
    <div 
      ref={masonryRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 masonry-grid"
    >
      {sortedPhotos.map((photo) => {
        // Determine if photo is vertical or horizontal
        const isVertical = photo.aspectRatio === "3/4" || photo.aspectRatio === "9/16";
        const isWide = photo.aspectRatio === "16/9" || photo.aspectRatio === "3/2";
        
        return (
          <div 
            key={photo.id}
            className={cn(
              "mb-3 overflow-hidden rounded-xl shadow-lg group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]",
              isVertical && "sm:row-span-2",
              isWide && "sm:col-span-1 lg:col-span-2"
            )}
            onClick={() => onPhotoClick(photo)}
          >
            <div className="relative w-full h-full">
              <img 
                src={photo.src} 
                alt={photo.title} 
                className="w-full h-full object-contain bg-black"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white text-lg font-medium">{photo.title}</h3>
                {photo.award && (
                  <div className="flex items-center mt-1">
                    <Award size={16} className="text-blue-400 mr-1" />
                    <span className="text-xs text-gray-300">{photo.award}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhotoGrid;
