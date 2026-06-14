import React from 'react';
import { Crosshair, Activity, Radar, BarChart2, Layers, Shuffle } from 'lucide-react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { toast } from 'sonner';

export type ToolTab = "ma_crossover" | "stochastic" | "supertrend" | "divergence" | "linear_regression" | "bollinger_bands" | "supertrend_regime" | "heikin_ashi_smoothed" | "candlestick_pattern" | "conjunction";

interface LabNavigationProps {
  activeTab: ToolTab;
  onTabChange: (tab: ToolTab) => void;
}

export const LabNavigation: React.FC<LabNavigationProps> = ({ activeTab, onTabChange }) => {
  const { tradingConfig, setTradingConfig } = useIndicatorsStore();
  const activeMode = tradingConfig.activeSystemMode || 'classic';
  const [lastClassicTab, setLastClassicTab] = React.useState<ToolTab>('stochastic');

  // Track the last classic tab when it changes
  React.useEffect(() => {
    if (activeTab !== 'conjunction') {
      setLastClassicTab(activeTab);
    }
  }, [activeTab]);

  const tabs: { id: ToolTab; label: string; icon: React.ReactNode }[] = [
    { id: 'ma_crossover', label: 'MA Crossover', icon: <Crosshair className="w-3 h-3" /> },
    { id: 'stochastic', label: 'Stochastic Cross', icon: <Activity className="w-3 h-3" /> },
    { id: 'supertrend', label: 'Supertrend', icon: <Radar className="w-3 h-3" /> },
    { id: 'divergence', label: 'Divergence', icon: <BarChart2 className="w-3 h-3" /> },
    { id: 'linear_regression', label: 'Linear Regression', icon: <BarChart2 className="w-3 h-3" /> },
    { id: 'bollinger_bands', label: 'Bollinger Bands', icon: <Activity className="w-3 h-3" /> },
    { id: 'supertrend_regime', label: 'Supertrend Regime', icon: <Radar className="w-3 h-3" /> },
    { id: 'heikin_ashi_smoothed', label: 'Smoothed HA', icon: <Activity className="w-3 h-3" /> },
    { id: 'candlestick_pattern', label: 'Candlestick Pattern', icon: <Activity className="w-3 h-3" /> },
  ];

  const chunkedTabs = [];
  const chunkSize = 4;
  for (let i = 0; i < tabs.length; i += chunkSize) {
    chunkedTabs.push(tabs.slice(i, i + chunkSize));
  }

  const handleSelectClassic = () => {
    setTradingConfig(prev => ({
      ...prev,
      activeSystemMode: 'classic'
    }));
    onTabChange(lastClassicTab);
    toast.success("Classic Mode Activated", {
      description: "Returned to the explicit system selection mode."
    });
  };

  const handleSelectConjunction = () => {
    setTradingConfig(prev => ({
      ...prev,
      activeSystemMode: 'conjunction'
    }));

    onTabChange('conjunction');

    toast.success("Conjunction Mode Activated", {
      description: "Select up to 3 systems from the selector below."
    });
  };

  const toggleConjunctionSystem = (sysId: string) => {
    const current = tradingConfig.activeConjunctionSystems || [];
    const baseId = sysId + '_alpha';
    const isActive = current.includes(baseId);
    
    if (isActive) {
      setTradingConfig(prev => ({
        ...prev,
        activeConjunctionSystems: current.filter(id => id !== baseId)
      }));
    } else {
      if (current.length < 3) {
        setTradingConfig(prev => ({
          ...prev,
          activeConjunctionSystems: [...current, baseId]
        }));
      } else {
        toast.error("Maximum 3 systems allowed", {
          description: "Deselect a system first to add another."
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 border-b border-zinc-800 pb-4">
      {/* Primary Config Mode Selection Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-zinc-950/45 p-3 rounded-xl border border-zinc-800/80">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest">
            Core Trading Mode
          </span>
          <span className="text-[9px] text-zinc-500 max-w-xl">
            Select standard single-system configuration or active Conjunction system mode (filters signals based on perfect alignment of 3 randomly picked classic strategies).
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Classic System button */}
          <button
            id="classic-system-mode-btn"
            onClick={handleSelectClassic}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === 'classic'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400/20'
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Layers className="w-3 h-3" />
            Classic System
          </button>

          {/* Conjunction System Mode button */}
          <button
            id="conjunction-system-mode-btn"
            onClick={handleSelectConjunction}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === 'conjunction'
                ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400/20'
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Shuffle className="w-3 h-3" />
            Conjunction System Mode
          </button>
        </div>
      </div>

      {activeMode === 'classic' ? (
        <div className="flex flex-col gap-2">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-1 flex items-center justify-between">
            <span>Classic Systems Selector</span>
          </div>
          <div className="flex flex-col gap-2 w-full animate-fade-in">
            {chunkedTabs.map((rowTabs, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 p-1 rounded-xl border shrink-0 bg-zinc-800/50 border-zinc-800 w-fit items-center">
                {rowTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)] font-extrabold'
                        : 'text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 animate-fade-in">
          <div className="text-[10px] text-purple-400 font-bold uppercase tracking-widest px-1 flex items-center justify-between">
            <span>Conjunction Systems Selector (Select up to 3)</span>
            <span className="text-purple-300 font-medium">Selected: {(tradingConfig.activeConjunctionSystems || []).length}/3</span>
          </div>
          <div className="flex flex-col gap-2 w-full animate-fade-in">
            {chunkedTabs.map((rowTabs, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 p-1 rounded-xl border shrink-0 bg-purple-950/20 border-purple-800/30 w-fit items-center">
                {rowTabs.map((tab) => {
                  if (tab.id === 'conjunction') return null;
                  const isActive = (tradingConfig.activeConjunctionSystems || []).some(sys => sys.replace('_alpha', '').replace('_beta', '').replace('_delta', '') === tab.id);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => toggleConjunctionSystem(tab.id)}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] bg-purple-500'
                          : 'text-purple-400 hover:text-purple-300'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
