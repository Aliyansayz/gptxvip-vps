import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, HelpCircle, Sparkles, ShieldCheck, Check, ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const ShapWaterfallExplainabilityActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isComputingShap, setIsComputingShap] = useState(false);

  const shapData = [
    { feature: "Baseline Expected Value E[f(x)]", baselineValue: 0.65, shapContribution: 0.0, finalPrediction: 0.65, base: 0, width: 65, color: "bg-cyan-500" },
    { feature: "Debt-to-Income (DTI = 18%)", baselineValue: 0.65, shapContribution: 0.12, finalPrediction: 0.77, base: 65, width: 12, color: "bg-emerald-500", positive: true },
    { feature: "Credit Inquiries (6 in 90d)", baselineValue: 0.77, shapContribution: -0.22, finalPrediction: 0.55, base: 55, width: 22, color: "bg-rose-500", negative: true },
    { feature: "Derogatory Public Records (2)", baselineValue: 0.55, shapContribution: -0.17, finalPrediction: 0.38, base: 38, width: 17, color: "bg-rose-500", negative: true }
  ];

  const handleComputeShap = () => {
    setIsComputingShap(true);
    toast.info("Computing TreeSHAP additive feature attributions for loan decision audit...");
    setTimeout(() => {
      setIsComputingShap(false);
      toast.error("Adverse Action Breakdown: Baseline 65% Approval dropped to 38% (Denied) primarily due to Credit Inquiries (-22%) and Derogatory Records (-17%)!");
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
      toast.success("Correct SHAP Waterfall Explainability interpretation!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect. Explainable AI regulations require verifiable additive feature factors.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'hard');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <HelpCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || 'Interactive Model Explainability (SHAP Waterfall Visualizer)'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                TREESHAP WATERFALL
              </span>
            </h2>
            <p className="text-xs text-slate-400">Data Visualization Specialist • Day 5 Capstone Mission • EU AI Act Compliance</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleComputeShap}
            disabled={isComputingShap}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isComputingShap ? 'animate-spin' : ''}`} />
            {isComputingShap ? 'Attributing...' : 'Decompose SHAP Tree'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Horizontal Floating SHAP Waterfall Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
              <span className="font-mono text-slate-400">TreeSHAP Additive Attribution Waterfall</span>
              <span className="text-rose-400 font-mono font-bold">f(x) = 38.0% (DENIED &lt; 50%)</span>
            </div>

            {/* Waterfall Floating Bars */}
            <div className="space-y-3 pt-1">
              {shapData.map((item, idx) => {
                const isBase = idx === 0;

                return (
                  <div key={idx} className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300 font-medium">{item.feature}</span>
                      <span className={item.positive ? "text-emerald-400 font-bold" : item.negative ? "text-rose-400 font-bold" : "text-cyan-400 font-bold"}>
                        {isBase ? "E[f(x)] = 65%" : item.positive ? `+${(item.shapContribution * 100).toFixed(0)}%` : `${(item.shapContribution * 100).toFixed(0)}%`}
                      </span>
                    </div>

                    {/* Floating bar lane */}
                    <div className="w-full bg-slate-900 h-5 rounded overflow-hidden relative border border-slate-800">
                      <div
                        className={`${item.color} h-full rounded transition-all flex items-center justify-center text-[10px] text-white font-bold shadow-md`}
                        style={{
                          marginLeft: `${item.base}%`,
                          width: `${item.width}%`
                        }}
                      >
                        {(item.finalPrediction * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
              <span>Final Probability Output: <span className="text-rose-400 font-bold">0.38</span></span>
              <span className="text-emerald-400 font-bold">Additive Invariant Satisfied</span>
            </div>
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Adverse Action Rationale
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-purple-500 bg-purple-500/15 text-purple-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-purple-500 bg-purple-500/10 text-white font-semibold';
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
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-purple-950/30 border-purple-800 text-purple-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select regulatory explanation</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Issue Notice
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapWaterfallExplainabilityActivity;
