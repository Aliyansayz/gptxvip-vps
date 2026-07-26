import React, { useState, useEffect } from "react";
import { Bot, Play, Activity, CheckCircle, XCircle, MessageSquareWarning, ArrowRight, ShieldAlert, FileText, AlertTriangle } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion, AnimatePresence } from "motion/react";
import { toast } from 'sonner';

const ReputationManagementActivity: React.FC<{
  step: number;
  exercises: any[];
  infoVisible?: boolean;
  infoPlacement?: "side" | "bottom";
  settings?: any;
}> = ({ step, exercises, infoVisible = true, infoPlacement = "side", settings }) => {
  const question = exercises[step];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [reviews, setReviews] = useState<{id: number, text: string}[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [actionTaken, setActionTaken] = useState(false);

  const [selected, setSelected] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setReviews([]);
    setAnalyzing(false);
    setActionTaken(false);
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
    setReviews([]);
    setAnalyzing(false);
    setActionTaken(false);
    
    const timeouts: NodeJS.Timeout[] = [];
    
    // Simulate incoming negative reviews
    const incomingReviews = [
      "Loved the color, but it shrank two sizes after one wash! 😡",
      "Washed it in cold water and it still shrank. Unwearable.",
      "Nice shirt but definitely shrinks. Do not put in dryer!"
    ];

    incomingReviews.forEach((text, idx) => {
      timeouts.push(setTimeout(() => {
        setReviews(prev => [...prev, { id: idx, text }]);
      }, 500 + idx * 800));
    });

    // Start Analysis
    timeouts.push(setTimeout(() => setAnalyzing(true), 3000));
    
    // Take Action
    timeouts.push(setTimeout(() => {
      setAnalyzing(false);
      setActionTaken(true);
    }, 5000));

    // End simulation
    timeouts.push(setTimeout(() => setIsPlaying(false), 7000));

    return () => timeouts.forEach(clearTimeout);
  };

  const theoryData = question.theory_explanation ? {
    title: question.title,
    content: question.theory_explanation,
    analogy: question.real_world_analogy
  } : question.theory;

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'ecommerce-agents-reputation', exerciseTitle: question.title, theory: theoryData }} />
      </div>
    </div>
  ) : null;

  const InteractionContent = (
      <div className="space-y-6">
          {question.question && (
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  {question.question}
              </h4>
          )}
          <div className="grid grid-cols-1 gap-4">
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
                  className="px-8 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  Evaluate
              </button>
          </div>

          {isChecked && (
              <div className={`p-4 rounded-lg border ${selected === question.answer ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'}`}>
                  <div className="flex items-center gap-2 mb-2 font-bold">
                      {selected === question.answer ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                      {selected === question.answer ? 'Optimal Strategy!' : 'Sub-optimal Approach'}
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
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              {question.title}
            </h3>
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
                <><Play className="w-5 h-5" />Start Agent Workflow</>
              )}
            </button>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed text-center w-full">
             {question.prompt}
          </p>

          <div className="my-4 p-6 w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row gap-6 relative min-h-[350px]">
             
             {/* Incoming Reviews Column */}
             <div className="flex-1 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3 relative z-10">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                   <MessageSquareWarning className="w-4 h-4" /> Live Review Stream
                </div>
                <div className="flex-1 flex flex-col gap-2">
                   <AnimatePresence>
                     {reviews.map(r => (
                        <motion.div 
                           key={r.id}
                           initial={{ opacity: 0, x: -20, height: 0 }}
                           animate={{ opacity: 1, x: 0, height: 'auto' }}
                           className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 p-3 rounded-lg text-xs text-rose-800 dark:text-rose-300"
                        >
                           ⭐ {r.text}
                        </motion.div>
                     ))}
                   </AnimatePresence>
                   {reviews.length === 0 && <div className="text-slate-400 italic text-xs text-center mt-4">Waiting for incoming reviews...</div>}
                </div>
             </div>

             {/* Agent Analysis Center */}
             <div className="flex flex-col items-center justify-center relative z-10 w-32">
                <motion.div 
                    animate={analyzing ? { scale: [1, 1.1, 1], boxShadow: ["0px 0px 0px rgba(99,102,241,0)", "0px 0px 25px rgba(99,102,241,0.6)", "0px 0px 0px rgba(99,102,241,0)"] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className={`p-5 rounded-full border-2 ${analyzing ? 'bg-indigo-100 border-indigo-400 text-indigo-600 dark:bg-indigo-900/40 dark:border-indigo-500 dark:text-indigo-300' : 'bg-slate-100 border-slate-300 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}
                >
                    <Bot className="w-10 h-10" />
                </motion.div>
                {analyzing && <span className="text-[10px] font-bold text-indigo-500 mt-2 uppercase animate-pulse">Aggregating Sentiment</span>}
             </div>

             {/* Action Output Column */}
             <div className="flex-1 flex flex-col gap-4 relative z-10 justify-center">
                 <AnimatePresence>
                    {actionTaken && (
                       <>
                          <motion.div 
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: 0 }}
                             className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3"
                          >
                              <ShieldAlert className="w-5 h-5 text-amber-500 mt-0.5" />
                              <div>
                                  <div className="font-bold text-amber-800 dark:text-amber-400 text-sm">Supply Chain Alert</div>
                                  <div className="text-xs text-amber-700 dark:text-amber-500 mt-1">High volume of shrinking complaints for SKU-841. Paused restock pipeline.</div>
                              </div>
                          </motion.div>

                          <motion.div 
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: 0.5 }}
                             className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 p-4 rounded-xl flex items-start gap-3"
                          >
                              <FileText className="w-5 h-5 text-emerald-500 mt-0.5" />
                              <div className="w-full">
                                  <div className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">Product Page Updated</div>
                                  <div className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">Automatically appended metadata:</div>
                                  <div className="mt-2 bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded p-2 text-xs font-mono text-emerald-600 dark:text-emerald-300 flex items-center gap-2">
                                     <AlertTriangle className="w-3 h-3" /> Note: This item runs small after washing.
                                  </div>
                              </div>
                          </motion.div>
                       </>
                    )}
                 </AnimatePresence>
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

export default ReputationManagementActivity;
