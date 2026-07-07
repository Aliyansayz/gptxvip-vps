import React from 'react';
import { Cpu } from 'lucide-react';
import { SecOpsAgents } from './agentTypes/SecOpsAgents';
import { ECommerceAgents } from './agentTypes/ECommerceAgents';
import { DevToolsAgents } from './agentTypes/DevToolsAgents';
import { AttackAuditorAgents } from './agentTypes/AttackAuditorAgents';
import { LegalComplianceAgents } from './agentTypes/LegalComplianceAgents';
import { AgentLabs } from './agentTypes/AgentLabs';

interface AgentWorkspaceHomeProps {
  onNavigate: (view: string) => void;
}

const AgentWorkspaceHome: React.FC<AgentWorkspaceHomeProps> = ({ onNavigate }) => {
  return (
    <div className="w-full h-full p-8 md:p-12 overflow-y-auto custom-scrollbar bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center mb-12">
          <div className="inline-flex p-4 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-sm border border-indigo-100">
             <Cpu className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-slate-800 tracking-tight">
            Agent Workspace
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Select an autonomous agent category to launch specialized workspaces. Each agent brings specific domain intelligence to the environment.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SecOpsAgents onNavigate={onNavigate} />
          <AttackAuditorAgents onNavigate={onNavigate} />
          <ECommerceAgents onNavigate={onNavigate} />
          <DevToolsAgents onNavigate={onNavigate} />
          <LegalComplianceAgents onNavigate={onNavigate} />
          <AgentLabs onNavigate={onNavigate} />
        </div>

      </div>
    </div>
  );
};

export default AgentWorkspaceHome;
