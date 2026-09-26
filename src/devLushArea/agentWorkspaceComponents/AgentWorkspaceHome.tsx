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
            Choose a workspace by the job you want to explore. Each opens a focused product preview with its own dashboard, tools, and example workflows.
          </p>
        </div>

        {/* Categories are grouped by the user goal they support. */}
        <div className="space-y-10">
          <section aria-labelledby="workspace-security-heading" className="space-y-4">
            <div>
              <h2 id="workspace-security-heading" className="text-xl font-bold text-slate-800">Secure and investigate systems</h2>
              <p className="text-sm text-slate-500">Explore security monitoring, incident triage, code auditing, and bounded red team training.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SecOpsAgents onNavigate={onNavigate} />
              <AttackAuditorAgents onNavigate={onNavigate} />
            </div>
          </section>
          <section aria-labelledby="workspace-operations-heading" className="space-y-4">
            <div>
              <h2 id="workspace-operations-heading" className="text-xl font-bold text-slate-800">Build and operate services</h2>
              <p className="text-sm text-slate-500">Inspect software delivery, commerce operations, and contract review workflows.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ECommerceAgents onNavigate={onNavigate} />
              <DevToolsAgents onNavigate={onNavigate} />
              <LegalComplianceAgents onNavigate={onNavigate} />
            </div>
          </section>
          <section aria-labelledby="workspace-learning-heading" className="space-y-4">
            <div>
              <h2 id="workspace-learning-heading" className="text-xl font-bold text-slate-800">Learn and compare</h2>
              <p className="text-sm text-slate-500">Open learning activities and inspect how agent patterns are explained.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AgentLabs onNavigate={onNavigate} />
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default AgentWorkspaceHome;
