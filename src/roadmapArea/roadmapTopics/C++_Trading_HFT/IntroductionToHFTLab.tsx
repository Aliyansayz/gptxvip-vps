import React, { useState, useEffect } from 'react';
import { Exercise } from '../../roadmapSharedComponents/types';
import { 
  CheckCircle, 
  XCircle, 
  Zap, 
  Clock, 
  ArrowRight,
  ArrowDown,
  Server,
  Activity
} from 'lucide-react';
import { LabSettings } from '../../roadmapSharedComponents/LabSettingsMenu';
import { RoadmapLayout } from '../../roadmapView/rootComponents/RoadmapLayout';
import { RoadmapTheoryBridge } from '../../roadmapView/rootComponents/RoadmapTheoryBridge';
import Markdown from 'react-markdown';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const IntroductionToHFTLab: React.FC<ChapterProps> = ({ 
  step, 
  exercises, 
  infoVisible, 
  infoPlacement, 
  settings 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [simRunning, setSimRunning] = useState(false);
  const [retailProgress, setRetailProgress] = useState(0);
  const [hftProgress, setHftProgress] = useState(0);

  const currentExercise = exercises[step] || exercises[0];

  // Reset state when step changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setSimRunning(false);
    setRetailProgress(0);
    setHftProgress(0);
  }, [step]);

  // Latency Simulator Logic
  useEffect(() => {
    if (!simRunning) return;

    let rProgress = 0;
    let hProgress = 0;

    const interval = setInterval(() => {
      // HFT is 1000x faster in real life, but for visual purposes, make it 10x faster
      hProgress += 10;
      rProgress += 1;

      if (hProgress > 100) hProgress = 100;
      if (rProgress > 100) rProgress = 100;

      setHftProgress(hProgress);
      setRetailProgress(rProgress);

      if (rProgress === 100 && hProgress === 100) {
        clearInterval(interval);
        setTimeout(() => setSimRunning(false), 2000);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [simRunning]);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || (currentExercise as any).type === 'reading') return;
    
    const correctAns = (currentExercise as any).correct_answer || currentExercise.correctAnswer;
    const correct = (currentExercise as any).type === 'fill_in_the_blank' 
      ? selectedAnswer.toLowerCase().trim() === correctAns?.toLowerCase().trim()
      : selectedAnswer === correctAns;

    setIsCorrect(correct);
    setShowResult(true);
    
    // Trigger simulation on submit to reinforce learning
    if (!simRunning) {
      setRetailProgress(0);
      setHftProgress(0);
      setSimRunning(true);
    }
  };

  const getFeedback = () => {
    if (!currentExercise.wrong_answer_feedback) return currentExercise.explanation;
    const feedbackObj = currentExercise.wrong_answer_feedback.find(f => f.option === selectedAnswer);
    return feedbackObj ? feedbackObj.feedback : currentExercise.explanation;
  };

  // --- Visual Component: Latency Race ---
  const latencyRaceVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-slate-900/50 to-slate-950 pointer-events-none"></div>
      
      <div className="w-full max-w-2xl z-10 space-y-12">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 font-heading tracking-wider">Latency Arbitrage Simulator</h3>
          <p className="text-slate-400 text-sm">Visualizing execution speed: Retail vs HFT Algorithm</p>
        </div>

        {/* Retail Lane */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>Traditional Algo / Retail</span>
            </div>
            <span className="text-xs font-mono text-slate-500">Latency: ~50.0 ms</span>
          </div>
          <div className="w-full h-8 bg-slate-800/80 rounded-full border border-slate-700 overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-75 ease-linear flex items-center justify-end pr-2"
              style={{ width: `${retailProgress}%` }}
            >
              {retailProgress > 10 && <ArrowRight className="w-4 h-4 text-white opacity-80" />}
            </div>
          </div>
        </div>

        {/* HFT Lane */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-green-400 font-bold">
              <Zap className="w-5 h-5" />
              <span>HFT Agent (C++)</span>
            </div>
            <span className="text-xs font-mono text-green-500/70">Latency: ~0.005 ms (5μs)</span>
          </div>
          <div className="w-full h-8 bg-slate-800/80 rounded-full border border-green-900/30 overflow-hidden relative shadow-[0_0_15px_rgba(74,222,128,0.1)]">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-75 ease-linear flex items-center justify-end pr-2 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
              style={{ width: `${hftProgress}%` }}
            >
              {hftProgress > 5 && <Zap className="w-4 h-4 text-white drop-shadow-md" />}
            </div>
          </div>
        </div>

        {/* Exchanges */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-800/50">
           <div className="flex flex-col items-center gap-2 text-slate-400">
             <Server className="w-8 h-8" />
             <span className="text-xs font-mono">Broker Gateway</span>
           </div>
           <div className="flex flex-col items-center gap-2 text-slate-400">
             <Activity className="w-8 h-8 text-indigo-400" />
             <span className="text-xs font-mono text-indigo-300">Matching Engine</span>
           </div>
        </div>

        <div className="flex justify-center pt-4">
          <button 
            onClick={() => {
              setRetailProgress(0);
              setHftProgress(0);
              setSimRunning(true);
            }}
            disabled={simRunning}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {simRunning ? "Simulating..." : "Run Latency Test"}
          </button>
        </div>
      </div>
    </div>
  );


  // --- New Bespoke Visuals ---
  const colocationVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 md:p-8 bg-slate-950 relative overflow-hidden">
       <div className="flex flex-col md:flex-row items-center gap-12 w-full max-w-2xl">
          <div className="flex flex-col items-center gap-4 flex-1">
             <div className="w-24 h-24 bg-slate-800 border border-slate-600 rounded flex items-center justify-center">
                <span className="text-slate-400 font-bold text-center text-sm">Retail<br/>Datacenter</span>
             </div>
             <div className="h-2 w-full bg-slate-700 relative overflow-hidden rounded-full mt-4">
                <div className="absolute top-0 left-0 h-full w-1/4 bg-blue-500 animate-[pulse_1s_linear_infinite]"></div>
             </div>
             <span className="text-blue-400 font-mono text-sm mt-2">Latency: 35ms</span>
          </div>

          <div className="flex flex-col items-center gap-4">
             <div className="w-32 h-32 bg-indigo-900 border-2 border-indigo-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                <span className="text-indigo-200 font-bold text-xl text-center">Exchange<br/>Engine</span>
             </div>
          </div>

          <div className="flex flex-col items-center gap-4 flex-1">
             <div className="w-24 h-24 bg-green-900 border-2 border-green-500 rounded flex items-center justify-center relative shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <span className="text-green-300 font-bold text-center text-sm">Co-located<br/>Server</span>
                <div className="absolute top-1/2 -left-12 w-12 h-2 bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse rounded-full transform -translate-y-1/2 hidden md:block"></div>
                <div className="absolute -top-12 left-1/2 w-2 h-12 bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse rounded-full transform -translate-x-1/2 md:hidden"></div>
             </div>
             <span className="text-emerald-400 font-mono text-sm mt-2 font-bold">Latency: 0.005ms</span>
          </div>
       </div>
    </div>
  );

  const simpleLOBVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-slate-950 relative overflow-hidden">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
         <div className="p-3 bg-slate-800 text-slate-300 font-bold text-center border-b border-slate-700">Live Order Book Snapshot</div>
         <div className="p-4 space-y-2">
            {[100.05, 100.04, 100.03].map((p, i) => (
              <div key={p} className="flex justify-between font-mono text-sm relative group cursor-pointer hover:bg-slate-800 p-1 rounded">
                 <div className="absolute right-0 top-0 h-full bg-red-900/20 rounded" style={{ width: `${50 - i*10}%` }}></div>
                 <span className="text-red-400 z-10">${p.toFixed(2)}</span>
                 <span className="text-slate-500 z-10">{1000 - i*200}</span>
              </div>
            ))}
            <div className="py-2 border-y border-slate-800 text-center text-xs text-slate-600 font-bold tracking-widest uppercase bg-slate-950/50">The Spread</div>
            {[100.01, 100.00, 99.99].map((p, i) => (
              <div key={p} className="flex justify-between font-mono text-sm relative group cursor-pointer hover:bg-slate-800 p-1 rounded">
                 <div className="absolute right-0 top-0 h-full bg-green-900/20 rounded" style={{ width: `${20 + i*15}%` }}></div>
                 <span className="text-green-400 z-10">${p.toFixed(2)}</span>
                 <span className="text-slate-500 z-10">{500 + i*300}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  const microOrdersVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-slate-950 gap-8 overflow-hidden">
       <div className="w-full max-w-2xl bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
          <h4 className="text-slate-400 font-bold">Traditional: Massive Block Order</h4>
          <div className="flex flex-col md:flex-row items-center gap-4">
             <div className="w-16 h-16 bg-red-600 rounded-full animate-pulse shadow-[0_0_20px_#dc2626]"></div>
             <ArrowRight className="w-8 h-8 text-slate-600 hidden md:block" />
             <ArrowDown className="w-8 h-8 text-slate-600 md:hidden" />
             <div className="flex-1 w-full h-12 bg-red-900/30 rounded border border-red-800 flex items-center justify-center">
               <span className="text-red-400 font-bold">High Market Impact</span>
             </div>
          </div>
       </div>

       <div className="w-full max-w-2xl bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
          <h4 className="text-slate-400 font-bold">HFT: Sliced Micro-Orders</h4>
          <div className="flex flex-col md:flex-row items-center gap-4">
             <div className="flex gap-2">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" style={{animation: `pulse 1.5s ease-in-out ${i*0.2}s infinite`}}></div>
               ))}
             </div>
             <ArrowRight className="w-8 h-8 text-slate-600 hidden md:block" />
             <ArrowDown className="w-8 h-8 text-slate-600 md:hidden" />
             <div className="flex-1 w-full h-12 bg-green-900/30 rounded border border-green-800 flex items-center justify-center">
               <span className="text-green-400 font-bold">Minimal Market Impact</span>
             </div>
          </div>
       </div>
    </div>
  );

  const latencyTimelineVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 md:p-8 bg-slate-950 overflow-hidden">
       <div className="w-full max-w-3xl">
          <div className="relative pt-10 pb-4 hidden md:block">
             <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-800 rounded-full -translate-y-1/2"></div>
             <div className="flex justify-between relative z-10 w-full">
                <div className="flex flex-col items-center gap-2 -mt-8">
                   <div className="w-6 h-6 bg-blue-500 rounded-full ring-4 ring-slate-950"></div>
                   <span className="text-xs font-bold text-blue-400">Network Transit</span>
                   <span className="text-[10px] text-slate-500 font-mono">15.0ms</span>
                </div>
                <div className="flex flex-col items-center gap-2 -mt-8">
                   <div className="w-6 h-6 bg-purple-500 rounded-full ring-4 ring-slate-950"></div>
                   <span className="text-xs font-bold text-purple-400">OS Kernel Queue</span>
                   <span className="text-[10px] text-slate-500 font-mono">2.5ms</span>
                </div>
                <div className="flex flex-col items-center gap-2 -mt-8">
                   <div className="w-6 h-6 bg-orange-500 rounded-full ring-4 ring-slate-950"></div>
                   <span className="text-xs font-bold text-orange-400">Application Logic</span>
                   <span className="text-[10px] text-slate-500 font-mono">1.0ms</span>
                </div>
                <div className="flex flex-col items-center gap-2 -mt-8">
                   <div className="w-6 h-6 bg-green-500 rounded-full ring-4 ring-slate-950 shadow-[0_0_15px_#22c55e]"></div>
                   <span className="text-xs font-bold text-green-400">HFT FPGA (Bypass)</span>
                   <span className="text-[10px] text-green-300 font-mono font-bold">0.001ms</span>
                </div>
             </div>
          </div>
          <div className="flex flex-col gap-4 md:hidden">
             <span className="text-green-400 font-mono font-bold">HFT: FPGA Bypass (0.001ms)</span>
             <span className="text-slate-500 font-mono line-through">Standard: Network + OS + App (18.5ms)</span>
          </div>
       </div>
    </div>
  );

  const kernelBypassVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-slate-950">
       <div className="flex flex-col md:flex-row w-full max-w-2xl h-auto md:h-64 border border-slate-800 rounded-xl overflow-hidden bg-slate-900 relative">
          <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col items-center justify-between opacity-50 space-y-4 md:space-y-0">
             <div className="w-full py-3 bg-blue-900/50 border border-blue-700 text-center text-blue-300 font-bold rounded">App Space (Java)</div>
             <ArrowDown className="w-6 h-6 text-slate-500" />
             <div className="w-full py-3 bg-slate-800 border border-slate-600 text-center text-slate-400 rounded">OS Kernel TCP/IP</div>
             <ArrowDown className="w-6 h-6 text-slate-500" />
             <div className="w-full py-3 bg-slate-700 border border-slate-500 text-center text-slate-300 rounded">Standard NIC</div>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-between relative space-y-4 md:space-y-0">
             <div className="w-full py-3 bg-green-900/80 border-2 border-green-500 text-center text-green-300 font-bold rounded shadow-[0_0_15px_rgba(34,197,94,0.4)] z-10">App Space (C++)</div>
             <div className="absolute right-4 top-[80px] h-[100px] w-8 border-r-2 border-b-2 border-t-2 border-emerald-500 rounded-r-xl border-dashed animate-pulse hidden md:block"></div>
             <div className="w-full py-3 bg-slate-800 border border-slate-600 text-center text-slate-600 rounded line-through decoration-red-500">OS Kernel Bypassed</div>
             <div className="w-full py-3 bg-emerald-900/80 border-2 border-emerald-500 text-center text-emerald-300 font-bold rounded shadow-[0_0_15px_rgba(16,185,129,0.4)] z-10">Custom FPGA NIC</div>
          </div>
       </div>
    </div>
  );


  let activeVisual;
  switch(step) {
    case 0: activeVisual = latencyRaceVisual; break;
    case 1: activeVisual = colocationVisual; break;
    case 2: activeVisual = simpleLOBVisual; break;
    case 3: activeVisual = microOrdersVisual; break;
    case 4: activeVisual = latencyTimelineVisual; break;
    case 5: activeVisual = kernelBypassVisual; break;
    default: activeVisual = latencyRaceVisual;
  }

  const visualContent = activeVisual;

  // --- Interaction Content: MCQ / Reading ---
  const interactionContent = (currentExercise as any).type === 'reading' ? (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
         <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-heading">
           {currentExercise.title || "Reading Activity"}
         </h2>
      </div>
      <div className="p-6 flex-grow overflow-y-auto custom-scrollbar text-slate-700 dark:text-slate-300 prose prose-slate dark:prose-invert max-w-none">
        {currentExercise.prompt ? (
            <div dangerouslySetInnerHTML={{ __html: currentExercise.prompt }} />
        ) : (
            <Markdown>{currentExercise.question || ""}</Markdown>
        )}
      </div>
    </div>
  ) : (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full">
      {/* Question Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-heading">
          {currentExercise.question}
        </h2>
      </div>

      {/* Options */}
      <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
        <div className="space-y-3">
          {(currentExercise as any).type === 'fill_in_the_blank' ? (
            <div className="w-full">
              <input 
                type="text" 
                className={`w-full p-4 rounded-xl border-2 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none transition-all ${
                  showResult 
                    ? isCorrect 
                      ? 'border-green-500 bg-green-50/20' 
                      : 'border-red-500 bg-red-50/20'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
                placeholder="Type your answer here..."
                value={selectedAnswer || ''}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showResult}
              />
              {showResult && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  {isCorrect ? (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold"><CheckCircle className="w-5 h-5"/> Correct</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
                      <XCircle className="w-5 h-5"/> 
                      Incorrect. The correct answer is: <span className="font-mono bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded ml-1">{(currentExercise as any).correct_answer || currentExercise.correctAnswer}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            (currentExercise.options || ((currentExercise as any).type === 'true_false' ? ["True", "False"] : []))?.map((option, idx) => (
            <label
              key={idx}
              className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedAnswer === option
                  ? showResult
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              <input
                type="radio"
                name="mcq-option"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => setSelectedAnswer(option)}
                disabled={showResult}
                className="mt-1 sr-only"
              />
              <div className="flex-grow text-slate-700 dark:text-slate-300">
                {option}
              </div>
              {showResult && selectedAnswer === option && (
                <div className="ml-4 flex-shrink-0">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
              )}
            </label>
          )))}
        </div>

        {/* Feedback Area */}
        {showResult && (
          <div className={`mt-6 p-5 rounded-xl border ${
            isCorrect 
              ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/50' 
              : 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50'
          }`}>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 ${
              isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
            }`}>
              {isCorrect ? 'Excellent!' : 'Not Quite'}
            </h4>
            <p className={`text-sm leading-relaxed ${
              isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
            }`}>
              {getFeedback()}
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
        <button
          onClick={handleAnswerSubmit}
          disabled={!selectedAnswer || showResult}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none"
        >
          {showResult ? 'Response Recorded' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );

  // --- Theory Content ---
  const theoryContent = currentExercise.theory ? (
    <RoadmapTheoryBridge 
      item={{ 
        labId: 'cpp-hft-01', 
        exerciseTitle: currentExercise.question || currentExercise.title, 
        theory: currentExercise.theory 
      }} 
    />
  ) : (
    <div className="p-6 text-slate-500 italic">No specific theory mapped to this view.</div>
  );

  return (
    <RoadmapLayout
      title="Introduction to HFT"
      visualContent={visualContent}
      interactionContent={interactionContent}
      theoryContent={theoryContent}
      infoVisible={infoVisible}
      infoPlacement={infoPlacement}
      settings={settings}
    />
  );
};
