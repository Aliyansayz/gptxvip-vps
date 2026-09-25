import React, { useEffect, useRef } from 'react';
import { Ohlc, calculateSMA, calculateEMA, calculateStochastic, calculateSupertrend, calculateStopBandsSmooth, calculateADX } from '../functions/api/indicators/baseline';
import { calculateVolatilityZScore } from '../functions/api/indicators/exclusive';
import { linearRegressionSystem } from '../functions/api/indicators/exclusive/linearRegression';
import { calculateSqueeze } from '../functions/api/indicators/exclusive/squeeze_momentum';
import { Trade } from '../../types/trading';

interface Config {
  type: 'ma_crossover' | 'stochastic' | 'supertrend' | 'divergence' | 'linear_regression';
  fastMa?: number;
  slowMa?: number;
  stochK?: number;
  stochD?: number;
  supertrendPeriod?: number;
  supertrendMultiplier?: number;
  lrSlopePeriod?: number;
  lrVolPeriod?: number;
  lrRegimePeriod?: number;
  exitAfterNCandlesMin?: number;
  exitAfterNCandlesMax?: number;
  exitAfterNMinutesMin?: number;
  exitAfterNMinutesMax?: number;
  exitAfterNSecondsMin?: number;
  exitAfterNSecondsMax?: number;
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
}

