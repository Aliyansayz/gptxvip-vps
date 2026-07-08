import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../devLushArea/agentDevRootComponents/types';
import { 
  CheckCircle, 
  XCircle, 
  Server,
  Zap,
  Globe,
  MonitorSmartphone,
  Radio,
  ArrowRight
} from 'lucide-react';
import { LabSettings } from '../../../devLushArea/agentDevRootComponents/LabSettingsMenu';
import { RoadmapLayout } from '../../roadmapView/RoadmapLayout';
import { RoadmapTheoryBridge } from '../../roadmapView/RoadmapTheoryBridge';
import Markdown from 'react-markdown';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const ExchangeColocationLab: React.FC<ChapterProps> = ({ 
  step, 
  exercises, 
  infoVisible, 
  infoPlacement, 
  settings 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [activeTab, setActiveTab] = useState<'retail' | 'hft'>('retail');

  const currentExercise = exercises[step] || exercises[0];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [step]);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || (currentExercise as any).type === 'reading') return;
    
    const correctAns = (currentExercise as any).correct_answer || currentExercise.correctAnswer;
    const correct = (currentExercise as any).type === 'fill_in_the_blank' 
      ? selectedAnswer.toLowerCase().trim() === correctAns?.toLowerCase().trim()
      : selectedAnswer === correctAns;

    setIsCorrect(correct);
    setShowResult(true);
  };

  const getFeedback = () => {
    if (!currentExercise.wrong_answer_feedback) return currentExercise.explanation;
    const feedbackObj = currentExercise.wrong_answer_feedback.find(f => f.option === selectedAnswer);
    return feedbackObj ? feedbackObj.feedback : currentExercise.explanation;
  };

  // --- Visual Component: Network Topology ---
  const networkTopologyVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 bg-slate-950 rounded-xl border border-slate-800 shadow-2xl relative">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-xl flex flex-col">
        <div className="flex border-b border-slate-700 bg-slate-800/50">
           <button 
             onClick={() => setActiveTab('retail')}
             className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'retail' ? 'bg-indigo-900/40 text-indigo-300 border-b-2 border-indigo-500' : 'text-slate-400 hover:bg-slate-800'}`}
           >
             Standard Retail Topology
           </button>
           <button 
             onClick={() => setActiveTab('hft')}
             className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'hft' ? 'bg-green-900/40 text-green-300 border-b-2 border-green-500' : 'text-slate-400 hover:bg-slate-800'}`}
           >
             HFT Co-location Topology
           </button>
        </div>
        
        <div className="p-8 h-80 flex items-center justify-center relative">
           {activeTab === 'retail' ? (
             <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full justify-between">
                <div className="flex flex-col items-center gap-2 text-slate-400 animate-pulse">
                  <MonitorSmartphone className="w-10 h-10 text-indigo-400" />
                  <span className="text-xs font-bold">Home Trader</span>
                  <span className="text-[10px] bg-slate-800 px-2 rounded font-mono">0 ms</span>
                </div>
                
                <ArrowRight className="w-6 h-6 text-slate-600 hidden md:block" />
                <div className="h-6 w-[2px] bg-slate-600 block md:hidden"></div>
                
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Globe className="w-10 h-10 text-blue-400" />
                  <span className="text-xs font-bold">ISP Routing</span>
                  <span className="text-[10px] bg-slate-800 px-2 rounded font-mono">+15 ms</span>
                </div>

                <ArrowRight className="w-6 h-6 text-slate-600 hidden md:block" />
                <div className="h-6 w-[2px] bg-slate-600 block md:hidden"></div>

                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Server className="w-10 h-10 text-purple-400" />
                  <span className="text-xs font-bold">Broker Server</span>
                  <span className="text-[10px] bg-slate-800 px-2 rounded font-mono">+25 ms</span>
                </div>

                <ArrowRight className="w-6 h-6 text-slate-600 hidden md:block" />
                <div className="h-6 w-[2px] bg-slate-600 block md:hidden"></div>

                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Server className="w-12 h-12 text-slate-200" />
                  <span className="text-xs font-bold">Exchange</span>
                  <span className="text-[10px] bg-red-900/50 text-red-300 px-2 rounded font-mono border border-red-800">Total: 40+ ms</span>
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center w-full relative">
                {/* Exchange Data Center Box */}
                <div className="absolute inset-0 border-2 border-green-900/30 bg-green-950/10 rounded-xl flex justify-center items-end pb-2">
                  <span className="text-xs font-mono text-green-700 font-bold uppercase tracking-widest">Exchange Data Center</span>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center z-10 pt-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <Server className="w-12 h-12 text-green-400" />
                      <Radio className="absolute -top-4 -right-4 w-6 h-6 text-emerald-400 animate-ping" />
                    </div>
                    <span className="text-xs font-bold text-green-300">Co-located HFT Node</span>
                    <span className="text-[10px] bg-green-900/50 text-green-300 border border-green-700 px-2 rounded font-mono">0.000 ms</span>
                  </div>

                  <div className="flex items-center gap-2">
                     <div className="h-[2px] w-12 bg-green-500 relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-emerald-300 shadow-[0_0_8px_#34d399] animate-[pulse_0.5s_ease-in-out_infinite]"></div>
                     </div>
                     <span className="text-xs font-mono text-green-500">20ft Fiber</span>
                     <div className="h-[2px] w-12 bg-green-500 relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-emerald-300 shadow-[0_0_8px_#34d399] animate-[pulse_0.5s_ease-in-out_infinite]"></div>
                     </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <Server className="w-16 h-16 text-slate-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                    <span className="text-xs font-bold text-white">Matching Engine</span>
                    <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 rounded font-mono border border-emerald-500 font-bold">Total: ~0.001 ms</span>
                  </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );


  // --- New Bespoke Visuals ---
  const distanceLatencyVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-slate-950 overflow-hidden relative">
       <div className="w-full max-w-3xl space-y-12 relative">
          
          <div className="flex justify-between items-center px-8 border-b-2 border-slate-800 pb-4 relative">
             <span className="text-slate-500 font-bold">Chicago (CME)</span>
             <span className="text-slate-500 font-bold">New Jersey (Equinix NY4)</span>
          </div>

          <div className="relative h-24 bg-slate-900 rounded-full border border-slate-800">
             {/* Fiber line */}
             <div className="absolute top-1/2 left-0 w-full h-[2px] bg-blue-900 -translate-y-1/2"></div>
             
             {/* Moving Server */}
             <div className="absolute top-1/2 -translate-y-1/2 -ml-8 animate-[moveServer_4s_ease-in-out_infinite]">
                <div className="flex flex-col items-center gap-2">
                   <div className="w-16 h-16 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-lg flex items-center justify-center relative">
                      <Server className="w-8 h-8 text-blue-400" />
                   </div>
                   {/* Latency Counter (CSS content trick) */}
                   <div className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-mono text-sm font-bold text-blue-300 before:content-[''] relative overflow-hidden flex flex-col items-center justify-center h-8 w-24">
                      <span className="animate-[countDown_4s_ease-in-out_infinite] block"></span>
                   </div>
                </div>
             </div>

             {/* Exchange */}
             <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
                <div className="w-24 h-24 bg-indigo-900 border-4 border-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                   <Activity className="w-10 h-10 text-indigo-300" />
                </div>
             </div>
          </div>

       </div>
       <style>{`
         @keyframes moveServer {
           0% { left: 0%; border-color: #475569; }
           100% { left: calc(100% - 2rem); border-color: #22c55e; }
         }
         @keyframes countDown {
           0% { content: "35.0 ms"; color: #94a3b8; transform: translateY(0); }
           50% { content: "15.0 ms"; color: #38bdf8; transform: translateY(0); }
           90% { content: "2.0 ms"; color: #34d399; transform: translateY(0); }
           100% { content: "0.01 ms"; color: #10b981; transform: translateY(0); }
         }
       `}</style>
    </div>
  );

  const fpgaVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-slate-950 overflow-hidden relative">
       <div className="flex gap-8 w-full max-w-4xl h-72">
          
          {/* Standard CPU Parsing */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-between opacity-50 relative">
             <h4 className="text-slate-400 font-bold text-center">Standard CPU (Software)</h4>
             <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-4 bg-blue-500/20 border border-blue-500 rounded"></div>
                <div className="w-8 h-4 bg-blue-500/20 border border-blue-500 rounded"></div>
                <div className="w-8 h-4 bg-blue-500/20 border border-blue-500 rounded"></div>
             </div>
             <ArrowDown className="w-6 h-6 text-slate-600" />
             <div className="w-32 h-24 bg-slate-800 rounded border border-slate-600 flex flex-col items-center justify-center p-2">
                <span className="text-xs text-slate-400 text-center">Interrupt Handler & Kernel Queue</span>
             </div>
             <ArrowDown className="w-6 h-6 text-slate-600" />
             <div className="w-24 h-24 bg-blue-900/50 rounded-full border border-blue-700 flex items-center justify-center">
                <span className="font-bold text-blue-300">CPU</span>
             </div>
          </div>

          {/* FPGA Hardware Parsing */}
          <div className="flex-1 bg-slate-900 border border-emerald-900/50 rounded-xl p-6 flex flex-col items-center justify-between relative shadow-[0_0_30px_rgba(16,185,129,0.1)]">
             <h4 className="text-emerald-400 font-bold text-center">FPGA (Hardware Acceleration)</h4>
             
             {/* Fast stream of packets */}
             <div className="absolute top-16 left-1/2 -translate-x-1/2 w-8 h-32 overflow-hidden flex flex-col items-center">
                <div className="w-8 h-8 bg-emerald-500 rounded animate-[slideDown_0.5s_linear_infinite] shadow-[0_0_15px_#10b981]"></div>
             </div>

             <div className="w-full flex-1"></div>

             <div className="w-48 h-32 bg-emerald-900/40 border-2 border-emerald-500 rounded-lg flex flex-col items-center justify-center p-4 shadow-[0_0_20px_rgba(16,185,129,0.3)] z-10 backdrop-blur-sm">
                <Activity className="w-8 h-8 text-emerald-400 mb-2" />
                <span className="font-bold text-emerald-300 text-center text-sm">Hardcoded Logic Gates<br/>(No OS)</span>
             </div>
          </div>

       </div>
       <style>{`
         @keyframes slideDown {
           0% { transform: translateY(-40px); opacity: 0; }
           50% { opacity: 1; }
           100% { transform: translateY(120px); opacity: 0; }
         }
       `}</style>
    </div>
  );


  let activeVisual;
  switch(step) {
    case 0: activeVisual = networkTopologyVisual; break;
    case 1: activeVisual = distanceLatencyVisual; break;
    case 2: activeVisual = fpgaVisual; break;
    default: activeVisual = networkTopologyVisual;
  }

  const visualContent = activeVisual;

  // --- Interaction Content: MCQ / Reading / Fill-in-blank / True-False ---
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
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-heading">
          {currentExercise.question}
        </h2>
      </div>

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

  const theoryContent = currentExercise.theory ? (
    <RoadmapTheoryBridge 
      item={{ 
        labId: 'cpp-hft-03', 
        exerciseTitle: currentExercise.question || currentExercise.title, 
        theory: currentExercise.theory 
      }} 
    />
  ) : (
    <div className="p-6 text-slate-500 italic">No specific theory mapped to this view.</div>
  );

  return (
    <RoadmapLayout
      title="Network Architecture"
      visualContent={visualContent}
      interactionContent={interactionContent}
      theoryContent={theoryContent}
      infoVisible={infoVisible}
      infoPlacement={infoPlacement}
      settings={settings}
    />
  );
};
