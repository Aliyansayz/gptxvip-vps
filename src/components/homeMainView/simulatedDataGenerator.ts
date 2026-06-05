import { OHLCSimulationParams, Regime } from './asset_presets/types';

export type AssetType = 'Anonymous' | 'Gold' | 'Silver' | 'Oil' | 'Nasdaq100';

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
