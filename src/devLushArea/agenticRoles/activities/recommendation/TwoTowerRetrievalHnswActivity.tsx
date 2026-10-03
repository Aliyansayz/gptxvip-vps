import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play } from 'lucide-react';

export const TwoTowerRetrievalHnswActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

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

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleBenchmark}
            disabled={isBenchmarking}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isBenchmarking ? 'animate-spin' : ''}`} />
            {isBenchmarking ? 'Benchmarking...' : 'Benchmark HNSW'}
          </button>}>

    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
        <span className="text-sm font-mono uppercase text-slate-600 dark:text-slate-400">Recall @ 100 Target (&gt;92%)</span>
        <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
          {(hnswConfig.recallAt10 * 100).toFixed(1)}%
        </div>
        <span className="text-sm text-emerald-500 font-semibold">High Precision Retrieval</span>
      </div>
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
        <span className="text-sm font-mono uppercase text-slate-600 dark:text-slate-400">p99 Latency SLA (&lt;10ms)</span>
        <div className="text-2xl font-bold font-mono text-cyan-700 dark:text-cyan-400">
          {hnswConfig.latencyMs}ms
        </div>
        <span className="text-sm text-cyan-500 font-semibold">Fast Real-Time Search</span>
      </div>
    </div>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-2">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>HNSW Graph Hyperparameters</span>
        <span className="text-indigo-700 dark:text-indigo-400">10,000,000 Vectors Indexed</span>
      </div>
      <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
        <span>efSearch (Dynamic Search List):</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">64 (Optimized)</span>
      </div>
      <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
        <span>M (Max Bidirectional Links / Node):</span>
        <span className="text-slate-900 dark:text-white font-bold">32</span>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default TwoTowerRetrievalHnswActivity;
