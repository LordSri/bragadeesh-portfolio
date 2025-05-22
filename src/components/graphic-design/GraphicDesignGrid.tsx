
import React from 'react';
import { Photo } from '@/utils/photoUtils';

interface GraphicDesignGridProps {
  designs: Photo[];
  onDesignClick: (design: Photo) => void;
}

const GraphicDesignGrid: React.FC<GraphicDesignGridProps> = ({ designs, onDesignClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {designs.map((design, index) => (
        <div
          key={design.id}
          className="relative group cursor-pointer overflow-hidden rounded-lg glass-panel animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => onDesignClick(design)}
        >
          <div className="aspect-square overflow-hidden">
            <img
              src={design.src}
              alt={design.title || 'Design'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white text-sm font-medium truncate">
              {design.title || 'Untitled'}
            </h3>
          </div>
          
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-medium">View Design</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GraphicDesignGrid;
