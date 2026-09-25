import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { getBaseInterval, formatInterval } from '../../functions/api/rules/dataSourceRules';
import { AssetSlider } from '../../../../homeMainView/AssetSlider';
import { AssetType } from '../../../../homeMainView/simulatedDataGenerator';
import { CsvFileInputMode } from '../../functions/api/data_source/csvFileInputmode';
import { OHLCSimulationParams, DEFAULT_OHLC_PARAMS, generateOHLC } from '../../functions/api/data_source/simulationDataOhlcParameter';
import { GOLD_ONLY_PRESETS, GoldPresetName, GOLD_PRESET_NAMES } from '../../functions/api/data_source/goldPresetAdjustments';
import { SILVER_PRESETS, SilverPresetName, listSilverPresetNames } from '../../functions/api/data_source/silverSimulationPresets';
import { NASDAQ100_PRESETS, NasdaqPresetName, NASDAQ100_PRESET_NAMES } from '../../functions/api/data_source/nasdaq100SimulationPresets';
import { OIL_PRESETS, OilPresetName, OIL_PRESET_NAMES } from '../../functions/api/data_source/oilSimulationPresets';
import { USDJPY_PRESETS, USDJPYPresetName, listUSDJPYPresetNames } from '../../functions/api/data_source/usdjpySimulationPresets';
import { GBPJPY_PRESETS, GBPJPYPresetName, listGBPJPYPresetNames } from '../../functions/api/data_source/gbpjpySimulationPresets';
import { EURJPY_PRESETS, EURJPYPresetName, listEURJPYPresetNames } from '../../functions/api/data_source/eurjpySimulationPresets';
import { EURUSD_PRESETS, EurUsdPresetName, listEurUsdPresetNames } from '../../functions/api/data_source/eurusdSimulationPresets';
import { AUDUSD_PRESETS, AUDUSDPresetName, AUDUSD_PRESET_NAMES } from '../../functions/api/data_source/audusdSimulationPresets';
import { USDCAD_PRESETS, USDCADPresetName, USDCAD_PRESET_NAMES } from '../../functions/api/data_source/usdcadSimulationPresets';
import { EURCAD_PRESETS, EURCADPresetName, EURCAD_PRESET_NAMES } from '../../functions/api/data_source/eurcadSimulationPresets';
import { Download, FileSpreadsheet, ChevronDown, ChevronUp, Database } from 'lucide-react';
import { Ohlc } from '../../functions/api/indicators/baseline';
import { saveDataIntoCsv } from '../../functions/api/utility/saveDataIntoCsv';
import { aggregateData } from '../CandlestickSimulator/types';

interface TradingPanelDataSettingsProps {
  alphaData?: Ohlc[];
  betaData?: Ohlc[];
  deltaData?: Ohlc[];
}

const isPresetActive = (presetParams: OHLCSimulationParams, currentParams: OHLCSimulationParams) => {
  return (
    Math.abs(presetParams.drift - currentParams.drift) < 1e-7 &&
    Math.abs(presetParams.volatility - currentParams.volatility) < 1e-7 &&
    presetParams.seed === currentParams.seed &&
    Math.abs((presetParams.wick_factor ?? 0.3) - (currentParams.wick_factor ?? 0.3)) < 1e-7 &&
    Math.abs(presetParams.high_low_noise - currentParams.high_low_noise) < 1e-7 &&
    Math.abs(presetParams.side_ways_switch_prob - currentParams.side_ways_switch_prob) < 1e-7 &&
    Math.abs(presetParams.trend_switch_prob - currentParams.trend_switch_prob) < 1e-7
  );
};

const AggregationInput: React.FC<{
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
  className?: string;
}> = ({ value, onChange, disabled, className }) => {
  const predefined = [1, 2, 3, 4, 5, 10];
  const [isCustom, setIsCustom] = useState(!predefined.includes(value));

  if (isCustom) {
    return (
      <div className={`flex gap-1 ${className || 'w-full'}`}>
        <input
          type="number"
          disabled={disabled}
          value={value || ''}
          onChange={(e) => onChange(parseInt(e.target.value) || 1)}
          className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 flex-1 min-w-0"
          min={1}
        />
        <button 
          onClick={() => { setIsCustom(false); onChange(predefined.includes(value) ? value : 1); }}
          className="bg-zinc-800 border border-zinc-700 text-zinc-400 px-2 py-1.5 rounded-md text-xs hover:bg-zinc-700 flex-shrink-0"
          title="Back to presets"
        >
          X
        </button>
      </div>
    );
  }

  return (
    <select 
      disabled={disabled}
      value={value}
      onChange={(e) => {
        if (e.target.value === 'custom') {
          setIsCustom(true);
        } else {
          onChange(parseInt(e.target.value));
        }
      }}
      className={`bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 ${className || 'w-full'}`}
    >
      <option value="1">1x (Off)</option>
      <option value="2">2x</option>
      <option value="3">3x</option>
      <option value="4">4x</option>
      <option value="5">5x</option>
      <option value="10">10x</option>
      <option value="custom">Custom...</option>
    </select>
  );
};

