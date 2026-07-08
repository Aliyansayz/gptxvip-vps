import React from 'react';
import { Plus } from 'lucide-react';
import { Metric } from './SymptomsLabView';

interface MetricsRightPaneProps {
  isOpen: boolean;
  allMetrics: Metric[];
  currentMetrics: Metric[];
  onAddMetric: (metric: Metric) => void;
}

export const MetricsRightPane: React.FC<MetricsRightPaneProps> = ({
  isOpen,
  allMetrics,
  currentMetrics,
  onAddMetric
}) => {
  return (
    <aside 
      className={`flex flex-col border-l border-slate-800 bg-slate-900 z-30 transition-all duration-300 overflow-hidden ${
        isOpen ? 'w-72' : 'w-0 border-l-0'
      }`}
    >
      <div className="w-72 flex flex-col h-full">
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-heading tracking-wide text-sm text-foreground">Available Metrics</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Click to add to visualizer</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {allMetrics.map(metric => {
            const isAdded = currentMetrics.some(m => m.label === metric.label);
            return (
              <button
                key={metric.label}
                onClick={() => !isAdded && onAddMetric(metric)}
                disabled={isAdded}
                className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                  isAdded 
                    ? 'bg-slate-800/50 border-slate-700/50 opacity-50 cursor-not-allowed' 
                    : 'bg-slate-800 border-slate-700/50 hover:bg-slate-700 hover:border-cyan-500/50 shadow-sm'
                }`}
              >
                <div>
                  <span className="text-xs font-medium text-slate-200 block">{metric.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                    Norm: {metric.normalMin}-{metric.normalMax}
                  </span>
                </div>
                {!isAdded && <Plus size={14} className="text-cyan-500/50 group-hover:text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
