import { useState, useEffect } from 'react';
import { TradingRulesConfig } from '../functions/api/rules/tradingRules';
import { ParallelAccount } from './indicators_store';
import { loadState, saveState } from './utils/storage';
import { defaultTimeFilterConfig } from '../functions/api/timeFilter/timeFilterManager';
import { defaultStopLossModifierConfig } from '../functions/api/stopLossModifier/stopLossModifierConfig';
import { defaultTakeProfitModifierConfig } from '../functions/api/takeProfitModifier/takeProfitModifierConfig';

const STORAGE_KEY = 'leverage_trading_v1_settings';

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
  autoTradeBreakerByCount: false,
  autoTradeBreakerCountValue: 200,
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
  useSlopePersistenceFilter: false,
  slopePersistenceThreshold: 0.7,
  useTrendEfficiencyFilter: false,
  trendEfficiencyThreshold: 0.6,
  useWickEfficiencyFilter: false,
  wickEfficiencyThreshold: 0.55,
  useSqueezeFilter: false,
  stopLossPips: 0,
  takeProfitPips: 0,
  isRecurrentTradeActive: false,
  recurrentTradeParams: {
    countToExecute: 1,
    onlyExecuteIfLatestTradeInSurplus: true,
    entryOnMainTradeTrail: false,
    closeAllRecurrentOnPartialExit: false,
    closePctRecurrentOnPartialExitActive: false,
    closePctRecurrentPercentage: 50,
    entryOnTrendRevert: false,
    entryOnCandlesRevert: false
  },
  activeSystemMode: 'classic',
  activeConjunctionSystems: ['stochastic_alpha', 'ma_crossover_alpha', 'supertrend_alpha'],
  timeFilter: defaultTimeFilterConfig,
  stopLossModifier: defaultStopLossModifierConfig,
  takeProfitModifier: defaultTakeProfitModifierConfig
};

export function useTradingSlice() {
  const [tradingConfig, setTradingConfig] = useState<TradingRulesConfig>(() => loadState(`${STORAGE_KEY}_trading`, defaultTradingConfig));
  const [parallelAccounts, setParallelAccounts] = useState<ParallelAccount[]>(() => loadState(`${STORAGE_KEY}_parallel`, []));
  const [serialTradingEnabled, setSerialTradingEnabled] = useState<boolean>(() => loadState(`${STORAGE_KEY}_serial`, false));

  useEffect(() => {
    saveState(`${STORAGE_KEY}_trading`, tradingConfig);
  }, [tradingConfig]);

  useEffect(() => {
    saveState(`${STORAGE_KEY}_parallel`, parallelAccounts);
  }, [parallelAccounts]);

  useEffect(() => {
    saveState(`${STORAGE_KEY}_serial`, serialTradingEnabled);
  }, [serialTradingEnabled]);

  return {
    tradingConfig, setTradingConfig,
    parallelAccounts, setParallelAccounts,
    serialTradingEnabled, setSerialTradingEnabled
  };
}
