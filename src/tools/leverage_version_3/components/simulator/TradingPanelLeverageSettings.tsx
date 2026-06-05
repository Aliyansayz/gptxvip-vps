import React, { useState, useMemo } from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { CONTRACT_SIZE_GOLD, getContractSize } from '../../functions/api/position_sizing/leveragedPositionSizeMetals';
import { pipsToPrice, priceToPips } from '../../functions/api/middleware/pipsTranslation';
import { evaluateDynamicPositionSize, autoAdjustMargin, autoAdjustPriceLiquidation } from '../../functions/api/position_sizing/leveragedDynamicPositionSize';
import { AlertTriangle, Wand2, Info } from 'lucide-react';
import { LEVERAGE_ARCHITECTURE_INFO } from '../../functions/api/leveragedAccount/leverageType';
import { Ohlc, calculateATR } from '../../functions/api/indicators/baseline';

export const TradingPanelLeverageSettings: React.FC<{ alphaData?: Ohlc[] }> = ({ alphaData }) => {
  const { leverageSettings, setLeverageSettings, dataSettings, tradingConfig, indicatorSettings } = useIndicatorsStore();
  const [mockPrice] = useState(2000); // Standard Gold placeholder price for evaluation preview

  const isFixed = leverageSettings.positionSizingType === 'fix';
  const isDynamicMargin = leverageSettings.positionSizingType === 'dynamic_margin';
  const isDynamicRisk = leverageSettings.positionSizingType === 'dynamic_risk_per_pip';
  const isDynamicRiskAtr = leverageSettings.positionSizingType === 'dynamic_risk_atr_pips';

  // Attempt to mock actual ATR pips from current data if avail
  const isSlAtrConfigured = tradingConfig.useStopLoss && indicatorSettings?.stopLossIndicator;
  const isUsingCustomAtrPips = !isSlAtrConfigured || leverageSettings.useExplicitLiquidationPips === true;

  const currentSlAtrPips = useMemo(() => {
    if (!alphaData || alphaData.length === 0 || !isSlAtrConfigured || isUsingCustomAtrPips) return 0;
    // Get last N values for a quick calc (to not freeze UI)
    const slPeriod = indicatorSettings.stopLossIndicator.period || 10;
    const sliceData = alphaData.slice(-slPeriod - 10);
    const atrs = calculateATR(sliceData, slPeriod);
    const lastAtr = Math.max(0, atrs[atrs.length - 1] || 0) * (indicatorSettings.stopLossIndicator.multiplier || 3.0);
    const pips = priceToPips(lastAtr, dataSettings.asset, sliceData[sliceData.length - 1].close);
    return Math.floor(pips * 10) / 10;
  }, [alphaData, isSlAtrConfigured, isUsingCustomAtrPips, dataSettings.asset, indicatorSettings?.stopLossIndicator]);

  // Preview evaluation
  const preview = evaluateDynamicPositionSize(
    leverageSettings.balance,
    mockPrice,
    leverageSettings.leverage,
    leverageSettings.dynamicMarginType || 'percentage',
    leverageSettings.dynamicMarginType === 'value' ? (leverageSettings.dynamicMarginValue || 100) : (leverageSettings.dynamicMarginPercentage || 5),
    leverageSettings.useExplicitLiquidationPips ? leverageSettings.explicitLiquidationPips : undefined,
    getContractSize(dataSettings.asset),
    dataSettings.asset
  );

  const riskPerPipPreview = (() => {
    const priceOf1Pip = pipsToPrice(1, dataSettings.asset, mockPrice);
    const risk = leverageSettings.dynamicRiskPerPipValue || 1;
    const exactLotSize = risk / (priceOf1Pip * getContractSize(dataSettings.asset));
    let lotSize = Math.max(0, Math.floor(exactLotSize * 100) / 100);
    
    const requiredMargin = (mockPrice * lotSize * getContractSize(dataSettings.asset)) / leverageSettings.leverage;
    if (requiredMargin > leverageSettings.balance) {
      lotSize = Math.floor(((leverageSettings.balance * leverageSettings.leverage) / (mockPrice * getContractSize(dataSettings.asset))) * 100) / 100;
    }

    let pipsToLiquidation = 0;
    if(lotSize > 0) {
      const priceMove = leverageSettings.balance / (lotSize * getContractSize(dataSettings.asset));
      pipsToLiquidation = priceToPips(priceMove, dataSettings.asset, mockPrice);
    }
    
    return {
      possibleLotSize: lotSize,
      pipsToLiquidation,
      warning: lotSize < 0.01 ? "Risk per pip is too low to meet 0.01 min lot size. Increase risk/pip." : undefined
    };
  })();

  const riskAtrPipsPreview = (() => {
    let mockAtrPips = isUsingCustomAtrPips ? (leverageSettings.explicitLiquidationPips || 20) : currentSlAtrPips;
    if (mockAtrPips <= 0) mockAtrPips = 50; // hard fallback

    const riskPercentage = leverageSettings.dynamicRiskAtrPipsPercentage || 2;
    const maxTolerableLoss = leverageSettings.balance * (riskPercentage / 100);
    const riskPerPip = maxTolerableLoss / mockAtrPips;
    const priceOf1Pip = pipsToPrice(1, dataSettings.asset, mockPrice);
    
    const exactLotSize = riskPerPip / (priceOf1Pip * getContractSize(dataSettings.asset));
    let lotSize = Math.max(0, Math.floor(exactLotSize * 100) / 100);
    
    const requiredMargin = (mockPrice * lotSize * getContractSize(dataSettings.asset)) / leverageSettings.leverage;
    if (requiredMargin > leverageSettings.balance) {
      lotSize = Math.floor(((leverageSettings.balance * leverageSettings.leverage) / (mockPrice * getContractSize(dataSettings.asset))) * 100) / 100;
    }

    let pipsToLiquidation = 0;
    if(lotSize > 0) {
      const priceMove = leverageSettings.balance / (lotSize * getContractSize(dataSettings.asset));
      pipsToLiquidation = priceToPips(priceMove, dataSettings.asset, mockPrice);
    }
    
    return {
      possibleLotSize: lotSize,
      targetLossAmount: maxTolerableLoss,
      mockAtrPips,
      pipsToLiquidation,
      warning: lotSize < 0.01 ? `Risk % is too low to meet 0.01 min lot size for ${mockAtrPips.toFixed(1)}-pip ATR.` : undefined
    };
  })();

  const handleAutoAdjustMargin = () => {
    const currentMarginValue = leverageSettings.dynamicMarginType === 'percentage' 
      ? leverageSettings.balance * ((leverageSettings.dynamicMarginPercentage || 0) / 100)
      : leverageSettings.dynamicMarginValue || 0;

    const newMargin = autoAdjustMargin(
      dataSettings.asset, 
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
      dataSettings.asset,
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

  const leverageTypeInfo = LEVERAGE_ARCHITECTURE_INFO[leverageSettings.leverageType || 'CROSS_MARGIN'];

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
        
        <div className="flex flex-col gap-2 md:col-span-2">
          <span className="text-[10px] uppercase text-zinc-400 font-bold">Leverage Type Account</span>
          <select 
            value={leverageSettings.leverageType || 'CROSS_MARGIN'}
            onChange={(e) => setLeverageSettings(p => ({ ...p, leverageType: e.target.value as any }))}
            className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 w-full"
          >
            <option value="CROSS_MARGIN">Cross Margin</option>
            <option value="ISOLATED_MARGIN">Isolated Margin</option>
          </select>
          {leverageTypeInfo && (
            <div className="flex gap-2 items-start bg-cyan-900/10 border border-cyan-800/30 p-2 rounded-md mt-1">
              <Info className="text-cyan-500 w-3 h-3 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-cyan-400 font-semibold">{leverageTypeInfo.title}</span>
                <span className="text-[10px] text-zinc-400 leading-tight">{leverageTypeInfo.description}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <span className="text-[10px] uppercase text-zinc-400 font-bold">Position Sizing Type</span>
          <div className="flex bg-zinc-900 border border-zinc-700/50 rounded-md overflow-hidden flex-wrap md:flex-nowrap p-0.5 gap-0.5">
            <button
              onClick={() => setLeverageSettings(p => ({ ...p, positionSizingType: 'fix' }))}
              className={`flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase rounded-sm transition-all ${leverageSettings.positionSizingType === 'fix' ? 'bg-cyan-600 text-white shadow shadow-cyan-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
            >
              Fixed Lot
            </button>
            <button
              onClick={() => setLeverageSettings(p => ({ ...p, positionSizingType: 'dynamic_margin' }))}
              className={`flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase rounded-sm transition-all ${leverageSettings.positionSizingType === 'dynamic_margin' ? 'bg-cyan-600 text-white shadow shadow-cyan-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
            >
              Dynamic Margin
            </button>
            <button
              onClick={() => setLeverageSettings(p => ({ ...p, positionSizingType: 'dynamic_risk_per_pip' }))}
              className={`flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase rounded-sm transition-all ${leverageSettings.positionSizingType === 'dynamic_risk_per_pip' ? 'bg-cyan-600 text-white shadow shadow-cyan-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
            >
              Risk/Pip
            </button>
            <button
              onClick={() => setLeverageSettings(p => ({ ...p, positionSizingType: 'dynamic_risk_atr_pips' }))}
              className={`flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase rounded-sm transition-all ${leverageSettings.positionSizingType === 'dynamic_risk_atr_pips' ? 'bg-purple-600 text-white shadow shadow-purple-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
              title="Risk by ATR Pips (SL/Liquidation based on Volatility)"
            >
              Risk ATR Pips
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

        {isFixed && (
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
        )}

        {isDynamicMargin && (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-zinc-400 font-bold flex items-center gap-1 title" title="This controls the exact % of balance or value you want to risk for the trade. If trade hits stop loss or liquidation pips, you lose exactly this amount.">
                  Risk / Liquidation Margin
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
            
            <div className="flex gap-2 items-start bg-blue-900/10 border border-blue-800/30 p-2 rounded-md mt-1 md:col-span-2">
              <Info className="text-blue-500 w-3 h-3 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-400 font-semibold">How Risk is Controlled</span>
                <span className="text-[10px] text-zinc-400 leading-tight mt-1">
                  By specifying a <strong>Risk/Liquidation Margin</strong> (e.g. 5%) and the <strong>Price of Liquidation (Pips)</strong>, the simulator sizes your trade so that you risk exactly that % of your balance if the trade moves against you by those pips.
                  <br />
                  <br />
                  <span>The maximum allowed margin for a single trade is: <strong>{leverageSettings.currency}{(leverageSettings.balance).toFixed(2)}</strong> (Full Balance).</span>
                </span>
              </div>
            </div>
          </>
        )}

        {isDynamicRisk && (
          <div className="flex flex-col gap-2 md:col-span-2">
            <span className="text-[10px] uppercase text-zinc-400 font-bold flex items-center gap-1 title">
              Allowed Risk Per Pip
              {riskPerPipPreview.warning && <AlertTriangle size={12} className="text-yellow-500" />}
            </span>
            <div className="flex gap-2 items-center">
              <div className="flex gap-2 items-center flex-1">
                <span className="text-xs text-zinc-400 px-2">{leverageSettings.currency}</span>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={leverageSettings.dynamicRiskPerPipValue ?? 1} 
                  onChange={(e) => setLeverageSettings(p => ({ ...p, dynamicRiskPerPipValue: Math.max(0, parseFloat(e.target.value) || 0) }))} 
                  className={`bg-zinc-900 border ${riskPerPipPreview.warning ? 'border-yellow-500/50' : 'border-zinc-700'} text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 flex-1`}
                />
              </div>
              <span className="text-[10px] text-zinc-500 uppercase">/ per Pip loss</span>
            </div>
            {riskPerPipPreview.warning && <span className="text-[10px] text-yellow-500">{riskPerPipPreview.warning}</span>}
          </div>
        )}

        {isDynamicRiskAtr && (
          <div className="flex flex-col gap-2 md:col-span-2">
            <span className="text-[10px] uppercase text-zinc-400 font-bold flex items-center gap-1 title">
              Max Tolerable Loss (% of Balance)
              {riskAtrPipsPreview.warning && <AlertTriangle size={12} className="text-yellow-500" />}
            </span>
            <div className="flex gap-2 items-center">
              <div className="flex gap-2 items-center flex-1">
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={leverageSettings.dynamicRiskAtrPipsPercentage ?? 2} 
                  onChange={(e) => setLeverageSettings(p => ({ ...p, dynamicRiskAtrPipsPercentage: Math.max(0.1, parseFloat(e.target.value) || 0) }))} 
                  className={`bg-zinc-900 border ${riskAtrPipsPreview.warning ? 'border-yellow-500/50' : 'border-zinc-700'} text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-purple-500 focus:border-purple-500 flex-1`}
                />
              </div>
              <span className="text-[10px] text-zinc-500 uppercase">% Loss at ATR Stop</span>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <label className="flex items-center gap-2 text-[10px] text-zinc-400 cursor-pointer uppercase select-none">
                <input 
                  type="checkbox" 
                  checked={isUsingCustomAtrPips}
                  onChange={(e) => setLeverageSettings(p => ({ ...p, useExplicitLiquidationPips: e.target.checked }))}
                  className="rounded bg-zinc-800 border-zinc-700 text-purple-500 focus:ring-purple-500"
                  disabled={!isSlAtrConfigured} // Force checked if no stop loss indicator
                />
                Use Custom ATR Pips
                {!isSlAtrConfigured && <span className="text-[9px] text-yellow-500 font-medium normal-case">(Forced: Stop Loss ATR inactive)</span>}
              </label>
            </div>
            
            {isUsingCustomAtrPips && (
              <div className="flex gap-2 items-center ml-4">
                <input 
                  type="number" 
                  min="1"
                  value={leverageSettings.explicitLiquidationPips || 20} 
                  onChange={(e) => setLeverageSettings(p => ({ ...p, explicitLiquidationPips: Math.max(1, parseInt(e.target.value) || 1) }))} 
                  className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-2 py-1 w-20 focus:ring-purple-500 focus:border-purple-500"
                />
                <span className="text-[9px] text-zinc-500 uppercase">Custom Pips</span>
              </div>
            )}
            
            {riskAtrPipsPreview.warning && <span className="text-[10px] text-yellow-500">{riskAtrPipsPreview.warning}</span>}
          </div>
        )}

        {isDynamicMargin && (
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

        {isDynamicRisk && (
          <div className="md:col-span-2 mt-1">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded p-2 text-[10px] flex flex-col gap-2 text-zinc-400">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-zinc-500">Lot Size (@ {mockPrice})</span>
                  <span className="text-cyan-400 font-mono">{riskPerPipPreview.possibleLotSize.toFixed(2)} Lots</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500">Total Loss at Liquidation</span>
                  <span className="text-rose-400 font-mono">{leverageSettings.currency}{(leverageSettings.balance).toFixed(2)} (Full Bal)</span>
                </div>
                <div className="flex flex-col w-full col-span-2">
                  <span className="text-zinc-500">Required Pips Against Trade for Full Balance Liquidation</span>
                  <span className="text-rose-400 font-mono">{riskPerPipPreview.pipsToLiquidation.toFixed(1)} Pips</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isDynamicRiskAtr && (
          <div className="md:col-span-2 mt-1">
            <div className="bg-purple-900/10 border border-purple-800/30 rounded p-2 text-[10px] flex flex-col gap-2 text-zinc-400">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-zinc-500">Lot Size (@ {mockPrice})</span>
                  <span className="text-purple-400 font-mono">{riskAtrPipsPreview.possibleLotSize.toFixed(2)} Lots</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500">Target Loss (2% of ${leverageSettings.balance.toFixed(2)})</span>
                  <span className="text-rose-400 font-mono">{leverageSettings.currency}{riskAtrPipsPreview.targetLossAmount.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500">{isUsingCustomAtrPips ? 'Custom ATR Pips' : 'Current SL ATR Pips'}</span>
                  <span className="text-zinc-300 font-mono">{riskAtrPipsPreview.mockAtrPips.toFixed(1)} Pips</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500">Full Liquidation Pips</span>
                  <span className="text-rose-400 font-mono">{riskAtrPipsPreview.pipsToLiquidation.toFixed(1)} Pips</span>
                </div>
              </div>
              <div className="text-[10px] text-purple-400/80 border-t border-purple-800/30 pt-1 mt-1">
                {isUsingCustomAtrPips 
                  ? `Using custom value of ${riskAtrPipsPreview.mockAtrPips.toFixed(1)} pips for the simulated ATR calculation.`
                  : `Currently tracking active Stop Loss Indicator runtime ATR. Hitting this SL will liquidate ~${leverageSettings.dynamicRiskAtrPipsPercentage ?? 2}% of balance.`}
              </div>
            </div>
          </div>
        )}

        {isFixed && (
          <div className="flex flex-col gap-2 md:col-span-2">
            <span className="text-[10px] uppercase text-zinc-400 font-bold">Contract Size</span>
            <div className="bg-zinc-800/50 border border-zinc-700 text-zinc-400 text-xs rounded-md px-2 py-1.5 flex items-center justify-between">
               <span>{getContractSize(dataSettings.asset)} units ({dataSettings.asset})</span>
               <span className="text-[10px] text-zinc-500">Info Only</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-tight">1.0 lot * $1 move = +/- ${getContractSize(dataSettings.asset)}</p>
          </div>
        )}

        <div className="md:col-span-2 border-t border-zinc-800 pt-3 flex flex-col gap-2">
          <span className="text-[10px] uppercase text-zinc-400 font-bold">Recurrent Position Sizing Type</span>
          <div className="flex bg-zinc-900 border border-zinc-700/50 rounded-md overflow-hidden flex-wrap md:flex-nowrap p-0.5 gap-0.5">
            <button
              onClick={() => setLeverageSettings(p => ({ ...p, recurrentPositionSizingMode: 'WEIGHT_FACTOR' }))}
              className={`flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase rounded-sm transition-all ${leverageSettings.recurrentPositionSizingMode === 'WEIGHT_FACTOR' || !leverageSettings.recurrentPositionSizingMode ? 'bg-cyan-600 text-white shadow shadow-cyan-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
            >
              Weight Factor
            </button>
            <button
              onClick={() => setLeverageSettings(p => ({ ...p, recurrentPositionSizingMode: 'FLOATING_GAIN_PERCENTAGE' }))}
              className={`flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase rounded-sm transition-all ${leverageSettings.recurrentPositionSizingMode === 'FLOATING_GAIN_PERCENTAGE' ? 'bg-cyan-600 text-white shadow shadow-cyan-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
            >
              Floating Gain %
            </button>
            <button
              onClick={() => setLeverageSettings(p => ({ ...p, recurrentPositionSizingMode: 'DYNAMIC_RISK_ATR_PIPS' }))}
              className={`flex-1 px-2 py-1.5 text-[10px] font-semibold uppercase rounded-sm transition-all ${leverageSettings.recurrentPositionSizingMode === 'DYNAMIC_RISK_ATR_PIPS' ? 'bg-purple-600 text-white shadow shadow-purple-900/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
              title="Risk by ATR Pips (Uses Main Trade ATR Risk Settings)"
            >
              Risk ATR Pips
            </button>
          </div>
          
          {leverageSettings.recurrentPositionSizingMode === 'WEIGHT_FACTOR' || !leverageSettings.recurrentPositionSizingMode ? (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[10px] uppercase text-zinc-400 font-bold">Recurrent Trade Lot Weight Factor</span>
              <div className="flex gap-2 items-center">
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  value={leverageSettings.recurrentTradeWeightFactor ?? 0.33} 
                  onChange={(e) => setLeverageSettings(p => ({ ...p, recurrentTradeWeightFactor: Math.max(0.01, parseFloat(e.target.value) || 0) }))} 
                  className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 flex-1"
                />
                <span className="text-[10px] text-zinc-500 uppercase shrink-0 w-32">x Main Lot Size</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight">By default 0.33x means the recurrent trade lot size is around 1/3rd of the main trade's lot size.</p>
            </div>
          ) : leverageSettings.recurrentPositionSizingMode === 'DYNAMIC_RISK_ATR_PIPS' ? (
            <div className="flex flex-col gap-2 mt-2 bg-purple-900/10 border border-purple-800/30 p-2 rounded-md">
                <div className="flex items-start gap-2">
                  <Info className="text-purple-500 w-3 h-3 mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-purple-400 font-semibold">Uses Main Trade ATR Risk Configuration</span>
                    <span className="text-[10px] text-zinc-400 leading-tight">
                      This will use the same Max Tolerable Loss ({leverageSettings.dynamicRiskAtrPipsPercentage ?? 2}%) and Mock/Custom ATR Pips configuration evaluated for the Main Trade at the exact moment the Recurrent signal appears. 
                    </span>
                  </div>
                </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-zinc-400 font-bold font-mono">Floating Gain based position size</span>
                {(leverageSettings.recurrentFloatingGainPercentage && leverageSettings.recurrentFloatingGainPercentage >= 50) && (
                  <div className="flex items-center gap-1 text-yellow-500 text-[10px]">
                    <AlertTriangle size={12} /> High Risk Warning
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <input 
                  type="number" 
                  step="1"
                  min="1"
                  max="100"
                  value={leverageSettings.recurrentFloatingGainPercentage ?? 20} 
                  onChange={(e) => setLeverageSettings(p => ({ ...p, recurrentFloatingGainPercentage: Math.max(1, parseFloat(e.target.value) || 0) }))} 
                  className={`bg-zinc-900 border ${(leverageSettings.recurrentFloatingGainPercentage && leverageSettings.recurrentFloatingGainPercentage >= 50) ? 'border-yellow-500/50' : 'border-zinc-700'} text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 flex-1`}
                />
                <span className="text-[10px] text-zinc-500 uppercase shrink-0 w-32">% of Floating Gain</span>
              </div>
              
              <div className="flex gap-2 items-start bg-emerald-900/10 border border-emerald-800/30 p-2 rounded-md mt-1">
                <Info className="text-emerald-500 w-3 h-3 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-emerald-400 font-semibold">Controlled Recurrent Position Sizing</span>
                  <span className="text-[10px] text-zinc-400 leading-tight mt-1">
                    Using only a fraction (e.g. 10–30%) of floating gain dramatically improves survivability, offering healthier margin levels, stronger pullback tolerance, and lower liquidation cascade probability vs. 100% usage.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

