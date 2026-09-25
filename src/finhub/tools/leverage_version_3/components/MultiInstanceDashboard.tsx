import React, { useState } from 'react';
import { IndicatorsStoreProvider } from '../stores/indicators_store';
import { TradingToolsLab } from './TradingToolsLab';
import { Plus, X, MonitorPlay, Settings2, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';

interface TabInstance {
  id: string;
  name: string;
  asset: string;
  timeframe: string;
}

export const MultiInstanceDashboard: React.FC<{ onExitParallelMode: () => void }> = ({ onExitParallelMode }) => {
  const [tabs, setTabs] = useState<TabInstance[]>([
    { id: 'tab-1', name: 'NASDAQ Scalper', asset: 'nasdaq100', timeframe: '5s' },
    { id: 'tab-2', name: 'Gold Volatility Swing', asset: 'gold', timeframe: '1m' }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [areTabsVisible, setAreTabsVisible] = useState(true);

  const addTab = () => {
    const newId = `tab-${Date.now()}`;
    setTabs([...tabs, {
      id: newId,
      name: `Sandbox #${tabs.length + 1}`,
      asset: 'gold',
      timeframe: '5s'
    }]);
    setActiveTabId(newId);
  };

  const removeTab = (idToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Maintain at least one active instance
    const filtered = tabs.filter(t => t.id !== idToRemove);
    setTabs(filtered);
    if (activeTabId === idToRemove) {
      setActiveTabId(filtered[0].id);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans overflow-hidden relative">
      {/* Toggle Arrow for Tabs */}
      <button 
        onClick={() => setAreTabsVisible(!areTabsVisible)}
        className="absolute top-0 right-4 z-50 p-1.5 bg-zinc-900 border border-zinc-800 rounded-b-md text-zinc-400 hover:text-zinc-200 shadow-md transition-colors"
        title={areTabsVisible ? "Hide Tabs" : "Show Tabs"}
      >
        {areTabsVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Tab bar header */}
      {areTabsVisible && (
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[80%] pr-8">
            <button 
              onClick={onExitParallelMode}
              className="flex items-center justify-center p-1.5 mr-2 rounded bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-transparent duration-150 transition-colors"
              title="Exit Parallel Mode"
            >
              <ArrowLeft size={14} />
            </button>
            
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer duration-150 text-xs font-semibold uppercase tracking-wider border transition-all select-none ${
                    isActive 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' 
                      : 'bg-zinc-800/40 border-transparent text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                  }`}
                >
                  <MonitorPlay size={12} className={isActive ? 'text-emerald-400' : 'text-zinc-500'} />
                  <span>{tab.name} ({tab.asset.toUpperCase()})</span>
                  {tabs.length > 1 && (
                    <X 
                      size={11} 
                      onClick={(e) => removeTab(tab.id, e)}
                      className="text-zinc-500 hover:text-rose-400 p-0.5 rounded transition-colors ml-1"
                    />
                  )}
                </div>
              );
            })}
            
            <button 
              onClick={addTab}
              className="flex items-center justify-center p-1.5 rounded bg-zinc-800 hover:bg-emerald-950 hover:text-emerald-400 border border-zinc-700/50 hover:border-emerald-800/40 duration-150 transition-colors ml-1"
            >
              <Plus size={12} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono pr-8">
            <Settings2 size={12} className="text-zinc-400" />
            <span>Parallel Tabs Active: {tabs.length}</span>
          </div>
        </div>
      )}

      {/* Render Workspace with Provider Encapsulation */}
      <div className="flex-1 overflow-hidden relative bg-zinc-950">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div 
              key={tab.id} 
              className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Force recreate or suspend evaluation on mount/destruction */}
              {isActive && (
                <IndicatorsStoreProvider>
                  <TradingToolsLab isParallelModeActive={true} onToggleParallelMode={onExitParallelMode} />
                </IndicatorsStoreProvider>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
