
import React from 'react';
import { Film, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const cinematographyProjects = [
  {
    id: 1,
    title: "Eternal Dreams",
    role: "Director of Photography",
    description: "A short film exploring the boundaries between reality and dreams.",
    thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    award: "Best Cinematography - Indie Film Festival 2023"
  },
  {
    id: 2,
    title: "City Rhythms",
    role: "Cinematographer",
    description: "Documentary showcasing the daily life and hidden stories of urban dwellers.",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
  },
  {
    id: 3,
    title: "Ocean's Whisper",
    role: "Director of Photography",
    description: "Environmental documentary highlighting marine conservation efforts.",
    thumbnail: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
    award: "Environmental Impact Award - Green Film Festival"
  }
];

const CinematographyTab: React.FC = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {cinematographyProjects.map((project, index) => (
          <div 
            key={project.id} 
            className={cn(
              "glass-panel rounded-xl overflow-hidden animate-fade-in",
              {
                "animate-delay-100": index === 1,
                "animate-delay-200": index === 2,
              }
            )}
          >
            <div className="relative aspect-[16/9]">
              <img 
                src={project.thumbnail} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <span className="flex items-center text-xs font-medium bg-aurora-red/20 text-white px-3 py-1 rounded-full">
                  <Film size={12} className="mr-1" />
                  {project.role}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{project.description}</p>
              
              {project.award && (
                <div className="flex items-center p-2 glass-panel rounded-lg mt-auto">
                  <Award size={16} className="text-aurora-red mr-2 flex-shrink-0" />
                  <span className="text-xs">{project.award}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CinematographyTab;
