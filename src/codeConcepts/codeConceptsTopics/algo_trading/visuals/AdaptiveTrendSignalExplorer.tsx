import React, { useState } from "react";
import { AlgoTradingChoiceButton, AlgoTradingSlider, AlgoTradingVisualLab } from "../../codeConceptsView/AlgoTradingVisualLab";

type TrendDirection = "long" | "short";
type AdaptiveTrendSignalExplorerProps = {
  onComplete?: () => void;
};

export const AdaptiveTrendSignalExplorer: React.FC<AdaptiveTrendSignalExplorerProps> = ({ onComplete }) => {
  const [atr, setAtr] = useState(2.4);
  const [multiplier, setMultiplier] = useState(1.7);
  const [direction, setDirection] = useState<TrendDirection>("long");
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [guardsPass, setGuardsPass] = useState(true);
  const midpoint = 100;
  const distance = atr * multiplier;
  const upperBand = midpoint + distance;
  const lowerBand = midpoint - distance;
  const close = direction === "long" ? midpoint + distance * 0.38 : midpoint - distance * 0.38;
  const activeBand = direction === "long" ? lowerBand : upperBand;
  const riskDistance = direction === "long" ? close - lowerBand : upperBand - close;
  const signalState = !isConfirmed ? "Waiting for trend confirmation" : !guardsPass ? "Entry blocked by a filter" : direction === "long" ? "Long signal is eligible" : "Short signal is eligible";
  const span = Math.max(8, distance * 1.8);
  const minPrice = midpoint - span;
  const maxPrice = midpoint + span;
  const y = (price: number) => 206 - ((price - minPrice) / (maxPrice - minPrice)) * 155;

  return (
    <AlgoTradingVisualLab
      eyebrow="Advanced · Signal composition"
      title="From adaptive volatility to an entry decision"
      description="Adjust the ATR distance and walk through the separate gates. An eligible signal needs confirmed direction and every configured guard to pass."
      visual={
        <div className="w-full space-y-4">
          <svg viewBox="0 0 560 250" role="img" aria-label="Adaptive Supertrend bands and current price" className="h-auto w-full">
            {[minPrice, midpoint, maxPrice].map((price, index) => (
              <g key={index}>
                <line x1="56" y1={y(price)} x2="535" y2={y(price)} stroke="#94a3b8" strokeOpacity="0.22" strokeDasharray={index === 1 ? "0" : "4 5"} />
                <text x="8" y={y(price) + 4} fontSize="11" fill="#64748b">{price.toFixed(1)}</text>
              </g>
            ))}
            <line x1="95" y1={y(upperBand)} x2="488" y2={y(upperBand)} stroke="#a1a1aa" strokeWidth="2" strokeDasharray="7 5" />
            <text x="494" y={y(upperBand) + 4} fontSize="11" fill="#71717a">Upper band</text>
            <line x1="95" y1={y(lowerBand)} x2="488" y2={y(lowerBand)} stroke="#a1a1aa" strokeWidth="2" strokeDasharray="7 5" />
            <text x="494" y={y(lowerBand) + 4} fontSize="11" fill="#71717a">Lower band</text>
            <line
              x1="95"
              y1={y(activeBand)}
              x2="488"
              y2={y(activeBand)}
              stroke={direction === "long" ? "#10b981" : "#f43f5e"}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text x="115" y={y(activeBand) + (direction === "long" ? 18 : -10)} fontSize="12" fontWeight="700" fill={direction === "long" ? "#059669" : "#e11d48"}>
              Reference band before trailing update
            </text>
            <line x1="95" y1={y(close)} x2="488" y2={y(close)} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 5" />
            <circle cx="310" cy={y(close)} r="8" fill="#8b5cf6" stroke="white" strokeWidth="3" />
            <text x="320" y={y(close) - 8} fontSize="12" fontWeight="700" fill="#7c3aed">Current close {close.toFixed(2)}</text>
            <text x="96" y="235" fontSize="11" fill="#64748b">Initial band distance = {multiplier.toFixed(1)} × ATR {atr.toFixed(1)}</text>
          </svg>
          <div className={[
            "rounded-xl border p-4",
            isConfirmed && guardsPass
              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
              : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
          ].join(" ")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500">Decision state</span>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">{signalState}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
              Reference band: <strong>{activeBand.toFixed(2)}</strong> · distance from close: <strong>{riskDistance.toFixed(2)}</strong> ({(riskDistance / atr).toFixed(2)} ATR)
            </p>
          </div>
        </div>
      }
      controls={
        <>
          <AlgoTradingSlider
            label="Adaptive ATR"
            value={atr}
            min={0.5}
            max={5}
            step={0.1}
            displayValue={atr.toFixed(1)}
            onChange={setAtr}
          />
          <AlgoTradingSlider
            label="Band multiplier"
            value={multiplier}
            min={0.8}
            max={3}
            step={0.1}
            displayValue={multiplier.toFixed(1)}
            onChange={setMultiplier}
          />
          <div className="flex gap-2">
            <AlgoTradingChoiceButton active={direction === "long"} onClick={() => setDirection("long")}>Up direction</AlgoTradingChoiceButton>
            <AlgoTradingChoiceButton active={direction === "short"} onClick={() => setDirection("short")}>Down direction</AlgoTradingChoiceButton>
          </div>
          <button
            type="button"
            onClick={() => setIsConfirmed((current) => !current)}
            aria-pressed={isConfirmed}
            className="flex w-full items-center justify-between rounded-xl border border-zinc-200 px-3 py-2.5 text-left text-xs font-bold dark:border-zinc-700"
          >
            <span>Trend confirmed for required bars</span>
            <span className={isConfirmed ? "text-emerald-600 dark:text-emerald-300" : "text-amber-600 dark:text-amber-300"}>{isConfirmed ? "YES" : "WAIT"}</span>
          </button>
          <button
            type="button"
            onClick={() => setGuardsPass((current) => !current)}
            aria-pressed={guardsPass}
            className="flex w-full items-center justify-between rounded-xl border border-zinc-200 px-3 py-2.5 text-left text-xs font-bold dark:border-zinc-700"
          >
            <span>Shock, risk, momentum, and divergence guards</span>
            <span className={guardsPass ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}>{guardsPass ? "PASS" : "BLOCK"}</span>
          </button>
        </>
      }
      insight={
        <>
          The multiplier scales the ATR-based band distance. Confirmation and entry filters answer separate questions: the trend state establishes direction, while shock, stop-distance, momentum, and divergence checks can still block an otherwise eligible signal.
        </>
      }
      formula={
        <>
          initial bands = midpoint ± multiplier × adaptive ATR; then trail by state<br />
          eligible = confirmed trend AND all entry guards pass<br />
          risk = distance from close to active band
        </>
      }
      onComplete={onComplete}
    />
  );
};
