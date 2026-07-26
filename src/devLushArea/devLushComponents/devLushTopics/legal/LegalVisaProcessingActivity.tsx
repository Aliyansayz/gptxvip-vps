import React, { useState, useEffect } from "react";
import { Scale, Play, Activity, CheckCircle, XCircle, Terminal, Briefcase, FileText, ScanFace, PlaneTakeoff } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion } from "motion/react";
import { toast } from 'sonner';

const LegalVisaProcessingActivity: React.FC<{
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

  const theoryData = question.theory;

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'legal-visa-processing', exerciseTitle: question.title, theory: theoryData }} />
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
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left ${selected === opt ? 'bg-amber-600 text-white border-amber-700' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                      {opt}
                  </button>
              ))}
          </div>

          <div className="flex justify-center">
              <button 
                  onClick={handleCheck} 
                  disabled={!selected || isChecked}
                  className="px-8 py-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  Evaluate Case
              </button>
          </div>

          {isChecked && (
              <div className={`p-4 rounded-lg border ${selected === question.answer ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'}`}>
                  <div className="flex items-center gap-2 mb-2 font-bold">
                      {selected === question.answer ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                      {selected === question.answer ? 'Legally Sound!' : 'Compliance Failure'}
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
               <Scale className="w-8 h-8 text-amber-600" />
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
                  : "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
              }`}
            >
              {isPlaying ? (
                <><Activity className="w-5 h-5 animate-pulse" />Reviewing...</>
              ) : (
                <><Play className="w-5 h-5" />Start Agent Workflow</>
              )}
            </button>
          </div>
          
          <div className="w-full relative py-12 px-4 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-2xl my-6">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
              
              <div className="relative z-10 flex items-center justify-center gap-4 md:gap-8 w-full max-w-2xl">
                  <div className="flex flex-col items-center gap-3 relative">
                      <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl"></div>
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex flex-col items-center justify-center relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                          <ScanFace className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mb-1" />
                          <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-blue-300 font-bold">Biometrics</span>
                      </div>
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex flex-col items-center justify-center relative overflow-hidden mt-2 md:mt-4">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                          <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mb-1" />
                          <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-blue-300 font-bold">Offer Ltr</span>
                      </div>
                  </div>

                  <div className="flex-1 h-32 relative flex items-center">
                      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          <path d="M 0 64 C 50 64, 50 16, 100 16" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="2" strokeDasharray="4 4" className={isPlaying ? "animate-[dash_1s_linear_infinite]" : ""} />
                          <path d="M 0 64 C 50 64, 50 112, 100 112" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="2" strokeDasharray="4 4" className={isPlaying ? "animate-[dash_1s_linear_infinite]" : ""} />
                      </svg>
                      <style>{`@keyframes dash { to { stroke-dashoffset: -8; } }`}</style>
                      
                      {isPlaying && (
                          <>
                              <motion.div className="absolute w-2 h-2 md:w-3 md:h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]" animate={{ left: ["0%", "100%"], top: ["50%", "12%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                              <motion.div className="absolute w-2 h-2 md:w-3 md:h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]" animate={{ left: ["0%", "100%"], top: ["50%", "88%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }} />
                          </>
                      )}
                  </div>

                  <div className="flex flex-col items-center gap-3 relative z-10 mx-2">
                      <div className="absolute -inset-6 bg-amber-500/20 rounded-full blur-2xl"></div>
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-amber-500/50 flex items-center justify-center relative shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                          {isPlaying && (
                              <motion.div 
                                  className="absolute inset-0 rounded-full border-2 border-amber-400"
                                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                              />
                          )}
                          <Activity className={`w-8 h-8 md:w-12 md:h-12 text-amber-400 ${isPlaying ? 'animate-pulse' : ''}`} />
                      </div>
                      <div className="px-3 md:px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                          <span className="text-[9px] md:text-xs font-bold text-amber-400 uppercase tracking-widest">Immigration AI</span>
                      </div>
                  </div>

                  <div className="flex-1 h-32 relative flex items-center">
                       <div className="w-full h-1 bg-slate-700 overflow-hidden relative rounded-full">
                          <motion.div 
                             className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-emerald-500"
                             animate={isPlaying ? { width: ["0%", "100%"] } : { width: "0%" }}
                             transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                          />
                       </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 relative">
                      <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl"></div>
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-emerald-900/40 backdrop-blur-xl border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex flex-col items-center justify-center relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                          <PlaneTakeoff className="w-8 h-8 md:w-10 md:h-10 text-emerald-400 mb-1 md:mb-2" />
                          <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-emerald-300 font-bold">Approved</span>
                      </div>
                  </div>
              </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed text-center w-full">
             {question.prompt}
          </p>

          <div className="my-4 w-full bg-slate-950 rounded-lg border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono text-slate-400">Legal Review Console</span>
            </div>
            <div className="p-4 h-[250px] overflow-y-auto font-mono text-sm space-y-2">
               {logs.map((log, i) => (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`flex gap-3 ${log.level === 'warn' ? 'text-amber-400' : log.level === 'success' ? 'text-emerald-400' : 'text-slate-300'}`}
                  >
                     <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                     <span>{log.message}</span>
                  </motion.div>
               ))}
               {!isPlaying && logs.length === 0 && (
                   <div className="text-slate-600 italic">Waiting for document ingestion...</div>
               )}
            </div>
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

export default LegalVisaProcessingActivity;
