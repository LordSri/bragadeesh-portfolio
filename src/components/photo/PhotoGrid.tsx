
import React from 'react';
import { Photo } from '@/utils/photoUtils';
import { cn } from '@/lib/utils';
import { Award } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
  // Sort photos to optimize layout
  const sortedPhotos = [...photos].sort((a, b) => {
    // First by aspect ratio (vertical photos first)
    const aspectA = a.aspectRatio === "3/4" ? 0 : 1;
    const aspectB = b.aspectRatio === "3/4" ? 0 : 1;
    if (aspectA !== aspectB) return aspectA - aspectB;
    
    // Then by award status (featured photos first)
    const awardA = a.award ? 0 : 1;
    const awardB = b.award ? 0 : 1;
    return awardA - awardB;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-auto">
      {sortedPhotos.map((photo) => {
        // Calculate optimal span based on aspect ratio
        let colSpan = "col-span-1";
        let rowSpan = "";
        
        if (photo.aspectRatio === "16/9" || photo.aspectRatio === "3/2") {
          colSpan = "sm:col-span-2";
        } else if (photo.aspectRatio === "3/4") {
          rowSpan = "row-span-2";
        } else if (photo.aspectRatio === "1/1") {
          // Square images stay as they are
        }
        
        return (
          <div 
            key={photo.id}
            className={cn(
              "overflow-hidden rounded-lg shadow-lg group cursor-pointer transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:z-10",
              colSpan,
              rowSpan
            )}
            onClick={() => onPhotoClick(photo)}
          >
            <div className="relative w-full h-full aspect-auto">
              <img 
                src={photo.src} 
                alt={photo.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                {photo.description && (
                  <p className="text-xs text-gray-300 line-clamp-2 mt-1">{photo.description}</p>
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
