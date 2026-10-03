import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Sparkles, RefreshCw } from 'lucide-react';

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

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? `Iterating (${iterationCount}/5)...` : 'Run Power Iteration'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          Directed Graph Topology Canvas
        </span>
        <div className="flex items-center gap-3 font-mono text-sm text-slate-600 dark:text-slate-400">
          <span>Damping:</span>
          <input aria-label="Damping factor"
            type="range"
            min="0.5"
            max="0.95"
            step="0.05"
            value={dampingFactor}
            onChange={(e) => setDampingFactor(parseFloat(e.target.value))}
            className="w-20 accent-emerald-500 cursor-pointer"
          />
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">{dampingFactor}</span>
        </div>
      </div>

      {/* SVG Link Graph Canvas */}
      <div className="relative w-full h-[260px] bg-white dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800/60 flex items-center justify-center">
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
                role="button" tabIndex={0} aria-label={`Inspect ${node.id}`} aria-pressed={isSelected} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedNode(node.id); } }} onClick={() => setSelectedNode(node.id)}
                className="cursor-pointer transition-colors duration-300"
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
                <text className="text-slate-700 dark:text-slate-300"
                  x={node.x}
                  y={node.y + radius + 14}
                  textAnchor="middle"
                  fill="currentColor"
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
        <div className="mt-3 p-2.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-sm font-mono">
          <span className="text-slate-600 dark:text-slate-400">
            Inspect: <span className="text-slate-900 dark:text-white font-bold">{selectedNode}</span>
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
            PageRank Score: {((nodes.find((n) => n.id === selectedNode)?.rank || 0) * 100).toFixed(1)}%
          </span>
        </div>
      )}
    </div>

    </RoleActivityFrame>
  );
};

export default InternalLinkPageRankActivity;
