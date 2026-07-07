import React, { useState, useEffect } from "react";
import { Bot, Play, CheckCircle, XCircle, FileText, ArrowRight, GitMerge, Combine } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { toast } from 'sonner';

const AgentParallelFanoutActivity: React.FC<{
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
    
    // Start Dispatch
    timeouts.push(setTimeout(() => setCurrentStep(1), 500));
    // Parallel Execution
    timeouts.push(setTimeout(() => setCurrentStep(2), 2000));
    // Aggregation
    timeouts.push(setTimeout(() => setCurrentStep(3), 5000));
    // Done
    timeouts.push(setTimeout(() => setCurrentStep(4), 7000));
    
    timeouts.push(setTimeout(() => {
      setIsPlaying(false);
    }, 8500));
    
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
                 <GitMerge className="w-5 h-5 text-emerald-500 rotate-90" />
                 <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold tracking-widest">PARALLEL FAN-OUT</span>
             </div>
             <div className="absolute top-4 right-4">
                 <button
                    onClick={runSimulation}
                    disabled={isPlaying}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-105"
                  >
                    <Play className="w-4 h-4" /> Start Fan-Out
                  </button>
             </div>
            
             <div className="flex flex-col items-center relative mt-6 w-full max-w-lg z-10">
                 
                 {/* Main Task */}
                 <div className={`bg-white dark:bg-slate-800 p-3 rounded-lg border shadow-sm transition-opacity duration-300 z-10 w-48 text-center ${currentStep >= 1 ? 'border-slate-400 dark:border-slate-500 opacity-100' : 'border-slate-200 dark:border-slate-700 opacity-50'}`}>
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Input Request</div>
                    <div className="text-xs font-mono text-slate-900 dark:text-white mt-1">Analyze Company X</div>
                 </div>

                 {/* Connecting Lines */}
                 <div className="relative w-64 h-8">
                   <div className={`absolute left-1/2 top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-600 transition-opacity ${currentStep >= 1 ? 'opacity-100' : 'opacity-0'}`}></div>
                   <div className={`absolute top-1/2 left-0 right-0 h-px bg-slate-300 dark:bg-slate-600 transition-opacity ${currentStep >= 1 ? 'opacity-100' : 'opacity-0'}`}></div>
                   <div className={`absolute left-0 top-1/2 bottom-0 w-px bg-slate-300 dark:bg-slate-600 transition-opacity ${currentStep >= 1 ? 'opacity-100' : 'opacity-0'}`}></div>
                   <div className={`absolute right-0 top-1/2 bottom-0 w-px bg-slate-300 dark:bg-slate-600 transition-opacity ${currentStep >= 1 ? 'opacity-100' : 'opacity-0'}`}></div>
                 </div>

                 {/* Parallel Agents */}
                 <div className="flex justify-between w-full max-w-md gap-4 z-10">
                    
                    {/* Agent 1 */}
                    <div className={`flex-1 bg-white dark:bg-slate-900 p-3 rounded-xl border shadow-sm transition-all duration-500 ${currentStep === 2 ? 'border-blue-500 scale-105' : currentStep > 2 ? 'border-blue-500/50' : 'border-slate-200 dark:border-slate-800 opacity-50'}`}>
                       <div className="flex justify-center text-blue-500 dark:text-blue-400 mb-1"><Bot className="w-5 h-5"/></div>
                       <div className="text-[10px] text-center text-slate-500 dark:text-slate-400 mb-2">Finance Agent</div>
                       <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                         {currentStep === 2 && <div className="h-full bg-blue-500 w-full animate-[shimmer_1.5s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)' }}/>}
                         {currentStep > 2 && <div className="h-full bg-emerald-500 w-full" />}
                       </div>
                    </div>

                    {/* Agent 2 */}
                    <div className={`flex-1 bg-white dark:bg-slate-900 p-3 rounded-xl border shadow-sm transition-all duration-500 ${currentStep === 2 ? 'border-amber-500 scale-105' : currentStep > 2 ? 'border-amber-500/50' : 'border-slate-200 dark:border-slate-800 opacity-50'}`}>
                       <div className="flex justify-center text-amber-500 dark:text-amber-400 mb-1"><Bot className="w-5 h-5"/></div>
                       <div className="text-[10px] text-center text-slate-500 dark:text-slate-400 mb-2">Legal Agent</div>
                       <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                         {currentStep === 2 && <div className="h-full bg-amber-500 w-full animate-[shimmer_1.2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)' }}/>}
                         {currentStep > 2 && <div className="h-full bg-emerald-500 w-full" />}
                       </div>
                    </div>

                    {/* Agent 3 */}
                    <div className={`flex-1 bg-white dark:bg-slate-900 p-3 rounded-xl border shadow-sm transition-all duration-500 ${currentStep === 2 ? 'border-purple-500 scale-105' : currentStep > 2 ? 'border-purple-500/50' : 'border-slate-200 dark:border-slate-800 opacity-50'}`}>
                       <div className="flex justify-center text-purple-500 dark:text-purple-400 mb-1"><Bot className="w-5 h-5"/></div>
                       <div className="text-[10px] text-center text-slate-500 dark:text-slate-400 mb-2">News Agent</div>
                       <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                         {currentStep === 2 && <div className="h-full bg-purple-500 w-full animate-[shimmer_1.8s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)' }}/>}
                         {currentStep > 2 && <div className="h-full bg-emerald-500 w-full" />}
                       </div>
                    </div>

                 </div>

                 {/* Connecting Lines Bottom */}
                 <div className="relative w-64 h-8 z-0">
                   <div className={`absolute left-0 top-0 bottom-1/2 w-px bg-slate-300 dark:bg-slate-600 transition-opacity ${currentStep >= 3 ? 'opacity-100' : 'opacity-0'}`}></div>
                   <div className={`absolute right-0 top-0 bottom-1/2 w-px bg-slate-300 dark:bg-slate-600 transition-opacity ${currentStep >= 3 ? 'opacity-100' : 'opacity-0'}`}></div>
                   <div className={`absolute left-1/2 top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-600 transition-opacity ${currentStep >= 3 ? 'opacity-100' : 'opacity-0'}`}></div>
                   <div className={`absolute top-1/2 left-0 right-0 h-px bg-slate-300 dark:bg-slate-600 transition-opacity ${currentStep >= 3 ? 'opacity-100' : 'opacity-0'}`}></div>
                 </div>

                 {/* Aggregator */}
                 <div className={`bg-white dark:bg-slate-800 p-4 rounded-xl border shadow-md flex flex-col items-center transition-all duration-500 z-10 w-64 ${currentStep === 3 ? 'border-emerald-500 scale-105' : currentStep > 3 ? 'border-emerald-500/50' : 'border-slate-200 dark:border-slate-700 opacity-50'}`}>
                    <Combine className={`w-5 h-5 mb-2 ${currentStep >= 3 ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`} />
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Synthesizer Agent</div>
                    {currentStep === 3 && <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono animate-pulse">Aggregating outputs...</div>}
                    {currentStep > 3 && <div className="text-xs font-bold text-slate-900 dark:text-white bg-emerald-50 dark:bg-emerald-600/30 px-3 py-1 rounded border border-emerald-200 dark:border-emerald-500/50 flex items-center gap-1"><FileText className="w-3 h-3"/> Final_Report.pdf</div>}
                 </div>

             </div>
               
             {currentStep > 0 && (
                 <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                   Latency: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Max(Agent 1, Agent 2, Agent 3)</span> + Synthesizer
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

export default AgentParallelFanoutActivity;
