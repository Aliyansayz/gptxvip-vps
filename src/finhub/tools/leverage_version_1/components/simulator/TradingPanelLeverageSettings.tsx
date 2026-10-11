import React, { useState } from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { CONTRACT_SIZE_GOLD } from '../../functions/api/position_sizing/leveragedPositionSizeMetals';
import { evaluateDynamicPositionSize, autoAdjustMargin, autoAdjustPriceLiquidation } from '../../functions/api/position_sizing/leveragedDynamicPositionSize';
import { AlertTriangle, Wand2 } from 'lucide-react';

export const TradingPanelLeverageSettings: React.FC = () => {
  const { leverageSettings, setLeverageSettings } = useIndicatorsStore();
  const [mockPrice] = useState(2000); // Standard Gold placeholder price for evaluation preview

  const isDynamic = leverageSettings.positionSizingType === 'dynamic_margin';

  // Preview evaluation
  const preview = evaluateDynamicPositionSize(
    leverageSettings.balance,
    mockPrice,
    leverageSettings.leverage,
    leverageSettings.dynamicMarginType || 'percentage',
    leverageSettings.dynamicMarginType === 'value' ? (leverageSettings.dynamicMarginValue || 100) : (leverageSettings.dynamicMarginPercentage || 5),
    leverageSettings.useExplicitLiquidationPips ? leverageSettings.explicitLiquidationPips : undefined,
    CONTRACT_SIZE_GOLD
  );

  const handleAutoAdjustMargin = () => {
    const currentMarginValue = leverageSettings.dynamicMarginType === 'percentage' 
      ? leverageSettings.balance * ((leverageSettings.dynamicMarginPercentage || 0) / 100)
      : leverageSettings.dynamicMarginValue || 0;

    const newMargin = autoAdjustMargin(
      'Gold', 
      leverageSettings.leverage, 
      leverageSettings.balance, 
      currentMarginValue, 
      leverageSettings.useExplicitLiquidationPips ? leverageSettings.explicitLiquidationPips : undefined,
      mockPrice
    );

    setLeverageSettings(p => ({ 
      ...p, 
      dynamicMarginType: 'value', 
      dynamicMarginValue: Math.ceil(newMargin)
    }));
  };

  const handleAutoAdjustPips = () => {
    const currentMarginValue = leverageSettings.dynamicMarginType === 'percentage' 
      ? leverageSettings.balance * ((leverageSettings.dynamicMarginPercentage || 0) / 100)
      : leverageSettings.dynamicMarginValue || 0;
    
    const newPips = autoAdjustPriceLiquidation(
      'Gold',
      leverageSettings.leverage,
      leverageSettings.balance,
      currentMarginValue,
      leverageSettings.explicitLiquidationPips || preview.pipsToLiquidation
    );

    setLeverageSettings(p => ({ 
      ...p, 
      useExplicitLiquidationPips: true,
      explicitLiquidationPips: Math.floor(newPips) > 0 ? Math.floor(newPips) : 1
    }));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">Leverage Mode</span>
        <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
          <input 
            type="checkbox" 
            className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500" 
            checked={leverageSettings.enabled} 
            onChange={(e) => setLeverageSettings(p => ({...p, enabled: e.target.checked}))} 
          />
          Enable Mode
        </label>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 border border-zinc-700/50 p-3 rounded-lg ${!leverageSettings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase text-zinc-400 font-bold">Position Sizing Type</span>
          <div className="flex bg-zinc-900 border border-zinc-700 rounded-md overflow-hidden">
            <button
              onClick={() => setLeverageSettings(p => ({ ...p, positionSizingType: 'fix' }))}
              className={`flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase ${!isDynamic ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Fixed Lot
            </button>
            <button
              onClick={() => setLeverageSettings(p => ({ ...p, positionSizingType: 'dynamic_margin' }))}
              className={`flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase ${isDynamic ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Dynamic Margin
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase text-zinc-400 font-bold">Initial Balance</span>
          <div className="flex gap-2">
            <select 
              value={leverageSettings.currency}
              onChange={(e) => setLeverageSettings(p => ({ ...p, currency: e.target.value as any }))}
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 w-16"
            >
              <option value="$">$</option>
              <option value="€">€</option>
            </select>
            <input 
              type="number" 
              value={leverageSettings.balance} 
              onChange={(e) => setLeverageSettings(p => ({ ...p, balance: parseFloat(e.target.value) || 0 }))} 
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 flex-1"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <span className="text-[10px] uppercase text-zinc-400 font-bold">Leverage</span>
          <select 
            value={leverageSettings.leverage}
            onChange={(e) => setLeverageSettings(p => ({ ...p, leverage: parseInt(e.target.value) }))}
            className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 w-full"
          >
            <option value="1">1:1</option>
            <option value="10">1:10</option>
            <option value="50">1:50</option>
            <option value="100">1:100</option>
            <option value="500">1:500</option>
          </select>
        </div>

        {!isDynamic ? (
          <div className="flex flex-col gap-2 md:col-span-2">
            <span className="text-[10px] uppercase text-zinc-400 font-bold">Position Size (Lots)</span>
            <div className="flex gap-2 items-center">
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                value={leverageSettings.positionSize} 
                onChange={(e) => setLeverageSettings(p => ({ ...p, positionSize: Math.max(0.01, parseFloat(e.target.value) || 0) }))} 
                className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 flex-1"
              />
              <span className="text-[10px] text-zinc-500 uppercase">Fixed</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-zinc-400 font-bold flex items-center gap-1">
                  Liquidation Margin
                  {preview.warningMargin && <AlertTriangle size={12} className="text-yellow-500" />}
                </span>
                {preview.warningMargin && (
                  <button 
                    onClick={handleAutoAdjustMargin}
                    className="p-1 text-zinc-500 hover:text-cyan-400 hover:bg-zinc-800 rounded transition-colors"
                    title="Auto Adjust Margin to fit minimum lot size"
                  >
                    <Wand2 size={12} />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={leverageSettings.dynamicMarginType}
                  onChange={(e) => setLeverageSettings(p => ({ ...p, dynamicMarginType: e.target.value as 'percentage' | 'value' }))}
                  className={`bg-zinc-900 border ${preview.warningMargin ? 'border-yellow-500/50' : 'border-zinc-700'} text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 w-24`}
                >
                  <option value="percentage">% of Bal</option>
                  <option value="value">Fixed Amt</option>
                </select>
                {leverageSettings.dynamicMarginType === 'percentage' ? (
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={leverageSettings.dynamicMarginPercentage}
                    onChange={(e) => setLeverageSettings(p => ({ ...p, dynamicMarginPercentage: parseFloat(e.target.value) || 0 }))}
                    className={`bg-zinc-900 border ${preview.warningMargin ? 'border-yellow-500/50' : 'border-zinc-700'} text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 flex-1`}
                  />
                ) : (
                  <input
                    type="number"
                    min="1"
                    value={leverageSettings.dynamicMarginValue}
                    onChange={(e) => setLeverageSettings(p => ({ ...p, dynamicMarginValue: parseFloat(e.target.value) || 0 }))}
                    className={`bg-zinc-900 border ${preview.warningMargin ? 'border-yellow-500/50' : 'border-zinc-700'} text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 flex-1`}
                  />
                )}
              </div>
              {preview.warningMargin && <span className="text-[10px] text-yellow-500">{preview.warningMargin}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-zinc-400 font-bold flex items-center gap-1">
                  Price of Liquidation (Pips)
                  {preview.warningPips && <AlertTriangle size={12} className="text-yellow-500" />}
                </span>
                {preview.warningPips && (
                  <button 
                    onClick={handleAutoAdjustPips}
                    className="p-1 text-zinc-500 hover:text-cyan-400 hover:bg-zinc-800 rounded transition-colors"
                    title="Auto Adjust Pips to fit minimum lot size"
                  >
                    <Wand2 size={12} />
                  </button>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500"
                  checked={leverageSettings.useExplicitLiquidationPips}
                  onChange={(e) => setLeverageSettings(p => ({ ...p, useExplicitLiquidationPips: e.target.checked }))}
                />
                <input
                  type="number"
                  min="1"
                  disabled={!leverageSettings.useExplicitLiquidationPips}
                  value={leverageSettings.explicitLiquidationPips}
                  onChange={(e) => setLeverageSettings(p => ({ ...p, explicitLiquidationPips: Math.max(1, parseFloat(e.target.value) || 0) }))}
                  className={`bg-zinc-900 border ${preview.warningPips ? 'border-yellow-500/50' : 'border-zinc-700'} text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 flex-1 ${!leverageSettings.useExplicitLiquidationPips ? 'opacity-50' : ''}`}
                  placeholder="e.g. 50"
                />
              </div>
              {preview.warningPips && <span className="text-[10px] text-yellow-500">{preview.warningPips}</span>}
            </div>
          </>
        )}

        {isDynamic && (
          <div className="md:col-span-2 mt-1">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded p-2 text-[10px] flex flex-col gap-2 text-zinc-400">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-zinc-500">Max Margin Allowed</span>
                  <span className="text-cyan-400 font-mono">{leverageSettings.currency}{preview.maxMarginAllowed.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500">Lot Size (@ {mockPrice})</span>
                  <span className="text-cyan-400 font-mono">{preview.possibleLotSize.toFixed(2)} Lots</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500">Liq. Loss Amount</span>
                  <span className="text-rose-400 font-mono">{leverageSettings.currency}{preview.liquidationLossAmount.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500">{leverageSettings.useExplicitLiquidationPips ? 'Explicit Pips' : 'Calc. Liq. Pips'}</span>
                  <span className="text-rose-400 font-mono">{preview.pipsToLiquidation.toFixed(1)} Pips</span>
                </div>
              </div>
              {leverageSettings.useExplicitLiquidationPips && (
                <div className="text-[10px] text-zinc-500 border-t border-zinc-800 pt-1 mt-1">
                  When explicit pips are set, the lot size is calculated based on exactly hitting the maximum margin allowed upon hitting the specified pips.
                </div>
              )}
            </div>
          </div>
        )}

        {!isDynamic && (
          <div className="flex flex-col gap-2 md:col-span-2">
            <span className="text-[10px] uppercase text-zinc-400 font-bold">Contract Size</span>
            <div className="bg-zinc-800/50 border border-zinc-700 text-zinc-400 text-xs rounded-md px-2 py-1.5 flex items-center justify-between">
               <span>{CONTRACT_SIZE_GOLD} oz (Gold)</span>
               <span className="text-[10px] text-zinc-500">Info Only</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-tight">1.0 lot * $1 move = +/- $100</p>
          </div>
        )}
      </div>
    </div>
  );
};

