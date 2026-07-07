import React, { useState, useEffect } from "react";
import { HeartPulse, Play, Activity, CheckCircle, XCircle, Terminal } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion } from "motion/react";
import { toast } from 'sonner';

const HealthcareActivity: React.FC<{
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

  const MedicalTriageAnalogy: React.FC = () => (
    <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" /> Analogy: Medical Triage
        </h5>
        <svg viewBox="0 0 200 120" className="w-full h-40">
            {/* Patients entering */}
            <circle cx="20" cy="50" r="5" fill="#94a3b8" />
            <circle cx="40" cy="40" r="5" fill="#94a3b8" />
            <circle cx="30" cy="70" r="5" fill="#94a3b8" />
            
            {/* Triage Nurse (Agent) */}
            <rect x="70" y="40" width="20" height="40" rx="4" fill="#fecdd3" stroke="#e11d48" strokeWidth="2" />
            <path d="M 75 55 L 85 55 M 80 50 L 80 60" stroke="#e11d48" strokeWidth="2" />

            {/* Sorting paths */}
            <path d="M 95 60 L 120 20" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="2 2" />
            <path d="M 95 60 L 120 60" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="2 2" />
            <path d="M 95 60 L 120 100" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="2 2" />

            {/* Red (Urgent) Lane */}
            <rect x="130" y="10" width="50" height="20" rx="2" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
            <circle cx="155" cy="20" r="4" fill="#ef4444" className="animate-pulse" />
            
            {/* Yellow (Monitor) Lane */}
            <rect x="130" y="50" width="50" height="20" rx="2" fill="#fef9c3" stroke="#eab308" strokeWidth="2" />
            <circle cx="155" cy="60" r="4" fill="#eab308" />
            
            {/* Green (Discharge) Lane */}
            <rect x="130" y="90" width="50" height="20" rx="2" fill="#dcfce3" stroke="#22c55e" strokeWidth="2" />
            <circle cx="155" cy="100" r="4" fill="#22c55e" />

            <text x="100" y="115" textAnchor="middle" fontSize="8" fill="currentColor" className="text-slate-500">Agent sorts unstructured data by clinical urgency</text>
        </svg>
    </div>
  );

  const DiagnosticFunnelVisual = () => (
    <div className="relative w-full h-64 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl flex">
        {/* Left: Animated Funnel */}
        <div className="flex-1 relative flex items-center justify-center p-4">
            <svg viewBox="0 0 200 200" className="w-full h-full max-h-full">
                {/* Funnel Outline */}
                <path d="M 20 20 L 180 20 L 130 100 L 130 180 L 70 180 L 70 100 Z" fill="#f1f5f9" className="dark:fill-slate-800" stroke="#cbd5e1" strokeWidth="2" />
                
                {/* AI Agent Processor Node */}
                <rect x="80" y="80" width="40" height="40" rx="8" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" className={isPlaying ? "animate-pulse" : ""} />
                <path d="M 90 100 L 110 100 M 100 90 L 100 110" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" />

                {/* Incoming Raw Data (Documents, Sensors) */}
                <AnimatePresence>
                    {isPlaying && (
                        <>
                            <motion.rect x="40" y="0" width="15" height="20" fill="#94a3b8" initial={{ y: -20, opacity: 0 }} animate={{ y: 90, opacity: 1, scale: 0.5 }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "linear" }} />
                            <motion.circle cx="160" cy="0" r="8" fill="#64748b" initial={{ y: -20, opacity: 0 }} animate={{ y: 90, opacity: 1, scale: 0.5 }} transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 0.5 }} />
                            <motion.rect x="100" y="0" width="20" height="15" fill="#cbd5e1" initial={{ y: -20, opacity: 0 }} animate={{ y: 90, opacity: 1, scale: 0.5 }} transition={{ duration: 1.2, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 1 }} />
                        </>
                    )}
                </AnimatePresence>

                {/* Extracted Insights (Logs output mapping) */}
                <AnimatePresence>
                    {logs.map((log, i) => {
                        const isWarn = log.level === 'warn';
                        const isSuccess = log.level === 'success';
                        const color = isWarn ? "#f59e0b" : isSuccess ? "#10b981" : "#3b82f6";
                        return (
                            <motion.circle
                                key={i}
                                r="6"
                                fill={color}
                                initial={{ cx: 100, cy: 120, opacity: 0 }}
                                animate={{ cx: 100, cy: 190, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        );
                    })}
                </AnimatePresence>
            </svg>
        </div>

        {/* Right: Clinical Data Feed */}
        <div className="w-1/2 border-l border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-950">
            <div className="bg-slate-100 dark:bg-slate-900 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <Terminal className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500">Processed Output</span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto font-mono text-xs space-y-2 custom-scrollbar">
               {logs.map((log, i) => (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, x: 10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`flex flex-col gap-0.5 ${log.level === 'warn' ? 'text-amber-600 dark:text-amber-400' : log.level === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                     <span className="opacity-70">[{log.timestamp}]</span>
                     <span className="break-words leading-tight">{log.message}</span>
                  </motion.div>
               ))}
               {!isPlaying && logs.length === 0 && (
                   <div className="text-slate-400 italic">Waiting for medical data input...</div>
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
            <DevLushTheoryBridge item={{ labId: 'healthcare-agents', exerciseTitle: question.title, theory: theoryData }} />
            <MedicalTriageAnalogy />
        </div>
      </div>
    </div>
  ) : null;

  const InteractionContent = (
      <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3">
              {question.options?.map((opt: string) => (
                  <button 
                      key={opt}
                      onClick={() => !isChecked && setSelected(opt)}
                      disabled={isChecked}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left ${selected === opt ? 'bg-rose-500 text-white border-rose-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                      {opt}
                  </button>
              ))}
          </div>

          <div className="flex justify-center">
              <button 
                  onClick={handleCheck} 
                  disabled={!selected || isChecked}
                  className="px-8 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  Evaluate Impact
              </button>
          </div>

          {isChecked && (
              <div className={`p-4 rounded-lg border ${selected === question.answer ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'}`}>
                  <div className="flex items-center gap-2 mb-2 font-bold">
                      {selected === question.answer ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                      {selected === question.answer ? 'Correct Insights!' : 'Incorrect Application'}
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
               <HeartPulse className="w-8 h-8 text-rose-500" />
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
                  : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40"
              }`}
            >
              {isPlaying ? (
                <><Activity className="w-5 h-5 animate-pulse" />Analyzing...</>
              ) : (
                <><Play className="w-5 h-5" />Start Agent Workflow</>
              )}
            </button>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed text-center w-full">
             {question.prompt}
          </p>

          <div className="w-full mt-4">
            <DiagnosticFunnelVisual />
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

export default HealthcareActivity;
