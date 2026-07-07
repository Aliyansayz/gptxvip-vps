import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Database, Lock, Unlock, ShieldAlert, CheckCircle, Flame, Layers } from 'lucide-react';

interface ThreadTask {
  threadId: string;
  name: string;
  status: 'idle' | 'waiting' | 'writing' | 'failed' | 'committed';
  color: string;
}

export const PythonSqliteVisual: React.FC = () => {
  const [threads, setThreads] = useState<ThreadTask[]>([
    { threadId: 'A', name: 'Thread_A (Sales)', status: 'idle', color: 'border-blue-500 text-blue-400 bg-blue-500/10' },
    { threadId: 'B', name: 'Thread_B (Inventory)', status: 'idle', color: 'border-purple-500 text-purple-400 bg-purple-500/10' },
    { threadId: 'C', name: 'Thread_C (Invoicing)', status: 'idle', color: 'border-teal-500 text-teal-400 bg-teal-500/10' },
  ]);

  const [useLockProtection, setUseLockProtection] = useState<boolean>(true);
  const [dbState, setDbState] = useState<'IDLE' | 'LOCKED' | 'ACCESSING'>('IDLE');
  const [dbRecords, setDbRecords] = useState<{ id: number; author: string; amount: number }[]>([]);
  const [logs, setLogs] = useState<string[]>(["SQLite Database loaded. Turn Lock Protection ON or OFF and check concurrent inserts!"]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const startSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setLogs(prev => ["[Simulation Started] Simultaneous queries dispatched by Threads A, B, and C...", ...prev]);

    // Dispatch all threads nearly simultaneously
    const updatedThreads = threads.map(t => ({ ...t, status: 'waiting' as const }));
    setThreads(updatedThreads);

    if (useLockProtection) {
      // SEQUENTIAL EXECUTION WITH MUTEX
      setLogs(prev => ["[Mutex Guard State] SQLite Lock Protection active. Queuing threads to write serially.", ...prev]);
      
      for (let i = 0; i < updatedThreads.length; i++) {
        const currentThread = updatedThreads[i];
        
        // Update thread state to writing
        setThreads(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'writing' } : t));
        setDbState('LOCKED');
        setLogs(prev => [`[SQLite Mutex] ${currentThread.name} acquired Lock. Committing transaction...`, ...prev]);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Commit transaction
        const newRecord = {
          id: dbRecords.length + i + 1,
          author: currentThread.threadId,
          amount: Math.floor(Math.random() * 500) + 100
        };
        
        setDbRecords(prev => [...prev, newRecord]);
        setThreads(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'committed' } : t));
        setDbState('IDLE');
        setLogs(prev => [`[Commit] ${currentThread.name} committed Record ID ${newRecord.id} successfully. Released lock.`, ...prev]);
        
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    } else {
      // CONCURRENT COLLISION WITHOUT MUTEX
      setLogs(prev => ["⚠️ [Vulnerable Execution State] Threads committing concurrently without Mutex. Potential lock contention!", ...prev]);

      // Thread A starts writing
      setThreads(prev => [
        { ...prev[0], status: 'writing' },
        { ...prev[1], status: 'waiting' },
        { ...prev[2], status: 'waiting' },
      ]);
      setDbState('LOCKED');
      setLogs(prev => ["Thread_A starts writing to SQLite block...", ...prev]);

      await new Promise(resolve => setTimeout(resolve, 400));

      // Thread B attempts to write concurrently -> triggers sqlite3.OperationalError: database is locked
      setThreads(prev => [
        { ...prev[0], status: 'writing' },
        { ...prev[1], status: 'failed' },
        { ...prev[2], status: 'waiting' },
      ]);
      setLogs(prev => ["❌ sqlite3.OperationalError: database is locked! Thread_B concurrent insert crashed due to lack of standard synchronization.", ...prev]);

      await new Promise(resolve => setTimeout(resolve, 400));

      // Thread C also attempts to write concurrently -> triggers sqlite3.OperationalError: database is locked
      setThreads(prev => [
        { ...prev[0], status: 'committed' },
        { ...prev[1], status: 'failed' },
        { ...prev[2], status: 'failed' },
      ]);
      setDbState('IDLE');
      
      const newRecord = {
        id: dbRecords.length + 1,
        author: 'A',
        amount: 250
      };
      setDbRecords(prev => [...prev, newRecord]);

      setLogs(prev => [
        "❌ sqlite3.OperationalError: database is locked! Thread_C concurrent write crashed.",
        `[Commit] Thread_A succeeded but Threads B and C were dropped.`,
        ...prev
      ]);
    }

    setIsSimulating(false);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setThreads([
      { threadId: 'A', name: 'Thread_A (Sales)', status: 'idle', color: 'border-blue-500 text-blue-400 bg-blue-500/10' },
      { threadId: 'B', name: 'Thread_B (Inventory)', status: 'idle', color: 'border-purple-500 text-purple-400 bg-purple-500/10' },
      { threadId: 'C', name: 'Thread_C (Invoicing)', status: 'idle', color: 'border-teal-500 text-teal-400 bg-teal-500/10' },
    ]);
    setDbState('IDLE');
    setDbRecords([]);
    setLogs(["Simulation Reset. Choose thread locking configuration and test concurrency risks."]);
  };

  return (
    <div className="w-full bg-zinc-950 rounded-2xl border border-zinc-850 p-6 font-sans text-zinc-300 shadow-xl max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-200/10 pb-4 mb-4">
        <div>
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Storage Concurrency Sandbox</span>
          <h4 className="text-sm font-semibold text-zinc-200 mt-0.5">SQLite Threading & Locking Conflict</h4>
        </div>
        <div className="flex gap-2">
          <button
            onClick={startSimulation}
            disabled={isSimulating}
            className="p-1 px-3 text-xs bg-indigo-650 text-white rounded font-bold hover:bg-indigo-600 disabled:opacity-40 transition-all flex items-center gap-1"
          >
            <Play size={12} /> Fire Transactions
          </button>
          <button
            onClick={handleReset}
            className="p-1 px-2 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-350 hover:bg-zinc-800 transition-all flex items-center gap-1 font-bold"
          >
            <RotateCcw size={10} /> Reset
          </button>
        </div>
      </div>

      {/* Controller Block for Locks */}
      <div className="bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-900 flex justify-between items-center mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-zinc-200">Thread Lock Protection</span>
          <span className="text-[10px] text-zinc-500 font-mono">Use a threading.Lock mutex to synchronize connection commits</span>
        </div>
        <button
          onClick={() => !isSimulating && setUseLockProtection(!useLockProtection)}
          disabled={isSimulating}
          className={`relative w-28 p-1.5 rounded-lg border text-xs font-bold font-mono text-center flex items-center justify-center gap-1 transition-all ${
            useLockProtection 
              ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' 
              : 'bg-rose-600/10 border-rose-500 text-rose-400'
          }`}
        >
          {useLockProtection ? <Lock size={12} /> : <Unlock size={12} />}
          {useLockProtection ? "Mutex ON" : "Mutex OFF"}
        </button>
      </div>

      {/* Three Threads & Multi-Thread contention pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch mb-6">
        
        {/* Threads Pool (Left Column) */}
        <div className="md:col-span-6 flex flex-col gap-2">
          <span className="text-[9px] uppercase font-bold text-zinc-500 block">Worker Concurrency Threads</span>
          {threads.map((t) => (
            <div
              key={t.threadId}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                t.status === 'writing' 
                  ? t.color + ' shadow-[0_0_10px_rgba(59,130,246,0.1)] border-solid ring-1 ring-zinc-500' 
                  : t.status === 'waiting'
                  ? 'bg-zinc-900/40 border-yellow-500/20 text-yellow-400'
                  : t.status === 'committed'
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : t.status === 'failed'
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 animate-shake'
                  : 'bg-zinc-900/25 border-zinc-900 text-zinc-650'
              }`}
            >
              <span>{t.name}</span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-black/60 border border-zinc-850">
                {t.status}
              </span>
            </div>
          ))}
        </div>

        {/* Database state (Right Column) */}
        <div className="md:col-span-6 bg-zinc-900/30 rounded-xl p-3 border border-zinc-900 flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-zinc-600">SQLite core file status</span>
          
          <div className="flex flex-col items-center justify-center p-4">
            <Database className={`w-10 h-10 transition-all ${
              dbState === 'LOCKED' ? 'text-amber-500 scale-105' : 'text-zinc-600 scale-100'
            }`} />
            
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`w-2 h-2 rounded-full ${
                dbState === 'LOCKED' ? 'bg-amber-400 animate-ping' : 'bg-zinc-700'
              }`} />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                {dbState === 'LOCKED' ? "WAL Locked (Writes Busy)" : "UNLOCKED / WAL idle"}
              </span>
            </div>
          </div>

          <div className="bg-black border border-zinc-900 p-2 rounded max-h-[80px] overflow-y-auto text-[10px] font-mono custom-scrollbar text-zinc-400">
            <div className="text-[8px] uppercase font-bold text-zinc-600 mb-1 border-b border-zinc-900 pb-0.5">Live Database Records</div>
            {dbRecords.length === 0 ? (
              <span className="text-zinc-700 italic">No records committed.</span>
            ) : (
              dbRecords.map((r, i) => (
                <div key={i} className="flex justify-between items-center text-emerald-400 font-bold border-b border-zinc-950 py-0.5">
                  <span>ID: {r.id} ({r.author})</span>
                  <span>+${r.amount} USD</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Logs section */}
      <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-900 font-mono text-xs">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2 font-bold font-sans">Storage Lock Logs</span>
        <div className="h-28 overflow-y-auto space-y-1 bg-black/60 p-2 border border-zinc-900 rounded font-mono text-[11px] text-zinc-400 custom-scrollbar">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-1">
              <span className="text-zinc-650">&bull;</span>
              <span className={log.includes("❌") ? "text-rose-400 font-bold" : log.includes("Mutex") ? "text-indigo-400" : log.includes("[Commit]") ? "text-emerald-400" : "text-zinc-400"}>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
