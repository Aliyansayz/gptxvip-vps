import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, AlertTriangle, Sparkles, ShieldCheck, Check, BarChart } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const AutomatedEdaCritiqueActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCritiquing, setIsCritiquing] = useState(false);

  const handleCritique = () => {
    setIsCritiquing(true);
    toast.info("Auditing Edward Tufte Data-Ink ratios and non-zero baseline distortions...");
    setTimeout(() => {
      setIsCritiquing(false);
      toast.error("Deceptive Chart Scale Flagged: Y-axis baseline begins at 97.0%, visually exaggerating a minor 0.8% difference into a 4x bar height distortion!");
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
      toast.success("Correct Ethical Data Visualization redesign!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect critique. Truncating bar chart baselines misleads human perception.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'hard');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <BarChart className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {currentExercise?.title || 'Automated EDA Chart Generation & Chart Junk Critique'}
            </h2>
            <p className="text-xs text-slate-400">Data Visualization Specialist • Day 4 Mission</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleCritique}
            disabled={isCritiquing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isCritiquing ? 'animate-spin' : ''}`} />
            {isCritiquing ? 'Critiquing...' : 'Audit Data-Ink'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-3">
            <div className="text-slate-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Deceptive Axis Truncation vs Grounded Baseline</span>
              <span className="text-rose-400 font-bold">DELTA: +0.8%</span>
            </div>

            <div className="p-3 rounded bg-slate-900 border border-rose-500/30 space-y-2">
              <div className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Deceptive Truncated Scale [97.0% - 98.5%]
              </div>
              <div className="flex items-end gap-6 h-28 pt-2">
                <div className="flex-1 text-center space-y-1">
                  <div className="bg-rose-500/80 rounded-t h-20 flex items-center justify-center font-bold text-white text-xs">
                    98.2%
                  </div>
                  <span className="text-[10px] text-slate-400">Competitor Bar (Looks 4x Taller)</span>
                </div>
                <div className="flex-1 text-center space-y-1">
                  <div className="bg-purple-500/80 rounded-t h-5 flex items-center justify-center font-bold text-white text-xs">
                    97.4%
                  </div>
                  <span className="text-[10px] text-slate-400">Our Bar (Artificially Crushed)</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-emerald-500/30 text-[11px] text-slate-300 space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Ethical Redesign:
              </div>
              <p className="text-slate-400">
                Ground Y-axis baseline at 0.0%, or present a labeled dot plot with confidence intervals and an explicit "+0.8% difference" callout banner.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Data-Ink Critique
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select redesign action</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Redesign Chart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedEdaCritiqueActivity;
