
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './agentDevRootComponents/Navbar';
import Footer from './agentDevRootComponents/Footer';
import { ReadingView } from './agentDevRootComponents/ReadingView';
import { ArticlesView } from './agentDevRootComponents/ArticlesView';
import { BlogsView } from './agentDevRootComponents/BlogsView';
import DevLushContainer from './devLushComponents/DevLushContainer';
import { AgentWorkspace } from './agentWorkspaceComponents/AgentWorkspace';
import GeminiChatWidget from './agentDevRootComponents/GeminiChatWidget';
import { TextSelectionPopover } from './agentDevRootComponents/TextSelectionPopover';
import { Toaster, toast } from 'sonner';
import { FavoritesProvider } from './agentDevRootComponents/FavoritesContext';
import { TheoryCollectionProvider } from './agentDevRootComponents/TheoryCollectionContext';
import FavoritesView from './agentDevRootComponents/FavoritesView';
import TopicTheoryHub from './agentDevRootComponents/TopicTheoryView/TopicTheoryHub';
import LandingPage from './landingPage/LandingPage';
import AgenticRolesContainer from './agenticRoles/AgenticRolesContainer';

interface Props {
  onExit: () => void;
}

export const DevLabsAgentWorkspaceView: React.FC<Props> = ({ onExit }) => {
    // -- Settings & State --
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isAppLocked, setIsAppLocked] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const [showAiAssistant, setShowAiAssistant] = useState(true);
    
    // Energy System
    const [isInfiniteEnergy, setIsInfiniteEnergy] = useState(false);
    const [studyEnergy, setStudyEnergy] = useState(15);
    const [energyLockoutTime, setEnergyLockoutTime] = useState(0);
    
    const [currentView, setCurrentView] = useState<'landing' | 'devlush-search' | 'reading' | 'articles' | 'blogs' | 'favorites' | 'topic-theory' | 'devlush' | 'agentic-roles' | 'agent-workspace'>('landing');

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

    // Energy Regeneration Logic
    useEffect(() => {
        if (isInfiniteEnergy) return;

        const checkEnergyStatus = () => {
            const now = Date.now();
            
            if (energyLockoutTime > 0 && now > energyLockoutTime) {
                setEnergyLockoutTime(0);
                setStudyEnergy(15);
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
                return;
            }

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            if (rect.width > 0 && rect.height > 0) {
                setSelectionRect(rect);
                setSelectedText(selection.toString());
            }
        };

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
        
        if (energyLockoutTime > 0 && Date.now() < energyLockoutTime) {
            return false;
        }

        if (studyEnergy > 0) {
            const newEnergy = studyEnergy - 1;
            setStudyEnergy(newEnergy);
            
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

    const handleAskAI = () => {
        setAiPrompt({
            fullPrompt: `Explain this text in the context of biology or medicine: "${selectedText}"`,
            userText: `Explain: "${selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText}"`
        });
        setSelectionRect(null);
        window.getSelection()?.removeAllRanges();
    };

    const handleClosePopover = () => {
        setSelectionRect(null);
        window.getSelection()?.removeAllRanges();
    };

    const handleSimulationComplete = () => {
    };

    const handleViewChange = (view: typeof currentView) => {
        setCurrentView(view);
    };

    // -- Render --

    return (
        <FavoritesProvider>
            <TheoryCollectionProvider>
                <div className={`relative w-full h-full flex flex-col overflow-hidden bg-background text-foreground font-sans ${theme}`}>
                <Toaster richColors theme={theme} position="top-center" />
                
                <Navbar 
                    isAppLocked={isAppLocked}
                    onToggleLockMode={() => setIsAppLocked(!isAppLocked)}
                    theme={theme}
                    onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                    studyEnergy={studyEnergy}
                    isInfiniteEnergy={isInfiniteEnergy}
                    onToggleInfiniteEnergy={() => setIsInfiniteEnergy(!isInfiniteEnergy)}
                    energyLockoutTime={energyLockoutTime}
                    currentView={currentView}
                    onViewChange={handleViewChange}
                    focusMode={focusMode}
                    onToggleFocusMode={() => setFocusMode(!focusMode)}
                    showAiAssistant={showAiAssistant}
                    onToggleAiAssistant={() => setShowAiAssistant(!showAiAssistant)}
                />

                <main className="flex-1 overflow-hidden relative">

                    {currentView === 'landing' && <LandingPage />}

                    {(currentView === 'devlush' || currentView === 'devlush-search') && (
                        <DevLushContainer 
                            isLocked={isInteractionLocked}
                            onConsumeEnergy={consumeEnergy}
                            initialChapterId={null}
                            onSimulationComplete={handleSimulationComplete}
                            onSearchClick={() => setCurrentView('devlush-search')}
                            initialSearchOpen={currentView === 'devlush-search'}
                        />
                    )}

                    {currentView === 'agent-workspace' && (
                        <AgentWorkspace />
                    )}

                    {currentView === 'agentic-roles' && (
                        <AgenticRolesContainer 
                            isLocked={isInteractionLocked}
                            onConsumeEnergy={consumeEnergy}
                            onExitToDevLush={() => setCurrentView('devlush')}
                        />
                    )}

                    {currentView === 'reading' && <ReadingView />}
                    
                    {currentView === 'articles' && <ArticlesView />}

                    {currentView === 'blogs' && <BlogsView />}

                    {currentView === 'favorites' && (
                        <FavoritesView onLaunch={() => {}} />
                    )}

                    {currentView === 'topic-theory' && (
                        <TopicTheoryHub />
                    )}
                    
                    <GeminiChatWidget 
                        isActivityOpen={true} 
                        onOpenChatBook={() => setCurrentView('reading')}
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
                    <Footer theme={theme} currentView={currentView as any} />
                )}
            </div>
            </TheoryCollectionProvider>
        </FavoritesProvider>
    );
};
