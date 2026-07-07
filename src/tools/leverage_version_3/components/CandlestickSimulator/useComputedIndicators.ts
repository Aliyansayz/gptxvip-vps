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
import { getCandlePatternsMultiple } from '../../functions/api/indicators/exclusive/candlePattern';
import { Config } from './types';
import { getTrailSlIndicator } from '../../functions/api/middleware/trailSlIndicatorVersion';
import { rollingRegressionSlope, slopePersistenceFast, trendEfficiencyFast } from '../../functions/api/indicators/trendStrength/trendStrength';
import { smoothedWickEfficiencyFast } from '../../functions/api/indicators/trendStrength/wickEfficiency';

const getBaseSystemId = (id: string) => id.replace('_alpha', '').replace('_beta', '').replace('_delta', '');

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
      
      // Merge base configuration parameters with the specific custom configuration passed in
      const mergedObj = { ...baseCfgObj, ...config };
      const cfg = getParams(mergedObj, dataSource, mergedObj);

      if (sysType === 'ma_crossover') {
        const fastLine = calculateEMA(closePrices, cfg.fastMa || 9);
        const slowLine = calculateSMA(closePrices, cfg.slowMa || 21);
        const direction = fastLine.map((f, i) => f > slowLine[i] ? 1 : (f < slowLine[i] ? -1 : 0));
        return {
          type: 'ma_crossover',
          fastLine,
          slowLine,
          direction
        };
      } else if (sysType === 'supertrend') {
        const superPeriod = cfg.supertrendPeriod || cfg.period || cfg.atrPeriod || 10;
        const superMultiplier = cfg.supertrendMultiplier || cfg.multiplier || 3;
        const st = calculateSupertrend(sourceData, superPeriod, superMultiplier);
        const direction = st.trend.map(t => t === 1 ? 1 : (t === -1 ? -1 : 0));
        return {
          type: 'supertrend',
          supertrend: st,
          direction
        };
      } else if (sysType === 'stochastic') {
        const stochK = cfg.stochK || cfg.kPeriod || 14;
        const stochD = cfg.stochD || cfg.dPeriod || 3;
        const stoch = calculateStochastic(sourceData, stochK, 3, stochD);
        const direction = stoch.k.map((k, i) => k > stoch.d[i] ? 1 : (k < stoch.d[i] ? -1 : 0));
        return {
          type: 'stochastic',
          stochastic: stoch,
          direction
        };
      } else if (sysType === 'linear_regression') {
        const lrSlope = cfg.lrSlopePeriod || cfg.slopePeriod || cfg.period || 20;
        const lrVol = cfg.lrVolPeriod || cfg.volPeriod || cfg.channelWidth || 20;
        const lrRegime = cfg.lrRegimePeriod || cfg.regimePeriod || 30;
        const lr = linearRegressionSystem(closePrices, lrSlope, lrVol, lrRegime);
        const direction = lr.direction;
        return {
          type: 'linear_regression',
          lr,
          direction
        };
      } else if (sysType === 'bollinger_bands') {
        const bbPeriod = cfg.bbPeriod || cfg.period || 20;
        const bbStdDev = cfg.bbStdDev || cfg.stdDev || 2;
        const bb = calculateBollingerBands(sourceData, bbPeriod, bbStdDev);
        const direction = bb.map((b, i) => {
          const middle = (b.upper + b.lower) / 2;
          return sourceData[i].close > middle ? 1 : (sourceData[i].close < middle ? -1 : 0);
        });
        return {
          type: 'bollinger_bands',
          bb,
          direction
        };
      } else if (sysType === 'supertrend_regime') {
        const highs = sourceData.map(d => d.high);
        const lows = sourceData.map(d => d.low);
        const stPeriod = cfg.stPeriod || 10;
        const atrMultiplier = cfg.atrMultiplier || 3;
        const regimePeriod = cfg.regimePeriod || 30;
        const zPeriod = cfg.zPeriod || 20;
        const zUpper = cfg.zUpper || 1.5;
        const zLower = cfg.zLower || -1.5;
        const sr = supertrendRegimeSystem(
            highs, lows, closePrices, 
            stPeriod, atrMultiplier, 
            regimePeriod, zPeriod, 
            zUpper, zLower
        );
        const direction = sr.signal;
        return {
          type: 'supertrend_regime',
          supertrend_regime: sr,
          direction
        };
      } else if (sysType === 'heikin_ashi_smoothed') {
        const open = sourceData.map(d => d.open);
        const highs = sourceData.map(d => d.high);
        const lows = sourceData.map(d => d.low);
        const smoothLen = cfg.haSmoothLen || cfg.smoothLen || 10;
        const ha = smoothedHeikinAshi(open, highs, lows, closePrices, smoothLen);
        const direction = ha.direction;
        return {
          type: 'heikin_ashi_smoothed',
          heikin_ashi_smoothed: ha,
          direction
        };
      } else if (sysType === 'divergence') {
        const divLookback = cfg.lookback || cfg.stochK || 14;
        const divRsiPeriod = cfg.rsiPeriod || cfg.stochD || 14;
        // Divergence uses stochastic internally under some conditions
        const stoch = calculateStochastic(sourceData, divLookback, 3, divRsiPeriod);
        const direction = stoch.k.map((k, i) => k > stoch.d[i] ? 1 : (k < stoch.d[i] ? -1 : 0));
        return {
          type: 'divergence',
          stochastic: stoch,
          direction
        };
      } else if (sysType === 'candlestick_pattern') {
        const open = sourceData.map(d => d.open);
        const highs = sourceData.map(d => d.high);
        const lows = sourceData.map(d => d.low);
        const cp = getCandlePatternsMultiple(open, highs, lows, closePrices, indicatorSettings?.candlestick_pattern?.allowedPatterns);
        const direction = cp.action_signal.map(a => a === 'bullish_action' ? 1 : (a === 'bearish_action' ? -1 : 0));
        return {
          type: 'candlestick_pattern',
          candlestick_pattern: cp,
          direction
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
    } else if (tradingConfig.activeSystemMode === 'disjunction') {
       result.entrySignal = {
         type: 'disjunction',
         disjunctionSignals: {}
       };
       (tradingConfig.activeDisjunctionSystems || []).forEach((sysId: string) => {
         const baseId = sysId.replace('_alpha', '').replace('_beta', '').replace('_delta', '');
         const sysEntrySource = (indicatorSettings[sysId as keyof typeof indicatorSettings] as any)?.entrySignalSource || indicatorSettings[sysId as keyof typeof indicatorSettings]?.dataSource || entryDataSource;
         const sig = computeSignalForType(baseId, sysId, sysEntrySource, config);
         if (sig) {
           result.entrySignal.disjunctionSignals[sysId] = sig;
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
    if (tradingConfig.useDifferentSignalSystemOnExit && tradingConfig.exitSignalSystemMode === 'conjunction') {
       result.exitSignal = {
         type: 'conjunction',
         conjunctionSignals: {}
       };
       (tradingConfig.exitActiveConjunctionSystems || []).forEach(sysId => {
         const baseId = getBaseSystemId(sysId);
         
         // Use explicit custom parameters if toggled, otherwise sync with entry indicator settings
         const isExplicit = !!tradingConfig.exitUseExplicitParams;
         const cfg = isExplicit 
           ? (tradingConfig.exitConjunctionParams?.[sysId] || {}) 
           : ((indicatorSettings as any)[sysId] || {});

         const sysExitSource = cfg.exitSignalSource || tradingConfig.exitSignalSource || cfg.entrySignalSource || cfg.dataSource || 'alpha';
         const sig = computeSignalForType(sysId, baseId, sysExitSource, cfg);
         if (sig) {
           result.exitSignal.conjunctionSignals[sysId] = sig;
         }
       });
    } else if (tradingConfig.useDifferentSignalSystemOnExit && tradingConfig.exitSignalSystemMode === 'disjunction') {
       result.exitSignal = {
         type: 'disjunction',
         disjunctionSignals: {}
       };
       (tradingConfig.exitActiveDisjunctionSystems || []).forEach(sysId => {
         const baseId = getBaseSystemId(sysId);
         
         // Use explicit custom parameters if toggled, otherwise sync with entry indicator settings
         const isExplicit = !!tradingConfig.exitUseExplicitParams;
         const cfg = isExplicit 
           ? (tradingConfig.exitDisjunctionParams?.[sysId] || {}) 
           : ((indicatorSettings as any)[sysId] || {});

         const sysExitSource = cfg.exitSignalSource || tradingConfig.exitSignalSource || cfg.entrySignalSource || cfg.dataSource || 'alpha';
         const sig = computeSignalForType(sysId, baseId, sysExitSource, cfg);
         if (sig) {
           result.exitSignal.disjunctionSignals[sysId] = sig;
         }
       });
    } else {
      const exitType = tradingConfig.useDifferentSignalSystemOnExit && tradingConfig.exitSignalSystemType 
        ? tradingConfig.exitSignalSystemType 
        : config.type;
        
      const exitDataSource = tradingConfig.exitSignalSource || 'alpha';
      
      let baseExitConfig: any = {};
      if (tradingConfig.useDifferentSignalSystemOnExit) {
        if (exitType === config.type) {
          // If different exit system is enabled BUT the selected exit model matches the entry system model, we always sync!
          baseExitConfig = config;
        } else if (tradingConfig.exitUseExplicitParams) {
          baseExitConfig = tradingConfig.exitSignalSystemParams || {};
        } else {
          // Sync with the entry system indicator settings
          baseExitConfig = (indicatorSettings as any)[exitType] || {};
        }
      } else {
        baseExitConfig = config;
      }
        
      const computedExit = computeSignalForType(exitType, exitType, exitDataSource, baseExitConfig);
      if (computedExit) {
        result.exitSignal = computedExit;
      }
    }

    // Stop Loss Indicator Helper
    const calculateStopsForConfig = (slConfig: any) => {
      if (!slConfig) return null;
      const slData = getDataBySource(slConfig.dataSource || 'alpha');
      const slType = slConfig.type || 'atr_bands';

      if (slType === 'atr_bands') {
        return calculateStopBandsSmooth(slData, slConfig.period || 10, slConfig.multiplier || 3.0, false, true);
      } else {
        const { lastNLow, lastNHigh } = calculateLastNCandles(slData, slConfig.lastNPeriod || 5);
        
        let finalLower = [...lastNLow];
        let finalUpper = [...lastNHigh];
        
        const atrData = slConfig.allowAtrOffset ? calculateATR(slData, slConfig.period || 14) : null;
        const currentAsset = assetType || 'gold';

        for (let i = 0; i < slData.length; i++) {
          let currentLower = finalLower[i];
          let currentUpper = finalUpper[i];
          const currentPrice = slData[i].close;
          
          if (currentLower !== undefined) {
             if (slConfig.allowAtrOffset && atrData && atrData[i]) {
                const atrPrice = atrData[i] * (slConfig.atrOffsetMultiplier || 1.0);
                const atrPips = priceToPips(atrPrice, currentAsset, currentPrice);
                currentLower = lowForLongAtrOffset(currentLower, atrPips, currentAsset, currentPrice);
             }
             if (slConfig.allowFixedOffset) {
                const fixedPips = slConfig.fixedOffsetPips || 0;
                currentLower = manualPipsOffset(currentLower, fixedPips, currentAsset, currentPrice, true);
             }
          }

          if (currentUpper !== undefined) {
             if (slConfig.allowAtrOffset && atrData && atrData[i]) {
                const atrPrice = atrData[i] * (slConfig.atrOffsetMultiplier || 1.0);
                const atrPips = priceToPips(atrPrice, currentAsset, currentPrice);
                currentUpper = highForShortAtrOffset(currentUpper, atrPips, currentAsset, currentPrice);
             }
             if (slConfig.allowFixedOffset) {
                const fixedPips = slConfig.fixedOffsetPips || 0;
                currentUpper = manualPipsOffset(currentUpper, fixedPips, currentAsset, currentPrice, false);
             }
          }
          finalLower[i] = currentLower;
          finalUpper[i] = currentUpper;
        }
        return { lowerBand: finalLower, upperBand: finalUpper };
      }
    };

    result.stops = calculateStopsForConfig(indicatorSettings.stopLossIndicator);

    // Replicated version for Trailing SL if enabled
    const trailSlConfig = getTrailSlIndicator(indicatorSettings.stopLossIndicator);
    result.trailStops = calculateStopsForConfig(trailSlConfig);

    // Integral Indicators Always Computed
    const volData = getDataBySource(indicatorSettings.volatility?.dataSource || 'alpha');
    result.adx = calculateADX(volData, indicatorSettings.volatility?.adxPeriod || 14);
    
    // Trend Strength derived indicators: Slope Persistence & Trend Efficiency & Wick Efficiency
    const tsData = getDataBySource(indicatorSettings.trendStrength?.dataSource || 'alpha');
    if (tsData && tsData.length > 0) {
      const tsOpens = tsData.map(d => d.open);
      const tsHighs = tsData.map(d => d.high);
      const tsLows = tsData.map(d => d.low);
      const tsCloses = tsData.map(d => d.close);
      const tsSlopePeriod = indicatorSettings.trendStrength?.slopePeriod || 20;
      const tsSlope = rollingRegressionSlope(tsCloses, tsSlopePeriod);
      result.slopePersistence = slopePersistenceFast(tsSlope, tsSlopePeriod);
      result.trendEfficiency = trendEfficiencyFast(tsCloses, tsSlopePeriod);
      result.wickEfficiency = smoothedWickEfficiencyFast(tsOpens, tsHighs, tsLows, tsCloses, tsSlopePeriod);
    } else {
      result.slopePersistence = [];
      result.trendEfficiency = [];
      result.wickEfficiency = [];
    }
    
    const volClose = volData.map(d => d.close);
    const volHigh = volData.map(d => d.high);
    const volLow = volData.map(d => d.low);
    result.squeeze = calculateSqueeze(volClose, volHigh, volLow);

    const cpOpen = data.map(d => d.open);
    const cpHigh = data.map(d => d.high);
    const cpLow = data.map(d => d.low);
    const cpClose = data.map(d => d.close);
    result.candlestick_pattern_integral = getCandlePatternsMultiple(cpOpen, cpHigh, cpLow, cpClose, indicatorSettings?.candlestick_pattern?.allowedPatterns); // Unconditional candle pattern

    const zScoreData = getDataBySource(indicatorSettings.volatilityRegime?.dataSource || 'alpha');
    const hasZScoreFilters = tradingConfig.exitAfterNCandlesMin || tradingConfig.exitAfterNMinutesMin || tradingConfig.exitAfterNSecondsMin;
    if (hasZScoreFilters) {
       result.zscores = calculateVolatilityZScore(zScoreData, indicatorSettings.volatility.zScorePeriod);
    }

    return result;
  }, [data, betaData, deltaData, config, tradingConfig, indicatorSettings, getDataBySource]);
}
