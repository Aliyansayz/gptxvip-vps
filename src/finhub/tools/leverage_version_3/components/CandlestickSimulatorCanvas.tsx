import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Ohlc } from '../functions/api/indicators/baseline';
import { smoothedHeikinAshi } from '../functions/api/indicators/integral/heikin_ashi_smoothing';
import { throttle } from 'lodash';
import { Trade } from '../../types/trading';
import { VisibilitySettings, useIndicatorsStore } from '../stores/indicators_store';
import { useIndicatorCalculations } from './hooks/useIndicatorCalculations';
import { 
  drawAxesAndGrid, 
  drawCandlesAndVolume, 
  drawTradeMarkers, 
  drawOverlays, 
  drawSubplots,
  drawCurrentPrice,
  RenderContext
} from './utils/canvasRenderer';

interface Config {
  type: 'ma_crossover' | 'stochastic' | 'supertrend' | 'divergence' | 'linear_regression' | 'bollinger_bands' | 'supertrend_regime' | 'heikin_ashi_smoothed' | 'candlestick_pattern';
  fastMa?: number;
  slowMa?: number;
  stochK?: number;
  stochD?: number;
  supertrendPeriod?: number;
  supertrendMultiplier?: number;
  lrSlopePeriod?: number;
  lrVolPeriod?: number;
  lrRegimePeriod?: number;
  bbPeriod?: number;
  bbStdDev?: number;
  stPeriod?: number;
  atrMultiplier?: number;
  regimePeriod?: number;
  zPeriod?: number;
  zUpper?: number;
  zLower?: number;
  exitAfterNCandlesMin?: number;
  exitAfterNCandlesMax?: number;
  exitAfterNMinutesMin?: number;
  exitAfterNMinutesMax?: number;
  exitAfterNSecondsMin?: number;
  exitAfterNSecondsMax?: number;
  haSmoothLen?: number;
}

interface CandlestickSimulatorCanvasProps {
  data: Ohlc[];
  simulationIndex: number;
  config: Config;
  trades: Trade[];
  tradingEnabled: boolean;
  useStopLoss: boolean;
  useADXFilter?: boolean;
  adxThreshold?: number;
  useSqueezeFilter?: boolean;
  hideIndicators?: boolean;
  title?: string;
  assetName?: string;
  visibilitySettings?: VisibilitySettings;
  dataSource?: 'alpha' | 'beta' | 'delta';
}

