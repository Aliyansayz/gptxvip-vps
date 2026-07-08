import React from 'react';
import { Metric } from './SymptomsLabView';
import { AlertTriangle, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

interface MetricSliderProps {
  metric: Metric;
  value: number;
  onChange: (val: number) => void;
}

export const MetricSlider: React.FC<MetricSliderProps> = ({ metric, value, onChange }) => {
  const range = metric.max - metric.min;
  const normalStartPct = ((metric.normalMin - metric.min) / range) * 100;
  const normalWidthPct = ((metric.normalMax - metric.normalMin) / range) * 100;
  const valuePct = ((value - metric.min) / range) * 100;
  
  const isNormal = value >= metric.normalMin && value <= metric.normalMax;

  let statusLabel = "Normal";
  let statusColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  let StatusIcon = CheckCircle2;
  let trackColor = "bg-cyan-500";

  if (!isNormal) {
    let deviationPct = 0;
    if (value < metric.normalMin) {
      const devRange = metric.normalMin - metric.min;
      deviationPct = devRange === 0 ? 1 : (metric.normalMin - value) / devRange;
    } else {
      const devRange = metric.max - metric.normalMax;
      deviationPct = devRange === 0 ? 1 : (value - metric.normalMax) / devRange;
    }

    if (deviationPct <= (metric.suspiciousDeviation ?? 0.33)) {
      statusLabel = "Suspicious";
      statusColor = "text-amber-600 bg-amber-50 border-amber-200";
      StatusIcon = AlertCircle;
      trackColor = "bg-amber-500";
    } else if (deviationPct <= (metric.criticalDeviation ?? 0.66)) {
      statusLabel = "Critical";
      statusColor = "text-orange-600 bg-orange-50 border-orange-200";
      StatusIcon = AlertTriangle;
      trackColor = "bg-orange-500";
    } else {
      statusLabel = "Dangerous";
      statusColor = "text-red-600 bg-red-50 border-red-200";
      StatusIcon = ShieldAlert;
      trackColor = "bg-red-500";
    }
  }

  const step = (metric.normalMax - metric.normalMin) < 5 || metric.normalMin % 1 !== 0 || metric.normalMax % 1 !== 0 ? 0.1 : 1;

  return (
    <div className="flex flex-col gap-4 mt-2 mb-6">
      {/* Header with Contextual Feedback */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${metric.bg}`}></span>
          <span className="text-sm font-medium text-foreground">{metric.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${statusColor}`}>
            <StatusIcon size={10} /> {statusLabel}
          </span>
          <span className={`text-xl font-bold font-mono ${isNormal ? 'text-cyan-500' : statusColor.split(' ')[0]}`}>
            {Number.isInteger(value) ? value : value.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Number Line Scale Slider */}
      <div className="relative pt-4 pb-8">
        {/* Base Line */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-border rounded-full"></div>
        
        {/* Normal Range Highlight */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-emerald-500/20 border-x border-emerald-500/30 rounded-sm"
          style={{ left: `${normalStartPct}%`, width: `${normalWidthPct}%` }}
        ></div>

        {/* Active Track */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 h-0.5 ${trackColor} rounded-full transition-all duration-300`}
          style={{ width: `${valuePct}%` }}
        ></div>

        {/* Ticks and Labels */}
        {/* Min Tick */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-px h-3 bg-muted-foreground/50"></div>
        <div className="absolute top-full mt-2 left-0 -translate-x-1/2 text-[10px] text-muted-foreground font-mono">{metric.min}</div>
        
        {/* Max Tick */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-px h-3 bg-muted-foreground/50"></div>
        <div className="absolute top-full mt-2 right-0 translate-x-1/2 text-[10px] text-muted-foreground font-mono">{metric.max}</div>

        {/* Normal Min Tick */}
        <div className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-emerald-500" style={{ left: `${normalStartPct}%` }}></div>
        <div className="absolute top-full mt-2 -translate-x-1/2 text-[10px] text-emerald-500 font-mono" style={{ left: `${normalStartPct}%` }}>{metric.normalMin}</div>

        {/* Normal Max Tick */}
        <div className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-emerald-500" style={{ left: `${normalStartPct + normalWidthPct}%` }}></div>
        <div className="absolute top-full mt-2 -translate-x-1/2 text-[10px] text-emerald-500 font-mono" style={{ left: `${normalStartPct + normalWidthPct}%` }}>{metric.normalMax}</div>

        {/* Thumb (Clinical Indicator) */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-5 -ml-[3px] rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-colors duration-300 ${isNormal ? 'bg-cyan-400' : trackColor} z-20 pointer-events-none`}
          style={{ left: `${valuePct}%` }}
        ></div>

        {/* Actual Input Overlay */}
        <input 
          type="range" 
          min={metric.min} 
          max={metric.max} 
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
        />
      </div>
    </div>
  );
};
