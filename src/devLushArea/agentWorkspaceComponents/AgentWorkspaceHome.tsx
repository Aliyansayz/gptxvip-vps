import React, { useEffect, useRef } from 'react';
import { ArrowRight, Cpu } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      const saved = Number(window.sessionStorage.getItem('gptxvip-agent-workspace-scroll') || 0);
      if (scrollRef.current && Number.isFinite(saved)) scrollRef.current.scrollTop = saved;
    } catch { /* The workspace remains available without saved scroll position. */ }
  }, []);
  const starts = [
    { goal: 'Investigate an incident', view: 'dfir-agent', agent: 'DFIR Agent', detail: 'Follow a case from severity to evidence and next action.' },
    { goal: 'Inspect exposure', view: 'scanner-agent', agent: 'Scanner Agent', detail: 'See how scan findings, queue state, and scope fit together.' },
    { goal: 'Review a contract', view: 'legal-contract-agent', agent: 'Legal Contract Agent', detail: 'Compare a clause, a finding, and a proposed review step.' },
    { goal: 'Compare memory patterns', view: 'memory-types-lab', agent: 'Memory Types Lab', detail: 'Study the trade-offs among seven agent memory types.' },
  ];
  return (
    <div ref={scrollRef} onScroll={(event) => {
      try { window.sessionStorage.setItem('gptxvip-agent-workspace-scroll', String(event.currentTarget.scrollTop)); } catch { /* Preserve scrolling without storage. */ }
    }} className="w-full h-full px-4 py-8 sm:px-6 md:p-12 overflow-y-auto custom-scrollbar bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-4 text-center mb-8">
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

        <section aria-labelledby="workspace-start-heading" className="rounded-3xl border border-indigo-100 bg-white p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">Suggested first previews</p>
          <h2 id="workspace-start-heading" className="mt-1 text-2xl font-bold text-slate-950">Choose by the task you want to inspect</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">These are product previews with example data or simulated actions. Pick a task to see the relevant workspace first.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {starts.map((start) => <button key={start.view} type="button" onClick={() => onNavigate(start.view)} className="group flex min-h-40 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 motion-reduce:transform-none"><span className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-700">{start.goal}</span><span className="mt-2 text-lg font-bold text-slate-950">{start.agent}</span><span className="mt-2 flex-1 text-sm leading-6 text-slate-600">{start.detail}</span><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700">Open preview <ArrowRight className="h-4 w-4" /></span></button>)}
          </div>
        </section>

        <nav aria-label="Workspace categories" className="flex flex-wrap gap-2">
          {[{ id: 'workspace-security-heading', label: 'Security and investigation' }, { id: 'workspace-operations-heading', label: 'Operations' }, { id: 'workspace-learning-heading', label: 'Learning' }].map((item) => <button key={item.id} type="button" onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })} className="min-h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">{item.label}</button>)}
        </nav>

        {/* Categories are grouped by the user goal they support. */}
        <div className="space-y-10">
          <section aria-labelledby="workspace-security-heading" className="scroll-mt-6 space-y-4">
            <div>
              <h2 id="workspace-security-heading" className="text-xl font-bold text-slate-800">Secure and investigate systems</h2>
              <p className="text-sm text-slate-500">Explore security monitoring, incident triage, code auditing, and bounded red team training.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SecOpsAgents onNavigate={onNavigate} />
              <AttackAuditorAgents onNavigate={onNavigate} />
            </div>
          </section>
          <section aria-labelledby="workspace-operations-heading" className="scroll-mt-6 space-y-4">
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
          <section aria-labelledby="workspace-learning-heading" className="scroll-mt-6 space-y-4">
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
