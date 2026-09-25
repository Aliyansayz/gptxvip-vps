import React from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { TradeCategory } from '../../functions/api/rules/tradeTypes';

export const TradingPanelTradeSettings: React.FC = () => {
  const { tradingConfig, setTradingConfig } = useIndicatorsStore();

  const handleActiveTypeChange = (type: TradeCategory) => {
    setTradingConfig(prev => ({ ...prev, activeTradeType: type }));
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    setTradingConfig(prev => ({
      ...prev,
      mainTradeParams: {
        ...prev.mainTradeParams,
        executionType: prev.mainTradeParams?.executionType || 'market execution',
        countToExecute: val
      }
    }));
  };

  const activeType = tradingConfig.activeTradeType || 'main trade';
  const mainCount = tradingConfig.mainTradeParams?.countToExecute || 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
        <h4 className="text-sm font-semibold text-cyan-500 mb-4 uppercase tracking-wider">Trade Execution Types</h4>
        
        <div className="flex flex-col gap-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="radio" 
              name="trade_type"
              checked={activeType === 'main trade'}
              onChange={() => handleActiveTypeChange('main trade')}
              className="mt-1 bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500" 
            />
            <div>
              <div className="text-xs font-bold text-zinc-200">Main Trade</div>
              <div className="text-[10px] text-zinc-400 mt-1">Executes immediately on entry signal via market execution.</div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer opacity-60">
            <input 
              type="radio" 
              name="trade_type"
              checked={activeType === 'recurrent trade'}
              onChange={() => handleActiveTypeChange('recurrent trade')}
              className="mt-1 bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500" 
            />
            <div>
              <div className="text-xs font-bold text-zinc-200">Recurrent Trade</div>
              <div className="text-[10px] text-zinc-400 mt-1">Not supported in current version.</div>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
        <h4 className="text-sm font-semibold text-cyan-500 mb-4 uppercase tracking-wider">Parameters</h4>
        
        {activeType === 'main trade' ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Execution Mode</label>
              <div className="text-xs text-zinc-300 font-mono bg-zinc-800 px-3 py-2 rounded border border-zinc-700">Market Execution</div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Trade Count To Execute</label>
              <input 
                type="number" 
                min="1"
                value={mainCount}
                onChange={handleCountChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
              <div className="text-[10px] text-zinc-500 mt-1">Cannot be zero. Defines the number of trades to spawn on entry.</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full pb-4">
            <span className="text-xs text-zinc-500 font-mono italic">Configuration restricted.</span>
          </div>
        )}
      </div>
    </div>
  );
};
