import React from 'react';
import { History } from 'lucide-react';

export const EpisodicMemory: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
          <History className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-heading text-slate-800">Episodic Memory</h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        <strong>Description:</strong> The system's personalized history. It records the chronological "episodes" of user interactions, enabling the AI to recall past conversations, preferences, and specific events ("Last week, the user asked me to write a Python script for data analysis").
      </p>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Use Cases</h3>
        <ul className="list-disc list-inside text-slate-700 space-y-1">
          <li>Personalized user experiences based on past conversations</li>
          <li>Reflecting on past mistakes to avoid repeating them</li>
          <li>Maintaining long-term session continuity</li>
        </ul>
      </div>
      <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-2">Real-World Example</h3>
        <p className="text-slate-700">
          An AI therapist remembering that a user was stressed about an exam last week and asking them how it went in today's session.
        </p>
      </div>
    </div>
  );
};
