import React, { useState } from "react";
import { AlgoTradingSlider, AlgoTradingVisualLab } from "../../codeConceptsView/AlgoTradingVisualLab";

const HIGHS = [8, 10, 13, 17, 14, 12, 9, 11, 15];
const PIVOT_INDEX = 3;
const MAX_RIGHT_BARS = HIGHS.length - PIVOT_INDEX - 1;

type PivotConfirmationExplorerProps = {
  onComplete?: () => void;
};

export const PivotConfirmationExplorer: React.FC<PivotConfirmationExplorerProps> = ({ onComplete }) => {
  const [pivotLength, setPivotLength] = useState(2);
  const [rightBars, setRightBars] = useState(0);
  const minValue = 6;
  const maxValue = 19;
  const y = (value: number) => 196 - ((value - minValue) / (maxValue - minValue)) * 140;
  const x = (index: number) => 48 + index * 54;
  const visibleEnd = Math.min(HIGHS.length - 1, PIVOT_INDEX + rightBars);
  const rightValuesAvailable = HIGHS.slice(PIVOT_INDEX + 1, visibleEnd + 1);
  const rightValuesForConfirmation = rightValuesAvailable.slice(0, pivotLength);
  const leftValues = HIGHS.slice(Math.max(0, PIVOT_INDEX - pivotLength), PIVOT_INDEX);
  const leftSideIsHigh = leftValues.length === pivotLength && leftValues.every((value) => HIGHS[PIVOT_INDEX] > value);
  const rightSideIsLower = rightValuesAvailable.length >= pivotLength && rightValuesForConfirmation.every((value) => HIGHS[PIVOT_INDEX] > value);
  const isConfirmed = leftSideIsHigh && rightSideIsLower;
  const waitingFor = Math.max(0, pivotLength - rightBars);
  const visibleValues = HIGHS.slice(0, visibleEnd + 1);
  const path = visibleValues.map((value, index) => (index === 0 ? "M " : "L ") + x(index) + " " + y(value)).join(" ");

  return (
    <AlgoTradingVisualLab
      eyebrow="Basic · Pivot confirmation"
      title="A pivot is recognized after the turn"
      description="Reveal bars after a candidate swing high. The algorithm needs the chosen number of right-side bars before it can label the past high as a pivot."
      visual={
        <div className="w-full space-y-4">
          <svg viewBox="0 0 560 250" role="img" aria-label="Price swing with a candidate high and bars revealed for pivot confirmation" className="h-auto w-full">
            {[0, 1, 2, 3].map((index) => {
              const lineY = 36 + index * 49;
              return <line key={index} x1="36" y1={lineY} x2="535" y2={lineY} stroke="#94a3b8" strokeOpacity="0.18" strokeDasharray="3 5" />;
            })}
            <path d={path} fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {visibleValues.map((value, index) => (
              <g key={index}>
                <circle
                  cx={x(index)}
                  cy={y(value)}
                  r={index === PIVOT_INDEX ? 8 : 5}
                  fill={index === PIVOT_INDEX ? (isConfirmed ? "#10b981" : "#f59e0b") : "#38bdf8"}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
                {index === PIVOT_INDEX && (
                  <text x={x(index) - 43} y={y(value) - 17} fontSize="11" fontWeight="700" fill={isConfirmed ? "#059669" : "#b45309"}>
                    {isConfirmed ? "Confirmed pivot" : "Candidate high"}
                  </text>
                )}
              </g>
            ))}
            <line x1={x(PIVOT_INDEX)} y1={y(HIGHS[PIVOT_INDEX]) + 12} x2={x(PIVOT_INDEX)} y2="220" stroke="#f59e0b" strokeDasharray="4 4" />
            <text x="38" y="242" fontSize="11" fill="#64748b">Bars before candidate</text>
            <text x="370" y="242" fontSize="11" fill="#64748b">Bars revealed after candidate →</text>
            <text x={x(PIVOT_INDEX) + 10} y="216" fontSize="10" fill="#b45309">candidate index</text>
          </svg>
          <div className={[
            "rounded-xl border px-4 py-3 text-sm font-bold",
            isConfirmed
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
          ].join(" ")}>
            {isConfirmed
              ? "Pivot confirmed after the required right-side bars arrived. A live system can use it now."
              : leftSideIsHigh
                ? "Candidate not confirmed yet. Reveal " + waitingFor + " more right-side bar(s)."
                : "The selected left-side window is not enough to confirm this candidate."}
          </div>
        </div>
      }
      controls={
        <>
          <AlgoTradingSlider
            label="Bars required on each side"
            value={pivotLength}
            min={1}
            max={3}
            displayValue={String(pivotLength)}
            onChange={setPivotLength}
          />
          <AlgoTradingSlider
            label="Right-side bars revealed"
            value={rightBars}
            min={0}
            max={MAX_RIGHT_BARS}
            displayValue={String(rightBars)}
            onChange={setRightBars}
          />
          <button
            type="button"
            onClick={() => setRightBars((current) => Math.min(MAX_RIGHT_BARS, current + 1))}
            disabled={rightBars >= MAX_RIGHT_BARS}
            className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-emerald-300"
          >
            Reveal next bar
          </button>
        </>
      }
      insight={
        isConfirmed
          ? "The source indexes the possible pivot at i − pivot_len. The right-side evidence is available now, so the confirmation is causal at this bar even though the point is drawn at the earlier high."
          : "The high at index " + PIVOT_INDEX + " may look obvious in hindsight, but the detector must wait for " + pivotLength + " lower highs to its right before it confirms the swing."
      }
      formula={<>candidate index = current index − pivot_len<br />confirmed only when left and right windows agree</>}
      onComplete={onComplete}
    />
  );
};
