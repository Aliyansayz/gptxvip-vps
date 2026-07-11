import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircle, XCircle, Activity, Terminal, ChevronRight, TrendingDown } from 'lucide-react';
import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import { DevLushLayout } from '../../devLushTopicsView/DevLushLayout';
import SaveTheoryButton from '../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';
import { DevLushTheoryBridge } from '../../devLushTopicsView/DevLushTheoryBridge';
import { motion, AnimatePresence } from 'framer-motion';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

const LiveStockChart: React.FC<{ isRunning: boolean; currentPrice: number; hasCrashed: boolean }> = ({ isRunning, currentPrice, hasCrashed }) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      if (isRunning) {
        setAnimationProgress(prev => (prev + 1) % 400);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    if (isRunning) {
      animationFrameId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning]);

  const generatePath = () => {
    const points: string[] = [];
    let y = 50;
    for (let i = 0; i < 400; i++) {
      const x = i;
      // Normal variation
      let variation = Math.sin((i + animationProgress) * 0.1) * 5 + Math.cos((i + animationProgress) * 0.05) * 3;

      if (hasCrashed && i > 250) {
        // Flash crash downward trend
        variation += (i - 250) * 1.5;
      } else if (!hasCrashed) {
        // Slight upward trend normally
        variation -= i * 0.05;
      }

      const plottedY = Math.min(Math.max(50 + variation, 10), 110);
      points.push(`${x},${plottedY}`);
    }
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="relative h-24 w-full bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:20px_20px] rounded-lg overflow-hidden border border-gray-800">
      <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
        <path
          d={generatePath()}
          fill="none"
          stroke={hasCrashed ? "#ef4444" : "#22c55e"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 4px ${hasCrashed ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)'})` }}
        />
      </svg>
      {hasCrashed && (
        <div className="absolute inset-0 bg-red-900/10 pointer-events-none animate-pulse" />
      )}
    </div>
  );
};

const TradingSwarmAnalogy: React.FC = () => (
  <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
    <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider flex items-center gap-2">
      <Activity className="w-4 h-4 text-rose-500" /> Analogy: Swarm Intelligence
    </h5>
    <svg viewBox="0 0 200 100" className="w-full h-32">
      {/* The Asset/Food Source */}
      <circle cx="100" cy="50" r="10" fill="#fbbf24" stroke="#d97706" strokeWidth="2" className="animate-pulse" />

      {/* Swarm Agents (Fish/Bees) */}
      <g className="animate-spin-slow" style={{ transformOrigin: '100px 50px' }}>
        <path d="M 60 50 L 50 45 L 50 55 Z" fill="#3b82f6" opacity="0.8" />
        <path d="M 70 30 L 60 25 L 60 35 Z" fill="#3b82f6" opacity="0.8" />
        <path d="M 140 50 L 150 45 L 150 55 Z" fill="#ef4444" opacity="0.8" /> {/* Divergent agent */}
        <path d="M 130 70 L 140 65 L 140 75 Z" fill="#3b82f6" opacity="0.8" />
        <path d="M 90 20 L 85 10 L 95 10 Z" fill="#3b82f6" opacity="0.8" />
        <path d="M 110 80 L 105 90 L 115 90 Z" fill="#3b82f6" opacity="0.8" />
      </g>

      {/* Attack vector / Panic sell */}
      <path d="M 100 50 L 180 90" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" className="animate-pulse" />
      <circle cx="180" cy="90" r="4" fill="#ef4444" />

      <text x="100" y="95" textAnchor="middle" fontSize="8" fill="currentColor" className="text-slate-500">Simultaneous flocking causes liquidity drain</text>
    </svg>
  </div>
);

