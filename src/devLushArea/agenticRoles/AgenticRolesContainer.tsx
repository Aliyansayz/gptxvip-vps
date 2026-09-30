import React, { useState, useEffect, useRef } from 'react';
import { AgenticRoleDefinition, AgenticRoleChapter } from './agenticRoleTypes';
import { agenticRoleDefinitions } from './data';
import AgenticRolesLayout from './views/AgenticRolesLayout';
import AgenticRolesHub from './views/AgenticRolesHub';
import AgenticRolesRunner from './views/AgenticRolesRunner';
import AgenticRolesSearchView from './views/AgenticRolesSearchView';
import { toast } from 'sonner';
import { useFavorites } from '../agentDevRootComponents/FavoritesContext';

interface AgenticRolesContainerProps {
  isLocked?: boolean;
  onConsumeEnergy?: () => boolean;
  initialRoleId?: string;
  initialChapterId?: string;
  onInitialChapterOpened?: () => void;
  onExitToDevLush?: () => void;
  routeRoleId?: string;
  routeChapterId?: string;
  routeSearchOpen?: boolean;
  onChapterRoutePush?: (roleId: string, chapterId: string) => void;
  onChapterRouteBack?: () => void;
  onSearchRoutePush?: () => void;
  onSearchRouteBack?: () => void;
  onRoleRoutePush?: (roleId: string) => void;
  onShowSaved?: () => void;
}

