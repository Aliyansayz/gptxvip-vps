import React, { useState } from 'react';
import { InContextMemory } from './InContextMemory';
import { SemanticMemory } from './SemanticMemory';
import { EpisodicMemory } from './EpisodicMemory';
import { ProceduralMemory } from './ProceduralMemory';
import { ExternalMemory } from './ExternalMemory';
import { ParametricMemory } from './ParametricMemory';
import { ProspectiveMemory } from './ProspectiveMemory';
import ResponsiveDataFrame from '../components/ResponsiveDataFrame';

const memoryComparison = [
  { type: 'Parametric', classification: 'Model weights', stores: 'Patterns encoded during training.', retrieval: 'Implicitly during model inference.', example: 'Language patterns learned during training.', tradeoff: 'Fast to use, hard to inspect or update one fact; changes generally require model updates.' },
  { type: 'In-context', classification: 'Working state', stores: 'Current prompt, selected examples, and recent turn context.', retrieval: 'Attention over the active context window.', example: 'Instructions and retrieved notes included in a request.', tradeoff: 'Easy to change, but token-limited and usually not persistent across sessions.' },
  { type: 'Semantic', classification: 'Long-term knowledge', stores: 'Facts, concepts, and relationships.', retrieval: 'Entity, keyword, vector, or graph queries.', example: 'A stored product policy or concept definition.', tradeoff: 'Reusable and searchable, but needs provenance, freshness, and conflict handling.' },
  { type: 'Episodic', classification: 'Long-term event history', stores: 'Dated interactions, actions, and outcomes.', retrieval: 'Time, user, event, or similarity lookup.', example: 'The outcome of a previous support session.', tradeoff: 'Adds personal context, but histories can be incomplete, noisy, or sensitive.' },
  { type: 'External', classification: 'Connected storage', stores: 'Records held in a database, file store, or service.', retrieval: 'An authorized API, file, or database query.', example: 'Fetching a current order from a database.', tradeoff: 'Can hold large, current records, but depends on access, availability, and sync.' },
  { type: 'Procedural', classification: 'Reusable methods', stores: 'Instructions, policies, and action sequences.', retrieval: 'Task-to-playbook or policy selection.', example: 'A reviewed deployment checklist.', tradeoff: 'Makes repeatable work consistent, but stale steps or poor task matching cause errors.' },
  { type: 'Prospective', classification: 'Future intention', stores: 'A planned action and its time or trigger.', retrieval: 'A schedule, event, or condition check.', example: 'A reminder to review a renewal on a specified date.', tradeoff: 'Supports follow-through, but triggers need monitoring and may become stale.' },
];

export const ComprehensiveMemoryTypesLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'detailed' | 'glossary'>('detailed');

  return (
    <div className="w-full h-full px-4 py-8 sm:px-6 md:p-12 overflow-y-auto custom-scrollbar bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
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
                className={`min-h-11 px-4 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
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
                className={`min-h-11 px-4 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
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
          <div className="mt-8">
            <div className="grid gap-3 lg:hidden">
              {memoryComparison.map((item) => <article key={item.type} className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">{item.classification}</p><h2 className="mt-1 text-xl font-bold text-slate-900">{item.type} memory</h2><dl className="mt-4 space-y-3 text-sm">{[['Stores', item.stores], ['Retrieved by', item.retrieval], ['Example', item.example], ['Limitation and trade-off', item.tradeoff]].map(([label, value]) => <div key={label}><dt className="font-semibold text-slate-900">{label}</dt><dd className="mt-1 leading-6 text-slate-600">{value}</dd></div>)}</dl></article>)}
            </div>
            <ResponsiveDataFrame label="Compare seven agent memory types" className="hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
            <table className="w-full text-left border-collapse min-w-[70rem]">
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
                {memoryComparison.map((item) => <tr key={item.type}><th scope="row" className="p-4 font-medium text-slate-800">{item.type}</th><td className="p-4">{item.classification}</td><td className="p-4">{item.stores}</td><td className="p-4">{item.retrieval}</td><td className="p-4">{item.example}</td><td className="p-4">{item.tradeoff}</td></tr>)}
              </tbody>
            </table>
            </ResponsiveDataFrame>
          </div>
        )}
      </div>
    </div>
  );
};
