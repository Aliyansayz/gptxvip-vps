import React, { useState, useEffect } from "react";
import { Bot, Play, Activity, CheckCircle, XCircle, Database, Lock } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion } from "motion/react";
import { toast } from 'sonner';

const DeveloperLensActivity: React.FC<{
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

    // Simulation: Process A acquires lock, mutates, releases. Process B waits.
    activateNode('p1', 0, 3000);
    timeouts.push(setTimeout(() => setIsLocked(true), 500));
    addMessage('p1', 'mutex', 500, "Acquire Lock");
    addMessage('p1', 'state', 1500, "Read/Write State");
    timeouts.push(setTimeout(() => setIsLocked(false), 2800));
    addMessage('p1', 'mutex', 2800, "Release Lock");

    activateNode('p2', 1000, 3000);
    addMessage('p2', 'mutex', 1500, "Wait for Lock...");
    addMessage('p2', 'mutex', 3200, "Acquire Lock");
    timeouts.push(setTimeout(() => setIsLocked(true), 3200));
    addMessage('p2', 'state', 3800, "Read/Write State");
    timeouts.push(setTimeout(() => setIsLocked(false), 4500));
    addMessage('p2', 'mutex', 4500, "Release Lock");
    
    timeouts.push(setTimeout(() => setIsPlaying(false), 5500));
    return () => timeouts.forEach(clearTimeout);
  };

  const getIcon = (role: string) => {
    switch (role) {
      case 'worker': return <Bot className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      case 'layer': return <Lock className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  const Node = ({ id, label, role, active, completed }: any) => (
    <div className="flex flex-col items-center gap-3 relative z-20">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 
        ${active ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110' : 
          completed ? 'bg-slate-100 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400' : 
          'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}
        ${role === 'layer' && isLocked ? 'bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' : ''}`}
      >
        {getIcon(role)}
      </div>
      <span className={`text-sm font-semibold tracking-wide ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
    </div>
  );

  const theoryData = question.theory;

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'ecommerce-agents-developer-lens', exerciseTitle: question.title, theory: theoryData }} />
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
                  className="px-8 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
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
                Analogy: Distributed Locking Mechanisms
            </h5>
            <div className="relative w-full h-[400px] flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="flex flex-col items-center justify-between w-full h-full">
                  <div className="flex justify-center w-full gap-24 relative z-10">
                     <Node id="p1" label="Process A" role="worker" active={activeNodes.includes('p1')} completed={completedNodes.includes('p1')} />
                     <Node id="p2" label="Process B" role="worker" active={activeNodes.includes('p2')} completed={completedNodes.includes('p2')} />
                  </div>
                  <Node id="mutex" label="Mutex Lock" role="layer" active={activeNodes.includes('mutex')} completed={completedNodes.includes('mutex')} />
                  <Node id="state" label="Shared State" role="database" active={activeNodes.includes('state')} completed={completedNodes.includes('state')} />
              </div>

              {messages.map((m) => (
                 <motion.div
                   key={m.id}
                   initial={{ opacity: 0, y: -20, scale: 0 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0 }}
                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none px-3 py-1 bg-indigo-100 border border-indigo-300 text-indigo-800 font-bold rounded-md shadow-sm text-xs"
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

export default DeveloperLensActivity;
