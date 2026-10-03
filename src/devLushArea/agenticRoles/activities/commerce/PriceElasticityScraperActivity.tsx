import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, ShieldAlert, TrendingDown } from 'lucide-react';

export const PriceElasticityScraperActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isRepricing, setIsRepricing] = useState(false);
  const [competitorPrice, setCompetitorPrice] = useState(42.0);

  const unitCost = 40.0;
  const minFloor = 50.0; // 20% margin
  const ourCurrentPrice = 50.0;

  const handleReprice = () => {
    setIsRepricing(true);
    toast.info("Repricer evaluating competitor price drop ($42.00) vs margin floor ($50.00)...");
    setTimeout(() => {
      setIsRepricing(false);
      toast.error("MARGIN_GUARD INTERCEPT: Refused undercut to $41.50. Locked price at $50.00 hard margin floor.");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleReprice}
            disabled={isRepricing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isRepricing ? 'animate-spin' : ''}`} />
            {isRepricing ? 'Evaluating Loop...' : 'Run Pricing Engine'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <TrendingDown className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
          Live Buy-Box Repricing Collision Trajectory
        </span>
        <div className="flex items-center gap-2 font-mono text-sm text-slate-600 dark:text-slate-400">
          <span>Competitor:</span>
          <input aria-label="Competitor price"
            type="range"
            min="35"
            max="60"
            step="1"
            value={competitorPrice}
            onChange={(e) => setCompetitorPrice(parseFloat(e.target.value))}
            className="w-20 accent-rose-500 cursor-pointer"
          />
          <span className="text-rose-700 dark:text-rose-400 font-bold">${competitorPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* SVG Price Chart */}
      <div className="w-full h-[260px] sm:h-[360px] bg-white dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800/80 p-3 relative flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 400 130">
          {/* Danger Zone Shading (Below $50.00 Floor) */}
          <rect x="20" y="70" width="360" height="50" fill="#F43F5E" fillOpacity="0.1" />

          {/* Hard Margin Floor ($50.00) Red Dashed Line */}
          <line x1="20" y1="70" x2="380" y2="70" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4,4" />
          <text className="text-slate-700 dark:text-slate-300" x="20" y="90" textAnchor="start" fill="currentColor" fontSize="9" fontWeight="bold" fontFamily="monospace">
            Margin floor: $50.00
          </text>

          {/* Unit Cost Line ($40.00) */}
          <line x1="20" y1="110" x2="380" y2="110" stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />
          <text className="text-slate-700 dark:text-slate-300" x="380" y="106" textAnchor="end" fill="currentColor" fontSize="8" fontFamily="monospace">
            UNIT COST: $40.00 (Net Zero)
          </text>

          {/* Competitor Price Step Trajectory (Rose) */}
          <polyline
            points={`20,20 120,40 220,60 320,${Math.min(120, 20 + (60 - competitorPrice) * 3.5)}`}
            fill="none"
            stroke="#F43F5E"
            strokeWidth="2.5"
            className={isRepricing ? "animate-pulse" : ""}
          />

          {/* Our Bot Clamped Price Trajectory (Emerald) */}
          <polyline
            points="20,22 120,42 220,62 320,70"
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
          />

          {/* Clamped Lock Node */}
          <circle cx="320" cy="70" r="5" fill="#10B981" />
          <text className="text-slate-700 dark:text-slate-300" x="310" y="50" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="bold" fontFamily="monospace">
            LOCKED: $50.00
          </text>
        </svg>
      </div>

      {/* Diagnostic Badges */}
      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-500/30 flex flex-wrap items-center justify-between gap-3 text-sm font-mono">
        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
          Predatory Competitor Bot: <span className="text-slate-900 dark:text-white font-bold">${competitorPrice.toFixed(2)}</span>
        </span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
          Our Clamped Floor: ${ourCurrentPrice.toFixed(2)}
        </span>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default PriceElasticityScraperActivity;
