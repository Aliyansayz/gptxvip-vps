import React from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { getBaseInterval, formatInterval } from '../../functions/api/rules/dataSourceRules';
import { AssetSlider } from '../../../../homeMainView/AssetSlider';
import { AssetType, generateInitialCandles } from '../../../../homeMainView/simulatedDataGenerator';

export const TradingPanelDataSettings: React.FC = () => {
  const { dataSettings, setDataSettings } = useIndicatorsStore();

  const alphaInterval = getBaseInterval(dataSettings.simulationMode);
  const betaInterval = alphaInterval * dataSettings.betaAggregateFactor;
  const deltaInterval = (dataSettings.deltaAggregateSource === 'beta' ? betaInterval : alphaInterval) * dataSettings.deltaAggregateFactor;

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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">Data Settings</span>
        <div className="flex gap-3 text-[10px] bg-zinc-800/50 px-2 py-1 rounded border border-zinc-700">
           <span className="text-zinc-300"><span className="text-cyan-400 font-bold">α</span> {formatInterval(alphaInterval)}</span>
           <span className="text-zinc-300"><span className="text-purple-400 font-bold">β</span> {formatInterval(betaInterval)}</span>
           <span className="text-zinc-300"><span className="text-emerald-400 font-bold">δ</span> {formatInterval(deltaInterval)}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-zinc-300">Asset Selection</span>
          <AssetSlider 
            assetFilters={['Anonymous', 'Gold', 'Silver', 'Oil']}
            value={dataSettings.asset}
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
      </div>

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
            <select 
              disabled={!dataSettings.showBeta}
              value={dataSettings.betaAggregateFactor}
              onChange={(e) => setDataSettings(p => ({ ...p, betaAggregateFactor: parseInt(e.target.value) }))}
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 w-full"
            >
              <option value="1">1x (Off)</option>
              <option value="2">2x</option>
              <option value="3">3x</option>
              <option value="4">4x</option>
              <option value="5">5x</option>
              <option value="10">10x</option>
            </select>
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
              <select 
                disabled={!dataSettings.showDelta}
                value={dataSettings.deltaAggregateFactor}
                onChange={(e) => setDataSettings(p => ({ ...p, deltaAggregateFactor: parseInt(e.target.value) }))}
                className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 w-20"
              >
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="3">3x</option>
                <option value="4">4x</option>
                <option value="5">5x</option>
                <option value="10">10x</option>
              </select>
            </div>
            <p className="text-[10px] text-zinc-500">Multiplies selected base timeframe</p>
          </div>
        </div>
      </div>
    </div>
  );
};
