import '../agenticLearning.css';
import React from 'react';
import { AgentLabsMobileLearningNav } from '../../agentDevRootComponents/AgentLabsMobileLearningNav';
import { AgentLabsMobileTopicRail } from '../../agentDevRootComponents/AgentLabsMobileTopicRail';
import DevLushSidebar from '../../devLushComponents/devLushTopicsView/DevLushSidebar';
import { AgenticRoleDefinition } from '../agenticRoleTypes';
import { getAgenticRoleIcon } from './components/roleIcons';

interface AgenticRolesLayoutProps {
  roles: AgenticRoleDefinition[];
  activeRoleId: string;
  onSelectRole: (roleId: string) => void;
  onOpenSearch: () => void;
  onShowHub: () => void;
  onShowSaved: () => void;
  onExitToDevLush?: () => void;
  isSearchOpen: boolean;
  isRunning: boolean;
  savedCount: number;
  children: React.ReactNode;
}

const MOBILE_ROLE_LABELS: Record<string, string> = {
  'seo-agentic-analyst': 'SEO Analyst',
  'agentic-accountant': 'Accounting',
  'agentic-commerce-analyst': 'Commerce',
  'agentic-recommendation-analyst': 'Recommendations',
  'data-preprocessing-agentic': 'Data Prep',
  'data-visualization-agentic': 'Data Viz',
};

export const AgenticRolesLayout: React.FC<AgenticRolesLayoutProps> = ({
  roles,
  activeRoleId,
  onSelectRole,
  onOpenSearch,
  onShowHub,
  onShowSaved,
  onExitToDevLush,
  isSearchOpen,
  isRunning,
  savedCount,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const topics = roles.map((role) => ({
    id: role.id,
    title: role.title,
    icon: getAgenticRoleIcon(role.iconName),
  }));

  return (
    <div className="agentic-learning relative flex h-full w-full min-w-0 overflow-hidden bg-slate-50 text-slate-900 dark:bg-black dark:text-slate-100">
      <DevLushSidebar
        topics={topics}
        activeTopicId={activeRoleId}
        onTopicSelect={onSelectRole}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onSearchClick={onOpenSearch}
        onExit={onExitToDevLush}
        topicNavLabel="Agentic role tracks"
        searchLabel="Explore roles"
        searchAriaLabel="Explore Agentic Roles"
        exitAriaLabel="Back to Agent Labs topics"
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {!isRunning && !isSearchOpen && (
          <AgentLabsMobileTopicRail
            topics={topics}
            activeTopicId={activeRoleId}
            onTopicSelect={onSelectRole}
            onSearchClick={onOpenSearch}
            sectionLabel="Agentic Roles"
            heading="Choose a role"
            ariaLabel="Choose an Agentic Role"
            topicLabels={MOBILE_ROLE_LABELS}
          />
        )}

        <main className={`relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-black ${isRunning ? '' : 'pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:pb-0'}`}>
          {isRunning ? (
            <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">{children}</div>
          )}
        </main>

        {!isRunning && (
          <AgentLabsMobileLearningNav
            activeTab={isSearchOpen ? 'search' : 'learn'}
            savedCount={savedCount}
            onLearn={onShowHub}
            onSearch={onOpenSearch}
            onSaved={onShowSaved}
          />
        )}
      </div>
    </div>
  );
};

export default AgenticRolesLayout;
