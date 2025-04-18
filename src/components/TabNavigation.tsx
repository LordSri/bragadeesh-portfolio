
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
    <div className="w-full sticky top-[72px] z-30 px-4 py-2 bg-black/60 backdrop-blur-md">
      <div className="w-full glass-panel rounded-2xl p-2 inline-flex backdrop-blur-xl bg-white/10 border border-red-500/20 shadow-lg">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <nav className="flex space-x-2 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300",
                  activeTab === tab.id 
                    ? "bg-red-500/20 text-white shadow-md border-b-2 border-red-500" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
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
    </div>
  );
};

export default TabNavigation;
