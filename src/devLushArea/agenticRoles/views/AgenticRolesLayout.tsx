import React, { useState } from 'react';
import AgenticRolesSidebar from './AgenticRolesSidebar';
import { AgenticRoleDefinition, Difficulty } from '../agenticRoleTypes';

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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Navigation Sidebar */}
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

      {/* Main Content Viewport */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar relative">
        {children}
      </div>
    </div>
  );
};

export default AgenticRolesLayout;
