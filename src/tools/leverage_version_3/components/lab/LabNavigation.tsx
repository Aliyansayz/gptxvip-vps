import React from 'react';
import { Crosshair, Activity, Radar, BarChart2 } from 'lucide-react';

export type ToolTab = "ma_crossover" | "stochastic" | "supertrend" | "divergence" | "linear_regression" | "bollinger_bands" | "supertrend_regime" | "heikin_ashi_smoothed" | "candlestick_pattern";

interface LabNavigationProps {
  activeTab: ToolTab;
  onTabChange: (tab: ToolTab) => void;
}

export const LabNavigation: React.FC<LabNavigationProps> = ({ activeTab, onTabChange }) => {
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

  return (
    <div className="flex flex-col gap-2 border-b border-zinc-800 pb-4">
      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-1">Classic Systems</div>
      <div className="flex flex-col gap-2 w-full">
        {chunkedTabs.map((rowTabs, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 p-1 rounded-xl border shrink-0 bg-zinc-800/50 border-zinc-800 w-fit">
            {rowTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]'
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
  );
};
