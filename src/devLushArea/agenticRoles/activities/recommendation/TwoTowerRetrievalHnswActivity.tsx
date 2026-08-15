import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Cpu, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const TwoTowerRetrievalHnswActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const hnswConfig = (currentExercise?.roleSpecificData as any)?.data?.twoTowerHnswConfig || {
    efSearch: 64,
    mNeighbors: 32,
    recallAt10: 0.946,
    latencyMs: 5.8
  };

  const handleBenchmark = () => {
    setIsBenchmarking(true);
    toast.info("Benchmarking HNSW ANN graph traversal across 10,000,000 item vectors...");
    setTimeout(() => {
      setIsBenchmarking(false);
      toast.success("HNSW Benchmark: efSearch=64 -> Recall@100: 94.6% • p99 Latency: 5.8ms (Target SLA < 10ms Met)!");
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
      toast.success("Correct HNSW Parameter Tuning recommendation!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect tuning. Raising efSearch satisfies recall while keeping latency within SLA.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'medium');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {currentExercise?.title || 'Two-Tower Retrieval & Approximate Nearest Neighbor (HNSW)'}
            </h2>
            <p className="text-xs text-slate-400">Agentic Recommendation Analyst • Day 2 Mission</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleBenchmark}
            disabled={isBenchmarking}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isBenchmarking ? 'animate-spin' : ''}`} />
            {isBenchmarking ? 'Benchmarking...' : 'Benchmark HNSW'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Recall @ 100 Target (&gt;92%)</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {(hnswConfig.recallAt10 * 100).toFixed(1)}%
              </div>
              <span className="text-[10px] text-emerald-500 font-semibold">High Precision Retrieval</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">p99 Latency SLA (&lt;10ms)</span>
              <div className="text-2xl font-bold font-mono text-cyan-400">
                {hnswConfig.latencyMs}ms
              </div>
              <span className="text-[10px] text-cyan-500 font-semibold">Fast Real-Time Search</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-2">
            <div className="text-slate-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>HNSW Graph Hyperparameters</span>
              <span className="text-indigo-400">10,000,000 Vectors Indexed</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
              <span>efSearch (Dynamic Search List):</span>
              <span className="text-emerald-400 font-bold">64 (Optimized)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
              <span>M (Max Bidirectional Links / Node):</span>
              <span className="text-white font-bold">32</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                ANN Tuning Challenge
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select tuning strategy</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Commit Config
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoTowerRetrievalHnswActivity;
