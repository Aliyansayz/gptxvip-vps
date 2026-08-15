import React, { useEffect, useRef } from "react";

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartWidgetProps {
  data: OHLCData[];
  entryPrice: number;
  initialSL: number;
  tp1: number;
  title?: string;
}

export const CandlestickChartWidget: React.FC<CandlestickChartWidgetProps> = ({
  data,
  entryPrice,
  initialSL,
  tp1,
  title = "Partial Close & Breakeven Dynamics",
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
        // Handle high-DPI displays
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

      const padding = { top: 40, right: 80, bottom: 30, left: 20 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      // Find min/max
      let minPrice = Math.min(...data.map((d) => d.low), initialSL) * 0.995;
      let maxPrice = Math.max(...data.map((d) => d.high), tp1) * 1.005;

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

      // Draw Levels
      const drawLevel = (
        price: number,
        color: string,
        label: string,
        lineDash: number[] = [],
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
        ctx.fillRect(width - padding.right, y - 10, padding.right, 20);

        // Label Text
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(label, width - padding.right + 6, y + 4);
      };

      drawLevel(tp1, "#3b82f6", "TP1", [5, 5]);
      drawLevel(entryPrice, "#10b981", "Entry / BE", [2, 2]);
      drawLevel(initialSL, "#ef4444", "Initial SL", [5, 5]);

      // Annotations
      // Find index where price hits TP1
      const tp1Index = data.findIndex((d) => d.high >= tp1);
      if (tp1Index !== -1) {
        const x = getX(tp1Index);
        const y = getY(tp1);

        // TP1 Hit Marker
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // TP1 Label
        ctx.fillStyle = "#3b82f6";
        ctx.font = "bold 11px Inter";
        ctx.textAlign = "center";
        ctx.fillText("50% CLOSE", x, y - 15);

        // Draw arrow from Initial SL to Entry (Breakeven move)
        const slY = getY(initialSL);
        const entryY = getY(entryPrice);

        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x, slY);
        ctx.lineTo(x, entryY + 10);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(x, entryY + 6);
        ctx.lineTo(x - 5, entryY + 14);
        ctx.lineTo(x + 5, entryY + 14);
        ctx.fillStyle = "#f59e0b";
        ctx.fill();

        // BE Label
        ctx.fillStyle = "#f59e0b";
        ctx.textAlign = "left";
        ctx.fillText("SL moved to BE", x + 10, (slY + entryY) / 2);
      }
    };

    window.addEventListener("resize", resize);
    // Initial small delay to ensure container is sized
    setTimeout(resize, 50);

    return () => window.removeEventListener("resize", resize);
  }, [data, entryPrice, initialSL, tp1]);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <h3 className="text-sm">{title}</h3>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> TP1
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
            Entry/BE
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Initial SL
          </div>
        </div>
      </div>
      <div className="p-4 relative w-full h-[400px]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
};
