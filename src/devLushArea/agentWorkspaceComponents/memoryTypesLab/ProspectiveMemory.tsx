import React from 'react';
import { Clock } from 'lucide-react';

export const ProspectiveMemory: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-heading text-slate-800">Prospective Memory</h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        <strong>Description:</strong> The "future" memory. This manages scheduled actions, event listeners, and timers. It allows an agent to remember to execute a specific task or check a condition at a later, predefined point in time.
      </p>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Use Cases</h3>
        <ul className="list-disc list-inside text-slate-700 space-y-1">
          <li>Scheduling follow-up emails or notifications</li>
          <li>Polling a long-running process for completion</li>
          <li>Triggering actions based on specific calendar events or time delays</li>
        </ul>
      </div>
      <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-2">Real-World Example</h3>
        <p className="text-slate-700">
          An agent setting a cron job or a delayed background task to check the deployment status of a server in 5 minutes and notify the user when it finishes.
        </p>
      </div>
    </div>
  );
};
