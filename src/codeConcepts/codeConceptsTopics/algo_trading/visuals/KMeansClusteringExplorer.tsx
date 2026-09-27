import React, { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { AlgoTradingSlider, AlgoTradingVisualLab } from "../../codeConceptsView/AlgoTradingVisualLab";

const TRAINING_ATR = [1.0, 1.2, 1.4, 1.5, 2.5, 2.8, 3.0, 3.2, 4.8, 5.2, 5.5, 6.0];
const COLORS = ["#10b981", "#38bdf8", "#f59e0b"];
const ROWS = [68, 143, 218];

const assignLabels = (values: number[], centers: number[]) =>
  values.map((value) => centers.reduce((best, center, index) =>
    Math.abs(value - center) < Math.abs(value - centers[best]) ? index : best, 0));

type KMeansClusteringExplorerProps = {
  onComplete?: () => void;
};

export const KMeansClusteringExplorer: React.FC<KMeansClusteringExplorerProps> = ({ onComplete }) => {
  const minValue = Math.min(...TRAINING_ATR);
  const maxValue = Math.max(...TRAINING_ATR);
  const initialCenters = [
    minValue + (maxValue - minValue) * 0.25,
    minValue + (maxValue - minValue) * 0.5,
    minValue + (maxValue - minValue) * 0.75,
  ];
  const [centers, setCenters] = useState(initialCenters);
  const [iteration, setIteration] = useState(0);
  const [currentAtr, setCurrentAtr] = useState(3.7);
  const [hasConverged, setHasConverged] = useState(false);
  const assignments = useMemo(() => assignLabels(TRAINING_ATR, centers), [centers]);
  const counts = centers.map((_, cluster) => assignments.filter((label) => label === cluster).length);
  const nearestCurrent = assignLabels([currentAtr], centers)[0];
  const x = (value: number) => 62 + ((value - 0.5) / 6.2) * 482;

  const runIteration = () => {
    const labels = assignLabels(TRAINING_ATR, centers);
    const updated = centers.map((center, cluster) => {
      const members = TRAINING_ATR.filter((_, index) => labels[index] === cluster);
      return members.length ? members.reduce((sum, value) => sum + value, 0) / members.length : center;
    }).sort((a, b) => a - b);
    const settled = updated.every((center, index) => Math.abs(center - centers[index]) < 0.0001);
    setCenters(updated);
    setIteration((current) => current + 1);
    setHasConverged(settled);
  };

  const reset = () => {
    setCenters(initialCenters);
    setIteration(0);
    setHasConverged(false);
  };

  return (
    <AlgoTradingVisualLab
      eyebrow="Intermediate · Unsupervised learning"
      title="Watch K-means sort recent ATR values"
      description="Each iteration assigns historical ATR samples to the nearest center, then moves each center to its cluster mean. The current ATR is held out and classified after the fit."
      visual={
        <div className="w-full space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Training window · ATR units</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-mono text-zinc-500 dark:bg-zinc-800">
              iteration {iteration}
            </span>
          </div>
          <svg viewBox="0 0 580 275" role="img" aria-label="K-means ATR observations grouped around three moving centers" className="h-auto w-full rounded-2xl bg-zinc-50 dark:bg-zinc-950">
            {[0, 1, 2].map((cluster) => (
              <g key={cluster}>
                <rect x="60" y={ROWS[cluster] - 25} width="490" height="50" rx="12" fill={COLORS[cluster]} fillOpacity="0.06" />
                <text x="9" y={ROWS[cluster] + 4} fontSize="11" fontWeight="700" fill={COLORS[cluster]}>
                  {["LOW", "MID", "HIGH"][cluster]}
                </text>
                <line x1="62" y1={ROWS[cluster] + 27} x2="545" y2={ROWS[cluster] + 27} stroke="#94a3b8" strokeOpacity="0.2" />
              </g>
            ))}
            {centers.map((center, cluster) => (
              <g key={"center-" + cluster}>
                <line x1={x(center)} y1="34" x2={x(center)} y2="250" stroke={COLORS[cluster]} strokeWidth="2" strokeDasharray="5 5" strokeOpacity="0.8" />
                <text x={x(center)} y="20" textAnchor="middle" fontSize="10" fontWeight="700" fill={COLORS[cluster]}>
                  μ {center.toFixed(2)}
                </text>
              </g>
            ))}
            {TRAINING_ATR.map((value, index) => {
              const cluster = assignments[index];
              const jitter = ((index % 3) - 1) * 7;
              return (
                <circle
                  key={index}
                  cx={x(value)}
                  cy={ROWS[cluster] + jitter}
                  r="6"
                  fill={COLORS[cluster]}
                  stroke="white"
                  strokeWidth="1.5"
                >
                  <title>Training ATR {value.toFixed(1)} assigned to cluster {cluster}</title>
                </circle>
              );
            })}
            <line x1={x(currentAtr)} y1="35" x2={x(currentAtr)} y2="250" stroke="#a855f7" strokeWidth="2" />
            <circle cx={x(currentAtr)} cy={ROWS[nearestCurrent]} r="10" fill="#a855f7" stroke="white" strokeWidth="3" />
            <text x={x(currentAtr)} y={ROWS[nearestCurrent] - 15} textAnchor="middle" fontSize="10" fontWeight="700" fill="#9333ea">
              current {currentAtr.toFixed(1)}
            </text>
            {[1, 2, 3, 4, 5, 6].map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} y1="254" x2={x(tick)} y2="260" stroke="#64748b" />
                <text x={x(tick)} y="272" textAnchor="middle" fontSize="10" fill="#64748b">{tick}</text>
              </g>
            ))}
          </svg>
          <div className="grid grid-cols-3 gap-2">
            {centers.map((center, cluster) => (
              <div key={cluster} className="rounded-xl border border-zinc-200 p-3 text-center dark:border-zinc-700">
                <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: COLORS[cluster] }}>
                  {["Low", "Middle", "High"][cluster]} group
                </p>
                <p className="mt-1 font-mono text-sm font-bold">{center.toFixed(2)}</p>
                <p className="text-[10px] text-zinc-400">{counts[cluster]} samples</p>
              </div>
            ))}
          </div>
        </div>
      }
      controls={
        <>
          <AlgoTradingSlider
            label="Current ATR to classify"
            value={currentAtr}
            min={0.5}
            max={6.5}
            step={0.1}
            displayValue={currentAtr.toFixed(1)}
            onChange={setCurrentAtr}
          />
          <button
            type="button"
            onClick={runIteration}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-emerald-950 transition hover:bg-emerald-400"
          >
            Assign points and update centers
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-500 transition hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset initial centers
          </button>
          <p className="text-xs leading-relaxed text-zinc-500">
            {hasConverged ? "Centers no longer moved on the latest iteration." : "Repeat the assign-and-update step until the centers stop moving."}
          </p>
        </>
      }
      insight={
        <>
          The current ATR <strong>{currentAtr.toFixed(1)}</strong> is closest to the{" "}
          <strong>{["low", "middle", "high"][nearestCurrent]}</strong> center at <strong>{centers[nearestCurrent].toFixed(2)}</strong>.
          Changing current ATR changes its label without retraining the historical groups.
        </>
      }
      formula={<>label(x) = nearest center to x<br />center = mean(values assigned to that cluster)<br />Fit window excludes the current ATR</>}
      onComplete={onComplete}
    />
  );
};
