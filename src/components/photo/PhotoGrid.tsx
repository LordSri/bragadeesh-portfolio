
import React from 'react';
import { Photo } from '@/utils/photoUtils';
import { cn } from '@/lib/utils';
import { Award } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-auto">
      {photos.map((photo) => (
        <div 
          key={photo.id}
          className={cn(
            "overflow-hidden rounded-lg shadow-lg group cursor-pointer transition-transform duration-300 hover:scale-[1.01]",
            photo.aspectRatio === "3/4" && "row-span-2",
            (photo.aspectRatio === "16/9" || photo.aspectRatio === "3/2") && "sm:col-span-2"
          )}
          onClick={() => onPhotoClick(photo)}
        >
          <div className="relative w-full h-full">
            <img 
              src={photo.src} 
              alt={photo.title} 
              className="w-full h-full object-cover"
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
      ))}
    </div>
  );
};

export default PhotoGrid;
