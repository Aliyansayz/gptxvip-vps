import React from 'react';
import {
  Search,
  Calculator,
  ShoppingBag,
  Compass,
  Database,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  Award,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { AgenticRoleDefinition, Difficulty } from '../agenticRoleTypes';
import { getRoleTheme } from '../agenticThemeHelpers';

interface AgenticRolesSidebarProps {
  roles: AgenticRoleDefinition[];
  activeRoleId: string;
  onSelectRole: (roleId: string) => void;
  selectedDifficulty: Difficulty | 'all';
  onSelectDifficulty: (difficulty: Difficulty | 'all') => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSearch?: () => void;
  onExitToDevLush?: () => void;
}

const roleIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Calculator,
  ShoppingBag,
  Compass,
  Database,
  BarChart2
};

export const AgenticRolesSidebar: React.FC<AgenticRolesSidebarProps> = ({
  roles,
  activeRoleId,
  onSelectRole,
  selectedDifficulty,
  onSelectDifficulty,
  isCollapsed,
  onToggleCollapse,
  onOpenSearch,
  onExitToDevLush
}) => {
  return (
    <aside
      className={`h-full flex flex-col justify-between bg-slate-950 border-r border-slate-800/80 transition-all duration-300 relative z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header Section */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">Agentic Roles</h2>
                <p className="text-[10px] text-slate-400 font-mono">Career Roadmaps</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={isCollapsed ? 'Expand role sidebar' : 'Collapse role sidebar'}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Search Action Trigger */}
        {onOpenSearch && !isCollapsed && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full min-h-11 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs font-mono cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
              Search activities...
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-500">⌘K</span>
          </button>
        )}

        {/* Difficulty Quick Filter */}
        {!isCollapsed && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider px-1">
              <span>Filter Difficulty</span>
            </div>
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono">
              {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => onSelectDifficulty(diff)}
                  aria-pressed={selectedDifficulty === diff}
                  className={`min-h-10 rounded-lg capitalize transition-all cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    selectedDifficulty === diff
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Roles List */}
        <div className="space-y-1 pt-2">
          {!isCollapsed && (
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider px-1 block mb-2">
              Career Tracks ({roles.length})
            </span>
          )}

          {roles.map((role) => {
            const isActive = activeRoleId === role.id;
            const IconComponent = roleIconMap[role.iconName] || Layers;
            const theme = getRoleTheme(role.roleDomain);

            return (
              <button
                type="button"
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                aria-pressed={isActive}
                title={role.title}
                className={`w-full min-h-12 flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  isActive
                    ? 'bg-slate-900 border text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
                style={{
                  borderColor: isActive ? `rgba(${theme.spotlightRgb}, 0.5)` : 'transparent',
                  boxShadow: isActive ? `0 4px 20px rgba(${theme.spotlightRgb}, 0.15)` : 'none'
                }}
              >
                <div
                  className="p-2 rounded-lg flex-shrink-0 transition-colors"
                  style={{
                    backgroundColor: isActive ? `rgba(${theme.spotlightRgb}, 0.2)` : 'rgba(30, 41, 59, 0.6)',
                    color: isActive ? theme.accentHex : '#94a3b8'
                  }}
                >
                  <IconComponent className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{role.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {role.totalDays} Days Roadmap • {role.careerLevel.split(' ')[0]}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Exit Footer */}
      {onExitToDevLush && (
        <div className="p-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onExitToDevLush}
            className={`w-full min-h-11 flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Back to DevLush</span>}
          </button>
        </div>
      )}
    </aside>
  );
};

export default AgenticRolesSidebar;
