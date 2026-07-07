import React, { useEffect, useRef, useState } from "react";
import { OHLCData } from "../../types";
import { AssetType, generateNextCandle, generateInitialCandles } from "./simulatedDataGenerator";
import { OHLCSimulationParams } from "./asset_presets/types";

interface CandlestickWithLOBProps {
  data: OHLCData[];
  onPriceChange?: (price: number) => void;
  isLiveRunning?: boolean;
  assetType?: AssetType;
  customParams?: OHLCSimulationParams;
}

export const CandlestickWithLOB: React.FC<CandlestickWithLOBProps> = ({ 
  data, 
  onPriceChange, 
  isLiveRunning = true,
  assetType = 'Anonymous',
  customParams
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastEmittedPrice = useRef<number>(0);
  const isLiveRunningRef = useRef<boolean>(isLiveRunning);
  const localDataRef = useRef<OHLCData[]>(data);

  useEffect(() => {
    isLiveRunningRef.current = isLiveRunning;
  }, [isLiveRunning]);

  useEffect(() => {
    // When asset or presets change, regenerate the initial list
    localDataRef.current = generateInitialCandles(assetType, 80, customParams) as OHLCData[];
    // Emit the initial price of the newly generated asset
    if (localDataRef.current.length > 0 && onPriceChange) {
      onPriceChange(localDataRef.current[localDataRef.current.length - 1].close);
    }
  }, [assetType, customParams, onPriceChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTickTime = performance.now();
    
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = 500 * dpr; // 300 for candle, 200 for LOB
        ctx.scale(dpr, dpr);
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `500px`;
        draw(parent.clientWidth, 500);
      }
    };

    const animateLoop = (time: number) => {
      const dt = time - lastTickTime;
      if (dt > 50 && isLiveRunningRef.current) { // Tick every 50ms for smoother animation
         if (localDataRef.current.length > 0) {
           const lastCandle = localDataRef.current[localDataRef.current.length - 1];
           
           const newCandle = generateNextCandle(lastCandle, assetType, customParams) as OHLCData;
           localDataRef.current.push(newCandle);
           if (localDataRef.current.length > 200) localDataRef.current.shift();
           
           if (onPriceChange && lastEmittedPrice.current !== newCandle.close) {
             onPriceChange(newCandle.close);
             lastEmittedPrice.current = newCandle.close;
           }
         }

         const parent = canvas.parentElement;
         if (parent) {
             draw(parent.clientWidth, 500);
         }
         lastTickTime = time;
      }
      animationFrameId = requestAnimationFrame(animateLoop);
    };

    const draw = (width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);
      const currentLocalData = localDataRef.current;
      if (currentLocalData.length === 0) return;

      const padding = { top: 20, right: 60, bottom: 20, left: 20 };
      const chartWidth = width - padding.left - padding.right;
      const candleHeight = 300;
      const lobHeight = height - candleHeight - padding.top - padding.bottom;

      // ---- Draw Candlesticks ----
      const visibleData = currentLocalData.slice(-80); // Show last 80 candles
      const minPrice = Math.min(...visibleData.map((d) => d.low)) * 0.999;
      const maxPrice = Math.max(...visibleData.map((d) => d.high)) * 1.001;
      const priceRange = maxPrice - minPrice;

      const getY = (price: number) => padding.top + candleHeight - ((price - minPrice) / priceRange) * candleHeight;
      const getX = (index: number) => padding.left + (index / Math.max(1, visibleData.length - 1)) * chartWidth;

      const candleWidth = Math.max(2, (chartWidth / visibleData.length) * 0.6);

      // Grid
      ctx.strokeStyle = "rgba(34, 211, 238, 0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (candleHeight * i) / 4;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        ctx.fillStyle = "rgba(34, 211, 238, 0.7)";
        ctx.font = "10px monospace";
        ctx.textAlign = "left";
        const priceLabel = (maxPrice - (priceRange * i) / 4).toFixed(2);
        ctx.fillText(priceLabel, width - padding.right + 5, y + 4);
      }

      // Batch Candles
      ctx.lineWidth = 1.5;
      
      // Green Candles
      ctx.strokeStyle = "rgba(34,211,238,1)";
      ctx.fillStyle = "rgba(34,211,238,1)";
      ctx.beginPath();
      visibleData.forEach((d, i) => {
        if (d.close >= d.open) {
          const x = getX(i);
          ctx.moveTo(x, getY(d.high));
          ctx.lineTo(x, getY(d.low));
        }
      });
      ctx.stroke();
      visibleData.forEach((d, i) => {
        if (d.close >= d.open) {
          const x = getX(i);
          const yOpen = getY(d.open);
          const yClose = getY(d.close);
          const bodyTop = Math.min(yOpen, yClose);
          const bodyH = Math.max(Math.abs(yOpen - yClose), 1.5);
          ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyH);
        }
      });

      // Red/White Candles
      ctx.strokeStyle = "#ffffff";
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      visibleData.forEach((d, i) => {
        if (d.close < d.open) {
          const x = getX(i);
          ctx.moveTo(x, getY(d.high));
          ctx.lineTo(x, getY(d.low));
        }
      });
      ctx.stroke();
      visibleData.forEach((d, i) => {
        if (d.close < d.open) {
          const x = getX(i);
          const yOpen = getY(d.open);
          const yClose = getY(d.close);
          const bodyTop = Math.min(yOpen, yClose);
          const bodyH = Math.max(Math.abs(yOpen - yClose), 1.5);
          ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyH);
        }
      });

      // ---- Draw LOB Depth Chart Below ----
      const lobTopY = padding.top + candleHeight + 20; // 20px gap

      // Draw Separator
      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top + candleHeight);
      ctx.lineTo(width - padding.right, padding.top + candleHeight);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.3)";
      ctx.stroke();

      // Simulated Depth Data based on current price
      const currentPrice = visibleData[visibleData.length - 1].close;
      const numLevels = 40;
      
      const bids: { price: number, volume: number }[] = [];
      const asks: { price: number, volume: number }[] = [];
      
      let cumulativeBidVol = 0;
      let cumulativeAskVol = 0;

      for (let i = 0; i < numLevels; i++) {
        const bidVol = Math.random() * 50 + 10;
        cumulativeBidVol += bidVol;
        bids.push({ price: currentPrice - (i * 0.05), volume: cumulativeBidVol });

        const askVol = Math.random() * 50 + 10;
        cumulativeAskVol += askVol;
        asks.push({ price: currentPrice + (i * 0.05), volume: cumulativeAskVol });
      }

      // Reverse bids to draw from highest to lowest on x axis
      bids.reverse();

      const maxVol = Math.max(cumulativeBidVol, cumulativeAskVol) * 1.1;

      // Draw Ask Depth (White) - Right side
      ctx.beginPath();
      const midX = padding.left + chartWidth / 2;
      ctx.moveTo(midX, lobTopY + lobHeight);
      
      asks.forEach((ask, i) => {
        const x = midX + (i / numLevels) * (chartWidth / 2);
        const y = lobTopY + lobHeight - (ask.volume / maxVol) * lobHeight;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(midX + chartWidth / 2, lobTopY + lobHeight);
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw Bid Depth (Green) - Left side
      ctx.beginPath();
      ctx.moveTo(padding.left, lobTopY + lobHeight);
      
      bids.forEach((bid, i) => {
        const x = padding.left + (i / numLevels) * (chartWidth / 2);
        const y = lobTopY + lobHeight - (bid.volume / maxVol) * lobHeight;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(midX, lobTopY + lobHeight);
      ctx.fillStyle = "rgba(34, 211, 238, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "rgba(34, 211, 238, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Mid price line
      ctx.beginPath();
      ctx.moveTo(midX, lobTopY);
      ctx.lineTo(midX, lobTopY + lobHeight);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.5)";
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(34,211,238,1)";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Bids", padding.left + 30, lobTopY + 15);

      ctx.fillStyle = "#ffffff";
      ctx.fillText("Asks", width - padding.right - 30, lobTopY + 15);
    };

    window.addEventListener("resize", resize);
    setTimeout(resize, 50);
    animationFrameId = requestAnimationFrame(animateLoop);

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationFrameId);
    };
  }, [assetType, customParams, onPriceChange]);

  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col relative z-20 overflow-visible" style={{ transform: 'perspective(1200px) rotateX(5deg) rotateZ(-1deg) scaleX(1.1)', transformStyle: 'preserve-3d' }}>
      <div className="relative w-full flex-1 min-h-[500px]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
};
