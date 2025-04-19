
import React from 'react';
import { Image, Video, Film, Palette, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs = [{
    id: 'photos',
    label: 'Photography',
    icon: <Image size={18} />,
    locked: false
  }, {
    id: 'videography',
    label: 'Videography',
    icon: <Video size={18} />,
    locked: true
  }, {
    id: 'cinematography',
    label: 'Cinematography',
    icon: <Film size={18} />,
    locked: true
  }, {
    id: 'graphic-design',
    label: 'Graphic Design',
    icon: <Palette size={18} />,
    locked: true
  }];

  const handleTabClick = (tabId: string, locked: boolean) => {
    if (!locked) {
      setActiveTab(tabId);
    }
  };

  return <div className="w-full px-4 py-4 backdrop-blur-md bg-transparent">
    <div className="w-full glass-panel rounded-2xl p-2 inline-flex backdrop-blur-xl bg-white/10 border border-red-500/20 shadow-lg">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <nav className="flex justify-between md:justify-around min-w-max md:w-full">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.locked)}
              className={cn(
                "flex items-center justify-center gap-2 px-4 md:px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 flex-1 relative",
                activeTab === tab.id
                  ? "bg-red-500/20 text-white shadow-md border-b-2 border-red-500"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              )}
              disabled={tab.locked}
            >
              <span className={cn("transition-transform duration-300", activeTab === tab.id ? "scale-110" : "")}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.locked && (
                <span className="absolute -top-2 -right-2 bg-red-500/20 p-1 rounded-full">
                  <Lock size={12} />
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  </div>;
};

export default TabNavigation;
