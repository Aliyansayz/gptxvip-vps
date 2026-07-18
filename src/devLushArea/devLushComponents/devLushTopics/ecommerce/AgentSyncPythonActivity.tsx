import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import {
  CheckCircle,
  XCircle,
  Cpu,
  RefreshCw,
  AlertTriangle,
  Play,
  Terminal,
  Lock,
  Unlock,
  Database,
  Code
} from 'lucide-react';
import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import { DevLushLayout } from '../../devLushTopicsView/DevLushLayout';
import SaveTheoryButton from '../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';
import { DevLushTheoryBridge } from '../../devLushTopicsView/DevLushTheoryBridge';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const AgentSyncPythonActivity: React.FC<ChapterProps> = ({
  step,
  exercises,
  infoVisible,
  infoPlacement,
  settings
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [lockingEnabled, setLockingEnabled] = useState(false);
  const [activeWorker, setActiveWorker] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [lockState, setLockState] = useState<'UNLOCKED' | 'LOCKED'>('UNLOCKED');

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    resetSimulator();
  }, [step]);

  const resetSimulator = () => {
    setIsRunning(false);
    setActiveWorker(null);
    setLockState('UNLOCKED');
    if (step === 0) {
      setLogs([
        "SYSTEM: Python asyncio event loop initialized.",
        "AGENT: Standing by with 3 concurrent coroutines...",
        "Toggle 'asyncio.Lock()' and click 'Run Simulation Loop'."
      ]);
    } else {
      setLogs([
        "SYSTEM: Redis client cluster ready.",
        "AGENT: Standing by with 3 distributed Python containers...",
        "Toggle 'Redis Distributed Lock' and click 'Run Simulation Loop'."
      ]);
    }
  };

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setLockState('UNLOCKED');

    const logSequence = step === 0 ? [
      { text: "SYSTEM: Spawning task_A, task_B, task_C concurrently...", delay: 0 },
      { text: "task_A: Initiating checkout for item 'Vintage Leather Jacket'...", delay: 400, activeWorker: 1 },
      { text: "task_B: Initiating checkout for item 'Vintage Leather Jacket'...", delay: 800, activeWorker: 2 },
      { text: "task_C: Initiating checkout for item 'Vintage Leather Jacket'...", delay: 1200, activeWorker: 3 },

      // If lock is enabled, Task A gets it, Task B waits, Task C waits
      lockingEnabled ? { text: "task_A: async with lock: successfully acquired asyncio.Lock()", delay: 1600, lock: 'LOCKED', activeWorker: 1 } : null,
      lockingEnabled ? { text: "task_B: Lock is acquired by task_A. Suspending coroutine... yielding control.", delay: 2000, activeWorker: 2 } : null,
      lockingEnabled ? { text: "task_C: Lock is acquired by task_A. Suspending coroutine... yielding control.", delay: 2400, activeWorker: 3 } : null,

      lockingEnabled ? { text: "task_A: Verified stock (1). Processing secure payment...", delay: 2800, activeWorker: 1 } : null,
      lockingEnabled ? { text: "task_A: Order placed. Decreasing stock to 0. Releasing lock...", delay: 3600, lock: 'UNLOCKED', activeWorker: 1 } : null,

      lockingEnabled ? { text: "task_B: Resumed execution! Acquired asyncio.Lock(). Checking stock...", delay: 4200, lock: 'LOCKED', activeWorker: 2 } : null,
      lockingEnabled ? { text: "task_B: Stock is 0. Aborting transaction safely! Releasing lock...", delay: 4800, lock: 'UNLOCKED', activeWorker: 2 } : null,
      lockingEnabled ? { text: "task_C: Resumed execution! Acquired asyncio.Lock(). Checking stock...", delay: 5400, lock: 'LOCKED', activeWorker: 3 } : null,
      lockingEnabled ? { text: "task_C: Stock is 0. Aborting transaction safely! Releasing lock...", delay: 6000, lock: 'UNLOCKED', activeWorker: 3 } : null,
      lockingEnabled ? { text: "SYSTEM: Concurrency serialized. Data integrity maintained!", delay: 6600, toast: 'success', msg: 'Perfect serialization! Stock guarded.' } : null,

      // If lock is disabled, race conditions happen immediately
      !lockingEnabled ? { text: "task_A: Verified stock (1). Processing payment...", delay: 1600, activeWorker: 1 } : null,
      !lockingEnabled ? { text: "task_B: Verified stock (1) [RACE CONDITION / STALE READ]. Processing payment...", delay: 2000, activeWorker: 2 } : null,
      !lockingEnabled ? { text: "task_C: Verified stock (1) [RACE CONDITION / STALE READ]. Processing payment...", delay: 2400, activeWorker: 3 } : null,
      !lockingEnabled ? { text: "task_A: Payment complete. Order placed successfully.", delay: 2800, activeWorker: 1 } : null,
      !lockingEnabled ? { text: "task_B: Payment complete. CRITICAL: Product oversold! Stock = -1.", delay: 3400, activeWorker: 2 } : null,
      !lockingEnabled ? { text: "task_C: Payment complete. CRITICAL: Product oversold! Stock = -2.", delay: 4000, activeWorker: 3 } : null,
      !lockingEnabled ? { text: "SYSTEM: Severe concurrency collision! Database state is corrupted.", delay: 4600, toast: 'error', msg: 'Concurrency race hit! Product oversold.' } : null,

    ].filter(Boolean) as any[] : [
      { text: "SYSTEM: Spawning 3 distributed worker instances across Kubernetes...", delay: 0 },
      { text: "worker_1: Attempting to grab redis lock 'lock:inventory:4023'...", delay: 400, activeWorker: 1 },
      { text: "worker_2: Attempting to grab redis lock 'lock:inventory:4023'...", delay: 800, activeWorker: 2 },
      { text: "worker_3: Attempting to grab redis lock 'lock:inventory:4023'...", delay: 1200, activeWorker: 3 },

      lockingEnabled ? { text: "worker_1: SUCCESS. setnx('lock:inventory:4023', val, px=5000) returned True.", delay: 1600, lock: 'LOCKED', activeWorker: 1 } : null,
      lockingEnabled ? { text: "worker_2: FAILED. setnx returned False (lock owned by worker_1). Sleeping...", delay: 2100, activeWorker: 2 } : null,
      lockingEnabled ? { text: "worker_3: FAILED. setnx returned False (lock owned by worker_1). Sleeping...", delay: 2600, activeWorker: 3 } : null,

      lockingEnabled ? { text: "worker_1: Reading inventory ledger. Performing atomic transaction...", delay: 3100, activeWorker: 1 } : null,
      lockingEnabled ? { text: "worker_1: Job finished. Deleting Redis key 'lock:inventory:4023' (Released).", delay: 3800, lock: 'UNLOCKED', activeWorker: 1 } : null,

      lockingEnabled ? { text: "worker_2: Retrying lock... SUCCESS! Acquired lock.", delay: 4300, lock: 'LOCKED', activeWorker: 2 } : null,
      lockingEnabled ? { text: "worker_2: Inventory empty. Releasing lock...", delay: 5000, lock: 'UNLOCKED', activeWorker: 2 } : null,
      lockingEnabled ? { text: "worker_3: Retrying lock... SUCCESS! Acquired lock.", delay: 5500, lock: 'LOCKED', activeWorker: 3 } : null,
      lockingEnabled ? { text: "worker_3: Inventory empty. Releasing lock...", delay: 6200, lock: 'UNLOCKED', activeWorker: 3 } : null,
      lockingEnabled ? { text: "SYSTEM: Distributed lock successfully synchronized Kubernetes pods.", delay: 6800, toast: 'success', msg: 'Distributed Redis lock protected multi-cluster agents!' } : null,

      !lockingEnabled ? { text: "worker_1: Reading ledger... stock = 1. Updating database...", delay: 1600, activeWorker: 1 } : null,
      !lockingEnabled ? { text: "worker_2: Reading ledger... stock = 1 (State mismatch). Updating database...", delay: 2200, activeWorker: 2 } : null,
      !lockingEnabled ? { text: "worker_3: Reading ledger... stock = 1 (State mismatch). Updating database...", delay: 2800, activeWorker: 3 } : null,
      !lockingEnabled ? { text: "worker_1: Database updated. Transaction complete.", delay: 3400, activeWorker: 1 } : null,
      !lockingEnabled ? { text: "worker_2: Database updated. Double-charge or duplicate shipping occurred!", delay: 4000, activeWorker: 2 } : null,
      !lockingEnabled ? { text: "worker_3: Database updated. Double-charge or duplicate shipping occurred!", delay: 4600, activeWorker: 3 } : null,
      !lockingEnabled ? { text: "SYSTEM: Parallel container write collison detected. Data consistency lost.", delay: 5200, toast: 'error', msg: 'Multiple containers edited same record concurrently!' } : null,
    ].filter(Boolean) as any[];

    logSequence.forEach((item) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${item.text}`]);
        if (item.activeWorker !== undefined) {
          setActiveWorker(item.activeWorker);
        }
        if (item.lock !== undefined) {
          setLockState(item.lock);
        }
        if (item.toast === 'success') {
          toast.success(item.msg);
        } else if (item.toast === 'error') {
          toast.error(item.msg);
        }
      }, item.delay);
    });

    const totalDuration = logSequence[logSequence.length - 1].delay + 500;
    setTimeout(() => {
      setIsRunning(false);
      setActiveWorker(null);
    }, totalDuration);
  };

  const checkAnswer = () => {
    if (!selectedAnswer) {
      toast.error("Please select an option before verifying.");
      return;
    }
    const correct = selectedAnswer === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      toast.success("Correct analysis! Excellent work.");
    } else {
      toast.error("Incorrect theory alignment. Read the explanation.");
    }
  };

  const codeSnippetPython = step === 0 ? `import asyncio

lock = asyncio.Lock()

async def process_checkout(agent_id):
    # With Locking Enabled:
    async with lock:
        # Critical Section
        stock = await db.get_stock("item_402")
        if stock > 0:
            await db.set_stock("item_402", stock - 1)
            await payment.charge_agent(agent_id)
            print(f"Task {agent_id}: Order Complete")
        else:
            print(f"Task {agent_id}: Out of Stock")` : `import redis
import time

r = redis.Redis(host='localhost', port=6379, db=0)

def process_checkout_distributed(agent_id):
    lock_key = "lock:inventory:4023"
    # With Locking Enabled:
    if r.set(lock_key, agent_id, nx=True, px=5000):
        try:
            # Critical Section
            stock = db.get_stock("item_402")
            if stock > 0:
                db.set_stock("item_402", stock - 1)
                print(f"Worker {agent_id}: Checked Out")
        finally:
            # Release lock atomically
            if r.get(lock_key) == agent_id:
                r.delete(lock_key)
    else:
        print(f"Worker {agent_id}: Lock busy, retry later")`;

  const visualContent = (
    <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
      <h5 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">
        Analogy: Synchronization Flow
      </h5>
      <div className="w-full flex flex-col lg:grid lg:grid-cols-12 gap-4">
        {/* Simulation Dashboard Left Column: Code and Controls */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          {/* Code Visualizer */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold flex items-center gap-1">
                <Code className="w-3.5 h-3.5" /> PYTHON_SYNCHRONIZATION_CODE
              </span>
              <span className="text-[10px] font-mono text-slate-500">Python 3.11</span>
            </div>
            <pre className="text-[10px] font-mono text-slate-300 leading-relaxed overflow-x-auto select-none max-h-[170px] custom-scrollbar">
              <code>{codeSnippetPython}</code>
            </pre>
          </div>

          {/* Live Controller Panel */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-400">Simulation Config</span>
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-all shadow-md"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Run Simulation</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Lock state display */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] text-slate-500 font-mono uppercase mb-1">Mutex Lock State</span>
                <div className={`flex items-center gap-1 text-xs font-bold font-mono px-2 py-1 rounded-md ${lockState === 'LOCKED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  {lockState === 'LOCKED' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  {lockState}
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] text-slate-500 font-mono uppercase mb-1">Apply Lock Policy</span>
                <button
                  onClick={() => {
                    if (isRunning) return;
                    setLockingEnabled(!lockingEnabled);
                  }}
                  disabled={isRunning}
                  className={`p-1 px-3 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${lockingEnabled ? 'bg-indigo-500 text-white shadow-sm' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                >
                  {lockingEnabled ? 'LOCK: ACTIVE' : 'LOCK: NONE'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Dashboard Right Column: Graphic Visualization and Logs */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          {/* Workers Node Map */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200">
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold block mb-3">CONCURRENT PYTHON CO-ROUTINES</span>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((workerId) => {
                const isCurrent = activeWorker === workerId;
                const titleName = step === 0 ? `task_${String.fromCharCode(64 + workerId).toLowerCase()}` : `worker_${workerId}`;
                return (
                  <div
                    key={workerId}
                    className={`p-3 rounded-lg border text-center transition-all duration-300 flex flex-col items-center justify-center ${isCurrent ? 'border-indigo-400 bg-indigo-950/40 text-indigo-300 scale-105 shadow-md shadow-indigo-950/50' : 'border-slate-800 bg-slate-900 text-slate-500'}`}
                  >
                    <Cpu className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-mono font-bold">{titleName}</span>
                    <span className="text-[8px] opacity-75 mt-0.5 font-mono">{isCurrent ? 'ACQUIRING' : 'IDLE'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Console Log Window */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex-1 min-h-[150px] max-h-[170px] overflow-y-auto font-mono text-xs text-slate-300 space-y-1 custom-scrollbar">
            {logs.map((log, idx) => (
              <div key={idx} className={`leading-relaxed border-l-2 pl-2 ${log.includes("CRITICAL") || log.includes("FAILED") ? "border-rose-500 text-rose-400 font-bold" : log.includes("SUCCESS") || log.includes("acquired") ? "border-emerald-500 text-emerald-400" : log.includes("task_") || log.includes("worker_") ? "border-indigo-500 text-indigo-300" : "border-slate-800 text-slate-400"}`}>
                {log}
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] animate-pulse">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                <span>Running parallel co-routines...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const interactionContent = (
    <div className="space-y-4">
            {question?.question && (
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          {question.question}
        </h4>
      )}
<div className="grid grid-cols-1 gap-3">
        {question.options.map((opt, i) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={i}
              onClick={() => {
                if (showResult) return;
                setSelectedAnswer(opt);
              }}
              disabled={showResult}
              className={`text-left p-4 rounded-xl border font-sans text-sm font-medium transition-all duration-200 ${showResult ? (opt === question.answer ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' : isSelected ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-400 text-rose-700 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-65') : isSelected ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-700 dark:text-indigo-400 scale-[1.01]' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isSelected ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 leading-snug">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center gap-4 pt-2">
        <button
          onClick={resetSimulator}
          className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline animate-fade-in"
        >
          Reset Simulator
        </button>

        {!showResult ? (
          <button
            onClick={checkAnswer}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            Verify Analysis
          </button>
        ) : (
          <div className="flex items-center gap-2 animate-in fade-in">
            {isCorrect ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/30">
                <CheckCircle className="w-4 h-4" /> Correct Analysis
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-bold text-sm flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/20 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/30">
                <XCircle className="w-4 h-4" /> Review Theory Blueprint
              </span>
            )}
          </div>
        )}
      </div>

      {showResult && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-2">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Interactive Review:</p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );

  const theoryContent = (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={question.theory || question} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'ecommerce-python', exerciseTitle: question.title, theory: question.theory }} />
      </div>
    </div>
  );

  return (
    <DevLushLayout
      title={question.title}
      prompt={question.prompt}
      visualContent={visualContent}
      interactionContent={interactionContent}
      theoryContent={theoryContent}
      infoVisible={infoVisible}
      infoPlacement={infoPlacement}
      settings={settings}
    />
  );
};

export default AgentSyncPythonActivity;
