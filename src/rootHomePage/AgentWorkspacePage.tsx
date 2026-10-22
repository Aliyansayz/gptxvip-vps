import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AgentWorkspace, WORKSPACE_TITLES, type WorkspaceViewId } from '../devLushArea/agentWorkspaceComponents/AgentWorkspace';

export interface AgentWorkspacePageProps {
    initialView?: string;
    onNavigateHome?: () => void;
    onNavigateFinhub?: () => void;
    onNavigateCodeConcepts?: () => void;
    onNavigateAgents?: () => void;
    onNavigateProjectSurfaces?: () => void;
    onNavigateSoftware?: () => void;
    onNavigateBlogs?: () => void;
    onNavigateContact?: () => void;
}

export const AgentWorkspacePage: React.FC<AgentWorkspacePageProps> = ({
    initialView,
    onNavigateHome = () => window.location.assign('/'),
    onNavigateFinhub = () => window.location.assign('/finhub'),
    onNavigateCodeConcepts = () => window.location.assign('/code_concepts/general'),
    onNavigateAgents = () => window.location.assign('/agents'),
    onNavigateProjectSurfaces = () => window.location.assign('/agents/templates'),
    onNavigateSoftware,
    onNavigateBlogs = () => window.location.assign('/blogs'),
    onNavigateContact = () => window.location.assign('/contact'),
}) => {
    const [currentView, setCurrentView] = useState<string>(() => {
        if (initialView) return initialView;
        if (typeof window !== 'undefined') {
            const segments = window.location.pathname.split('/').filter(Boolean);
            const sub = segments[1];
            if (sub && WORKSPACE_TITLES[sub]) return sub;
        }
        return 'home';
    });

    useEffect(() => {
        if (initialView) {
            setCurrentView(initialView);
        }
    }, [initialView]);

    // Synchronize document title with active agent dashboard
    useEffect(() => {
        const previousTitle = document.title;
        if (currentView !== 'home' && WORKSPACE_TITLES[currentView]) {
            document.title = `${WORKSPACE_TITLES[currentView]} — Agent Workspace — GPTX.VIP`;
        } else {
            document.title = 'Agent Workspace — GPTX.VIP';
        }
        return () => {
            document.title = previousTitle;
        };
    }, [currentView]);

    const handleViewChange = (view: string) => {
        setCurrentView(view);
        if (typeof window !== 'undefined') {
            const nextPath = view === 'home' ? '/workspace' : `/workspace/${view}`;
            if (window.location.pathname !== nextPath) {
                window.history.pushState({ devLushWorkspaceView: view === 'home' ? undefined : view }, '', nextPath);
            }
        }
    };

    const isDashboardActive = currentView !== 'home';

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900">
            {/* Top Root Navbar */}
            <Navbar
                variant="glass"
                onNavigateFinhub={onNavigateFinhub}
                onNavigateCodeConcepts={onNavigateCodeConcepts}
                onNavigateAgentWorkspace={() => handleViewChange('home')}
                onNavigateAgents={onNavigateAgents}
                onNavigateProjectSurfaces={onNavigateProjectSurfaces}
                onNavigateBlogs={onNavigateBlogs}
                onNavigateSoftware={onNavigateSoftware}
                onBookDemo={onNavigateContact}
            />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col ${isDashboardActive ? 'h-[calc(100vh-4rem)] min-h-[600px] overflow-hidden' : 'min-h-[70vh]'}`}>
                <AgentWorkspace
                    currentView={currentView}
                    onViewChange={handleViewChange}
                    onBack={() => handleViewChange('home')}
                />
            </div>

            {/* Root Footer shown when browsing workspace hub */}
            {!isDashboardActive && (
                <Footer
                    theme="light"
                    accent="cyan"
                    onNavigateFinhub={onNavigateFinhub}
                    onNavigateDevLush={onNavigateAgents}
                    onNavigateBlogs={onNavigateBlogs}
                    onNavigateCodeConcepts={onNavigateCodeConcepts}
                    onNavigateProjectSurfaces={onNavigateProjectSurfaces}
                />
            )}
        </div>
    );
};

export default AgentWorkspacePage;
