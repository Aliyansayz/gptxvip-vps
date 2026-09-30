import { 
  Menu,
  Search,
  ArrowLeft
} from "lucide-react";
import { getThemeColorClass } from "../shared/themeHelpers";

interface Topic {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface RoadmapSidebarProps {
  topics: Topic[];
  activeTopicId: string;
  onTopicSelect: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onSearchClick: () => void;
  onExit?: () => void;
}

const RoadmapSidebar: React.FC<RoadmapSidebarProps> = ({
  topics,
  activeTopicId,
  onTopicSelect,
  isSidebarOpen,
  setIsSidebarOpen,
  onSearchClick,
  onExit,
}) => {
  return (
    <aside
      className={`hidden bg-slate-950 border-r border-slate-800 flex-shrink-0 lg:flex flex-col transition-[width,padding] duration-200 ${isSidebarOpen ? "w-64 p-6" : "w-20 p-4"}`}
    >
      {/* Sidebar Header */}
      <div
        className={`flex items-center gap-2 mb-8 ${!isSidebarOpen && "justify-center"}`}
      >
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Collapse Roadmap sidebar" : "Expand Roadmap sidebar"}
          aria-expanded={isSidebarOpen}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-indigo-400 hover:bg-slate-900 hover:text-indigo-300 flex-shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Menu className="w-6 h-6" />
        </button>
        {isSidebarOpen && (
          <h1 className="text-xl font-bold text-white truncate tracking-wider">
            ROAD<span className="text-indigo-400">MAP</span>
          </h1>
        )}
      </div>

      {/* Search Actions */}
      <div className="mb-6">
        <button
          id="roadmap-desktop-search-trigger"
          onClick={onSearchClick}
          className={`flex min-h-11 items-center w-full p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-600/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${!isSidebarOpen && "justify-center"}`}
          title="Search Roadmap"
        >
          <Search className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? "mr-3" : ""}`} />
          {isSidebarOpen && (
            <span className="font-semibold text-sm">Search Lab</span>
          )}
        </button>
      </div>

      {/* Topics Navigation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav aria-label="Roadmap topics" className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
          <ul className="space-y-2">
            {topics.map((topic) => {
              const isActive = topic.id === activeTopicId;
              const IconComponent = topic.icon;
              const theme = getThemeColorClass(topic.title);
              return (
                <li key={topic.id}>
                  <button
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onTopicSelect(topic.id)}
                    className={`flex min-h-11 items-center p-2 text-sm w-full font-bold transition-colors rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${isActive ? `${theme.bgSoft} ${theme.text} border ${theme.borderSoft}` : "text-slate-300 border border-transparent hover:bg-slate-900 hover:text-white"}`}
                    title={topic.title}
                  >
                    <IconComponent
                      className={`w-5 h-5 flex-shrink-0 ${isActive ? theme.text : "text-slate-500"} ${isSidebarOpen ? "mr-3" : "mx-auto"}`}
                    />
                    {isSidebarOpen && (
                      <span className="truncate">{topic.title}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Exit Button at bottom */}
        {onExit && (
          <div className="pt-4 border-t border-slate-800/80 mt-auto">
            <button
              type="button"
              onClick={onExit}
              aria-label="Exit Roadmap to GPTX.VIP home"
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:text-white hover:bg-red-500 transition-all text-xs font-bold cursor-pointer ${
                !isSidebarOpen ? 'justify-center' : ''
              }`}
              title="Exit to Main Hub"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              {isSidebarOpen && <span>Exit to Hub</span>}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default RoadmapSidebar;
