import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Sparkles } from 'lucide-react';

export const VectorCosineAuditActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isComputing, setIsComputing] = useState(false);

  // Normalized 2D coordinates
  const [userX, setUserX] = useState(0.60);
  const [userY, setUserY] = useState(0.80);
  const candX = 0.80;
  const candY = 0.60;

  // Live Cosine Dot Product: A · B
  const liveCosine = (userX * candX + userY * candY).toFixed(3);

  const handleCompute = () => {
    setIsComputing(true);
    toast.info("Computing Cosine Similarity dot product in unit vector space: cos(θ) = A · B...");
    setTimeout(() => {
      setIsComputing(false);
      toast.success(`Vector Dot Product Computed: (${userX} * ${candX}) + (${userY} * ${candY}) = ${liveCosine} (High Affinity Match)!`);
    }, 1000);
  };

  // SVG coordinate transformation (Center at 150, 150, Scale: 120px = 1.0)
  const toSvgX = (val: number) => 150 + val * 120;
  const toSvgY = (val: number) => 150 - val * 120;

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleCompute}
            disabled={isComputing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isComputing ? 'animate-spin' : ''}`} />
            {isComputing ? 'Calculating...' : 'Calculate Similarity'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />
          Interactive 2D Cartesian Vector Space
        </span>
        <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">Live cos(θ): {liveCosine}</span>
      </div>

      {/* SVG Vector Plane */}
      <div className="w-full h-[320px] bg-white dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800/80 p-2 flex items-center justify-center relative">
        <svg className="w-full h-full" viewBox="0 0 390 200">
          <defs>
            <marker id="userArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#6366F1" />
            </marker>
            <marker id="candArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#10B981" />
            </marker>
          </defs>

          {/* Axes */}
          <line x1="30" y1="170" x2="270" y2="170" stroke="#334155" strokeWidth="1.5" />
          <line x1="30" y1="170" x2="30" y2="20" stroke="#334155" strokeWidth="1.5" />
          <text className="text-slate-700 dark:text-slate-300" x="270" y="185" textAnchor="end" fill="currentColor" fontSize="9" fontFamily="monospace">Dim 1 (X)</text>
          <text className="text-slate-700 dark:text-slate-300" x="35" y="25" fill="currentColor" fontSize="9" fontFamily="monospace">Dim 2 (Y)</text>

          {/* Unit Arc */}
          <path d="M 150,170 A 120,120 0 0,0 30,50" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />

          {/* User Vector Arrow (Indigo) */}
          <line
            x1="30"
            y1="170"
            x2={30 + userX * 180}
            y2={170 - userY * 140}
            stroke="#6366F1"
            strokeWidth="3"
            markerEnd="url(#userArrow)"
          />
          <circle cx={30 + userX * 180} cy={170 - userY * 140} r="4" fill="#818cf8" />
          <text className="text-slate-700 dark:text-slate-300"
            x={30 + userX * 180 + 8}
            y={170 - userY * 140}
            fill="currentColor"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            User Vector [{userX.toFixed(2)}, {userY.toFixed(2)}]
          </text>

          {/* Candidate Vector Arrow (Emerald) */}
          <line
            x1="30"
            y1="170"
            x2={30 + candX * 180}
            y2={170 - candY * 140}
            stroke="#10B981"
            strokeWidth="3"
            markerEnd="url(#candArrow)"
          />
          <circle cx={30 + candX * 180} cy={170 - candY * 140} r="4" fill="#34d399" />
          <text className="text-slate-700 dark:text-slate-300"
            x={30 + candX * 180 + 8}
            y={170 - candY * 140 + 10}
            fill="currentColor"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            Candidate Product [{candX.toFixed(2)}, {candY.toFixed(2)}]
          </text>
        </svg>
      </div>

      {/* Coordinate Adjuster Sliders */}
      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-sm font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 dark:text-slate-400">Adjust User X:</span>
          <input aria-label="User vector X coordinate"
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={userX}
            onChange={(e) => {
              const x = parseFloat(e.target.value);
              setUserX(x);
              setUserY(Math.sqrt(Math.max(0, 1 - x * x)));
            }}
            className="w-20 accent-indigo-500 cursor-pointer"
          />
          <span className="text-indigo-700 dark:text-indigo-400 font-bold">{userX.toFixed(2)}</span>
        </div>
        <span className="text-slate-600 dark:text-slate-400">
          Formula: <span className="text-slate-900 dark:text-white font-bold">A · B = {liveCosine}</span>
        </span>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default VectorCosineAuditActivity;
