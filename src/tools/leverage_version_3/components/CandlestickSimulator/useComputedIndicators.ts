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

    const computeSignalForType = (sysType: string, configKey: string, dataSource: string, config: any) => {
      const sourceData = getDataBySource(dataSource);
      const closePrices = sourceData.map(d => d.close);
      const baseCfgObj = indicatorSettings[configKey as keyof typeof indicatorSettings] || indicatorSettings[sysType as keyof typeof indicatorSettings];
      const cfg = getParams(baseCfgObj, dataSource, config);

      if (sysType === 'ma_crossover') {
        return {
          type: 'ma_crossover',
          fastLine: calculateEMA(closePrices, cfg.fastMa || 9),
          slowLine: calculateSMA(closePrices, cfg.slowMa || 21)
        };
      } else if (sysType === 'supertrend') {
        return {
          type: 'supertrend',
          supertrend: calculateSupertrend(sourceData, cfg.supertrendPeriod || cfg.period || 10, cfg.supertrendMultiplier || cfg.multiplier || 3)
        };
      } else if (sysType === 'stochastic') {
        return {
          type: 'stochastic',
          stochastic: calculateStochastic(sourceData, cfg.stochK || 14, 3, cfg.stochD || 3)
        };
      } else if (sysType === 'linear_regression') {
        return {
          type: 'linear_regression',
          lr: linearRegressionSystem(closePrices, cfg.lrSlopePeriod || cfg.slopePeriod || 20, cfg.lrVolPeriod || cfg.volPeriod || 20, cfg.lrRegimePeriod || cfg.regimePeriod || 30)
        };
      } else if (sysType === 'bollinger_bands') {
        return {
          type: 'bollinger_bands',
          bb: calculateBollingerBands(sourceData, cfg.bbPeriod || cfg.period || 20, cfg.bbStdDev || cfg.stdDev || 2)
        };
      } else if (sysType === 'supertrend_regime') {
        const highs = sourceData.map(d => d.high);
        const lows = sourceData.map(d => d.low);
        return {
          type: 'supertrend_regime',
          supertrend_regime: supertrendRegimeSystem(
            highs, lows, closePrices, 
            cfg.stPeriod || 10, cfg.atrMultiplier || 3, 
            cfg.regimePeriod || 30, cfg.zPeriod || 20, 
            cfg.zUpper || 1.5, cfg.zLower || -1.5
          )
        };
      } else if (sysType === 'heikin_ashi_smoothed') {
        const open = sourceData.map(d => d.open);
        const highs = sourceData.map(d => d.high);
        const lows = sourceData.map(d => d.low);
        return {
          type: 'heikin_ashi_smoothed',
          heikin_ashi_smoothed: smoothedHeikinAshi(open, highs, lows, closePrices, cfg.haSmoothLen || cfg.smoothLen || 10)
        };
      } else if (sysType === 'candlestick_pattern') {
        const open = sourceData.map(d => d.open);
        const highs = sourceData.map(d => d.high);
        const lows = sourceData.map(d => d.low);
        return {
          type: 'candlestick_pattern',
          candlestick_pattern: getCandlePatternsMultiple(open, highs, lows, closePrices)
        };
      }
      return null;
    };

    // Entry signal indicators
    const entryDataSource = tradingConfig.entrySignalSource || 'alpha';
    
    if (tradingConfig.activeSystemMode === 'conjunction') {
       result.entrySignal = {
         type: 'conjunction',
         conjunctionSignals: {}
       };
       (tradingConfig.activeConjunctionSystems || []).forEach((sysId: string) => {
         const baseId = sysId.replace('_alpha', '').replace('_beta', '').replace('_delta', '');
         const sysEntrySource = (indicatorSettings[sysId as keyof typeof indicatorSettings] as any)?.entrySignalSource || indicatorSettings[sysId as keyof typeof indicatorSettings]?.dataSource || entryDataSource;
         const sig = computeSignalForType(baseId, sysId, sysEntrySource, config);
         if (sig) {
           result.entrySignal.conjunctionSignals[sysId] = sig;
         }
       });
    } else {
       const sysEntrySource = (indicatorSettings[config.type as keyof typeof indicatorSettings] as any)?.entrySignalSource || indicatorSettings[config.type as keyof typeof indicatorSettings]?.dataSource || entryDataSource;
       const computed = computeSignalForType(config.type, config.type, sysEntrySource, config);
       if (computed) {
         result.entrySignal = computed;
       }
    }

    // Exit signal indicators
    const exitType = tradingConfig.useDifferentSignalSystemOnExit && tradingConfig.exitSignalSystemType 
      ? tradingConfig.exitSignalSystemType 
      : config.type;
      
    const exitDataSource = tradingConfig.exitSignalSource || 'alpha';
    const baseExitConfig = tradingConfig.useDifferentSignalSystemOnExit && tradingConfig.exitSignalSystemParams
      ? tradingConfig.exitSignalSystemParams
      : config;
      
    const computedExit = computeSignalForType(exitType, exitType, exitDataSource, baseExitConfig);
    if (computedExit) {
      result.exitSignal = computedExit;
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
