import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Database, Sparkles, ShieldCheck, Check, Layers, RefreshCw } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const MissingValueImputationActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isImputing, setIsImputing] = useState(false);
  const [isImputed, setIsImputed] = useState(false);

  // Simulated 6x8 cell missingness matrix grid
  const featureCols = ["Age", "BUN", "Creatinine", "BP_Sys", "BP_Dia", "Glucose"];

  const handleImpute = () => {
    setIsImputing(true);
    toast.info("Fitting MICE multivariate chained regression on Age, Creatinine, and BUN...");
    setTimeout(() => {
      setIsImputing(false);
      setIsImputed(true);
      toast.success("MICE Imputation Complete! 800 missing Creatinine cells imputed with preserved covariance.");
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
      toast.success("Correct Multivariate Imputation strategy!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect imputation. Dropping correlated clinical rows introduces severe selection bias.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'easy');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || 'Automated Missing Value Imputation (KNN vs MICE)'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                HEATMAP MATRIX
              </span>
            </h2>
            <p className="text-xs text-slate-400">Data Preprocessing Specialist • Day 1 Mission • 10,000 Patient Records</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleImpute}
            disabled={isImputing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isImputing ? 'animate-spin' : ''}`} />
            {isImputing ? 'Chaining Equations...' : 'Run MICE Imputation'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Missingness Grid Matrix Heatmap (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
              <span className="font-mono text-slate-400">Feature Missingness Profiler Matrix (10k Rows)</span>
              <span className={isImputed ? "text-emerald-400 font-mono font-bold" : "text-rose-400 font-mono font-bold"}>
                {isImputed ? "0 NULL CELLS (MICE IMPUTED)" : "800 NULL CREATININE CELLS"}
              </span>
            </div>

            {/* Matrix Visualizer Table */}
            <div className="grid grid-cols-6 gap-2 text-center text-[11px] font-mono">
              {featureCols.map((col, idx) => (
                <div key={col} className="space-y-1.5">
                  <span className="text-slate-400 font-bold block">{col}</span>
                  {/* Vertical mini sparkline blocks */}
                  <div className="space-y-1">
                    {[1, 2, 3, 4].map((row) => {
                      const isMissingCell = col === "Creatinine" && row >= 2;
                      return (
                        <div
                          key={row}
                          className={`h-6 rounded flex items-center justify-center text-[9px] font-bold transition-all ${
                            isMissingCell
                              ? isImputed
                                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 animate-pulse'
                                : 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {isMissingCell ? (isImputed ? "1.12*" : "NULL") : "OK"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Statistical Diagnostics */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Little's MCAR Test: <span className="text-rose-400 font-bold">p &lt; 0.001 (MAR)</span></span>
              <span className="text-cyan-400 font-bold">Covariance Preserved (r = 0.74)</span>
            </div>
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Imputation Strategy
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-cyan-500 bg-cyan-500/15 text-cyan-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-cyan-500 bg-cyan-500/10 text-white font-semibold';
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
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-cyan-950/30 border-cyan-800 text-cyan-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select imputation plan</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Commit Imputation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissingValueImputationActivity;
