import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Sparkles, ShieldCheck, Layers, Eye } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const FilterBubbleMitigationActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isDiversifying, setIsDiversifying] = useState(false);

  const candidates = (currentExercise?.roleSpecificData as any)?.data?.candidateItems || [
    { id: "p1", title: "Alpine Trail Hiking Boots", category: "Footwear", cosineSimilarity: 0.99, rerankScore: 0.94 },
    { id: "p2", title: "Merino Wool Trail Socks (3-Pack)", category: "Apparel", cosineSimilarity: 0.91, rerankScore: 0.89 },
    { id: "p3", title: "2.5L Hydration Reservoir Pack", category: "Gear", cosineSimilarity: 0.88, rerankScore: 0.86 }
  ];

  const handleDiversify = () => {
    setIsDiversifying(true);
    toast.info("Applying Maximal Marginal Relevance (MMR) λ=0.6 diversity tradeoff...");
    setTimeout(() => {
      setIsDiversifying(false);
      toast.success("Filter Bubble Bursted! Intra-list diversity improved by 42% across complementary categories.");
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
      toast.success("Correct Maximal Marginal Relevance (MMR) strategy!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect action. MMR penalizes redundant items to surface diverse categories.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'hard');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {currentExercise?.title || 'Recommendation Bias Mitigation & Filter Bubble Bursting'}
            </h2>
            <p className="text-xs text-slate-400">Agentic Recommendation Analyst • Day 5 Capstone Mission</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleDiversify}
            disabled={isDiversifying}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isDiversifying ? 'animate-spin' : ''}`} />
            {isDiversifying ? 'Diversifying...' : 'Apply MMR Reranking'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-3">
            <div className="text-slate-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Maximal Marginal Relevance (MMR) Output Carousel</span>
              <span className="text-indigo-400">λ Diversity = 0.60</span>
            </div>

            <div className="space-y-2">
              {candidates.map((item: any, idx: number) => (
                <div key={item.id} className="p-3 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-indigo-400 font-bold">Slot #{idx + 1}</span>
                      <span className="text-white font-bold">{item.title}</span>
                    </div>
                    <span className="text-slate-500 text-[10px] px-1.5 py-0.2 rounded bg-slate-800">
                      Category: {item.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">MMR SCORE</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      {(item.rerankScore * 100).toFixed(0)}%
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
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Diversity Policy
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-indigo-500 bg-indigo-500/15 text-indigo-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-indigo-500 bg-indigo-500/10 text-white font-semibold';
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
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-indigo-950/30 border-indigo-800 text-indigo-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select diversity strategy</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Apply MMR Reranking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBubbleMitigationActivity;
