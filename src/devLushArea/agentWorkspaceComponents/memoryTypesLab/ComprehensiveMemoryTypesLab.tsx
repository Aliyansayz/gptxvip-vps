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
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-700 whitespace-nowrap">Memory Type</th>
                  <th className="p-4 font-semibold text-slate-700 whitespace-nowrap">Classification</th>
                  <th className="p-4 font-semibold text-slate-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600 text-sm">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 whitespace-nowrap">Parametric Memory</td>
                  <td className="p-4 whitespace-nowrap"><span className="inline-flex px-2 py-1 bg-pink-50 text-pink-700 rounded-md text-xs font-medium border border-pink-100">Innate Layer</span></td>
                  <td className="p-4">The "instincts" and baseline knowledge baked directly into the neural network's weights during pre-training.</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 whitespace-nowrap">In-Context Memory</td>
                  <td className="p-4 whitespace-nowrap"><span className="inline-flex px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium border border-indigo-100">Working State</span></td>
                  <td className="p-4">The AI's "working memory" bounded by the context window limit; holds the immediate prompt and transient scratchpad reasoning.</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 whitespace-nowrap">Semantic Memory</td>
                  <td className="p-4 whitespace-nowrap"><span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">Archival Storage</span></td>
                  <td className="p-4">The system's objective worldview backed by knowledge graphs/vector databases, storing facts, concepts, and relationships.</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 whitespace-nowrap">Episodic Memory</td>
                  <td className="p-4 whitespace-nowrap"><span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">Archival Storage</span></td>
                  <td className="p-4">The system's personalized history, recording the chronological "episodes" of user interactions, preferences, and past events.</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 whitespace-nowrap">External Memory</td>
                  <td className="p-4 whitespace-nowrap"><span className="inline-flex px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-100">Execution & Action Layer</span></td>
                  <td className="p-4">The AI's physical filing cabinet; structured integrations with external databases (SQL, NoSQL), APIs, or local file systems.</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 whitespace-nowrap">Procedural Memory</td>
                  <td className="p-4 whitespace-nowrap"><span className="inline-flex px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-100">Execution & Action Layer</span></td>
                  <td className="p-4">The "muscle memory" of the AI; internalized instruction patterns, system prompts, and execution workflows (like ReAct).</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 whitespace-nowrap">Prospective Memory</td>
                  <td className="p-4 whitespace-nowrap"><span className="inline-flex px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-100">Execution & Action Layer</span></td>
                  <td className="p-4">The "future" memory managing scheduled actions, event listeners, and timers to execute tasks at predefined points in time.</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
