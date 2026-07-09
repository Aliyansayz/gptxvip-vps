import React from 'react';
import { Ohlc, calculateSMA, calculateEMA, calculateStochastic, calculateSupertrend, calculateStopBandsSmooth } from '../../functions/api/indicators/baseline';
import { calculateADX } from '../../functions/api/indicators/integral/adx';
import { calculateVolatilityZScore } from '../../functions/api/indicators/exclusive';
import { linearRegressionSystem } from '../../functions/api/indicators/exclusive/linearRegression';
import { calculateSqueeze } from '../../functions/api/indicators/integral/squeeze_momentum';
import { calculateBollingerBands } from '../../functions/api/indicators/exclusive/bollingerBands';
import { supertrendRegimeSystem } from '../../functions/api/indicators/exclusive/supertrend_regime';

interface Config {
  type: string;
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
}

export const useIndicatorCalculations = (
  data: Ohlc[],
  config: Config,
  useADXFilter?: boolean,
  useSqueezeFilter?: boolean,
  hideIndicators: boolean = false
) => {
  return React.useMemo(() => {
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
  }, [data, config, useADXFilter, useSqueezeFilter, hideIndicators]);
};
