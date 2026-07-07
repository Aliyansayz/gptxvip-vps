import React, { useState, useEffect } from "react";
import { Bot, Play, CheckCircle, XCircle, Database, Search, FileText } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { toast } from 'sonner';

const AgentMemoryArchitecturesActivity: React.FC<{
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
    
    // Query
    timeouts.push(setTimeout(() => setCurrentStep(1), 500));
    // Embed & Search Vector DB
    timeouts.push(setTimeout(() => setCurrentStep(2), 2000));
    // Retrieve Chunks
    timeouts.push(setTimeout(() => setCurrentStep(3), 4000));
    // Context Assembly & Generation
    timeouts.push(setTimeout(() => setCurrentStep(4), 6000));
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
                      className={`text-left p-3 rounded-lg border text-sm font-medium transition-colors ${selected === opt ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                      {opt}
                  </button>
              ))}
          </div>

          <div className="flex justify-end">
              <button 
                  onClick={handleCheck} 
                  disabled={!selected || isChecked}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                  Verify Analysis
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
                 <Database className="w-5 h-5 text-emerald-500" />
                 <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold tracking-widest">RAG MEMORY PIPELINE</span>
             </div>
             <div className="absolute top-4 right-4">
                 <button
                    onClick={runSimulation}
                    disabled={isPlaying}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-105"
                  >
                    <Play className="w-4 h-4" /> Fetch Data
                  </button>
             </div>
            
             <div className="flex flex-col gap-6 relative w-full max-w-lg z-10 mt-6">
                 
                 {/* Step 1 */}
                 <div className={`flex items-center gap-4 transition-opacity duration-500 ${currentStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-300 dark:border-blue-500/30 shrink-0 shadow-sm z-10">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex-1 shadow-sm">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">User Query</div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 font-mono">"What is the company policy on remote work?"</div>
                    </div>
                 </div>

                 {/* Step 2 */}
                 <div className={`flex items-center gap-4 transition-opacity duration-500 ${currentStep >= 2 ? 'opacity-100' : 'opacity-10'}`}>
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-300 dark:border-purple-500/30 shrink-0 shadow-sm z-10">
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex-1 shadow-sm">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Vector Database Search (Long-term)</div>
                      <div className="flex gap-2 mt-2">
                        <div className="h-2 w-full bg-purple-100 dark:bg-purple-500/20 rounded overflow-hidden">
                           {currentStep === 2 && <div className="h-full bg-purple-500 w-full animate-[shimmer_1.5s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)' }}/>}
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Step 3 */}
                 <div className={`flex items-center gap-4 transition-opacity duration-500 ${currentStep >= 3 ? 'opacity-100' : 'opacity-10'}`}>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-500/30 shrink-0 shadow-sm z-10">
                      <Database className="w-5 h-5" />
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex-1 shadow-sm">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Top K Context Retrieved</div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-300/80 font-mono italic">
                        [Chunk 1]: "...employees may work remotely 3 days a week..."
                      </div>
                    </div>
                 </div>

                 {/* Step 4 */}
                 <div className={`flex items-center gap-4 transition-opacity duration-500 ${currentStep >= 4 ? 'opacity-100' : 'opacity-10'}`}>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-300 dark:border-indigo-500/30 shrink-0 shadow-sm z-10">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex-1 shadow-sm">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">LLM Generation (Short-term Context)</div>
                      <div className="text-sm text-indigo-600 dark:text-indigo-300 font-mono">
                        "Based on the company handbook, you can work remotely 3 days a week."
                      </div>
                    </div>
                 </div>

                 {/* Connecting Lines */}
                 <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-slate-300 dark:bg-slate-700 z-0"></div>
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

export default AgentMemoryArchitecturesActivity;
