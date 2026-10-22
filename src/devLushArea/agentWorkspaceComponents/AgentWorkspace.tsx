import React, { useEffect, useState, useCallback } from 'react';
import AgentWorkspaceHome from './AgentWorkspaceHome';
import ScannerAgentMainView from './securityAgent/scannerAgent/views/ScannerAgentMainView';
import EcommerceAgentMainView from './ecommerceAgent/views/EcommerceAgentMainView';
import DevtoolsAgentMainView from './devtoolsAgent/views/DevtoolsAgentMainView';
import DfirAgentMainView from './securityAgent/incident_response_agent/views/DfirAgentMainView';
import ThreatIntelAgentMainView from './securityAgent/threat_intelligence_agent/views/ThreatIntelAgentMainView';
import CloudPostureAgentMainView from './securityAgent/cloud_security_posture_agent/views/CloudPostureAgentMainView';
import SastAgentMainView from './securityAgent/source_code_auditor_agent/views/SastAgentMainView';
import RedTeamAgentMainView from './securityAgent/red_team_agent/views/RedTeamAgentMainView';
import LegalContractAgentMainView from './legalContractAgent/views/LegalContractAgentMainView';
import { ComprehensiveMemoryTypesLab } from './memoryTypesLab/ComprehensiveMemoryTypesLab';
import { ArrowLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import AgentPreviewNotice from './components/AgentPreviewNotice';

export const WORKSPACE_VIEWS = [
    'scanner-agent',
    'ecommerce-agent',
    'devtools-agent',
    'dfir-agent',
    'threat-intel-agent',
    'cloud-posture-agent',
    'sast-agent',
    'red-team-agent',
    'legal-contract-agent',
    'memory-types-lab',
] as const;

export type WorkspaceViewId = (typeof WORKSPACE_VIEWS)[number];

export const WORKSPACE_TITLES: Record<string, string> = {
    'scanner-agent': 'Scanner Agent',
    'ecommerce-agent': 'E-commerce Agent',
    'devtools-agent': 'DevTools Agent',
    'dfir-agent': 'Incident Response / DFIR Agent',
    'threat-intel-agent': 'Threat Intelligence Agent',
    'cloud-posture-agent': 'Cloud Security Posture Agent',
    'sast-agent': 'Source Code Auditor',
    'red-team-agent': 'Red Team Training Agent',
    'legal-contract-agent': 'Legal Contract Agent',
    'memory-types-lab': 'Memory Types Lab',
};

export interface AgentWorkspaceProps {
    initialView?: string;
    currentView?: string;
    onViewChange?: (view: string) => void;
    onBack?: () => void;
    hideTopNav?: boolean;
}

export const AgentWorkspace: React.FC<AgentWorkspaceProps> = ({
    initialView,
    currentView: controlledView,
    onViewChange,
    onBack,
    hideTopNav = false,
}) => {
    const readInitialView = (): string => {
        if (controlledView && (WORKSPACE_VIEWS.includes(controlledView as WorkspaceViewId) || controlledView === 'home')) {
            return controlledView;
        }
        if (initialView && (WORKSPACE_VIEWS.includes(initialView as WorkspaceViewId) || initialView === 'home')) {
            return initialView;
        }
        if (typeof window !== 'undefined') {
            const segments = window.location.pathname.split('/').filter(Boolean);
            const lastSegment = segments[segments.length - 1];
            if (lastSegment && WORKSPACE_VIEWS.includes(lastSegment as WorkspaceViewId)) {
                return lastSegment;
            }
            try {
                const state = window.history.state as { devLushWorkspaceView?: unknown } | null;
                const stateView = state?.devLushWorkspaceView;
                if (typeof stateView === 'string' && WORKSPACE_VIEWS.includes(stateView as WorkspaceViewId)) {
                    return stateView;
                }
            } catch {
                // Ignore history read error
            }
        }
        return 'home';
    };

    const [internalView, setInternalView] = useState<string>(readInitialView);
    const activeView = controlledView !== undefined ? controlledView : internalView;

    useEffect(() => {
        if (controlledView !== undefined) {
            setInternalView(controlledView);
        }
    }, [controlledView]);

    useEffect(() => {
        if (controlledView !== undefined) return;
        const handlePopState = () => {
            const segments = window.location.pathname.split('/').filter(Boolean);
            const lastSegment = segments[segments.length - 1];
            if (lastSegment && WORKSPACE_VIEWS.includes(lastSegment as WorkspaceViewId)) {
                setInternalView(lastSegment);
                return;
            }
            try {
                const state = window.history.state as { devLushWorkspaceView?: unknown } | null;
                const stateView = state?.devLushWorkspaceView;
                if (typeof stateView === 'string' && WORKSPACE_VIEWS.includes(stateView as WorkspaceViewId)) {
                    setInternalView(stateView);
                    return;
                }
            } catch {
                // Ignore
            }
            setInternalView('home');
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [controlledView]);

    const navigateWorkspaceView = useCallback((view: string) => {
        if (view === activeView) return;
        if (onViewChange) {
            onViewChange(view);
        } else {
            setInternalView(view);
            if (typeof window !== 'undefined') {
                const state = (window.history.state && typeof window.history.state === 'object')
                    ? { ...(window.history.state as Record<string, unknown>) }
                    : {};
                if (view === 'home') {
                    delete state.devLushWorkspaceView;
                } else {
                    state.devLushWorkspaceView = view;
                }
                const isWorkspacePath = window.location.pathname.startsWith('/workspace');
                const targetPath = isWorkspacePath
                    ? (view === 'home' ? '/workspace' : `/workspace/${view}`)
                    : window.location.pathname;
                window.history.pushState(state, '', `${targetPath}${window.location.search}`);
            }
        }
    }, [activeView, onViewChange]);

    const returnToWorkspaceHome = useCallback(() => {
        if (onBack) {
            onBack();
        } else if (activeView !== 'home') {
            navigateWorkspaceView('home');
        }
    }, [onBack, activeView, navigateWorkspaceView]);

    const isRedTeam = activeView === 'red-team-agent';
    const activeTitle = WORKSPACE_TITLES[activeView] || 'Agent Workspace';

    return (
        <div className="w-full h-full bg-slate-50 flex flex-col relative overflow-hidden">
            {!hideTopNav && activeView !== 'home' && (
                <header className="sticky top-0 z-20 flex min-h-13 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-2.5 backdrop-blur-md sm:px-6">
                    <div className="flex items-center gap-3">
                        <button 
                            type="button"
                            data-agent-workspace-back
                            onClick={returnToWorkspaceHome}
                            className="group inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label="Back to Agent Workspace overview"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                            <span>Back to Workspaces</span>
                        </button>

                        <div className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex" aria-hidden="true">
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="font-medium text-slate-500">Agentic Workspace</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="font-bold text-slate-900">{activeTitle}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="hidden items-center gap-1.5 rounded-full border border-indigo-200/70 bg-indigo-50/70 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 md:inline-flex">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            Interactive Dashboard Preview
                        </span>
                        <button
                            type="button"
                            onClick={() => navigateWorkspaceView('home')}
                            className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            title="View all workspace dashboards"
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline">All Agents</span>
                        </button>
                    </div>
                </header>
            )}

            <div className={`mx-4 ${activeView === 'home' ? 'mt-4' : 'mt-2'} mb-2 flex-shrink-0`}>
                <AgentPreviewNotice title={activeView === 'home' ? 'Workspace preview' : `${activeTitle} · preview`}>
                    {isRedTeam
                        ? 'This is an authorized training simulation; the target and terminal output are illustrative. Keep use within an explicitly authorized lab scope.'
                        : 'Panels show live interactive sample data and workflow controls. Explore capabilities, simulated actions, and dashboard state.'}
                </AgentPreviewNotice>
            </div>

            <main className="flex-1 min-h-0 w-full overflow-hidden">
                {activeView === 'home' && (
                    <AgentWorkspaceHome onNavigate={navigateWorkspaceView} />
                )}
                {activeView === 'scanner-agent' && (
                    <div className="w-full h-full">
                        <ScannerAgentMainView />
                    </div>
                )}
                {activeView === 'ecommerce-agent' && (
                    <div className="w-full h-full">
                        <EcommerceAgentMainView />
                    </div>
                )}
                {activeView === 'devtools-agent' && (
                    <div className="w-full h-full">
                        <DevtoolsAgentMainView />
                    </div>
                )}
                {activeView === 'dfir-agent' && (
                    <div className="w-full h-full">
                        <DfirAgentMainView />
                    </div>
                )}
                {activeView === 'threat-intel-agent' && (
                    <div className="w-full h-full">
                        <ThreatIntelAgentMainView />
                    </div>
                )}
                {activeView === 'cloud-posture-agent' && (
                    <div className="w-full h-full">
                        <CloudPostureAgentMainView />
                    </div>
                )}
                {activeView === 'sast-agent' && (
                    <div className="w-full h-full">
                        <SastAgentMainView />
                    </div>
                )}
                {activeView === 'red-team-agent' && (
                    <div className="w-full h-full">
                        <RedTeamAgentMainView />
                    </div>
                )}
                {activeView === 'legal-contract-agent' && (
                    <div className="w-full h-full">
                        <LegalContractAgentMainView />
                    </div>
                )}
                {activeView === 'memory-types-lab' && (
                    <div className="w-full h-full">
                        <ComprehensiveMemoryTypesLab />
                    </div>
                )}
            </main>
        </div>
    );
};
