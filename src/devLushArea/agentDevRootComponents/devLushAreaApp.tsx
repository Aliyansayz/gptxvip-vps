
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
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
import TopicTheoryHub from './TopicTheoryView/TopicTheoryHub';
import LandingPage from '../landingPage/LandingPage';
import AgenticRolesContainer from '../agenticRoles/AgenticRolesContainer';


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
}

// --- MedLab Container Removed ---

// --- Main App Component ---
const App: React.FC<AppProps> = ({ onExit }) => {
    // -- Settings & State --
    // Default theme set to light
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

    const handleSimulationComplete = () => {
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
                    onViewChange={(view: any) => setCurrentView(view)}
                    focusMode={focusMode}
                    onToggleFocusMode={() => setFocusMode(!focusMode)}
                    showAiAssistant={showAiAssistant}
                    onToggleAiAssistant={() => setShowAiAssistant(!showAiAssistant)}
                    onExit={onExit || (() => window.location.assign('/'))}
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
                            onExit={onExit}
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

export default App;
