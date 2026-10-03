import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Zap } from 'lucide-react';

export const PolarsArrowPipelineDagActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

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

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleStream}
            disabled={isStreaming}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isStreaming ? 'animate-spin' : ''}`} />
            {isStreaming ? 'Streaming 50GB...' : 'Run Lazy DAG Stream'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400">Zero-Copy Arrow Columnar Execution DAG (50GB Dataset)</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">PEAK RAM: 420MB</span>
      </div>

      {/* Horizontal DAG Stages */}
      <div className="space-y-3 pt-1">
        {dagStages.map((stage, idx) => (
          <div
            key={stage.id}
            className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-sm font-mono"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className={`w-3.5 h-3.5 ${isStreaming ? 'text-cyan-700 dark:text-cyan-400 animate-bounce' : 'text-slate-500'}`} />
                <span className="text-slate-900 dark:text-white font-bold">{stage.title}</span>
              </div>
              <span className="text-slate-500 text-sm">
                Engine: {stage.engine} • Pushdown: ON
              </span>
            </div>

            <div className="text-right">
              <span className="text-sm text-slate-500 block">MEMORY BUFFER</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{stage.memoryMb} MB</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 text-sm font-mono">
        <span className="text-slate-600 dark:text-slate-400">Memory Pressure: <span className="text-emerald-700 dark:text-emerald-400 font-bold">0.84% of 32GB RAM</span></span>
        <span className="text-cyan-700 dark:text-cyan-400 font-bold">Zero OOM Crash Invariant</span>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default PolarsArrowPipelineDagActivity;
