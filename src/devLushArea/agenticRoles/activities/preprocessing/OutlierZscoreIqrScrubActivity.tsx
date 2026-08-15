import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Filter, Sparkles, ShieldCheck, Check, AlertTriangle } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const OutlierZscoreIqrScrubActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const outliers = (currentExercise?.roleSpecificData as any)?.data?.outlierProfiles || [
    { column: "income", q1: 45000, q3: 95000, iqr: 50000, lowerBound: 0, upperBound: 170000, detectedAnomalies: 14 },
    { column: "credit_line", q1: 5000, q3: 25000, iqr: 20000, lowerBound: 0, upperBound: 55000, detectedAnomalies: 28 }
  ];

  const handleScrub = () => {
    setIsScrubbing(true);
    toast.info("Fitting Isolation Forest (n_estimators=200) for multivariate non-linear anomaly isolation...");
    setTimeout(() => {
      setIsScrubbing(false);
      toast.error("Multivariate Anomaly Isolated: 42 records flagged with anomaly score > 0.85 (e.g. low income + high credit line).");
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
      toast.success("Correct Multivariate Outlier action!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect. Multivariate anomalies require joint tree partitioning or robust underwriting review.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'medium');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <Filter className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {currentExercise?.title || 'Multimodal Outlier Scrubbing via IQR & Isolation Forests'}
            </h2>
            <p className="text-xs text-slate-400">Data Preprocessing Specialist • Day 3 Mission</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleScrub}
            disabled={isScrubbing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isScrubbing ? 'animate-spin' : ''}`} />
            {isScrubbing ? 'Scrubbing...' : 'Fit Isolation Forest'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-3">
            <div className="text-slate-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Statistical Tukey IQR Boundaries vs Isolation Forest</span>
              <span className="text-cyan-400">Contamination = 0.01</span>
            </div>

            <div className="space-y-2">
              {outliers.map((col: any) => (
                <div key={col.column} className="p-3 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-bold">{col.column}</span>
                    <div className="text-slate-500 text-[10px]">
                      Q1: ${col.q1.toLocaleString()} | Q3: ${col.q3.toLocaleString()} | IQR Fence: [${col.lowerBound}, ${col.upperBound.toLocaleString()}]
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">ANOMALIES</span>
                    <span className="text-amber-400 font-bold font-mono">
                      {col.detectedAnomalies} Flagged
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Multivariate Action
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select anomaly protocol</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Commit Quarantine
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutlierZscoreIqrScrubActivity;
