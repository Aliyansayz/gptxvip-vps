import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../../types';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Layers, 
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

export const AgentSyncTypescriptActivity: React.FC<ChapterProps> = ({ 
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
        "SYSTEM: Node.js V8 execution thread active.",
        "AGENT: Standing by with 3 asynchronous Promise executions...",
        "Toggle 'async-mutex.Mutex()' and click 'Run Simulation Loop'."
      ]);
    } else {
      setLogs([
        "SYSTEM: PostgreSQL connection pool active.",
        "AGENT: Standing by with 3 parallel transactions on serverless triggers...",
        "Toggle 'pg_advisory_xact_lock' and click 'Run Simulation Loop'."
      ]);
    }
  };

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setLockState('UNLOCKED');

    const logSequence = step === 0 ? [
      { text: "SYSTEM: Triggering 3 asynchronous checkout Promise chains...", delay: 0 },
      { text: "promise_1: Executing await db.getProduct(ID) [STOCK: 1]...", delay: 400, activeWorker: 1 },
      { text: "promise_2: Executing await db.getProduct(ID) [STOCK: 1]...", delay: 800, activeWorker: 2 },
      { text: "promise_3: Executing await db.getProduct(ID) [STOCK: 1]...", delay: 1200, activeWorker: 3 },
      
      lockingEnabled ? { text: "promise_1: mutex.acquire() success. Entering critical block...", delay: 1600, lock: 'LOCKED', activeWorker: 1 } : null,
      lockingEnabled ? { text: "promise_2: Mutex occupied. Suspending in microtask queue...", delay: 2000, activeWorker: 2 } : null,
      lockingEnabled ? { text: "promise_3: Mutex occupied. Suspending in microtask queue...", delay: 2400, activeWorker: 3 } : null,
      
      lockingEnabled ? { text: "promise_1: Decrementing stock. Saving order record...", delay: 2900, activeWorker: 1 } : null,
      lockingEnabled ? { text: "promise_1: Release lock. Completed checkout.", delay: 3600, lock: 'UNLOCKED', activeWorker: 1 } : null,
      
      lockingEnabled ? { text: "promise_2: Resolved mutex wait. Acquired lock. Checking stock...", delay: 4200, lock: 'LOCKED', activeWorker: 2 } : null,
      lockingEnabled ? { text: "promise_2: Stock is 0! Aborting order safely. Release lock.", delay: 4800, lock: 'UNLOCKED', activeWorker: 2 } : null,
      lockingEnabled ? { text: "promise_3: Resolved mutex wait. Acquired lock. Checking stock...", delay: 5400, lock: 'LOCKED', activeWorker: 3 } : null,
      lockingEnabled ? { text: "promise_3: Stock is 0! Aborting order safely. Release lock.", delay: 6000, lock: 'UNLOCKED', activeWorker: 3 } : null,
      lockingEnabled ? { text: "SYSTEM: Event Loop serialization complete. No double-orders occurred.", delay: 6600, toast: 'success', msg: 'Perfect async-mutex lock. Race condition neutralized!' } : null,

      !lockingEnabled ? { text: "promise_1: Stock read (1). Awaiting chargeCard()... yielding thread.", delay: 1600, activeWorker: 1 } : null,
      !lockingEnabled ? { text: "promise_2: Stock read (1). Awaiting chargeCard()... yielding thread.", delay: 2100, activeWorker: 2 } : null,
      !lockingEnabled ? { text: "promise_3: Stock read (1). Awaiting chargeCard()... yielding thread.", delay: 2600, activeWorker: 3 } : null,
      !lockingEnabled ? { text: "promise_1: Card charged. Decreased stock to 0.", delay: 3100, activeWorker: 1 } : null,
      !lockingEnabled ? { text: "promise_2: Card charged. CRITICAL: stock decreased to -1!", delay: 3700, activeWorker: 2 } : null,
      !lockingEnabled ? { text: "promise_3: Card charged. CRITICAL: stock decreased to -2!", delay: 4300, activeWorker: 3 } : null,
      !lockingEnabled ? { text: "SYSTEM: Fatal double-sell race collision! Database corrupted.", delay: 4900, toast: 'error', msg: 'Concurrency collision. Inventory ledger compromised.' } : null,

    ].filter(Boolean) as any[] : [
      { text: "SYSTEM: Serverless routers processing 3 concurrent checkout webhook requests...", delay: 0 },
      { text: "txn_1: BEGIN TRANSACTION. Acquiring pg_advisory_xact_lock(4023)...", delay: 400, activeWorker: 1 },
      { text: "txn_2: BEGIN TRANSACTION. Acquiring pg_advisory_xact_lock(4023)...", delay: 800, activeWorker: 2 },
      { text: "txn_3: BEGIN TRANSACTION. Acquiring pg_advisory_xact_lock(4023)...", delay: 1200, activeWorker: 3 },

      lockingEnabled ? { text: "txn_1: Advisory lock GRANTED. Lock acquired on postgres cluster.", delay: 1600, lock: 'LOCKED', activeWorker: 1 } : null,
      lockingEnabled ? { text: "txn_2: Lock occupied. Postgres puts connection in WAITING queue.", delay: 2100, activeWorker: 2 } : null,
      lockingEnabled ? { text: "txn_3: Lock occupied. Postgres puts connection in WAITING queue.", delay: 2600, activeWorker: 3 } : null,

      lockingEnabled ? { text: "txn_1: Executing SELECT stock FROM inventory WHERE id = 4023... [Stock: 1]", delay: 3100, activeWorker: 1 } : null,
      lockingEnabled ? { text: "txn_1: UPDATE inventory SET stock = 0. COMMIT (Advisory lock automatically released).", delay: 3800, lock: 'UNLOCKED', activeWorker: 1 } : null,

      lockingEnabled ? { text: "txn_2: Postgres resumes txn_2. Lock GRANTED. Checking stock... [Stock: 0]", delay: 4300, lock: 'LOCKED', activeWorker: 2 } : null,
      lockingEnabled ? { text: "txn_2: Stock empty. ABORT/COMMIT. Lock released.", delay: 5000, lock: 'UNLOCKED', activeWorker: 2 } : null,
      lockingEnabled ? { text: "txn_3: Postgres resumes txn_3. Lock GRANTED. Checking stock... [Stock: 0]", delay: 5500, lock: 'LOCKED', activeWorker: 3 } : null,
      lockingEnabled ? { text: "txn_3: Stock empty. ABORT/COMMIT. Lock released.", delay: 6200, lock: 'UNLOCKED', activeWorker: 3 } : null,
      lockingEnabled ? { text: "SYSTEM: Distributed PostgreSQL transaction advisory lock successfully protected database records.", delay: 6800, toast: 'success', msg: 'Postgres advisory lock safely synchronized independent triggers!' } : null,

      !lockingEnabled ? { text: "txn_1: Executing SELECT stock... Stock = 1", delay: 1600, activeWorker: 1 } : null,
      !lockingEnabled ? { text: "txn_2: Executing SELECT stock... Stock = 1 (State mismatch)", delay: 2200, activeWorker: 2 } : null,
      !lockingEnabled ? { text: "txn_3: Executing SELECT stock... Stock = 1 (State mismatch)", delay: 2800, activeWorker: 3 } : null,
      !lockingEnabled ? { text: "txn_1: UPDATE inventory SET stock = 0. COMMIT.", delay: 3400, activeWorker: 1 } : null,
      !lockingEnabled ? { text: "txn_2: UPDATE inventory SET stock = 0. COMMIT. (Double-sale transaction completed)", delay: 4000, activeWorker: 2 } : null,
      !lockingEnabled ? { text: "txn_3: UPDATE inventory SET stock = 0. COMMIT. (Triple-sale transaction completed)", delay: 4600, activeWorker: 3 } : null,
      !lockingEnabled ? { text: "SYSTEM: Parallel connection updates bypassed protection. Severe data leakage.", delay: 5200, toast: 'error', msg: 'Unprotected serverless routes double-sold database items concurrently!' } : null,
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

  const codeSnippetTypescript = step === 0 ? `import { Mutex } from 'async-mutex';

const mutex = new Mutex();

async function processCheckout(agentId: string) {
    // With Locking Enabled:
    const release = await mutex.acquire();
    try {
        // Critical Section
        const stock = await db.getInventory("item_402");
        if (stock > 0) {
            await db.updateInventory("item_402", stock - 1);
            await payment.charge(agentId);
            console.log(\`Agent \${agentId}: Checked out\`);
        }
    } finally {
        release(); // Guarantees release
    }
}` : `import { db } from './db';

async function processCheckoutDistributed(agentId: string) {
    await db.transaction(async (tx) => {
        // With Advisory Locking Enabled:
        // Use a unique transaction key for item_4023
        await tx.execute(
            sql\`SELECT pg_advisory_xact_lock(4023)\`
        );
        
        // Critical Section is now synchronized database-wide
        const [inv] = await tx.select().from(inventory).where(eq(inventory.id, 4023));
        if (inv.stock > 0) {
            await tx.update(inventory).set({ stock: inv.stock - 1 }).where(eq(inventory.id, 4023));
            console.log(\`Agent \${agentId}: Secured Checkout\`);
        }
    });
}`;

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
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold flex items-center gap-1">
                <Code className="w-3.5 h-3.5" /> TYPESCRIPT_SYNCHRONIZATION_CODE
              </span>
              <span className="text-[10px] font-mono text-slate-500">TypeScript 5.x</span>
            </div>
            <pre className="text-[10px] font-mono text-slate-300 leading-relaxed overflow-x-auto select-none max-h-[170px] custom-scrollbar">
              <code>{codeSnippetTypescript}</code>
            </pre>
          </div>

          {/* Live Controller Panel */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-400">Simulation Config</span>
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg transition-all shadow-md"
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
                  className={`p-1 px-3 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${lockingEnabled ? 'bg-cyan-500 text-white shadow-sm' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
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
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold block mb-3">CONCURRENT TYPESCRIPT PROMISES</span>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((workerId) => {
                const isCurrent = activeWorker === workerId;
                const titleName = step === 0 ? `promise_${workerId}` : `txn_${workerId}`;
                return (
                  <div 
                    key={workerId} 
                    className={`p-3 rounded-lg border text-center transition-all duration-300 flex flex-col items-center justify-center ${isCurrent ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 scale-105 shadow-md shadow-cyan-950/50' : 'border-slate-800 bg-slate-900 text-slate-500'}`}
                  >
                    <Layers className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-mono font-bold">{titleName}</span>
                    <span className="text-[8px] opacity-75 mt-0.5 font-mono">{isCurrent ? 'WAITING' : 'IDLE'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Console Log Window */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex-1 min-h-[150px] max-h-[170px] overflow-y-auto font-mono text-xs text-slate-300 space-y-1 custom-scrollbar">
            {logs.map((log, idx) => (
              <div key={idx} className={`leading-relaxed border-l-2 pl-2 ${log.includes("CRITICAL") || log.includes("FAILED") ? "border-rose-500 text-rose-400 font-bold" : log.includes("SUCCESS") || log.includes("acquired") || log.includes("GRANTED") ? "border-emerald-500 text-emerald-400" : log.includes("promise_") || log.includes("txn_") ? "border-cyan-500 text-cyan-300" : "border-slate-800 text-slate-400"}`}>
                {log}
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] animate-pulse">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></span>
                <span>Running Node.js asynchronous loop...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const interactionContent = (
    <div className="space-y-4">
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
              className={`text-left p-4 rounded-xl border font-sans text-sm font-medium transition-all duration-200 ${showResult ? (opt === question.answer ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' : isSelected ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-400 text-rose-700 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-65') : isSelected ? 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-500 text-cyan-700 dark:text-cyan-400 scale-[1.01]' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isSelected ? 'bg-cyan-500 text-white border-cyan-600' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
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
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
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
        <DevLushTheoryBridge item={{ labId: 'ecommerce-typescript', exerciseTitle: question.title, theory: question.theory }} />
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

export default AgentSyncTypescriptActivity;
