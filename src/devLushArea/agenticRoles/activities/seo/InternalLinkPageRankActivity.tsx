import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Network, Sparkles, ShieldCheck, Check, RefreshCw, ZoomIn } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

interface NodePosition {
  id: string;
  label: string;
  x: number;
  y: number;
  rank: number;
  isTarget?: boolean;
}

export const InternalLinkPageRankActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [iterationCount, setIterationCount] = useState(0);
  const [dampingFactor, setDampingFactor] = useState(0.85);
  const [selectedNode, setSelectedNode] = useState<string | null>('/pricing');

  const [nodes, setNodes] = useState<NodePosition[]>([
    { id: '/homepage', label: 'Homepage (Hub)', x: 80, y: 70, rank: 0.38 },
    { id: '/pricing', label: 'Pricing (Conversion)', x: 260, y: 70, rank: 0.42, isTarget: true },
    { id: '/enterprise', label: 'Enterprise Features', x: 80, y: 190, rank: 0.12 },
    { id: '/blog-orphan', label: 'Orphan Blog Post', x: 260, y: 190, rank: 0.02 },
    { id: '/checkout', label: 'Checkout Gate', x: 380, y: 130, rank: 0.06 }
  ]);

  const links = [
    { source: '/homepage', target: '/pricing', weight: 0.8 },
    { source: '/enterprise', target: '/pricing', weight: 0.7 },
    { source: '/pricing', target: '/checkout', weight: 0.9 },
    { source: '/homepage', target: '/enterprise', weight: 0.5 }
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    setIterationCount(0);
    toast.info("Iterating PageRank power iteration algorithm across internal link topology...");

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setIterationCount(current);
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === '/pricing') return { ...node, rank: Math.min(0.68, node.rank + 0.06) };
          if (node.id === '/homepage') return { ...node, rank: Math.max(0.28, node.rank - 0.02) };
          return node;
        })
      );

      if (current >= 5) {
        clearInterval(interval);
        setIsSimulating(false);
        toast.success("PageRank vector converged! Link equity concentrated on /pricing (PR: 0.68).");
      }
    }, 400);
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
      toast.success("Correct Link Equity determination!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect analysis. Check damping factors and orphan URL topology.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'medium');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Network className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || 'Internal Link Equity & PageRank Topology'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                SVG GRAPH ENGINE
              </span>
            </h2>
            <p className="text-xs text-slate-400">SEO Agentic Analyst • Day 3 Mission • Damping d={dampingFactor}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? `Iterating (${iterationCount}/5)...` : 'Run Power Iteration'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive SVG Graph Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80 text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Directed Graph Topology Canvas
              </span>
              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                <span>Damping:</span>
                <input
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.05"
                  value={dampingFactor}
                  onChange={(e) => setDampingFactor(parseFloat(e.target.value))}
                  className="w-20 accent-emerald-500 cursor-pointer"
                />
                <span className="text-emerald-400 font-bold">{dampingFactor}</span>
              </div>
            </div>

            {/* SVG Link Graph Canvas */}
            <div className="relative w-full h-[260px] bg-slate-900/60 rounded-lg border border-slate-800/60 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 460 250">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="8"
                    markerHeight="6"
                    refX="14"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#10B981" />
                  </marker>
                  <radialGradient id="targetGlow">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Directed Edges */}
                {links.map((link, idx) => {
                  const s = nodes.find((n) => n.id === link.source);
                  const t = nodes.find((n) => n.id === link.target);
                  if (!s || !t) return null;

                  return (
                    <g key={idx}>
                      <line
                        x1={s.x}
                        y1={s.y}
                        x2={t.x}
                        y2={t.y}
                        stroke="#059669"
                        strokeWidth={link.weight * 3}
                        strokeDasharray={isSimulating ? "4,4" : "none"}
                        className={isSimulating ? "animate-pulse" : ""}
                        markerEnd="url(#arrowhead)"
                      />
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  const isSelected = selectedNode === node.id;
                  const radius = 16 + node.rank * 24;

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      className="cursor-pointer transition-all duration-300"
                    >
                      {node.isTarget && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius + 12}
                          fill="url(#targetGlow)"
                          className="animate-pulse"
                        />
                      )}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius}
                        fill={node.isTarget ? "#064e3b" : isSelected ? "#1e293b" : "#0f172a"}
                        stroke={node.isTarget ? "#10B981" : isSelected ? "#38bdf8" : "#334155"}
                        strokeWidth={node.isTarget ? 3 : 1.5}
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {(node.rank * 100).toFixed(0)}%
                      </text>
                      <text
                        x={node.x}
                        y={node.y + radius + 14}
                        textAnchor="middle"
                        fill={node.isTarget ? "#34d399" : "#94a3b8"}
                        fontSize="9"
                        fontWeight="500"
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected Node Inspector */}
            {selectedNode && (
              <div className="mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Inspect: <span className="text-white font-bold">{selectedNode}</span>
                </span>
                <span className="text-emerald-400 font-bold">
                  PageRank Score: {((nodes.find((n) => n.id === selectedNode)?.rank || 0) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Topology Assessment
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-emerald-500 bg-emerald-500/10 text-white font-semibold';
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
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select topology remedy</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Submit Evaluation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalLinkPageRankActivity;
