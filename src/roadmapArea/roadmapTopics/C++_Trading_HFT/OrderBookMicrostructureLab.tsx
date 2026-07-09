import React, { useState, useEffect } from 'react';
import { Exercise } from '../../roadmapSharedComponents/types';
import { 
  CheckCircle, 
  XCircle, 
  List, 
  ArrowRight,
  ArrowDown,
  TrendingUp,
  TrendingDown
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

export const OrderBookMicrostructureLab: React.FC<ChapterProps> = ({ 
  step, 
  exercises, 
  infoVisible, 
  infoPlacement, 
  settings 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Order Book State
  const initialAsks = [
    { price: 100.05, size: 500 },
    { price: 100.04, size: 1200 },
    { price: 100.03, size: 800 },
    { price: 100.02, size: 200 },
  ];
  
  const initialBids = [
    { price: 100.00, size: 300 },
    { price: 99.99, size: 1500 },
    { price: 99.98, size: 600 },
    { price: 99.97, size: 2500 },
  ];

  const [asks, setAsks] = useState([...initialAsks]);
  const [bids, setBids] = useState([...initialBids]);
  const [lastTrade, setLastTrade] = useState<{ price: number, type: 'buy'|'sell' } | null>(null);

  const currentExercise = exercises[step] || exercises[0];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setAsks([...initialAsks]);
    setBids([...initialBids]);
    setLastTrade(null);
  }, [step]);

  const handleMarketBuy = () => {
    if (asks.length === 0) return;
    const newAsks = [...asks];
    const topAsk = newAsks.pop()!; // Pop removes from end, so asks array is sorted highest to lowest, top of book is at the end
    
    // Simulate eating 100 shares
    if (topAsk.size > 100) {
      topAsk.size -= 100;
      newAsks.push(topAsk);
    }
    
    setAsks(newAsks);
    setLastTrade({ price: topAsk.price, type: 'buy' });
  };

  const handleMarketSell = () => {
    if (bids.length === 0) return;
    const newBids = [...bids];
    const topBid = newBids.shift()!; // Shift removes from start, bids array is sorted highest to lowest, top of book is at start
    
    // Simulate eating 100 shares
    if (topBid.size > 100) {
      topBid.size -= 100;
      newBids.unshift(topBid);
    }
    
    setBids(newBids);
    setLastTrade({ price: topBid.price, type: 'sell' });
  };

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

  const currentSpread = (asks.length > 0 && bids.length > 0) 
    ? (asks[asks.length-1].price - bids[0].price).toFixed(2)
    : "N/A";

  // --- Visual Component: Order Book ---
  const orderBookVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 bg-slate-950 rounded-xl border border-slate-800 shadow-2xl relative">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-xl">
        <div className="bg-slate-800/80 p-3 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-200">Limit Order Book</h3>
          </div>
          <span className="text-xs font-mono bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded">Spread: ${currentSpread}</span>
        </div>
        
        {/* Asks (Sell Orders) */}
        <div className="p-2 space-y-1">
          {asks.map((ask, i) => (
            <div key={`ask-${i}`} className="flex justify-between items-center text-sm font-mono px-3 py-1 rounded hover:bg-slate-800 relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-full bg-red-900/20" style={{ width: `${Math.min(100, (ask.size / 3000) * 100)}%` }}></div>
               <span className="text-red-400 z-10">${ask.price.toFixed(2)}</span>
               <span className="text-slate-400 z-10">{ask.size}</span>
            </div>
          ))}
        </div>

        {/* Spread Indicator */}
        <div className="py-2 border-y border-slate-800 bg-slate-900/50 flex justify-center items-center gap-4 text-xs">
           <div className="flex items-center gap-2">
             <span className="text-slate-500">Last Trade:</span>
             {lastTrade ? (
                <span className={`font-mono font-bold ${lastTrade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                  ${lastTrade.price.toFixed(2)} {lastTrade.type === 'buy' ? <TrendingUp className="inline w-3 h-3"/> : <TrendingDown className="inline w-3 h-3"/>}
                </span>
             ) : (
                <span className="text-slate-600 font-mono">--.--</span>
             )}
           </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="p-2 space-y-1">
          {bids.map((bid, i) => (
            <div key={`bid-${i}`} className="flex justify-between items-center text-sm font-mono px-3 py-1 rounded hover:bg-slate-800 relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-full bg-green-900/20" style={{ width: `${Math.min(100, (bid.size / 3000) * 100)}%` }}></div>
               <span className="text-green-400 z-10">${bid.price.toFixed(2)}</span>
               <span className="text-slate-400 z-10">{bid.size}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-4 w-full max-w-md">
        <button 
          onClick={handleMarketBuy}
          className="flex-1 py-3 bg-red-900/40 hover:bg-red-800/60 border border-red-800/50 text-red-300 rounded-lg text-sm font-bold transition-colors flex justify-center items-center gap-2"
        >
          Market Buy (Hit Ask)
        </button>
        <button 
          onClick={handleMarketSell}
          className="flex-1 py-3 bg-green-900/40 hover:bg-green-800/60 border border-green-800/50 text-green-300 rounded-lg text-sm font-bold transition-colors flex justify-center items-center gap-2"
        >
          Market Sell (Hit Bid)
        </button>
      </div>
    </div>
  );


  // --- New Bespoke Visuals ---
  const marketMakerVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-slate-950 overflow-hidden relative">
       <h3 className="text-xl font-bold text-slate-300 mb-12">Market Maker: Capturing the Spread</h3>
       
       <div className="flex items-center justify-center gap-8 w-full max-w-3xl">
          {/* Bid Side */}
          <div className="flex flex-col items-center gap-4">
             <div className="w-32 h-24 bg-green-900/40 border-2 border-green-500 rounded-lg flex flex-col items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                <span className="text-slate-400 text-xs uppercase tracking-wider">Post Bid (Buy)</span>
                <span className="text-green-400 font-mono text-2xl font-bold">$100.00</span>
             </div>
             <div className="h-16 w-1 bg-green-500/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-green-400 animate-[bounce_1s_infinite]"></div>
             </div>
          </div>

          {/* Market Maker Algorithm */}
          <div className="relative">
             <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
             <div className="w-40 h-40 bg-slate-900 border-2 border-indigo-500 rounded-full flex flex-col items-center justify-center relative z-10 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                <span className="text-indigo-300 font-bold text-center">HFT Market<br/>Maker</span>
                <div className="mt-2 px-3 py-1 bg-emerald-900/80 border border-emerald-500 rounded text-emerald-300 font-mono text-sm font-bold">
                   Profit: $0.02
                </div>
             </div>
          </div>

          {/* Ask Side */}
          <div className="flex flex-col items-center gap-4">
             <div className="w-32 h-24 bg-red-900/40 border-2 border-red-500 rounded-lg flex flex-col items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <span className="text-slate-400 text-xs uppercase tracking-wider">Post Ask (Sell)</span>
                <span className="text-red-400 font-mono text-2xl font-bold">$100.02</span>
             </div>
             <div className="h-16 w-1 bg-red-500/50 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-red-400 animate-[bounce_1s_infinite]"></div>
             </div>
          </div>
       </div>
    </div>
  );

  const marketOrderVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-slate-950 overflow-hidden relative">
       <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-8 relative">
          
          <div className="flex justify-between items-center mb-16">
             <div className="flex flex-col gap-2">
                <span className="text-slate-400 font-bold">Resting Limit Order</span>
                <div className="px-6 py-3 bg-red-900/40 border-2 border-red-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                   <span className="text-red-400 font-mono text-xl">Ask: $100.05</span>
                </div>
             </div>
          </div>

          {/* Market Order moving */}
          <div className="absolute top-1/2 left-8 transform -translate-y-1/2 animate-[slideRight_2s_ease-in-out_infinite]">
             <div className="flex items-center gap-3">
                <div className="px-6 py-3 bg-green-900/80 border-2 border-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                   <span className="text-green-300 font-bold">Aggressive Market Buy</span>
                </div>
                <ArrowRight className="w-6 h-6 text-green-400" />
             </div>
          </div>

          {/* Explosion / execution effect */}
          <div className="absolute top-1/2 right-12 transform -translate-y-1/2 translate-x-1/2 w-16 h-16 bg-yellow-500/20 rounded-full animate-[ping_2s_ease-in-out_infinite]"></div>

       </div>
       <style>{`
         @keyframes slideRight {
           0% { left: 2rem; opacity: 0; }
           20% { opacity: 1; }
           80% { left: calc(100% - 16rem); opacity: 1; transform: scale(1) translateY(-50%); }
           90% { left: calc(100% - 14rem); opacity: 0; transform: scale(1.2) translateY(-50%); }
           100% { opacity: 0; left: calc(100% - 14rem); }
         }
       `}</style>
    </div>
  );


  let activeVisual;
  switch(step) {
    case 0: activeVisual = orderBookVisual; break;
    case 1: activeVisual = marketMakerVisual; break;
    case 2: activeVisual = marketOrderVisual; break;
    default: activeVisual = orderBookVisual;
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
        labId: 'cpp-hft-02', 
        exerciseTitle: currentExercise.question || currentExercise.title, 
        theory: currentExercise.theory 
      }} 
    />
  ) : (
    <div className="p-6 text-slate-500 italic">No specific theory mapped to this view.</div>
  );

  return (
    <RoadmapLayout
      title="Market Microstructure"
      visualContent={visualContent}
      interactionContent={interactionContent}
      theoryContent={theoryContent}
      infoVisible={infoVisible}
      infoPlacement={infoPlacement}
      settings={settings}
    />
  );
};
