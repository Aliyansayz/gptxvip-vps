import { Ohlc } from '../../functions/api/indicators/baseline';

export interface Config {
  type: 'ma_crossover' | 'stochastic' | 'supertrend' | 'divergence' | 'linear_regression' | 'bollinger_bands' | 'ichimoku' | 'three_candle_strike' | 'turtle_trading' | 'supertrend_regime' | 'heikin_ashi_smoothed' | 'candlestick_pattern';
  entryPeriod?: number;
  exitPeriod?: number;
  nPeriod?: number;
  stopMultiple?: number;
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
  haSmoothLen?: number;
}

export interface CandlestickSimulatorProps {
  config: Config;
}

export function aggregateData(source: Ohlc[], factor: number): Ohlc[] {
  if (factor <= 1 || source.length === 0) return source;
  const result: Ohlc[] = [];
  for (let i = 0; i < source.length; i += factor) {
    const chunk = source.slice(i, i + factor);
    result.push({
      time: chunk[chunk.length - 1].time,
      open: chunk[0].open,
      high: Math.max(...chunk.map(c => c.high)),
      low: Math.min(...chunk.map(c => c.low)),
      close: chunk[chunk.length - 1].close,
      volume: chunk.reduce((sum, c) => sum + c.volume, 0)
    });
  }
  return result;
}
