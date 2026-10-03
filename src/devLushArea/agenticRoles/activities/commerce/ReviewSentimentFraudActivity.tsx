import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Network } from 'lucide-react';

export const ReviewSentimentFraudActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isQuarantining, setIsQuarantining] = useState(false);
  const [isQuarantined, setIsQuarantined] = useState(false);

  const fraudRing = {
    clusterScore: 0.94,
    flaggedAccountIds: ["bot_acc_101", "bot_acc_102", "bot_acc_103", "bot_acc_104"],
    burstCount: 120,
    timeWindowHours: 48
  };

  const handleScanRing = () => {
    setIsQuarantining(true);
    toast.info("Building bipartite buyer-seller review graph and computing subgraph density...");
    setTimeout(() => {
      setIsQuarantining(false);
      setIsQuarantined(true);
      toast.error("Sybil Review Ring Detected (Cluster density: 0.94)! 120 coordinated reviews quarantined.");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleScanRing}
            disabled={isQuarantining}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isQuarantining ? 'animate-spin' : ''}`} />
            {isQuarantining ? 'Scanning Graph...' : 'Audit Sybil Ring'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <Network className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
          Bipartite Sybil Review Ring Graph Topology
        </span>
        <span className="text-rose-700 dark:text-rose-400 font-mono font-bold">120 REVIEWS / 48H BURST</span>
      </div>

      {/* SVG Graph Canvas */}
      <div className="w-full h-[260px] sm:h-[360px] bg-white dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800/80 p-3 relative flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 380 140">
          {/* Target SKU Node in Center */}
          <circle cx="190" cy="70" r="22" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
          <text className="text-white" x="190" y="74" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="bold" fontFamily="monospace">TARGET SKU</text>

          {/* Coordinated Bot Cluster Nodes (Red) */}
          {[
            { cx: 70, cy: 35, label: 'Bot_101' },
            { cx: 70, cy: 105, label: 'Bot_102' },
            { cx: 310, cy: 35, label: 'Bot_103' },
            { cx: 310, cy: 105, label: 'Bot_104' }
          ].map((bot, idx) => (
            <g key={idx}>
              <line
                x1={bot.cx}
                y1={bot.cy}
                x2="190"
                y2="70"
                stroke="#F43F5E"
                strokeWidth="2"
                strokeDasharray={isQuarantined ? "none" : "3,3"}
                className={isQuarantining ? "animate-pulse" : ""}
              />
              <circle
                cx={bot.cx}
                cy={bot.cy}
                r="16"
                fill="#4c0519"
                stroke="#F43F5E"
                strokeWidth="2"
                className={isQuarantined ? "animate-pulse" : ""}
              />
              <text className="text-white" x={bot.cx} y={bot.cy + 4} textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">
                {bot.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Quarantine Status Bar */}
      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-sm font-mono">
        <span className="text-slate-600 dark:text-slate-400">Smear Ring Status:</span>
        <span className={isQuarantined ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-rose-700 dark:text-rose-400 font-bold"}>
          {isQuarantined ? "QUARANTINED & DECOUPLED FROM BUY BOX" : "ACTIVE MONITORING"}
        </span>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default ReviewSentimentFraudActivity;
