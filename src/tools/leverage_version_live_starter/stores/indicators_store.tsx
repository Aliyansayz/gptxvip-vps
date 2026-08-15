import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TradingRulesConfig } from '../../leverage_version_3/functions/api/rules/tradingRules';
import { AssetType } from '../../../finhub/homeMainView/simulatedDataGenerator';
import { OHLCSimulationParams, DEFAULT_OHLC_PARAMS } from '../../leverage_version_3/functions/api/data_source/simulationDataOhlcParameter';
import { LeverageConfig, DEFAULT_LEVERAGE_CONFIG } from '../../leverage_version_3/functions/api/position_sizing/leveragedPositionSizeMetals';
import { FeatureLogEntry } from '../../leverage_version_3/functions/api/indicatorLog/featureLogBook';
import { ConsoleLogEntry } from '../functions/api/indicatorLog/developerConsoleLog';

export type TradeExecutionMode = 'normal' | 'hedge' | 'invert';

export interface ParallelAccount {
  id: string;
  simultaneousTradeState: boolean;
  tradeExecutionMode: TradeExecutionMode;
}

export type StrategyDataSource = 'alpha' | 'beta' | 'delta';

export interface BaseIndicatorSettings {
  dataSource: StrategyDataSource;
  allowVariation?: boolean;
}

export interface IndicatorSettings {
  ma_crossover: BaseIndicatorSettings & { fastMa: number; slowMa: number; alphaParams?: {fastMa: number; slowMa: number}; betaParams?: {fastMa: number; slowMa: number}; deltaParams?: {fastMa: number; slowMa: number}; };
  stochastic: BaseIndicatorSettings & { stochK: number; stochD: number; alphaParams?: {stochK: number; stochD: number}; betaParams?: {stochK: number; stochD: number}; deltaParams?: {stochK: number; stochD: number}; };
  supertrend: BaseIndicatorSettings & { period: number; multiplier: number; alphaParams?: {period: number; multiplier: number}; betaParams?: {period: number; multiplier: number}; deltaParams?: {period: number; multiplier: number}; };
  divergence: BaseIndicatorSettings & { stochK: number; stochD: number; alphaParams?: {stochK: number; stochD: number}; betaParams?: {stochK: number; stochD: number}; deltaParams?: {stochK: number; stochD: number}; }; 
  linear_regression: BaseIndicatorSettings & { slopePeriod: number; volPeriod: number; regimePeriod: number; alphaParams?: {slopePeriod: number; volPeriod: number; regimePeriod: number}; betaParams?: {slopePeriod: number; volPeriod: number; regimePeriod: number}; deltaParams?: {slopePeriod: number; volPeriod: number; regimePeriod: number}; };
  bollinger_bands: BaseIndicatorSettings & { period: number; stdDev: number; alphaParams?: {period: number; stdDev: number}; betaParams?: {period: number; stdDev: number}; deltaParams?: {period: number; stdDev: number}; };
  supertrend_regime: BaseIndicatorSettings & { stPeriod: number; atrMultiplier: number; regimePeriod: number; zPeriod: number; zUpper: number; zLower: number; alphaParams?: {stPeriod: number; atrMultiplier: number; regimePeriod: number; zPeriod: number; zUpper: number; zLower: number}; betaParams?: {stPeriod: number; atrMultiplier: number; regimePeriod: number; zPeriod: number; zUpper: number; zLower: number}; deltaParams?: {stPeriod: number; atrMultiplier: number; regimePeriod: number; zPeriod: number; zUpper: number; zLower: number}; };
  heikin_ashi_smoothed: BaseIndicatorSettings & { smoothLen: number; alphaParams?: {smoothLen: number}; betaParams?: {smoothLen: number}; deltaParams?: {smoothLen: number}; };
  volatility: BaseIndicatorSettings & {
    atrPeriod: number;
    adxPeriod: number;
    squeezeLength: number;
    zScorePeriod: number;
  };
  volatilityRegime: BaseIndicatorSettings & {
    period: number;
    threshold: number;
  };
  stopLossIndicator: BaseIndicatorSettings & {
    period: number;
    multiplier: number;
    type?: 'atr_bands' | 'last_n_candles';
    lastNPeriod?: number;
    allowAtrOffset?: boolean;
    atrOffsetMultiplier?: number;
    allowFixedOffset?: boolean;
    fixedOffsetPips?: number;
  };
}

export interface DataSettingsConfig {
  asset: AssetType | string;
  timeframe: string;
  simulationMode: string;
  showAlpha: boolean;
  showBeta: boolean;
  showDelta: boolean;
  betaAggregateFactor: number; // 1 means off
  deltaAggregateSource: 'alpha' | 'beta';
  deltaAggregateFactor: number; // 1 means off
  dataSourceType?: 'simulation' | 'csv' | 'live';
  csvRawData?: any[];
  ohlcParams?: Record<string, OHLCSimulationParams>;
}

