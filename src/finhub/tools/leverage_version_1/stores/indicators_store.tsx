import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TradingRulesConfig } from '../functions/api/rules/tradingRules';
import { AssetType } from '../../../homeMainView/simulatedDataGenerator';

import { LeverageConfig, DEFAULT_LEVERAGE_CONFIG } from '../functions/api/position_sizing/leveragedPositionSizeMetals';

export interface IndicatorSettings {
  ma_crossover: { fastMa: number; slowMa: number };
  stochastic: { stochK: number; stochD: number };
  supertrend: { period: number; multiplier: number };
  divergence: { stochK: number; stochD: number }; 
  linear_regression: { slopePeriod: number; volPeriod: number; regimePeriod: number };
  volatility: {
    adxPeriod: number;
    squeezeLength: number;
    zScorePeriod: number;
    dataSource: 'alpha' | 'beta' | 'delta';
  };
  volatilityRegime: {
    period: number;
    threshold: number;
    dataSource: 'alpha' | 'beta' | 'delta';
  };
  stopLossIndicator: {
    period: number;
    multiplier: number;
    dataSource: 'alpha' | 'beta' | 'delta';
  };
}

export interface DataSettingsConfig {
  asset: AssetType;
  timeframe: string;
  simulationMode: string;
  showAlpha: boolean;
  showBeta: boolean;
  showDelta: boolean;
  betaAggregateFactor: number; // 1 means off
  deltaAggregateSource: 'alpha' | 'beta';
  deltaAggregateFactor: number; // 1 means off
}

interface IndicatorsStoreContextType {
  tradingConfig: TradingRulesConfig;
  setTradingConfig: React.Dispatch<React.SetStateAction<TradingRulesConfig>>;
  indicatorSettings: IndicatorSettings;
  setIndicatorSettings: React.Dispatch<React.SetStateAction<IndicatorSettings>>;
  dataSettings: DataSettingsConfig;
  setDataSettings: React.Dispatch<React.SetStateAction<DataSettingsConfig>>;
  leverageSettings: LeverageConfig;
  setLeverageSettings: React.Dispatch<React.SetStateAction<LeverageConfig>>;
  getIndicatorDescription: (type: keyof IndicatorSettings) => string;
}

const defaultTradingConfig: TradingRulesConfig = {
    activeTradeType: 'main trade',
    mainTradeParams: {
      executionType: 'market execution',
      countToExecute: 1
    },
    entryOnSignal: true,
    entrySignalSource: 'alpha',
    exitOnSignalReversal: true,
    exitSignalSource: 'alpha',
    useStopLoss: true,
    useTakeProfit: true,
    rewardRiskRatio: 1.5,
    exitAfterNCandles: 0,
    exitAfterNCandlesMin: 0,
    exitAfterNCandlesMax: 0,
    exitAfterNMinutes: 0,
    exitAfterNMinutesMin: 0,
    exitAfterNMinutesMax: 0,
    exitAfterNSeconds: 0,
    exitAfterNSecondsMin: 0,
    exitAfterNSecondsMax: 0,
    pipMultiplier: 0.1, 
    useADXFilter: false,
    adxThreshold: 18,
    useSqueezeFilter: false,
    stopLossPips: 0,
    takeProfitPips: 0,
};

const defaultIndicatorSettings: IndicatorSettings = {
  ma_crossover: { fastMa: 9, slowMa: 21 },
  stochastic: { stochK: 14, stochD: 3 },
  supertrend: { period: 10, multiplier: 3 },
  divergence: { stochK: 14, stochD: 3 },
  linear_regression: { slopePeriod: 20, volPeriod: 20, regimePeriod: 30 },
  volatility: {
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
    dataSource: 'alpha'
  }
};

const defaultDataSettings: DataSettingsConfig = {
  asset: 'Gold',
  timeframe: '5s',
  simulationMode: 'Gold_5s',
  showAlpha: true,
  showBeta: false,
  showDelta: false,
  betaAggregateFactor: 1,
  deltaAggregateSource: 'alpha',
  deltaAggregateFactor: 1
};

const IndicatorsStoreContext = createContext<IndicatorsStoreContextType | null>(null);

const STORAGE_KEY = 'leverage_trading_v1_settings';

export const IndicatorsStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const loadState = <T,>(key: string, defaultVal: T): T => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return stored ? JSON.parse(stored) : defaultVal;
    } catch (e) {
      console.warn(`Error reading localStorage for ${key}`, e);
      return defaultVal;
    }
  };

  const [tradingConfig, setTradingConfig] = useState<TradingRulesConfig>(() => loadState('trading', defaultTradingConfig));
  const [indicatorSettings, setIndicatorSettings] = useState<IndicatorSettings>(() => loadState('indicator', defaultIndicatorSettings));
  const [dataSettings, setDataSettings] = useState<DataSettingsConfig>(() => loadState('data', defaultDataSettings));
  const [leverageSettings, setLeverageSettings] = useState<LeverageConfig>(() => loadState('leverage', DEFAULT_LEVERAGE_CONFIG));

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_trading`, JSON.stringify(tradingConfig));
  }, [tradingConfig]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_indicator`, JSON.stringify(indicatorSettings));
  }, [indicatorSettings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_data`, JSON.stringify(dataSettings));
  }, [dataSettings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_leverage`, JSON.stringify(leverageSettings));
  }, [leverageSettings]);

  const getIndicatorDescription = (type: keyof IndicatorSettings) => {
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
      default:
        return '';
    }
  };

  return (
    <IndicatorsStoreContext.Provider value={{ tradingConfig, setTradingConfig, indicatorSettings, setIndicatorSettings, dataSettings, setDataSettings, leverageSettings, setLeverageSettings, getIndicatorDescription }}>
      {children}
    </IndicatorsStoreContext.Provider>
  );
};

export const useIndicatorsStore = () => {
  const context = useContext(IndicatorsStoreContext);
  if (!context) throw new Error('useIndicatorsStore must be used within IndicatorsStoreProvider');
  return context;
};
