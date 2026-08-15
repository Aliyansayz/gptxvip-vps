import React, { useState, useEffect } from 'react';
import {
  AgenticRoleDefinition,
  AgenticRoleChapter,
  Difficulty
} from './agenticRoleTypes';
import { agenticRoleDefinitions } from './data';
import AgenticRolesLayout from './views/AgenticRolesLayout';
import AgenticRolesHub from './views/AgenticRolesHub';
import AgenticRolesRunner from './views/AgenticRolesRunner';
import AgenticRolesSearchView from './views/AgenticRolesSearchView';
import { toast } from 'sonner';

interface AgenticRolesContainerProps {
  isLocked?: boolean;
  onConsumeEnergy?: () => boolean;
  initialRoleId?: string;
  initialChapterId?: string;
  onExitToDevLush?: () => void;
}

export const AgenticRolesContainer: React.FC<AgenticRolesContainerProps> = ({
  isLocked = false,
  onConsumeEnergy,
  initialRoleId,
  initialChapterId,
  onExitToDevLush
}) => {
  const roles: AgenticRoleDefinition[] = agenticRoleDefinitions;

  const [activeRoleId, setActiveRoleId] = useState<string>(
    initialRoleId || roles[0]?.id || 'seo-agentic-analyst'
  );
  const [selectedChapter, setSelectedChapter] = useState<AgenticRoleChapter | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>([]);

  // Find active role
  const activeRole = roles.find((r) => r.id === activeRoleId) || roles[0];

  // Handle initial chapter deep-linking
  useEffect(() => {
    if (initialChapterId && activeRole) {
      const ch = activeRole.chapters.find((c) => c.labComponentId === initialChapterId);
      if (ch) setSelectedChapter(ch);
    }
  }, [initialChapterId, activeRole]);

  // Global Keyboard listener for ⌘K / Ctrl+K search and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const handleLaunchChapter = (chapter: AgenticRoleChapter) => {
    if (isLocked) {
      toast.error("Interaction locked! Study energy depleted.");
      return;
    }

    if (onConsumeEnergy) {
      const allowed = onConsumeEnergy();
      if (!allowed) {
        toast.error("Insufficient energy to launch mission.");
        return;
      }
    }

    setSelectedChapter(chapter);
  };

  const handleCompleteChapter = (labComponentId: string) => {
    if (!completedChapterIds.includes(labComponentId)) {
      setCompletedChapterIds((prev) => [...prev, labComponentId]);
      toast.success("Mission Milestone Completed! Progression saved to career portfolio.");
    }
  };

  const handleSelectSearchResult = (roleId: string, chapter: AgenticRoleChapter) => {
    setActiveRoleId(roleId);
    setSelectedChapter(chapter);
    setIsSearchOpen(false);
  };

  return (
    <AgenticRolesLayout
      roles={roles}
      activeRoleId={activeRoleId}
      onSelectRole={(roleId) => {
        setActiveRoleId(roleId);
        setSelectedChapter(null);
      }}
      selectedDifficulty={selectedDifficulty}
      onSelectDifficulty={setSelectedDifficulty}
      onOpenSearch={() => setIsSearchOpen(true)}
      onExitToDevLush={onExitToDevLush}
    >
      {selectedChapter ? (
        <AgenticRolesRunner
          chapter={selectedChapter}
          role={activeRole}
          onBack={() => setSelectedChapter(null)}
          onCompleteChapter={handleCompleteChapter}
        />
      ) : (
        <AgenticRolesHub
          role={activeRole}
          onLaunchChapter={handleLaunchChapter}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          completedChapterIds={completedChapterIds}
        />
      )}

      {/* Global Search Dialog Modal */}
      {isSearchOpen && (
        <AgenticRolesSearchView
          roles={roles}
          onSelectChapter={handleSelectSearchResult}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </AgenticRolesLayout>
  );
};

export default AgenticRolesContainer;
