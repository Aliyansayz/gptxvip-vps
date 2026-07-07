import React, { useState, useEffect } from "react";
import { Bot, Play, GitMerge, Activity, Users, CheckCircle, XCircle } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion, AnimatePresence } from "motion/react";
import { toast } from 'sonner';

const OrchestratorActivity: React.FC<{
  step: number;
  exercises: any[];
  infoVisible?: boolean;
  infoPlacement?: "side" | "bottom";
  settings?: any;
}> = ({ step, exercises, infoVisible = true, infoPlacement = "side", settings }) => {
  const question = exercises[step];
  const { architecture } = question;
  
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

    // Orchestrator Simulation
    activateNode('user', 0, 1000);
    addMessage('user', 'orch', 500);
    activateNode('orch', 1000, 4000);
    
    addMessage('orch', 'w1', 1500);
    activateNode('w1', 2000, 1000);
    addMessage('w1', 'orch', 3000);
    
    addMessage('orch', 'w2', 2000);
    activateNode('w2', 2500, 1000);
    addMessage('w2', 'orch', 3500);
    
    addMessage('orch', 'w3', 2500);
    activateNode('w3', 3000, 1000);
    addMessage('w3', 'orch', 4000);
    
    addMessage('orch', 'decision', 4500);
    activateNode('decision', 5000, 1000);
    
    timeouts.push(setTimeout(() => setIsPlaying(false), 6500));
    return () => timeouts.forEach(clearTimeout);
  };

  const getIcon = (role: string) => {
    switch (role) {
      case 'orchestrator': return <GitMerge className="w-6 h-6" />;
      case 'worker': return <Bot className="w-5 h-5" />;
      case 'input': return <Users className="w-5 h-5" />;
      case 'final': return <Activity className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  const KitchenBrigadeAnalogy: React.FC = () => (
    <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-500" /> Analogy: Kitchen Brigade
        </h5>
        <svg viewBox="0 0 200 120" className="w-full h-40">
            {/* Customer Order */}
            <rect x="10" y="50" width="30" height="20" rx="2" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
            <text x="25" y="62" textAnchor="middle" fontSize="6" fill="#475569">Order</text>
            <path d="M 45 60 L 65 60" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="2 2" className="animate-pulse" />

            {/* Head Chef (Orchestrator) */}
            <circle cx="85" cy="60" r="15" fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="2" />
            <text x="85" y="63" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#5b21b6">CHEF</text>

            {/* Routing to Stations */}
            <path d="M 105 60 L 130 30" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M 105 60 L 130 60" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M 105 60 L 130 90" stroke="#cbd5e1" strokeWidth="2" />

            {/* Line Cooks (Workers) */}
            {/* Station 1 */}
            <rect x="135" y="20" width="40" height="20" rx="2" fill="#bbf7d0" stroke="#22c55e" strokeWidth="2" />
            <text x="155" y="32" textAnchor="middle" fontSize="6" fill="#166534">Grill Station</text>
            
            {/* Station 2 */}
            <rect x="135" y="50" width="40" height="20" rx="2" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
            <text x="155" y="62" textAnchor="middle" fontSize="6" fill="#1e40af">Fry Station</text>
            
            {/* Station 3 */}
            <rect x="135" y="80" width="40" height="20" rx="2" fill="#fecaca" stroke="#ef4444" strokeWidth="2" />
            <text x="155" y="92" textAnchor="middle" fontSize="6" fill="#991b1b">Prep Station</text>

            <text x="100" y="115" textAnchor="middle" fontSize="8" fill="currentColor" className="text-slate-500">Chef routes sub-tasks to specialized stations</text>
        </svg>
    </div>
  );

  const DataPipelineVisual = () => (
      <div className="w-full h-full relative p-4">
        <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
            {/* Background Grid */}
            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="none" stroke="rgba(100,100,100,0.1)" strokeWidth="1" />
                </pattern>
                
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Connections */}
            <g stroke="#334155" strokeWidth="3" fill="none" className="transition-all duration-500">
                <path d="M 200 40 L 200 100" stroke={activeNodes.includes('user') ? "#8b5cf6" : "#334155"} />
                
                <path d="M 200 140 C 200 170, 80 170, 80 200" stroke={activeNodes.includes('orch') ? "#8b5cf6" : "#334155"} />
                <path d="M 200 140 C 200 170, 200 170, 200 200" stroke={activeNodes.includes('orch') ? "#8b5cf6" : "#334155"} />
                <path d="M 200 140 C 200 170, 320 170, 320 200" stroke={activeNodes.includes('orch') ? "#8b5cf6" : "#334155"} />
                
                <path d="M 80 240 C 80 270, 200 270, 200 280" stroke={activeNodes.includes('w1') ? "#8b5cf6" : "#334155"} />
                <path d="M 200 240 C 200 270, 200 270, 200 280" stroke={activeNodes.includes('w2') ? "#8b5cf6" : "#334155"} />
                <path d="M 320 240 C 320 270, 200 270, 200 280" stroke={activeNodes.includes('w3') ? "#8b5cf6" : "#334155"} />
            </g>

            {/* Nodes */}
            <g transform="translate(200, 20)">
                <rect x="-40" y="-20" width="80" height="40" rx="8" fill="#1e293b" stroke={activeNodes.includes('user') ? "#8b5cf6" : "#475569"} strokeWidth="2" filter={activeNodes.includes('user') ? "url(#glow)" : ""} className="transition-all duration-300" />
                <text x="0" y="5" textAnchor="middle" fontSize="12" fill="#e2e8f0" fontWeight="bold">Customer</text>
            </g>

            <g transform="translate(200, 120)">
                <rect x="-60" y="-20" width="120" height="40" rx="8" fill="#1e293b" stroke={activeNodes.includes('orch') ? "#8b5cf6" : "#475569"} strokeWidth="2" filter={activeNodes.includes('orch') ? "url(#glow)" : ""} className="transition-all duration-300" />
                <text x="0" y="5" textAnchor="middle" fontSize="12" fill="#c4b5fd" fontWeight="bold">Orchestrator</text>
            </g>

            <g transform="translate(80, 220)">
                <rect x="-50" y="-20" width="100" height="40" rx="8" fill="#1e293b" stroke={activeNodes.includes('w1') ? "#22c55e" : "#475569"} strokeWidth="2" filter={activeNodes.includes('w1') ? "url(#glow)" : ""} className="transition-all duration-300" />
                <text x="0" y="5" textAnchor="middle" fontSize="12" fill="#86efac" fontWeight="bold">Image Agent</text>
            </g>

            <g transform="translate(200, 220)">
                <rect x="-50" y="-20" width="100" height="40" rx="8" fill="#1e293b" stroke={activeNodes.includes('w2') ? "#3b82f6" : "#475569"} strokeWidth="2" filter={activeNodes.includes('w2') ? "url(#glow)" : ""} className="transition-all duration-300" />
                <text x="0" y="5" textAnchor="middle" fontSize="12" fill="#93c5fd" fontWeight="bold">Policy Agent</text>
            </g>

            <g transform="translate(320, 220)">
                <rect x="-50" y="-20" width="100" height="40" rx="8" fill="#1e293b" stroke={activeNodes.includes('w3') ? "#ef4444" : "#475569"} strokeWidth="2" filter={activeNodes.includes('w3') ? "url(#glow)" : ""} className="transition-all duration-300" />
                <text x="0" y="5" textAnchor="middle" fontSize="12" fill="#fca5a5" fontWeight="bold">Fraud Agent</text>
            </g>

            {/* Decision output */}
            <g transform="translate(200, 290)">
                <circle cx="0" cy="0" r="10" fill={activeNodes.includes('decision') ? "#8b5cf6" : "#1e293b"} stroke="#8b5cf6" strokeWidth="2" filter={activeNodes.includes('decision') ? "url(#glow)" : ""} className="transition-all duration-300" />
                <text x="0" y="25" textAnchor="middle" fontSize="12" fill="#e2e8f0" fontWeight="bold">Result</text>
            </g>

            {/* Animated Packets */}
            <AnimatePresence>
                {messages.map((m) => {
                    // Quick map for coordinates
                    const coords: Record<string, {x:number,y:number}> = {
                        user: {x:200, y:40},
                        orch: {x:200, y:100},
                        w1: {x:80, y:200},
                        w2: {x:200, y:200},
                        w3: {x:320, y:200},
                        decision: {x:200, y:280}
                    };
                    
                    const fromPos = coords[m.from];
                    const toPos = m.to === 'orch' && m.from === 'user' ? {x:200, y:100} : 
                                  m.to === 'orch' ? {x:200, y:140} : // return up to orch
                                  coords[m.to];
                                  
                    if (!fromPos || !toPos) return null;

                    return (
                        <motion.circle
                            key={m.id}
                            r="4"
                            fill="#c4b5fd"
                            style={{ filter: "drop-shadow(0 0 4px #8b5cf6)" }}
                            initial={{ cx: fromPos.x, cy: fromPos.y, opacity: 0 }}
                            animate={{ cx: toPos.x, cy: toPos.y, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "linear" }}
                        />
                    );
                })}
            </AnimatePresence>
        </svg>
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
        <div className="flex flex-col h-full gap-4">
            <DevLushTheoryBridge item={{ labId: 'agentTypes', exerciseTitle: question.title, theory: theoryData }} />
            <KitchenBrigadeAnalogy />
        </div>
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

          <DataPipelineVisual />
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

export default OrchestratorActivity;
