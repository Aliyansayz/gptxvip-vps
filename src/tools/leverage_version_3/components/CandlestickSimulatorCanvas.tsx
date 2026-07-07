import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Ohlc, calculateSMA, calculateEMA, calculateStochastic, calculateSupertrend, calculateStopBandsSmooth } from '../functions/api/indicators/baseline';
import { calculateADX } from '../functions/api/indicators/integral/adx';
import { calculateATR } from '../functions/api/indicators/integral/atr';
import { calculateVolatilityZScore } from '../functions/api/indicators/exclusive';
import { linearRegressionSystem } from '../functions/api/indicators/exclusive/linearRegression';
import { calculateSqueeze } from '../functions/api/indicators/integral/squeeze_momentum';
import { calculateBollingerBands } from '../functions/api/indicators/exclusive/bollingerBands';
import { supertrendRegimeSystem } from '../functions/api/indicators/exclusive/supertrend_regime';
import { smoothedHeikinAshi } from '../functions/api/indicators/integral/heikin_ashi_smoothing';
import { throttle } from 'lodash';
import { Trade } from '../../types/trading';
import { VisibilitySettings, useIndicatorsStore } from '../stores/indicators_store';

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

  // Optional: reset pan if simulation restarts
  useEffect(() => {
    if (simulationIndex <= 80) {
      setPanOffset(0);
    }
  }, [simulationIndex]);

  // Non-passive wheel event listener for custom zoom scrolling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoomLevel(prev => {
        // e.deltaY > 0 -> scroll down -> zoom out (increase windowSize, compressing candle width)
        // e.deltaY < 0 -> scroll up -> zoom in (decrease windowSize, expanding candle width)
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

  const computedIndicators = React.useMemo(() => {
    if (data.length === 0 || hideIndicators) return null;
    const fullClosePrices = data.map(d => d.close);
    const fullHighs = data.map(d => d.high);
    const fullLows = data.map(d => d.low);

    const result: any = {};
    const indicators: string[] = [];
    if (config.type === 'stochastic' || config.type === 'divergence') indicators.push('stochastic');
    if (config.type === 'linear_regression') indicators.push('linear_regression');
    if (config.type === 'supertrend_regime') indicators.push('supertrend_regime_zscore');
    if (useADXFilter) indicators.push('adx');
    if (useSqueezeFilter) indicators.push('squeeze');
    const hasZScoreFilters = config.exitAfterNCandlesMin || config.exitAfterNCandlesMax || config.exitAfterNMinutesMin || config.exitAfterNMinutesMax || config.exitAfterNSecondsMin || config.exitAfterNSecondsMax;
    if (hasZScoreFilters && (!indicators.includes('zscore'))) indicators.push('zscore');

    result.indicatorsList = indicators;

    if (config.type === 'ma_crossover') {
      result.fastLine = calculateEMA(fullClosePrices, config.fastMa || 9);
      result.slowLine = calculateSMA(fullClosePrices, config.slowMa || 21);
    }
    if (config.type === 'supertrend') {
      result.supertrend = calculateSupertrend(data, config.supertrendPeriod || 10, config.supertrendMultiplier || 3);
    }
    if (config.type === 'supertrend_regime') {
      result.supertrend_regime = supertrendRegimeSystem(fullHighs, fullLows, fullClosePrices, config.stPeriod || 10, config.atrMultiplier || 3, config.regimePeriod || 30, config.zPeriod || 20, config.zUpper || 1.5, config.zLower || -1.5);
    }
    if (config.type === 'bollinger_bands') {
      result.bb = calculateBollingerBands(data, config.bbPeriod || 20, config.bbStdDev || 2);
    }
    if (indicators.includes('stochastic')) {
      result.stochastic = calculateStochastic(data, config.stochK || 14, 3, config.stochD || 3);
    }
    if (indicators.includes('adx')) {
      result.adx = calculateADX(data, 14);
    }
    if (indicators.includes('zscore')) {
      result.zscores = calculateVolatilityZScore(data, 20);
    }
    if (indicators.includes('linear_regression')) {
      result.lr = linearRegressionSystem(fullClosePrices, config.lrSlopePeriod || 20, config.lrVolPeriod || 20, config.lrRegimePeriod || 30);
    }
    if (indicators.includes('squeeze')) {
      result.squeeze = calculateSqueeze(fullClosePrices, fullHighs, fullLows);
    }

    result.stops = calculateStopBandsSmooth(data, 10, 3.0, false, true);

    return result;
  }, [data, config, useADXFilter, useSqueezeFilter]);

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

      // Determine viewport (sliding window of bars)
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

      const getOhlcValue = (idx: number) => {
        if (haResult && haResult.haOpen[idx] !== undefined) {
          return {
            open: haResult.haOpen[idx],
            high: haResult.haHigh[idx],
            low: haResult.haLow[idx],
            close: haResult.haClose[idx],
            volume: data[idx]?.volume || 0,
            direction: haResult.direction[idx]
          };
        }
        const d = data[idx];
        return {
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume || 0,
          direction: d.close >= d.open ? 1 : -1
        };
      };

      const rightPadding = 60;
      const leftPadding = 40;
      const topPadding = 20;
      const bottomPadding = 40;
      const chartWidth = width - leftPadding - rightPadding;

      // Splitting height based on indicator
      let totalGraphHeight = height - topPadding - bottomPadding;
      
      const subplotsVisible = visibilitySettings?.subplotsVisible !== false;
      const mainIndicatorVisible = visibilitySettings?.mainIndicatorVisible !== false;
      
      const indicators = computedIndicators && subplotsVisible ? computedIndicators.indicatorsList : [];

      let mainHeightRatio = 1;
      if (indicators.length === 1) mainHeightRatio = 0.70;
      else if (indicators.length === 2) mainHeightRatio = 0.60;
      else if (indicators.length === 3) mainHeightRatio = 0.50;
      else if (indicators.length === 4) mainHeightRatio = 0.40;

      let mainHeight = totalGraphHeight * mainHeightRatio;
      let indicatorPaneHeight = indicators.length > 0 ? Math.max((totalGraphHeight * (1 - mainHeightRatio) - (indicators.length * 5)) / indicators.length, 60) : 0;


      // Main Chart min/max
      let rawMin = Infinity;
      let rawMax = -Infinity;
      for (let idx = startIdx; idx <= effectiveEndIdx; idx++) {
        const val = getOhlcValue(idx);
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
      const candleWidth = Math.max(3, (chartWidth / Math.max(1, windowSize + rightMarginSpace)) * 0.7);

      // Draw Axes Lines
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftPadding, topPadding);
      ctx.lineTo(leftPadding, topPadding + mainHeight); // Y axis left
      ctx.lineTo(width - rightPadding, topPadding + mainHeight); // X axis bottom
      ctx.lineTo(width - rightPadding, topPadding); // Y axis right
      ctx.stroke();

      // Draw Gridlines and Axis
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '10px JetBrains Mono, monospace';
      
      for (let i = 0; i <= 5; i++) {
        const y = topPadding + (mainHeight * i) / 5;
        const price = maxPrice - (i * (maxPrice - minPrice)) / 5;
        
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.moveTo(leftPadding, y);
        ctx.lineTo(width - rightPadding, y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.fillText(price.toFixed(2), width - rightPadding + 8, y);
      }

      if (title) {
        // Handled in external DOM overlay to prevent conflicts
      }

      // Draw Time/Index labels on X axis
      ctx.textAlign = 'center';
      for (let i = 0; i <= 4; i++) {
        const idx = startIdx + Math.floor((i * windowSize) / 4);
        const x = getX(idx);
        const d = data[idx];
        if (d) {
          ctx.fillStyle = 'rgba(150, 150, 150, 0.5)';
          const timeStr = new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          ctx.fillText(timeStr, x, topPadding + mainHeight + 15);
        }
      }

      // Current Price Line
      const currentPrice = data[effectiveEndIdx].close;
      const currentY = getY(currentPrice);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(leftPadding, currentY);
      ctx.lineTo(width - rightPadding, currentY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Current Price Label
      ctx.fillStyle = '#10b981';
      ctx.fillRect(width - rightPadding, currentY - 10, rightPadding, 20);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(currentPrice.toFixed(2), width - rightPadding + 5, currentY);

      // Stop bands (draw if trading config wants SL)
      let fastLine: number[] = computedIndicators?.fastLine || [];
      let slowLine: number[] = computedIndicators?.slowLine || [];

      let supertrends: ReturnType<typeof calculateSupertrend> = computedIndicators?.supertrend || { supertrend: [], trend: [] };

      let stochastic = computedIndicators?.stochastic || null;
      let adxData = computedIndicators?.adx || null;
      let zScoreData = computedIndicators?.zscores || null;
      let lrData = computedIndicators?.lr || null;
      let squeezeData = computedIndicators?.squeeze || null;

      // Draw Trade Markers/Lines before candles
      trades.forEach(trade => {
         const isLong = trade.side === 'LONG';
         // Draw entry line
         if (trade.entryIndex >= startIdx && trade.entryIndex <= effectiveEndIdx) {
            ctx.fillStyle = isLong ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
            ctx.fillRect(getX(trade.entryIndex) - 10, getY(trade.entryPrice) - 10, 20, 20);
         }

         if (trade.status === 'OPEN') {
           // Draw TP / SL lines spanning from entry to current
           ctx.setLineDash([4, 4]);
           if (trade.takeProfit) {
             ctx.strokeStyle = '#10b981'; // green dashed
             ctx.beginPath();
             ctx.moveTo(Math.max(leftPadding, getX(trade.entryIndex)), getY(trade.takeProfit));
             ctx.lineTo(getX(effectiveEndIdx), getY(trade.takeProfit));
             ctx.stroke();
           }
           if (trade.stopLoss) {
             ctx.strokeStyle = '#ef4444'; // red dashed
             ctx.beginPath();
             ctx.moveTo(Math.max(leftPadding, getX(trade.entryIndex)), getY(trade.stopLoss));
             ctx.lineTo(getX(effectiveEndIdx), getY(trade.stopLoss));
             ctx.stroke();
           }
           ctx.setLineDash([]);
         }

         if (trade.status === 'CLOSED' && trade.exitIndex) {
           // Draw line from entry to exit
           if (trade.exitIndex >= startIdx) {
             ctx.strokeStyle = trade.pnl && trade.pnl >= 0 ? '#10b981' : '#f59e0b';
             ctx.lineWidth = 2;
             ctx.setLineDash([2, 4]);
             ctx.beginPath();
             ctx.moveTo(getX(Math.max(startIdx, trade.entryIndex)), getY(trade.entryPrice));
             ctx.lineTo(getX(trade.exitIndex), getY(trade.exitPrice || 0));
             ctx.stroke();
             ctx.setLineDash([]);
             ctx.lineWidth = 1;
           }
         }
      });

      // Draw Stop Bands if trading is active
      if (tradingEnabled && useStopLoss) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; // Lower band
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = startIdx; i <= effectiveEndIdx; i++) {
          const val = visibleStops.lowerBand[i];
          if (val && !isNaN(val)) {
            if (i === startIdx) ctx.moveTo(getX(i), getY(val));
            else ctx.lineTo(getX(i), getY(val));
          }
        }
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'; // Upper band
        ctx.beginPath();
        for (let i = startIdx; i <= effectiveEndIdx; i++) {
          const val = visibleStops.upperBand[i];
          if (val && !isNaN(val)) {
            if (i === startIdx) ctx.moveTo(getX(i), getY(val));
            else ctx.lineTo(getX(i), getY(val));
          }
        }
        ctx.stroke();
      }

      // Find max volume to scale volume bars
      let maxVolume = 0;
      for (let i = startIdx; i <= effectiveEndIdx; i++) {
         if (data[i] && data[i].volume && data[i].volume > maxVolume) {
            maxVolume = data[i].volume;
         }
      }

      // Base Y for volume is at the bottom of the main chart
      const volumeBaseY = topPadding + mainHeight;
      const volumeMaxHeight = mainHeight * 0.2; // Volume takes bottom 20% of main chart

      // Draw Candles & Volume
      for (let i = startIdx; i <= effectiveEndIdx; i++) {
        const d = data[i];
        const val = getOhlcValue(i);
        const x = getX(i);
        const yOpen = getY(val.open);
        const yClose = getY(val.close);
        const yHigh = getY(val.high);
        const yLow = getY(val.low);

        const isGreen = val.direction >= 1;
        const color = isGreen 
            ? (visibilitySettings?.candleUpColor || '#10b981') 
            : (visibilitySettings?.candleDownColor || '#ef4444');
        const wickColor = isGreen 
            ? (visibilitySettings?.wickUpColor || '#059669') 
            : (visibilitySettings?.wickDownColor || '#b91c1c'); // Slightly darker wick for contrast

        // Draw Volume
        if (d.volume && maxVolume > 0) {
           const volHeight = (d.volume / maxVolume) * volumeMaxHeight;
           
           // Extract RGB for volume alpha
           let volRgb = isGreen ? '16, 185, 129' : '239, 68, 68';
           // If custom color is passed, fallback to simple fill (without opacity) for simplicity, or we can use custom color with opacity
           // A quick way is to just use the the globalAlpha
           
           ctx.globalAlpha = 0.15;
           ctx.fillStyle = color;
           ctx.fillRect(x - candleWidth / 2, volumeBaseY - volHeight, candleWidth, volHeight);
           ctx.globalAlpha = 1.0;
        }

        // Draw Wick
        ctx.strokeStyle = wickColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Draw Body
        ctx.fillStyle = color;
        const bodyTop = Math.min(yOpen, yClose);
        let bodyHeight = Math.abs(yOpen - yClose);
        
        if (bodyHeight < 1.5) {
            bodyHeight = 1.5; // Ensure tiny bodies are visible
        }
        
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        
        // Add a subtle border to the body for definition
        ctx.strokeStyle = wickColor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

        if (mainIndicatorVisible && config.type === 'candlestick_pattern' && computedIndicators?.entrySignal?.candlestick_pattern) {
           const cp = computedIndicators.entrySignal.candlestick_pattern;
           if (cp && cp.patterns && cp.patterns[i]) {
              const patternNames = cp.patterns[i];
              if (patternNames !== "high" && patternNames !== "low" && patternNames !== "neutral") {
                 ctx.save();
                 ctx.translate(x - 2, yHigh - 8);
                 ctx.rotate(-Math.PI / 2);
                 ctx.fillStyle = val.direction >= 1 ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)';
                 ctx.font = '10px JetBrains Mono';
                 ctx.textAlign = 'left';
                 ctx.fillText(patternNames.replace(/_/g, ' '), 0, 0);
                 ctx.restore();
              }
           }
        }
      }

      // Draw MA Lines
      if (mainIndicatorVisible && config.type === 'ma_crossover') {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(let i = startIdx; i <= effectiveEndIdx; i++) {
           const val = fastLine[i];
           if (isNaN(val)) continue;
           if (i === startIdx) ctx.moveTo(getX(i), getY(val));
           else ctx.lineTo(getX(i), getY(val));
        }
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        for(let i = startIdx; i <= effectiveEndIdx; i++) {
           const val = slowLine[i];
           if (isNaN(val)) continue;
           if (i === startIdx) ctx.moveTo(getX(i), getY(val));
           else ctx.lineTo(getX(i), getY(val));
        }
        ctx.stroke();
      }

      // Draw Supertrend
      if (mainIndicatorVisible && config.type === 'supertrend' && supertrends.supertrend && supertrends.supertrend.length > 0) {
        let prevTrend = supertrends.trend[startIdx];
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(let i = startIdx; i <= effectiveEndIdx; i++) {
          const val = supertrends.supertrend[i];
          const stTrend = supertrends.trend[i];
          if (isNaN(val)) continue;
          
          if (i === startIdx || prevTrend !== stTrend) {
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = stTrend === 1 ? '#10b981' : '#ef4444';
            ctx.moveTo(getX(i), getY(val));
          } else {
             ctx.lineTo(getX(i), getY(val));
          }
          prevTrend = stTrend;
        }
        ctx.stroke();
      }

      // Draw Supertrend Regime
      if (mainIndicatorVisible && config.type === 'supertrend_regime' && computedIndicators?.supertrend_regime?.supertrend?.length > 0) {
        let prevTrend = computedIndicators.supertrend_regime.trend_direction[startIdx];
        let sr = computedIndicators.supertrend_regime;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(let i = startIdx; i <= effectiveEndIdx; i++) {
          const val = sr.supertrend[i];
          const stTrend = sr.trend_direction[i];
          if (isNaN(val)) continue;
          
          if (i === startIdx || prevTrend !== stTrend) {
            ctx.stroke();
            ctx.beginPath();
            // the supertrend color might be overridden by regime
            ctx.strokeStyle = stTrend === 1 ? '#10b981' : '#ef4444';
            if (sr.vol_regime[i] === 0) {
               ctx.strokeStyle = '#4b5563'; // Gray if low vol regime
            }
            ctx.moveTo(getX(i), getY(val));
          } else {
             ctx.lineTo(getX(i), getY(val));
          }
          prevTrend = stTrend;
        }
        ctx.stroke();
      }

      // Draw Bollinger Bands
      if (mainIndicatorVisible && config.type === 'bollinger_bands' && computedIndicators?.entrySignal?.bb) {
         const bb = computedIndicators.entrySignal.bb;
         
         // Upper Band
         ctx.strokeStyle = '#3b82f6';
         ctx.lineWidth = 1.5;
         ctx.beginPath();
         let started = false;
         for(let i = startIdx; i <= effectiveEndIdx; i++) {
            const val = bb[i]?.upper;
            if (val === undefined || isNaN(val)) continue;
            if (!started) { ctx.moveTo(getX(i), getY(val)); started = true; }
            else ctx.lineTo(getX(i), getY(val));
         }
         ctx.stroke();

         // Lower Band
         ctx.strokeStyle = '#3b82f6';
         ctx.beginPath();
         started = false;
         for(let i = startIdx; i <= effectiveEndIdx; i++) {
            const val = bb[i]?.lower;
            if (val === undefined || isNaN(val)) continue;
            if (!started) { ctx.moveTo(getX(i), getY(val)); started = true; }
            else ctx.lineTo(getX(i), getY(val));
         }
         ctx.stroke();
         
         // Basis
         ctx.strokeStyle = '#f59e0b';
         ctx.beginPath();
         started = false;
         for(let i = startIdx; i <= effectiveEndIdx; i++) {
            const val = bb[i]?.basis;
            if (val === undefined || isNaN(val)) continue;
            if (!started) { ctx.moveTo(getX(i), getY(val)); started = true; }
            else ctx.lineTo(getX(i), getY(val));
         }
         ctx.stroke();
      }

      // Draw Bottom Panes
      indicators.forEach((indType, indIdx) => {
        const paneTop = topPadding + mainHeight + (totalGraphHeight * 0.05) + (indIdx * (indicatorPaneHeight + 5));
        
        ctx.strokeStyle = 'rgba(150, 150, 150, 0.2)';
        ctx.strokeRect(leftPadding, paneTop, chartWidth, indicatorPaneHeight);

        if (indType === 'stochastic' && stochastic) {
          const getIndY = (v: number) => paneTop + indicatorPaneHeight - (v / 100) * indicatorPaneHeight;
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
          ctx.beginPath(); ctx.moveTo(leftPadding, getIndY(80)); ctx.lineTo(width - rightPadding, getIndY(80)); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(leftPadding, getIndY(20)); ctx.lineTo(width - rightPadding, getIndY(20)); ctx.stroke();
          ctx.setLineDash([]);
          
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for(let i = startIdx; i <= effectiveEndIdx; i++) {
            const val = stochastic.k[i];
            if (isNaN(val)) continue;
            if (i === startIdx) ctx.moveTo(getX(i), getIndY(val));
            else ctx.lineTo(getX(i), getIndY(val));
          }
          ctx.stroke();

          ctx.strokeStyle = '#f59e0b';
          ctx.beginPath();
          for(let i = startIdx; i <= effectiveEndIdx; i++) {
            const val = stochastic.d[i];
            if (isNaN(val)) continue;
            if (i === startIdx) ctx.moveTo(getX(i), getIndY(val));
            else ctx.lineTo(getX(i), getIndY(val));
          }
          ctx.stroke();
          
          ctx.fillStyle = 'rgba(150, 150, 150, 0.5)';
          ctx.font = '10px JetBrains Mono';
          ctx.fillText('STOCH', leftPadding + 5, paneTop + 12);
        }

        if (indType === 'linear_regression' && lrData) {
          const getIndY = (v: number) => {
             // Let's assume normalized slope is between -5 and 5
             const minS = -5;
             const maxS = 5;
             const range = maxS - minS;
             const clamped = Math.max(minS, Math.min(maxS, v));
             return paneTop + indicatorPaneHeight - ((clamped - minS) / range) * indicatorPaneHeight;
          };
          
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
          ctx.beginPath(); ctx.moveTo(leftPadding, getIndY(1.5)); ctx.lineTo(width - rightPadding, getIndY(1.5)); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(leftPadding, getIndY(-1.5)); ctx.lineTo(width - rightPadding, getIndY(-1.5)); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(leftPadding, getIndY(0)); ctx.lineTo(width - rightPadding, getIndY(0)); ctx.stroke();
          ctx.setLineDash([]);
          
          // Reversion markers
          for(let i = startIdx; i <= effectiveEndIdx; i++) {
             const rev = lrData.reversion[i];
             if (rev === 1) { // Oversold -> Reversion up
               ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
               ctx.fillRect(getX(i) - 2, getIndY(lrData.trend_strength[i]) + 5, 4, 4);
             } else if (rev === -1) { // Overbought -> Reversion down
               ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
               ctx.fillRect(getX(i) - 2, getIndY(lrData.trend_strength[i]) - 9, 4, 4);
             }
          }

          ctx.strokeStyle = '#22d3ee'; // Cyan for trend strength
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for(let i = startIdx; i <= effectiveEndIdx; i++) {
            const val = lrData.trend_strength[i];
            if (isNaN(val)) continue;
            if (i === startIdx) ctx.moveTo(getX(i), getIndY(val));
            else ctx.lineTo(getX(i), getIndY(val));
          }
          ctx.stroke();

          ctx.fillStyle = 'rgba(34, 211, 238, 0.5)';
          ctx.font = '10px JetBrains Mono';
          ctx.fillText('LIN REG', leftPadding + 5, paneTop + 12);
        }

        if (indType === 'adx' && adxData) {
          const getIndY = (v: number) => paneTop + indicatorPaneHeight - (v / 100) * indicatorPaneHeight;
          
          // Draw threshold
          if (adxThreshold) {
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
            ctx.beginPath();
            ctx.moveTo(leftPadding, getIndY(adxThreshold));
            ctx.lineTo(width - rightPadding, getIndY(adxThreshold));
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
            ctx.fillText(adxThreshold.toString(), width - rightPadding + 5, getIndY(adxThreshold));
          }

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for(let i = startIdx; i <= effectiveEndIdx; i++) {
            const val = adxData?.adx?.[i];
            if (val === undefined || isNaN(val)) continue;
            if (i === startIdx) ctx.moveTo(getX(i), getIndY(val));
            else ctx.lineTo(getX(i), getIndY(val));
          }
          ctx.stroke();

          ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          for(let i = startIdx; i <= effectiveEndIdx; i++) {
            const val = adxData?.plusDI?.[i];
            if (val === undefined || isNaN(val)) continue;
            if (i === startIdx) ctx.moveTo(getX(i), getIndY(val));
            else ctx.lineTo(getX(i), getIndY(val));
          }
          ctx.stroke();

          ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
          ctx.beginPath();
          for(let i = startIdx; i <= effectiveEndIdx; i++) {
            const val = adxData?.minusDI?.[i];
            if (isNaN(val)) continue;
            if (i === startIdx) ctx.moveTo(getX(i), getIndY(val));
            else ctx.lineTo(getX(i), getIndY(val));
          }
          ctx.stroke();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.font = '10px JetBrains Mono';
          ctx.fillText('ADX', leftPadding + 5, paneTop + 12);
        }

        if (indType === 'squeeze' && squeezeData) {
          const midY = paneTop + indicatorPaneHeight / 2;

          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
          ctx.beginPath();
          ctx.moveTo(leftPadding, midY);
          ctx.lineTo(width - rightPadding, midY);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw dots
          for(let i = startIdx; i <= effectiveEndIdx; i++) {
             const status = squeezeData.squeeze_status[i];
             ctx.beginPath();
             ctx.arc(getX(i), midY, 3, 0, 2 * Math.PI);
             if (status === 1) {
               ctx.fillStyle = '#ef4444'; // Red: Squeeze ON
             } else if (status === 0) {
               ctx.fillStyle = '#10b981'; // Green: Squeeze OFF
             } else {
               ctx.fillStyle = '#4b5563'; // Gray: Unknown
             }
             ctx.fill();
          }

          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.font = '10px JetBrains Mono';
          ctx.fillText('SQUEEZE', leftPadding + 5, paneTop + 12);
        }

        if (indType === 'zscore' && zScoreData) {
          const getIndY = (v: number) => {
             // Z-score mostly fluctuates between -3 and 3
             // Let's map -3 to bottom and 3 to top
             const minZ = -3;
             const maxZ = 3;
             const range = maxZ - minZ;
             const clamped = Math.max(minZ, Math.min(maxZ, v));
             return paneTop + indicatorPaneHeight - ((clamped - minZ) / range) * indicatorPaneHeight;
          };
          
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
          ctx.beginPath();
          ctx.moveTo(leftPadding, getIndY(0));
          ctx.lineTo(width - rightPadding, getIndY(0));
          ctx.stroke();
          ctx.setLineDash([]);
          
          ctx.strokeStyle = '#a855f7'; // Purple for volatility Z-score
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for(let i = startIdx; i <= effectiveEndIdx; i++) {
            const val = zScoreData[i];
            if (isNaN(val)) continue;
            if (i === startIdx) ctx.moveTo(getX(i), getIndY(val));
            else ctx.lineTo(getX(i), getIndY(val));
          }
          ctx.stroke();

          ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
          ctx.font = '10px JetBrains Mono';
          ctx.fillText('Z-SCORE', leftPadding + 5, paneTop + 12);
        }

        if (indType === 'supertrend_regime_zscore' && computedIndicators.supertrend_regime) {
          const sr = computedIndicators.supertrend_regime;
          const getIndY = (v: number) => {
             const minZ = -3;
             const maxZ = 3;
             const range = maxZ - minZ;
             const clamped = Math.max(minZ, Math.min(maxZ, v));
             return paneTop + indicatorPaneHeight - ((clamped - minZ) / range) * indicatorPaneHeight;
          };
          
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
          ctx.beginPath();
          ctx.moveTo(leftPadding, getIndY(0));
          ctx.lineTo(width - rightPadding, getIndY(0));
          ctx.stroke();

          const zUpper = config.zUpper || 1.5;
          const zLower = config.zLower || -1.5;

          ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.beginPath();
          ctx.moveTo(leftPadding, getIndY(zUpper));
          ctx.lineTo(width - rightPadding, getIndY(zUpper));
          ctx.stroke();

          ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
          ctx.beginPath();
          ctx.moveTo(leftPadding, getIndY(zLower));
          ctx.lineTo(width - rightPadding, getIndY(zLower));
          ctx.stroke();

          ctx.setLineDash([]);
          
          // Plot Z-Score
          ctx.strokeStyle = '#a855f7'; 
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for(let i = startIdx; i <= effectiveEndIdx; i++) {
            const val = sr.zscore[i];
            if (isNaN(val)) continue;
            if (i === startIdx) ctx.moveTo(getX(i), getIndY(val));
            else ctx.lineTo(getX(i), getIndY(val));
          }
          ctx.stroke();
          
          // Reversion markers
          for(let i = startIdx; i <= effectiveEndIdx; i++) {
             const rev = sr.reversion[i];
             if (rev === 1) { // Oversold -> Reversion up
               ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
               ctx.fillRect(getX(i) - 2, getIndY(sr.zscore[i]) + 5, 4, 4);
             } else if (rev === -1) { // Overbought -> Reversion down
               ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
               ctx.fillRect(getX(i) - 2, getIndY(sr.zscore[i]) - 9, 4, 4);
             }
          }

          ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
          ctx.font = '10px JetBrains Mono';
          ctx.fillText('SR Z-SCORE', leftPadding + 5, paneTop + 12);
        }
      });

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
  }, [data, simulationIndex, config, trades, tradingEnabled, useStopLoss, panOffset, visibilitySettings, zoomLevel]);

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
        {/* Floating Zoom & Pan Controls */}
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
