
import React from 'react';
import { Image, Video, Film, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'photos', label: 'Photos', icon: <Image size={20} /> },
    { id: 'videography', label: 'Videography', icon: <Video size={20} /> },
    { id: 'cinematography', label: 'Cinematography', icon: <Film size={20} /> },
    { id: 'graphic-design', label: 'Graphic Design', icon: <Palette size={20} /> }
  ];

  return (
    <div className="w-full mb-8 overflow-x-auto scrollbar-none">
      <div className="glass-panel rounded-xl p-1 inline-flex min-w-full md:min-w-0">
        <nav className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-aurora-red/20 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
