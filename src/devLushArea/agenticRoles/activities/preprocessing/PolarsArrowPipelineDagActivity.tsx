import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Cpu, Sparkles, ShieldCheck, Workflow, Check, ArrowRight, Zap } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const PolarsArrowPipelineDagActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeStage, setActiveStage] = useState(3);

  const dagStages = [
    { id: "scan", title: "1. Parquet Lazy Scan", engine: "Polars LazyFrame", memoryMb: 120, pushdown: true },
    { id: "filter", title: "2. SIMD Predicate Filter", engine: "Apache Arrow", memoryMb: 180, pushdown: true },
    { id: "sink", title: "3. Streaming Chunk Sink", engine: "Polars Streaming", memoryMb: 120, pushdown: true }
  ];

  const handleStream = () => {
    setIsStreaming(true);
    toast.info("Compiling Polars Lazy DAG with SIMD predicate & projection pushdown...");
    setTimeout(() => {
      setIsStreaming(false);
      toast.success("Streaming Pipeline Complete: Processed 50GB dataset with 420MB Peak RAM in 14.2s (Zero OOM)!");
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
      toast.success("Correct Polars Lazy DAG Streaming architecture!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect. Lazy execution with predicate pushdown prevents memory overflow.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'hard');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Workflow className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || 'Polars & Apache Arrow Memory DAG Pipeline Tuning'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                ARROW MEMORY DAG
              </span>
            </h2>
            <p className="text-xs text-slate-400">Data Preprocessing Specialist • Day 5 Capstone Mission • Zero-Copy Buffer</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleStream}
            disabled={isStreaming}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isStreaming ? 'animate-spin' : ''}`} />
            {isStreaming ? 'Streaming 50GB...' : 'Run Lazy DAG Stream'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Horizontal DAG Node Stream Visualizer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
              <span className="font-mono text-slate-400">Zero-Copy Arrow Columnar Execution DAG (50GB Dataset)</span>
              <span className="text-emerald-400 font-mono font-bold">PEAK RAM: 420MB</span>
            </div>

            {/* Horizontal DAG Stages */}
            <div className="space-y-3 pt-1">
              {dagStages.map((stage, idx) => (
                <div
                  key={stage.id}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Zap className={`w-3.5 h-3.5 ${isStreaming ? 'text-cyan-400 animate-bounce' : 'text-slate-500'}`} />
                      <span className="text-white font-bold">{stage.title}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">
                      Engine: {stage.engine} • Pushdown: ON
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">MEMORY BUFFER</span>
                    <span className="text-emerald-400 font-bold">{stage.memoryMb} MB</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Memory Pressure: <span className="text-emerald-400 font-bold">0.84% of 32GB RAM</span></span>
              <span className="text-cyan-400 font-bold">Zero OOM Crash Invariant</span>
            </div>
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Memory Optimization Strategy
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select pipeline solution</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Deploy Pipeline
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolarsArrowPipelineDagActivity;
