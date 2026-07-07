import React, { useState, useEffect } from "react";
import { Bot, Play, Activity, CheckCircle, XCircle, GitMerge } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion } from "motion/react";
import { toast } from 'sonner';

const AsyncOrchestrationActivity: React.FC<{
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
  const [messages, setMessages] = useState<{from: string, to: string, id: number}[]>([]);

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
    const addMessage = (from: string, to: string, delay: number) => {
      timeouts.push(setTimeout(() => {
        setMessages(prev => [...prev, { from, to, id: Date.now() + Math.random() }]);
      }, delay));
    };

    const activateNode = (id: string, delay: number, duration: number) => {
      timeouts.push(setTimeout(() => setActiveNodes(prev => [...prev, id]), delay));
      timeouts.push(setTimeout(() => {
        setActiveNodes(prev => prev.filter(n => n !== id));
        setCompletedNodes(prev => [...prev, id]);
      }, delay + duration));
    };

    activateNode('scheduler', 0, 1000);
      
    addMessage('scheduler', 'p1', 500);
    addMessage('scheduler', 'p2', 500);
    addMessage('scheduler', 'p3', 500);
    addMessage('scheduler', 'p4', 500);
    
    activateNode('p1', 1000, 2000);
    activateNode('p2', 1000, 1500);
    activateNode('p3', 1000, 2500);
    activateNode('p4', 1000, 1000);
    
    addMessage('p4', 'dash', 2000);
    addMessage('p2', 'dash', 2500);
    addMessage('p1', 'dash', 3000);
    addMessage('p3', 'dash', 3500);
    
    activateNode('dash', 3500, 1500);
    
    timeouts.push(setTimeout(() => setIsPlaying(false), 5500));
    return () => timeouts.forEach(clearTimeout);
  };

  const getIcon = (role: string) => {
    switch (role) {
      case 'orchestrator': return <GitMerge className="w-6 h-6" />;
      case 'worker': return <Bot className="w-5 h-5" />;
      case 'final': return <Activity className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  const Node = ({ id, label, role, active, completed }: any) => (
    <div className="flex flex-col items-center gap-3 relative z-20">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 
        ${active ? 'bg-violet-500 border-violet-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] scale-110' : 
          completed ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400' : 
          'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
      >
        {getIcon(role)}
      </div>
      <span className={`text-sm font-semibold tracking-wide ${active ? 'text-violet-600 dark:text-violet-400' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
    </div>
  );

  const theoryData = question.theory || (question.theory_explanation ? {
    title: question.title,
    content: question.theory_explanation,
    analogy: question.real_world_analogy,
    visual_element: question.visual_element
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
          <div className="grid grid-cols-2 gap-4">
              {question.options?.map((opt: string) => (
                  <button 
                      key={opt}
                      onClick={() => !isChecked && setSelected(opt)}
                      disabled={isChecked}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${selected === opt ? 'bg-violet-500 text-white border-violet-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                      {opt}
                  </button>
              ))}
          </div>

          <div className="flex justify-center">
              <button 
                  onClick={handleCheck} 
                  disabled={!selected || isChecked}
                  className="px-8 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
      title={question.title}
      prompt={question.prompt}
      visualContent={
        <div className="relative w-full h-[400px] flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="absolute top-4 right-4">
            <button
              onClick={runSimulation}
              disabled={isPlaying}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-xs ${
                isPlaying
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-500 text-white shadow-md hover:scale-105"
              }`}
            >
              {isPlaying ? (
                <><Activity className="w-4 h-4 animate-pulse" />Simulating...</>
              ) : (
                <><Play className="w-4 h-4" />Run Workflow</>
              )}
            </button>
          </div>

          <div className="flex flex-col items-center justify-between w-full h-full mt-6">
              <Node id="scheduler" label="Scheduler" role="orchestrator" active={activeNodes.includes('scheduler')} completed={completedNodes.includes('scheduler')} />
              <div className="flex justify-center w-full gap-8">
                 <Node id="p1" label="Price" role="worker" active={activeNodes.includes('p1')} completed={completedNodes.includes('p1')} />
                 <Node id="p2" label="Review" role="worker" active={activeNodes.includes('p2')} completed={completedNodes.includes('p2')} />
                 <Node id="p3" label="Inventory" role="worker" active={activeNodes.includes('p3')} completed={completedNodes.includes('p3')} />
                 <Node id="p4" label="Shipping" role="worker" active={activeNodes.includes('p4')} completed={completedNodes.includes('p4')} />
              </div>
              <Node id="dash" label="Dashboard" role="final" active={activeNodes.includes('dash')} completed={completedNodes.includes('dash')} />
          </div>

          {messages.map((m) => (
             <motion.div
               key={m.id}
               initial={{ opacity: 0, scale: 0 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.8)] -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
               transition={{ duration: 0.5, type: 'spring' }}
             />
          ))}
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

export default AsyncOrchestrationActivity;
