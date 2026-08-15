import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Scale, Sparkles, ShieldCheck, Check, DollarSign } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const DoubleEntryReconciliationActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [balanceTilt, setBalanceTilt] = useState(0); // 0 = perfectly level

  const entries = [
    { id: "JE-01", account: "Accounts Receivable (EUR)", debit: 10500, credit: 0, verified: true },
    { id: "JE-02", account: "Cash - Silicon Valley Bank", debit: 11000, credit: 0, verified: true },
    { id: "JE-03", account: "Realized FX Gain", debit: 0, credit: 500, verified: true }
  ];

  const handleReconcile = () => {
    setIsReconciling(true);
    setBalanceTilt(8); // simulate initial wobble
    toast.info("Reconciling multi-currency general ledger invariants...");

    setTimeout(() => {
      setBalanceTilt(-4);
      setTimeout(() => {
        setBalanceTilt(0);
        setIsReconciling(false);
        toast.success("Ledger Balanced! Debits = Credits = $11,000.00 USD (Invariant Verified).");
      }, 400);
    }, 500);
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
      toast.success("Correct Double-Entry Reconciliation entry!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect journal balancing. Verify AR clearing and FX gain lines.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'easy');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || 'Multi-Currency Double-Entry Ledger Reconciliation'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                BALANCE INVARIANT
              </span>
            </h2>
            <p className="text-xs text-slate-400">Agentic Accountant • Day 1 Mission • EUR/USD Spot Settlement</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleReconcile}
            disabled={isReconciling}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
            {isReconciling ? 'Balancing...' : 'Run Auto-Reconciler'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Animated Balance Scale & Journal Lines (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Animated SVG Balance Scale HUD */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-xl text-center space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
              <span className="font-mono text-slate-400">Double-Entry Balance Equilibrium Scale</span>
              <span className="text-emerald-400 font-mono font-bold">DEBITS = CREDITS = $11,000</span>
            </div>

            <div className="h-[120px] flex items-center justify-center relative">
              <svg className="w-64 h-24" viewBox="0 0 240 90">
                {/* Stand Pillar */}
                <rect x="116" y="20" width="8" height="60" fill="#475569" rx="2" />
                <rect x="90" y="76" width="60" height="8" fill="#334155" rx="3" />
                <circle cx="120" cy="20" r="6" fill="#F59E0B" />

                {/* Rotating Beam */}
                <g
                  style={{
                    transformOrigin: '120px 20px',
                    transform: `rotate(${balanceTilt}deg)`,
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <rect x="30" y="18" width="180" height="4" fill="#F59E0B" rx="2" />
                  {/* Left Pan (Debits) */}
                  <line x1="45" y1="20" x2="45" y2="48" stroke="#F59E0B" strokeWidth="1.5" />
                  <path d="M 25,48 Q 45,58 65,48 Z" fill="#059669" />
                  {/* Right Pan (Credits) */}
                  <line x1="195" y1="20" x2="195" y2="48" stroke="#F59E0B" strokeWidth="1.5" />
                  <path d="M 175,48 Q 195,58 215,48 Z" fill="#06B6D4" />
                </g>
              </svg>
            </div>
          </div>

          {/* Journal Entries List */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-2 shadow-xl">
            <div className="text-slate-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>General Ledger Journal Entries</span>
              <span className="text-amber-400">Base: USD</span>
            </div>
            {entries.map((entry) => (
              <div key={entry.id} className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-mono text-slate-500 text-[10px]">{entry.id}</span>
                  <div className="text-white font-medium">{entry.account}</div>
                </div>
                <div className="flex items-center gap-4 font-mono text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">DEBIT</span>
                    <span className={entry.debit > 0 ? "text-emerald-400 font-bold" : "text-slate-600"}>
                      ${entry.debit.toLocaleString()}.00
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">CREDIT</span>
                    <span className={entry.credit > 0 ? "text-cyan-400 font-bold" : "text-slate-600"}>
                      ${entry.credit.toLocaleString()}.00
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Ledger Balancing Strategy
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-amber-500 bg-amber-500/15 text-amber-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-amber-500 bg-amber-500/10 text-white font-semibold';
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
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-amber-950/30 border-amber-800 text-amber-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select reconciliation entry</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Post Entry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubleEntryReconciliationActivity;
