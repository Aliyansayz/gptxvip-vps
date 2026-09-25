import React, { useState, useEffect } from 'react';
import { Ohlc } from '../../functions/api/indicators/baseline';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { generateOHLC, DEFAULT_OHLC_PARAMS } from '../../functions/api/data_source/simulationDataOhlcParameter';
import { aggregateData } from './types';
import { startAlphaDataSource, stopAlphaDataSource } from '../../functions/api/data_source/liveDataFetchMode';
import { systemDeployLog } from '../../functions/api/developerLogConsole';

export function useSimulatorState(
  simulationMode: string,
  asset: string,
  setTradingConfig: any,
  betaAggregateFactor: number,
  deltaAggregateFactor: number,
  deltaAggregateSource: string,
  dataSourceType: 'simulation' | 'csv' | 'live' = 'simulation',
  csvRawData: Ohlc[] = []
) {
  const { dataSettings } = useIndicatorsStore();
  const [data, setData] = useState<Ohlc[]>([]);
  const [simulationIndex, setSimulationIndex] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (dataSourceType === 'live') {
      return;
    }
    if (dataSourceType === 'csv') {
      setData(csvRawData || []);
      setTradingConfig((c: any) => c.pipMultiplier === 0.1 ? c : { ...c, pipMultiplier: 0.1 });
      setSimulationIndex(Math.min(50, Math.max(0, (csvRawData?.length || 0) - 1)));
      return;
    }

    const parts = simulationMode.split('_');
    const getBaseCountFromTime = (timeStr: string) => {
      if (timeStr.endsWith('s')) return 1000;
      if (timeStr.endsWith('m')) return 500;
      if (timeStr.endsWith('h')) return 300;
      return 1000;
    };
    
    const ohlcParams = dataSettings?.ohlcParams || DEFAULT_OHLC_PARAMS;
    const currentAsset = asset || 'Gold';
    const params = ohlcParams[currentAsset] || DEFAULT_OHLC_PARAMS[currentAsset] || DEFAULT_OHLC_PARAMS['Anonymous'];
    const startPrice = params.basePrice || 1000;

    if (parts.length === 2 && asset) {
      const timeStr = parts[1];
      let stepMs = 1000;
      if (timeStr.endsWith('s')) stepMs = parseInt(timeStr.replace('s', '')) * 1000 || 1000;
      if (timeStr.endsWith('m')) stepMs = (parseInt(timeStr.replace('m', '')) * 60) * 1000 || 60000;
      if (timeStr.endsWith('h')) stepMs = (parseInt(timeStr.replace('h', '')) * 3600) * 1000 || 3600000;

      const baseCandles = generateOHLC(startPrice, 1000, params, stepMs);
      setData(baseCandles);
      setTradingConfig((c: any) => c.pipMultiplier === 0.1 ? c : {...c, pipMultiplier: 0.1});
    } else {
      const stepMs = 60 * 60 * 1000;
      const baseCandles = generateOHLC(startPrice, 300, params, stepMs);
      setData(baseCandles);
      setTradingConfig((c: any) => c.pipMultiplier === 1 ? c : {...c, pipMultiplier: 1});
    }
    setSimulationIndex(50);
  }, [simulationMode, asset, setTradingConfig, dataSourceType, csvRawData, dataSettings?.ohlcParams]);

  const [playbackSpeedMs, setPlaybackSpeedMs] = useState(500);

  const dataRef = React.useRef(data);
  React.useEffect(() => { dataRef.current = data; }, [data]);

  useEffect(() => {
    if (dataSourceType === 'live') {
      return;
    }
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setSimulationIndex(prevIndex => {
          const currentData = dataRef.current;
          if (prevIndex >= currentData.length - 1 && currentData.length > 0) {
            if (dataSourceType === 'csv') {
              setIsPlaying(false);
              return prevIndex;
            }
            setData((prevData) => {
              // Get interval time step
              const parts = simulationMode.split('_');
              let stepMs = 1000;
              if (parts.length === 2) {
                const timeStr = parts[1];
                if (timeStr.endsWith('s')) stepMs = parseInt(timeStr.replace('s', '')) * 1000 || 1000;
                if (timeStr.endsWith('m')) stepMs = (parseInt(timeStr.replace('m', '')) * 60) * 1000 || 60000;
                if (timeStr.endsWith('h')) stepMs = (parseInt(timeStr.replace('h', '')) * 3600) * 1000 || 3600000;
              } else {
                stepMs = 60 * 60 * 1000;
              }

              const lastCandle = prevData[prevData.length - 1];
              const nextAsset = asset ? (asset as any) : 'Gold';
              
              const ohlcParams = dataSettings?.ohlcParams || DEFAULT_OHLC_PARAMS;
              const params = ohlcParams[nextAsset] || DEFAULT_OHLC_PARAMS[nextAsset] || DEFAULT_OHLC_PARAMS['Anonymous'];
              
              let regime = (lastCandle as any).regime || 'bull';
              const r = Math.random();
              if (regime === 'sideways') {
                if (r < params.trend_switch_prob) {
                  regime = Math.random() < 0.5 ? 'bull' : 'bear';
                }
              } else {
                if (r < params.side_ways_switch_prob) {
                  regime = 'sideways';
                } else if (r < params.side_ways_switch_prob + params.trend_switch_prob) {
                  regime = regime === 'bull' ? 'bear' : 'bull';
                }
              }

              let regimeDrift = 0;
              if (regime === 'bull') {
                regimeDrift = Math.abs(params.drift);
              } else if (regime === 'bear') {
                regimeDrift = -Math.abs(params.drift);
              } else {
                regimeDrift = 0;
              }

              const rngNormal = () => {
                let u = 0;
                let v = 0;
                while (u === 0) u = Math.random();
                while (v === 0) v = Math.random();
                return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
              };

              const move = lastCandle.close * (regimeDrift + params.volatility * rngNormal());
              const open = lastCandle.close;
              const close = Math.max(0.0001, open + move);
              
              const body = Math.abs(close - open);
              const wickNoise = Math.abs(rngNormal()) * params.high_low_noise * open;
              const wick = body * (params.wick_factor || 0.3) + wickNoise;
              const high = Math.max(open, close) + wick;
              const low = Math.max(0.0001, Math.min(open, close) - wick);

              const newCandle = {
                ...lastCandle,
                time: lastCandle.time + stepMs,
                open,
                close,
                high,
                low,
                volume: Math.floor(Math.random() * 100),
                regime
              };

              const newData = [...prevData, newCandle];
              return newData;
            });
            return prevIndex + 1;
          }
          return prevIndex + 1;
        });
      }, playbackSpeedMs); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, simulationMode, asset, playbackSpeedMs, dataSourceType, dataSettings?.ohlcParams]);

  // Synchronize simulation index with incoming live data length in real-time
  useEffect(() => {
    if (dataSourceType === 'live') {
      setSimulationIndex(Math.max(0, data.length - 1));
    }
  }, [data.length, dataSourceType]);

  // Hook up real-time Live Market Feed WebSocket
  useEffect(() => {
    if (dataSourceType !== 'live') {
      stopAlphaDataSource();
      return;
    }

    const liveSettings = dataSettings.liveSettings || {
      assetName: 'Gold',
      symbolId: 'XAUUSD',
      timeInterval: '1s',
      dataProvider: 'mt5',
      latencyRate: 500
    };

    const intervalParts = liveSettings.timeInterval.match(/^(\d+)([smh])$/);
    let candleDurationMs = 1000;
    if (intervalParts) {
      const count = parseInt(intervalParts[1], 10);
      const unit = intervalParts[2];
      if (unit === 's') candleDurationMs = count * 1000;
      else if (unit === 'm') candleDurationMs = count * 60000;
      else if (unit === 'h') candleDurationMs = count * 3600000;
    }

    setData([]);

    startAlphaDataSource(
      {
        mode: 'Live Market Feed',
        symbol_id: liveSettings.symbolId,
        time_interval: liveSettings.timeInterval,
        time_frequency: 'tick',
        latency_rate: liveSettings.latencyRate,
        livedataprovider: liveSettings.dataProvider
      },
      (tick) => {
        const tickPrice = tick.price;
        const tickTime = tick.time;
        const tickVolume = tick.volume || 1;

        const candleStartTime = Math.floor(tickTime / candleDurationMs) * candleDurationMs;

        setData((prevData) => {
          if (prevData.length === 0) {
            const firstCandle: Ohlc = {
              time: candleStartTime,
              open: tickPrice,
              high: tickPrice,
              low: tickPrice,
              close: tickPrice,
              volume: tickVolume
            };
            return [firstCandle];
          }

          const lastCandle = prevData[prevData.length - 1];
          if (candleStartTime <= lastCandle.time) {
            const updated = {
              ...lastCandle,
              high: Math.max(lastCandle.high, tickPrice),
              low: Math.min(lastCandle.low, tickPrice),
              close: tickPrice,
              volume: lastCandle.volume + tickVolume
            };
            return [...prevData.slice(0, -1), updated];
          } else {
            const newCandle: Ohlc = {
              time: candleStartTime,
              open: lastCandle.close,
              high: Math.max(lastCandle.close, tickPrice),
              low: Math.min(lastCandle.close, tickPrice),
              close: tickPrice,
              volume: tickVolume
            };
            const nextData = [...prevData, newCandle];
            if (nextData.length > 2000) nextData.shift();
            return nextData;
          }
        });
      },
      (level, source, message) => {
        systemDeployLog(level, source, message);
      }
    );

    return () => {
      stopAlphaDataSource();
    };
  }, [dataSourceType, dataSettings.liveSettings]);

  const betaData = React.useMemo(() => aggregateData(data, betaAggregateFactor), [data, betaAggregateFactor]);
  const deltaBaseData = deltaAggregateSource === 'beta' ? betaData : data;
  const deltaData = React.useMemo(() => aggregateData(deltaBaseData, deltaAggregateFactor), [deltaBaseData, deltaAggregateFactor]);

  const betaIndex = Math.floor(simulationIndex / Math.max(1, betaAggregateFactor));
  const deltaFactorForIndex = deltaAggregateSource === 'beta' 
    ? Math.max(1, betaAggregateFactor) * Math.max(1, deltaAggregateFactor)
    : Math.max(1, deltaAggregateFactor);
  const deltaIndex = Math.floor(simulationIndex / deltaFactorForIndex);

  // Cache streams globally for safe decoupeld panel access (e.g., CSV saving)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__activeSimulationStreams = {
        alphaData: data,
        betaData,
        deltaData
      };
    }
  }, [data, betaData, deltaData]);

  return {
    data,
    betaData,
    deltaData,
    simulationIndex,
    setSimulationIndex,
    isPlaying,
    setIsPlaying,
    playbackSpeedMs,
    setPlaybackSpeedMs,
    betaIndex,
    deltaIndex
  };
}
