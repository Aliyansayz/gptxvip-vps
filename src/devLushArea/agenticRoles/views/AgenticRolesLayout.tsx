import React, { useEffect, useRef, useState } from 'react';
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
  const mobileDrawerRef = useRef<HTMLElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMobileDrawerOpen) return;

    const drawer = mobileDrawerRef.current;
    const focusable = () => drawer?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) ?? [];
    focusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMobileDrawerOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      mobileTriggerRef.current?.focus();
    };
  }, [isMobileDrawerOpen]);

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
          <button
            type="button"
            aria-label="Close role navigation"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <aside
            ref={mobileDrawerRef}
            id="role-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Agentic role navigation"
            className="relative z-10 w-72 max-w-[85vw] h-full bg-slate-950 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200"
          >
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
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Close role navigation"
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
          </aside>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar relative flex flex-col min-w-0">
        
        {/* Mobile Header Bar with Sidebar Trigger */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
          <button
            ref={mobileTriggerRef}
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex min-h-11 items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-expanded={isMobileDrawerOpen}
            aria-haspopup="dialog"
            aria-controls="role-navigation-drawer"
          >
            <Menu className="w-4 h-4 text-cyan-400" />
            <span>Role Sidebar ({activeRole?.title || 'Tracks'})</span>
          </button>

          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="min-h-11 px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-mono border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Search role milestones"
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