export const CandlestickSimulatorCanvas: React.FC<CandlestickSimulatorCanvasProps> = ({
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
  title
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const computedIndicators = React.useMemo(() => {
    if (data.length === 0 || hideIndicators) return null;
    const fullClosePrices = data.map(d => d.close);
    const fullHighs = data.map(d => d.high);
    const fullLows = data.map(d => d.low);

    const result: any = {};
    const indicators: string[] = [];
    if (config.type === 'stochastic' || config.type === 'divergence') indicators.push('stochastic');
    if (config.type === 'linear_regression') indicators.push('linear_regression');
    if (useADXFilter) indicators.push('adx');
    if (useSqueezeFilter) indicators.push('squeeze');
    const hasZScoreFilters = config.exitAfterNCandlesMin || config.exitAfterNCandlesMax || config.exitAfterNMinutesMin || config.exitAfterNMinutesMax || config.exitAfterNSecondsMin || config.exitAfterNSecondsMax;
    if (hasZScoreFilters) indicators.push('zscore');

    result.indicatorsList = indicators;

    if (config.type === 'ma_crossover') {
      result.fastLine = calculateEMA(fullClosePrices, config.fastMa || 9);
      result.slowLine = calculateSMA(fullClosePrices, config.slowMa || 21);
    }
    if (config.type === 'supertrend') {
      result.supertrend = calculateSupertrend(data, config.supertrendPeriod || 10, config.supertrendMultiplier || 3);
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

      // Determine viewport (sliding window of last 100 bars)
      const windowSize = 80;
      const startIdx = Math.max(0, simulationIndex - windowSize);
      const visibleData = data.slice(startIdx, simulationIndex + 1);
      
      if (visibleData.length === 0) return;

      const rightPadding = 60;
      const leftPadding = 40;
      const topPadding = 20;
      const bottomPadding = 40;
      const chartWidth = width - leftPadding - rightPadding;

      // Splitting height based on indicator
      let totalGraphHeight = height - topPadding - bottomPadding;
      
      const indicators = computedIndicators ? computedIndicators.indicatorsList : [];

      let mainHeightRatio = 1;
      if (indicators.length === 1) mainHeightRatio = 0.70;
      else if (indicators.length === 2) mainHeightRatio = 0.60;
      else if (indicators.length === 3) mainHeightRatio = 0.50;
      else if (indicators.length === 4) mainHeightRatio = 0.40;

      let mainHeight = totalGraphHeight * mainHeightRatio;
      let indicatorPaneHeight = indicators.length > 0 ? Math.max((totalGraphHeight * (1 - mainHeightRatio) - (indicators.length * 5)) / indicators.length, 60) : 0;


      // Main Chart min/max
      let rawMin = Math.min(...visibleData.map(d => d.low));
      let rawMax = Math.max(...visibleData.map(d => d.high));

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
         for (let i = startIdx; i <= simulationIndex; i++) {
            const lower = visibleStops.lowerBand[i];
            const upper = visibleStops.upperBand[i];
            if (lower && !isNaN(lower)) rawMin = Math.min(rawMin, lower);
            if (upper && !isNaN(upper)) rawMax = Math.max(rawMax, upper);
         }
      }

      if (config.type === 'supertrend' && computedIndicators?.supertrend?.supertrend?.length > 0) {
         for (let i = startIdx; i <= simulationIndex; i++) {
            const st = computedIndicators.supertrend.supertrend[i];
            if (st && !isNaN(st)) {
               rawMin = Math.min(rawMin, st);
               rawMax = Math.max(rawMax, st);
            }
         }
      }

      if (config.type === 'ma_crossover' && computedIndicators) {
         for (let i = startIdx; i <= simulationIndex; i++) {
            const f = computedIndicators.fastLine?.[i];
            const s = computedIndicators.slowLine?.[i];
            if (f && !isNaN(f)) { rawMin = Math.min(rawMin, f); rawMax = Math.max(rawMax, f); }
            if (s && !isNaN(s)) { rawMin = Math.min(rawMin, s); rawMax = Math.max(rawMax, s); }
         }
      }
      
      let priceRange = (rawMax - rawMin) || 1;
      let minPrice = rawMin - priceRange * 0.15;
      let maxPrice = rawMax + priceRange * 0.15;

      const getY = (p: number) => topPadding + mainHeight - ((p - minPrice) / (maxPrice - minPrice)) * mainHeight;
      const getX = (i: number) => leftPadding + ((i - startIdx) / Math.max(1, windowSize)) * chartWidth;
      const candleWidth = Math.max(3, (chartWidth / Math.max(1, windowSize)) * 0.7);

      // Draw Axes Lines
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftPadding, topPadding);
      ctx.lineTo(leftPadding, topPadding + mainHeight); // Y axis left
      ctx.lineTo(width - rightPadding, topPadding + mainHeight); // X axis bottom
      ctx.lineTo(width - rightPadding, topPadding); // Y axis right
      ctx.stroke();

      // Draw Horizontal Grid & Price Labels
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '10px JetBrains Mono, monospace';
      
      for (let i = 0; i <= 5; i++) {
        const y = topPadding + (mainHeight * i) / 5;
        const price = maxPrice - (i * (maxPrice - minPrice)) / 5;
        
        ctx.strokeStyle = 'rgba(150, 150, 150, 0.05)';
        ctx.beginPath();
        ctx.moveTo(leftPadding, y);
        ctx.lineTo(width - rightPadding, y);
        ctx.stroke();

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
      const currentPrice = data[simulationIndex].close;
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
         if (trade.entryIndex >= startIdx && trade.entryIndex <= simulationIndex) {
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
             ctx.lineTo(getX(simulationIndex), getY(trade.takeProfit));
             ctx.stroke();
           }
           if (trade.stopLoss) {
             ctx.strokeStyle = '#ef4444'; // red dashed
             ctx.beginPath();
             ctx.moveTo(Math.max(leftPadding, getX(trade.entryIndex)), getY(trade.stopLoss));
             ctx.lineTo(getX(simulationIndex), getY(trade.stopLoss));
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
        for (let i = startIdx; i <= simulationIndex; i++) {
          const val = visibleStops.lowerBand[i];
          if (val && !isNaN(val)) {
            if (i === startIdx) ctx.moveTo(getX(i), getY(val));
            else ctx.lineTo(getX(i), getY(val));
          }
        }
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'; // Upper band
        ctx.beginPath();
        for (let i = startIdx; i <= simulationIndex; i++) {
          const val = visibleStops.upperBand[i];
          if (val && !isNaN(val)) {
            if (i === startIdx) ctx.moveTo(getX(i), getY(val));
            else ctx.lineTo(getX(i), getY(val));
          }
        }
        ctx.stroke();
      }

      // Draw Candles
      for (let i = startIdx; i <= simulationIndex; i++) {
        const d = data[i];
        const x = getX(i);
        const yOpen = getY(d.open);
        const yClose = getY(d.close);
        const yHigh = getY(d.high);
        const yLow = getY(d.low);

        const isGreen = d.close >= d.open;
        const color = isGreen ? '#10b981' : '#ef4444';

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        ctx.fillStyle = color;
        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1.5);
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      }

      // Draw MA Lines
      if (config.type === 'ma_crossover') {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(let i = startIdx; i <= simulationIndex; i++) {
           const val = fastLine[i];
           if (isNaN(val)) continue;
           if (i === startIdx) ctx.moveTo(getX(i), getY(val));
           else ctx.lineTo(getX(i), getY(val));
        }
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        for(let i = startIdx; i <= simulationIndex; i++) {
           const val = slowLine[i];
           if (isNaN(val)) continue;
           if (i === startIdx) ctx.moveTo(getX(i), getY(val));
           else ctx.lineTo(getX(i), getY(val));
        }
        ctx.stroke();
      }

      // Draw Supertrend
      if (config.type === 'supertrend' && supertrends.supertrend && supertrends.supertrend.length > 0) {
        let prevTrend = supertrends.trend[startIdx];
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(let i = startIdx; i <= simulationIndex; i++) {
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
          for(let i = startIdx; i <= simulationIndex; i++) {
            const val = stochastic.k[i];
            if (isNaN(val)) continue;
            if (i === startIdx) ctx.moveTo(getX(i), getIndY(val));
            else ctx.lineTo(getX(i), getIndY(val));
          }
          ctx.stroke();

          ctx.strokeStyle = '#f59e0b';
          ctx.beginPath();
          for(let i = startIdx; i <= simulationIndex; i++) {
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
          for(let i = startIdx; i <= simulationIndex; i++) {
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
          for(let i = startIdx; i <= simulationIndex; i++) {
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
          for(let i = startIdx; i <= simulationIndex; i++) {
            const val = adxData.adx[i];
            if (isNaN(val)) continue;
            if (i === startIdx) ctx.moveTo(getX(i), getIndY(val));
            else ctx.lineTo(getX(i), getIndY(val));
          }
          ctx.stroke();

          ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          for(let i = startIdx; i <= simulationIndex; i++) {
            const val = adxData.plusDI[i];
            if (isNaN(val)) continue;
            if (i === startIdx) ctx.moveTo(getX(i), getIndY(val));
            else ctx.lineTo(getX(i), getIndY(val));
          }
          ctx.stroke();

          ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
          ctx.beginPath();
          for(let i = startIdx; i <= simulationIndex; i++) {
            const val = adxData.minusDI[i];
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
          for(let i = startIdx; i <= simulationIndex; i++) {
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
          for(let i = startIdx; i <= simulationIndex; i++) {
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
      });

    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [data, simulationIndex, config, trades, tradingEnabled, useStopLoss]);

  return (
    <div className="relative w-full h-full">
      {title && (
        <div className="absolute top-3 left-[70px] bg-zinc-950/60 backdrop-blur-sm border border-zinc-800 text-zinc-300 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow-sm z-10 pointer-events-none">
          {title}
        </div>
      )}
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
