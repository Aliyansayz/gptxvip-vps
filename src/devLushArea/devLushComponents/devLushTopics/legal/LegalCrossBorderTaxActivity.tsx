import React, { useState, useEffect } from "react";
import { Scale, Play, Activity, CheckCircle, XCircle, Terminal, Globe, Landmark } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion } from "motion/react";
import { toast } from 'sonner';

const LegalCrossBorderTaxActivity: React.FC<{
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
        <DevLushTheoryBridge item={{ labId: 'legal-cross-border-tax', exerciseTitle: question.title, theory: theoryData }} />
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
          
          <div className="w-full py-6 flex items-center justify-center gap-8 relative my-4">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 flex items-center justify-center">
                    <Landmark className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                 </div>
                 <span className="text-xs font-semibold text-slate-500">Jurisdiction A</span>
              </div>
              <div className="flex-1 flex flex-col items-center relative">
                 <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 relative">
                     <motion.div 
                        className="absolute -top-1.5 left-0 w-3 h-3 rounded-full bg-white border-2 border-amber-500 shadow-lg"
                        animate={{ left: ["0%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                     />
                 </div>
                 <div className="absolute -top-6 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-amber-500/30 shadow-sm flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Tax Treaty Relief</span>
                 </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                 </div>
                 <span className="text-xs font-semibold text-slate-500">Jurisdiction B</span>
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

export default LegalCrossBorderTaxActivity;
