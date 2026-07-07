import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const InContextMemory: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-heading text-slate-800">In-Context Memory</h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        <strong>Description:</strong> Functioning as the AI's "working memory," this is bounded by the context window limit (e.g., 128k or 1M tokens). It holds the immediate prompt, the current conversation history, and any transient scratchpad reasoning required for the immediate task. Once the session ends or the context clears, this memory is wiped.
      </p>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Use Cases</h3>
        <ul className="list-disc list-inside text-slate-700 space-y-1">
          <li>Tracking current session dialogue</li>
          <li>Maintaining state across a multi-turn reasoning prompt</li>
          <li>Holding immediate user instructions</li>
        </ul>
      </div>
      <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-2">Real-World Example</h3>
        <p className="text-slate-700">
          A chatbot recalling the user's name mentioned three messages ago without needing to query an external database.
        </p>
      </div>
    </div>
  );
};
