import React, { useMemo, useState } from "react";
import { AlgoTradingChoiceButton, AlgoTradingSlider, AlgoTradingVisualLab } from "../../codeConceptsView/AlgoTradingVisualLab";

const SCENARIOS = [
  { id: "contained", label: "Contained bar", previousClose: 100, open: 102, high: 106, low: 101, close: 104, previousAtr: 4.8 },
  { id: "gap-up", label: "Gap up", previousClose: 100, open: 109, high: 112, low: 108, close: 111, previousAtr: 6.5 },
  { id: "gap-down", label: "Gap down", previousClose: 100, open: 91, high: 94, low: 89, close: 91, previousAtr: 6.2 },
] as const;

type RangeAtrExplorerProps = {
  onComplete?: () => void;
};

export const RangeAtrExplorer: React.FC<RangeAtrExplorerProps> = ({ onComplete }) => {
  const [scenarioId, setScenarioId] = useState<(typeof SCENARIOS)[number]["id"]>("contained");
  const [period, setPeriod] = useState(10);
  const scenario = SCENARIOS.find((item) => item.id === scenarioId) || SCENARIOS[0];
  const calculation = useMemo(() => {
    const intrabar = scenario.high - scenario.low;
    const highGap = Math.abs(scenario.high - scenario.previousClose);
    const lowGap = Math.abs(scenario.low - scenario.previousClose);
    const trueRange = Math.max(intrabar, highGap, lowGap);
    const atr = scenario.previousAtr + (trueRange - scenario.previousAtr) / period;
    return {
      intrabar,
      highGap,
      lowGap,
      trueRange,
      atr,
      rangePercent: (intrabar / scenario.close) * 100,
      closeLocation: (scenario.close - scenario.low) / (scenario.high - scenario.low),
    };
  }, [scenario, period]);

  const minPrice = Math.min(scenario.low, scenario.previousClose) - 2;
  const maxPrice = Math.max(scenario.high, scenario.previousClose) + 2;
  const y = (price: number) => 204 - ((price - minPrice) / (maxPrice - minPrice)) * 150;
  const bodyTop = Math.min(y(scenario.open), y(scenario.close));
  const bodyHeight = Math.max(4, Math.abs(y(scenario.open) - y(scenario.close)));
  const closeAboveOpen = scenario.close >= scenario.open;

  return (
    <AlgoTradingVisualLab
      eyebrow="Basic · Range and volatility"
      title="What counts as the bar's true movement?"
      description="Switch between an ordinary bar and gap bars. Compare the candle range with the previous close, then see how True Range feeds one Wilder ATR update."
      visual={
        <div className="w-full space-y-4">
          <svg viewBox="0 0 520 255" role="img" aria-label="Candlestick with previous close and True Range distances" className="h-auto w-full">
            <line x1="44" y1="215" x2="488" y2="215" stroke="#a1a1aa" strokeWidth="1" />
            {[0, 1, 2, 3].map((index) => {
              const price = minPrice + ((maxPrice - minPrice) * index) / 3;
              return (
                <g key={index}>
                  <line x1="55" y1={y(price)} x2="485" y2={y(price)} stroke="#94a3b8" strokeOpacity="0.18" strokeDasharray="3 5" />
                  <text x="8" y={y(price) + 4} fontSize="11" fill="#64748b">{price.toFixed(0)}</text>
                </g>
              );
            })}
            <line x1="60" y1={y(scenario.previousClose)} x2="480" y2={y(scenario.previousClose)} stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 5" />
            <text x="66" y={y(scenario.previousClose) - 8} fontSize="12" fill="#b45309">Previous close {scenario.previousClose}</text>
            <line x1="285" y1={y(scenario.high)} x2="285" y2={y(scenario.low)} stroke={closeAboveOpen ? "#10b981" : "#f43f5e"} strokeWidth="4" strokeLinecap="round" />
            <rect
              x="263"
              y={bodyTop}
              width="44"
              height={bodyHeight}
              rx="4"
              fill={closeAboveOpen ? "#10b981" : "#f43f5e"}
              fillOpacity="0.78"
            />
            <line x1="307" y1={y(scenario.high)} x2="355" y2={y(scenario.high)} stroke="#10b981" strokeWidth="1.5" />
            <text x="362" y={y(scenario.high) + 4} fontSize="12" fill="#059669">High {scenario.high}</text>
            <line x1="307" y1={y(scenario.low)} x2="355" y2={y(scenario.low)} stroke="#0ea5e9" strokeWidth="1.5" />
            <text x="362" y={y(scenario.low) + 4} fontSize="12" fill="#0284c7">Low {scenario.low}</text>
            <line x1="250" y1={y(scenario.open)} x2="263" y2={y(scenario.open)} stroke="#64748b" strokeWidth="2" />
            <line x1="307" y1={y(scenario.close)} x2="320" y2={y(scenario.close)} stroke={closeAboveOpen ? "#047857" : "#be123c"} strokeWidth="2" />
            <text x="258" y="240" fontSize="11" fill="#64748b">Current bar</text>
          </svg>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "High − low", value: calculation.intrabar, color: "text-sky-700 dark:text-sky-300" },
              { label: "|High − prev close|", value: calculation.highGap, color: "text-amber-700 dark:text-amber-300" },
              { label: "|Low − prev close|", value: calculation.lowGap, color: "text-amber-700 dark:text-amber-300" },
              { label: "True Range", value: calculation.trueRange, color: "text-emerald-700 dark:text-emerald-300" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-950">
                <p className="min-h-8 text-[10px] font-bold uppercase leading-4 tracking-wide text-zinc-400">{metric.label}</p>
                <p className={["font-mono text-xl font-black", metric.color].join(" ")}>{metric.value.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      }
      controls={
        <>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((item) => (
              <AlgoTradingChoiceButton key={item.id} active={scenarioId === item.id} onClick={() => setScenarioId(item.id)}>
                {item.label}
              </AlgoTradingChoiceButton>
            ))}
          </div>
          <AlgoTradingSlider
            label="Wilder smoothing period"
            value={period}
            min={2}
            max={20}
            displayValue={String(period)}
            onChange={setPeriod}
          />
          <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Previous ATR</span>
              <span className="font-mono">{scenario.previousAtr.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm font-bold">
              <span>Updated ATR</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-300">{calculation.atr.toFixed(2)}</span>
            </div>
          </div>
        </>
      }
      insight={
        <>
          True Range is <strong>{calculation.trueRange.toFixed(2)}</strong>, the largest of the three distances. The bar's simple range is{" "}
          <strong>{calculation.rangePercent.toFixed(2)}%</strong> of its close, while the close is at{" "}
          <strong>{(calculation.closeLocation * 100).toFixed(0)}%</strong> of the bar range. These relative measures answer different questions.
        </>
      }
      formula={
        <>
          TR = max(H − L, |H − prevClose|, |L − prevClose|)<br />
          ATR update = prevATR + (TR − prevATR) / period
        </>
      }
      onComplete={onComplete}
    />
  );
};
