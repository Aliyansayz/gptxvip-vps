import React from 'react';
import { Database } from 'lucide-react';

export const ExternalMemory: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
          <Database className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-heading text-slate-800">External Memory</h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        <strong>Description:</strong> The AI's physical filing cabinet. This involves structured integrations with external databases (SQL, NoSQL), APIs, or local file systems where it can explicitly read and write structured data, bypassing the fuzziness of vector embeddings.
      </p>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Use Cases</h3>
        <ul className="list-disc list-inside text-slate-700 space-y-1">
          <li>Storing massive datasets that cannot fit in-context</li>
          <li>Maintaining shared state across multiple agents</li>
          <li>Logging audit trails and transaction histories</li>
        </ul>
      </div>
      <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-2">Real-World Example</h3>
        <p className="text-slate-700">
          An inventory management agent running a SQL query to check the current stock level of an item from an external Cloud SQL database before processing an order.
        </p>
      </div>
    </div>
  );
};
