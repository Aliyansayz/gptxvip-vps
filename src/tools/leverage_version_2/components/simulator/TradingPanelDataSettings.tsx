import React, { useState } from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { getBaseInterval, formatInterval } from '../../functions/api/rules/dataSourceRules';
import { AssetSlider } from '../../../../components/homeMainView/AssetSlider';
import { AssetType } from '../../../../components/homeMainView/simulatedDataGenerator';
import { CsvFileInputMode } from '../../functions/api/data_source/csvFileInputmode';
import { OHLCSimulationParams, DEFAULT_OHLC_PARAMS } from '../../functions/api/data_source/simulationDataOhlcParameter';
import { GOLD_ONLY_PRESETS, GoldPresetName, GOLD_PRESET_NAMES } from '../../functions/api/data_source/goldPresetAdjustments';
import { NASDAQ100_PRESETS, NasdaqPresetName, NASDAQ100_PRESET_NAMES } from '../../functions/api/data_source/nasdaq100SimulationPresets';
import { OIL_PRESETS, OilPresetName, OIL_PRESET_NAMES } from '../../functions/api/data_source/oilSimulationPresets';

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

export const TradingPanelDataSettings: React.FC = () => {
  const { dataSettings, setDataSettings } = useIndicatorsStore();
  const [showSimParams, setShowSimParams] = useState(false);

  const alphaInterval = getBaseInterval(dataSettings.simulationMode);
  const betaInterval = alphaInterval * dataSettings.betaAggregateFactor;
  const deltaInterval = (dataSettings.deltaAggregateSource === 'beta' ? betaInterval : alphaInterval) * dataSettings.deltaAggregateFactor;

  const currentAsset = dataSettings.asset as string;
  const ohlcParams = dataSettings.ohlcParams || DEFAULT_OHLC_PARAMS;
  const params = ohlcParams[currentAsset] || DEFAULT_OHLC_PARAMS[currentAsset] || DEFAULT_OHLC_PARAMS['Anonymous'];

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

  return (
    <div className="flex flex-col gap-3 text-zinc-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">Data Settings</span>
        <div className="flex gap-3 text-[10px] bg-zinc-800/50 px-2 py-1 rounded border border-zinc-700">
           <span className="text-zinc-300"><span className="text-cyan-400 font-bold">α</span> {formatInterval(alphaInterval)}</span>
           <span className="text-zinc-300"><span className="text-purple-400 font-bold">β</span> {formatInterval(betaInterval)}</span>
           <span className="text-zinc-300"><span className="text-emerald-400 font-bold">δ</span> {formatInterval(deltaInterval)}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
        {dataSettings.dataSourceType !== 'csv' ? (
          <>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-zinc-300">Asset Selection</span>
              <AssetSlider 
                assetFilters={['Anonymous', 'Gold', 'Silver', 'Oil', 'Nasdaq100']}
                value={dataSettings.asset as AssetType}
                onChange={handleAssetChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-zinc-300">Timeframe</span>
              <select 
                value={dataSettings.timeframe}
                onChange={handleTimeframeChange}
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-2 focus:ring-cyan-500 focus:border-cyan-500 h-9"
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
        ) : (
          <div className="col-span-2">
            <CsvFileInputMode />
          </div>
        )}
      </div>

      {dataSettings.dataSourceType !== 'csv' && (
        <div className="flex items-center justify-between mt-1 pt-1 border-t border-zinc-850">
          <button 
             onClick={() => setShowSimParams(!showSimParams)}
             className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
          >
            <span>{showSimParams ? '▼ Hide' : '▶ Show'} Market OHLC Simulation Parameters</span>
          </button>
          
          <button 
             onClick={() => setDataSettings(p => ({ ...p, dataSourceType: 'csv' }))}
             className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-350 px-2.5 py-1 rounded border border-zinc-700/50 transition-colors"
          >
            CSV Import Mode
          </button>
        </div>
      )}

      {/* Embedded High-Quality Market Mock Simulation Parameters UI */}
      {dataSettings.dataSourceType !== 'csv' && showSimParams && (() => {
        const activePresetKey = currentAsset === 'Gold'
          ? (Object.keys(GOLD_ONLY_PRESETS) as GoldPresetName[]).find(
              (key) => isPresetActive(GOLD_ONLY_PRESETS[key].params, params)
            )
          : currentAsset === 'Nasdaq100'
            ? (Object.keys(NASDAQ100_PRESETS) as NasdaqPresetName[]).find(
                (key) => isPresetActive(NASDAQ100_PRESETS[key].params, params)
              )
            : currentAsset === 'Oil'
              ? (Object.keys(OIL_PRESETS) as OilPresetName[]).find(
                  (key) => isPresetActive(OIL_PRESETS[key].params, params)
                )
              : undefined;

        const presetLabel = activePresetKey
          ? currentAsset === 'Gold'
            ? GOLD_ONLY_PRESETS[activePresetKey as GoldPresetName].label
            : currentAsset === 'Nasdaq100'
              ? NASDAQ100_PRESETS[activePresetKey as NasdaqPresetName].label
              : OIL_PRESETS[activePresetKey as OilPresetName].label
          : undefined;

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
    </div>
  );
};