const AlgoTradingActivity: React.FC<ChapterProps> = ({
  step,
  exercises,
  infoVisible,
  infoPlacement,
  settings
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [tradingLogs, setTradingLogs] = useState<string[]>([]);
  const [price, setPrice] = useState(150.00);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    resetSimulator();
  }, [step]);

  const resetSimulator = () => {
    setIsRunning(false);
    setPrice(150.00);
    setTradingLogs([
      "EXCHANGE_ENGINE: System initialized. Market open.",
      "ALGO_CLUSTER: 50 independent reinforcement learning agents connected.",
      "Awaiting market volume triggers..."
    ]);
  };

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setTradingLogs([]);
    setPrice(150.00);

    const logChain = [
      { text: "MARKET_EVENT: Minor negative earnings report (-2% deviation).", delay: 0, price: 147.00 },
      { text: "AGENT_01: Sell condition triggered. Executing block order.", delay: 800, price: 146.50 },
      { text: "ALGO_CLUSTER: Downward momentum detected by 49 remaining agents.", delay: 1600, price: 145.00 },
      { text: "CRITICAL: Simultaneous identical sell orders submitted! Liquidity draining.", delay: 2400, price: 110.00, error: true },
      { text: "SYSTEM: Price flash crash! Circuit breakers engaged. Trading halted.", delay: 3200, price: 82.50, error: true }
    ];

    logChain.forEach((item) => {
      setTimeout(() => {
        setTradingLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${item.text}`]);
        setPrice(item.price);
        if (item.error) {
          toast.error("Market anomaly detected: Flash Crash");
        }
      }, item.delay);
    });

    setTimeout(() => {
      setIsRunning(false);
    }, 4000);
  };

  const checkAnswer = () => {
    if (!selectedAnswer) {
      toast.error("Please select an option before continuing.");
      return;
    }
    const correct = selectedAnswer === question?.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      toast.success("Correct analysis! Excellent work.");
    } else {
      toast.error("Incorrect theory alignment. Read the explanation.");
    }
  };

  const visualContent = (
    <div className="w-full flex flex-col gap-4">
      <div className="bg-gray-950 p-6 rounded-lg border border-gray-800 text-gray-300 shadow-sm relative overflow-hidden font-mono">
        <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-rose-500">
            <Activity className="w-5 h-5" />
            <span className="text-xs font-bold tracking-widest uppercase">HFT_Trading_Sandbox</span>
          </div>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-rose-900/30 hover:bg-rose-900/50 text-rose-400 border border-rose-800/50 rounded transition-all"
          >
            {isRunning ? (
              <TrendingDown className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            {isRunning ? 'SIMULATING...' : 'TRIGGER MARKET EVENT'}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="p-4 bg-black border border-gray-800 rounded-lg flex flex-col relative overflow-hidden transition-colors duration-500">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-2 text-left border-b border-gray-800 pb-2">Asset Price (Ticker: HFTX)</span>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between items-end">
                <div className="flex items-end gap-1">
                  <span className="text-sm text-gray-600">$</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={price}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-3xl font-mono flex items-center gap-2 ${price < 100 ? 'text-rose-500 font-bold bg-rose-950/30 px-2 rounded' : 'text-emerald-500'}`}
                    >
                      {price < 100 && <TrendingDown className="w-6 h-6 text-rose-500" />}
                      {price.toFixed(2)}
                    </motion.span>
                  </AnimatePresence>
                </div>
                {price < 100 && (
                  <span className="text-xs font-bold text-rose-500 border border-rose-500 px-2 py-1 rounded bg-rose-950/20 animate-pulse">
                    CIRCUIT BREAKER HALT
                  </span>
                )}
              </div>

              {/* Dynamic SVG Stock Chart */}
              <LiveStockChart isRunning={isRunning} currentPrice={price} hasCrashed={price < 100} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black p-4 rounded-lg border border-gray-800 flex-1 min-h-[160px] max-h-[180px] overflow-y-auto font-mono text-xs text-rose-500 space-y-2 custom-scrollbar">
        <div className="opacity-50 mb-2">root@hft-engine:~# ./start_agents.sh</div>
        <AnimatePresence>
          {tradingLogs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`leading-relaxed flex gap-2 ${log.includes("CRITICAL") || log.includes("SYSTEM") ? "text-rose-400 font-bold bg-rose-950/20 p-1 border-l-2 border-rose-500" : ""}`}
            >
              <span className="text-gray-600 shrink-0">&gt;</span>
              <span>{log}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {isRunning && (
          <div className="flex items-center gap-2 text-rose-400/50 text-[11px] mt-2">
            <span className="w-2 h-3 bg-rose-500 animate-pulse"></span>
            <span>Parsing order book streams...</span>
          </div>
        )}
      </div>
    </div>
  );

  const interactionContent = (
    <div className="gap-4">
      <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Question:</h3>
        <p className="text-slate-700 dark:text-slate-300 text-sm">{question.question}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {question.options.map((opt, i) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={i}
              onClick={() => {
                if (showResult) return;
                setSelectedAnswer(opt);
              }}
              disabled={showResult}
              className={`text-left p-4 rounded-xl border font-sans text-sm font-medium transition-all duration-200 ${showResult ? (opt === question.answer ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' : isSelected ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-400 text-rose-700 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-65') : isSelected ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-700 dark:text-indigo-400 scale-[1.01]' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isSelected ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 leading-snug">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center gap-4 pt-2 mt-4">
        <button
          onClick={resetSimulator}
          className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline"
        >
          Reset Simulation
        </button>

        {!showResult ? (
          <button
            onClick={checkAnswer}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            Verify Analysis
          </button>
        ) : (
          <div className="flex items-center gap-2 animate-in fade-in">
            {isCorrect ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/30">
                <CheckCircle className="w-4 h-4" /> Correct Analysis
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-bold text-sm flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/20 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/30">
                <XCircle className="w-4 h-4" /> Try Reviewing Theory
              </span>
            )}
          </div>
        )}
      </div>

      {showResult && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-4 animate-in fade-in slide-in-from-top-2">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Interactive Review:</p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );

  const theoryContent = (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={question.theory || question} />
      </div>
      <div className="flex-1">
        <div className="flex flex-col h-full gap-4">
          <DevLushTheoryBridge item={{ labId: 'finance-agents-algo', exerciseTitle: question.title, theory: question.theory }} />
          <TradingSwarmAnalogy />
        </div>
      </div>
    </div>
  );

  return (
    <DevLushLayout
      title={question.title}
      prompt={question.prompt}
      visualContent={visualContent}
      interactionContent={interactionContent}
      theoryContent={theoryContent}
      infoVisible={infoVisible}
      infoPlacement={infoPlacement}
      settings={settings}
    />
  );
};

export default AlgoTradingActivity;
