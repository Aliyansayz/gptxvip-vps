import React, { useState, useEffect } from "react";
import { Bot, Play, Activity, CheckCircle, XCircle, ShoppingCart, ArrowRight, DollarSign, Mail } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion, AnimatePresence } from "motion/react";
import { toast } from 'sonner';

const CartAbandonmentAgentActivity: React.FC<{
  step: number;
  exercises: any[];
  infoVisible?: boolean;
  infoPlacement?: "side" | "bottom";
  settings?: any;
}> = ({ step, exercises, infoVisible = true, infoPlacement = "side", settings }) => {
  const question = exercises[step];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setActiveStage(0);
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
    setActiveStage(0);
    
    const timeouts: NodeJS.Timeout[] = [];
    
    // Stage 1: Detect Abandonment
    timeouts.push(setTimeout(() => setActiveStage(1), 500));
    // Stage 2: Analyze History & Margin
    timeouts.push(setTimeout(() => setActiveStage(2), 2000));
    // Stage 3: Generate Dynamic Offer
    timeouts.push(setTimeout(() => setActiveStage(3), 3500));
    // Stage 4: Send via Email/SMS
    timeouts.push(setTimeout(() => {
      setActiveStage(4);
      setTimeout(() => setIsPlaying(false), 1500);
    }, 5000));

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
        <DevLushTheoryBridge item={{ labId: 'ecommerce-agents-cart-abandonment', exerciseTitle: question.title, theory: theoryData }} />
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
                <><Activity className="w-5 h-5 animate-pulse" />Simulating...</>
              ) : (
                <><Play className="w-5 h-5" />Run Agent Workflow</>
              )}
            </button>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed text-center w-full">
             {question.prompt}
          </p>

          <div className="my-4 p-6 w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex justify-center items-center relative min-h-[350px]">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl">
                {/* Agent Node */}
                <motion.div 
                   animate={activeStage > 0 && activeStage < 4 ? { scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(99,102,241,0)", "0px 0px 20px rgba(99,102,241,0.5)", "0px 0px 0px rgba(99,102,241,0)"] } : {}}
                   transition={{ repeat: Infinity, duration: 1.5 }}
                   className={`p-4 rounded-full border-2 ${activeStage > 0 ? 'bg-indigo-100 border-indigo-400 text-indigo-600 dark:bg-indigo-900/40 dark:border-indigo-500 dark:text-indigo-300' : 'bg-slate-100 border-slate-300 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}
                >
                   <Bot className="w-8 h-8" />
                </motion.div>

                {/* Workflow Visualization */}
                <div className="flex justify-between items-center w-full relative">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 z-0">
                       <motion.div 
                          className="h-full bg-indigo-500"
                          initial={{ width: "0%" }}
                          animate={{ width: activeStage === 0 ? "0%" : activeStage === 1 ? "25%" : activeStage === 2 ? "60%" : activeStage >= 3 ? "100%" : "0%" }}
                          transition={{ duration: 0.5 }}
                       />
                    </div>

                    <StageNode icon={<ShoppingCart />} label="Abandoned Cart" active={activeStage >= 1} color="rose" delay={0} />
                    <StageNode icon={<DollarSign />} label="Calculate Margin" active={activeStage >= 2} color="amber" delay={0.2} />
                    <StageNode icon={<Mail />} label="Dynamic Offer Sent" active={activeStage >= 4} color="emerald" delay={0.4} />
                </div>

                {/* Output Display */}
                <div className="h-16 w-full flex justify-center items-center">
                    <AnimatePresence mode="wait">
                       {activeStage === 1 && (
                         <motion.div key="stage1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-rose-500 font-mono text-sm bg-white dark:bg-slate-950 px-4 py-2 rounded-lg border border-rose-200 dark:border-rose-900 shadow-sm">
                            Detecting abandoned $250 cart (Leather Boots)...
                         </motion.div>
                       )}
                       {activeStage === 2 && (
                         <motion.div key="stage2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-amber-600 dark:text-amber-400 font-mono text-sm bg-white dark:bg-slate-950 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-900 shadow-sm">
                            Analyzing user history... (High price sensitivity). Margin is 40%.
                         </motion.div>
                       )}
                       {activeStage >= 3 && (
                         <motion.div key="stage3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-emerald-600 dark:text-emerald-400 font-mono text-sm bg-white dark:bg-slate-950 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-900 shadow-sm font-bold flex items-center gap-2">
                            <CheckCircle className="w-4 h-4"/> Optimal Offer: Free Shipping + 5% Off. Generating Email...
                         </motion.div>
                       )}
                    </AnimatePresence>
                </div>
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

const StageNode = ({ icon, label, active, color, delay }: any) => {
    const colorClasses = {
        rose: active ? 'bg-rose-500 border-rose-600 text-white shadow-[0_0_15px_rgba(243,24,113,0.5)]' : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700',
        amber: active ? 'bg-amber-500 border-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700',
        emerald: active ? 'bg-emerald-500 border-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700',
    }[color as 'rose'|'amber'|'emerald'];

    return (
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: active ? 1.1 : 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: delay }}
            className="flex flex-col items-center gap-2 z-10 w-24"
        >
            <div className={`w-12 h-12 rounded-xl flex justify-center items-center border-2 transition-all duration-300 ${colorClasses}`}>
                {icon}
            </div>
            <span className={`text-[10px] text-center font-bold uppercase tracking-wider ${active ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                {label}
            </span>
        </motion.div>
    )
}

export default CartAbandonmentAgentActivity;
