import React, { useState } from 'react';
import { InContextMemory } from './InContextMemory';
import { SemanticMemory } from './SemanticMemory';
import { EpisodicMemory } from './EpisodicMemory';
import { ProceduralMemory } from './ProceduralMemory';
import { ExternalMemory } from './ExternalMemory';
import { ParametricMemory } from './ParametricMemory';
import { ProspectiveMemory } from './ProspectiveMemory';

export const ComprehensiveMemoryTypesLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'detailed' | 'glossary'>('detailed');

  return (
    <div className="w-full h-full p-8 md:p-12 overflow-y-auto custom-scrollbar bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-slate-800 tracking-tight">
                Comprehensive Memory Types
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed mt-2">
                Memory is a critical component for autonomous agents, allowing them to retain context, learn from past experiences, access external knowledge, and plan future actions.
              </p>
            </div>
            
            <div className="flex bg-slate-200 p-1 rounded-lg shrink-0">
              <button
                type="button"
                aria-pressed={activeTab === 'detailed'}
                onClick={() => setActiveTab('detailed')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'detailed' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Detailed View
              </button>
              <button
                type="button"
                aria-pressed={activeTab === 'glossary'}
                onClick={() => setActiveTab('glossary')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'glossary' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Quick Glossary
              </button>
            </div>
          </div>
        </div>
        
        {activeTab === 'detailed' ? (
          <div className="flex flex-col gap-10 mt-8">
            
            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-bold text-slate-800 border-b pb-2 border-slate-200">1. The Innate Layer</h2>
              <div className="flex flex-col gap-6">
                <ParametricMemory />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-bold text-slate-800 border-b pb-2 border-slate-200">2. The Working State</h2>
              <div className="flex flex-col gap-6">
                <InContextMemory />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-bold text-slate-800 border-b pb-2 border-slate-200">3. The Archival Storage (Long-Term)</h2>
              <div className="flex flex-col gap-6">
                <SemanticMemory />
                <EpisodicMemory />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-bold text-slate-800 border-b pb-2 border-slate-200">4. The Execution & Action Layer</h2>
              <div className="flex flex-col gap-6">
                <ExternalMemory />
                <ProceduralMemory />
                <ProspectiveMemory />
              </div>
            </div>

          </div>
        ) : (
          <div className="mt-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1240px]">
              <caption className="p-4 text-left text-sm text-slate-600">Compare what each memory type stores, how it is retrieved, and the trade-offs it introduces.</caption>
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-700 whitespace-nowrap">Memory Type</th>
                  <th className="p-4 font-semibold text-slate-700 whitespace-nowrap">Classification</th>
                  <th className="p-4 font-semibold text-slate-700">Stores</th>
                  <th className="p-4 font-semibold text-slate-700">Retrieved by</th>
                  <th className="p-4 font-semibold text-slate-700">Example</th>
                  <th className="p-4 font-semibold text-slate-700">Limitation and trade-off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600 text-sm">
                <tr><td className="p-4 font-medium text-slate-800">Parametric</td><td className="p-4">Model weights</td><td className="p-4">Patterns encoded during training.</td><td className="p-4">Implicitly during model inference.</td><td className="p-4">Language patterns learned during training.</td><td className="p-4">Fast to use, hard to inspect or update one fact; changes generally require model updates.</td></tr>
                <tr><td className="p-4 font-medium text-slate-800">In-context</td><td className="p-4">Working state</td><td className="p-4">Current prompt, selected examples, and recent turn context.</td><td className="p-4">Attention over the active context window.</td><td className="p-4">Instructions and retrieved notes included in a request.</td><td className="p-4">Easy to change, but token-limited and usually not persistent across sessions.</td></tr>
                <tr><td className="p-4 font-medium text-slate-800">Semantic</td><td className="p-4">Long-term knowledge</td><td className="p-4">Facts, concepts, and relationships.</td><td className="p-4">Entity, keyword, vector, or graph queries.</td><td className="p-4">A stored product policy or concept definition.</td><td className="p-4">Reusable and searchable, but needs provenance, freshness, and conflict handling.</td></tr>
                <tr><td className="p-4 font-medium text-slate-800">Episodic</td><td className="p-4">Long-term event history</td><td className="p-4">Dated interactions, actions, and outcomes.</td><td className="p-4">Time, user, event, or similarity lookup.</td><td className="p-4">The outcome of a previous support session.</td><td className="p-4">Adds personal context, but histories can be incomplete, noisy, or sensitive.</td></tr>
                <tr><td className="p-4 font-medium text-slate-800">External</td><td className="p-4">Connected storage</td><td className="p-4">Records held in a database, file store, or service.</td><td className="p-4">An authorized API, file, or database query.</td><td className="p-4">Fetching a current order from a database.</td><td className="p-4">Can hold large, current records, but depends on access, availability, and sync.</td></tr>
                <tr><td className="p-4 font-medium text-slate-800">Procedural</td><td className="p-4">Reusable methods</td><td className="p-4">Instructions, policies, and action sequences.</td><td className="p-4">Task-to-playbook or policy selection.</td><td className="p-4">A reviewed deployment checklist.</td><td className="p-4">Makes repeatable work consistent, but stale steps or poor task matching cause errors.</td></tr>
                <tr><td className="p-4 font-medium text-slate-800">Prospective</td><td className="p-4">Future intention</td><td className="p-4">A planned action and its time or trigger.</td><td className="p-4">A schedule, event, or condition check.</td><td className="p-4">A reminder to review a renewal on a specified date.</td><td className="p-4">Supports follow-through, but triggers need monitoring and may become stale.</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