export const AgenticRolesContainer: React.FC<AgenticRolesContainerProps> = ({
  isLocked = false,
  onConsumeEnergy,
  initialRoleId,
  initialChapterId,
  onInitialChapterOpened,
  onExitToDevLush,
  routeRoleId,
  routeChapterId,
  routeSearchOpen = false,
  onChapterRoutePush,
  onChapterRouteBack,
  onSearchRoutePush,
  onSearchRouteBack,
  onRoleRoutePush,
  onShowSaved,
}) => {
  const roles: AgenticRoleDefinition[] = agenticRoleDefinitions;

  const [activeRoleId, setActiveRoleId] = useState<string>(
    initialRoleId || roles[0]?.id || 'seo-agentic-analyst'
  );
  const [selectedChapter, setSelectedChapter] = useState<AgenticRoleChapter | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const routeChapterEntryRef = useRef<string | undefined>(undefined);
  const routeSearchEntryRef = useRef(false);
  const searchOpenerRef = useRef<HTMLElement | null>(null);
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('agentic_completed_chapters');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('agentic_completed_chapters', JSON.stringify(completedChapterIds));
    } catch (e) {
      // fallback
    }
  }, [completedChapterIds]);

  // Find active role
  const activeRole = roles.find((r) => r.id === activeRoleId) || roles[0];

  useEffect(() => {
    if (initialRoleId && roles.some(role => role.id === initialRoleId)) setActiveRoleId(initialRoleId);
  }, [initialRoleId, roles]);

  let favoritesCtx: ReturnType<typeof useFavorites> | null = null;
  try {
    favoritesCtx = useFavorites();
  } catch {
    // The role explorer can still run when mounted outside the saved-items provider.
  }

  useEffect(() => {
    if (routeRoleId && roles.some((role) => role.id === routeRoleId)) {
      setActiveRoleId(routeRoleId);
    }
  }, [routeRoleId, roles]);

  // Handle initial chapter deep-linking
  useEffect(() => {
    if (!initialChapterId) return;
    if (!activeRole) {
      onInitialChapterOpened?.();
      return;
    }
    const chapter = activeRole.chapters.find((item) => item.labComponentId === initialChapterId);
    if (chapter) setSelectedChapter(chapter);
    else toast.error('This saved Agentic Role lab is no longer available.');
    onInitialChapterOpened?.();
  }, [initialChapterId, activeRole, onInitialChapterOpened]);

  useEffect(() => {
    if (!routeChapterId) {
      if (routeChapterEntryRef.current) {
        routeChapterEntryRef.current = undefined;
        setSelectedChapter(null);
      }
    } else {
      routeChapterEntryRef.current = routeChapterId;
      const role = routeRoleId ? roles.find((item) => item.id === routeRoleId) : undefined;
      const chapter = role?.chapters.find((item) => item.labComponentId === routeChapterId);
      if (role && chapter) {
        setActiveRoleId(role.id);
        setSelectedChapter(chapter);
      } else {
        setSelectedChapter(null);
      }
    }

    if (routeSearchOpen) {
      routeSearchEntryRef.current = true;
      setIsSearchOpen(true);
    } else {
      if (routeSearchEntryRef.current) routeSearchEntryRef.current = false;
      setIsSearchOpen(false);
    }
  }, [routeRoleId, routeChapterId, routeSearchOpen, roles]);

  // Global Keyboard listener for ⌘K / Ctrl+K search and Escape
  useEffect(() => {
    const restoreSearchFocus = () => window.requestAnimationFrame(() => {
      const opener = searchOpenerRef.current;
      if (opener?.isConnected && opener.getClientRects().length > 0) opener.focus();
      else document.querySelector<HTMLButtonElement>('[aria-label="Explore Agentic Roles"]')?.focus();
    });
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isSearchOpen) {
          setIsSearchOpen(false);
          if (routeSearchOpen) onSearchRouteBack?.();
          restoreSearchFocus();
        } else {
          searchOpenerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          setIsSearchOpen(true);
          onSearchRoutePush?.();
        }
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        if (routeSearchOpen) onSearchRouteBack?.();
        restoreSearchFocus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, routeSearchOpen, onSearchRouteBack, onSearchRoutePush]);

  const handleLaunchChapter = (chapter: AgenticRoleChapter, roleId = activeRole.id) => {
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

    setActiveRoleId(roleId);
    setSelectedChapter(chapter);
    setIsSearchOpen(false);
    onChapterRoutePush?.(roleId, chapter.labComponentId);
  };

  const handleCompleteChapter = (labComponentId: string) => {
    if (!completedChapterIds.includes(labComponentId)) {
      setCompletedChapterIds((prev) => [...prev, labComponentId]);
      toast.success("Case completed. Your role progress has been saved.");
    }
  };

  const handleSelectSearchResult = (roleId: string, chapter: AgenticRoleChapter) => {
    handleLaunchChapter(chapter, roleId);
  };

  const handleSearchOpen = () => {
    if (isSearchOpen) return;
    searchOpenerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsSearchOpen(true);
    onSearchRoutePush?.();
  };

  const handleSearchClose = () => {
    if (!isSearchOpen) return;
    setIsSearchOpen(false);
    if (routeSearchOpen) onSearchRouteBack?.();
    window.requestAnimationFrame(() => {
      const opener = searchOpenerRef.current;
      if (opener?.isConnected && opener.getClientRects().length > 0) opener.focus();
      else document.querySelector<HTMLButtonElement>('[aria-label="Explore Agentic Roles"]')?.focus();
    });
  };

  const handleShowHub = () => {
    if (isSearchOpen) handleSearchClose();
  };

  const handleRoleSelect = (roleId: string) => {
    const hasNestedView = Boolean(selectedChapter || routeChapterId || isSearchOpen || routeSearchOpen);
    if (roleId === activeRoleId && !hasNestedView) return;

    setActiveRoleId(roleId);
    setSelectedChapter(null);
    setIsSearchOpen(false);
    onRoleRoutePush?.(roleId);
  };

  const handleChapterBack = () => {
    setSelectedChapter(null);
    if (routeChapterId) onChapterRouteBack?.();
  };

  return (
    <AgenticRolesLayout
      roles={roles}
      activeRoleId={activeRoleId}
      onSelectRole={handleRoleSelect}
      onOpenSearch={handleSearchOpen}
      onShowHub={handleShowHub}
      onShowSaved={onShowSaved || (() => undefined)}
      onExitToDevLush={onExitToDevLush}
      isSearchOpen={isSearchOpen}
      isRunning={Boolean(selectedChapter)}
      savedCount={favoritesCtx?.favorites.length || 0}
    >
      {selectedChapter ? (
        <AgenticRolesRunner
          chapter={selectedChapter}
          role={activeRole}
          onBack={handleChapterBack}
          onCompleteChapter={handleCompleteChapter}
        />
      ) : isSearchOpen ? (
        <AgenticRolesSearchView
          roles={roles}
          onSelectChapter={handleSelectSearchResult}
          onClose={handleSearchClose}
        />
      ) : (
        <AgenticRolesHub
          role={activeRole}
          onLaunchChapter={handleLaunchChapter}
          completedChapterIds={completedChapterIds}
        />
      )}
    </AgenticRolesLayout>
  );
};

export default AgenticRolesContainer;
