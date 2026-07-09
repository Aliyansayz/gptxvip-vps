import { 
  Menu, 
  Search, 
  Terminal, 
  ShoppingBag, 
  Calculator,
  Shield,
  Bot
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
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    onTopicSelect(id);
  };

  return (
    <aside
      className={`bg-slate-950 border-r border-slate-800 flex-shrink-0 flex flex-col transition-all duration-300 ${isSidebarOpen ? "w-64 p-6" : "w-20 p-4"}`}
    >
      {/* Sidebar Header */}
      <div
        className={`flex items-center gap-2 mb-8 ${!isSidebarOpen && "justify-center"}`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="h-6 w-6 text-indigo-400 hover:text-indigo-300 flex-shrink-0 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        {isSidebarOpen && (
          <h1 className="text-xl font-bold text-white truncate tracking-wider">
            DEV<span className="text-indigo-400">LUSH</span>
          </h1>
        )}
      </div>

      {/* Exit Button */}
      {onExit && (
        <div className="mb-6">
          <button
            onClick={onExit}
            className={`flex items-center w-full p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all ${!isSidebarOpen && "justify-center"}`}
            title="Exit Workspace"
          >
            <Shield className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? "mr-3" : ""}`} />
            {isSidebarOpen && (
              <span className="font-semibold text-sm">Exit</span>
            )}
          </button>
        </div>
      )}

      {/* Search Actions */}
      <div className="mb-6">
        <button
          onClick={onSearchClick}
          className={`flex items-center w-full p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20 transition-all ${!isSidebarOpen && "justify-center"}`}
          title="Search Simulation"
        >
          <Search className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? "mr-3" : ""}`} />
          {isSidebarOpen && (
            <span className="font-semibold text-sm">Search Lab</span>
          )}
        </button>
      </div>

      {/* Topics Navigation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
          <ul className="space-y-2">
            {topics.map((topic) => {
              const isActive = topic.id === activeTopicId;
              const IconComponent = topic.icon;
              const theme = getThemeColorClass(topic.title);
              return (
                <li key={topic.id}>
                  <a
                    href="#"
                    onClick={(e) => handleNavClick(e, topic.id)}
                    className={`flex items-center p-2 text-sm w-full font-bold transition-all duration-300 transform rounded-xl ${isActive ? `${theme.bgSoft} ${theme.text} border ${theme.borderSoft} scale-[1.03] shadow-md ${theme.shadowMd}` : "text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200 scale-100 hover:scale-[1.01]"}`}
                    title={topic.title}
                  >
                    <IconComponent
                      className={`w-5 h-5 flex-shrink-0 ${isActive ? theme.text : "text-slate-500"} ${isSidebarOpen ? "mr-3" : "mx-auto"}`}
                    />
                    {isSidebarOpen && (
                      <span className="truncate">{topic.title}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {!isSidebarOpen && (
          <div className="flex-1 flex items-center justify-center pt-4">
            <h2
              className="font-bold text-slate-700 uppercase tracking-widest text-[10px]"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              Agent Sandbox
            </h2>
          </div>
        )}
      </div>
    </aside>
  );
};

export default RoadmapSidebar;
