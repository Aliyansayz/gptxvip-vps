import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import {
  CheckCircle,
  XCircle,
  Database,
  ShoppingBag,
  RefreshCw,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Coins,
  Clock,
  Unlock,
  Lock,
  Tag,
  MessageCircleQuestion,
  Truck
} from 'lucide-react';
import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import { DevLushLayout } from '../../devLushTopicsView/DevLushLayout';
import SaveTheoryButton from '../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';
import { DevLushTheoryBridge } from '../../devLushTopicsView/DevLushTheoryBridge';
import { motion } from 'motion/react';

const CheckoutRaceVisual: React.FC<{ isRunning: boolean; lockingEnabled: boolean; transactions: string[]; stock: number }> = ({ isRunning, lockingEnabled, transactions, stock }) => {
  return (
    <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full relative overflow-hidden">
      {/* Background illustrative elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <h5 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider relative z-10">
        Analogy: Multi-Agent Transaction Race
      </h5>
      <div className="relative w-full h-[320px] bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center p-4">

        {/* Decorative Sandbox Agents */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-8 z-0">
          <div className="flex flex-col items-center opacity-60">
            <div className="w-10 h-10 bg-amber-900/40 border border-amber-500/50 rounded-full flex items-center justify-center text-amber-400 mb-1">
              <Tag className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-amber-500/70 uppercase">Promotion</span>
          </div>
          <div className="flex flex-col items-center opacity-60">
            <div className="w-10 h-10 bg-sky-900/40 border border-sky-500/50 rounded-full flex items-center justify-center text-sky-400 mb-1">
              <MessageCircleQuestion className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-sky-500/70 uppercase">Customer FAQs</span>
          </div>
          <div className="flex flex-col items-center opacity-60">
            <div className="w-10 h-10 bg-emerald-900/40 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-400 mb-1">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-emerald-500/70 uppercase">Delivery</span>
          </div>
        </div>

        {/* Database Box */}
        <div className="absolute right-10 flex flex-col items-center">
          <div className={`w-28 h-28 rounded-lg flex items-center justify-center border-4 relative z-10 ${stock < 0 ? 'bg-rose-950/50 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]' : 'bg-emerald-950/50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]'}`}>
            <Database className={`w-12 h-12 ${stock < 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
            {lockingEnabled && isRunning && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5, type: 'spring' }}
                className="absolute -left-8 top-1/2 -translate-y-1/2 bg-amber-500 text-amber-950 px-2 py-1.5 rounded-md font-bold text-[10px] shadow-lg border border-amber-300 z-20 flex items-center gap-1 whitespace-nowrap"
              >
                <Lock className="w-3 h-3" /> ADVISORY LOCK
              </motion.div>
            )}
          </div>
          <div className="mt-3 font-mono font-bold text-sm text-slate-300">DB: Inventory</div>
          <div className={`font-mono text-xl font-bold ${stock < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{stock} Units</div>
        </div>

        {/* Agents */}
        <div className="absolute left-8 top-1/3 flex flex-col items-center">
          <div className="text-[10px] font-bold text-indigo-400/70 mb-1 uppercase tracking-wider">Checkout Agent 1</div>
          <div className="w-14 h-14 bg-indigo-900/60 border-2 border-indigo-500 rounded-full flex items-center justify-center text-indigo-300 relative shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <ShoppingBag className="w-6 h-6 text-indigo-400" />
            {isRunning && (
              <motion.div
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 300, opacity: [1, 1, 0] }}
                transition={{ duration: 2, ease: "linear", delay: 0 }}
                className="absolute w-5 h-5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.9)] z-0 flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="absolute left-8 bottom-1/4 flex flex-col items-center">
          <div className="text-[10px] font-bold text-purple-400/70 mb-1 uppercase tracking-wider">Checkout Agent 2</div>
          <div className="w-14 h-14 bg-purple-900/60 border-2 border-purple-500 rounded-full flex items-center justify-center text-purple-300 relative shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <ShoppingBag className="w-6 h-6 text-purple-400" />
            {isRunning && (
              <motion.div
                initial={{ x: 0, opacity: 1 }}
                animate={lockingEnabled ? { x: 220, opacity: [1, 1, 0] } : { x: 300, opacity: [1, 1, 0] }}
                transition={{ duration: 2, ease: "linear", delay: 0.5 }}
                className="absolute w-5 h-5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.9)] z-0 flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </motion.div>
            )}
          </div>
        </div>

        {stock < 0 && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute z-50 px-5 py-3 bg-rose-500 text-white font-bold rounded-lg border-2 border-white shadow-2xl flex items-center gap-2 text-sm"
          >
            <AlertTriangle className="w-6 h-6" />
            RACE CONDITION EXPLOITED! (OVERSOLD)
          </motion.div>
        )}
      </div>
    </div>
  );
};

const PricingSpiralVisual: React.FC<{ price: number; isRunning: boolean }> = ({ price, isRunning }) => {
  const percentage = Math.max(0, Math.min(100, (price / 120) * 100));

  return (
    <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full relative overflow-hidden">
      {/* Background illustrative elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots)" />
        </svg>
      </div>

      <h5 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider relative z-10">
        Analogy: Pricing Spiral Cascade
      </h5>
      <div className="relative w-full h-[320px] bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center p-6 gap-12 overflow-hidden">

        {/* Sandbox Agents in background */}
        <div className="absolute top-4 right-8 flex gap-6 z-0">
          <div className="flex flex-col items-center opacity-60">
            <div className="w-10 h-10 bg-amber-900/40 border border-amber-500/50 rounded-full flex items-center justify-center text-amber-400 mb-1">
              <Tag className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-amber-500/70 uppercase">Promotion Agent</span>
          </div>
          <div className="flex flex-col items-center opacity-60">
            <div className="w-10 h-10 bg-emerald-900/40 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-400 mb-1">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-emerald-500/70 uppercase">Revenue Agent</span>
          </div>
        </div>

        {/* Thermometer / Gauge */}
        <div className="relative w-20 h-[240px] bg-slate-950 rounded-full border-4 border-slate-800 p-1.5 flex flex-col justify-end overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-10">
          {/* Margin Floor line */}
          <div className="absolute bottom-[30%] left-0 w-full h-1 bg-rose-500 z-20 shadow-[0_0_15px_rgba(244,63,94,1)]"></div>
          <div className="absolute bottom-[28%] -right-10 text-[10px] font-bold text-rose-400 uppercase bg-rose-950/80 px-2 py-1 rounded border border-rose-500/50 shadow-lg backdrop-blur-sm z-30">Margin Floor</div>

          {/* Liquid */}
          <motion.div
            className="w-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-indigo-400 rounded-full relative z-10 shadow-[0_0_20px_rgba(99,102,241,0.6)]"
            animate={{ height: `${percentage}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          />
        </div>

        <div className="flex flex-col gap-6 z-10">
          <div className="bg-slate-950/80 backdrop-blur-md p-5 rounded-2xl border-2 border-slate-800 flex items-center gap-5 min-w-[220px] shadow-xl">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${price < 40 ? 'bg-rose-900/50 border-rose-500 text-rose-400 animate-pulse' : 'bg-indigo-900/50 border-indigo-500 text-indigo-400'} border`}>
              {price < 40 ? <AlertTriangle className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Price</div>
              <div className={`text-4xl font-mono font-bold ${price < 40 ? 'text-rose-400' : 'text-white'}`}>${price.toFixed(2)}</div>
            </div>
          </div>

          <div className="text-sm text-slate-300 max-w-[220px] leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
            {price < 40 ?
              <span className="text-rose-400 font-bold flex items-start gap-2"><AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> HARD STOP: Floor reached, preventing margin loss.</span> :
              <span className="flex items-start gap-2"><RefreshCw className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400 animate-spin-slow" /> Agents recursively undercut each other to win the auction.</span>
            }
          </div>
        </div>
      </div>
    </div>
  );
};


interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const MultiAgentCheckoutFlow: React.FC<ChapterProps> = ({
  step,
  exercises,
  infoVisible,
  infoPlacement,
  settings
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Sim states
  const [isRunning, setIsRunning] = useState(false);
  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState(120.00);
  const [transactions, setTransactions] = useState<string[]>([]);
  const [lockingEnabled, setLockingEnabled] = useState(false);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    resetSimulator();
  }, [step]);

  const resetSimulator = () => {
    setIsRunning(false);
    if (step === 0) {
      setStock(1);
      setTransactions([
        "INVENTORY: 'AI Smart Watch' - Stock remaining: 1 unit.",
        "SYSTEM: Dynamic checkout queue initialized.",
        "Ready to simulate distributed purchases."
      ]);
    } else {
      setPrice(120.00);
      setTransactions([
        "MERCHANT A: Dynamic Pricing active. Formula: [Competitor Price - 2%].",
        "MERCHANT B: Dynamic Pricing active. Formula: [Competitor Price - 2%].",
        "Ready to run autonomous pricing loops."
      ]);
    }
  };

  const runCheckoutSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setTransactions([]);

    if (step === 0) {
      // Race condition simulation
      const logChain = [
        { text: "PROCUREMENT_AGENT_1: Checking stock availability for 'AI Smart Watch'...", delay: 0 },
        { text: "PROCUREMENT_AGENT_2: Checking stock availability for 'AI Smart Watch'...", delay: 500 },
        { text: "PROCUREMENT_AGENT_1: Stock balance read as: 1 unit.", delay: 1000 },
        { text: "PROCUREMENT_AGENT_2: Stock balance read as: 1 unit (STALE READ).", delay: 1500 },
        { text: "PROCUREMENT_AGENT_1: Submitting order checkout request. stock=0", delay: 2000, updateStock: 0 },
        { text: "PROCUREMENT_AGENT_2: Submitting order checkout request.", delay: 2500 },
        { text: lockingEnabled ? "SYSTEM LOCK: Procurement Agent 2 blocked. Optimistic record lock hit!" : "CRITICAL: Race condition detected! stock=-1 (OVERSOLD MISMATCH!)", delay: 3200, error: !lockingEnabled, ok: lockingEnabled }
      ];

      logChain.forEach((item) => {
        setTimeout(() => {
          setTransactions(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${item.text}`]);
          if (item.updateStock !== undefined) {
            setStock(item.updateStock);
          }
          if (item.error) {
            setStock(-1);
            toast.error("Oversold inventory! Parallel transaction state collision occurred.");
          }
          if (item.ok) {
            toast.success("Database record locking protected stock integrity!");
          }
        }, item.delay);
      });

      setTimeout(() => {
        setIsRunning(false);
      }, 4000);

    } else {
      // Competing price war cascade simulation
      let currentPrice = 120.00;
      let count = 0;
      const interval = setInterval(() => {
        if (count < 8) {
          const discount = currentPrice * 0.15; // accelerated pricing decay
          currentPrice = Math.max(38.50, Number((currentPrice - discount).toFixed(2))); // Hard floor around $38.50
          setPrice(currentPrice);

          const merchant = count % 2 === 0 ? "MERCHANT A" : "MERCHANT B";
          setTransactions(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] ${merchant}: Detected rival discount. Recalculated price to $${currentPrice}`
          ]);
          if (currentPrice <= 38.50) {
            clearInterval(interval);
            setTransactions(prev => [
              ...prev,
              `[${new Date().toLocaleTimeString()}] HARD FLOOR REACHED: Safe margin boundaries prevented price drop below $38.50.`
            ]);
            setIsRunning(false);
            toast.success("Dynamic pricing cascade safely halted by margin floor!");
            return;
          }
          count++;
        } else {
          clearInterval(interval);
          setTransactions(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] CRITICAL: Competing dynamic loops escalated. Asset value crashed to $0.01.`
          ]);
          setIsRunning(false);
          toast.warning("Dynamic pricing cascade hit rock bottom!");
        }
      }, 600);
    }
  };

  const checkAnswer = () => {
    if (!selectedAnswer) {
      toast.error("Please select an option before continuing.");
      return;
    }
    const correct = selectedAnswer === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      toast.success("Correct analysis! Excellent work.");
    } else {
      toast.error("Incorrect theory alignment. Read the explanation.");
    }
  };

  const visualContent = (
    <div className="w-full flex flex-col space-y-4">
      {/* Simulation dashboard */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-500" />
            <span className="font-mono text-xs font-bold tracking-widest text-indigo-500 uppercase">Ecom_Logistics_Module</span>
          </div>
          <button
            onClick={runCheckoutSimulation}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            Run Checkout Loop
          </button>
        </div>

        {/* Tactical Displays */}
        {step === 0 ? (
          <div className="flex flex-col gap-4">
            <CheckoutRaceVisual isRunning={isRunning} lockingEnabled={lockingEnabled} transactions={transactions} stock={stock} />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Stock Ledger</span>
                <span className={`text-2xl font-mono font-bold ${stock < 0 ? 'text-rose-500' : stock === 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {stock} unit
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Safety Lock</span>
                <button
                  onClick={() => {
                    if (isRunning) return;
                    setLockingEnabled(!lockingEnabled);
                  }}
                  disabled={isRunning}
                  className={`p-1 px-3 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${lockingEnabled ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-transparent'}`}
                >
                  {lockingEnabled ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  {lockingEnabled ? 'ENABLED' : 'UNLOCKED'}
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Distributed Lag</span>
                <span className="text-sm font-mono font-bold text-indigo-500 flex items-center justify-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5 animate-pulse" /> 500ms API Lag
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <PricingSpiralVisual price={price} isRunning={isRunning} />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 relative">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Catalog Value</span>
                <span className={`text-2xl font-mono font-bold ${price <= 40 ? 'text-rose-500 animate-pulse' : 'text-indigo-500'}`}>
                  ${price.toFixed(2)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">War Progression</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {price < 120 ? (
                    <TrendingDown className="w-5 h-5 text-rose-500 animate-bounce" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  )}
                  <span className="text-xs font-bold font-mono">Feedback Loop</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Logs console */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex-1 min-h-[160px] max-h-[180px] overflow-y-auto font-mono text-xs text-slate-300 space-y-1 custom-scrollbar">
        {transactions.map((t, idx) => (
          <div key={idx} className={`leading-relaxed border-l-2 pl-2 ${t.includes("CRITICAL") || t.includes("OVERSOLD") ? "border-rose-500 text-rose-400 font-bold" : t.includes("LOCK") ? "border-emerald-500 text-emerald-400" : "border-slate-800"}`}>
            {t}
          </div>
        ))}
        {isRunning && (
          <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] animate-pulse">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
            <span>Simulating distributed actor transactions...</span>
          </div>
        )}
      </div>
    </div>
  );

  const interactionContent = (
    <div className="space-y-4">
            {question?.question && (
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          {question.question}
        </h4>
      )}
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

      <div className="flex justify-between items-center gap-4 pt-2">
        <button
          onClick={resetSimulator}
          className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline"
        >
          Reset Grid
        </button>

        {!showResult ? (
          <button
            onClick={checkAnswer}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
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
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-2">
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
        <DevLushTheoryBridge item={{ labId: 'ecommerce', exerciseTitle: question.title, theory: question.theory }} />
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

export default MultiAgentCheckoutFlow;
