import { useState, useEffect } from 'react';
import { LeverageConfig, DEFAULT_LEVERAGE_CONFIG } from '../functions/api/position_sizing/leveragedPositionSizeMetals';
import { loadState } from './utils/storage';

const STORAGE_KEY = 'leverage_trading_v1_settings';

export function useLeverageSlice() {
  const [leverageSettings, setLeverageSettings] = useState<LeverageConfig>(() => loadState(`${STORAGE_KEY}_leverage`, DEFAULT_LEVERAGE_CONFIG));

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_leverage`, JSON.stringify(leverageSettings));
  }, [leverageSettings]);

  return {
    leverageSettings, setLeverageSettings
  };
}