export const TradingPanelDataSettings: React.FC<TradingPanelDataSettingsProps> = ({
  alphaData = [],
  betaData = [],
  deltaData = []
}) => {
  const { dataSettings, setDataSettings } = useIndicatorsStore();
  const [showSimParams, setShowSimParams] = useState(false);

  // Dynamically resolve active streams from props, high-performance global app cache, or on-the-fly seed generation
  const resolveStreams = () => {
    let finalAlpha = [...(alphaData || [])];
    let finalBeta = [...(betaData || [])];
    let finalDelta = [...(deltaData || [])];

    // 1. Recover from the global high-performance active simulation cache
    if (typeof window !== 'undefined' && (window as any).__activeSimulationStreams) {
      const liveCache = (window as any).__activeSimulationStreams;
      if (finalAlpha.length === 0 && liveCache.alphaData && liveCache.alphaData.length > 0) {
        finalAlpha = liveCache.alphaData;
      }
      if (finalBeta.length === 0 && liveCache.betaData && liveCache.betaData.length > 0) {
        finalBeta = liveCache.betaData;
      }
      if (finalDelta.length === 0 && liveCache.deltaData && liveCache.deltaData.length > 0) {
        finalDelta = liveCache.deltaData;
      }
    }

    // 2. Fallback to generating a fresh stream compliant with the user's active configurations
    if (finalAlpha.length === 0) {
      try {
        const parts = dataSettings.simulationMode?.split('_') || ['Gold', '5s'];
        const currentAsset = dataSettings.asset as string || 'Gold';
        const ohlcParams = dataSettings.ohlcParams || DEFAULT_OHLC_PARAMS;
        const params = ohlcParams[currentAsset] || DEFAULT_OHLC_PARAMS[currentAsset] || DEFAULT_OHLC_PARAMS['Anonymous'];
        const startPrice = params.basePrice || 1000;

        let stepMs = 5000;
        if (parts.length === 2) {
          const timeStr = parts[1];
          if (timeStr.endsWith('s')) stepMs = parseInt(timeStr.replace('s', '')) * 1000 || 5000;
          if (timeStr.endsWith('m')) stepMs = (parseInt(timeStr.replace('m', '')) * 60) * 1000 || 60000;
          if (timeStr.endsWith('h')) stepMs = (parseInt(timeStr.replace('h', '')) * 3600) * 1000 || 3600000;
        }

        const generatedAlpha = generateOHLC(startPrice, 1000, params, stepMs);
        finalAlpha = generatedAlpha;

        finalBeta = aggregateData(generatedAlpha, dataSettings.betaAggregateFactor || 1);

        const deltaBase = dataSettings.deltaAggregateSource === 'beta' ? finalBeta : generatedAlpha;
        finalDelta = aggregateData(deltaBase, dataSettings.deltaAggregateFactor || 1);
      } catch (err) {
        console.error("Failed to generate fallback OHLC stream for CSV saver:", err);
      }
    }

    return {
      alpha: finalAlpha,
      beta: finalBeta,
      delta: finalDelta
    };
  };

  const resolved = resolveStreams();
  const activeAlpha = resolved.alpha;
  const activeBeta = resolved.beta;
  const activeDelta = resolved.delta;

  const alphaInterval = getBaseInterval(dataSettings.simulationMode);
  const betaInterval = alphaInterval * dataSettings.betaAggregateFactor;
  const deltaInterval = (dataSettings.deltaAggregateSource === 'beta' ? betaInterval : alphaInterval) * dataSettings.deltaAggregateFactor;

  const currentAsset = dataSettings.asset as string;
  const ohlcParams = dataSettings.ohlcParams || DEFAULT_OHLC_PARAMS;
  const params = ohlcParams[currentAsset] || DEFAULT_OHLC_PARAMS[currentAsset] || DEFAULT_OHLC_PARAMS['Anonymous'];

  const activePresetKey = currentAsset === 'Gold'
    ? (Object.keys(GOLD_ONLY_PRESETS) as GoldPresetName[]).find(
        (key) => isPresetActive(GOLD_ONLY_PRESETS[key].params, params)
      )
    : currentAsset === 'Silver'
      ? (Object.keys(SILVER_PRESETS) as SilverPresetName[]).find(
          (key) => isPresetActive(SILVER_PRESETS[key].params, params)
        )
    : currentAsset === 'Nasdaq100'
      ? (Object.keys(NASDAQ100_PRESETS) as NasdaqPresetName[]).find(
          (key) => isPresetActive(NASDAQ100_PRESETS[key].params, params)
        )
      : currentAsset === 'Oil'
        ? (Object.keys(OIL_PRESETS) as OilPresetName[]).find(
            (key) => isPresetActive(OIL_PRESETS[key].params, params)
          )
        : currentAsset === 'USDJPY'
          ? (Object.keys(USDJPY_PRESETS) as USDJPYPresetName[]).find(
              (key) => isPresetActive(USDJPY_PRESETS[key].params, params)
            )
          : currentAsset === 'GBPJPY'
            ? (Object.keys(GBPJPY_PRESETS) as GBPJPYPresetName[]).find(
                (key) => isPresetActive(GBPJPY_PRESETS[key].params, params)
              )
            : currentAsset === 'EURJPY'
              ? (Object.keys(EURJPY_PRESETS) as EURJPYPresetName[]).find(
                  (key) => isPresetActive(EURJPY_PRESETS[key].params, params)
                )
              : currentAsset === 'EURUSD'
                ? (Object.keys(EURUSD_PRESETS) as EurUsdPresetName[]).find(
                    (key) => isPresetActive(EURUSD_PRESETS[key].params, params)
                  )
                : currentAsset === 'AUDUSD'
                  ? AUDUSD_PRESET_NAMES.find(
                      (key) => isPresetActive(AUDUSD_PRESETS[key].params, params)
                    )
                  : currentAsset === 'USDCAD'
                    ? USDCAD_PRESET_NAMES.find(
                        (key) => isPresetActive(USDCAD_PRESETS[key].params, params)
                      )
                    : currentAsset === 'EURCAD'
                      ? EURCAD_PRESET_NAMES.find(
                          (key) => isPresetActive(EURCAD_PRESETS[key].params, params)
                        )
                      : undefined;

  const presetLabel = activePresetKey
    ? currentAsset === 'Gold'
      ? GOLD_ONLY_PRESETS[activePresetKey as GoldPresetName].label
      : currentAsset === 'Silver'
        ? SILVER_PRESETS[activePresetKey as SilverPresetName].label
      : currentAsset === 'Nasdaq100'
        ? NASDAQ100_PRESETS[activePresetKey as NasdaqPresetName].label
      : currentAsset === 'Oil'
        ? OIL_PRESETS[activePresetKey as OilPresetName].label
      : currentAsset === 'USDJPY'
        ? USDJPY_PRESETS[activePresetKey as USDJPYPresetName].label
      : currentAsset === 'GBPJPY'
        ? GBPJPY_PRESETS[activePresetKey as GBPJPYPresetName].label
      : currentAsset === 'EURJPY'
        ? EURJPY_PRESETS[activePresetKey as EURJPYPresetName].label
      : currentAsset === 'EURUSD'
        ? EURUSD_PRESETS[activePresetKey as EurUsdPresetName].label
      : currentAsset === 'AUDUSD'
        ? AUDUSD_PRESETS[activePresetKey as AUDUSDPresetName].label
      : currentAsset === 'USDCAD'
        ? USDCAD_PRESETS[activePresetKey as USDCADPresetName].label
      : currentAsset === 'EURCAD'
        ? EURCAD_PRESETS[activePresetKey as EURCADPresetName].label
        : undefined
    : undefined;

  const handleAssetChange = (asset: AssetType) => {
    setDataSettings(p => ({
      ...p,
      asset,
      simulationMode: `${asset}_${p.timeframe}`
    }));
  };

  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const timeframe = e.target.value;
    setDataSettings(p => ({
      ...p,
      timeframe,
      simulationMode: `${p.asset}_${timeframe}`
    }));
  };

  const updateParam = (key: keyof OHLCSimulationParams, val: number) => {
    setDataSettings(p => {
      const ohlc = p.ohlcParams || { ...DEFAULT_OHLC_PARAMS };
      const currentAssetOhlc = { ...(ohlc[p.asset as string] || DEFAULT_OHLC_PARAMS[p.asset as string] || DEFAULT_OHLC_PARAMS['Anonymous']) };
      (currentAssetOhlc as any)[key] = val;
      return {
        ...p,
        ohlcParams: {
          ...ohlc,
          [p.asset as string]: currentAssetOhlc
        }
      };
    });
  };

  const resetParams = () => {
    setDataSettings(p => {
      const ohlc = p.ohlcParams ? { ...p.ohlcParams } : { ...DEFAULT_OHLC_PARAMS };
      ohlc[p.asset as string] = { ...(DEFAULT_OHLC_PARAMS[p.asset as string] || DEFAULT_OHLC_PARAMS['Anonymous']) };
      return {
        ...p,
        ohlcParams: ohlc
      };
    });
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-zinc-800/10 border border-zinc-700/30 rounded-lg overflow-hidden mb-4 shrink-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-zinc-800/20 hover:bg-zinc-700/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-cyan-400">
          <Database size={16} />
          <span className="font-semibold text-sm uppercase tracking-wider">Data Layer Config</span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-zinc-700/30 text-zinc-300 space-y-4">

              <div className="flex flex-col gap-3 text-zinc-300 font-sans">
                {/* Clean Mode Switcher */}
                <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800/80 mb-1">
                  <button
                    onClick={() => setDataSettings(p => ({ ...p, dataSourceType: 'simulation' }))}
                    className={`py-1.5 px-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      (!dataSettings.dataSourceType || dataSettings.dataSourceType === 'simulation')
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold'
                        : 'text-zinc-550 hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    💻 Simulator
                  </button>
                  <button
                    onClick={() => setDataSettings(p => ({ ...p, dataSourceType: 'live' }))}
                    className={`py-1.5 px-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      dataSettings.dataSourceType === 'live'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                        : 'text-zinc-550 hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    🌐 Live Feed
                  </button>
                  <button
                    onClick={() => setDataSettings(p => ({ ...p, dataSourceType: 'csv' }))}
                    className={`py-1.5 px-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      dataSettings.dataSourceType === 'csv'
                        ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30 font-bold'
                        : 'text-zinc-550 hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    📁 CSV Import
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {(!dataSettings.dataSourceType || dataSettings.dataSourceType === 'simulation') && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold text-amber-500 bg-amber-950/40 border border-amber-900/50 rounded uppercase tracking-wide mr-2">
                        Simulation Active
                      </span>
                    )}
                    {dataSettings.dataSourceType === 'live' && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold text-emerald-450 bg-emerald-950/40 border border-emerald-900/50 rounded uppercase tracking-wide mr-2">
                        Live Socket Feed
                      </span>
                    )}
                    <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">Data Settings</span>
                  </div>
                  <div className="flex gap-3 text-[10px] bg-zinc-800/50 px-2 py-1 rounded border border-zinc-700">
                     <span className="text-zinc-300"><span className="text-cyan-400 font-bold">α</span> {formatInterval(alphaInterval)}</span>
                     <span className="text-zinc-300"><span className="text-purple-400 font-bold">β</span> {formatInterval(betaInterval)}</span>
                     <span className="text-zinc-300"><span className="text-emerald-400 font-bold">δ</span> {formatInterval(deltaInterval)}</span>
                  </div>
                </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
        {dataSettings.dataSourceType === 'live' ? (
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950/45 p-3 rounded-lg border border-zinc-900 mt-1">
            <div className="flex flex-col gap-1.5 font-sans">
              <span className="text-xs text-zinc-300">Asset Name</span>
              <select
                value={dataSettings.liveSettings?.assetName || 'Gold'}
                onChange={(e) => {
                  const name = e.target.value;
                  let sym = 'XAUUSD';
                  if (name === 'Nasdaq100') sym = 'NAS100';
                  else if (name === 'Silver') sym = 'XAGUSD';
                  else if (name === 'Bitcoin') sym = 'BTC';
                  else if (name === 'Ethereum') sym = 'ETH';
                  else if (name === 'Apple') sym = 'AAPL';
                  else if (name === 'Oil') sym = 'USOUSD';
                  else if (name === 'USDJPY') sym = 'USDJPY';
                  else if (name === 'GBPJPY') sym = 'GBPJPY';
                  else if (name === 'EURJPY') sym = 'EURJPY';
                  else if (name === 'EURUSD') sym = 'EURUSD';
                  else if (name === 'AUDUSD') sym = 'AUDUSD';
                  else if (name === 'USDCAD') sym = 'USDCAD';
                  else if (name === 'EURCAD') sym = 'EURCAD';

                  setDataSettings(p => ({
                    ...p,
                    liveSettings: {
                      ...(p.liveSettings || { assetName: 'Gold', symbolId: 'XAUUSD', timeInterval: '1s', dataProvider: 'mt5', latencyRate: 500 }),
                      assetName: name,
                      symbolId: sym
                    }
                  }));
                }}
                className="w-full bg-zinc-900 border border-zinc-850 text-zinc-350 text-xs rounded-md px-2 py-2 focus:ring-amber-500 focus:border-amber-500 h-9"
              >
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Oil">Crude Oil</option>
                <option value="Nasdaq100">Nasdaq 100</option>
                <option value="Bitcoin">Bitcoin (BTC)</option>
                <option value="Ethereum">Ethereum (ETH)</option>
                <option value="Apple">Apple Inc (AAPL)</option>
                <option value="USDJPY">🇺🇸🇯🇵 USD/JPY</option>
                <option value="GBPJPY">🇬🇧🇯🇵 GBP/JPY</option>
                <option value="EURJPY">🇪🇺🇯🇵 EUR/JPY</option>
                <option value="EURUSD">🇪🇺🇺🇸 EUR/USD</option>
                <option value="AUDUSD">🇦🇺🇺🇸 AUD/USD</option>
                <option value="USDCAD">🇺🇸🇨🇦 USD/CAD</option>
                <option value="EURCAD">🇪🇺🇨🇦 EUR/CAD</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-zinc-300 font-sans">Asset _ID (Symbol ID)</span>
              <input
                type="text"
                placeholder="XAUUSD"
                value={dataSettings.liveSettings?.symbolId || 'XAUUSD'}
                onChange={(e) => {
                  const symbolId = e.target.value;
                  setDataSettings(p => ({
                    ...p,
                    liveSettings: {
                      ...(p.liveSettings || { assetName: 'Gold', symbolId: 'XAUUSD', timeInterval: '1s', dataProvider: 'mt5', latencyRate: 500 }),
                      symbolId
                    }
                  }));
                }}
                className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-800 focus:border-amber-500 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-300 h-9"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-zinc-300 font-sans">Time Interval</span>
              <select
                value={dataSettings.liveSettings?.timeInterval || '1s'}
                onChange={(e) => {
                  const timeInterval = e.target.value;
                  setDataSettings(p => ({
                    ...p,
                    liveSettings: {
                      ...(p.liveSettings || { assetName: 'Gold', symbolId: 'XAUUSD', timeInterval: '1s', dataProvider: 'mt5', latencyRate: 500 }),
                      timeInterval
                    }
                  }));
                }}
                className="w-full bg-zinc-900 border border-zinc-850 text-zinc-350 text-xs rounded-md px-2 py-2 focus:ring-amber-500 focus:border-amber-500 h-9"
              >
                <option value="1s">1 Second</option>
                <option value="2s">2 Seconds</option>
                <option value="3s">3 Seconds</option>
                <option value="5s">5 Seconds</option>
                <option value="10s">10 Seconds</option>
                <option value="1m">1 Minute</option>
                <option value="5m">5 Minutes</option>
                <option value="1h">1 Hour</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-zinc-300 font-sans">Data Provider</span>
              <input
                type="text"
                placeholder="mt5"
                value={dataSettings.liveSettings?.dataProvider || 'mt5'}
                onChange={(e) => {
                  const dataProvider = e.target.value;
                  setDataSettings(p => ({
                    ...p,
                    liveSettings: {
                      ...(p.liveSettings || { assetName: 'Gold', symbolId: 'XAUUSD', timeInterval: '1s', dataProvider: 'mt5', latencyRate: 500 }),
                      dataProvider
                    }
                  }));
                }}
                className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-800 focus:border-amber-500 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-300 h-9"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2 mt-2 font-sans">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>WS Feed Latency Rate</span>
                <span className="font-mono text-amber-400 font-bold">{(dataSettings.liveSettings?.latencyRate !== undefined ? dataSettings.liveSettings.latencyRate : 500)} ms</span>
              </div>
              <input 
                type="range"
                min="100"
                max="5000"
                step="100"
                value={dataSettings.liveSettings?.latencyRate !== undefined ? dataSettings.liveSettings.latencyRate : 500}
                onChange={(e) => {
                  const latencyRate = parseInt(e.target.value, 10);
                  setDataSettings(p => ({
                    ...p,
                    liveSettings: {
                      ...(p.liveSettings || { assetName: 'Gold', symbolId: 'XAUUSD', timeInterval: '1s', dataProvider: 'mt5', latencyRate: 500 }),
                      latencyRate
                    }
                  }));
                }}
                className="w-full accent-amber-500 bg-zinc-900 cursor-pointer h-1.5 rounded-lg"
              />
            </div>
          </div>
        ) : dataSettings.dataSourceType === 'csv' ? (
          <div className="col-span-2">
            <CsvFileInputMode />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-zinc-300 font-sans">Asset Selection</span>
              <AssetSlider 
                assetFilters={['Anonymous', 'Gold', 'Silver', 'Oil', 'Nasdaq100', 'USDJPY', 'GBPJPY', 'EURJPY', 'EURUSD', 'AUDUSD', 'USDCAD', 'EURCAD']}
                value={dataSettings.asset as AssetType}
                onChange={handleAssetChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-zinc-300 font-sans">Timeframe</span>
              <select 
                value={dataSettings.timeframe}
                onChange={handleTimeframeChange}
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-350 text-xs rounded-md px-2 py-2 focus:ring-cyan-500 focus:border-cyan-500 h-9"
              >
                <option value="1s">1 Second</option>
                <option value="2s">2 Seconds</option>
                <option value="3s">3 Seconds</option>
                <option value="5s">5 Seconds</option>
                <option value="1m">1 Minute</option>
                <option value="5m">5 Minutes</option>
                <option value="1h">1 Hour</option>
              </select>
            </div>
          </>
        )}
      </div>

      {(!dataSettings.dataSourceType || dataSettings.dataSourceType === 'simulation') && (
        <div className="flex items-center justify-between mt-1 pt-1 border-t border-zinc-850">
          <button 
             onClick={() => setShowSimParams(!showSimParams)}
             className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <span>{showSimParams ? '▼ Hide' : '▶ Show'} Market OHLC Simulation Parameters</span>
          </button>
        </div>
      )}

      {/* Embedded High-Quality Market Mock Simulation Parameters UI */}
       {dataSettings.dataSourceType !== 'csv' && showSimParams && (() => {
        return (
          <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-lg flex flex-col gap-3.5 transition-all mt-1">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wide font-sans">
                ⚙️ {currentAsset} OHLC Parameters {presetLabel ? <span className="text-yellow-500/90 text-[10px] normal-case">({presetLabel} Preset)</span> : ''}
              </span>
              <button 
                onClick={resetParams}
                className="text-[10px] bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 px-2 py-1 rounded transition-colors"
                title="Reset current asset back to baseline defaults"
              >
                Reset Defaults
              </button>
            </div>

            {currentAsset === 'Gold' && (
              <div className="flex flex-col gap-2 bg-yellow-500/5 border border-yellow-500/10 p-2.5 rounded-lg">
                <span className="text-xs font-semibold text-yellow-500 flex items-center gap-1.5">
                  🌟 Gold Market Scenario Presets
                </span>
                <p className="text-[10px] text-zinc-400">
                  Select a recurring macro/session behavior preset to instantly auto-configure the simulation engine parameters:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {GOLD_PRESET_NAMES.map((key) => {
                    const preset = GOLD_ONLY_PRESETS[key];
                    const isActive = isPresetActive(preset.params, params);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setDataSettings((p) => {
                            const ohlc = p.ohlcParams ? { ...p.ohlcParams } : { ...DEFAULT_OHLC_PARAMS };
                            ohlc['Gold'] = {
                              ...preset.params,
                              basePrice: params.basePrice ?? 4600
                            };
                            return {
                              ...p,
                              ohlcParams: ohlc
                            };
                          });
                        }}
                        className={`text-left p-2 rounded-lg border transition-all flex flex-col gap-1 min-h-[64px] group select-none cursor-pointer ${
                          isActive
                            ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.05)]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 text-zinc-350'
                        }`}
                      >
                        <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-yellow-400' : 'text-zinc-200 group-hover:text-yellow-500 transition-colors'}`}>
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-normal leading-normal line-clamp-3">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentAsset === 'Silver' && (
              <div className="flex flex-col gap-2 bg-slate-300/5 border border-slate-300/10 p-2.5 rounded-lg">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  🥈 Silver Market Scenario Presets
                </span>
                <p className="text-[10px] text-zinc-400">
                  Select a recurring macro/session behavior preset to instantly auto-configure the simulation engine parameters:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {listSilverPresetNames().map((key) => {
                    const preset = SILVER_PRESETS[key];
                    const isActive = isPresetActive(preset.params, params);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setDataSettings((p) => {
                            const ohlc = p.ohlcParams ? { ...p.ohlcParams } : { ...DEFAULT_OHLC_PARAMS };
                            ohlc['Silver'] = {
                              ...preset.params,
                              basePrice: params.basePrice ?? 32
                            };
                            return {
                              ...p,
                              ohlcParams: ohlc
                            };
                          });
                        }}
                        className={`text-left p-2 rounded-lg border transition-all flex flex-col gap-1 min-h-[64px] group select-none cursor-pointer ${
                          isActive
                            ? 'bg-slate-400/10 border-slate-400/40 text-slate-300 shadow-[0_0_12px_rgba(203,213,225,0.05)]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 text-zinc-350'
                        }`}
                      >
                        <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-slate-200' : 'text-zinc-200 group-hover:text-slate-300 transition-colors'}`}>
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-normal leading-normal line-clamp-3">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentAsset === 'Nasdaq100' && (
              <div className="flex flex-col gap-2 bg-cyan-500/5 border border-cyan-500/10 p-2.5 rounded-lg">
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                  📈 Nasdaq 100 Index Presets
                </span>
                <p className="text-[10px] text-zinc-400">
                  Select a tech index specific volatility/event regime preset to instantly overwrite simulation engine parameters:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {NASDAQ100_PRESET_NAMES.map((key) => {
                    const preset = NASDAQ100_PRESETS[key];
                    const isActive = isPresetActive(preset.params, params);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setDataSettings((p) => {
                            const ohlc = p.ohlcParams ? { ...p.ohlcParams } : { ...DEFAULT_OHLC_PARAMS };
                            ohlc['Nasdaq100'] = {
                              ...preset.params,
                              basePrice: params.basePrice ?? 22000
                            };
                            return {
                              ...p,
                              ohlcParams: ohlc
                            };
                          });
                        }}
                        className={`text-left p-2 rounded-lg border transition-all flex flex-col gap-1 min-h-[64px] group select-none cursor-pointer ${
                          isActive
                            ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.05)]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 text-zinc-350'
                        }`}
                      >
                        <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-cyan-400' : 'text-zinc-200 group-hover:text-cyan-400 transition-colors'}`}>
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-normal leading-normal line-clamp-3">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentAsset === 'Oil' && (
              <div className="flex flex-col gap-2 bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg">
                <span className="text-xs font-semibold text-amber-500 flex items-center gap-1.5">
                  🛢️ Crude Oil Market Presets
                </span>
                <p className="text-[10px] text-zinc-400">
                  Select a petroleum specific supply/demand sector regime preset to instantly overwrite simulation engine parameters:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {OIL_PRESET_NAMES.map((key) => {
                    const preset = OIL_PRESETS[key];
                    const isActive = isPresetActive(preset.params, params);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setDataSettings((p) => {
                            const ohlc = p.ohlcParams ? { ...p.ohlcParams } : { ...DEFAULT_OHLC_PARAMS };
                            ohlc['Oil'] = {
                              ...preset.params,
                              basePrice: params.basePrice ?? 85
                            };
                            return {
                              ...p,
                              ohlcParams: ohlc
                            };
                          });
                        }}
                        className={`text-left p-2 rounded-lg border transition-all flex flex-col gap-1 min-h-[64px] group select-none cursor-pointer ${
                          isActive
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.05)]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 text-zinc-350'
                        }`}
                      >
                        <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-amber-400' : 'text-zinc-200 group-hover:text-amber-400 transition-colors'}`}>
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-normal leading-normal line-clamp-3">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentAsset === 'USDJPY' && (
              <div className="flex flex-col gap-2 bg-red-500/5 border border-red-500/10 p-2.5 rounded-lg">
                <span className="text-xs font-semibold text-red-500 flex items-center gap-1.5">
                  🇺🇸🇯🇵 USD/JPY Presets
                </span>
                <p className="text-[10px] text-zinc-400">
                  Select a recurring macro/session behavior preset for USD/JPY:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {listUSDJPYPresetNames().map((key) => {
                    const preset = USDJPY_PRESETS[key];
                    const isActive = isPresetActive(preset.params, params);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setDataSettings((p) => {
                            const ohlc = p.ohlcParams ? { ...p.ohlcParams } : { ...DEFAULT_OHLC_PARAMS };
                            ohlc['USDJPY'] = {
                              ...preset.params,
                              basePrice: params.basePrice ?? 155
                            };
                            return {
                              ...p,
                              ohlcParams: ohlc
                            };
                          });
                        }}
                        className={`text-left p-2 rounded-lg border transition-all flex flex-col gap-1 min-h-[64px] group select-none cursor-pointer ${
                          isActive
                            ? 'bg-red-500/10 border-red-500/40 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.05)]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 text-zinc-350'
                        }`}
                      >
                        <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-red-400' : 'text-zinc-200 group-hover:text-red-400 transition-colors'}`}>
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-normal leading-normal line-clamp-3">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentAsset === 'GBPJPY' && (
              <div className="flex flex-col gap-2 bg-blue-500/5 border border-blue-500/10 p-2.5 rounded-lg">
                <span className="text-xs font-semibold text-blue-500 flex items-center gap-1.5">
                  🇬🇧🇯🇵 GBP/JPY Presets
                </span>
                <p className="text-[10px] text-zinc-400">
                  Select a recurring macro/session behavior preset for GBP/JPY:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {listGBPJPYPresetNames().map((key) => {
                    const preset = GBPJPY_PRESETS[key];
                    const isActive = isPresetActive(preset.params, params);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setDataSettings((p) => {
                            const ohlc = p.ohlcParams ? { ...p.ohlcParams } : { ...DEFAULT_OHLC_PARAMS };
                            ohlc['GBPJPY'] = {
                              ...preset.params,
                              basePrice: params.basePrice ?? 200
                            };
                            return {
                              ...p,
                              ohlcParams: ohlc
                            };
                          });
                        }}
                        className={`text-left p-2 rounded-lg border transition-all flex flex-col gap-1 min-h-[64px] group select-none cursor-pointer ${
                          isActive
                            ? 'bg-blue-500/10 border-blue-500/40 text-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.05)]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 text-zinc-350'
                        }`}
                      >
                        <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-blue-400' : 'text-zinc-200 group-hover:text-blue-400 transition-colors'}`}>
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-normal leading-normal line-clamp-3">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentAsset === 'EURJPY' && (
              <div className="flex flex-col gap-2 bg-indigo-500/5 border border-indigo-500/10 p-2.5 rounded-lg">
                <span className="text-xs font-semibold text-indigo-500 flex items-center gap-1.5">
                  🇪🇺🇯🇵 EUR/JPY Presets
                </span>
                <p className="text-[10px] text-zinc-400">
                  Select a recurring macro/session behavior preset for EUR/JPY:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {listEURJPYPresetNames().map((key) => {
                    const preset = EURJPY_PRESETS[key];
                    const isActive = isPresetActive(preset.params, params);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setDataSettings((p) => {
                            const ohlc = p.ohlcParams ? { ...p.ohlcParams } : { ...DEFAULT_OHLC_PARAMS };
                            ohlc['EURJPY'] = {
                              ...preset.params,
                              basePrice: params.basePrice ?? 170
                            };
                            return {
                              ...p,
                              ohlcParams: ohlc
                            };
                          });
                        }}
                        className={`text-left p-2 rounded-lg border transition-all flex flex-col gap-1 min-h-[64px] group select-none cursor-pointer ${
                          isActive
                            ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.05)]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 text-zinc-350'
                        }`}
                      >
                        <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-indigo-400' : 'text-zinc-200 group-hover:text-indigo-400 transition-colors'}`}>
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-normal leading-normal line-clamp-3">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentAsset === 'EURUSD' && (
              <div className="flex flex-col gap-2 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg">
                <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5">
                  🇪🇺🇺🇸 EUR/USD Presets
                </span>
                <p className="text-[10px] text-zinc-400">
                  Select a recurring macro/session behavior preset for EUR/USD:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {listEurUsdPresetNames().map((key) => {
                    const preset = EURUSD_PRESETS[key];
                    const isActive = isPresetActive(preset.params, params);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setDataSettings((p) => {
                            const ohlc = p.ohlcParams ? { ...p.ohlcParams } : { ...DEFAULT_OHLC_PARAMS };
                            ohlc['EURUSD'] = {
                              ...preset.params,
                              basePrice: params.basePrice ?? 1.085
                            };
                            return {
                              ...p,
                              ohlcParams: ohlc
                            };
                          });
                        }}
                        className={`text-left p-2 rounded-lg border transition-all flex flex-col gap-1 min-h-[64px] group select-none cursor-pointer ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.05)]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 text-zinc-350'
                        }`}
                      >
                        <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-emerald-400' : 'text-zinc-200 group-hover:text-emerald-400 transition-colors'}`}>
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-normal leading-normal line-clamp-3">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentAsset === 'AUDUSD' && (
              <div className="flex flex-col gap-2 bg-yellow-600/5 border border-yellow-600/10 p-2.5 rounded-lg">
                <span className="text-xs font-semibold text-yellow-600 flex items-center gap-1.5">
                  🇦🇺🇺🇸 AUD/USD Presets
                </span>
                <p className="text-[10px] text-zinc-400">
                  Select a recurring macro/session behavior preset for AUD/USD:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {AUDUSD_PRESET_NAMES.map((key) => {
                    const preset = AUDUSD_PRESETS[key];
                    const isActive = isPresetActive(preset.params, params);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setDataSettings((p) => {
                            const ohlc = p.ohlcParams ? { ...p.ohlcParams } : { ...DEFAULT_OHLC_PARAMS };
                            ohlc['AUDUSD'] = {
                              ...preset.params,
                              basePrice: params.basePrice ?? 0.67
                            };
                            return {
                              ...p,
                              ohlcParams: ohlc
                            };
                          });
                        }}
                        className={`text-left p-2 rounded-lg border transition-all flex flex-col gap-1 min-h-[64px] group select-none cursor-pointer ${
                          isActive
                            ? 'bg-yellow-600/10 border-yellow-600/40 text-yellow-600 shadow-[0_0_12px_rgba(202,138,4,0.05)]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 text-zinc-350'
                        }`}
                      >
                        <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-yellow-500' : 'text-zinc-200 group-hover:text-yellow-500 transition-colors'}`}>
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-normal leading-normal line-clamp-3">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentAsset === 'USDCAD' && (
              <div className="flex flex-col gap-2 bg-orange-600/5 border border-orange-600/10 p-2.5 rounded-lg">
                <span className="text-xs font-semibold text-orange-600 flex items-center gap-1.5">
                  🇺🇸🇨🇦 USD/CAD Presets
                </span>
                <p className="text-[10px] text-zinc-400">
                  Select a recurring macro/session behavior preset for USD/CAD:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {USDCAD_PRESET_NAMES.map((key) => {
                    const preset = USDCAD_PRESETS[key];
                    const isActive = isPresetActive(preset.params, params);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setDataSettings((p) => {
                            const ohlc = p.ohlcParams ? { ...p.ohlcParams } : { ...DEFAULT_OHLC_PARAMS };
                            ohlc['USDCAD'] = {
                              ...preset.params,
                              basePrice: params.basePrice ?? 1.36
                            };
                            return {
                              ...p,
                              ohlcParams: ohlc
                            };
                          });
                        }}
                        className={`text-left p-2 rounded-lg border transition-all flex flex-col gap-1 min-h-[64px] group select-none cursor-pointer ${
                          isActive
                            ? 'bg-orange-600/10 border-orange-600/40 text-orange-600 shadow-[0_0_12px_rgba(234,88,12,0.05)]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 text-zinc-350'
                        }`}
                      >
                        <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-orange-500' : 'text-zinc-200 group-hover:text-orange-500 transition-colors'}`}>
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-normal leading-normal line-clamp-3">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentAsset === 'EURCAD' && (
              <div className="flex flex-col gap-2 bg-pink-600/5 border border-pink-600/10 p-2.5 rounded-lg">
                <span className="text-xs font-semibold text-pink-600 flex items-center gap-1.5">
                  🇪🇺🇨🇦 EUR/CAD Presets
                </span>
                <p className="text-[10px] text-zinc-400">
                  Select a recurring macro/session behavior preset for EUR/CAD:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {EURCAD_PRESET_NAMES.map((key) => {
                    const preset = EURCAD_PRESETS[key];
                    const isActive = isPresetActive(preset.params, params);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setDataSettings((p) => {
                            const ohlc = p.ohlcParams ? { ...p.ohlcParams } : { ...DEFAULT_OHLC_PARAMS };
                            ohlc['EURCAD'] = {
                              ...preset.params,
                              basePrice: params.basePrice ?? 1.48
                            };
                            return {
                              ...p,
                              ohlcParams: ohlc
                            };
                          });
                        }}
                        className={`text-left p-2 rounded-lg border transition-all flex flex-col gap-1 min-h-[64px] group select-none cursor-pointer ${
                          isActive
                            ? 'bg-pink-600/10 border-pink-600/40 text-pink-500 shadow-[0_0_12px_rgba(219,39,119,0.05)]'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 text-zinc-350'
                        }`}
                      >
                        <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-pink-400' : 'text-zinc-200 group-hover:text-pink-400 transition-colors'}`}>
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-normal leading-normal line-clamp-3">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            {/* Base Price */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Base Price</span>
                <span className="font-mono text-cyan-400 font-bold">{params.basePrice?.toFixed(2) ?? '0.00'}</span>
              </div>
              <input 
                type="number"
                value={params.basePrice ?? 1000}
                onChange={(e) => updateParam('basePrice', parseFloat(e.target.value) || 1)}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-cyan-500 rounded px-2 py-1 text-xs font-mono text-zinc-300"
              />
            </div>

            {/* Seed */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Deterministic Seed</span>
                <span className="font-mono text-cyan-400 font-bold">{params.seed}</span>
              </div>
              <input 
                type="number"
                value={params.seed}
                onChange={(e) => updateParam('seed', parseInt(e.target.value) || 42)}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-cyan-500 rounded px-2 py-1 text-xs font-mono text-zinc-300"
              />
            </div>

            {/* Drift */}
            <div className="flex flex-col gap-1 col-span-2">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Trend Strength (Drift)</span>
                <span className="font-mono text-cyan-400">{params.drift.toFixed(5)} ({(params.drift * 100).toFixed(3)}%)</span>
              </div>
              <input 
                type="range"
                min="0"
                max="0.001"
                step="0.00001"
                value={params.drift}
                onChange={(e) => updateParam('drift', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-zinc-900 cursor-pointer h-1.5 rounded-lg"
              />
            </div>

            {/* Volatility */}
            <div className="flex flex-col gap-1 col-span-2">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Price Volatility</span>
                <span className="font-mono text-cyan-400">{params.volatility.toFixed(4)} ({(params.volatility * 100).toFixed(2)}%)</span>
              </div>
              <input 
                type="range"
                min="0.0001"
                max="0.01"
                step="0.0001"
                value={params.volatility}
                onChange={(e) => updateParam('volatility', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-zinc-900 cursor-pointer h-1.5 rounded-lg"
              />
            </div>

            {/* Wick Factor */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Wick Factor</span>
                <span className="font-mono text-cyan-400">{params.wick_factor ?? 0.3}</span>
              </div>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={params.wick_factor ?? 0.3}
                onChange={(e) => updateParam('wick_factor', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-zinc-900 cursor-pointer h-1 rounded"
              />
            </div>

            {/* High Low Noise */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Wick Extra Noise</span>
                <span className="font-mono text-cyan-400">{params.high_low_noise.toFixed(4)}</span>
              </div>
              <input 
                type="range"
                min="0"
                max="0.005"
                step="0.0001"
                value={params.high_low_noise}
                onChange={(e) => updateParam('high_low_noise', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-zinc-900 cursor-pointer h-1 rounded text-cyan-400"
              />
            </div>

            {/* Sideways Switch Prob */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Sideways Prob</span>
                <span className="font-mono text-cyan-400">{(params.side_ways_switch_prob * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={params.side_ways_switch_prob}
                onChange={(e) => updateParam('side_ways_switch_prob', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-zinc-900 cursor-pointer h-1 rounded"
              />
            </div>

            {/* Trend Switch Prob */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Trend Change Prob</span>
                <span className="font-mono text-cyan-400">{(params.trend_switch_prob * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={params.trend_switch_prob}
                onChange={(e) => updateParam('trend_switch_prob', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-zinc-900 cursor-pointer h-1 rounded"
              />
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 italic bg-zinc-900/40 p-1.5 rounded border border-zinc-900 flex flex-col gap-0.5 mt-0.5">
            <div>💡 Regime state alternates between Bull, Bear, & Sideways.</div>
            <div>👉 Time-series and live streaming feeds refresh instantly upon parameter adjustments.</div>
          </div>
        </div>
      );
    })()}

      <div className="border border-zinc-700/50 p-3 rounded-lg flex flex-col gap-4 mt-2">
        <div className="flex flex-wrap gap-4 border-b border-zinc-700/50 pb-2">
          <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider leading-6">Candlestick Charts</span>
          <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
            <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500" checked={dataSettings.showAlpha} onChange={(e) => setDataSettings(p => ({...p, showAlpha: e.target.checked}))} />
            Alpha (Primary)
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
            <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500" checked={dataSettings.showBeta} onChange={(e) => setDataSettings(p => ({...p, showBeta: e.target.checked}))} />
            Beta
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
            <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500" checked={dataSettings.showDelta} onChange={(e) => setDataSettings(p => ({...p, showDelta: e.target.checked}))} />
            Delta
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`flex flex-col gap-2 ${!dataSettings.showBeta ? 'opacity-50' : ''}`}>
            <span className="text-[10px] uppercase text-zinc-400 font-bold">Beta Aggregation</span>
            <AggregationInput 
              disabled={!dataSettings.showBeta}
              value={dataSettings.betaAggregateFactor}
              onChange={(val) => setDataSettings(p => ({ ...p, betaAggregateFactor: val }))}
              className="w-full"
            />
            <p className="text-[10px] text-zinc-500">Multiplies Alpha timeframe</p>
          </div>

          <div className={`flex flex-col gap-2 border-l border-zinc-700/50 pl-4 ${!dataSettings.showDelta ? 'opacity-50' : ''}`}>
            <span className="text-[10px] uppercase text-zinc-400 font-bold">Delta Aggregation</span>
            <div className="flex gap-2">
              <select 
                disabled={!dataSettings.showDelta}
                value={dataSettings.deltaAggregateSource}
                onChange={(e) => setDataSettings(p => ({ ...p, deltaAggregateSource: e.target.value as any }))}
                className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 flex-1"
              >
                <option value="alpha">Alpha Base</option>
                <option value="beta" disabled={!dataSettings.showBeta}>Beta Base</option>
              </select>
              <AggregationInput 
                disabled={!dataSettings.showDelta}
                value={dataSettings.deltaAggregateFactor}
                onChange={(val) => setDataSettings(p => ({ ...p, deltaAggregateFactor: val }))}
                className="w-20"
              />
            </div>
            <p className="text-[10px] text-zinc-500">Multiplies selected base timeframe</p>
          </div>
        </div>
      </div>

      {/* CSV Export Data Section */}
      <div className="border border-zinc-700/50 p-3 rounded-lg flex flex-col gap-3 mt-2 bg-zinc-950/20">
        <div className="flex items-center gap-1.5 border-b border-zinc-700/50 pb-2">
          <FileSpreadsheet size={16} className="text-cyan-400" />
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Export Simulated Data to CSV
          </span>
        </div>
        
        <p className="text-[10px] text-zinc-450 leading-normal">
          Save active simulated or imported high-frequency candlestick streams out into normalized, standard-compliant CSV files. These files contain values of open, high, low, close, and volume, structured completely for direct compatibility with the CSV Data Source importer.
        </p>

        <div className="flex flex-col gap-2 mt-1">
          {/* Alpha Row */}
          <div className="flex items-center justify-between bg-zinc-900/40 p-2 rounded border border-zinc-800 hover:border-zinc-750 transition-colors">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-450"></span>
                Alpha (Primary Base)
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                Asset: {currentAsset} | Timeframe: {formatInterval(alphaInterval)} | Preset: {presetLabel || 'None'}
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">
                {activeAlpha.length > 0 ? `${activeAlpha.length} candle records active` : 'No records generated'}
              </span>
            </div>
            <button
              onClick={() => saveDataIntoCsv(activeAlpha, currentAsset, 'alpha', formatInterval(alphaInterval), presetLabel)}
              disabled={activeAlpha.length === 0}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-950 hover:bg-cyan-900 text-cyan-400 disabled:opacity-45 disabled:pointer-events-none rounded duration-150 border border-cyan-800/40"
            >
              <Download size={13} />
              Save .csv
            </button>
          </div>

          {/* Beta Row */}
          <div className={`flex items-center justify-between bg-zinc-900/40 p-2 rounded border border-zinc-800 hover:border-zinc-750 transition-colors ${!dataSettings.showBeta ? 'opacity-50' : ''}`}>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-450"></span>
                Beta (Aggregated Multiplier)
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                Asset: {currentAsset} | Timeframe: {formatInterval(betaInterval)} (Aggr: {dataSettings.betaAggregateFactor}x)
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">
                {activeBeta.length > 0 ? `${activeBeta.length} candle records aggregated` : 'Aggregation not enabled'}
              </span>
            </div>
            <button
              onClick={() => saveDataIntoCsv(activeBeta, currentAsset, 'beta', formatInterval(betaInterval), presetLabel)}
              disabled={!dataSettings.showBeta || activeBeta.length === 0}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-purple-950 hover:bg-purple-900 text-purple-400 disabled:opacity-45 disabled:pointer-events-none rounded duration-150 border border-purple-800/40"
            >
              <Download size={13} />
              Save .csv
            </button>
          </div>

          {/* Delta Row */}
          <div className={`flex items-center justify-between bg-zinc-900/40 p-2 rounded border border-zinc-800 hover:border-zinc-750 transition-colors ${!dataSettings.showDelta ? 'opacity-50' : ''}`}>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-450"></span>
                Delta (Multi-Interval Layer)
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                Asset: {currentAsset} | Timeframe: {formatInterval(deltaInterval)} (Aggr: {dataSettings.deltaAggregateFactor}x of {dataSettings.deltaAggregateSource})
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">
                {activeDelta.length > 0 ? `${activeDelta.length} candle records aggregated` : 'Layer not enabled'}
              </span>
            </div>
            <button
              onClick={() => saveDataIntoCsv(activeDelta, currentAsset, 'delta', formatInterval(deltaInterval), presetLabel)}
              disabled={!dataSettings.showDelta || activeDelta.length === 0}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-950 hover:bg-emerald-900 text-emerald-400 disabled:opacity-45 disabled:pointer-events-none rounded duration-150 border border-emerald-800/40"
            >
              <Download size={13} />
              Save .csv
            </button>
          </div>
        </div>
      </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
