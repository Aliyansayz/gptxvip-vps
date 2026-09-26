import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, ArrowRight, Layers, Tag, Eye } from 'lucide-react';

export const PythonTypingVisual: React.FC = () => {
  const [activeType, setActiveType] = useState<'int' | 'str' | 'float' | 'list'>('int');

  const typeData = {
    int: {
      code: "x = 42",
      type: "int (Integer)",
      bytes: "sizeof(PyLongObject) = 28 bytes",
      address: "0x7f884a12",
      details: "In Python, even integers are complete objects, wrapping reference counters and type pointers.",
      value: "42",
      colorClass: "from-blue-500 to-blue-700 bg-blue-500/10 border-blue-500/30 text-blue-400"
    },
    str: {
      code: "x = 'Low Latency'",
      type: "str (Unicode String)",
      bytes: "sizeof(PyUnicodeObject) = 52 bytes",
      address: "0x7f884c56",
      details: "String objects contain metadata regarding rendering sequence, cached hash, length, and content arrays.",
      value: "'Low Latency'",
      colorClass: "from-amber-500 to-amber-700 bg-amber-500/10 border-amber-500/30 text-amber-400"
    },
    float: {
      code: "x = 3.14159",
      type: "float (Double Precision)",
      bytes: "sizeof(PyFloatObject) = 24 bytes",
      address: "0x7f884b22",
      details: "Floating point wrapper wrapping a native C double value internally.",
      value: "3.14159",
      colorClass: "from-purple-500 to-purple-700 bg-purple-500/10 border-purple-500/30 text-purple-400"
    },
    list: {
      code: "x = [1, 2, 3]",
      type: "list (Dynamic Vector)",
      bytes: "sizeof(PyListObject) = 80 bytes",
      address: "0x7f884d90",
      details: "Lists hold arrays of raw pointers pointing to separate objects, enabling elements of arbitrary types.",
      value: "[1, 2, 3]",
      colorClass: "from-teal-500 to-teal-700 bg-teal-500/10 border-teal-500/30 text-teal-400"
    }
  };

  const current = typeData[activeType];

  return (
    <div className="w-full bg-zinc-950 rounded-2xl border border-zinc-850 p-6 font-sans text-zinc-300 shadow-xl max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-200/10 pb-4 mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Dynamic Typing Lab</span>
          <span className="text-sm font-semibold text-zinc-200 mt-0.5">Click types to reassign variable 'x'</span>
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
          {(['int', 'str', 'float', 'list'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`p-1 px-2.5 rounded font-mono text-[10px] font-bold uppercase transition-all ${
                activeType === t 
                  ? 'bg-zinc-800 text-yellow-400 font-black shadow' 
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Code Snippet Screen */}
      <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900 font-mono text-xs flex justify-between items-center mb-6">
        <div>
          <span className="text-zinc-600 mr-2">&gt;&gt;&gt;</span>
          <span className="text-zinc-100">{current.code}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">
          <Tag size={10} /> Type: <span className="font-bold text-yellow-500">{activeType}</span>
        </div>
      </div>

      {/* Interactive Heap Visual Block Map */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Name Bindings Stack */}
        <div className="md:col-span-4 flex flex-col justify-center items-center p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl relative">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mb-4">Stack Frame Namespace</div>
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center shadow">
            <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Variable</span>
            <span className="text-xl font-bold font-mono text-yellow-400">x</span>
          </div>
          <span className="text-[10px] text-zinc-500 italic mt-3 min-h-[30px] text-center">Stores reference to heap address</span>
        </div>

        {/* Transition Arrows */}
        <div className="md:col-span-2 flex justify-center text-zinc-700">
          <motion.div
            key={activeType}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.1, 1], opacity: 1 }}
            className="flex items-center"
          >
            <ArrowRight className="w-6 h-6 text-zinc-400 rotate-90 md:rotate-0" />
          </motion.div>
        </div>

        {/* PyObject on Heap */}
        <div className="md:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl border p-4 bg-zinc-900/60 shadow-lg`}
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                <span className="text-[10px] font-mono text-zinc-500">{current.address}</span>
                <span className="text-[10px] font-bold text-emerald-400 font-mono">Heap Allocated</span>
              </div>

              {/* Box of PyObject */}
              <div className="space-y-2">
                <div className="flex gap-2 p-2 rounded bg-black/40 border border-zinc-900 text-xs font-mono justify-between">
                  <span className="text-zinc-500">ob_refcnt</span>
                  <span className="text-indigo-400">1</span>
                </div>
                <div className="flex gap-2 p-2 rounded bg-black/40 border border-zinc-900 text-xs font-mono justify-between">
                  <span className="text-zinc-500">ob_type</span>
                  <span className="text-yellow-400 font-bold">{current.type}</span>
                </div>
                <div className="flex gap-2 p-2 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono justify-between items-center py-2.5">
                  <span className="text-zinc-400">Value Block</span>
                  <span className="text-emerald-400 font-extrabold text-sm">{current.value}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Explainer Meta Details */}
      <div className="mt-6 p-4 rounded-xl bg-zinc-900/20 border border-zinc-800/50 text-xs text-zinc-400 leading-relaxed">
        <div className="flex items-center gap-2 mb-1.5 text-zinc-200">
          <Layers size={13} className="text-yellow-500" />
          <span className="font-bold">Interpretation Strategy Insights</span>
        </div>
        <p>{current.details}</p>
        <div className="flex justify-between mt-3 pt-2.5 border-t border-zinc-900 text-[10px] text-zinc-500 font-mono">
          <span>{current.bytes}</span>
          <span className="text-yellow-500 font-bold">Dynamic Dispatch Active</span>
        </div>
      </div>
    </div>
  );
};
