import React, { useState } from 'react';
import AgenticRolesSidebar from './AgenticRolesSidebar';
import { AgenticRoleDefinition, Difficulty } from '../agenticRoleTypes';
import { Menu, Sparkles, X, ChevronRight, Layers, Bot } from 'lucide-react';

interface AgenticRolesLayoutProps {
  roles: AgenticRoleDefinition[];
  activeRoleId: string;
  onSelectRole: (roleId: string) => void;
  selectedDifficulty: Difficulty | 'all';
  onSelectDifficulty: (difficulty: Difficulty | 'all') => void;
  onOpenSearch?: () => void;
  onExitToDevLush?: () => void;
  children: React.ReactNode;
}

export const AgenticRolesLayout: React.FC<AgenticRolesLayoutProps> = ({
  roles,
  activeRoleId,
  onSelectRole,
  selectedDifficulty,
  onSelectDifficulty,
  onOpenSearch,
  onExitToDevLush,
  children
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const activeRole = roles.find((r) => r.id === activeRoleId) || roles[0];

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-950 text-slate-100 font-sans relative">
      
      {/* Desktop Navigation Sidebar */}
      <div className="hidden md:flex h-full flex-shrink-0">
        <AgenticRolesSidebar
          roles={roles}
          activeRoleId={activeRoleId}
          onSelectRole={onSelectRole}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={onSelectDifficulty}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onOpenSearch={onOpenSearch}
          onExitToDevLush={onExitToDevLush}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative z-10 w-72 max-w-[85vw] h-full bg-slate-950 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-600 shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Agentic Roles</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Career Roadmaps</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <AgenticRolesSidebar
                roles={roles}
                activeRoleId={activeRoleId}
                onSelectRole={(id) => {
                  onSelectRole(id);
                  setIsMobileDrawerOpen(false);
                }}
                selectedDifficulty={selectedDifficulty}
                onSelectDifficulty={onSelectDifficulty}
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileDrawerOpen(false)}
                onOpenSearch={() => {
                  setIsMobileDrawerOpen(false);
                  if (onOpenSearch) onOpenSearch();
                }}
                onExitToDevLush={onExitToDevLush}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar relative flex flex-col min-w-0">
        
        {/* Mobile Header Bar with Sidebar Trigger */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer shadow-sm"
          >
            <Menu className="w-4 h-4 text-cyan-400" />
            <span>Role Sidebar ({activeRole?.title || 'Tracks'})</span>
          </button>

          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-mono border border-slate-700"
            >
              Search ⌘K
            </button>
          )}
        </div>

        {/* Child Content (Hub or Runner) */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AgenticRolesLayout;
