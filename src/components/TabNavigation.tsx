
import React from 'react';
import { Image, Video, Film, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabProps> = ({
  activeTab,
  setActiveTab
}) => {
  // List of tab definitions
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

  // Compute indexes of the locked tabs
  const firstLocked = tabs.findIndex(tab => tab.locked);

  return (
    <div className="w-full px-4 py-4 backdrop-blur-md bg-transparent relative">
      <div className="w-full glass-panel rounded-2xl p-2 inline-flex backdrop-blur-xl bg-white/10 border border-red-500/20 shadow-lg relative">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <nav className="flex justify-between md:justify-around min-w-max md:w-full relative">
            {tabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.locked)}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 md:px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 flex-1 relative",
                  activeTab === tab.id
                    ? "bg-red-500/20 text-white shadow-md border-b-2 border-red-500"
                    : "text-gray-300 hover:text-white hover:bg-white/10",
                  tab.locked ? "pointer-events-none select-none" : ""
                )}
                disabled={tab.locked}
                tabIndex={tab.locked ? -1 : 0}
                aria-disabled={tab.locked ? "true" : undefined}
                style={tab.locked ? { opacity: 0.7, userSelect: "none" } : undefined}
              >
                <span className={cn("transition-transform duration-300", activeTab === tab.id ? "scale-110" : "")}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}

            {/* Enhanced glassmorphism overlay for locked tabs */}
            {firstLocked !== -1 && (
              <div 
                className="absolute top-0 right-0 h-full rounded-r-xl glass-morphism flex items-center justify-center z-10"
                style={{
                  width: `${(tabs.length - firstLocked) / tabs.length * 100}%`,
                  backdropFilter: "blur(8px)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-xl font-bold text-white drop-shadow-md mb-1">Coming Soon</span>
                  <span className="text-sm text-white/80">These features are under development</span>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