export const CandlestickSimulatorCanvas = React.memo<CandlestickSimulatorCanvasProps>(({
  data,
  simulationIndex,
  config,
  trades,
  tradingEnabled,
  useStopLoss,
  useADXFilter,
  adxThreshold,
  useSqueezeFilter,
  hideIndicators = false,
  title,
  assetName,
  visibilitySettings,
  dataSource
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { heikinAshiSettings } = useIndicatorsStore();

  const [zoomLevel, setZoomLevel] = useState(80);
  const [panOffset, setPanOffset] = useState(0);
  const isDragging = useRef(false);
  const startDragX = useRef(0);
  const startPanOffset = useRef(0);

  useEffect(() => {
    if (simulationIndex <= 80) {
      setPanOffset(0);
    }
  }, [simulationIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoomLevel(prev => {
        const delta = e.deltaY > 0 ? 5 : -5;
        const next = prev + delta;
        return Math.max(15, Math.min(300, next));
      });
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    startDragX.current = e.nativeEvent.clientX;
    startPanOffset.current = panOffset;
  };

  const throttledMouseMove = React.useMemo(
    () =>
      throttle((deltaX: number) => {
        const canvas = canvasRef.current;
        if (canvas) {
          const leftPadding = 40;
          const rightPadding = 60;
          const chartWidth = canvas.clientWidth - leftPadding - rightPadding;
          const windowSize = zoomLevel;
          const pixelsPerCandle = chartWidth / windowSize;
          
          let newPanOffset = startPanOffset.current + Math.round(deltaX / pixelsPerCandle);
          
          if (newPanOffset > 0) newPanOffset = 0;
          
          if (simulationIndex + newPanOffset < windowSize) {
             newPanOffset = -(simulationIndex - windowSize);
             if (newPanOffset > 0) newPanOffset = 0;
          }

          setPanOffset(newPanOffset);
        }
      }, 16),
    [zoomLevel, simulationIndex]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.nativeEvent.clientX - startDragX.current;
    throttledMouseMove(deltaX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const resetPan = () => {
    setPanOffset(0);
  };

  // Convert generic Config to match the hook's Config expectation
  const hookConfig = {
    ...config,
    type: config.type as string,
  };

  const computedIndicators = useIndicatorCalculations(data, hookConfig, useADXFilter, useSqueezeFilter, hideIndicators);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0 || (!computedIndicators && !hideIndicators)) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;

      const width = parent.clientWidth;
      const height = parent.clientHeight;
      ctx.clearRect(0, 0, width, height);

      const windowSize = zoomLevel;
      const effectiveEndIdx = Math.max(0, Math.min(data.length - 1, simulationIndex + panOffset));
      const startIdx = Math.max(0, effectiveEndIdx - windowSize);
      const visibleData = data.slice(startIdx, effectiveEndIdx + 1);
      
      if (visibleData.length === 0) return;

      let isHAEnabled = dataSource === 'alpha' 
        ? heikinAshiSettings?.alphaEnabled 
        : dataSource === 'beta' 
        ? heikinAshiSettings?.betaEnabled 
        : dataSource === 'delta' 
        ? heikinAshiSettings?.deltaEnabled 
        : false;
        
      let dynamicSmoothLen = heikinAshiSettings?.smoothLen || 1;

      if (config.type === 'heikin_ashi_smoothed') {
         isHAEnabled = true;
         dynamicSmoothLen = config.haSmoothLen || 10;
      }

      let haResult: any = null;
      if (isHAEnabled && data.length > 0) {
        try {
          haResult = smoothedHeikinAshi(
            data.map(d => d.open),
            data.map(d => d.high),
            data.map(d => d.low),
            data.map(d => d.close),
            dynamicSmoothLen
          );
        } catch (e) {
          console.error("Heikin Ashi calculation error:", e);
        }
      }

      const getOhlcValueLocal = (idx: number) => {
        if (haResult && haResult.haOpen[idx] !== undefined) {
          return {
            open: haResult.haOpen[idx],
            high: haResult.haHigh[idx],
            low: haResult.haLow[idx],
            close: haResult.haClose[idx]
          };
        }
        const d = data[idx];
        return {
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close
        };
      };

      const rightPadding = 60;
      const leftPadding = 40;
      const topPadding = 20;
      const bottomPadding = 40;
      const chartWidth = width - leftPadding - rightPadding;

      let totalGraphHeight = height - topPadding - bottomPadding;
      
      const subplotsVisible = visibilitySettings?.subplotsVisible !== false;
      const indicators = computedIndicators && subplotsVisible ? computedIndicators.indicatorsList : [];

      let mainHeightRatio = 1;
      if (indicators.length === 1) mainHeightRatio = 0.70;
      else if (indicators.length === 2) mainHeightRatio = 0.60;
      else if (indicators.length === 3) mainHeightRatio = 0.50;
      else if (indicators.length === 4) mainHeightRatio = 0.40;

      let mainHeight = totalGraphHeight * mainHeightRatio;
      let indicatorPaneHeight = indicators.length > 0 ? Math.max((totalGraphHeight * (1 - mainHeightRatio) - (indicators.length * 5)) / indicators.length, 60) : 0;

      let rawMin = Infinity;
      let rawMax = -Infinity;
      for (let idx = startIdx; idx <= effectiveEndIdx; idx++) {
        const val = getOhlcValueLocal(idx);
        rawMin = Math.min(rawMin, val.low);
        rawMax = Math.max(rawMax, val.high);
      }

      trades.forEach(t => {
         if (t.status === 'OPEN' && t.entryIndex >= startIdx) {
            if (t.stopLoss) {
              rawMin = Math.min(rawMin, t.stopLoss);
              rawMax = Math.max(rawMax, t.stopLoss);
            }
            if (t.takeProfit) {
              rawMax = Math.max(rawMax, t.takeProfit);
              rawMin = Math.min(rawMin, t.takeProfit);
            }
         }
      });
      
      const visibleStops = computedIndicators?.stops || { lowerBand: [], upperBand: [] };
      if (tradingEnabled && useStopLoss) {
         for (let i = startIdx; i <= effectiveEndIdx; i++) {
            const lower = visibleStops.lowerBand[i];
            const upper = visibleStops.upperBand[i];
            if (lower && !isNaN(lower)) rawMin = Math.min(rawMin, lower);
            if (upper && !isNaN(upper)) rawMax = Math.max(rawMax, upper);
         }
      }

      if (config.type === 'supertrend' && computedIndicators?.supertrend?.supertrend?.length > 0) {
         for (let i = startIdx; i <= effectiveEndIdx; i++) {
            const st = computedIndicators.supertrend.supertrend[i];
            if (st && !isNaN(st)) {
               rawMin = Math.min(rawMin, st);
               rawMax = Math.max(rawMax, st);
            }
         }
      }

      if (config.type === 'supertrend_regime' && computedIndicators?.supertrend_regime?.supertrend?.length > 0) {
         for (let i = startIdx; i <= effectiveEndIdx; i++) {
            const st = computedIndicators.supertrend_regime.supertrend[i];
            if (st && !isNaN(st)) {
               rawMin = Math.min(rawMin, st);
               rawMax = Math.max(rawMax, st);
            }
         }
      }

      if (config.type === 'ma_crossover' && computedIndicators) {
         for (let i = startIdx; i <= effectiveEndIdx; i++) {
            const f = computedIndicators.fastLine?.[i];
            const s = computedIndicators.slowLine?.[i];
            if (f && !isNaN(f)) { rawMin = Math.min(rawMin, f); rawMax = Math.max(rawMax, f); }
            if (s && !isNaN(s)) { rawMin = Math.min(rawMin, s); rawMax = Math.max(rawMax, s); }
         }
      }

      if (config.type === 'bollinger_bands' && computedIndicators) {
         for (let i = startIdx; i <= effectiveEndIdx; i++) {
            const b = computedIndicators.entrySignal?.bb?.[i];
            if (b && !isNaN(b.lower)) rawMin = Math.min(rawMin, b.lower);
            if (b && !isNaN(b.upper)) rawMax = Math.max(rawMax, b.upper);
         }
      }
      
      let priceRange = (rawMax - rawMin) || 1;
      let minPrice = rawMin - priceRange * 0.15;
      let maxPrice = rawMax + priceRange * 0.15;

      const rightMarginSpace = 6;
      const getY = (p: number) => Math.floor(topPadding + mainHeight - ((p - minPrice) / (maxPrice - minPrice)) * mainHeight) + 0.5;
      const getX = (i: number) => Math.floor(leftPadding + ((i - startIdx) / Math.max(1, windowSize + rightMarginSpace)) * chartWidth) + 0.5;

      const renderContext: RenderContext = {
        ctx,
        data,
        startIdx,
        effectiveEndIdx,
        windowSize,
        minPrice,
        maxPrice,
        getX,
        getY,
        leftPadding,
        rightPadding,
        topPadding,
        mainHeight,
        indicatorPaneHeight,
        width,
        chartWidth,
        config,
        computedIndicators,
        trades,
        visibilitySettings,
        tradingEnabled,
        useStopLoss,
        haResult,
      };

      drawAxesAndGrid(renderContext);
      drawCurrentPrice(renderContext);
      drawTradeMarkers(renderContext);
      drawOverlays(renderContext);
      drawCandlesAndVolume(renderContext);
      drawSubplots(renderContext);
    };

    let animationFrameId: number;

    const requestDraw = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(draw);
    };

    requestDraw();
    window.addEventListener("resize", requestDraw);
    return () => {
      window.removeEventListener("resize", requestDraw);
      cancelAnimationFrame(animationFrameId);
    };
  }, [data, simulationIndex, config, trades, tradingEnabled, useStopLoss, panOffset, visibilitySettings, zoomLevel, computedIndicators, heikinAshiSettings]);

  return (
    <div className="relative w-full h-full flex flex-col">
      {title && (
        <div className="shrink-0 flex items-center gap-3 px-4 py-2 border-b border-zinc-800/50 bg-zinc-900/30">
          {assetName && (
            <div className="text-cyan-400 font-extrabold text-xs uppercase px-2 py-0.5 bg-cyan-950/40 border border-cyan-500/30 rounded tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.15)] select-none">
               {assetName}
            </div>
          )}
          <div className="text-zinc-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            {title}
          </div>
        </div>
      )}
      <div className="relative flex-1 min-h-0 w-full">
        <div className="absolute top-3 right-4 flex items-center gap-1 bg-zinc-950/80 border border-zinc-800 rounded-lg p-1 z-10 font-mono shadow-xl select-none">
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(15, prev - 10))}
            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:bg-zinc-900 rounded transition-all"
            title="Zoom In (Fewer candles, larger size)"
          >
            <ZoomIn size={14} />
          </button>
          
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(300, prev + 10))}
            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:bg-zinc-900 rounded transition-all"
            title="Zoom Out (Squeeze X-axis to view more candles)"
          >
            <ZoomOut size={14} />
          </button>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

          <span className="text-[10px] text-zinc-400 font-bold px-1.5 min-w-[50px] text-center">
            {zoomLevel} Bars
          </span>

          <button
            type="button"
            onClick={() => {
              setZoomLevel(80);
              setPanOffset(0);
            }}
            className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-all"
            title="Reset Zoom & Pan"
          >
            <RotateCcw size={12} />
          </button>
        </div>

        {panOffset < 0 && (
          <button 
            type="button"
            onClick={resetPan}
            className="absolute bottom-[90px] right-[80px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded shadow-lg border border-zinc-700 transition-colors z-10"
          >
            Snap to Latest
          </button>
        )}
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>
    </div>
  );
});
CandlestickSimulatorCanvas.displayName = 'CandlestickSimulatorCanvas';
