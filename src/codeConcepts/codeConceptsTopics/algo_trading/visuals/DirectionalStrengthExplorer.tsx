import React, { useState } from "react";
import { AlgoTradingChoiceButton, AlgoTradingVisualLab } from "../../codeConceptsView/AlgoTradingVisualLab";

const MARKETS = [
  {
    id: "up",
    label: "Steady uptrend",
    values: [20, 22, 24, 27, 30, 33, 36, 39, 43],
    plus: 36,
    minus: 9,
    adx: 31,
    reading: "The trend-strength reading is high and +DI is above −DI, so direction is upward in this schematic example.",
  },
  {
    id: "down",
    label: "Steady downtrend",
    values: [43, 40, 37, 34, 31, 28, 25, 22, 19],
    plus: 8,
    minus: 35,
    adx: 29,
    reading: "The trend-strength reading is high and −DI is above +DI, so direction is downward in this schematic example.",
  },
  {
    id: "range",
    label: "Choppy range",
    values: [29, 32, 28, 31, 27, 30, 28, 32, 29],
    plus: 16,
    minus: 15,
    adx: 13,
    reading: "The directional lines are close and the trend-strength reading is low. Price still moves, but this example has little persistent direction.",
  },
] as const;

type DirectionalStrengthExplorerProps = {
  onComplete?: () => void;
};

export const DirectionalStrengthExplorer: React.FC<DirectionalStrengthExplorerProps> = ({ onComplete }) => {
  const [marketId, setMarketId] = useState<(typeof MARKETS)[number]["id"]>("up");
  const market = MARKETS.find((item) => item.id === marketId) || MARKETS[0];
  const minPrice = Math.min(...market.values) - 3;
  const maxPrice = Math.max(...market.values) + 3;
  const points = market.values.map((value, index) => {
    const x = 34 + (index * 412) / (market.values.length - 1);
    const y = 152 - ((value - minPrice) / (maxPrice - minPrice)) * 104;
    return x + "," + y;
  }).join(" ");
  const strengthLabel = market.adx >= 25 ? "Stronger trend" : market.adx < 20 ? "Weak / range-like" : "Developing";

  return (
    <AlgoTradingVisualLab
      eyebrow="Basic · Trend strength"
      title="Is the market trending, and in which direction?"
      description="Compare the ADX strength reading with the +DI and −DI direction lines. The demo values are schematic so the roles of the three lines stay clear."
      visual={
        <div className="w-full space-y-5">
          <div className="rounded-2xl bg-zinc-950 p-4 text-zinc-100 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Illustrative price path</span>
              <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-[10px] font-mono uppercase text-zinc-400">schematic</span>
            </div>
            <svg viewBox="0 0 480 190" role="img" aria-label="Illustrative market price path" className="h-auto w-full">
              {[0, 1, 2, 3].map((index) => {
                const y = 30 + index * 40;
                return <line key={index} x1="25" y1={y} x2="455" y2={y} stroke="#475569" strokeOpacity="0.3" strokeDasharray="3 5" />;
              })}
              <polyline points={points} fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              {market.values.map((value, index) => {
                const coords = points.split(" ")[index].split(",");
                return <circle key={index} cx={Number(coords[0])} cy={Number(coords[1])} r="4" fill="#a7f3d0" stroke="#052e2b" strokeWidth="2" />;
              })}
              <text x="26" y="180" fill="#94a3b8" fontSize="11">Earlier bars</text>
              <text x="389" y="180" fill="#94a3b8" fontSize="11">Current</text>
            </svg>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-500">Directional indicators</span>
                <span className="text-[10px] text-zinc-400">0–50 scale</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: "+DI", value: market.plus, color: "#10b981" },
                  { name: "−DI", value: market.minus, color: "#38bdf8" },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold">{item.name}</span>
                      <span className="font-mono text-zinc-500">{item.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: (item.value * 2) + "%", backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-500">ADX strength</span>
                <span className="font-mono text-lg font-black text-violet-600 dark:text-violet-300">{market.adx}</span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div className="h-full rounded-full bg-violet-500 transition-all duration-300" style={{ width: (market.adx * 2) + "%" }} />
                <span className="absolute inset-y-[-3px] left-[40%] border-l-2 border-dashed border-zinc-400" title="20 reference" />
                <span className="absolute inset-y-[-3px] left-1/2 border-l-2 border-dashed border-amber-500" title="25 reference" />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-zinc-400"><span>0</span><span>20</span><span>25</span><span>50</span></div>
              <p className="mt-3 text-xs font-bold text-violet-700 dark:text-violet-300">{strengthLabel}</p>
            </div>
          </div>
          <p className="text-center text-[11px] leading-relaxed text-zinc-400">Illustrative DMI / ADX readings; this visual teaches interpretation and does not calculate values from the drawn path.</p>
        </div>
      }
      controls={
        <>
          <div className="grid gap-2">
            {MARKETS.map((item) => (
              <AlgoTradingChoiceButton key={item.id} active={marketId === item.id} onClick={() => setMarketId(item.id)}>
                {item.label}
              </AlgoTradingChoiceButton>
            ))}
          </div>
          <div className="rounded-xl bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
            Pick a market shape and compare which line answers “strength?” with which line pair answers “direction?”
          </div>
        </>
      }
      insight={
        <>
          <strong>ADX does not pick a side.</strong> In this example, +DI is {market.plus} and −DI is {market.minus}; the larger directional line gives context. ADX is {market.adx}, which describes trend strength.
        </>
      }
      formula={
        <>
          +DI and −DI compare smoothed directional movement with smoothed True Range.<br />
          DX = 100 × |+DI − −DI| / (+DI + −DI)<br />
          ADX = a smoothed average of DX
        </>
      }
      onComplete={onComplete}
    />
  );
};
