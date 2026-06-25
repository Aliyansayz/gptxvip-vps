import React, { createContext, useContext, ReactNode } from 'react';
import { TradingRulesConfig } from '../functions/api/rules/tradingRules';
import { AssetType } from '../../../components/homeMainView/simulatedDataGenerator';
import { OHLCSimulationParams, DEFAULT_OHLC_PARAMS } from '../functions/api/data_source/simulationDataOhlcParameter';
import { LeverageConfig, DEFAULT_LEVERAGE_CONFIG } from '../functions/api/position_sizing/leveragedPositionSizeMetals';
import { FeatureLogEntry } from '../functions/api/indicatorLog/featureLogBook';
import { systemDeployLog } from '../functions/api/developerLogConsole';

// Imports of Slices
import { useTradingSlice } from './useTradingSlice';
import { useIndicatorSlice } from './useIndicatorSlice';
import { useDataSlice } from './useDataSlice';
import { useLeverageSlice } from './useLeverageSlice';
import { useVisibilitySlice } from './useVisibilitySlice';
import { useFeatureLogSlice } from './useFeatureLogSlice';

export type TradeExecutionMode = 'normal' | 'hedge' | 'invert';

export interface ParallelAccount {
  id: string;
  simultaneousTradeState: boolean;
  tradeExecutionMode: TradeExecutionMode;
}

export type StrategyDataSource = 'alpha' | 'beta' | 'delta';

export interface BaseIndicatorSettings {
  dataSource: StrategyDataSource;
  entrySignalSource?: StrategyDataSource;
  exitSignalSource?: StrategyDataSource;
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
  candlestick_pattern: BaseIndicatorSettings;
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
    allowDifferentTrailSlIndicator?: boolean;
    trailPeriod?: number;
    trailMultiplier?: number;
    trailType?: 'atr_bands' | 'last_n_candles';
    trailLastNPeriod?: number;
    trailAllowAtrOffset?: boolean;
    trailAtrOffsetMultiplier?: number;
    trailAllowFixedOffset?: boolean;
    trailFixedOffsetPips?: number;
    trailDataSource?: 'alpha' | 'beta' | 'delta';
  };
  trendStrength: BaseIndicatorSettings & {
    slopePeriod: number;
    volPeriod: number;
    regimePeriod: number;
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
  liveSettings?: {
    assetName: string;
    symbolId: string;
    timeInterval: string;
    dataProvider: string;
    latencyRate: number;
  };
}

export interface VisibilitySettings {
  alphaVisible: boolean;
  betaVisible: boolean;
  deltaVisible: boolean;
  mainIndicatorVisible: boolean;
  subplotsVisible: boolean;
  secondaryChartsVisible: boolean;
  trendStrengthVisible?: boolean;
  volatilityRegimeMonitorVisible?: boolean;
  atrValueBoxVisible?: boolean;
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
  indicatorCheckedState: Record<string, boolean>;
  setIndicatorCheckedState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  getIndicatorDescription: (type: keyof IndicatorSettings | 'conjunction') => string;
  latestPrice?: number;
  setLatestPrice?: React.Dispatch<React.SetStateAction<number>>;
  currentStops?: { lowerBand: number[], upperBand: number[] } | null;
  setCurrentStops?: React.Dispatch<React.SetStateAction<{ lowerBand: number[], upperBand: number[] } | null>>;
  simulationIndex?: number;
  setSimulationIndexGlobal?: React.Dispatch<React.SetStateAction<number>>;
  computedIndicatorsGlobal?: any;
  setComputedIndicatorsGlobal?: React.Dispatch<React.SetStateAction<any>>;
  systemDeployLog?: any;
}

const IndicatorsStoreContext = createContext<IndicatorsStoreContextType | null>(null);

export const IndicatorsStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const tradingState = useTradingSlice();
  const indicatorState = useIndicatorSlice();
  const dataState = useDataSlice();
  const leverageState = useLeverageSlice();
  const visibilityState = useVisibilitySlice();
  const featureLogState = useFeatureLogSlice();

  return (
    <IndicatorsStoreContext.Provider value={{
      ...tradingState,
      ...indicatorState,
      ...dataState,
      ...leverageState,
      ...visibilityState,
      ...featureLogState,
      systemDeployLog
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

