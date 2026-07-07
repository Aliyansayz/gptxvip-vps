import React, { useState, useEffect } from "react";
import { Bot, Play, CheckCircle, XCircle, ArrowRight, ArrowLeft, PenTool, SearchCode, AlertTriangle } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { toast } from 'sonner';

const AgentEvaluatorOptimizerActivity: React.FC<{
  step: number;
  exercises: any[];
  infoVisible?: boolean;
  infoPlacement?: "side" | "bottom";
  settings?: any;
}> = ({ step, exercises, infoVisible = true, infoPlacement = "side", settings }) => {
  const question = exercises[step];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [iteration, setIteration] = useState(1);

  const [selected, setSelected] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIteration(1);
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
    setIteration(1);
    
    const timeouts: NodeJS.Timeout[] = [];
    
    // Iteration 1
    // Generate Draft 1
    timeouts.push(setTimeout(() => setCurrentStep(1), 500));
    // Send to Evaluator
    timeouts.push(setTimeout(() => setCurrentStep(2), 2000));
    // Critique 1 (Failed)
    timeouts.push(setTimeout(() => setCurrentStep(3), 3500));
    // Send back to Generator
    timeouts.push(setTimeout(() => { setCurrentStep(4); setIteration(2); }, 5000));

    // Iteration 2
    // Generate Draft 2
    timeouts.push(setTimeout(() => setCurrentStep(5), 6500));
    // Send to Evaluator
    timeouts.push(setTimeout(() => setCurrentStep(6), 8000));
    // Critique 2 (Pass)
    timeouts.push(setTimeout(() => setCurrentStep(7), 9500));
    
    timeouts.push(setTimeout(() => {
      setIsPlaying(false);
    }, 11000));
    
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
                 <PenTool className="w-5 h-5 text-rose-500" />
                 <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold tracking-widest">EVALUATOR-OPTIMIZER LOOP</span>
             </div>
             <div className="absolute top-4 right-4">
                 <button
                    onClick={runSimulation}
                    disabled={isPlaying}
                    className="text-xs bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-105"
                  >
                    <Play className="w-4 h-4" /> Execute Loop
                  </button>
             </div>
            
             <div className="flex items-center justify-between gap-4 relative py-8 w-full max-w-lg z-10 mt-8">
                 
                 {/* Generator Agent */}
                 <div className={`flex-1 bg-white dark:bg-slate-800 p-4 rounded-xl border shadow-sm transition-all duration-300 z-10 ${([1,5].includes(currentStep)) ? 'border-indigo-500 scale-105' : 'border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                      <Bot className="w-5 h-5" /> Generator
                    </div>
                    
                    <div className="h-20 flex items-center justify-center text-xs font-mono">
                      {currentStep === 0 && <span className="text-slate-500 dark:text-slate-500">Waiting...</span>}
                      {currentStep === 1 && <span className="text-indigo-600 dark:text-indigo-300 animate-pulse">Drafting v1...</span>}
                      {currentStep === 2 && <span className="text-slate-500 dark:text-slate-400">Draft v1 sent.</span>}
                      {currentStep === 4 && <span className="text-rose-600 dark:text-rose-400">Received critique!</span>}
                      {currentStep === 5 && <span className="text-indigo-600 dark:text-indigo-300 animate-pulse">Revising (Draft v2)...</span>}
                      {currentStep >= 6 && <span className="text-slate-500 dark:text-slate-400">Draft v2 sent.</span>}
                    </div>
                 </div>

                 {/* Middle Arrows */}
                 <div className="flex flex-col items-center justify-center gap-4 px-2 z-0">
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Iteration {iteration}</div>
                    
                    {/* Top Arrow (To Evaluator) */}
                    <div className={`flex items-center transition-colors duration-300 ${([2,6].includes(currentStep)) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`}>
                       <div className="w-16 h-0.5 bg-current rounded"></div>
                       <ArrowRight className="w-4 h-4 -ml-1" />
                    </div>

                    {/* Bottom Arrow (To Generator) */}
                    <div className={`flex items-center transition-colors duration-300 ${currentStep === 4 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-300 dark:text-slate-600'}`}>
                       <ArrowLeft className="w-4 h-4 -mr-1" />
                       <div className="w-16 h-0.5 bg-current rounded"></div>
                    </div>
                 </div>

                 {/* Evaluator Agent */}
                 <div className={`flex-1 bg-white dark:bg-slate-800 p-4 rounded-xl border shadow-sm transition-all duration-300 z-10 ${([3,7].includes(currentStep)) ? 'border-amber-500 scale-105' : 'border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                      <SearchCode className="w-5 h-5" /> Evaluator
                    </div>
                    
                    <div className="h-20 flex flex-col items-center justify-center text-xs font-mono">
                      {currentStep <= 1 && <span className="text-slate-500 dark:text-slate-500">Waiting for draft...</span>}
                      {currentStep === 2 && <span className="text-amber-600 dark:text-amber-300 animate-pulse">Analyzing v1...</span>}
                      {currentStep === 3 && (
                        <div className="text-rose-600 dark:text-rose-400 flex flex-col items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          <span>Failed: Missing Tests</span>
                        </div>
                      )}
                      {[4,5].includes(currentStep) && <span className="text-slate-500 dark:text-slate-400">Waiting for v2...</span>}
                      {currentStep === 6 && <span className="text-amber-600 dark:text-amber-300 animate-pulse">Analyzing v2...</span>}
                      {currentStep >= 7 && (
                        <div className="text-emerald-600 dark:text-emerald-400 flex flex-col items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Passed Rubric</span>
                        </div>
                      )}
                    </div>
                 </div>

             </div>
               
             {currentStep > 0 && (
                 <div className="mt-4 text-center text-xs bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm z-10">
                   <span className="text-slate-500 dark:text-slate-400 font-mono">Cost Warning: </span>
                   <span className="text-rose-600 dark:text-rose-400 font-bold">Token usage multipliers active (Tokens Ã— Iterations)</span>
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

export default AgentEvaluatorOptimizerActivity;
