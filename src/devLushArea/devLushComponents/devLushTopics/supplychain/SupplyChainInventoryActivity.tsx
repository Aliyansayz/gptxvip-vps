import React, { useState, useEffect } from "react";
import { Truck, Play, Activity, CheckCircle, XCircle, Terminal } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion } from "motion/react";
import { toast } from 'sonner';

const SupplyChainInventoryActivity: React.FC<{
  step: number;
  exercises: any[];
  infoVisible?: boolean;
  infoPlacement?: "side" | "bottom";
  settings?: any;
}> = ({ step, exercises, infoVisible = true, infoPlacement = "side", settings }) => {
  const question = exercises[step];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const [selected, setSelected] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setLogs([]);
    setSelected(null);
    setIsChecked(false);
  }, [step]);

  const handleCheck = () => {
      if (!selected) return;
      const correct = selected === question.answer;
      setIsChecked(true);
      if(correct) toast.success("Correct Answer!");
      else toast.error("Incorrect Answer.");
  };

  const runSimulation = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setLogs([]);
    
    const timeouts: NodeJS.Timeout[] = [];
    const qLogs = question.logs || [];
    
    qLogs.forEach((log: any, index: number) => {
      timeouts.push(setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, 1000 * (index + 1)));
    });

    timeouts.push(setTimeout(() => setIsPlaying(false), 1000 * (qLogs.length + 1)));
    return () => timeouts.forEach(clearTimeout);
  };

  const WaterReservoirAnalogy: React.FC = () => (
    <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-500" /> Analogy: Water Reservoir
        </h5>
        <svg viewBox="0 0 200 120" className="w-full h-40">
            {/* The Tank (Warehouse) */}
            <rect x="60" y="20" width="80" height="80" fill="none" stroke="#64748b" strokeWidth="3" />
            
            {/* Water Level (Inventory) */}
            <rect x="62" y="50" width="76" height="48" fill="#38bdf8" opacity="0.6" className="animate-pulse" style={{ transformOrigin: 'bottom', animationDuration: '4s' }} />
            
            {/* High Water Mark (Overstock Limit) */}
            <line x1="50" y1="30" x2="150" y2="30" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
            <text x="160" y="32" fontSize="6" fill="#ef4444">Overstock</text>

            {/* Float Valve (Reorder Point) */}
            <line x1="50" y1="70" x2="150" y2="70" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="100" cy="70" r="4" fill="#f59e0b" />
            <text x="160" y="72" fontSize="6" fill="#f59e0b">Reorder Point</text>

            {/* Intake Pipe (Supply) */}
            <path d="M 100 0 L 100 20" stroke="#3b82f6" strokeWidth="6" />
            <circle cx="100" cy="15" r="2" fill="white" className="animate-ping" style={{ animationDuration: '1s' }} />

            {/* Outtake Pipe (Demand) */}
            <path d="M 100 100 L 100 120" stroke="#3b82f6" strokeWidth="6" />
            <circle cx="100" cy="110" r="2" fill="white" className="animate-ping" style={{ animationDuration: '0.8s' }} />

            <text x="100" y="115" textAnchor="middle" fontSize="8" fill="currentColor" className="text-slate-500">Agent balances intake to maintain optimal levels</text>
        </svg>
    </div>
  );

  const WarehouseSimulationVisual = () => (
    <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-2xl flex">
        {/* Left: Animated Warehouse Map */}
        <div className="flex-1 relative p-4">
            <svg viewBox="0 0 200 200" className="w-full h-full max-h-full">
                {/* Floor Grid */}
                <defs>
                    <pattern id="floor" width="10" height="10" patternUnits="userSpaceOnUse">
                        <rect width="10" height="10" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#floor)" />

                {/* Loading Docks */}
                <rect x="0" y="20" width="20" height="160" fill="#334155" />
                <text x="10" y="100" textAnchor="middle" fontSize="6" fill="#94a3b8" transform="rotate(-90 10 100)">INBOUND</text>

                {/* Storage Racks */}
                <rect x="50" y="20" width="30" height="60" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                <rect x="50" y="120" width="30" height="60" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                
                <rect x="120" y="20" width="30" height="60" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                <rect x="120" y="120" width="30" height="60" fill="#0f172a" stroke="#475569" strokeWidth="1" />

                {/* Inventory Blocks on Racks */}
                <rect x="55" y="25" width="20" height="10" fill="#38bdf8" />
                <rect x="55" y="40" width="20" height="10" fill="#38bdf8" />
                <rect x="55" y="125" width="20" height="10" fill="#f43f5e" /> {/* Low stock */}
                
                <rect x="125" y="25" width="20" height="10" fill="#38bdf8" />
                <rect x="125" y="125" width="20" height="10" fill="#38bdf8" />

                {/* Animated Forklifts / AGVs */}
                <AnimatePresence>
                    {isPlaying && (
                        <>
                            <motion.rect x="30" y="100" width="8" height="8" fill="#eab308"
                                initial={{ x: 20, y: 100 }}
                                animate={{ x: [20, 100, 100, 50], y: [100, 100, 150, 150] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.rect x="30" y="100" width="8" height="8" fill="#eab308"
                                initial={{ x: 20, y: 100 }}
                                animate={{ x: [20, 100, 100, 120], y: [100, 100, 50, 50] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
                            />
                        </>
                    )}
                </AnimatePresence>

                {/* Agent Overlay (Radar ping when scanning) */}
                {isPlaying && (
                    <circle cx="100" cy="100" r="50" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.5" className="animate-ping" style={{ animationDuration: '2s' }} />
                )}
            </svg>
        </div>

        {/* Right: Logistics Execution Log */}
        <div className="w-1/2 border-l border-slate-800 flex flex-col bg-slate-950">
            <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center gap-2">
                <Terminal className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500">Execution Log</span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto font-mono text-xs space-y-2 custom-scrollbar">
               {logs.map((log, i) => (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, x: 10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`flex flex-col gap-0.5 ${log.level === 'warn' ? 'text-amber-500' : log.level === 'success' ? 'text-emerald-500' : 'text-sky-400'}`}
                  >
                     <span className="opacity-70">[{log.timestamp}]</span>
                     <span className="break-words leading-tight">{log.message}</span>
                  </motion.div>
               ))}
               {!isPlaying && logs.length === 0 && (
                   <div className="text-slate-500 italic">Awaiting supply chain signals...</div>
               )}
            </div>
        </div>
    </div>
  );

  const theoryData = question.theory;

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <div className="flex flex-col h-full gap-4">
            <DevLushTheoryBridge item={{ labId: 'supplychain-inventory', exerciseTitle: question.title, theory: theoryData }} />
            <WaterReservoirAnalogy />
        </div>
      </div>
    </div>
  ) : null;

  const InteractionContent = (
      <div className="space-y-6">
                {question?.question && (
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          {question.question}
        </h4>
      )}
<div className="grid grid-cols-1 gap-3">
              {question.options?.map((opt: string) => (
                  <button 
                      key={opt}
                      onClick={() => !isChecked && setSelected(opt)}
                      disabled={isChecked}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left ${selected === opt ? 'bg-sky-600 text-white border-sky-700' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                      {opt}
                  </button>
              ))}
          </div>

          <div className="flex justify-center">
              <button 
                  onClick={handleCheck} 
                  disabled={!selected || isChecked}
                  className="px-8 py-2 bg-gradient-to-r from-sky-600 to-blue-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  Evaluate Route
              </button>
          </div>

          {isChecked && (
              <div className={`p-4 rounded-lg border ${selected === question.answer ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'}`}>
                  <div className="flex items-center gap-2 mb-2 font-bold">
                      {selected === question.answer ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                      {selected === question.answer ? 'Optimization Successful!' : 'Logistics Error'}
                  </div>
                  <p className="text-sm">{question.explanation}</p>
              </div>
          )}
      </div>
  );

  return (
    <DevLushLayout
      visualContent={
        <div className="w-full h-full flex flex-col gap-6 items-center justify-center max-w-4xl mx-auto p-6">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Truck className="w-8 h-8 text-sky-600" />
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                 {question.title}
               </h3>
            </div>
            <button
              onClick={runSimulation}
              disabled={isPlaying}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                isPlaying
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40"
              }`}
            >
              {isPlaying ? (
                <><Activity className="w-5 h-5 animate-pulse" />Optimizing...</>
              ) : (
                <><Play className="w-5 h-5" />Run Inventory Agent</>
              )}
            </button>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed text-center w-full">
             {question.prompt}
          </p>

          <div className="w-full mt-4">
            <WarehouseSimulationVisual />
          </div>
        </div>
      }
      interactionContent={InteractionContent}
      theoryContent={theoryContent}
      infoVisible={infoVisible && !!theoryData}
      infoPlacement={infoPlacement}
      settings={settings}
    />
  );
};

export default SupplyChainInventoryActivity;
