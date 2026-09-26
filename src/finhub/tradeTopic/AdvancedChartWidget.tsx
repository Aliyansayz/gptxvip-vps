import React, { useEffect, useRef, useState } from "react";

export const AdvancedChartWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState("$42,069.00");
  const [tradeMessage, setTradeMessage] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration
    const config = {
      padding: { top: 50, bottom: 50, left: 20, right: 80 },
      candleWidth: 8,
      candleGap: 4,
      colors: {
        up: "#22c55e",
        down: "#ef4444",
        upperBand: "#22d3ee",
        lowerBand: "#f472b6",
        basis: "#fb923c",
        grid: "#1e293b",
        text: "#94a3b8",
        entry: "#6366f1",
        tp: "#10b981",
        sl: "#f43f5e",
      },
    };

    let data: any[] = [];
    let chartWidth: number, chartHeight: number;

    // 1. Generate Mock Data
    function generateData(count = 100) {
      let price = 42000;
      const result = [];
      const now = Date.now();

      for (let i = 0; i < count; i++) {
        const volatility = 200;
        const open = price + (Math.random() - 0.5) * volatility;
        const close = open + (Math.random() - 0.5) * volatility;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;

        result.push({
          time: now - (count - i) * 60000,
          open,
          high,
          low,
          close,
        });
        price = close;
      }
      return result;
    }

    // 2. Technical Indicator Calculations (Bollinger Bands)
    function calculateIndicators(candles: any[]) {
      const period = 20;
      const stdDevMult = 2;

      for (let i = 0; i < candles.length; i++) {
        if (i < period) continue;

        const slice = candles.slice(i - period + 1, i + 1);
        const closes = slice.map((c) => c.close);

        // Simple Moving Average
        const sum = closes.reduce((a, b) => a + b, 0);
        const sma = sum / period;

        // Standard Deviation
        const squareDiffs = closes.map((v) => Math.pow(v - sma, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / period;
        const stdDev = Math.sqrt(avgSquareDiff);

        candles[i].basis = sma;
        candles[i].upper = sma + stdDev * stdDevMult;
        candles[i].lower = sma - stdDev * stdDevMult;
      }
    }

    // 3. Coordinate Mapping
    function getX(index: number) {
      const totalCandleWidth = config.candleWidth + config.candleGap;
      return (
        chartWidth -
        config.padding.right -
        (data.length - 1 - index) * totalCandleWidth
      );
    }

    function getY(price: number, minPrice: number, maxPrice: number) {
      const range = maxPrice - minPrice;
      const usableHeight =
        chartHeight - config.padding.top - config.padding.bottom;
      return (
        chartHeight -
        config.padding.bottom -
        ((price - minPrice) / range) * usableHeight
      );
    }

    // 4. Drawing Logic
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (data.length === 0) return;

      // Determine Visible Range for Scaling
      const visibleData = data.filter((_, i) => getX(i) > -50);
      if (visibleData.length === 0) return;

      const minPrice = Math.min(...visibleData.map((d) => d.low)) * 0.995;
      const maxPrice = Math.max(...visibleData.map((d) => d.high)) * 1.005;

      drawGrid(minPrice, maxPrice);

      // Draw Bands (Bands should be behind candles)
      drawBands(minPrice, maxPrice);

      // Draw Candlesticks
      data.forEach((d, i) => {
        const x = getX(i);
        if (x < -20 || x > chartWidth + 20) return;

        const isUp = d.close >= d.open;
        ctx.strokeStyle = isUp ? config.colors.up : config.colors.down;
        ctx.fillStyle = isUp ? config.colors.up : config.colors.down;
        ctx.lineWidth = 1;

        // Wick
        ctx.beginPath();
        ctx.moveTo(x, getY(d.high, minPrice, maxPrice));
        ctx.lineTo(x, getY(d.low, minPrice, maxPrice));
        ctx.stroke();

        // Body
        const yOpen = getY(d.open, minPrice, maxPrice);
        const yClose = getY(d.close, minPrice, maxPrice);
        const bodyH = Math.abs(yOpen - yClose) || 1;
        ctx.fillRect(
          x - config.candleWidth / 2,
          Math.min(yOpen, yClose),
          config.candleWidth,
          bodyH,
        );
      });

      // Draw Entry Points (Simulated)
      drawEntryPoints(minPrice, maxPrice);
    }

    function drawGrid(min: number, max: number) {
      if (!ctx) return;
      ctx.textAlign = "left";
      ctx.font = "10px monospace";
      ctx.fillStyle = config.colors.text;
      ctx.strokeStyle = config.colors.grid;
      ctx.lineWidth = 1;

      // Horizontal Lines (Price)
      const steps = 6;
      for (let i = 0; i <= steps; i++) {
        const price = min + (i * (max - min)) / steps;
        const y = getY(price, min, max);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(chartWidth - config.padding.right, y);
        ctx.stroke();

        ctx.fillText(
          `$${price.toFixed(2)}`,
          chartWidth - config.padding.right + 10,
          y + 4,
        );
      }
    }

    function drawBands(min: number, max: number) {
      if (!ctx) return;
      const drawLine = (prop: string, color: string) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        let first = true;

        data.forEach((d, i) => {
          if (!d[prop]) return;
          const x = getX(i);
          const y = getY(d[prop], min, max);
          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
      };

      // Shaded Area between bands
      ctx.beginPath();
      ctx.fillStyle = "rgba(99, 102, 241, 0.05)";
      let first = true;
      for (let i = 0; i < data.length; i++) {
        if (!data[i].upper) continue;
        const x = getX(i);
        const y = getY(data[i].upper, min, max);
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else ctx.lineTo(x, y);
      }
      for (let i = data.length - 1; i >= 0; i--) {
        if (!data[i].lower) continue;
        ctx.lineTo(getX(i), getY(data[i].lower, min, max));
      }
      ctx.closePath();
      ctx.fill();

      drawLine("upper", config.colors.upperBand);
      drawLine("lower", config.colors.lowerBand);
      drawLine("basis", config.colors.basis);
    }

    function drawEntryPoints(min: number, max: number) {
      if (!ctx) return;
      // We'll highlight 2 specific points with entry, sl, and tp
      const entries = [
        {
          index: data.length - 60,
          type: "BUY",
          price: data[data.length - 60].close,
          sl: data[data.length - 60].close - 300,
          tp: data[data.length - 60].close + 600,
        },
        {
          index: data.length - 20,
          type: "SELL",
          price: data[data.length - 20].close,
          sl: data[data.length - 20].close + 300,
          tp: data[data.length - 20].close - 600,
        },
      ];

      entries.forEach((entry) => {
        if (entry.index < 0 || entry.index >= data.length) return;
        const x = getX(entry.index);
        const yEntry = getY(entry.price, min, max);
        const ySL = getY(entry.sl, min, max);
        const yTP = getY(entry.tp, min, max);

        // 1. Draw Entry Marker
        ctx.fillStyle =
          entry.type === "BUY" ? config.colors.up : config.colors.down;
        ctx.beginPath();
        if (entry.type === "BUY") {
          ctx.moveTo(x, yEntry + 5);
          ctx.lineTo(x - 6, yEntry + 15);
          ctx.lineTo(x + 6, yEntry + 15);
        } else {
          ctx.moveTo(x, yEntry - 5);
          ctx.lineTo(x - 6, yEntry - 15);
          ctx.lineTo(x + 6, yEntry - 15);
        }
        ctx.fill();

        // Label for Entry
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          entry.type,
          x,
          entry.type === "BUY" ? yEntry + 28 : yEntry - 22,
        );

        // 2. Draw Stop Loss Line (Short horizontal dashed line)
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = config.colors.sl;
        ctx.beginPath();
        ctx.moveTo(x - 20, ySL);
        ctx.lineTo(x + 20, ySL);
        ctx.stroke();

        // SL Text
        ctx.fillStyle = config.colors.sl;
        ctx.fillText("SL", x + 30, ySL + 4);

        // 3. Draw Take Profit Line
        ctx.strokeStyle = config.colors.tp;
        ctx.beginPath();
        ctx.moveTo(x - 20, yTP);
        ctx.lineTo(x + 20, yTP);
        ctx.stroke();

        // TP Text
        ctx.fillStyle = config.colors.tp;
        ctx.fillText("TP", x + 30, yTP + 4);

        // Reset dash
        ctx.setLineDash([]);
      });
    }

    // 5. Lifecycle
    function resize() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const toolbarHeight = 65; // approx
      canvas.width = rect.width;
      canvas.height = rect.height - toolbarHeight;
      chartWidth = canvas.width;
      chartHeight = canvas.height;
      draw();
    }

    // Initial Run
    data = generateData(150);
    calculateIndicators(data);
    setCurrentPrice(`$${data[data.length - 1].close.toFixed(2)}`);
    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    // Removed setInterval to keep it paused

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] flex flex-col bg-slate-900 text-slate-50 overflow-hidden rounded-xl border border-slate-800 font-sans"
    >
      {/* Top Toolbar */}
      <div className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 p-3 px-6 flex items-center gap-5 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center font-bold">
            G
          </div>
          <span className="font-bold text-lg">GEMINI/USD</span>
        </div>
        <div className="h-8 w-px bg-slate-700"></div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-400 tracking-wider">
            Price
          </span>
          <span className="text-sm font-semibold text-green-400">
            {currentPrice}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-400 tracking-wider">
            24h Change
          </span>
          <span className="text-sm font-semibold text-green-500">+4.20%</span>
        </div>
        <div className="ml-auto flex gap-2">
          <button type="button" aria-label="Record paper buy at displayed price" onClick={() => setTradeMessage(`Paper buy recorded at ${currentPrice}. No live order was sent.`)} className="bg-green-600 hover:bg-green-500 px-4 py-1.5 rounded text-sm font-bold transition">
            BUY · PAPER
          </button>
          <button type="button" aria-label="Record paper sell at displayed price" onClick={() => setTradeMessage(`Paper sell recorded at ${currentPrice}. No live order was sent.`)} className="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded text-sm font-bold transition">
            SELL · PAPER
          </button>
        </div>
      </div>

      {tradeMessage && (
        <div role="status" aria-live="polite" className="absolute top-[68px] right-3 z-20 max-w-[min(24rem,90%)] rounded-lg border border-slate-600 bg-slate-950/95 px-3 py-2 text-xs text-slate-200 shadow-lg">
          {tradeMessage}
        </div>
      )}

      {/* Chart Legend Overlay */}
      <div className="absolute top-[80px] left-5 bg-slate-900/60 p-2.5 rounded pointer-events-none text-xs z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-0.5 bg-cyan-400"></span> Upper Band (20, 2)
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-0.5 bg-orange-400"></span> Basis (SMA 20)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-pink-400"></span> Lower Band (20, 2)
        </div>
      </div>

      {/* Main Canvas */}
      <canvas ref={canvasRef} className="block cursor-crosshair"></canvas>
    </div>
  );
};
