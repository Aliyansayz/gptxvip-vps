import { useState, useEffect } from 'react';
import { FeatureLogEntry } from '../functions/api/indicatorLog/featureLogBook';
import { loadState } from './utils/storage';

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
    localStorage.setItem(`${STORAGE_KEY}_feature_log_active`, JSON.stringify(isFeatureLogActive));
  }, [isFeatureLogActive]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_feature_log_visible`, JSON.stringify(isVisibilityLogActive));
  }, [isVisibilityLogActive]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_feature_log_entries`, JSON.stringify(featureLog));
  }, [featureLog]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_indicator_checked_state`, JSON.stringify(indicatorCheckedState));
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
