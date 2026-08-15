import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, GitMerge, Sparkles, ShieldCheck, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const HierarchicalSankeyActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
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

  const handleVerify = () => {
    if (!selectedOption) {
      toast.error("Please choose a candidate response.");
      return;
    }
    const correct = selectedOption === currentExercise.answer;
    setIsCorrect(correct);
    setIsEvaluated(true);
    if (correct) {
      toast.success("Correct Sankey Bottleneck determination!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect. Stage 2 -> Stage 3 represents the massive 72.7% user drop-off stream.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'medium');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <GitMerge className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || 'Hierarchical Sankey Diagrams & User Flow Visualizer'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                BEZIER FLOW RIBBONS
              </span>
            </h2>
            <p className="text-xs text-slate-400">Data Visualization Specialist • Day 2 Mission • 50,000 Onboarding Sessions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleComputeLayout}
            disabled={isComputingLayout}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isComputingLayout ? 'animate-spin' : ''}`} />
            {isComputingLayout ? 'Relaxing...' : 'Trace Sankey Flow'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SVG Curved Sankey Flow Ribbons (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
              <span className="font-mono text-slate-400">Sankey User Funnel Ribbons (50,000 Signups)</span>
              <span className="text-purple-400 font-mono font-bold">Conservation of Flow Width</span>
            </div>

            {/* SVG Sankey Diagram */}
            <div className="w-full h-[200px] bg-slate-900/60 rounded-lg border border-slate-800/80 p-2 flex items-center justify-center relative">
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
                <text x="245" y="112" fill="#F43F5E" fontSize="8" fontWeight="bold" fontFamily="monospace">-32k Drop</text>

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
                <text x="56" y="18" textAnchor="middle" fill="#c4b5fd" fontSize="8" fontWeight="bold" fontFamily="monospace">50k</text>

                {/* Node 2: Email Verified */}
                <rect x="160" y="30" width="12" height="50" fill="#F59E0B" rx="2" />
                <text x="166" y="22" textAnchor="middle" fill="#fde68a" fontSize="8" fontWeight="bold" fontFamily="monospace">44k</text>

                {/* Node 3: Workspace */}
                <rect x="270" y="42" width="12" height="25" fill="#06B6D4" rx="2" />
                <text x="276" y="36" textAnchor="middle" fill="#a5f3fc" fontSize="8" fontWeight="bold" fontFamily="monospace">12k</text>

                {/* Node 4: API Key */}
                <rect x="370" y="48" width="12" height="20" fill="#10B981" rx="2" />
                <text x="376" y="42" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="bold" fontFamily="monospace">10k</text>
              </svg>
            </div>

            {/* Diagnostic Bottleneck Banner */}
            <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Critical Leakage Point: Stage 2 (Email) &rarr; Stage 3 (Workspace)
              </span>
              <span className="text-rose-400 font-bold">-72.7% Exit Rate</span>
            </div>
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Funnel Optimization
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-purple-500 bg-purple-500/15 text-purple-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-purple-500 bg-purple-500/10 text-white font-semibold';
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
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-purple-950/30 border-purple-800 text-purple-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select bottleneck diagnosis</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Commit Diagnosis
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchicalSankeyActivity;
