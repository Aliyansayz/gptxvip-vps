import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Cpu, Sparkles, ShieldCheck, Bug, Check } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const DecimalPrecisionAuditActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAudit = () => {
    setIsAuditing(true);
    toast.info("Auditing IEEE-754 binary floating-point drift across micro-billing rows...");
    setTimeout(() => {
      setIsAuditing(false);
      toast.error("Float Drift Detected: 10M requests * $0.00035 = -$420.18 accumulated bank variance!");
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
      toast.success("Correct Decimal Precision architecture fix!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect fix. IEEE-754 floats cannot represent decimal fractions exactly.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'hard');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <Cpu className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {currentExercise?.title || 'Decimal Precision & Floating-Point Leakage Audit'}
            </h2>
            <p className="text-xs text-slate-400">Agentic Accountant • Day 4 Mission</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Auditing...' : 'Audit Float Math'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-3">
            <div className="text-slate-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>IEEE-754 vs Arbitrary Precision Comparison</span>
              <span className="text-rose-400 font-bold">DRIFT: -$420.18</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-rose-400 font-bold flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Unsafe Schema: `unit_price FLOAT4`
                </div>
                <div className="text-slate-400 text-[11px]">
                  0.1 + 0.2 = 0.30000000000000004 (Binary Representation Flaw)
                </div>
                <div className="text-slate-500 text-[10px]">
                  10,000,000 requests computed total: $3,499,579.82 (Bank expected: $3,500,000.00)
                </div>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-emerald-500/30 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Remediated Schema: `unit_price NUMERIC(18, 6)`
                </div>
                <div className="text-slate-300 text-[11px]">
                  Exact integer micro-cent arithmetic with Banker's Rounding (Round-Half-to-Even)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Precision Remediation
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select architecture fix</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Deploy Migration
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecimalPrecisionAuditActivity;
