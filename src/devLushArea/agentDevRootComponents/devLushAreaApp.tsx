
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Navbar from './Navbar';
import { Footer as RootFooter } from '../../rootHomePage/Footer';
import { ReadingView } from './ReadingView';
import { ArticlesView } from './ArticlesView';
import { BlogsView } from './BlogsView';
import DevLushContainer from '../devLushComponents/DevLushContainer';
import { AgentWorkspace } from '../agentWorkspaceComponents/AgentWorkspace';
import GeminiChatWidget from './GeminiChatWidget';
import { TextSelectionPopover } from './TextSelectionPopover';
import { LabData, ConceptCourse } from './types';
import { Toaster, toast } from 'sonner';
import { FavoritesProvider } from './FavoritesContext';
import { TheoryCollectionProvider } from './TheoryCollectionContext';
import FavoritesView from './FavoritesView';
import type { FavoriteItem } from './FavoritesContext';
import type { SavedTheory } from './TheoryCollectionContext';
import TopicTheoryHub from './TopicTheoryView/TopicTheoryHub';
import LandingPage from '../landingPage/LandingPage';
import AgenticRolesContainer from '../agenticRoles/AgenticRolesContainer';
import { agenticRoleDefinitions } from '../agenticRoles/data';
import { getAgentLabTopic } from '../agentLabsData';


import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Beaker, Atom, Microscope, Settings, Info, Zap } from 'lucide-react';


const navItems = [
    { id: 'Med Labs', icon: <Atom size={12} /> },
    { id: 'Symptoms Labs', icon: <Beaker size={12} /> },
    { id: 'Research', icon: <Microscope size={12} /> }
];

// --- Types ---
interface EnrichedConceptData extends ConceptCourse {
    chapters: LabData[];
}
interface AppProps {
    onExit?: () => void;
    onNavigateFinhub?: () => void;
    initialAgentLabTopicSlug?: string;
}

type DevLushView = 'landing' | 'devlush-search' | 'reading' | 'articles' | 'blogs' | 'favorites' | 'topic-theory' | 'devlush' | 'agentic-roles' | 'agent-workspace';
const DEV_LUSH_VIEWS: DevLushView[] = ['landing', 'devlush-search', 'reading', 'articles', 'blogs', 'favorites', 'topic-theory', 'devlush', 'agentic-roles', 'agent-workspace'];

const readHistoryView = (state: unknown): DevLushView => {
    const view = state && typeof state === 'object' ? (state as { devLushView?: unknown }).devLushView : undefined;
    return typeof view === 'string' && DEV_LUSH_VIEWS.includes(view as DevLushView) ? view as DevLushView : 'landing';
};

const readHistoryChapterId = (state: unknown): string | undefined => {
    const chapterId = state && typeof state === 'object'
        ? (state as { devLushChapterId?: unknown }).devLushChapterId
        : undefined;
    return typeof chapterId === 'string' ? chapterId : undefined;
};

const readHistoryRolesRoleId = (state: unknown): string | undefined => {
    const roleId = state && typeof state === 'object'
        ? (state as { devLushRolesRoleId?: unknown }).devLushRolesRoleId
        : undefined;
    return typeof roleId === 'string' ? roleId : undefined;
};

const readHistoryRolesChapterId = (state: unknown): string | undefined => {
    const chapterId = state && typeof state === 'object'
        ? (state as { devLushRolesChapterId?: unknown }).devLushRolesChapterId
        : undefined;
    return typeof chapterId === 'string' ? chapterId : undefined;
};

const readHistoryRolesSearchOpen = (state: unknown): boolean => Boolean(
    state && typeof state === 'object'
    && (state as { devLushRolesSearchOpen?: unknown }).devLushRolesSearchOpen === true,
);

// --- MedLab Container Removed ---

