import React, { useState, useCallback } from 'react';
import { Activity } from 'lucide-react';
import { Metric } from './SymptomsLabView';

interface AllMetricsListProps {
  allMetrics: Metric[];
}

export const AllMetricsList: React.FC<AllMetricsListProps> = ({ allMetrics }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  if (allMetrics.length === 0) return null;

  return (
    <div 
      className="relative group max-w-5xl mx-auto w-full bg-card border border-border rounded-xl p-8 mt-8 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:border-cyan-500/30 transition-all duration-300"
      onMouseMove={handleMouseMove}
    >
      {/* Cyan Ribbon Glare Border */}
      <div 
        className="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.4), transparent 40%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      <div className="relative z-20 flex items-center gap-3 mb-6 border-b border-border pb-4">
        <Activity size={18} className="text-cyan-500" />
        <h3 className="text-foreground font-heading tracking-wide text-lg">Global Metrics Dictionary</h3>
      </div>
      <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allMetrics.map(metric => (
          <div key={metric.label} className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-colors group/card">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-medium text-slate-200">{metric.label}</span>
              <span className={`w-2 h-2 rounded-full ${metric.bg}`}></span>
            </div>
            <div className="space-y-2 text-[10px] text-slate-400 font-mono">
              <div className="flex justify-between items-center bg-slate-800/50 px-2.5 py-2 rounded-lg border border-slate-700/50">
                <span>Absolute Range</span>
                <span className="text-slate-300">{metric.min} - {metric.max}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-800/50 px-2.5 py-2 rounded-lg border border-slate-700/50">
                <span>Normal Range</span>
                <span className="text-emerald-500">{metric.normalMin} - {metric.normalMax}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
