import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Compass, Sparkles, ShieldCheck, Check, Move } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const VectorCosineAuditActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
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

  const handleVerify = () => {
    if (!selectedOption) {
      toast.error("Please choose a candidate response.");
      return;
    }
    const correct = selectedOption === currentExercise.answer;
    setIsCorrect(correct);
    setIsEvaluated(true);
    if (correct) {
      toast.success("Correct Cosine Similarity calculation!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect score. Remember normalized dot product A · B = 0.48 + 0.48 = 0.96.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'easy');

  // SVG coordinate transformation (Center at 150, 150, Scale: 120px = 1.0)
  const toSvgX = (val: number) => 150 + val * 120;
  const toSvgY = (val: number) => 150 - val * 120;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || 'Vector Embeddings & Cosine Distance Auditing'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                2D CARTESIAN PLANE
              </span>
            </h2>
            <p className="text-xs text-slate-400">Agentic Recommendation Analyst • Day 1 Mission • Unit Vector Space</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleCompute}
            disabled={isComputing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isComputing ? 'animate-spin' : ''}`} />
            {isComputing ? 'Calculating...' : 'Calculate Similarity'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive 2D Vector Cartesian Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-xl relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Interactive 2D Cartesian Vector Space
              </span>
              <span className="text-emerald-400 font-mono font-bold">Live cos(θ): {liveCosine}</span>
            </div>

            {/* SVG Vector Plane */}
            <div className="w-full h-[220px] bg-slate-900/60 rounded-lg border border-slate-800/80 p-2 flex items-center justify-center relative">
              <svg className="w-full h-full" viewBox="0 0 300 200">
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
                <text x="270" y="185" textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">Dim 1 (X)</text>
                <text x="35" y="25" fill="#64748b" fontSize="9" fontFamily="monospace">Dim 2 (Y)</text>

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
                <text
                  x={30 + userX * 180 + 8}
                  y={170 - userY * 140}
                  fill="#818cf8"
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
                <text
                  x={30 + candX * 180 + 8}
                  y={170 - candY * 140 + 10}
                  fill="#34d399"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  Candidate Product [{candX.toFixed(2)}, {candY.toFixed(2)}]
                </text>
              </svg>
            </div>

            {/* Coordinate Adjuster Sliders */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Adjust User X:</span>
                <input
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
                <span className="text-indigo-400 font-bold">{userX.toFixed(2)}</span>
              </div>
              <span className="text-slate-400">
                Formula: <span className="text-white font-bold">A · B = {liveCosine}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Vector Math Challenge
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select computed score</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verify Vector
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VectorCosineAuditActivity;
