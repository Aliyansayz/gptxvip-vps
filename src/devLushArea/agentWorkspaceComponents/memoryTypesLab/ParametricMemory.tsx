import React from 'react';
import { Sparkles } from 'lucide-react';

export const ParametricMemory: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-heading text-slate-800">Parametric Memory</h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        <strong>Description:</strong> This is the bedrock. It represents the "instincts" and baseline knowledge baked directly into the neural network's weights during pre-training. It doesn't update during runtime, but it dictates the model's fundamental reasoning capabilities and linguistic understanding.
      </p>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Use Cases</h3>
        <ul className="list-disc list-inside text-slate-700 space-y-1">
          <li>General language comprehension and generation</li>
          <li>Recalling universally known facts or trivia</li>
          <li>Understanding syntax, grammar, and reasoning patterns</li>
        </ul>
      </div>
      <div className="bg-pink-50/50 p-4 rounded-lg border border-pink-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-pink-600 mb-2">Real-World Example</h3>
        <p className="text-slate-700">
          The model instantly knowing that Paris is the capital of France or how to write a Python `for` loop without needing to perform a web search or database query.
        </p>
      </div>
    </div>
  );
};
