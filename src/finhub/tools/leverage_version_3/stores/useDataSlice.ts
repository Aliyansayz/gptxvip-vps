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
  const [dataSettings, setDataSettings] = useState<DataSettingsConfig>(() => loadState(`${STORAGE_KEY}_data`, defaultDataSettings));

  useEffect(() => {
    saveState(`${STORAGE_KEY}_data`, dataSettings);
  }, [dataSettings]);

  return {
    dataSettings, setDataSettings
  };
}
