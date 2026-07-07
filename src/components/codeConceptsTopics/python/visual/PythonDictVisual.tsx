import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, RefreshCw, Hash, Shield, Search, Plus } from 'lucide-react';

interface BucketSlot {
  key: string;
  val: string;
  hashValue: number;
  probingSteps: number;
}

export const PythonDictVisual: React.FC = () => {
  const CAPACITY = 8;
  const [buckets, setBuckets] = useState<(BucketSlot | null)[]>(Array(CAPACITY).fill(null));
  const [inputKey, setInputKey] = useState<string>('');
  const [inputVal, setInputVal] = useState<string>('');
  const [logs, setLogs] = useState<string[]>(["Dictionary initialized. Add a key-value pair to hash it into the bucket array!"]);
  const [lookupKey, setLookupKey] = useState<string>('');
  const [lookupResult, setLookupResult] = useState<string | null>(null);

  // Simple deterministic Fowler-Noll-Vo-like string hash for demonstration
  const computeHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey || !inputVal) return;

    const rawHash = computeHash(inputKey);
    const initialIndex = rawHash % CAPACITY;
    
    let index = initialIndex;
    let steps = 0;
    let foundPlace = false;
    const newBuckets = [...buckets];

    // Linear probing simulation for collision resolution
    while (steps < CAPACITY) {
      const currentSlot = newBuckets[index];
      if (currentSlot === null || currentSlot.key === inputKey) {
        newBuckets[index] = {
          key: inputKey,
          val: inputVal,
          hashValue: rawHash,
          probingSteps: steps
        };
        foundPlace = true;
        break;
      }
      index = (index + 1) % CAPACITY;
      steps++;
    }

    if (foundPlace) {
      setBuckets(newBuckets);
      if (steps === 0) {
        setLogs(prev => [`[Insert] Key "${inputKey}" hashed statically to index ${initialIndex} (No collisions)`, ...prev]);
      } else {
        setLogs(prev => [
          `[Collision] index [${initialIndex}] held another key! Linear Probing stepped +${steps} times to register "${inputKey}" at index ${index}`,
          ...prev
        ]);
      }
    } else {
      setLogs(prev => [`[Capacity Error] Hash table is at full density! Resizing needed to resolve insert for "${inputKey}"`, ...prev]);
    }

    setInputKey('');
    setInputVal('');
  };

  const handleLookup = () => {
    if (!lookupKey) return;
    const rawHash = computeHash(lookupKey);
    const initialIndex = rawHash % CAPACITY;
    
    let index = initialIndex;
    let steps = 0;
    let found = false;

    while (steps < CAPACITY) {
      const currentSlot = buckets[index];
      if (currentSlot === null) {
        break;
      }
      if (currentSlot.key === lookupKey) {
        setLookupResult(`Found: "${currentSlot.val}" at bucket index ${index} after ${steps} probe checks.`);
        found = true;
        break;
      }
      index = (index + 1) % CAPACITY;
      steps++;
    }

    if (!found) {
      setLookupResult(`Not Found. Searched from index ${initialIndex} to index ${index} (${steps} check cycles parsed).`);
    }
  };

  const clearTable = () => {
    setBuckets(Array(CAPACITY).fill(null));
    setLogs(["Hash table cleared."]);
    setLookupKey('');
    setLookupResult(null);
  };

  const insertSampleKeys = () => {
    // Inject two keys mapping to SAME index under computeHash
    // Let's find samples or just insert directly
    const samples = [
      { k: "AAPL", v: "185.20" }, // hash = 2
      { k: "GOOG", v: "142.10" }, // hash = 4
      { k: "TSLA", v: "179.99" }, // hash = 2 (triggers collision check)
    ];

    let currentTable = [...buckets];
    let newLogs = [...logs];

    samples.forEach(item => {
      const hVal = computeHash(item.k);
      const startIdx = hVal % CAPACITY;
      let idx = startIdx;
      let probe = 0;
      let inserted = false;

      while (probe < CAPACITY) {
        if (currentTable[idx] === null) {
          currentTable[idx] = { key: item.k, val: item.v, hashValue: hVal, probingSteps: probe };
          inserted = true;
          break;
        }
        idx = (idx + 1) % CAPACITY;
        probe++;
      }

      if (inserted) {
        if (probe === 0) {
          newLogs.unshift(`[Insert] Created "${item.k}" at index ${startIdx}`);
        } else {
          newLogs.unshift(`[Collision resolved] "${item.k}" collided at index ${startIdx}! Probe route placed key safely at index ${idx}.`);
        }
      }
    });

    setBuckets(currentTable);
    setLogs(newLogs);
  };

  return (
    <div className="w-full bg-zinc-950 rounded-2xl border border-zinc-850 p-6 font-sans text-zinc-300 shadow-xl max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-200/10 pb-4 mb-4">
        <div>
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">High-Performance Dictionaries</span>
          <h4 className="text-sm font-semibold text-zinc-200 mt-0.5">Hashing & Collision Probing Sandbox</h4>
        </div>
        <div className="flex gap-2">
          <button
            onClick={insertSampleKeys}
            className="p-1 px-2.5 text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded hover:bg-indigo-600/30 transition-all flex items-center gap-1 font-bold"
          >
            Load Samples
          </button>
          <button
            onClick={clearTable}
            className="p-1 px-2 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-350 hover:bg-zinc-800 transition-all flex items-center gap-1 font-bold"
          >
            <RefreshCw size={10} /> Clear
          </button>
        </div>
      </div>

      {/* Insert and lookup blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <form onSubmit={handleInsert} className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900 flex flex-col gap-2">
          <span className="text-[9px] uppercase font-bold text-zinc-500">Insert Key/Value (O(1))</span>
          <div className="flex gap-1">
            <input
              type="text"
              placeholder="Key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-1/2 p-1.5 text-xs bg-black/85 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-700 outline-none focus:border-yellow-500 font-mono"
            />
            <input
              type="text"
              placeholder="Value"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-1/2 p-1.5 text-xs bg-black/85 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-700 outline-none focus:border-yellow-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full p-1.5 text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded hover:bg-yellow-500/20 transition-all flex items-center justify-center gap-1"
          >
            <Plus size={11} /> insertitem(key, val)
          </button>
        </form>

        <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900 flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-500">Fast Index Lookup</span>
            <div className="flex gap-1 mt-2">
              <input
                type="text"
                placeholder="Lookup key"
                value={lookupKey}
                onChange={(e) => setLookupKey(e.target.value)}
                className="w-full p-1.5 text-xs bg-black/85 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-700 outline-none font-mono"
              />
              <button
                onClick={handleLookup}
                className="p-1.5 px-3 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded text-xs font-bold hover:bg-zinc-700 hover:text-white transition-all flex items-center gap-1"
              >
                <Search size={11} /> Find
              </button>
            </div>
          </div>
          {lookupResult && (
            <div className="text-[10px] text-yellow-400 font-mono mt-2 leading-tight bg-black px-2 py-1 rounded border border-zinc-900">
              {lookupResult}
            </div>
          )}
        </div>
      </div>

      {/* Visual Buckets Array representation */}
      <div className="space-y-2 mb-6">
        <span className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Heap Hash Slots Array [PyDictKeysObject]</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {buckets.map((slot, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl border flex flex-col justify-between h-20 transition-all relative ${
                slot !== null 
                  ? slot.probingSteps > 0 
                    ? 'bg-amber-600/10 border-amber-500 text-amber-300' 
                    : 'bg-indigo-600/10 border-indigo-500 text-indigo-300'
                  : 'bg-zinc-900/20 border-zinc-900 text-zinc-700'
              }`}
            >
              <div className="flex justify-between items-center text-[8px] font-mono select-none">
                <span className="text-[10px] font-bold text-zinc-550">#{index}</span>
                {slot && (
                  <span className={`px-1 rounded text-[8px] font-bold ${
                    slot.probingSteps > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {slot.probingSteps === 0 ? 'Direct' : `Probe +${slot.probingSteps}`}
                  </span>
                )}
              </div>

              {slot ? (
                <div className="flex flex-col mt-1">
                  <span className="text-xs font-mono font-bold text-zinc-100 truncate">{slot.key}</span>
                  <span className="text-[10px] text-zinc-450 font-mono truncate">&rarr; {slot.val}</span>
                </div>
              ) : (
                <span className="text-[10px] font-mono italic text-zinc-800 self-center">None</span>
              )}

              {slot && slot.probingSteps > 0 && (
                <div className="absolute -top-1 -right-1">
                  <Flame size={12} className="text-amber-500 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logs section */}
      <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-900 font-mono text-xs">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2 font-bold font-sans">Hashing Sandbox Events</span>
        <div className="h-28 overflow-y-auto space-y-1 bg-black/60 p-2 border border-zinc-900 rounded font-mono text-[11px] text-zinc-450 custom-scrollbar">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-1">
              <span className="text-zinc-650">&bull;</span>
              <span className={log.includes("[Collision") ? "text-amber-400 font-bold" : "text-zinc-400"}>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
