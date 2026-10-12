import { Link } from 'react-router';
import {
  Menu,
  Search,
  Shield,
  ChevronsLeft,
} from "lucide-react";
import { getThemeColorClass } from "../themeHelpers";
import "./devLushSidebar.css";

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

/**
 * Topic category rail for the Agent Labs workspace.
 *
 * Structure is one pass over the topic list rather than a nested map, so the
 * group header, its count and its rows stay in source order and can never drift
 * apart. Counts come from the same array that renders the rows.
 */
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
  // Group in first-appearance order, with a live count per group.
  const groups = topics.reduce<Array<{ name: string; items: Topic[] }>>((acc, topic) => {
    const name = topic.group || 'Other';
    const existing = acc.find((group) => group.name === name);
    if (existing) existing.items.push(topic);
    else acc.push({ name, items: [topic] });
    return acc;
  }, []);

  const activeTopic = topics.find((topic) => topic.id === activeTopicId);

  return (
    <aside
      className={`devlush-rail hidden shrink-0 flex-col transition-[width,padding] duration-300 lg:flex ${isSidebarOpen ? "w-72 p-5" : "w-[76px] p-3"}`}
      aria-label="Agent Labs category navigation"
    >
      {/* Brand */}
      <div className={`mb-6 flex items-center gap-2.5 ${!isSidebarOpen && "justify-center"}`}>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Collapse Agent Labs sidebar" : "Expand Agent Labs sidebar"}
          aria-expanded={isSidebarOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-indigo-400 transition-colors hover:bg-white/5 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Menu className="w-5 h-5" />
        </button>
        {isSidebarOpen && (
          <h2 className="truncate text-base font-bold tracking-tight text-white">
            {brandLabel || <>DEV<span className="text-indigo-400">LUSH</span></>}
          </h2>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <SidebarAction
          to={searchPath}
          type="button"
          onClick={onSearchClick}
          className={`group flex min-h-11 w-full items-center rounded-lg border border-white/10 bg-white/[0.04] text-indigo-300 transition-colors hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${isSidebarOpen ? "gap-2.5 px-3" : "justify-center px-0"}`}
          title={searchLabel}
          aria-label={searchAriaLabel}
        >
          <Search className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span className="text-sm font-medium">{searchLabel}</span>}
        </SidebarAction>
      </div>

      {/* Exit */}
      {onExit && (
        <div className="mb-5">
          <SidebarAction
            to={exitPath}
            type="button"
            onClick={onExit}
            aria-label={exitAriaLabel}
            className={`flex min-h-11 w-full items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${isSidebarOpen ? "gap-2.5 px-3" : "justify-center px-0"}`}
            title="Exit workspace"
          >
            <Shield className="h-4 w-4 shrink-0" />
            {isSidebarOpen && <span className="text-sm font-medium">Exit</span>}
          </SidebarAction>
        </div>
      )}

      <div className="mb-3 h-px w-full bg-white/10" />

      {/* Category groups */}
      <nav aria-label={topicNavLabel} className="custom-scrollbar -mr-2 flex-1 overflow-y-auto pr-2">
        {groups.map((group) => (
          <section key={group.name} className="mb-4 last:mb-0">
            {isSidebarOpen && (
              <div className="mb-1.5 flex items-center justify-between gap-2 px-2">
                {/* slate-400, not slate-500: the labels are 10px and slate-500
                    measures 4.02:1 on this ground. */}
                <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {group.name}
                </h3>
                <span className="rounded-full border border-white/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-slate-400">
                  {group.items.length}
                </span>
              </div>
            )}

            <ul className="space-y-1">
              {group.items.map((topic) => {
                const isActive = topic.id === activeTopicId;
                const Icon = topic.icon;
                const theme = getThemeColorClass(topic.title);
                return (
                  <li key={topic.id}>
                    <SidebarAction
                      to={topicPath?.(topic.id)}
                      type="button"
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => onTopicSelect(topic.id)}
                      className={`relative flex min-h-11 w-full items-center rounded-lg border text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                        isSidebarOpen ? "gap-2.5 px-2.5 py-2" : "justify-center px-0 py-2"
                      } ${
                        isActive
                          ? `${theme.bgSoft} ${theme.text} border ${theme.borderSoft}`
                          : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-50"
                      }`}
                      title={topic.title}
                    >
                      {/* Active marker — a rail, so the row reads as selected
                          without relying on background colour alone. */}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-indigo-400"
                        />
                      )}
                      <Icon
                        className={`h-4 w-4 shrink-0 ${isActive ? theme.text : "text-slate-500"}`}
                        aria-hidden="true"
                      />
                      {isSidebarOpen && <span className="truncate">{topic.title}</span>}
                    </SidebarAction>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      {/* Collapsed footer: shows where you are, since labels are hidden */}
      {!isSidebarOpen && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <p className="text-center text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
            {activeTopic?.group || 'Labs'}
          </p>
        </div>
      )}

      {isSidebarOpen && (
        <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3 text-[10px] text-slate-400">
          <ChevronsLeft className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{activeTopic?.group || `${topics.length} topics`}</span>
        </div>
      )}
    </aside>
  );
};

export default DevLushSidebar;