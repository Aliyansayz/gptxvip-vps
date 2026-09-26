import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
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
import { ArrowLeft } from 'lucide-react';
import AgentPreviewNotice from './components/AgentPreviewNotice';

export const AgentWorkspace: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const workspaceViews = [
        'scanner-agent', 'ecommerce-agent', 'devtools-agent', 'dfir-agent', 'threat-intel-agent',
        'cloud-posture-agent', 'sast-agent', 'red-team-agent', 'legal-contract-agent', 'memory-types-lab',
    ];
    const readWorkspaceView = (state: unknown): string => {
        const view = state && typeof state === 'object'
            ? (state as { devLushWorkspaceView?: unknown }).devLushWorkspaceView
            : undefined;
        return typeof view === 'string' && workspaceViews.includes(view) ? view : 'home';
    };
    const [currentView, setCurrentView] = useState<string>(() => readWorkspaceView(location.state));

    useEffect(() => {
        setCurrentView(readWorkspaceView(location.state));
    }, [location.key, location.state]);

    const navigateWorkspaceView = (view: string) => {
        if (view === currentView) return;
        setCurrentView(view);
        const state = location.state && typeof location.state === 'object'
            ? { ...(location.state as Record<string, unknown>) }
            : {};
        if (view === 'home') delete state.devLushWorkspaceView;
        else state.devLushWorkspaceView = view;
        navigate(`${location.pathname}${location.search}`, { state });
    };

    const returnToWorkspaceHome = () => {
        if (readWorkspaceView(location.state) !== 'home') navigate(-1);
        else navigateWorkspaceView('home');
    };

    const workspaceTitle: Record<string, string> = {
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
    const isRedTeam = currentView === 'red-team-agent';

    return (
        <div className="w-full h-full bg-slate-50 flex flex-col relative overflow-hidden">
            {currentView !== 'home' && (
                <div className="absolute top-4 left-4 z-10">
                    <button 
                        onClick={returnToWorkspaceHome}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm text-sm font-semibold text-slate-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Agents
                    </button>
                </div>
            )}

            <div className="mx-4 mt-14 mb-2 flex-shrink-0">
                <AgentPreviewNotice title={currentView === 'home' ? 'Workspace preview' : `${workspaceTitle[currentView] || 'Agent Workspace'} · preview`}>
                    {isRedTeam
                        ? 'This is an authorized training simulation; the target and terminal output are illustrative. Keep use within an explicitly authorized lab scope.'
                        : 'Panels may show example data or simulated actions. Review each panel’s source and freshness before relying on its output.'}
                </AgentPreviewNotice>
            </div>

            <div className="flex-1 min-h-0 w-full overflow-hidden">
                {currentView === 'home' && (
                    <AgentWorkspaceHome onNavigate={navigateWorkspaceView} />
                )}
                {currentView === 'scanner-agent' && (
                    <div className="w-full h-full">
                        <ScannerAgentMainView />
                    </div>
                )}
                {currentView === 'ecommerce-agent' && (
                    <div className="w-full h-full">
                        <EcommerceAgentMainView />
                    </div>
                )}
                {currentView === 'devtools-agent' && (
                    <div className="w-full h-full">
                        <DevtoolsAgentMainView />
                    </div>
                )}
                {currentView === 'dfir-agent' && (
                    <div className="w-full h-full">
                        <DfirAgentMainView />
                    </div>
                )}
                {currentView === 'threat-intel-agent' && (
                    <div className="w-full h-full">
                        <ThreatIntelAgentMainView />
                    </div>
                )}
                {currentView === 'cloud-posture-agent' && (
                    <div className="w-full h-full">
                        <CloudPostureAgentMainView />
                    </div>
                )}
                {currentView === 'sast-agent' && (
                    <div className="w-full h-full">
                        <SastAgentMainView />
                    </div>
                )}
                {currentView === 'red-team-agent' && (
                    <div className="w-full h-full">
                        <RedTeamAgentMainView />
                    </div>
                )}
                {currentView === 'legal-contract-agent' && (
                    <div className="w-full h-full">
                        <LegalContractAgentMainView />
                    </div>
                )}
                {currentView === 'memory-types-lab' && (
                    <div className="w-full h-full">
                        <ComprehensiveMemoryTypesLab />
                    </div>
                )}
            </div>
        </div>
    );
};
