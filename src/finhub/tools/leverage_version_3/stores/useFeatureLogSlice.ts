import { useState, useEffect } from 'react';
import { FeatureLogEntry } from '../functions/api/indicatorLog/featureLogBook';
import { loadState, saveState } from './utils/storage';

const STORAGE_KEY = 'leverage_trading_v1_settings';

export function useFeatureLogSlice() {
  const [isFeatureLogActive, setIsFeatureLogActive] = useState<boolean>(() => loadState(`${STORAGE_KEY}_feature_log_active`, true));
  const [isVisibilityLogActive, setIsVisibilityLogActive] = useState<boolean>(() => loadState(`${STORAGE_KEY}_feature_log_visible`, false));
  const [featureLog, setFeatureLog] = useState<FeatureLogEntry[]>(() => loadState(`${STORAGE_KEY}_feature_log_entries`, []));
  const [latestPrice, setLatestPrice] = useState<number>(0);
  const [currentStops, setCurrentStops] = useState<{ lowerBand: number[], upperBand: number[] } | null>(null);
  const [simulationIndex, setSimulationIndexGlobal] = useState<number>(0);
  const [computedIndicatorsGlobal, setComputedIndicatorsGlobal] = useState<any>(null);

  // Task C: Check/Uncheck indicators
  const [indicatorCheckedState, setIndicatorCheckedState] = useState<Record<string, boolean>>(() => loadState(`${STORAGE_KEY}_indicator_checked_state`, {}));

  useEffect(() => {
    saveState(`${STORAGE_KEY}_feature_log_active`, isFeatureLogActive);
  }, [isFeatureLogActive]);

  useEffect(() => {
    saveState(`${STORAGE_KEY}_feature_log_visible`, isVisibilityLogActive);
  }, [isVisibilityLogActive]);

  useEffect(() => {
    saveState(`${STORAGE_KEY}_feature_log_entries`, featureLog);
  }, [featureLog]);

  useEffect(() => {
    saveState(`${STORAGE_KEY}_indicator_checked_state`, indicatorCheckedState);
  }, [indicatorCheckedState]);

  return {
    isFeatureLogActive, setIsFeatureLogActive,
    isVisibilityLogActive, setIsVisibilityLogActive,
    featureLog, setFeatureLog,
    latestPrice, setLatestPrice,
    currentStops, setCurrentStops,
    simulationIndex, setSimulationIndexGlobal,
    computedIndicatorsGlobal, setComputedIndicatorsGlobal,
    indicatorCheckedState, setIndicatorCheckedState
  };
}
