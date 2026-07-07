import { OHLCSimulationParams, Regime } from './asset_presets/types';

export type AssetType = 'Anonymous' | 'Gold' | 'Silver' | 'Oil' | 'Nasdaq100' | 'USDJPY' | 'GBPJPY' | 'EURJPY' | 'EURUSD' | 'AUDUSD' | 'USDCAD' | 'EURCAD';

export interface AssetConfig {
  name: AssetType;
  basePrice: number;
  volatility: number;
}

export const ASSETS_CONFIG: Record<AssetType, AssetConfig> = {
  'Anonymous': { name: 'Anonymous', basePrice: 42000, volatility: 1.5 },
  'Gold': { name: 'Gold', basePrice: 4600, volatility: 0.8 },
  'Silver': { name: 'Silver', basePrice: 75, volatility: 0.15 },
  'Oil': { name: 'Oil', basePrice: 85, volatility: 0.5 },
  'Nasdaq100': { name: 'Nasdaq100', basePrice: 20000, volatility: 20 },
  'USDJPY': { name: 'USDJPY', basePrice: 155, volatility: 0.2 },
  'GBPJPY': { name: 'GBPJPY', basePrice: 200, volatility: 0.2 },
  'EURJPY': { name: 'EURJPY', basePrice: 170, volatility: 0.2 },
  'EURUSD': { name: 'EURUSD', basePrice: 1.085, volatility: 0.05 },
  'AUDUSD': { name: 'AUDUSD', basePrice: 0.67, volatility: 0.05 },
  'USDCAD': { name: 'USDCAD', basePrice: 1.36, volatility: 0.05 },
  'EURCAD': { name: 'EURCAD', basePrice: 1.48, volatility: 0.05 },
};

// Default high-fidelity simulation parameters used if no active preset is selected
export const DEFAULT_OHLC_PARAMS_LANDING: Record<AssetType, OHLCSimulationParams> = {
  'Gold': {
    drift: 0.0001,
    volatility: 0.0012,
    seed: 42,
    wick_factor: 0.3,
    high_low_noise: 0.0004,
    side_ways_switch_prob: 0.15,
    trend_switch_prob: 0.10,
    basePrice: 4600
  },
  'Silver': {
    drift: 0.00008,
    volatility: 0.002,
    seed: 123,
    wick_factor: 0.25,
    high_low_noise: 0.0006,
    side_ways_switch_prob: 0.20,
    trend_switch_prob: 0.15,
    basePrice: 75
  },
  'Oil': {
    drift: 0.00012,
    volatility: 0.0025,
    seed: 99,
    wick_factor: 0.35,
    high_low_noise: 0.0008,
    side_ways_switch_prob: 0.12,
    trend_switch_prob: 0.08,
    basePrice: 85
  },
  'Nasdaq100': {
    drift: 0.00015,
    volatility: 0.001,
    seed: 7,
    wick_factor: 0.2,
    high_low_noise: 0.0003,
    side_ways_switch_prob: 0.10,
    trend_switch_prob: 0.05,
    basePrice: 20000
  },
  'Anonymous': {
    drift: 0.00012,
    volatility: 0.0015,
    seed: 888,
    wick_factor: 0.3,
    high_low_noise: 0.0005,
    side_ways_switch_prob: 0.15,
    trend_switch_prob: 0.10,
    basePrice: 42000
  },
  'USDJPY': {
    drift: 0.00003,
    volatility: 0.0048,
    seed: 1101,
    wick_factor: 0.70,
    high_low_noise: 0.0023,
    side_ways_switch_prob: 0.03,
    trend_switch_prob: 0.24,
    basePrice: 155
  },
  'GBPJPY': {
    drift: 0.00014,
    volatility: 0.0020,
    seed: 2101,
    wick_factor: 0.35,
    high_low_noise: 0.0008,
    side_ways_switch_prob: 0.06,
    trend_switch_prob: 0.09,
    basePrice: 200
  },
  'EURJPY': {
    drift: 0.00012,
    volatility: 0.0019,
    seed: 1201,
    wick_factor: 0.34,
    high_low_noise: 0.0007,
    side_ways_switch_prob: 0.06,
    trend_switch_prob: 0.08,
    basePrice: 170
  },
  'EURUSD': {
    drift: 0.00003,
    volatility: 0.0036,
    seed: 1201,
    wick_factor: 0.58,
    high_low_noise: 0.0017,
    side_ways_switch_prob: 0.03,
    trend_switch_prob: 0.18,
    basePrice: 1.085
  },
  'AUDUSD': {
    drift: 0.00005,
    volatility: 0.0031,
    seed: 3101,
    wick_factor: 0.56,
    high_low_noise: 0.0015,
    side_ways_switch_prob: 0.04,
    trend_switch_prob: 0.18,
    basePrice: 0.67
  },
  'USDCAD': {
    drift: 0.00005,
    volatility: 0.0038,
    seed: 2101,
    wick_factor: 0.62,
    high_low_noise: 0.0019,
    side_ways_switch_prob: 0.03,
    trend_switch_prob: 0.20,
    basePrice: 1.36
  },
  'EURCAD': {
    drift: 0.00003,
    volatility: 0.0020,
    seed: 6606,
    wick_factor: 0.34,
    high_low_noise: 0.0008,
    side_ways_switch_prob: 0.05,
    trend_switch_prob: 0.11,
    basePrice: 1.48
  }
};

