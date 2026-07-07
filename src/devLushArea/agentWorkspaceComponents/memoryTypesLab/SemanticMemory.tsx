import React from 'react';
import { Network } from 'lucide-react';

export const SemanticMemory: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Network className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-heading text-slate-800">Semantic Memory</h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        <strong>Description:</strong> The system's objective worldview. Backed by knowledge graphs and vector databases, it stores facts, concepts, and relationships (e.g., "Paris is the capital of France" or "Python is a programming language") independent of personal experience.
      </p>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Use Cases</h3>
        <ul className="list-disc list-inside text-slate-700 space-y-1">
          <li>Storing and retrieving organizational knowledge</li>
          <li>Recalling standard operating procedures</li>
          <li>Accessing domain-specific facts</li>
        </ul>
      </div>
      <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-2">Real-World Example</h3>
        <p className="text-slate-700">
          A customer support agent retrieving the company's official refund policy from a vector database before answering a query.
        </p>
      </div>
    </div>
  );
};
