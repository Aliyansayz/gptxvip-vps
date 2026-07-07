import React, { useState, useEffect } from "react";
import { Play, Activity, CheckCircle, XCircle, Database, Lock, ShieldAlert, Cpu } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion } from "motion/react";
import { toast } from 'sonner';

const SecurityLensActivity: React.FC<{
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
  const [isLocked, setIsLocked] = useState(false);

  const [selected, setSelected] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setActiveNodes([]);
    setCompletedNodes([]);
    setMessages([]);
    setSelected(null);
    setIsChecked(false);
    setIsLocked(false);
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
    setIsLocked(false);
    
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

    // Simulation: Attacker sends multiple requests
    activateNode('attacker', 0, 4000);
    
    // Request 1
    addMessage('attacker', 'api', 500, "Req 1");
    activateNode('api', 1000, 500);
    addMessage('api', 'lock', 1500, "Acquire Advisory Lock");
    timeouts.push(setTimeout(() => setIsLocked(true), 1500));
    addMessage('lock', 'db', 2000, "Process Checkout 1");
    activateNode('db', 2500, 500);
    timeouts.push(setTimeout(() => setIsLocked(false), 3000));
    
    // Request 2 (Concurrent attempt)
    addMessage('attacker', 'api', 600, "Req 2 (Concurrent)");
    addMessage('api', 'lock', 1600, "Acquire Lock (Blocked)");
    
    // Request 3 (Concurrent attempt)
    addMessage('attacker', 'api', 700, "Req 3 (Concurrent)");
    addMessage('api', 'lock', 1700, "Acquire Lock (Blocked)");

    // Process 2 starts after lock is released
    addMessage('lock', 'db', 3200, "Process Checkout 2 (Denied)");
    
    timeouts.push(setTimeout(() => setIsPlaying(false), 4500));
    return () => timeouts.forEach(clearTimeout);
  };

  const getIcon = (role: string) => {
    switch (role) {
      case 'input': return <ShieldAlert className="w-5 h-5" />;
      case 'worker': return <Cpu className="w-5 h-5" />;
      case 'layer': return <Lock className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const Node = ({ id, label, role, active, completed }: any) => (
    <div className="flex flex-col items-center gap-3 relative z-20">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 
        ${active ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-110' : 
          completed ? 'bg-slate-100 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400' : 
          'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}
        ${role === 'layer' && isLocked ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.5)]' : ''}`}
      >
        {getIcon(role)}
      </div>
      <span className={`text-sm font-semibold tracking-wide ${active ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
    </div>
  );

  const theoryData = question.theory;

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'ecommerce-agents-security-lens', exerciseTitle: question.title, theory: theoryData }} />
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
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left ${selected === opt ? 'bg-rose-500 text-white border-rose-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                      {opt}
                  </button>
              ))}
          </div>

          <div className="flex justify-center">
              <button 
                  onClick={handleCheck} 
                  disabled={!selected || isChecked}
                  className="px-8 py-2 bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                  : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40"
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
                Analogy: Advisory Lock Defense
            </h5>
            <div className="relative w-full h-[400px] flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="flex flex-col items-center justify-between w-full h-full">
                  <Node id="attacker" label="Attacker" role="input" active={activeNodes.includes('attacker')} completed={completedNodes.includes('attacker')} />
                  <Node id="api" label="API Gateway" role="worker" active={activeNodes.includes('api')} completed={completedNodes.includes('api')} />
                  <Node id="lock" label="Advisory Lock" role="layer" active={activeNodes.includes('lock')} completed={completedNodes.includes('lock')} />
                  <Node id="db" label="Database" role="database" active={activeNodes.includes('db')} completed={completedNodes.includes('db')} />
              </div>

              {messages.map((m) => (
                 <motion.div
                   key={m.id}
                   initial={{ opacity: 0, x: -20, scale: 0 }}
                   animate={{ opacity: 1, x: 0, scale: 1 }}
                   exit={{ opacity: 0 }}
                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none px-3 py-1 bg-rose-100 border border-rose-300 text-rose-800 font-bold rounded-md shadow-sm text-xs"
                   transition={{ duration: 0.5, type: 'spring' }}
                 >
                   {m.text}
                 </motion.div>
              ))}
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

export default SecurityLensActivity;
