
import React from 'react';
import { Image, Video, Film, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'photos', label: 'Photography', icon: <Image size={18} /> },
    { id: 'videography', label: 'Videography', icon: <Video size={18} /> },
    { id: 'cinematography', label: 'Cinematography', icon: <Film size={18} /> },
    { id: 'graphic-design', label: 'Graphic Design', icon: <Palette size={18} /> }
  ];

  return (
    <div className="w-full mb-8 overflow-x-auto scrollbar-hide">
      <div className="w-full glass-panel rounded-xl p-1.5 inline-flex backdrop-blur-lg border-aurora-red/20 shadow-lg">
        <nav className="flex space-x-1 w-full md:justify-center">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-aurora-red/20 text-white shadow-md border-b-2 border-aurora-red" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span className={cn(
                "transition-transform duration-300",
                activeTab === tab.id ? "scale-110" : ""
              )}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
