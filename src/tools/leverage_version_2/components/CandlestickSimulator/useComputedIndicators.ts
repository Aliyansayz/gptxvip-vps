import React from 'react';
import { Ohlc, calculateSMA, calculateEMA, calculateStochastic, calculateSupertrend, calculateStopBandsSmooth, calculateADX } from '../../functions/api/indicators/baseline';
import { calculateVolatilityZScore } from '../../functions/api/indicators/exclusive';
import { linearRegressionSystem } from '../../functions/api/indicators/exclusive/linearRegression';
import { calculateBollingerBands } from '../../functions/api/indicators/exclusive/bollingerBands';
import { supertrendRegimeSystem } from '../../functions/api/indicators/exclusive/supertrend_regime';
import { calculateSqueeze } from '../../functions/api/indicators/exclusive/squeeze_momentum';
import { Config } from './types';

export function useComputedIndicators(
  data: Ohlc[],
  betaData: Ohlc[],
  deltaData: Ohlc[],
  config: Config,
  tradingConfig: any,
  indicatorSettings: any
) {
  const getDataBySource = React.useCallback((source: string) => {
    if (source === 'beta') return betaData;
    if (source === 'delta') return deltaData;
    return data;
  }, [data, betaData, deltaData]);

  return React.useMemo(() => {
    if (data.length === 0) return null;
    const result: any = {};

    // Entry signal indicators
    const entryDataSource = indicatorSettings[config.type]?.dataSource || 'alpha';
    const entryData = getDataBySource(entryDataSource);
    const entryClose = entryData.map(d => d.close);
    if (config.type === 'ma_crossover') {
      result.entrySignal = {
        fastLine: calculateEMA(entryClose, config.fastMa || 9),
        slowLine: calculateSMA(entryClose, config.slowMa || 21)
      };
    } else if (config.type === 'supertrend') {
      result.entrySignal = {
        supertrend: calculateSupertrend(entryData, config.supertrendPeriod || 10, config.supertrendMultiplier || 3)
      };
    } else if (config.type === 'stochastic') {
      result.entrySignal = {
        stochastic: calculateStochastic(entryData, config.stochK || 14, 3, config.stochD || 3)
      };
    } else if (config.type === 'linear_regression') {
      result.entrySignal = {
        lr: linearRegressionSystem(entryClose, config.lrSlopePeriod || 20, config.lrVolPeriod || 20, config.lrRegimePeriod || 30)
      };
    } else if (config.type === 'bollinger_bands') {
      result.entrySignal = {
        bb: calculateBollingerBands(entryData, config.bbPeriod || 20, config.bbStdDev || 2)
      };
    } else if (config.type === 'supertrend_regime') {
      const highs = entryData.map(d => d.high);
      const lows = entryData.map(d => d.low);
      result.entrySignal = {
        supertrend_regime: supertrendRegimeSystem(
          highs, lows, entryClose, 
          config.stPeriod || 10, config.atrMultiplier || 3, 
          config.regimePeriod || 30, config.zPeriod || 20, 
          config.zUpper || 1.5, config.zLower || -1.5
        )
      };
    }

    // Exit signal indicators
    const exitType = tradingConfig.useDifferentSignalSystemOnExit && tradingConfig.exitSignalSystemType 
      ? tradingConfig.exitSignalSystemType 
      : config.type;
      
    const exitConfig = tradingConfig.useDifferentSignalSystemOnExit && tradingConfig.exitSignalSystemParams
      ? tradingConfig.exitSignalSystemParams
      : config;

    const exitDataSource = indicatorSettings[exitType]?.dataSource || 'alpha';
    const exitData = getDataBySource(exitDataSource);
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
    }


    // Stop Loss Indicator
    const slData = getDataBySource(indicatorSettings.stopLossIndicator?.dataSource || 'alpha');
    result.stops = calculateStopBandsSmooth(slData, indicatorSettings.stopLossIndicator?.period || 10, indicatorSettings.stopLossIndicator?.multiplier || 3.0, false, true);

    // Volatility Filters
    const volData = getDataBySource(indicatorSettings.volatility?.dataSource || 'alpha');
    if (tradingConfig.useADXFilter) {
       result.adx = calculateADX(volData, indicatorSettings.volatility.adxPeriod);
    }
    if (tradingConfig.useSqueezeFilter) {
       const volClose = volData.map(d => d.close);
       const volHigh = volData.map(d => d.high);
       const volLow = volData.map(d => d.low);
       result.squeeze = calculateSqueeze(volClose, volHigh, volLow);
    }

    const zScoreData = getDataBySource(indicatorSettings.volatilityRegime?.dataSource || 'alpha');
    const hasZScoreFilters = tradingConfig.exitAfterNCandlesMin || tradingConfig.exitAfterNMinutesMin || tradingConfig.exitAfterNSecondsMin;
    if (hasZScoreFilters) {
       result.zscores = calculateVolatilityZScore(zScoreData, indicatorSettings.volatility.zScorePeriod);
    }

    return result;
  }, [data, betaData, deltaData, config, tradingConfig, indicatorSettings, getDataBySource]);
}
