import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";

export interface PriceData {
  time: string;
  price: number;
}

interface TradingChartProps {
  title: string;
  data: PriceData[];
  stopLoss?: number;
  stopLoss2?: number;
  takeProfitMin?: number;
  takeProfitMax?: number;
  entryPrice?: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  title,
  data,
  stopLoss,
  stopLoss2,
  takeProfitMin,
  takeProfitMax,
  entryPrice,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-2xl transition-colors duration-300">
      <h3 className="text-zinc-500 dark:text-zinc-400 text-xs mb-4">{title}</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-zinc-300 dark:text-zinc-800"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="currentColor"
              className="text-zinc-400 dark:text-zinc-500"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="currentColor"
              className="text-zinc-400 dark:text-zinc-500"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--chart-tooltip-bg)",
                border: "1px solid var(--chart-tooltip-border)",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#10b981" }}
            />

            {/* Take Profit Range Area */}
            {takeProfitMin && takeProfitMax && (
              <ReferenceLine
                y={takeProfitMax}
                stroke="transparent"
                label={{
                  position: "right",
                  value: "TP Max",
                  fill: "#10b981",
                  fontSize: 10,
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />

            {/* Take Profit Range Shading */}
            {takeProfitMin && takeProfitMax && (
              <ReferenceLine y={takeProfitMin} stroke="transparent" />
            )}

            {/* Entry Price */}
            {entryPrice && (
              <ReferenceLine
                y={entryPrice}
                stroke="#71717a"
                strokeDasharray="5 5"
                label={{
                  position: "left",
                  value: "Entry",
                  fill: "#71717a",
                  fontSize: 10,
                }}
              />
            )}

            {/* Stop Loss 1 */}
            {stopLoss && (
              <ReferenceLine
                y={stopLoss}
                stroke="#ef4444"
                strokeWidth={2}
                label={{
                  position: "right",
                  value: "SL",
                  fill: "#ef4444",
                  fontSize: 10,
                }}
              />
            )}

            {/* Stop Loss 2 */}
            {stopLoss2 && (
              <ReferenceLine
                y={stopLoss2}
                stroke="#f87171"
                strokeDasharray="3 3"
                label={{
                  position: "right",
                  value: "SL 2",
                  fill: "#f87171",
                  fontSize: 10,
                }}
              />
            )}

            {/* Take Profit Min */}
            {takeProfitMin && (
              <ReferenceLine
                y={takeProfitMin}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{
                  position: "right",
                  value: "TP Min",
                  fill: "#10b981",
                  fontSize: 10,
                }}
              />
            )}

            {/* Take Profit Max */}
            {takeProfitMax && (
              <ReferenceLine
                y={takeProfitMax}
                stroke="#059669"
                strokeWidth={2}
                label={{
                  position: "right",
                  value: "TP Max",
                  fill: "#059669",
                  fontSize: 10,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {entryPrice && (
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase font-bold">
              Entry
            </span>
            <span className="text-zinc-800 dark:text-zinc-200 font-mono">
              ${entryPrice.toFixed(2)}
            </span>
          </div>
        )}
        {stopLoss && (
          <div className="flex flex-col">
            <span className="text-[10px] text-red-500/70 uppercase font-bold">
              Stop Loss
            </span>
            <span className="text-red-500 dark:text-red-400 font-mono">
              ${stopLoss.toFixed(2)}
            </span>
          </div>
        )}
        {takeProfitMin && (
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70 uppercase font-bold">
              Target Min
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
              ${takeProfitMin.toFixed(2)}
            </span>
          </div>
        )}
        {takeProfitMax && (
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-500 uppercase font-bold">
              Target Max
            </span>
            <span className="text-emerald-600 dark:text-emerald-500 font-mono">
              ${takeProfitMax.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
