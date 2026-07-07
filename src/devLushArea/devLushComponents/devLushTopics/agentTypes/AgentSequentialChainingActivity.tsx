import React, { useState, useEffect } from "react";
import { Bot, Play, CheckCircle, XCircle, ArrowRight, FileText, Check } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { toast } from 'sonner';

const AgentSequentialChainingActivity: React.FC<{
  step: number;
  exercises: any[];
  infoVisible?: boolean;
  infoPlacement?: "side" | "bottom";
  settings?: any;
}> = ({ step, exercises, infoVisible = true, infoPlacement = "side", settings }) => {
  const question = exercises[step];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [selected, setSelected] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentStep(0);
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
    setCurrentStep(0);
    
    const timeouts: NodeJS.Timeout[] = [];
    
    // Agent 1 starts
    timeouts.push(setTimeout(() => setCurrentStep(1), 500));
    // Agent 1 done, Agent 2 starts
    timeouts.push(setTimeout(() => setCurrentStep(2), 2500));
    // Agent 2 done, Agent 3 starts
    timeouts.push(setTimeout(() => setCurrentStep(3), 4500));
    // Agent 3 done
    timeouts.push(setTimeout(() => setCurrentStep(4), 6500));
    // Reset
    timeouts.push(setTimeout(() => {
      setIsPlaying(false);
    }, 8000));
    
    return () => timeouts.forEach(clearTimeout);
  };

  const theoryData = question.theory || (question.theory_explanation ? {
    title: question.title || "Theory Concept",
    content: question.theory_explanation,
    analogy: question.real_world_analogy
  } : null);

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'agentTypes', exerciseTitle: question.title, theory: theoryData }} />
      </div>
    </div>
  ) : null;

  const InteractionContent = (
      <div className="space-y-6">
          {question.question && (
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {question.question}
              </h4>
          )}
          <div className="grid grid-cols-1 gap-3">
              {question.options?.map((opt: string) => (
                  <button 
                      key={opt}
                      onClick={() => !isChecked && setSelected(opt)}
                      disabled={isChecked}
                      className={`text-left p-3 rounded-lg border text-sm font-medium transition-colors ${selected === opt ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                      {opt}
                  </button>
              ))}
          </div>

          <div className="flex justify-end">
              <button 
                  onClick={handleCheck} 
                  disabled={!selected || isChecked}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                  Verify
              </button>
          </div>

          {isChecked && (
              <div className={`p-4 rounded-xl border text-sm leading-relaxed ${selected === question.answer ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-500/30 text-rose-700 dark:text-rose-400'}`}>
                  <div className="flex items-center gap-2 mb-2 font-bold">
                      {selected === question.answer ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                      {selected === question.answer ? 'Correct Analysis' : 'Review Concept'}
                  </div>
                  <p>{question.explanation}</p>
              </div>
          )}
      </div>
  );

  return (
    <DevLushLayout
      title={question.title}
      prompt={question.prompt}
      visualContent={
        <div className="relative w-full h-[400px] flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
             <div className="absolute top-4 left-4 flex items-center gap-2">
                 <Bot className="w-5 h-5 text-indigo-500" />
                 <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold tracking-widest">SEQUENTIAL PIPELINE</span>
             </div>
             <div className="absolute top-4 right-4">
                 <button
                    onClick={runSimulation}
                    disabled={isPlaying}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-105"
                  >
                    <Play className="w-4 h-4" /> Start Pipeline
                  </button>
             </div>
            
             <div className="w-full max-w-lg z-10 flex flex-col gap-4 relative pl-8 border-l-2 border-slate-200 dark:border-slate-700 ml-4 mt-8">
                 
                 {/* Agent 1 */}
                 <div className="relative">
                   <div className={`absolute -left-[42px] top-2 w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600'} transition-colors duration-500 z-10`}>
                     {currentStep > 1 ? <Check className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-slate-500 dark:text-slate-300">1</span>}
                   </div>
                   <div className={`bg-white dark:bg-slate-800 p-4 rounded-xl border shadow-sm transition-all duration-500 ${currentStep === 1 ? 'border-indigo-500 scale-[1.02]' : 'border-slate-200 dark:border-slate-700 opacity-50'}`}>
                     <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-2">
                       <Bot className="w-4 h-4" /> Drafter Agent
                     </div>
                     <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-2">
                       Input: Topic "AI in Healthcare"
                     </div>
                     <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded overflow-hidden">
                       {currentStep === 1 && <div className="h-full bg-indigo-500 w-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)' }}/>}
                       {currentStep > 1 && <div className="h-full bg-emerald-500 w-full" />}
                     </div>
                     {currentStep > 1 && (
                       <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                         <FileText className="w-3 h-3" /> Output: raw_draft.md
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Agent 2 */}
                 <div className="relative mt-2">
                   <div className={`absolute -left-[42px] top-2 w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'bg-amber-500 border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600'} transition-colors duration-500 z-10`}>
                     {currentStep > 2 ? <Check className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-slate-500 dark:text-slate-300">2</span>}
                   </div>
                   <div className={`bg-white dark:bg-slate-800 p-4 rounded-xl border shadow-sm transition-all duration-500 ${currentStep === 2 ? 'border-amber-500 scale-[1.02]' : 'border-slate-200 dark:border-slate-700 opacity-50'}`}>
                     <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold mb-2">
                       <Bot className="w-4 h-4" /> Reviewer Agent
                     </div>
                     <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-2">
                       Input: raw_draft.md
                     </div>
                     <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded overflow-hidden">
                       {currentStep === 2 && <div className="h-full bg-amber-500 w-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)' }}/>}
                       {currentStep > 2 && <div className="h-full bg-emerald-500 w-full" />}
                     </div>
                     {currentStep > 2 && (
                       <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                         <FileText className="w-3 h-3" /> Output: reviewed_draft.md
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Agent 3 */}
                 <div className="relative mt-2">
                   <div className={`absolute -left-[42px] top-2 w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600'} transition-colors duration-500 z-10`}>
                     {currentStep > 3 ? <Check className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-slate-500 dark:text-slate-300">3</span>}
                   </div>
                   <div className={`bg-white dark:bg-slate-800 p-4 rounded-xl border shadow-sm transition-all duration-500 ${currentStep === 3 ? 'border-emerald-500 scale-[1.02]' : currentStep > 3 ? 'border-emerald-500/50' : 'border-slate-200 dark:border-slate-700 opacity-50'}`}>
                     <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                       <Bot className="w-4 h-4" /> Formatting Agent
                     </div>
                     <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-2">
                       Input: reviewed_draft.md
                     </div>
                     <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded overflow-hidden">
                       {currentStep === 3 && <div className="h-full bg-emerald-500 w-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)' }}/>}
                       {currentStep > 3 && <div className="h-full bg-emerald-500 w-full" />}
                     </div>
                     {currentStep > 3 && (
                       <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                         <FileText className="w-3 h-3" /> Output: FINAL_DOCUMENT.pdf
                       </div>
                     )}
                   </div>
                 </div>

               </div>
               
               {currentStep > 0 && (
                 <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center justify-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                   Total Latency: <span className="text-rose-500 font-bold animate-pulse">Wait Time = Agent 1 + Agent 2 + Agent 3</span>
                 </div>
               )}
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

export default AgentSequentialChainingActivity;
