import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Percent, Sparkles, ShieldCheck, Tag } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const CartAbandonmentAgentActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const funnel = (currentExercise?.roleSpecificData as any)?.data?.cartAbandonmentFunnel || {
    intentScore: 0.88,
    cartValue: 185.00,
    timeIdleSeconds: 90,
    triggeredIncentivePct: 8.1,
    predictedConversionLift: 34.2
  };

  const handleEvaluate = () => {
    setIsEvaluating(true);
    toast.info("Scoring cart exit propensity vs customer lifetime value...");
    setTimeout(() => {
      setIsEvaluating(false);
      toast.success("Intent Score: 0.88 • Friction Point: Shipping Step • Recommended Incentive: Free Shipping ($15).");
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
      toast.success("Correct Intent-Weighted Discount trigger!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect incentive. Excessive discounting cannibalizes profit margin.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'medium');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <Percent className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {currentExercise?.title || 'Predictive Cart Abandonment & Triggered Incentives'}
            </h2>
            <p className="text-xs text-slate-400">Agentic Commerce Analyst • Day 3 Mission</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
            {isEvaluating ? 'Evaluating...' : 'Score Cart Intent'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-3">
            <div className="text-slate-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Checkout Funnel Telemetry & Exit Risk</span>
              <span className="text-rose-400 font-bold">CART: ${funnel.cartValue.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">INTENT SCORE</span>
                <span className="text-lg font-bold text-emerald-400">{(funnel.intentScore * 100).toFixed(0)}%</span>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">IDLE ON SHIPPING</span>
                <span className="text-lg font-bold text-amber-400">{funnel.timeIdleSeconds}s</span>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">PREDICTED LIFT</span>
                <span className="text-lg font-bold text-rose-400">+{funnel.predictedConversionLift}%</span>
              </div>
            </div>

            <div className="p-3 rounded bg-slate-900 border border-slate-800 text-[11px] space-y-1">
              <span className="text-slate-400 font-bold">Friction Diagnosis:</span>
              <p className="text-slate-300">
                User hesitating specifically on the $15.00 shipping calculation step. Absorbing $15 preserves $170 in merchandise margin vs a $92.50 discount slash.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Incentive Dispatch Strategy
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select incentive policy</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Dispatch Trigger
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartAbandonmentAgentActivity;
