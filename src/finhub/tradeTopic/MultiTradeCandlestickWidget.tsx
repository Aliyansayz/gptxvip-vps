import React, { useEffect, useRef } from "react";

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface TradeLevel {
  id: string;
  label: string;
  entryPrice: number;
  initialSL: number;
  tp1: number;
  color: string;
}

interface MultiTradeCandlestickWidgetProps {
  data: OHLCData[];
  trades: TradeLevel[];
  title?: string;
}

export const MultiTradeCandlestickWidget: React.FC<MultiTradeCandlestickWidgetProps> = ({
  data,
  trades,
  title = "Multiple Trades Execution",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = 400 * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `400px`;
        draw(parent.clientWidth, 400);
      }
    };

    const draw = (width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);

      if (data.length === 0) return;

      const padding = { top: 40, right: 100, bottom: 30, left: 20 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      // Find min/max across data and all trades
      let minPrice = Math.min(...data.map((d) => d.low));
      let maxPrice = Math.max(...data.map((d) => d.high));

      trades.forEach(t => {
        minPrice = Math.min(minPrice, t.initialSL);
        maxPrice = Math.max(maxPrice, t.tp1);
      });

      minPrice *= 0.995;
      maxPrice *= 1.005;

      const priceRange = maxPrice - minPrice;

      const getY = (price: number) =>
        padding.top +
        chartHeight -
        ((price - minPrice) / priceRange) * chartHeight;
      const getX = (index: number) =>
        padding.left + (index / (data.length - 1)) * chartWidth;

      const candleWidth = Math.max(2, (chartWidth / data.length) * 0.6);

      // Draw Grid
      ctx.strokeStyle = "rgba(150, 150, 150, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight * i) / 5;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
      }

      // Draw Candles
      data.forEach((d, i) => {
        const x = getX(i);
        const yOpen = getY(d.open);
        const yClose = getY(d.close);
        const yHigh = getY(d.high);
        const yLow = getY(d.low);

        const isGreen = d.close >= d.open;
        const color = isGreen ? "#10b981" : "#ef4444";

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        ctx.fillStyle = color;
        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1.5);
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      });

      // Draw Levels for each trade
      const drawLevel = (
        price: number,
        color: string,
        label: string,
        lineDash: number[] = [],
        offsetY: number = 0
      ) => {
        const y = getY(price);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash(lineDash);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label Background
        ctx.fillStyle = color;
        ctx.fillRect(width - padding.right, y - 10 + offsetY, padding.right, 20);

        // Label Text
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(label, width - padding.right + 6, y + 4 + offsetY);
      };

      trades.forEach((trade, index) => {
        // Stagger labels slightly if they are too close, but for simplicity we just draw them
        // We can use the index to slightly offset the label background if needed, but let's just draw
        drawLevel(trade.tp1, trade.color, `${trade.id} TP`, [5, 5]);
        drawLevel(trade.entryPrice, trade.color, `${trade.id} Entry`, [2, 2]);
        drawLevel(trade.initialSL, trade.color, `${trade.id} SL`, [5, 5]);
      });
    };

    window.addEventListener("resize", resize);
    setTimeout(resize, 50);

    return () => window.removeEventListener("resize", resize);
  }, [data, trades]);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <h3 className="text-sm">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-mono">
          {trades.map((trade) => (
            <div key={trade.id} className="flex items-center gap-1.5">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: trade.color }}
              ></span>{" "}
              {trade.label}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 relative w-full h-[400px]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
};
