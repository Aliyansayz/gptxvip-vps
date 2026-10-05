import { Link } from 'react-router';
import { 
  Menu,
  Search,
  Shield,
} from "lucide-react";
import { getThemeColorClass } from "../themeHelpers";

function SidebarAction({ to, onClick, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { to?: string }) {
  return to
    ? <Link to={to} className={props.className} title={props.title} aria-label={props['aria-label']} aria-current={props['aria-current']}>{children}</Link>
    : <button {...props} onClick={onClick}>{children}</button>;
}

interface Topic {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
}

interface DevLushSidebarProps {
  topics: Topic[];
  activeTopicId: string;
  onTopicSelect: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onSearchClick: () => void;
  onExit?: () => void;
  brandLabel?: string;
  topicPath?: (id: string) => string;
  searchPath?: string;
  exitPath?: string;
  topicNavLabel?: string;
  searchLabel?: string;
  searchAriaLabel?: string;
  exitAriaLabel?: string;
}

const DevLushSidebar: React.FC<DevLushSidebarProps> = ({
  topics,
  activeTopicId,
  onTopicSelect,
  isSidebarOpen,
  setIsSidebarOpen,
  onSearchClick,
  onExit,
  brandLabel,
  topicPath,
  searchPath,
  exitPath,
  topicNavLabel = "Agent Labs topics",
  searchLabel = "Search Lab",
  searchAriaLabel = "Search Agent Labs topics",
  exitAriaLabel = "Exit Agent Labs to the Agent catalog",
}) => {
  return (
    <aside
      className={`hidden bg-slate-950 border-r border-slate-800 flex-shrink-0 flex-col transition-all duration-300 lg:flex ${isSidebarOpen ? "w-64 p-6" : "w-20 p-4"}`}
    >
      {/* Sidebar Header */}
      <div
        className={`flex items-center gap-2 mb-8 ${!isSidebarOpen && "justify-center"}`}
      >
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Collapse Agent Labs sidebar" : "Expand Agent Labs sidebar"}
          aria-expanded={isSidebarOpen}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-indigo-400 transition-colors hover:bg-slate-900 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Menu className="w-6 h-6" />
        </button>
        {isSidebarOpen && (
          <h2 className="text-lg font-bold text-white truncate tracking-wide">
            {brandLabel || <>DEV<span className="text-indigo-400">LUSH</span></>}
          </h2>
        )}
      </div>

      {/* Exit Button */}
      {onExit && (
        <div className="mb-6">
          <SidebarAction
            to={exitPath}
            type="button"
            onClick={onExit}
            aria-label={exitAriaLabel}
            className={`flex min-h-11 items-center w-full p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${!isSidebarOpen && "justify-center"}`}
            title="Exit Workspace"
          >
            <Shield className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? "mr-3" : ""}`} />
            {isSidebarOpen && (
              <span className="font-semibold text-sm">Exit</span>
            )}
          </SidebarAction>
        </div>
      )}

      {/* Search Actions */}
      <div className="mb-6">
        <SidebarAction
          to={searchPath}
          type="button"
          onClick={onSearchClick}
          className={`flex min-h-11 items-center w-full p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${!isSidebarOpen && "justify-center"}`}
          title={searchLabel}
          aria-label={searchAriaLabel}
        >
          <Search className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? "mr-3" : ""}`} />
          {isSidebarOpen && (
            <span className="font-semibold text-sm">{searchLabel}</span>
          )}
        </SidebarAction>
      </div>

      {/* Topics Navigation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav aria-label={topicNavLabel} className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
          <ul className="space-y-2">
            {topics.map((topic, index) => {
              const isActive = topic.id === activeTopicId;
              const IconComponent = topic.icon;
              const theme = getThemeColorClass(topic.title);
              return (
                <li key={topic.id}>
                  {isSidebarOpen && topic.group && (index === 0 || topics[index - 1].group !== topic.group) && <p className="px-2 pb-2 pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{topic.group}</p>}
                  <SidebarAction
                    to={topicPath?.(topic.id)}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => onTopicSelect(topic.id)}
                    className={`flex min-h-11 items-center p-2 text-sm w-full font-bold transition-colors duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${isActive ? `${theme.bgSoft} ${theme.text} border ${theme.borderSoft}` : "text-slate-300 border border-transparent hover:bg-slate-900 hover:text-white"}`}
                    title={topic.title}
                  >
                    <IconComponent
                      className={`w-5 h-5 flex-shrink-0 ${isActive ? theme.text : "text-slate-500"} ${isSidebarOpen ? "mr-3" : "mx-auto"}`}
                    />
                    {isSidebarOpen && (
                      <span className="truncate">{topic.title}</span>
                    )}
                  </SidebarAction>
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
              {brandLabel || 'Agent Sandbox'}
            </h2>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DevLushSidebar;
