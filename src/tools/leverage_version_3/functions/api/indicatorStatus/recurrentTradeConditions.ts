import { Ohlc } from '../indicators/baseline';
import { calculateADX } from '../indicators/integral/adx';
import { calculateSqueeze } from '../indicators/exclusive/squeeze_momentum';
import { linearRegressionSystem } from '../indicators/trendStrength/trendStrength';
import { smoothedHeikinAshi } from '../indicators/heikin_ashi_smoothing';

export function evaluateRecurrentTradeConditionsState(
  data: Ohlc[],
  tradeDirection: 'LONG' | 'SHORT',
  adxThreshold: number = 18
) {
  if (data.length < 50) {
    return {
      isSqueezeValid: false,
      isAdxValid: false,
      isTrendStrengthFavorable: false,
      isHeikinAshiFavorable: false
    };
  }

  // Use a sensible lookback block to keep it fast
  const lookback = 100;
  const subset = data.slice(Math.max(0, data.length - lookback));
  
  const close = subset.map(d => d.close);
  const high = subset.map(d => d.high);
  const low = subset.map(d => d.low);
  const open = subset.map(d => d.open);
  
  // 1. Squeeze Momentum (assuming valid means expansion, squeezeStatus === 0)
  const squeeze = calculateSqueeze(close, high, low, true, 20, 2.0, 20, 1.5);
  const lastSqueeze = squeeze.squeeze_status[squeeze.squeeze_status.length - 1];
  const isSqueezeValid = lastSqueeze === 0;

  // 2. ADX
  const adxData = calculateADX(subset, 14);
  const lastAdx = Array.isArray(adxData) ? adxData[adxData.length - 1] : adxData.adx[adxData.adx.length - 1];
  const isAdxValid = !isNaN(lastAdx) && lastAdx >= adxThreshold;

  // 3. Trend Strength (linearRegressionSystem direction)
  const lr = linearRegressionSystem(close, 20, 20, 30);
  const lastDir = lr.direction[lr.direction.length - 1];
  const isTrendStrengthFavorable = (tradeDirection === 'LONG' && lastDir === 1) ||
                                   (tradeDirection === 'SHORT' && lastDir === -1);

  // 4. Smoothed Heikin Ashi
  const ha = smoothedHeikinAshi(open, high, low, close, 10);
  const lastHaDir = ha.direction[ha.direction.length - 1];
  const isHeikinAshiFavorable = (tradeDirection === 'LONG' && lastHaDir === 1) ||
                                (tradeDirection === 'SHORT' && lastHaDir === -1);

  return {
    isSqueezeValid,
    isAdxValid,
    isTrendStrengthFavorable,
    isHeikinAshiFavorable
  };
}

export function evaluateRecurrentTradeReversalTriggers(
  data: Ohlc[],
  tradeDirection: 'LONG' | 'SHORT'
) {
  if (data.length < 50) {
    return {
      trendStrengthRevert: false,
      candlesRevert: false
    };
  }

  // Use a lookback block to keep it fast
  const lookback = 100;
  const subset = data.slice(Math.max(0, data.length - lookback));
  
  const close = subset.map(d => d.close);
  const high = subset.map(d => d.high);
  const low = subset.map(d => d.low);
  const open = subset.map(d => d.open);

  const mainDir = tradeDirection === 'LONG' ? 1 : -1;
  const oppositeDir = tradeDirection === 'LONG' ? -1 : 1;

  // 1. Trend Strength (linearRegressionSystem)
  const lr = linearRegressionSystem(close, 20, 20, 30);
  const dirLength = lr.direction.length;
  const lastDir = lr.direction[dirLength - 1];
  const prevDir = lr.direction[dirLength - 2];
  
  const lastStrength = lr.trend_strength[lr.trend_strength.length - 1];
  
  // Reverted from opposite direction (or 0) to mainDir with strong strength (abs >= 1.0)
  const trendStrengthRevert = (lastDir === mainDir && prevDir === oppositeDir && Math.abs(lastStrength) >= 1.0);

  // 2. Smoothed Heikin Ashi
  const ha = smoothedHeikinAshi(open, high, low, close, 10);
  const haLength = ha.direction.length;
  const lastHaDir = ha.direction[haLength - 1];
  const prevHaDir = ha.direction[haLength - 2];

  // Reverted from opposite direction to mainDir
  const candlesRevert = (lastHaDir === mainDir && prevHaDir === oppositeDir);

  return {
    trendStrengthRevert,
    candlesRevert
  };
}

