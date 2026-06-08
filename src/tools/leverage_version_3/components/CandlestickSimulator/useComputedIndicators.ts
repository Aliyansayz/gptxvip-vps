import React from 'react';
import { Ohlc, calculateSMA, calculateEMA, calculateStochastic, calculateSupertrend, calculateStopBandsSmooth } from '../../functions/api/indicators/baseline';
import { calculateLastNCandles } from '../../functions/api/indicators/lastNCandleLowHigh';
import { manualPipsOffset, lowForLongAtrOffset, highForShortAtrOffset } from '../../functions/api/middleware/offsetWithATRInSl';
import { priceToPips } from '../../functions/api/middleware/pipsTranslation';
import { calculateVolatilityZScore } from '../../functions/api/indicators/exclusive';
import { linearRegressionSystem } from '../../functions/api/indicators/exclusive/linearRegression';
import { calculateBollingerBands } from '../../functions/api/indicators/exclusive/bollingerBands';
import { supertrendRegimeSystem } from '../../functions/api/indicators/exclusive/supertrend_regime';
import { calculateADX } from '../../functions/api/indicators/integral/adx';
import { calculateATR } from '../../functions/api/indicators/integral/atr';
import { calculateSqueeze } from '../../functions/api/indicators/integral/squeeze_momentum';
import { smoothedHeikinAshi } from '../../functions/api/indicators/integral/heikin_ashi_smoothing';
import { getCandlePatternsMultiple } from '../../functions/api/indicators/integral/candlePattern';
import { Config } from './types';

