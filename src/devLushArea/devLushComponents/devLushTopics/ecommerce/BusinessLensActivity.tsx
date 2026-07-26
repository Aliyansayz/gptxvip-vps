import React, { useState, useEffect } from "react";
import { Bot, Play, Activity, CheckCircle, XCircle, DollarSign, Target, Database } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion, AnimatePresence } from "motion/react";
import { toast } from 'sonner';

const BusinessLensActivity: React.FC<{
  step: number;
  exercises: any[];
  infoVisible?: boolean;
  infoPlacement?: "side" | "bottom";
  settings?: any;
}> = ({ step, exercises, infoVisible = true, infoPlacement = "side", settings }) => {
  const question = exercises[step];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [messages, setMessages] = useState<{from: string, to: string, id: number, text?: string}[]>([]);

  const [selected, setSelected] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setActiveNodes([]);
    setCompletedNodes([]);
    setMessages([]);
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
    setActiveNodes([]);
    setCompletedNodes([]);
    setMessages([]);
    
    const timeouts: NodeJS.Timeout[] = [];
    const addMessage = (from: string, to: string, delay: number, text: string = "") => {
      timeouts.push(setTimeout(() => {
        setMessages(prev => [...prev, { from, to, id: Date.now() + Math.random(), text }]);
      }, delay));
    };

    const activateNode = (id: string, delay: number, duration: number) => {
      timeouts.push(setTimeout(() => setActiveNodes(prev => [...prev, id]), delay));
      timeouts.push(setTimeout(() => {
        setActiveNodes(prev => prev.filter(n => n !== id));
        setCompletedNodes(prev => [...prev, id]);
      }, delay + duration));
    };

    // Simulation: Price collision without floor
    activateNode('agentA', 0, 1000);
    addMessage('agentA', 'db', 500, "$90");
    
    activateNode('agentB', 1000, 1000);
    addMessage('agentB', 'db', 1500, "$85");
    
    activateNode('agentA', 2000, 1000);
    addMessage('agentA', 'db', 2500, "$80");
    
    activateNode('agentB', 3000, 1000);
    addMessage('agentB', 'db', 3500, "$75");
    
    activateNode('agentA', 4000, 1000);
    addMessage('agentA', 'db', 4500, "$70 (FLOOR HIT)");
    
    timeouts.push(setTimeout(() => setIsPlaying(false), 5500));
    return () => timeouts.forEach(clearTimeout);
  };

  const getIcon = (role: string) => {
    switch (role) {
      case 'worker': return <Bot className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  const Node = ({ id, label, role, active, completed }: any) => (
    <div className="flex flex-col items-center gap-3 relative z-20">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 
        ${active ? 'bg-amber-500 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-110' : 
          completed ? 'bg-slate-100 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400' : 
          'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
      >
        {getIcon(role)}
      </div>
      <span className={`text-sm font-semibold tracking-wide ${active ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
    </div>
  );

  const theoryData = question.theory;

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'ecommerce-agents-business-lens', exerciseTitle: question.title, theory: theoryData }} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options?.map((opt: string) => (
                  <button 
                      key={opt}
                      onClick={() => !isChecked && setSelected(opt)}
                      disabled={isChecked}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left ${selected === opt ? 'bg-amber-500 text-white border-amber-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                      {opt}
                  </button>
              ))}
          </div>

          <div className="flex justify-center">
              <button 
                  onClick={handleCheck} 
                  disabled={!selected || isChecked}
                  className="px-8 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  Check Answer
              </button>
          </div>

          {isChecked && (
              <div className={`p-4 rounded-lg border ${selected === question.answer ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'}`}>
                  <div className="flex items-center gap-2 mb-2 font-bold">
                      {selected === question.answer ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                      {selected === question.answer ? 'Correct!' : 'Incorrect'}
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
                  : "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
              }`}
            >
              {isPlaying ? (
                <><Activity className="w-5 h-5 animate-pulse" />Simulating...</>
              ) : (
                <><Play className="w-5 h-5" />Run Workflow</>
              )}
            </button>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed text-center w-full">
             {question.prompt}
          </p>

          <div className="my-4 p-4 w-full bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <h5 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">
                Analogy: Automated Pricing Safeguards
            </h5>
            <div className="relative w-full h-[400px] flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[length:20px_20px] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden backdrop-blur-xl shadow-inner">
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {/* Agent A to DB */}
                  <motion.line x1="25%" y1="20%" x2="50%" y2="80%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" className="opacity-30" />
                  {/* Agent B to DB */}
                  <motion.line x1="75%" y1="20%" x2="50%" y2="80%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" className="opacity-30" />
              </svg>
              <div className="flex flex-col items-center justify-between w-full h-full relative z-10">
                  <div className="flex justify-around w-full relative">
                     <Node id="agentA" label="Our Agent" role="worker" active={activeNodes.includes('agentA')} completed={completedNodes.includes('agentA')} />
                     <Node id="agentB" label="Competitor" role="worker" active={activeNodes.includes('agentB')} completed={completedNodes.includes('agentB')} />
                  </div>
                  <Node id="db" label="Marketplace DB" role="database" active={activeNodes.includes('db')} completed={completedNodes.includes('db')} />
              </div>

              <AnimatePresence>
              {messages.map((m) => (
                 <motion.div
                   key={m.id}
                   initial={{ opacity: 0, y: -40, scale: 0.8 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.5 }}
                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none px-4 py-2 bg-amber-950/80 border border-amber-500 text-amber-300 font-bold rounded-xl shadow-2xl backdrop-blur-md text-xs"
                   transition={{ duration: 0.4, type: 'spring' }}
                 >
                   {m.text}
                 </motion.div>
              ))}
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

export default BusinessLensActivity;
