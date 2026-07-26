import React, { useState, useEffect } from "react";
import { Bot, Play, Activity, CheckCircle, XCircle, ShieldAlert, CreditCard, MapPin, Laptop, ShieldCheck } from "lucide-react";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { motion, AnimatePresence } from "motion/react";
import { toast } from 'sonner';

const FraudDetectionActivity: React.FC<{
  step: number;
  exercises: any[];
  infoVisible?: boolean;
  infoPlacement?: "side" | "bottom";
  settings?: any;
}> = ({ step, exercises, infoVisible = true, infoPlacement = "side", settings }) => {
  const question = exercises[step];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [fraudDetected, setFraudDetected] = useState(false);

  const [selected, setSelected] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setActiveNodes([]);
    setFraudDetected(false);
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
    setFraudDetected(false);
    
    const timeouts: NodeJS.Timeout[] = [];
    
    // Simulate transaction attempts mapping to the central node (IP/Device)
    timeouts.push(setTimeout(() => setActiveNodes([1]), 500));
    timeouts.push(setTimeout(() => setActiveNodes([1, 2]), 1200));
    timeouts.push(setTimeout(() => setActiveNodes([1, 2, 3]), 1800));
    timeouts.push(setTimeout(() => setActiveNodes([1, 2, 3, 4]), 2300));
    
    // Anomaly detected
    timeouts.push(setTimeout(() => setFraudDetected(true), 3000));

    // End simulation
    timeouts.push(setTimeout(() => setIsPlaying(false), 5500));

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
        <DevLushTheoryBridge item={{ labId: 'ecommerce-agents-fraud', exerciseTitle: question.title, theory: theoryData }} />
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
                      {selected === question.answer ? 'Correct Detection!' : 'Incorrect Analysis'}
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
                <><Activity className="w-5 h-5 animate-pulse" />Analyzing Graph...</>
              ) : (
                <><Play className="w-5 h-5" />Run Fraud Analysis</>
              )}
            </button>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed text-center w-full">
             {question.prompt}
          </p>

          <div className="my-4 w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative min-h-[450px]">
             {/* Graph Background */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
             
             {/* Main Viewport */}
             <div className="relative w-full h-full flex items-center justify-center min-h-[450px]">
                 
                 {/* Central Node (IP Address) */}
                 <div className="absolute z-20 flex flex-col items-center">
                    <motion.div 
                       animate={fraudDetected ? { backgroundColor: "#ef4444", borderColor: "#f87171", boxShadow: "0 0 40px rgba(239,68,68,0.6)" } : { backgroundColor: "#1e293b", borderColor: "#334155" }}
                       className="w-16 h-16 rounded-full border-2 flex items-center justify-center z-20 transition-colors duration-500"
                    >
                       {fraudDetected ? <ShieldAlert className="w-8 h-8 text-white animate-pulse" /> : <Laptop className="w-8 h-8 text-slate-400" />}
                    </motion.div>
                    <span className={`text-[10px] font-mono mt-2 font-bold px-2 py-0.5 rounded ${fraudDetected ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-500'}`}>
                       IP: 192.168.1.44
                    </span>
                 </div>

                 {/* Peripheral Nodes (Credit Cards) */}
                 <TransactionNode index={1} active={activeNodes.includes(1)} fraud={fraudDetected} angle={0} />
                 <TransactionNode index={2} active={activeNodes.includes(2)} fraud={fraudDetected} angle={72} />
                 <TransactionNode index={3} active={activeNodes.includes(3)} fraud={fraudDetected} angle={144} />
                 <TransactionNode index={4} active={activeNodes.includes(4)} fraud={fraudDetected} angle={216} />
                 <TransactionNode index={5} active={false} fraud={false} angle={288} />
                 
                 {/* Agent Overlay Overlay */}
                 <AnimatePresence>
                    {fraudDetected && (
                        <motion.div 
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0 }}
                           className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-950/80 border border-red-500/50 backdrop-blur-md px-6 py-4 rounded-xl flex items-center gap-4 z-50 shadow-2xl"
                        >
                            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
                               <Bot className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h5 className="text-red-400 font-bold text-sm tracking-widest uppercase">Velocity Attack Detected</h5>
                                <p className="text-red-300 text-xs mt-1">4 distinct payment methods originating from single device fingerprint in 1.2s. Enforcing 3D Secure.</p>
                            </div>
                        </motion.div>
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

const TransactionNode = ({ active, fraud, angle, index }: any) => {
    // Math to position nodes in a circle
    const radius = 120;
    const x = Math.sin((angle * Math.PI) / 180) * radius;
    const y = Math.cos((angle * Math.PI) / 180) * -radius;

    return (
        <div className="absolute z-10" style={{ transform: `translate(${x}px, ${y}px)` }}>
            {/* Connection Line */}
            <svg className="absolute top-1/2 left-1/2 pointer-events-none" style={{ width: radius * 2, height: radius * 2, transform: 'translate(-50%, -50%)', overflow: 'visible' }}>
               <motion.line 
                  x1="50%" y1="50%" 
                  x2={`${50 - (Math.sin((angle * Math.PI) / 180) * 50)}%`} 
                  y2={`${50 - (Math.cos((angle * Math.PI) / 180) * -50)}%`}
                  stroke={fraud ? '#ef4444' : active ? '#3b82f6' : '#334155'}
                  strokeWidth="2"
                  strokeDasharray={fraud ? "0" : "4,4"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: active ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
               />
            </svg>

            {/* Node */}
            <motion.div 
               initial={{ scale: 0.8, opacity: 0.5 }}
               animate={{ scale: active ? 1 : 0.8, opacity: active ? 1 : 0.5 }}
               className={`w-10 h-10 rounded-full border-2 flex flex-col items-center justify-center relative z-20 ${fraud ? 'bg-red-950 border-red-500 text-red-400' : active ? 'bg-blue-950 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-600 text-slate-500'}`}
            >
               <CreditCard className="w-4 h-4" />
            </motion.div>
            
            {active && (
                <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[9px] font-mono whitespace-nowrap bg-slate-900/80 px-1.5 py-0.5 rounded ${fraud ? 'text-red-400' : 'text-blue-400'}`}>
                    TXN_{index}9{index}4
                </div>
            )}
        </div>
    )
}

export default FraudDetectionActivity;
