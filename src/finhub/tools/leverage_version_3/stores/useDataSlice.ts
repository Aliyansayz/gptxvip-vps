import { useState, useEffect } from 'react';
import { DataSettingsConfig } from './indicators_store';
import { loadState, saveState } from './utils/storage';
import { DEFAULT_OHLC_PARAMS } from '../functions/api/data_source/simulationDataOhlcParameter';

const STORAGE_KEY = 'leverage_trading_v1_settings';

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
  ohlcParams: DEFAULT_OHLC_PARAMS,
  liveSettings: {
    assetName: 'Gold',
    symbolId: 'XAUUSD',
    timeInterval: '1s',
    dataProvider: 'mt5',
    latencyRate: 500
  }
};

export function useDataSlice() {
  const [dataSettings, setDataSettings] = useState<DataSettingsConfig>(() => {
    const saved = loadState(`${STORAGE_KEY}_data`, defaultDataSettings);
    // Imported CSV candles are session data. Older persisted CSV settings may
    // point to an empty stream after a storage quota failure.
    return saved.dataSourceType === 'csv' && !saved.csvRawData?.length
      ? { ...saved, dataSourceType: 'simulation' }
      : saved;
  });

  useEffect(() => {
    // A 100k-row M1 file exceeds typical localStorage quotas. Keep the active
    // candles in React state and persist only lightweight simulation settings.
    saveState(`${STORAGE_KEY}_data`, {
      ...dataSettings,
      csvRawData: [],
      dataSourceType: dataSettings.dataSourceType === 'csv' ? 'simulation' : dataSettings.dataSourceType
    });
  }, [dataSettings]);

  return {
    dataSettings, setDataSettings
  };
}
