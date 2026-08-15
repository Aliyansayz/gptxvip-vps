import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Globe, Sparkles, ShieldCheck, Truck, Check } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const CrossBorderSurchargeActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRouting, setIsRouting] = useState(false);

  const handleRoute = () => {
    setIsRouting(true);
    toast.info("Calculating landed cost, preferential trade tariffs, and multi-hub freight...");
    setTimeout(() => {
      setIsRouting(false);
      toast.success("UK-Hub Selected: $12 freight + 0% tariff ($12.00 total) vs US-East ($32.40 total). Saved $20.40/unit!");
    }, 1000);
  };

  const handleVerify = () => {
    if (!selectedOption) {
      toast.error("Please choose a candidate response.");
      return;
    }
    const correct = selectedOption === currentExercise.answer;
    setIsCorrect(correct);
    setIsEvaluated(true);
    if (correct) {
      toast.success("Correct Multi-Warehouse Tariff Optimization decision!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect routing. Delivering DDU creates high customer package refusal rates.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'hard');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <Globe className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {currentExercise?.title || 'Cross-Border Tariffs & Dynamic Landed Cost Routing'}
            </h2>
            <p className="text-xs text-slate-400">Agentic Commerce Analyst • Day 5 Capstone Mission</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleRoute}
            disabled={isRouting}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isRouting ? 'animate-spin' : ''}`} />
            {isRouting ? 'Routing...' : 'Optimize Landed Cost'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-3">
            <div className="text-slate-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Destination: Munich, Germany (Order #DE-88392)</span>
              <span className="text-emerald-400 font-bold">DDP GUARANTEED</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold">Route A: US-East 3PL</div>
                <div className="text-xs text-slate-300">Freight: $18.00</div>
                <div className="text-xs text-rose-400 font-bold">EU Import Tariff: +$14.40 (12%)</div>
                <div className="pt-1 text-slate-500 text-[10px] border-t border-slate-800">Total: $32.40 • Transit: 6-9 Days</div>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-emerald-500/40 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Route B: UK-Hub 3PL
                </div>
                <div className="text-xs text-slate-300">Freight: $12.00</div>
                <div className="text-xs text-emerald-400 font-bold">Preferential Tariff: $0.00 (0%)</div>
                <div className="pt-1 text-emerald-500 text-[10px] border-t border-slate-800">Total: $12.00 • Transit: 2 Days</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Global Trade Fulfillment
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-rose-500 bg-rose-500/15 text-rose-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-rose-500 bg-rose-500/10 text-white font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isEvaluated}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${style}`}
                    >
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isEvaluated && (
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-rose-950/30 border-rose-800 text-rose-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
                  <p className="font-semibold mb-1">{isCorrect ? 'Analysis Confirmed:' : 'Evaluation:'}</p>
                  <p className="text-slate-300 text-[11px]">{currentExercise.explanation}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {isEvaluated ? (
                <button
                  onClick={() => { setIsEvaluated(false); setSelectedOption(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              ) : <div className="text-[11px] text-slate-500 font-mono">Select fulfillment routing</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Dispatch Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossBorderSurchargeActivity;
