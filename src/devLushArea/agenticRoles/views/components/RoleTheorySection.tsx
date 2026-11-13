import React from 'react';
import type { AgenticRoleChapter, AgenticRoleDefinition } from '../../agenticRoleTypes';
import type { RoleThemeTokens } from '../../agenticThemeHelpers';
import { EditorialTheorySection, KnowledgeCheckPromptCard } from '../../../../shared/components/article-lab';
import RoleConceptVisual from './RoleConceptVisual';

interface RoleTheorySectionProps {
  chapter: AgenticRoleChapter;
  role: AgenticRoleDefinition;
  theme: RoleThemeTokens;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  compact?: boolean;
  onSaveTheory?: () => void;
  isTheorySaved?: boolean;
  isMcqOpen?: boolean;
  onStartActivity?: () => void;
}

/**
 * Domain-wired editorial theory section for Agentic Role labs, built on
 * the shared root EditorialTheorySection + RoleConceptVisual + button-gated
 * Knowledge Check trigger.
 */
export const RoleTheorySection: React.FC<RoleTheorySectionProps> = ({
  chapter,
  role,
  theme,
  scrollContainerRef,
  compact = false,
  onSaveTheory,
  isTheorySaved = false,
  isMcqOpen = false,
  onStartActivity,
}) => {
  const questionCount = chapter.interactive_questions?.length || 1;

  return (
    <aside id="agentic-role-theory" aria-label="Case theory" className="min-w-0">
      <EditorialTheorySection
        chapter={chapter}
        roleShortTitle={role.shortTitle}
        roleTagline={role.tagline}
        scrollContainerRef={scrollContainerRef}
        compact={compact}
        onSaveTheory={onSaveTheory}
        isTheorySaved={isTheorySaved}
        theme={theme}
        visualDiagramSlot={<RoleConceptVisual key={chapter.labComponentId} chapter={chapter} />}
        footerActionSlot={
          onStartActivity ? (
            <KnowledgeCheckPromptCard
              questionCount={questionCount}
              buttonLabel={isMcqOpen ? 'Jump to Activity' : 'Start Activity'}
              onStart={onStartActivity}
            />
          ) : null
        }
      />
    </aside>
  );
};

export default RoleTheorySection;
