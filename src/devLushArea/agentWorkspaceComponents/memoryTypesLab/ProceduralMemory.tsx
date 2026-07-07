import React from 'react';
import { Cog } from 'lucide-react';

export const ProceduralMemory: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
          <Cog className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-heading text-slate-800">Procedural Memory</h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        <strong>Description:</strong> The "muscle memory" of the AI. This contains the internalized instruction patterns, system prompts, and execution workflows (like ReAct or Chain-of-Thought) that teach the agent how to use tools, route tasks, or format outputs.
      </p>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Use Cases</h3>
        <ul className="list-disc list-inside text-slate-700 space-y-1">
          <li>Executing complex tool-use workflows</li>
          <li>Adhering to strict formatting guidelines (e.g., JSON output)</li>
          <li>Following step-by-step logic chains (like Chain of Thought)</li>
        </ul>
      </div>
      <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-2">Real-World Example</h3>
        <p className="text-slate-700">
          A coding agent naturally structuring its response to use the "search_web" tool, parse the JSON result, and then write the final code, guided by its system prompt instructions.
        </p>
      </div>
    </div>
  );
};
