import { useState, useEffect } from 'react';
import { IndicatorSettings } from './indicators_store';
import { loadState } from './utils/storage';

const STORAGE_KEY = 'leverage_trading_v1_settings';

const defaultIndicatorSettings: IndicatorSettings = {
  ma_crossover: { fastMa: 9, slowMa: 21, dataSource: 'alpha' },
  stochastic: { stochK: 14, stochD: 3, dataSource: 'alpha' },
  supertrend: { period: 10, multiplier: 3, dataSource: 'alpha' },
  divergence: { stochK: 14, stochD: 3, dataSource: 'alpha' },
  linear_regression: { slopePeriod: 20, volPeriod: 20, regimePeriod: 30, dataSource: 'alpha' },
  bollinger_bands: { period: 20, stdDev: 2, dataSource: 'alpha' },
  supertrend_regime: { stPeriod: 10, atrMultiplier: 3, regimePeriod: 30, zPeriod: 20, zUpper: 1.5, zLower: -1.5, dataSource: 'alpha' },
  heikin_ashi_smoothed: { smoothLen: 10, dataSource: 'alpha' },
  candlestick_pattern: { dataSource: 'alpha' },
  volatility: {
    atrPeriod: 14,
    adxPeriod: 14,
    squeezeLength: 20,
    zScorePeriod: 20,
    dataSource: 'alpha'
  },
  volatilityRegime: {
    period: 30,
    threshold: 1.5,
    dataSource: 'alpha'
  },
  stopLossIndicator: {
    period: 14,
    multiplier: 2.0,
    dataSource: 'alpha',
    type: 'atr_bands',
    lastNPeriod: 5,
    allowAtrOffset: false,
    atrOffsetMultiplier: 1.0,
    allowFixedOffset: false,
    fixedOffsetPips: 10
  },
  trendStrength: {
    slopePeriod: 20,
    volPeriod: 20,
    regimePeriod: 30,
    dataSource: 'alpha'
  }
};

export function useIndicatorSlice() {
  const [indicatorSettings, setIndicatorSettings] = useState<IndicatorSettings>(() => loadState(`${STORAGE_KEY}_indicator`, defaultIndicatorSettings));

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_indicator`, JSON.stringify(indicatorSettings));
  }, [indicatorSettings]);

  const getIndicatorDescription = (type: keyof IndicatorSettings | 'conjunction') => {
    if (type === 'conjunction') {
      return `Simulates the Conjunction System which requires perfect alignment across multiple classic systems to trigger entry logic. Select multiple subsystems in the Configuration Panel to observe correlated behavior.`;
    }
    switch (type) {
      case 'ma_crossover':
        return `Simulates a fast EMA (${indicatorSettings.ma_crossover.fastMa} periods) crossing over a slow SMA (${indicatorSettings.ma_crossover.slowMa} periods). Bullish signals are green, Bearish are red.`;
      case 'stochastic':
        return `Simulates standard ${indicatorSettings.stochastic.stochK}, 3, ${indicatorSettings.stochastic.stochD} Stochastic oscillator. Signals identify crosses between the %K (blue) and %D (orange) lines in overbought/oversold zones.`;
      case 'supertrend':
        return `Simulates Supertrend indicator. Trend changes signal entries when price crosses the Supertrend line calculated over ${indicatorSettings.supertrend.period} periods and ${indicatorSettings.supertrend.multiplier} multiplier.`;
      case 'divergence':
        return `Simulates Divergence using Stochastic (K=${indicatorSettings.divergence.stochK}, D=${indicatorSettings.divergence.stochD}). Bullish/bearish divergences between price action and oscillator generate signals.`;
      case 'linear_regression':
        return `Simulates a Linear Regression System with Slope (${indicatorSettings.linear_regression.slopePeriod}), Volatility (${indicatorSettings.linear_regression.volPeriod}), and Regime (${indicatorSettings.linear_regression.regimePeriod}). Generates signals based on trend decay and mean reversion.`;
      case 'bollinger_bands':
        return `Simulates Bollinger Bands (${indicatorSettings.bollinger_bands?.period || 20} period, ${indicatorSettings.bollinger_bands?.stdDev || 2} std dev). LONG triggered when candle opens below lower band and closes above. SHORT triggered when candle opens above upper band and closes below.`;
      case 'supertrend_regime':
        return `Simulates a Hybrid Supertrend Regime System. Combines Adaptive Supertrend (StPeriod: ${indicatorSettings.supertrend_regime?.stPeriod || 10}, AtrMult: ${indicatorSettings.supertrend_regime?.atrMultiplier || 3}) with Regime (RegPeriod: ${indicatorSettings.supertrend_regime?.regimePeriod || 30}) and Z-Score Reversion (ZPeriod: ${indicatorSettings.supertrend_regime?.zPeriod || 20}, High: ${indicatorSettings.supertrend_regime?.zUpper || 1.5}, Low: ${indicatorSettings.supertrend_regime?.zLower || -1.5}).`;
      case 'heikin_ashi_smoothed':
        return `Simulates a Smoothed Heikin Ashi trend system. Calculates Heikin Ashi candles smoothed by an EMA of ${indicatorSettings.heikin_ashi_smoothed?.smoothLen || 10} periods. Trend direction changes generate entry/exit signals.`;
      case 'candlestick_pattern':
        return `Recognizes classical and typical heuristic multi-candle patterns structurally. Provides directional action labels based on resulting bias.`;
      default:
        return '';
    }
  };

  return {
    indicatorSettings, setIndicatorSettings,
    getIndicatorDescription
  };
}