export interface VisibilitySettings {
  alphaVisible: boolean;
  betaVisible: boolean;
  deltaVisible: boolean;
  candleUpColor: string;
  candleDownColor: string;
  wickUpColor: string;
  wickDownColor: string;
}

export interface HeikinAshiSettings {
  alphaEnabled: boolean;
  betaEnabled: boolean;
  deltaEnabled: boolean;
  smoothLen: number;
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
  parallelAccounts: ParallelAccount[];
  setParallelAccounts: React.Dispatch<React.SetStateAction<ParallelAccount[]>>;
  visibilitySettings: VisibilitySettings;
  setVisibilitySettings: React.Dispatch<React.SetStateAction<VisibilitySettings>>;
  heikinAshiSettings: HeikinAshiSettings;
  setHeikinAshiSettings: React.Dispatch<React.SetStateAction<HeikinAshiSettings>>;
  serialTradingEnabled: boolean;
  setSerialTradingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isFeatureLogActive: boolean;
  setIsFeatureLogActive: React.Dispatch<React.SetStateAction<boolean>>;
  isVisibilityLogActive: boolean;
  setIsVisibilityLogActive: React.Dispatch<React.SetStateAction<boolean>>;
  featureLog: FeatureLogEntry[];
  setFeatureLog: React.Dispatch<React.SetStateAction<FeatureLogEntry[]>>;
  consoleLog: ConsoleLogEntry[];
  setConsoleLog: React.Dispatch<React.SetStateAction<ConsoleLogEntry[]>>;
  systemDeployLog: (level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', source: string, message: string) => void;
  getIndicatorDescription: (type: keyof IndicatorSettings) => string;
  latestPrice?: number;
  setLatestPrice?: React.Dispatch<React.SetStateAction<number>>;
  currentStops?: { lowerBand: number[], upperBand: number[] } | null;
  setCurrentStops?: React.Dispatch<React.SetStateAction<{ lowerBand: number[], upperBand: number[] } | null>>;
  simulationIndex?: number;
  setSimulationIndexGlobal?: React.Dispatch<React.SetStateAction<number>>;
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
    useSmoothAtrStopLossTrailing: false,
    useVolatilityRegimeSlTrailing: false,
    volatilityRegimePeriod: 30,
    trailRecurrentTradesWithAtr: false,
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
    isRecurrentTradeActive: false,
    recurrentTradeParams: {
      countToExecute: 1,
      onlyExecuteIfLatestTradeInSurplus: true,
      entryOnMainTradeTrail: false
    }
};

const defaultIndicatorSettings: IndicatorSettings = {
  ma_crossover: { fastMa: 9, slowMa: 21, dataSource: 'alpha' },
  stochastic: { stochK: 14, stochD: 3, dataSource: 'alpha' },
  supertrend: { period: 10, multiplier: 3, dataSource: 'alpha' },
  divergence: { stochK: 14, stochD: 3, dataSource: 'alpha' },
  linear_regression: { slopePeriod: 20, volPeriod: 20, regimePeriod: 30, dataSource: 'alpha' },
  bollinger_bands: { period: 20, stdDev: 2, dataSource: 'alpha' },
  supertrend_regime: { stPeriod: 10, atrMultiplier: 3, regimePeriod: 30, zPeriod: 20, zUpper: 1.5, zLower: -1.5, dataSource: 'alpha' },
  heikin_ashi_smoothed: { smoothLen: 10, dataSource: 'alpha' },
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
  deltaAggregateFactor: 1,
  dataSourceType: 'simulation',
  csvRawData: [],
  ohlcParams: DEFAULT_OHLC_PARAMS
};

const defaultVisibilitySettings: VisibilitySettings = {
  alphaVisible: true,
  betaVisible: true,
  deltaVisible: true,
  candleUpColor: '#10b981',
  candleDownColor: '#ef4444',
  wickUpColor: '#059669',
  wickDownColor: '#b91c1c'
};

const defaultHeikinAshiSettings: HeikinAshiSettings = {
  alphaEnabled: false,
  betaEnabled: false,
  deltaEnabled: false,
  smoothLen: 1
};

const IndicatorsStoreContext = createContext<IndicatorsStoreContextType | null>(null);

const STORAGE_KEY = 'leverage_trading_v1_settings';

export const IndicatorsStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const loadState = <T,>(key: string, defaultVal: T): T => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(defaultVal)) {
          return (Array.isArray(parsed) ? parsed : defaultVal) as unknown as T;
        }
        if (typeof parsed === 'object' && parsed !== null && typeof defaultVal === 'object' && defaultVal !== null) {
          return { ...defaultVal, ...parsed };
        }
        return parsed;
      }
      return defaultVal;
    } catch (e) {
      console.warn(`Error reading localStorage for ${key}`, e);
      return defaultVal;
    }
  };

  const [tradingConfig, setTradingConfig] = useState<TradingRulesConfig>(() => loadState('trading', defaultTradingConfig));
  const [indicatorSettings, setIndicatorSettings] = useState<IndicatorSettings>(() => loadState('indicator', defaultIndicatorSettings));
  const [dataSettings, setDataSettings] = useState<DataSettingsConfig>(() => loadState('data', defaultDataSettings));
  const [leverageSettings, setLeverageSettings] = useState<LeverageConfig>(() => loadState('leverage', DEFAULT_LEVERAGE_CONFIG));
  const [parallelAccounts, setParallelAccounts] = useState<ParallelAccount[]>(() => loadState('parallel', []));
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings>(() => loadState('visibility', defaultVisibilitySettings));
  const [heikinAshiSettings, setHeikinAshiSettings] = useState<HeikinAshiSettings>(() => loadState('heikin_ashi', defaultHeikinAshiSettings));
  const [serialTradingEnabled, setSerialTradingEnabled] = useState<boolean>(() => loadState('serial', false));
  const [isFeatureLogActive, setIsFeatureLogActive] = useState<boolean>(() => loadState('feature_log_active', true));
  const [isVisibilityLogActive, setIsVisibilityLogActive] = useState<boolean>(() => loadState('feature_log_visible', false));
  const [featureLog, setFeatureLog] = useState<FeatureLogEntry[]>(() => loadState('feature_log_entries', []));
  const [consoleLog, setConsoleLog] = useState<ConsoleLogEntry[]>([]);
  const [latestPrice, setLatestPrice] = useState<number>(0);
  const [currentStops, setCurrentStops] = useState<{ lowerBand: number[], upperBand: number[] } | null>(null);
  const [simulationIndex, setSimulationIndexGlobal] = useState<number>(0);

  const systemDeployLog = (level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', source: string, message: string) => {
    setConsoleLog(prev => {
      const newLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        level,
        source,
        message
      };
      return [...prev, newLog].slice(-1000); // Keep last 1000
    });
  };

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

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_parallel`, JSON.stringify(parallelAccounts));
  }, [parallelAccounts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_visibility`, JSON.stringify(visibilitySettings));
  }, [visibilitySettings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_heikin_ashi`, JSON.stringify(heikinAshiSettings));
  }, [heikinAshiSettings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_serial`, JSON.stringify(serialTradingEnabled));
  }, [serialTradingEnabled]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_feature_log_active`, JSON.stringify(isFeatureLogActive));
  }, [isFeatureLogActive]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_feature_log_visible`, JSON.stringify(isVisibilityLogActive));
  }, [isVisibilityLogActive]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_feature_log_entries`, JSON.stringify(featureLog));
  }, [featureLog]);

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
      case 'bollinger_bands':
        return `Simulates Bollinger Bands (${indicatorSettings.bollinger_bands?.period || 20} period, ${indicatorSettings.bollinger_bands?.stdDev || 2} std dev). LONG triggered when candle opens below lower band and closes above. SHORT triggered when candle opens above upper band and closes below.`;
      case 'supertrend_regime':
        return `Simulates a Hybrid Supertrend Regime System. Combines Adaptive Supertrend (StPeriod: ${indicatorSettings.supertrend_regime?.stPeriod || 10}, AtrMult: ${indicatorSettings.supertrend_regime?.atrMultiplier || 3}) with Regime (RegPeriod: ${indicatorSettings.supertrend_regime?.regimePeriod || 30}) and Z-Score Reversion (ZPeriod: ${indicatorSettings.supertrend_regime?.zPeriod || 20}, High: ${indicatorSettings.supertrend_regime?.zUpper || 1.5}, Low: ${indicatorSettings.supertrend_regime?.zLower || -1.5}).`;
      case 'heikin_ashi_smoothed':
        return `Simulates a Smoothed Heikin Ashi trend system. Calculates Heikin Ashi candles smoothed by an EMA of ${indicatorSettings.heikin_ashi_smoothed?.smoothLen || 10} periods. Trend direction changes generate entry/exit signals.`;
      default:
        return '';
    }
  };

  return (
    <IndicatorsStoreContext.Provider value={{
      tradingConfig,
      setTradingConfig,
      indicatorSettings,
      setIndicatorSettings,
      dataSettings,
      setDataSettings,
      leverageSettings,
      setLeverageSettings,
      parallelAccounts,
      setParallelAccounts,
      visibilitySettings,
      setVisibilitySettings,
      heikinAshiSettings,
      setHeikinAshiSettings,
      serialTradingEnabled,
      setSerialTradingEnabled,
      isFeatureLogActive,
      setIsFeatureLogActive,
      isVisibilityLogActive,
      setIsVisibilityLogActive,
      featureLog,
      setFeatureLog,
      consoleLog,
      setConsoleLog,
      systemDeployLog,
      getIndicatorDescription,
      latestPrice,
      setLatestPrice,
      currentStops,
      setCurrentStops,
      simulationIndex,
      setSimulationIndexGlobal
    }}>
      {children}
    </IndicatorsStoreContext.Provider>
  );
};

export const useIndicatorsStore = () => {
  const context = useContext(IndicatorsStoreContext);
  if (!context) throw new Error('useIndicatorsStore must be used within IndicatorsStoreProvider');
  return context;
};
