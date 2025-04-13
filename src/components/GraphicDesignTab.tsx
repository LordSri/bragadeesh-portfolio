
import React from 'react';
import { Palette, Layers, Figma, PenTool } from 'lucide-react';

const designProjects = [
  {
    id: 1,
    title: "Cosmic Brand Identity",
    category: "Branding",
    description: "Complete brand identity for a space-themed tech company.",
    thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    icon: <Palette size={18} />
  },
  {
    id: 2,
    title: "Aurora UI Kit",
    category: "UI/UX Design",
    description: "A glassmorphic UI kit with cosmic-inspired elements.",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    icon: <Figma size={18} />
  },
  {
    id: 3,
    title: "Nebula Illustrations",
    category: "Digital Art",
    description: "A series of nebula-inspired digital illustrations.",
    thumbnail: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
    icon: <PenTool size={18} />
  },
  {
    id: 4,
    title: "Galactic Magazine Layout",
    category: "Print Design",
    description: "Editorial design for a space science magazine.",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    icon: <Layers size={18} />
  }
];

const GraphicDesignTab: React.FC = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {designProjects.map((project, index) => (
          <div 
            key={project.id} 
            className="glass-panel rounded-xl overflow-hidden group hover:ring-1 hover:ring-aurora-red/30 transition-all animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={project.thumbnail} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 glass-panel p-2 rounded-md flex items-center gap-1">
                {project.icon}
                <span className="text-xs font-medium">{project.category}</span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1">{project.title}</h3>
              <p className="text-gray-400 text-sm">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraphicDesignTab;
