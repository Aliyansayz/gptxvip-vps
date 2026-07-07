import { useState, useEffect } from 'react';
import { VisibilitySettings, HeikinAshiSettings } from './indicators_store';
import { loadState } from './utils/storage';

const STORAGE_KEY = 'leverage_trading_v1_settings';

const defaultVisibilitySettings: VisibilitySettings = {
  alphaVisible: true,
  betaVisible: true,
  deltaVisible: true,
  mainIndicatorVisible: true,
  subplotsVisible: true,
  secondaryChartsVisible: true,
  trendStrengthVisible: false,
  volatilityRegimeMonitorVisible: false,
  atrValueBoxVisible: false,
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

export function useVisibilitySlice() {
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings>(() => loadState(`${STORAGE_KEY}_visibility`, defaultVisibilitySettings));
  const [heikinAshiSettings, setHeikinAshiSettings] = useState<HeikinAshiSettings>(() => loadState(`${STORAGE_KEY}_heikin_ashi`, defaultHeikinAshiSettings));

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_visibility`, JSON.stringify(visibilitySettings));
  }, [visibilitySettings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_heikin_ashi`, JSON.stringify(heikinAshiSettings));
  }, [heikinAshiSettings]);

  return {
    visibilitySettings, setVisibilitySettings,
    heikinAshiSettings, setHeikinAshiSettings
  };
}
