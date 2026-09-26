import React, { useState, useEffect } from "react";
import { Bot, Play, Activity, CheckCircle, XCircle, Brain, Eye, Search, Zap } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { toast } from 'sonner';

const AgentReactPatternActivity: React.FC<{
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
    
    // Step 1: Prompt
    timeouts.push(setTimeout(() => setCurrentStep(1), 500));
    // Step 2: Thought 1
    timeouts.push(setTimeout(() => setCurrentStep(2), 2000));
    // Step 3: Action 1
    timeouts.push(setTimeout(() => setCurrentStep(3), 3500));
    // Step 4: Observation 1
    timeouts.push(setTimeout(() => setCurrentStep(4), 5000));
    // Step 5: Thought 2
    timeouts.push(setTimeout(() => setCurrentStep(5), 6500));
    // Step 6: Final Answer
    timeouts.push(setTimeout(() => {
      setCurrentStep(6);
      setIsPlaying(false);
    }, 8000));
    
    return () => timeouts.forEach(clearTimeout);
  };

  const theoryData = question.theory || (question.theory_explanation ? {
    title: question.title || "Theory Concept",
    content: question.theory_explanation,
    analogy: question.real_world_analogy
  } : null);

  const DetectiveAnalogy: React.FC = () => (
    <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-500" /> Analogy: The Detective
        </h5>
        <svg viewBox="0 0 200 120" className="w-full h-40">
            {/* Detective */}
            <circle cx="50" cy="40" r="15" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            {/* Hat */}
            <path d="M 30 35 Q 50 20 70 35 L 65 30 L 35 30 Z" fill="#334155" />
            <rect x="45" y="55" width="10" height="30" fill="#cbd5e1" />

            {/* Thought Bubble */}
            <path d="M 70 30 Q 90 10 120 20 Q 140 10 150 30 Q 170 30 160 50 Q 165 70 140 70 Q 120 80 100 70 Q 80 80 70 60 Q 50 50 70 30 Z" fill="#e0e7ff" stroke="#a78bfa" strokeWidth="1" />
            <circle cx="65" cy="45" r="3" fill="#e0e7ff" />
            <circle cx="75" cy="40" r="4" fill="#e0e7ff" />
            <text x="120" y="45" textAnchor="middle" fontSize="6" fill="#6d28d9" fontWeight="bold">Who took the cookie?</text>
            
            {/* Action - Magnifying Glass */}
            <path d="M 55 65 L 80 85" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="85" cy="90" r="8" fill="none" stroke="#f59e0b" strokeWidth="2" />

            {/* Observation - Clue */}
            <path d="M 100 100 L 115 100 L 115 110 C 110 105 105 115 100 110 Z" fill="#10b981" />
            <text x="130" y="105" textAnchor="middle" fontSize="6" fill="#047857">Crumbs found!</text>

            <path d="M 105 95 C 130 80 150 90 130 100" stroke="#94a3b8" strokeDasharray="2 2" fill="none" />
        </svg>
    </div>
  );

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <DevLushTheoryBridge item={{ labId: 'agentTypes', exerciseTitle: question.title, theory: theoryData }} />
        <DetectiveAnalogy />
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
        <div className="relative w-full h-[400px] flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden overflow-y-auto">
             <div className="absolute top-4 left-4 flex items-center gap-2">
                 <Bot className="w-5 h-5 text-indigo-500" />
                 <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold tracking-widest">REACT AGENT LOOP</span>
             </div>
             <div className="absolute top-4 right-4">
                 <button
                    onClick={runSimulation}
                    disabled={isPlaying}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-105"
                  >
                    <Play className="w-4 h-4" /> Execute
                  </button>
             </div>

             {/* ReAct SVG Diagram */}
             <div className="w-full h-32 flex justify-center items-center mb-4 mt-12 flex-shrink-0">
                 <svg viewBox="0 0 300 100" className="w-full h-full max-w-sm">
                     {/* Brain (Thought) */}
                     <g style={{ opacity: currentStep >= 2 && currentStep !== 3 && currentStep !== 4 ? 1 : 0.4 }} className="transition-opacity duration-300">
                         <circle cx="50" cy="50" r="25" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
                         <path d="M 40 50 C 40 40, 60 40, 60 50 C 60 60, 40 60, 40 50" fill="none" stroke="#a78bfa" strokeWidth="1.5" className={currentStep === 2 || currentStep === 5 ? "animate-pulse" : ""} />
                         <text x="50" y="85" textAnchor="middle" fontSize="8" fill="#8b5cf6" fontWeight="bold">THOUGHT</text>
                     </g>

                     {/* Hand (Action) */}
                     <g style={{ opacity: currentStep === 3 ? 1 : 0.4 }} className="transition-opacity duration-300">
                         <circle cx="150" cy="50" r="25" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                         <path d="M 140 50 L 160 50 M 145 45 L 155 45 M 145 55 L 155 55" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" className={currentStep === 3 ? "animate-pulse" : ""} />
                         <text x="150" y="85" textAnchor="middle" fontSize="8" fill="#f59e0b" fontWeight="bold">ACTION</text>
                     </g>

                     {/* Eye (Observation) */}
                     <g style={{ opacity: currentStep === 4 ? 1 : 0.4 }} className="transition-opacity duration-300">
                         <circle cx="250" cy="50" r="25" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                         <path d="M 235 50 Q 250 35 265 50 Q 250 65 235 50 Z" fill="none" stroke="#34d399" strokeWidth="1.5" />
                         <circle cx="250" cy="50" r="4" fill="#34d399" className={currentStep === 4 ? "animate-ping" : ""} />
                         <text x="250" y="85" textAnchor="middle" fontSize="8" fill="#10b981" fontWeight="bold">OBSERVATION</text>
                     </g>

                     {/* Connecting Lines */}
                     <path d="M 80 50 L 120 50" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
                     <path d="M 180 50 L 220 50" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
                     
                     {/* Flow particles */}
                     {currentStep === 2 && <circle cx="100" cy="50" r="3" fill="#8b5cf6" className="animate-ping" />}
                     {currentStep === 3 && <circle cx="200" cy="50" r="3" fill="#f59e0b" className="animate-ping" />}
                     {currentStep === 4 && <circle cx="150" cy="20" r="3" fill="#10b981" className="animate-ping" />}
                 </svg>
             </div>
            
             <div className="w-full max-w-lg space-y-4 font-mono text-sm mt-2 z-10 flex-shrink-0 mb-8">
               {/* Prompt */}
               {currentStep >= 1 && (
                 <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-slate-700 dark:text-slate-300 shadow-sm animate-in fade-in slide-in-from-top-2">
                   <span className="text-slate-500 font-bold block mb-1">User:</span>
                   What is the weather in Paris, and what should I wear?
                 </div>
               )}

               {/* Thought 1 */}
               {currentStep >= 2 && (
                 <div className="pl-6 border-l-2 border-indigo-300 dark:border-indigo-500/50 animate-in fade-in slide-in-from-left-4">
                   <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                     <Brain className="w-4 h-4" /> THOUGHT
                   </div>
                   <div className="text-slate-600 dark:text-slate-400">
                     I need to find the current weather in Paris first. Then I can suggest clothing.
                   </div>
                 </div>
               )}

               {/* Action 1 */}
               {currentStep >= 3 && (
                 <div className="pl-6 border-l-2 border-amber-300 dark:border-amber-500/50 animate-in fade-in slide-in-from-left-4">
                   <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold mb-1">
                     <Zap className="w-4 h-4" /> ACTION
                   </div>
                   <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-300/80">
                     get_weather(location="Paris, France")
                   </div>
                 </div>
               )}

               {/* Observation 1 */}
               {currentStep >= 4 && (
                 <div className="pl-6 border-l-2 border-emerald-300 dark:border-emerald-500/50 animate-in fade-in slide-in-from-left-4">
                   <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                     <Eye className="w-4 h-4" /> OBSERVATION
                   </div>
                   <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-300/80">
                     {"{ \"temp\": \"12Â°C\", \"condition\": \"Rainy\" }"}
                   </div>
                 </div>
               )}

               {/* Thought 2 */}
               {currentStep >= 5 && (
                 <div className="pl-6 border-l-2 border-indigo-300 dark:border-indigo-500/50 animate-in fade-in slide-in-from-left-4">
                   <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                     <Brain className="w-4 h-4" /> THOUGHT
                   </div>
                   <div className="text-slate-600 dark:text-slate-400">
                     It is 12Â°C and rainy in Paris. I should recommend a raincoat and an umbrella.
                   </div>
                 </div>
               )}

               {/* Final Answer */}
               {currentStep >= 6 && (
                 <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30 p-3 rounded-lg text-indigo-800 dark:text-indigo-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 mt-4">
                   <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">Agent:</span>
                   Currently in Paris, it is 12Â°C and rainy. I highly recommend wearing a warm jacket, a raincoat, and bringing an umbrella!
                 </div>
               )}
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

export default AgentReactPatternActivity;
