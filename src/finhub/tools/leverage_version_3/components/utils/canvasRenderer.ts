import { Ohlc } from '../../functions/api/indicators/baseline';
import { Trade } from '../../../types/trading';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  data: Ohlc[];
  startIdx: number;
  effectiveEndIdx: number;
  windowSize: number;
  minPrice: number;
  maxPrice: number;
  getX: (i: number) => number;
  getY: (p: number) => number;
  leftPadding: number;
  rightPadding: number;
  topPadding: number;
  mainHeight: number;
  indicatorPaneHeight: number;
  width: number;
  chartWidth: number;
  config: any;
  computedIndicators: any;
  trades: Trade[];
  visibilitySettings?: any;
  tradingEnabled: boolean;
  useStopLoss: boolean;
  haResult?: any;
}

export const getOhlcValue = (data: Ohlc[], idx: number, haResult?: any) => {
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

export const drawAxesAndGrid = (context: RenderContext) => {
  const { ctx, leftPadding, rightPadding, topPadding, mainHeight, width, minPrice, maxPrice, data, startIdx, windowSize, getX } = context;

  ctx.strokeStyle = 'rgba(150, 150, 150, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(leftPadding, topPadding);
  ctx.lineTo(leftPadding, topPadding + mainHeight); // Y axis left
  ctx.lineTo(width - rightPadding, topPadding + mainHeight); // X axis bottom
  ctx.lineTo(width - rightPadding, topPadding); // Y axis right
  ctx.stroke();

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
};

export const drawCurrentPrice = (context: RenderContext) => {
  const { ctx, leftPadding, rightPadding, width, data, effectiveEndIdx, getY } = context;
  const currentPrice = data[effectiveEndIdx]?.close;
  if (currentPrice === undefined) return;

  const currentY = getY(currentPrice);
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.moveTo(leftPadding, currentY);
  ctx.lineTo(width - rightPadding, currentY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#10b981';
  ctx.fillRect(width - rightPadding, currentY - 10, rightPadding, 20);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText(currentPrice.toFixed(2), width - rightPadding + 5, currentY);
};

export const drawCandlesAndVolume = (context: RenderContext) => {
  const { ctx, startIdx, effectiveEndIdx, data, getX, getY, mainHeight, topPadding, chartWidth, windowSize, visibilitySettings, config, computedIndicators, haResult } = context;
  const rightMarginSpace = 6;
  const candleWidth = Math.max(3, (chartWidth / Math.max(1, windowSize + rightMarginSpace)) * 0.7);
  
  let maxVolume = 0;
  for (let i = startIdx; i <= effectiveEndIdx; i++) {
     if (data[i] && data[i].volume && data[i].volume > maxVolume) {
        maxVolume = data[i].volume;
     }
  }

  const volumeBaseY = topPadding + mainHeight;
  const volumeMaxHeight = mainHeight * 0.2; 
  const mainIndicatorVisible = visibilitySettings?.mainIndicatorVisible !== false;

  for (let i = startIdx; i <= effectiveEndIdx; i++) {
    const d = data[i];
    if (!d) continue;
    const val = getOhlcValue(data, i, haResult);
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
        : (visibilitySettings?.wickDownColor || '#b91c1c');

    if (d.volume && maxVolume > 0) {
       const volHeight = (d.volume / maxVolume) * volumeMaxHeight;
       ctx.globalAlpha = 0.15;
       ctx.fillStyle = color;
       ctx.fillRect(x - candleWidth / 2, volumeBaseY - volHeight, candleWidth, volHeight);
       ctx.globalAlpha = 1.0;
    }

    ctx.strokeStyle = wickColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, yHigh);
    ctx.lineTo(x, yLow);
    ctx.stroke();

    ctx.fillStyle = color;
    const bodyTop = Math.min(yOpen, yClose);
    let bodyHeight = Math.abs(yOpen - yClose);
    
    if (bodyHeight < 1.5) {
        bodyHeight = 1.5;
    }
    
    ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    
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
};

export const drawTradeMarkers = (context: RenderContext) => {
  const { ctx, trades, startIdx, effectiveEndIdx, getX, getY, leftPadding } = context;

  trades.forEach(trade => {
    const isLong = trade.side === 'LONG';
    if (trade.entryIndex >= startIdx && trade.entryIndex <= effectiveEndIdx) {
      ctx.fillStyle = isLong ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
      ctx.fillRect(getX(trade.entryIndex) - 10, getY(trade.entryPrice) - 10, 20, 20);
    }

    if (trade.status === 'OPEN') {
      ctx.setLineDash([4, 4]);
      if (trade.takeProfit) {
        ctx.strokeStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(Math.max(leftPadding, getX(trade.entryIndex)), getY(trade.takeProfit));
        ctx.lineTo(getX(effectiveEndIdx), getY(trade.takeProfit));
        ctx.stroke();
      }
      if (trade.stopLoss) {
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(Math.max(leftPadding, getX(trade.entryIndex)), getY(trade.stopLoss));
        ctx.lineTo(getX(effectiveEndIdx), getY(trade.stopLoss));
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    if (trade.status === 'CLOSED' && trade.exitIndex) {
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
};

export const drawOverlays = (context: RenderContext) => {
  const { ctx, startIdx, effectiveEndIdx, getX, getY, computedIndicators, config, visibilitySettings, tradingEnabled, useStopLoss } = context;
  const mainIndicatorVisible = visibilitySettings?.mainIndicatorVisible !== false;

  const visibleStops = computedIndicators?.stops || { lowerBand: [], upperBand: [] };
  if (tradingEnabled && useStopLoss) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
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
    
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
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

  if (mainIndicatorVisible && config.type === 'ma_crossover' && computedIndicators) {
    const fastLine = computedIndicators.fastLine || [];
    const slowLine = computedIndicators.slowLine || [];
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

  if (mainIndicatorVisible && config.type === 'supertrend' && computedIndicators?.supertrend?.supertrend?.length > 0) {
    let supertrends = computedIndicators.supertrend;
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

  if (mainIndicatorVisible && config.type === 'supertrend_regime' && computedIndicators?.supertrend_regime?.supertrend?.length > 0) {
    let sr = computedIndicators.supertrend_regime;
    let prevTrend = sr.trend_direction[startIdx];
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let i = startIdx; i <= effectiveEndIdx; i++) {
      const val = sr.supertrend[i];
      const stTrend = sr.trend_direction[i];
      if (isNaN(val)) continue;
      
      if (i === startIdx || prevTrend !== stTrend) {
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = stTrend === 1 ? '#10b981' : '#ef4444';
        if (sr.vol_regime[i] === 0) {
           ctx.strokeStyle = '#4b5563';
        }
        ctx.moveTo(getX(i), getY(val));
      } else {
         ctx.lineTo(getX(i), getY(val));
      }
      prevTrend = stTrend;
    }
    ctx.stroke();
  }

  if (mainIndicatorVisible && config.type === 'bollinger_bands' && computedIndicators?.bb) {
     const bb = computedIndicators.bb;
     
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
  if (mainIndicatorVisible && (config.type === 'ichimoku' || config.type === 'three_candle_strike' || config.type === 'turtle_trading')) {
    const indicator = config.type === 'ichimoku' ? computedIndicators?.ichimoku : config.type === 'three_candle_strike' ? computedIndicators?.strike : computedIndicators?.turtle;
    if (indicator) {
      if (config.type === 'ichimoku') {
        for (let i = Math.max(startIdx + 1, 1); i <= effectiveEndIdx; i++) {
          const a0 = indicator.cloudA[i - 1], b0 = indicator.cloudB[i - 1];
          const a1 = indicator.cloudA[i], b1 = indicator.cloudB[i];
          if (![a0, b0, a1, b1].every(Number.isFinite)) continue;
          ctx.fillStyle = a1 >= b1 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)';
          ctx.beginPath();
          ctx.moveTo(getX(i - 1), getY(a0));
          ctx.lineTo(getX(i), getY(a1));
          ctx.lineTo(getX(i), getY(b1));
          ctx.lineTo(getX(i - 1), getY(b0));
          ctx.closePath();
          ctx.fill();
        }
      }
      const lines: [string, string][] = config.type === 'ichimoku'
        ? [['tenkan', '#22d3ee'], ['kijun', '#f59e0b'], ['cloudA', '#22c55e'], ['cloudB', '#ef4444']]
        : config.type === 'three_candle_strike'
        ? [['ema', '#f8fafc'], ['fast', '#facc15'], ['medium', '#fb923c'], ['slow', '#ef4444']]
        : [['entryUpper', '#22c55e'], ['entryLower', '#ef4444'], ['exitUpper', '#86efac'], ['exitLower', '#fca5a5']];
      for (const [key, color] of lines) {
        ctx.strokeStyle = color;
        ctx.lineWidth = key === 'cloudA' || key === 'cloudB' ? 1 : 1.5;
        ctx.beginPath();
        let started = false;
        for (let i = startIdx; i <= effectiveEndIdx; i++) {
          const value = indicator[key]?.[i];
          if (!Number.isFinite(value)) { started = false; continue; }
          if (!started) { ctx.moveTo(getX(i), getY(value)); started = true; }
          else ctx.lineTo(getX(i), getY(value));
        }
        ctx.stroke();
      }
      for (let i = startIdx; i <= effectiveEndIdx; i++) {
        const isLong = indicator.longEntry?.[i];
        const isShort = indicator.shortEntry?.[i];
        if (!isLong && !isShort) continue;
        const candle = context.data[i];
        if (!candle) continue;
        ctx.fillStyle = isLong ? '#22c55e' : '#ef4444';
        ctx.beginPath();
        const y = getY(isLong ? candle.low : candle.high) + (isLong ? 8 : -8);
        ctx.moveTo(getX(i), y + (isLong ? -5 : 5));
        ctx.lineTo(getX(i) - 4, y + (isLong ? 3 : -3));
        ctx.lineTo(getX(i) + 4, y + (isLong ? 3 : -3));
        ctx.closePath();
        ctx.fill();
      }
      if (config.type === 'turtle_trading') {
        ctx.lineWidth = 1.5;
        for (let i = startIdx; i <= effectiveEndIdx; i++) {
          const exitLong = indicator.exitLong?.[i];
          const exitShort = indicator.exitShort?.[i];
          if (!exitLong && !exitShort) continue;
          const candle = context.data[i];
          if (!candle) continue;
          ctx.strokeStyle = exitLong ? '#ef4444' : '#22c55e';
          ctx.beginPath();
          ctx.arc(getX(i), getY(candle.close), 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
  }
};

export const drawSubplots = (context: RenderContext) => {
  const { ctx, startIdx, effectiveEndIdx, getX, computedIndicators, visibilitySettings, config, topPadding, mainHeight, indicatorPaneHeight, width, chartWidth, leftPadding, rightPadding } = context;

  const subplotsVisible = visibilitySettings?.subplotsVisible !== false;
  const indicators: string[] = computedIndicators && subplotsVisible ? computedIndicators.indicatorsList : [];
  if (!indicators || indicators.length === 0) return;

  const stochastic = computedIndicators.stochastic;
  const adxData = computedIndicators.adx;
  const zScoreData = computedIndicators.zscores;
  const lrData = computedIndicators.lr;
  const squeezeData = computedIndicators.squeeze;

  // The caller sets up totalGraphHeight etc., we just need to loop through the indicators
  // For total graph height we need it. Passed via context or computed.
  // Actually we need the formula for paneTop.
  // paneTop = topPadding + mainHeight + (totalGraphHeight * 0.05) + (indIdx * (indicatorPaneHeight + 5));
  // Total height = context.height. topPadding = context.topPadding. bottomPadding = 40.
  const totalGraphHeight = context.mainHeight / (mainHeight / (context.mainHeight + (indicators.length * indicatorPaneHeight) + indicators.length * 5)); // This is tricky to reverse.
  // Let's pass paneTop calculation logic
  const spacing = 5;
  const paddingBetweenMainAndSubplots = 20;

  indicators.forEach((indType, indIdx) => {
    const paneTop = topPadding + mainHeight + paddingBetweenMainAndSubplots + (indIdx * (indicatorPaneHeight + spacing));
    
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
      
      for(let i = startIdx; i <= effectiveEndIdx; i++) {
         const rev = lrData.reversion[i];
         if (rev === 1) { 
           ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
           ctx.fillRect(getX(i) - 2, getIndY(lrData.trend_strength[i]) + 5, 4, 4);
         } else if (rev === -1) { 
           ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
           ctx.fillRect(getX(i) - 2, getIndY(lrData.trend_strength[i]) - 9, 4, 4);
         }
      }

      ctx.strokeStyle = '#22d3ee'; 
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
      
      const adxThreshold = context.config?.adxThreshold || 20; // Defaulting to 20 if not in config

      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.beginPath();
      ctx.moveTo(leftPadding, getIndY(adxThreshold));
      ctx.lineTo(width - rightPadding, getIndY(adxThreshold));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
      ctx.fillText(adxThreshold.toString(), width - rightPadding + 5, getIndY(adxThreshold));

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

      for(let i = startIdx; i <= effectiveEndIdx; i++) {
         const status = squeezeData.squeeze_status[i];
         ctx.beginPath();
         ctx.arc(getX(i), midY, 3, 0, 2 * Math.PI);
         if (status === 1) {
           ctx.fillStyle = '#ef4444'; 
         } else if (status === 0) {
           ctx.fillStyle = '#10b981'; 
         } else {
           ctx.fillStyle = '#4b5563'; 
         }
         ctx.fill();
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText('SQUEEZE', leftPadding + 5, paneTop + 12);
    }

    if (indType === 'zscore' && zScoreData) {
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
      ctx.setLineDash([]);
      
      ctx.strokeStyle = '#a855f7'; 
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
      
      for(let i = startIdx; i <= effectiveEndIdx; i++) {
         const rev = sr.reversion[i];
         if (rev === 1) { 
           ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
           ctx.fillRect(getX(i) - 2, getIndY(sr.zscore[i]) + 5, 4, 4);
         } else if (rev === -1) { 
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