export function useComputedIndicators(
  data: Ohlc[],
  betaData: Ohlc[],
  deltaData: Ohlc[],
  config: Config,
  tradingConfig: any,
  indicatorSettings: any,
  assetType?: string
) {
  const getDataBySource = React.useCallback((source: string) => {
    if (source === 'beta') return betaData;
    if (source === 'delta') return deltaData;
    return data;
  }, [data, betaData, deltaData]);

  return React.useMemo(() => {
    if (data.length === 0) return null;
    const result: any = {};

    const getParams = (settings: any, source: string, fallback: any) => {
      if (!settings) return fallback;
      if (settings.allowVariation) {
        if (source === 'alpha' && settings.alphaParams) return { ...fallback, ...settings.alphaParams };
        if (source === 'beta' && settings.betaParams) return { ...fallback, ...settings.betaParams };
        if (source === 'delta' && settings.deltaParams) return { ...fallback, ...settings.deltaParams };
      }
      return fallback;
    };

    // Entry signal indicators
    const entryDataSource = tradingConfig.entrySignalSource || 'alpha';
    const entryData = getDataBySource(entryDataSource);
    const entryConfig = getParams(indicatorSettings[config.type], entryDataSource, config);
    const entryClose = entryData.map(d => d.close);
    if (config.type === 'ma_crossover') {
      result.entrySignal = {
        fastLine: calculateEMA(entryClose, entryConfig.fastMa || 9),
        slowLine: calculateSMA(entryClose, entryConfig.slowMa || 21)
      };
    } else if (config.type === 'supertrend') {
      result.entrySignal = {
        supertrend: calculateSupertrend(entryData, entryConfig.supertrendPeriod || 10, entryConfig.supertrendMultiplier || 3)
      };
    } else if (config.type === 'stochastic') {
      result.entrySignal = {
        stochastic: calculateStochastic(entryData, entryConfig.stochK || 14, 3, entryConfig.stochD || 3)
      };
    } else if (config.type === 'linear_regression') {
      result.entrySignal = {
        lr: linearRegressionSystem(entryClose, entryConfig.lrSlopePeriod || 20, entryConfig.lrVolPeriod || 20, entryConfig.lrRegimePeriod || 30)
      };
    } else if (config.type === 'bollinger_bands') {
      result.entrySignal = {
        bb: calculateBollingerBands(entryData, entryConfig.bbPeriod || 20, entryConfig.bbStdDev || 2)
      };
    } else if (config.type === 'supertrend_regime') {
      const highs = entryData.map(d => d.high);
      const lows = entryData.map(d => d.low);
      result.entrySignal = {
        supertrend_regime: supertrendRegimeSystem(
          highs, lows, entryClose,
          entryConfig.stPeriod || 10, entryConfig.atrMultiplier || 3,
          entryConfig.regimePeriod || 30, entryConfig.zPeriod || 20,
          entryConfig.zUpper || 1.5, entryConfig.zLower || -1.5
        )
      };
    } else if (config.type === 'heikin_ashi_smoothed') {
      const open = entryData.map(d => d.open);
      const high = entryData.map(d => d.high);
      const low = entryData.map(d => d.low);
      result.entrySignal = {
        heikin_ashi_smoothed: smoothedHeikinAshi(open, high, low, entryClose, entryConfig.haSmoothLen || 10)
      };
    } else if (config.type === 'candlestick_pattern') {
      const open = entryData.map(d => d.open);
      const high = entryData.map(d => d.high);
      const low = entryData.map(d => d.low);
      result.entrySignal = {
        candlestick_pattern: getCandlePatternsMultiple(open, high, low, entryClose)
      };
    }

    // Exit signal indicators
    const exitType = tradingConfig.useDifferentSignalSystemOnExit && tradingConfig.exitSignalSystemType
      ? tradingConfig.exitSignalSystemType
      : config.type;

    const exitDataSource = tradingConfig.exitSignalSource || 'alpha';
    const exitData = getDataBySource(exitDataSource);
    const baseExitConfig = tradingConfig.useDifferentSignalSystemOnExit && tradingConfig.exitSignalSystemParams
      ? tradingConfig.exitSignalSystemParams
      : config;
    const exitConfig = getParams(indicatorSettings[exitType], exitDataSource, baseExitConfig);
    const exitClose = exitData.map(d => d.close);
    if (exitType === 'ma_crossover') {
      result.exitSignal = {
        type: 'ma_crossover',
        fastLine: calculateEMA(exitClose, exitConfig.fastMa || 9),
        slowLine: calculateSMA(exitClose, exitConfig.slowMa || 21)
      };
    } else if (exitType === 'supertrend') {
      result.exitSignal = {
        type: 'supertrend',
        supertrend: calculateSupertrend(exitData, exitConfig.supertrendPeriod || exitConfig.period || 10, exitConfig.supertrendMultiplier || exitConfig.multiplier || 3)
      };
    } else if (exitType === 'stochastic') {
      result.exitSignal = {
        type: 'stochastic',
        stochastic: calculateStochastic(exitData, exitConfig.stochK || 14, 3, exitConfig.stochD || 3)
      };
    } else if (exitType === 'linear_regression') {
      result.exitSignal = {
        type: 'linear_regression',
        lr: linearRegressionSystem(exitClose, exitConfig.lrSlopePeriod || exitConfig.slopePeriod || 20, exitConfig.lrVolPeriod || exitConfig.volPeriod || 20, exitConfig.lrRegimePeriod || exitConfig.regimePeriod || 30)
      };
    } else if (exitType === 'bollinger_bands') {
      result.exitSignal = {
        type: 'bollinger_bands',
        bb: calculateBollingerBands(exitData, exitConfig.bbPeriod || exitConfig.period || 20, exitConfig.bbStdDev || exitConfig.stdDev || 2)
      };
    } else if (exitType === 'supertrend_regime') {
      const exitHighs = exitData.map(d => d.high);
      const exitLows = exitData.map(d => d.low);
      result.exitSignal = {
        type: 'supertrend_regime',
        supertrend_regime: supertrendRegimeSystem(
          exitHighs, exitLows, exitClose,
          exitConfig.stPeriod || 10, exitConfig.atrMultiplier || 3,
          exitConfig.regimePeriod || 30, exitConfig.zPeriod || 20,
          exitConfig.zUpper || 1.5, exitConfig.zLower || -1.5
        )
      };
    } else if (exitType === 'heikin_ashi_smoothed') {
      const exitOpen = exitData.map(d => d.open);
      const exitHighs = exitData.map(d => d.high);
      const exitLows = exitData.map(d => d.low);
      result.exitSignal = {
        type: 'heikin_ashi_smoothed',
        heikin_ashi_smoothed: smoothedHeikinAshi(exitOpen, exitHighs, exitLows, exitClose, exitConfig.haSmoothLen || exitConfig.smoothLen || 10)
      };
    } else if (exitType === 'candlestick_pattern') {
      const exitOpen = exitData.map(d => d.open);
      const exitHighs = exitData.map(d => d.high);
      const exitLows = exitData.map(d => d.low);
      result.exitSignal = {
        type: 'candlestick_pattern',
        candlestick_pattern: getCandlePatternsMultiple(exitOpen, exitHighs, exitLows, exitClose)
      };
    }


    // Stop Loss Indicator
    const slData = getDataBySource(indicatorSettings.stopLossIndicator?.dataSource || 'alpha');
    const slType = indicatorSettings.stopLossIndicator?.type || 'atr_bands';

    if (slType === 'atr_bands') {
      result.stops = calculateStopBandsSmooth(slData, indicatorSettings.stopLossIndicator?.period || 10, indicatorSettings.stopLossIndicator?.multiplier || 3.0, false, true);
    } else {
      const { lastNLow, lastNHigh } = calculateLastNCandles(slData, indicatorSettings.stopLossIndicator?.lastNPeriod || 5);

      let finalLower = [...lastNLow];
      let finalUpper = [...lastNHigh];

      const atrData = indicatorSettings.stopLossIndicator?.allowAtrOffset ? calculateATR(slData, indicatorSettings.stopLossIndicator?.period || 14) : null;
      const currentAsset = assetType || 'gold';

      for (let i = 0; i < slData.length; i++) {
        let currentLower = finalLower[i];
        let currentUpper = finalUpper[i];
        const currentPrice = slData[i].close;

        if (currentLower !== undefined) {
          if (indicatorSettings.stopLossIndicator?.allowAtrOffset && atrData && atrData[i]) {
            const atrPrice = atrData[i] * (indicatorSettings.stopLossIndicator?.atrOffsetMultiplier || 1.0);
            const atrPips = priceToPips(atrPrice, currentAsset, currentPrice);
            currentLower = lowForLongAtrOffset(currentLower, atrPips, currentAsset, currentPrice);
          }
          if (indicatorSettings.stopLossIndicator?.allowFixedOffset) {
            const fixedPips = indicatorSettings.stopLossIndicator?.fixedOffsetPips || 0;
            currentLower = manualPipsOffset(currentLower, fixedPips, currentAsset, currentPrice, true);
          }
        }

        if (currentUpper !== undefined) {
          if (indicatorSettings.stopLossIndicator?.allowAtrOffset && atrData && atrData[i]) {
            const atrPrice = atrData[i] * (indicatorSettings.stopLossIndicator?.atrOffsetMultiplier || 1.0);
            const atrPips = priceToPips(atrPrice, currentAsset, currentPrice);
            currentUpper = highForShortAtrOffset(currentUpper, atrPips, currentAsset, currentPrice);
          }
          if (indicatorSettings.stopLossIndicator?.allowFixedOffset) {
            const fixedPips = indicatorSettings.stopLossIndicator?.fixedOffsetPips || 0;
            currentUpper = manualPipsOffset(currentUpper, fixedPips, currentAsset, currentPrice, false);
          }
        }
        finalLower[i] = currentLower;
        finalUpper[i] = currentUpper;
      }
      result.stops = { lowerBand: finalLower, upperBand: finalUpper };
    }

    // Integral Indicators Always Computed
    const volData = getDataBySource(indicatorSettings.volatility?.dataSource || 'alpha');
    result.adx = calculateADX(volData, indicatorSettings.volatility?.adxPeriod || 14);

    const volClose = volData.map(d => d.close);
    const volHigh = volData.map(d => d.high);
    const volLow = volData.map(d => d.low);
    result.squeeze = calculateSqueeze(volClose, volHigh, volLow);

    const cpOpen = data.map(d => d.open);
    const cpHigh = data.map(d => d.high);
    const cpLow = data.map(d => d.low);
    const cpClose = data.map(d => d.close);
    result.candlestick_pattern_integral = getCandlePatternsMultiple(cpOpen, cpHigh, cpLow, cpClose); // Unconditional candle pattern

    const zScoreData = getDataBySource(indicatorSettings.volatilityRegime?.dataSource || 'alpha');
    const hasZScoreFilters = tradingConfig.exitAfterNCandlesMin || tradingConfig.exitAfterNMinutesMin || tradingConfig.exitAfterNSecondsMin;
    if (hasZScoreFilters) {
      result.zscores = calculateVolatilityZScore(zScoreData, indicatorSettings.volatility.zScorePeriod);
    }

    return result;
  }, [data, betaData, deltaData, config, tradingConfig, indicatorSettings, getDataBySource]);
}
