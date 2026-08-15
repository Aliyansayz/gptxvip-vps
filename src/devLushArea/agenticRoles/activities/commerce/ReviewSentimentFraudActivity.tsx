import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, ShieldAlert, Sparkles, ShieldCheck, UserX, Network, Filter } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const ReviewSentimentFraudActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
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

  const handleVerify = () => {
    if (!selectedOption) {
      toast.error("Please choose a candidate response.");
      return;
    }
    const correct = selectedOption === currentExercise.answer;
    setIsCorrect(correct);
    setIsEvaluated(true);
    if (correct) {
      toast.success("Correct Forensic Review Quarantine action!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect action. Coordinated review manipulation requires quarantine and graph evidence.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'hard');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || 'Marketplace Review Sentiment & Sybil Ring Detection'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                SYBIL GRAPH CLUSTER
              </span>
            </h2>
            <p className="text-xs text-slate-400">Agentic Commerce Analyst • Day 4 Mission • Bipartite Graph Density: 0.94</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleScanRing}
            disabled={isQuarantining}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isQuarantining ? 'animate-spin' : ''}`} />
            {isQuarantining ? 'Scanning Graph...' : 'Audit Sybil Ring'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SVG Bipartite Review Graph (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-xl relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-rose-400" />
                Bipartite Sybil Review Ring Graph Topology
              </span>
              <span className="text-rose-400 font-mono font-bold">120 REVIEWS / 48H BURST</span>
            </div>

            {/* SVG Graph Canvas */}
            <div className="w-full h-[190px] bg-slate-900/60 rounded-lg border border-slate-800/80 p-3 relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 380 140">
                {/* Target SKU Node in Center */}
                <circle cx="190" cy="70" r="22" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
                <text x="190" y="74" textAnchor="middle" fill="#c7d2fe" fontSize="9" fontWeight="bold" fontFamily="monospace">TARGET SKU</text>

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
                    <text x={bot.cx} y={bot.cy + 4} textAnchor="middle" fill="#fda4af" fontSize="8" fontWeight="bold" fontFamily="monospace">
                      {bot.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Quarantine Status Bar */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Smear Ring Status:</span>
              <span className={isQuarantined ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                {isQuarantined ? "QUARANTINED & DECOUPLED FROM BUY BOX" : "ACTIVE MONITORING"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Forensic Graph Action
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-rose-500 bg-rose-500/15 text-rose-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-rose-500 bg-rose-500/10 text-white font-semibold';
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
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-rose-950/30 border-rose-800 text-rose-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select arbitration action</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Quarantine Ring
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSentimentFraudActivity;
