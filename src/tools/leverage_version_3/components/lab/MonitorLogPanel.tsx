import React, { useState } from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { ToolTab } from './LabNavigation';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface MonitorLogPanelProps {
  activeTab: ToolTab;
}

export const MonitorLogPanel: React.FC<MonitorLogPanelProps> = ({ activeTab }) => {
  const { indicatorSettings, tradingConfig } = useIndicatorsStore();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const getSystemTypeLabel = () => {
    if (activeTab === 'conjunction') return 'Conjunction System';
    if (activeTab === 'disjunction') return 'Disjunction System';
    return 'Classic System';
  };

  return (
    <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg flex flex-col gap-3 mt-4 text-xs font-mono">
      <div 
        className="flex items-center justify-between cursor-pointer select-none hover:opacity-90"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h4 className="text-sm font-semibold text-cyan-500 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          Monitor Log
        </h4>
        <div className="text-zinc-400 flex items-center gap-1 hover:text-cyan-400 transition-colors">
          <span className="text-[10px] uppercase text-zinc-500">{isCollapsed ? 'Show' : 'Hide'}</span>
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="flex flex-col gap-3 mt-1">
          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 uppercase text-[10px] tracking-wider">Active System</span>
            <span className="text-zinc-200 font-bold bg-zinc-800/50 p-2 rounded border border-zinc-700/50">
              {getSystemTypeLabel()} <span className="text-zinc-500 font-normal">({activeTab})</span>
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-zinc-500 uppercase text-[10px] tracking-wider border-b border-zinc-800 pb-1">Entry Logic Indicators</span>
              <div className="flex flex-col gap-2">
                <div className="bg-zinc-800/30 p-2 rounded border border-zinc-700/30 flex justify-between items-center">
                  <span className="text-zinc-300">Base Signal</span>
                  <span className="text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded text-[10px]">
                    {activeTab !== 'conjunction' && activeTab !== 'disjunction' && indicatorSettings[activeTab as keyof typeof indicatorSettings] ? 
                      (indicatorSettings[activeTab as keyof typeof indicatorSettings] as any).entrySignalSource || (indicatorSettings[activeTab as keyof typeof indicatorSettings] as any).dataSource || 'alpha'
                      : 'System Defined'}
                  </span>
                </div>
                
                {(tradingConfig.useADXFilter || tradingConfig.useADXRange) && (
                  <div className="bg-zinc-800/30 p-2 rounded border border-zinc-700/30 flex justify-between items-center">
                    <span className="text-zinc-300">ADX Filter</span>
                    <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded text-[10px]">Active ({indicatorSettings.volatility.dataSource})</span>
                  </div>
                )}
                
                {(tradingConfig.useSlopePersistenceFilter || tradingConfig.useSlopePersistenceRange) && (
                  <div className="bg-zinc-800/30 p-2 rounded border border-zinc-700/30 flex justify-between items-center">
                    <span className="text-zinc-300">Slope Persistence</span>
                    <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded text-[10px]">Active ({indicatorSettings.trendStrength.dataSource})</span>
                  </div>
                )}

                {(tradingConfig.useTrendEfficiencyFilter || tradingConfig.useTrendEfficiencyRange) && (
                  <div className="bg-zinc-800/30 p-2 rounded border border-zinc-700/30 flex justify-between items-center">
                    <span className="text-zinc-300">Trend Efficiency</span>
                    <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded text-[10px]">Active ({indicatorSettings.trendStrength.dataSource})</span>
                  </div>
                )}

                {(tradingConfig.useWickEfficiencyFilter || tradingConfig.useWickEfficiencyRange) && (
                  <div className="bg-zinc-800/30 p-2 rounded border border-zinc-700/30 flex justify-between items-center">
                    <span className="text-zinc-300">Wick Efficiency</span>
                    <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded text-[10px]">Active ({indicatorSettings.trendStrength.dataSource})</span>
                  </div>
                )}
                
                {tradingConfig.useSqueezeFilter && (
                  <div className="bg-zinc-800/30 p-2 rounded border border-zinc-700/30 flex justify-between items-center">
                    <span className="text-zinc-300">Squeeze Momentum</span>
                    <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded text-[10px]">Active ({indicatorSettings.volatility.dataSource})</span>
                  </div>
                )}
                
                {(tradingConfig.useVolRegimeScenarioA || tradingConfig.useVolRegimeScenarioC) && (
                  <div className="bg-zinc-800/30 p-2 rounded border border-zinc-700/30 flex justify-between items-center">
                    <span className="text-zinc-300">Volatility Regime</span>
                    <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded text-[10px]">Active ({indicatorSettings.volatilityRegime.dataSource})</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-zinc-500 uppercase text-[10px] tracking-wider border-b border-zinc-800 pb-1">Exit Logic Indicators</span>
              <div className="flex flex-col gap-2">
                <div className="bg-zinc-800/30 p-2 rounded border border-zinc-700/30 flex justify-between items-center">
                  <span className="text-zinc-300">Stop Loss Tracker</span>
                  <span className="text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded text-[10px]">Active ({indicatorSettings.stopLossIndicator.dataSource})</span>
                </div>
                
                {tradingConfig.exitOnSignalReversal && (
                  <div className="bg-zinc-800/30 p-2 rounded border border-zinc-700/30 flex justify-between items-center">
                    <span className="text-zinc-300">Signal Reversal</span>
                    <span className="text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded text-[10px]">
                      Active ({activeTab !== 'conjunction' && activeTab !== 'disjunction' && indicatorSettings[activeTab as keyof typeof indicatorSettings] ? 
                        (indicatorSettings[activeTab as keyof typeof indicatorSettings] as any).exitSignalSource || (indicatorSettings[activeTab as keyof typeof indicatorSettings] as any).dataSource || 'alpha'
                        : 'System Defined'})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
