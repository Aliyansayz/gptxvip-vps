import React, { useState, useEffect } from "react";
import { Shield, Play, Activity, CheckCircle, XCircle, Terminal } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion } from "motion/react";
import { toast } from 'sonner';

const SecOpsActivity: React.FC<{
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

  const CastleDefenseAnalogy: React.FC = () => (
    <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" /> Analogy: Defense in Depth
        </h5>
        <svg viewBox="0 0 200 120" className="w-full h-40">
            {/* The Castle (Core Asset) */}
            <rect x="80" y="40" width="40" height="40" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
            <rect x="75" y="30" width="15" height="10" fill="#94a3b8" />
            <rect x="110" y="30" width="15" height="10" fill="#94a3b8" />
            <rect x="92" y="60" width="16" height="20" fill="#475569" />
            
            {/* The Moat (Network Firewall) */}
            <path d="M 40 100 C 40 40, 160 40, 160 100" fill="none" stroke="#3b82f6" strokeWidth="15" opacity="0.3" />
            <text x="100" y="25" textAnchor="middle" fontSize="6" fill="#3b82f6" fontWeight="bold">Moat (Firewall)</text>

            {/* The Outer Wall (IPS/IDS) */}
            <path d="M 60 100 C 60 60, 140 60, 140 100" fill="none" stroke="#64748b" strokeWidth="5" strokeDasharray="5 2" />
            <text x="100" y="55" textAnchor="middle" fontSize="6" fill="#475569" fontWeight="bold">Wall (IPS)</text>

            {/* The Guards (Agents) */}
            <circle cx="70" cy="80" r="4" fill="#6366f1" className="animate-pulse" />
            <circle cx="130" cy="80" r="4" fill="#6366f1" className="animate-pulse" style={{animationDelay: '0.5s'}} />
            <text x="100" y="85" textAnchor="middle" fontSize="6" fill="#4f46e5" fontWeight="bold">Guards (Agents)</text>

            {/* Attackers */}
            <path d="M 20 80 L 35 80 L 30 75 M 35 80 L 30 85" stroke="#ef4444" strokeWidth="1.5" fill="none" className="animate-bounce" style={{transformOrigin: '20px 80px'}} />
            <path d="M 180 60 L 165 60 L 170 55 M 165 60 L 170 65" stroke="#ef4444" strokeWidth="1.5" fill="none" className="animate-bounce" style={{transformOrigin: '180px 60px', animationDelay: '0.3s'}} />

            <text x="100" y="115" textAnchor="middle" fontSize="8" fill="currentColor" className="text-slate-500">Multiple layers delay and deter attacks</text>
        </svg>
    </div>
  );

  const NetworkRadarVisual = () => (
    <div className="relative w-full h-64 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-2xl flex">
        {/* Left Side: Radar SVG */}
        <div className="flex-1 relative flex items-center justify-center p-4">
            <svg viewBox="0 0 200 200" className="w-full h-full max-h-full">
                {/* Radar Grid */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="#1e293b" strokeWidth="1" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="#1e293b" strokeWidth="1" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="#1e293b" strokeWidth="1" />
                <circle cx="100" cy="100" r="20" fill="none" stroke="#1e293b" strokeWidth="1" />
                
                <line x1="100" y1="20" x2="100" y2="180" stroke="#1e293b" strokeWidth="1" />
                <line x1="20" y1="100" x2="180" y2="100" stroke="#1e293b" strokeWidth="1" />

                {/* Radar Sweep */}
                {isPlaying && (
                    <g className="origin-center animate-spin" style={{ animationDuration: '4s', animationTimingFunction: 'linear' }}>
                        <path d="M 100 100 L 100 20 A 80 80 0 0 1 180 100 Z" fill="url(#radarSweep)" opacity="0.4" />
                    </g>
                )}

                <defs>
                    <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow-red">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <filter id="glow-blue">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Core Server */}
                <circle cx="100" cy="100" r="6" fill="#818cf8" filter="url(#glow-blue)" />

                {/* Dynamic Threat Animation based on Logs */}
                <AnimatePresence>
                    {logs.map((log, i) => {
                        // Position threats randomly on the outer edge
                        const angle = (i * 137.5) * (Math.PI / 180);
                        const startX = 100 + Math.cos(angle) * 90;
                        const startY = 100 + Math.sin(angle) * 90;
                        
                        // If it's a block/success, it stops at the firewall layer (r=40)
                        const isBlocked = log.level === 'success';
                        const isWarn = log.level === 'warn';
                        const endRadius = isBlocked ? 40 : (isWarn ? 20 : 60);
                        
                        const endX = 100 + Math.cos(angle) * endRadius;
                        const endY = 100 + Math.sin(angle) * endRadius;

                        return (
                            <g key={i}>
                                <motion.circle
                                    r="4"
                                    fill={isBlocked ? "#34d399" : (isWarn ? "#fbbf24" : "#ef4444")}
                                    filter="url(#glow-red)"
                                    initial={{ cx: startX, cy: startY, opacity: 0 }}
                                    animate={{ cx: endX, cy: endY, opacity: 1 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                                {isBlocked && (
                                    <motion.path
                                        d={`M ${endX - 5} ${endY - 5} L ${endX + 5} ${endY + 5} M ${endX + 5} ${endY - 5} L ${endX - 5} ${endY + 5}`}
                                        stroke="#34d399"
                                        strokeWidth="2"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.5 }}
                                    />
                                )}
                            </g>
                        );
                    })}
                </AnimatePresence>
            </svg>
        </div>

        {/* Right Side: Logs */}
        <div className="w-1/2 border-l border-slate-800 flex flex-col bg-slate-900/50">
            <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center gap-2">
                <Terminal className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400">Agent Console</span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto font-mono text-xs space-y-2 custom-scrollbar">
               {logs.map((log, i) => (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, x: 10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`flex flex-col gap-0.5 ${log.level === 'warn' ? 'text-amber-400' : log.level === 'success' ? 'text-emerald-400' : 'text-blue-400'}`}
                  >
                     <span className="text-slate-600 opacity-70">[{log.timestamp}]</span>
                     <span className="break-words leading-tight">{log.message}</span>
                  </motion.div>
               ))}
               {!isPlaying && logs.length === 0 && (
                   <div className="text-slate-600 italic">Awaiting protocol execution...</div>
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
            <DevLushTheoryBridge item={{ labId: 'secops-agents', exerciseTitle: question.title, theory: theoryData }} />
            <CastleDefenseAnalogy />
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
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left ${selected === opt ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                      {opt}
                  </button>
              ))}
          </div>

          <div className="flex justify-center">
              <button 
                  onClick={handleCheck} 
                  disabled={!selected || isChecked}
                  className="px-8 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  Analyze & Verify
              </button>
          </div>

          {isChecked && (
              <div className={`p-4 rounded-lg border ${selected === question.answer ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'}`}>
                  <div className="flex items-center gap-2 mb-2 font-bold">
                      {selected === question.answer ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                      {selected === question.answer ? 'Threat Neutralized!' : 'Incorrect Approach'}
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
               <Shield className="w-8 h-8 text-indigo-500" />
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
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              }`}
            >
              {isPlaying ? (
                <><Activity className="w-5 h-5 animate-pulse" />Monitoring...</>
              ) : (
                <><Play className="w-5 h-5" />Run Agent Protocol</>
              )}
            </button>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed text-center w-full">
             {question.prompt}
          </p>

          <div className="w-full mt-4">
            <NetworkRadarVisual />
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

export default SecOpsActivity;
