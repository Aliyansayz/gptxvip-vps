import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const HierarchicalSankeyActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isComputingLayout, setIsComputingLayout] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>("Email Verified");

  const stages = [
    { name: "1. Landing Page", count: 50000, passCount: 44000, dropCount: 6000, color: "#8B5CF6", y: 20, height: 60 },
    { name: "2. Email Verified", count: 44000, passCount: 12000, dropCount: 32000, color: "#F59E0B", y: 25, height: 50, bottleneck: true },
    { name: "3. Team Workspace", count: 12000, passCount: 10000, dropCount: 2000, color: "#06B6D4", y: 35, height: 25 },
    { name: "4. First API Key", count: 10000, passCount: 10000, dropCount: 0, color: "#10B981", y: 40, height: 20 }
  ];

  const handleComputeLayout = () => {
    setIsComputingLayout(true);
    toast.info("Relaxing Sankey node link coordinates across 50,000 onboarding sessions...");
    setTimeout(() => {
      setIsComputingLayout(false);
      toast.error("Major Bottleneck Isolated: Stage 2 (Email Verified) to Stage 3 (Workspace) exhibits 72.7% (32,000 users) drop-off!");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleComputeLayout}
            disabled={isComputingLayout}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isComputingLayout ? 'animate-spin' : ''}`} />
            {isComputingLayout ? 'Relaxing...' : 'Trace Sankey Flow'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400">Sankey User Funnel Ribbons (50,000 Signups)</span>
        <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">Conservation of Flow Width</span>
      </div>

      {/* SVG Sankey Diagram */}
      <div className="w-full h-[260px] sm:h-[360px] bg-white dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800/80 p-2 flex items-center justify-center relative">
        <svg className="w-full h-full" viewBox="0 0 420 120">
          {/* Bézier Ribbons between stages */}
          {/* Stage 1 to 2 */}
          <path
            d="M 60,30 C 110,30 110,35 160,35 L 160,75 C 110,75 110,80 60,80 Z"
            fill="#8B5CF6"
            fillOpacity="0.25"
            stroke="#8B5CF6"
            strokeWidth="1"
          />

          {/* Stage 2 to 3 (Massive Leakage Ribbon) */}
          <path
            d="M 170,35 C 220,35 220,45 270,45 L 270,65 C 220,65 220,75 170,75 Z"
            fill="#06B6D4"
            fillOpacity="0.3"
            stroke="#06B6D4"
            strokeWidth="1"
          />
          {/* Stage 2 Dropoff Ribbon (Red) */}
          <path
            d="M 170,55 C 210,65 210,105 240,110 L 240,115 C 210,115 210,75 170,75 Z"
            fill="#F43F5E"
            fillOpacity="0.4"
            stroke="#F43F5E"
            strokeWidth="1"
            className={isComputingLayout ? "animate-pulse" : ""}
          />
          <text className="text-slate-700 dark:text-slate-300" x="245" y="112" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">-32k Drop</text>

          {/* Stage 3 to 4 */}
          <path
            d="M 280,45 C 330,45 330,50 370,50 L 370,68 C 330,68 330,65 280,65 Z"
            fill="#10B981"
            fillOpacity="0.35"
            stroke="#10B981"
            strokeWidth="1"
          />

          {/* Node Vertical Bars */}
          {/* Node 1: Landing Page */}
          <rect x="50" y="25" width="12" height="60" fill="#8B5CF6" rx="2" />
          <text className="text-slate-700 dark:text-slate-300" x="56" y="18" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">50k</text>

          {/* Node 2: Email Verified */}
          <rect x="160" y="30" width="12" height="50" fill="#F59E0B" rx="2" />
          <text className="text-slate-700 dark:text-slate-300" x="166" y="22" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">44k</text>

          {/* Node 3: Workspace */}
          <rect x="270" y="42" width="12" height="25" fill="#06B6D4" rx="2" />
          <text className="text-slate-700 dark:text-slate-300" x="276" y="36" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">12k</text>

          {/* Node 4: API Key */}
          <rect x="370" y="48" width="12" height="20" fill="#10B981" rx="2" />
          <text className="text-slate-700 dark:text-slate-300" x="376" y="42" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">10k</text>
        </svg>
      </div>

      {/* Diagnostic Bottleneck Banner */}
      <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-500/40 text-sm font-mono text-rose-700 dark:text-rose-300 flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 font-bold">
          <AlertTriangle className="w-4 h-4 text-rose-700 dark:text-rose-400" />
          Critical Leakage Point: Stage 2 (Email) &rarr; Stage 3 (Workspace)
        </span>
        <span className="text-rose-700 dark:text-rose-400 font-bold">-72.7% Exit Rate</span>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default HierarchicalSankeyActivity;