// --- Main App Component ---
const App: React.FC<AppProps> = ({ onExit, onNavigateFinhub, initialAgentLabTopicSlug }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialAgentLabTopic = getAgentLabTopic(initialAgentLabTopicSlug);
    const requestedRoleId = new URLSearchParams(location.search).get('role');
    const deepLinkedRoleId = agenticRoleDefinitions.some(role => role.id === requestedRoleId) ? requestedRoleId : null;
    // -- Settings & State --
    // Default theme set to light
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isAppLocked, setIsAppLocked] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    // Keep the default learning path focused; the helper remains available from contextual tools.
    const [showAiAssistant, setShowAiAssistant] = useState(false);
    
    // Energy System
    const [isInfiniteEnergy, setIsInfiniteEnergy] = useState(false);
    const [studyEnergy, setStudyEnergy] = useState(15);
    const [energyLockoutTime, setEnergyLockoutTime] = useState(0);
    
    const [currentView, setCurrentView] = useState<DevLushView>(() => initialAgentLabTopic ? 'devlush' : readHistoryView(location.state) === 'landing' && deepLinkedRoleId ? 'agentic-roles' : readHistoryView(location.state));
    const [pendingFavoriteChapterId, setPendingFavoriteChapterId] = useState<string | null>(null);

    const navigateView = useCallback((view: DevLushView) => {
        if (view === currentView && !initialAgentLabTopic) return;
        setCurrentView(view);
        const nextState = location.state && typeof location.state === 'object'
            ? { ...(location.state as Record<string, unknown>) }
            : {};
        delete nextState.devLushChapterId;
        delete nextState.devLushReadingTopic;
        delete nextState.devLushRolesRoleId;
        delete nextState.devLushRolesChapterId;
        delete nextState.devLushRolesSearchOpen;
        delete nextState.devLushWorkspaceView;
        if (view === 'devlush-search') nextState.devLushSearchEntry = true;
        else delete nextState.devLushSearchEntry;
        navigate(initialAgentLabTopic ? '/lab' : `${location.pathname}${location.search}`, {
            replace: Boolean(initialAgentLabTopic),
            state: { ...nextState, devLushView: view },
        });
    }, [currentView, initialAgentLabTopic, location.pathname, location.search, location.state, navigate]);

    const openRoleFromLanding = (roleId: string) => {
        if (!agenticRoleDefinitions.some((role) => role.id === roleId)) return;
        const nextState = location.state && typeof location.state === 'object'
            ? { ...(location.state as Record<string, unknown>) }
            : {};
        delete nextState.devLushChapterId;
        delete nextState.devLushReadingTopic;
        delete nextState.devLushRolesChapterId;
        delete nextState.devLushRolesSearchOpen;
        delete nextState.devLushWorkspaceView;
        setCurrentView('agentic-roles');
        navigate('/lab', {
            replace: Boolean(initialAgentLabTopic),
            state: { ...nextState, devLushView: 'agentic-roles', devLushRolesRoleId: roleId },
        });
    };

    const pushChapterHistoryEntry = (chapterId: string) => {
        const currentState = location.state && typeof location.state === 'object'
            ? { ...(location.state as Record<string, unknown>) }
            : {};
        navigate(`${location.pathname}${location.search}`, {
            state: { ...currentState, devLushView: currentView, devLushChapterId: chapterId },
        });
    };

    const pushRolesSearchEntry = () => {
        if (readHistoryRolesSearchOpen(location.state)) return;
        const currentState = location.state && typeof location.state === 'object'
            ? { ...(location.state as Record<string, unknown>) }
            : {};
        navigate(`${location.pathname}${location.search}`, {
            state: { ...currentState, devLushView: currentView, devLushRolesSearchOpen: true },
        });
    };

    const pushRolesChapterEntry = (roleId: string, chapterId: string) => {
        const currentState = location.state && typeof location.state === 'object'
            ? { ...(location.state as Record<string, unknown>) }
            : {};
        navigate(`${location.pathname}${location.search}`, {
            state: {
                ...currentState,
                devLushView: currentView,
                devLushRolesRoleId: roleId,
                devLushRolesChapterId: chapterId,
                devLushRolesSearchOpen: false,
            },
        });
    };

    const pushRolesHubEntry = (roleId: string) => {
        const currentState = location.state && typeof location.state === 'object'
            ? { ...(location.state as Record<string, unknown>) }
            : {};
        delete currentState.devLushRolesChapterId;
        delete currentState.devLushRolesSearchOpen;
        navigate(`${location.pathname}${location.search}`, {
            state: { ...currentState, devLushView: currentView, devLushRolesRoleId: roleId },
        });
    };

    const replaceWithDevLushTopics = () => {
        const nextState = location.state && typeof location.state === 'object'
            ? { ...(location.state as Record<string, unknown>) }
            : {};
        delete nextState.devLushChapterId;
        delete nextState.devLushSearchEntry;
        delete nextState.devLushReadingTopic;
        delete nextState.devLushRolesRoleId;
        delete nextState.devLushRolesChapterId;
        delete nextState.devLushRolesSearchOpen;
        delete nextState.devLushWorkspaceView;
        navigate(initialAgentLabTopic ? '/lab' : `${location.pathname}${location.search}`, {
            replace: true,
            state: { ...nextState, devLushView: 'devlush' },
        });
    };



    // Text Selection & AI Prompt State
    const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
    const [selectedText, setSelectedText] = useState<string>("");
    const [aiPrompt, setAiPrompt] = useState<{ fullPrompt: string; userText: string; } | null>(null);

    // -- Effects --

    // Theme Effect
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    useEffect(() => {
        const historyView = readHistoryView(location.state);
        setCurrentView(initialAgentLabTopic ? 'devlush' : historyView === 'landing' && deepLinkedRoleId ? 'agentic-roles' : historyView);
    }, [initialAgentLabTopic, deepLinkedRoleId, location.key, location.state]);

    // Energy Regeneration Logic
    useEffect(() => {
        if (isInfiniteEnergy) return;

        const checkEnergyStatus = () => {
            const now = Date.now();
            
            // If locked out and time has passed
            if (energyLockoutTime > 0 && now > energyLockoutTime) {
                setEnergyLockoutTime(0);
                setStudyEnergy(15); // Full refill
                toast.success("Energy fully recharged!");
            }
        };

        const timer = setInterval(checkEnergyStatus, 1000); 
        return () => clearInterval(timer);
    }, [isInfiniteEnergy, energyLockoutTime]);



    // Handle Text Selection for AI
    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed || !selection.toString().trim()) {
                // Delay clearing slightly to allow button clicks on the popover if needed, 
                // but since the popover has a backdrop, usually direct interaction handles it.
                // For simplicity, we only clear if we are not clicking the popover itself (handled by backdrop).
                return;
            }

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // Only show if selection is visible and has width
            if (rect.width > 0 && rect.height > 0) {
                setSelectionRect(rect);
                setSelectedText(selection.toString());
            }
        };

        // We use mouseup/keyup to detect end of selection action
        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('keyup', handleSelection);

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('keyup', handleSelection);
        };
    }, []);

    // -- Handlers --

    const consumeEnergy = useCallback((): boolean => {
        if (isInfiniteEnergy) return true;
        
        // If already locked out
        if (energyLockoutTime > 0 && Date.now() < energyLockoutTime) {
            return false;
        }

        if (studyEnergy > 0) {
            const newEnergy = studyEnergy - 1;
            setStudyEnergy(newEnergy);
            
            // If we just hit 0, start the 12 hour timer
            if (newEnergy === 0) {
                const twelveHours = 12 * 60 * 60 * 1000;
                setEnergyLockoutTime(Date.now() + twelveHours);
                toast.warning("Energy depleted. Recharging for 12 hours.");
            }
            return true;
        } 
        
        return false;
    }, [isInfiniteEnergy, studyEnergy, energyLockoutTime]);

    const isInteractionLocked = isAppLocked || (!isInfiniteEnergy && studyEnergy <= 0);

    const launchFavoriteAgenticRole = (favorite: FavoriteItem) => {
        const role = agenticRoleDefinitions.find((item) => item.id === favorite.courseId);
        if (!role?.chapters.some((chapter) => chapter.labComponentId === favorite.id)) {
            toast.error('This saved Agentic Role lab is no longer available.');
            return;
        }
        if (isInteractionLocked || !consumeEnergy()) {
            toast.error('Simulation Locked: Insufficient Energy or App Locked');
            return;
        }

        const currentState = location.state && typeof location.state === 'object'
            ? { ...(location.state as Record<string, unknown>) }
            : {};
        delete currentState.devLushChapterId;
        delete currentState.devLushRolesSearchOpen;
        delete currentState.devLushWorkspaceView;
        setCurrentView('agentic-roles');
        navigate(`${location.pathname}${location.search}`, {
            state: {
                ...currentState,
                devLushView: 'agentic-roles',
                devLushRolesRoleId: role.id,
                devLushRolesChapterId: favorite.id,
                devLushRolesSearchOpen: false,
            },
        });
    };

    const launchFavoriteRoadmapItem = (favorite: FavoriteItem) => {
        const path = `/roadmap/${encodeURIComponent(favorite.courseId)}/${encodeURIComponent(favorite.id)}`;
        window.history.pushState({ roadmapChapterEntry: true }, '', path);
        window.location.reload();
    };

    const handleAskAI = () => {
        setAiPrompt({
            fullPrompt: `Explain this text in the context of biology or medicine: "${selectedText}"`,
            userText: `Explain: "${selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText}"`
        });
        // Clear selection UI
        setSelectionRect(null);
        window.getSelection()?.removeAllRanges();
    };

    const handleClosePopover = () => {
        setSelectionRect(null);
        window.getSelection()?.removeAllRanges();
    };

    // -- Render --

    return (
        <FavoritesProvider>
            <TheoryCollectionProvider>
                <div className={`relative flex flex-col h-screen overflow-hidden bg-background text-foreground font-sans ${theme}`}>
                <Toaster richColors theme={theme} position="top-center" />
                
                <Navbar
                    isAppLocked={isAppLocked}
                    onToggleLockMode={() => setIsAppLocked(!isAppLocked)}
                    theme={theme}
                    onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    studyEnergy={studyEnergy}
                    isInfiniteEnergy={isInfiniteEnergy}
                    onToggleInfiniteEnergy={() => setIsInfiniteEnergy(!isInfiniteEnergy)}
                    energyLockoutTime={energyLockoutTime}
                    currentView={currentView}
                    onViewChange={(view: DevLushView) => navigateView(view)}
                    focusMode={focusMode}
                    onToggleFocusMode={() => setFocusMode(!focusMode)}
                    showAiAssistant={showAiAssistant}
                    onToggleAiAssistant={() => setShowAiAssistant(!showAiAssistant)}
                    onExit={onExit || (() => window.location.assign('/'))}
                    onNavigateFinhub={onNavigateFinhub}
                />

                <main className="flex-1 overflow-hidden relative">

                    {currentView === 'landing' && <LandingPage onOpenTopics={() => navigateView('devlush')} onOpenTheory={() => navigateView('topic-theory')} onOpenSearch={() => navigateView('devlush-search')} onOpenRole={openRoleFromLanding} />}

                    {(currentView === 'devlush' || currentView === 'devlush-search') && (
                        <DevLushContainer 
                            isLocked={isInteractionLocked}
                            onConsumeEnergy={consumeEnergy}
                            initialChapterId={pendingFavoriteChapterId}
                            initialTopicId={initialAgentLabTopic?.courseId}
                            onChapterOpened={() => setPendingFavoriteChapterId(null)}
                            onSearchClick={() => navigateView('devlush-search')}
                            onSavedClick={() => navigateView('favorites')}
                            onSearchClose={() => {
                                if (currentView === 'devlush-search' && location.state && typeof location.state === 'object'
                                    && (location.state as Record<string, unknown>).devLushSearchEntry === true) {
                                    navigate(-1);
                                } else {
                                    navigateView('devlush');
                                }
                            }}
                            initialSearchOpen={currentView === 'devlush-search'}
                            routeChapterId={readHistoryChapterId(location.state) ?? initialAgentLabTopic?.chapterId}
                            onChapterRoutePush={pushChapterHistoryEntry}
                            onChapterRouteBack={() => {
                                if (initialAgentLabTopic && !readHistoryChapterId(location.state)) {
                                    navigate('/lab', { replace: true, state: { devLushView: 'devlush' } });
                                } else {
                                    navigate(-1);
                                }
                            }}
                            onTopicHubReplace={replaceWithDevLushTopics}
                            onExit={onExit}
                        />
                    )}

                    {currentView === 'agent-workspace' && (
                        <AgentWorkspace />
                    )}

                    {currentView === 'agentic-roles' && (
                        <AgenticRolesContainer 
                            initialRoleId={deepLinkedRoleId || undefined}
                            isLocked={isInteractionLocked}
                            onConsumeEnergy={consumeEnergy}
                            onExitToDevLush={() => navigateView('devlush')}
                            onShowSaved={() => navigateView('favorites')}
                            routeRoleId={readHistoryRolesRoleId(location.state)}
                            routeChapterId={readHistoryRolesChapterId(location.state)}
                            routeSearchOpen={readHistoryRolesSearchOpen(location.state)}
                            onChapterRoutePush={pushRolesChapterEntry}
                            onChapterRouteBack={() => navigate(-1)}
                            onSearchRoutePush={pushRolesSearchEntry}
                            onSearchRouteBack={() => navigate(-1)}
                            onRoleRoutePush={pushRolesHubEntry}
                        />
                    )}

                    {currentView === 'reading' && <ReadingView onBrowseTopics={() => navigateView('devlush')} />}
                    
                    {currentView === 'articles' && <ArticlesView onBrowseTopics={() => navigateView('devlush')} />}

                    {currentView === 'blogs' && (
                        <BlogsView
                            routeByUrl={false}
                            onBackToWorkspace={() => navigateView('landing')}
                            backToWorkspaceLabel="Back to Agent Labs"
                        />
                    )}

                    {currentView === 'favorites' && (
                        <FavoritesView onBrowseTopics={() => navigateView('devlush')} onSearchTopics={() => navigateView('devlush-search')} onLaunch={(favorite: FavoriteItem) => {
                            if (favorite.type === 'roadmap_lab' || favorite.type === 'roadmap_reading') {
                                launchFavoriteRoadmapItem(favorite);
                                return;
                            }
                            if (favorite.type === 'agentic_role_lab') {
                                launchFavoriteAgenticRole(favorite);
                                return;
                            }
                            setPendingFavoriteChapterId(favorite.id);
                            navigateView('devlush');
                        }} />
                    )}

                    {currentView === 'topic-theory' && (
                        <TopicTheoryHub onOpenSource={(item: SavedTheory) => {
                            const role = agenticRoleDefinitions.find(candidate => candidate.chapters.some(chapter => chapter.labComponentId === item.labId));
                            if (role) {
                                launchFavoriteAgenticRole({ id: item.labId, type: 'agentic_role_lab', title: item.chapterTitle, courseId: role.id, collection: 'Favorites', timestamp: item.savedAt });
                                return;
                            }
                            if (item.courseType !== 'devLush' || item.labId === 'unknown') return;
                            setPendingFavoriteChapterId(item.labId);
                            navigateView('devlush');
                        }} />
                    )}
                    
                    <GeminiChatWidget 
                        isActivityOpen={true} 
                        onOpenChatBook={() => navigateView('reading')}
                        initialPrompt={aiPrompt}
                        onPromptHandled={() => setAiPrompt(null)}
                        isVisible={showAiAssistant}
                    />

                    {selectionRect && (
                        <TextSelectionPopover 
                            rect={selectionRect}
                            onAskAI={handleAskAI}
                            onClose={handleClosePopover}
                        />
                    )}


                </main>
                {!['landing', 'devlush', 'devlush-search', 'agentic-roles', 'agent-workspace', 'topic-theory'].includes(currentView as any) && (
                    <RootFooter
                        theme={theme}
                        onNavigateFinhub={onNavigateFinhub || (() => window.location.assign('/finhub'))}
                        onNavigateCodeConcepts={() => window.location.assign('/code_concepts/general')}
                        onNavigateDevLush={() => navigateView('landing')}
                        onNavigateBlogs={() => window.location.assign('/blogs')}
                    />
                )}
            </div>
            </TheoryCollectionProvider>
        </FavoritesProvider>
    );
};

export default App;