// Box-Muller helper for normal distribution
const normalRandom = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

export const generateNextCandleWithParams = (
  lastCandle: { time: number; close: number; regime?: Regime },
  params: OHLCSimulationParams
) => {
  const {
    drift,
    volatility,
    wick_factor = 0.3,
    high_low_noise,
    side_ways_switch_prob,
    trend_switch_prob
  } = params;

  // Regime switcher
  let regime: Regime = lastCandle.regime || 'bull';
  const r = Math.random();

  if (regime === 'sideways') {
    if (r < trend_switch_prob) {
      regime = Math.random() < 0.5 ? 'bull' : 'bear';
    }
  } else {
    if (r < side_ways_switch_prob) {
      regime = 'sideways';
    } else if (r < side_ways_switch_prob + trend_switch_prob) {
      regime = regime === 'bull' ? 'bear' : 'bull';
    }
  }

  // Drift based on regime
  let regimeDrift = 0;
  if (regime === 'bull') {
    regimeDrift = Math.abs(drift);
  } else if (regime === 'bear') {
    regimeDrift = -Math.abs(drift);
  } else {
    regimeDrift = 0;
  }

  // Price movement
  const open = lastCandle.close;
  const move = open * (regimeDrift + volatility * normalRandom());
  const close = Math.max(0.0001, open + move);

  // Wicks / High-Low
  const body = Math.abs(close - open);
  const wickNoise = Math.abs(normalRandom()) * high_low_noise * open;
  const wick = body * wick_factor + wickNoise;
  const high = Math.max(open, close) + wick;
  const low = Math.max(0.0001, Math.min(open, close) - wick);

  return {
    time: lastCandle.time + 1,
    open,
    high,
    low,
    close,
    volume: Math.floor(Math.random() * 100),
    regime
  };
};

export const generateNextCandle = (
  lastCandle: { time: number; close: number; regime?: Regime },
  assetType: AssetType,
  customParams?: OHLCSimulationParams
) => {
  const params = customParams || DEFAULT_OHLC_PARAMS_LANDING[assetType] || DEFAULT_OHLC_PARAMS_LANDING['Anonymous'];
  return generateNextCandleWithParams(lastCandle, params);
};

export const generateInitialCandles = (
  assetType: AssetType,
  count: number = 80,
  customParams?: OHLCSimulationParams
) => {
  const params = customParams || DEFAULT_OHLC_PARAMS_LANDING[assetType] || DEFAULT_OHLC_PARAMS_LANDING['Anonymous'];
  const basePrice = params.basePrice ?? (ASSETS_CONFIG[assetType]?.basePrice || 42000);
  const data = [];
  let currentPrice = basePrice;
  let time = Math.floor(Date.now() / 1000) - count * 60;
  let currentRegime: Regime = 'bull';

  for (let i = 0; i < count; i++) {
    const candle: any = generateNextCandleWithParams({ time, close: currentPrice, regime: currentRegime }, params);
    data.push(candle);
    currentPrice = candle.close;
    time = candle.time;
    currentRegime = candle.regime;
  }
  return data;
};
