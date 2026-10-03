import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

export const CrossEncoderRerankerActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isSampling, setIsSampling] = useState(false);
  const [sampledScoreA, setSampledScoreA] = useState(0.102);
  const [sampledScoreB, setSampledScoreB] = useState(0.384);

  const handleSample = () => {
    setIsSampling(true);
    toast.info("Sampling Beta posterior distributions Beta(α, β) for contextual exploration...");

    setTimeout(() => {
      // Simulate stochastic draws
      const drawA = 0.098 + Math.random() * 0.008; // tight around 10%
      const drawB = 0.15 + Math.random() * 0.50; // wide variance
      setSampledScoreA(parseFloat(drawA.toFixed(3)));
      setSampledScoreB(parseFloat(drawB.toFixed(3)));
      setIsSampling(false);

      toast.success(`Thompson Draw Complete: Item A = ${(drawA * 100).toFixed(1)}% • Item B = ${(drawB * 100).toFixed(1)}% (Stochastic Exploration Allocated)!`);
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleSample}
            disabled={isSampling}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSampling ? 'animate-spin' : ''}`} />
            {isSampling ? 'Drawing Posteriors...' : 'Sample Thompson Posterior'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400">Posterior Probability Density Function PDF</span>
        <span className="text-indigo-700 dark:text-indigo-400 font-mono font-bold">STOCHASTIC SAMPLING</span>
      </div>

      {/* SVG Beta Curves */}
      <div className="w-full h-[260px] sm:h-[360px] bg-white dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800/80 p-3 relative flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 380 130">
          {/* Axis */}
          <line x1="20" y1="110" x2="360" y2="110" stroke="#334155" strokeWidth="1" />
          <text className="text-slate-700 dark:text-slate-300" x="360" y="124" textAnchor="end" fill="currentColor" fontSize="8" fontFamily="monospace">CTR (0% - 100%)</text>

          {/* Item A Curve (Tight spike at 10% - Emerald) */}
          <path
            d="M 20,110 Q 55,10 65,110"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
          />
          <circle cx="58" cy="40" r="4" fill="#10B981" />
          <text className="text-slate-700 dark:text-slate-300" x="66" y="38" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">Item A: Beta(1000, 9000)</text>

          {/* Item B Curve (Wide flat curve - Amber) */}
          <path
            d="M 20,110 Q 140,40 320,110"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeDasharray="4,4"
            className={isSampling ? "animate-pulse" : ""}
          />
          <circle cx="170" cy="65" r="4" fill="#F59E0B" />
          <text className="text-slate-700 dark:text-slate-300" x="178" y="65" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">Item B: Beta(2, 3)</text>
        </svg>
      </div>

      {/* Live Sampled Draw Cards */}
      <div className="grid grid-cols-2 gap-3 font-mono text-sm">
        <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-sm text-slate-500 block">ITEM A STOCHASTIC DRAW</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">{(sampledScoreA * 100).toFixed(1)}% CTR</span>
        </div>
        <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-amber-500/40">
          <span className="text-sm text-slate-500 block">ITEM B STOCHASTIC DRAW</span>
          <span className="text-amber-700 dark:text-amber-400 font-bold text-sm">{(sampledScoreB * 100).toFixed(1)}% CTR</span>
        </div>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default CrossEncoderRerankerActivity;
