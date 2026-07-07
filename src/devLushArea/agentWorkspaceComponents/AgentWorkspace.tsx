import React, { useState } from 'react';
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

export const AgentWorkspace: React.FC = () => {
    const [currentView, setCurrentView] = useState<string>('home');

    return (
        <div className="w-full h-full bg-slate-50 flex flex-col relative overflow-hidden">
            {currentView !== 'home' && (
                <div className="absolute top-4 left-4 z-10">
                    <button 
                        onClick={() => setCurrentView('home')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm text-sm font-semibold text-slate-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Agents
                    </button>
                </div>
            )}

            <div className="flex-1 w-full h-full overflow-hidden">
                {currentView === 'home' && (
                    <AgentWorkspaceHome onNavigate={(view) => setCurrentView(view)} />
                )}
                {currentView === 'scanner-agent' && (
                    <div className="w-full h-full pt-14">
                        <ScannerAgentMainView />
                    </div>
                )}
                {currentView === 'ecommerce-agent' && (
                    <div className="w-full h-full pt-14">
                        <EcommerceAgentMainView />
                    </div>
                )}
                {currentView === 'devtools-agent' && (
                    <div className="w-full h-full pt-14">
                        <DevtoolsAgentMainView />
                    </div>
                )}
                {currentView === 'dfir-agent' && (
                    <div className="w-full h-full pt-14">
                        <DfirAgentMainView />
                    </div>
                )}
                {currentView === 'threat-intel-agent' && (
                    <div className="w-full h-full pt-14">
                        <ThreatIntelAgentMainView />
                    </div>
                )}
                {currentView === 'cloud-posture-agent' && (
                    <div className="w-full h-full pt-14">
                        <CloudPostureAgentMainView />
                    </div>
                )}
                {currentView === 'sast-agent' && (
                    <div className="w-full h-full pt-14">
                        <SastAgentMainView />
                    </div>
                )}
                {currentView === 'red-team-agent' && (
                    <div className="w-full h-full pt-14">
                        <RedTeamAgentMainView />
                    </div>
                )}
                {currentView === 'legal-contract-agent' && (
                    <div className="w-full h-full pt-14">
                        <LegalContractAgentMainView />
                    </div>
                )}
                {currentView === 'memory-types-lab' && (
                    <div className="w-full h-full pt-14">
                        <ComprehensiveMemoryTypesLab />
                    </div>
                )}
            </div>
        </div>
    );
};
