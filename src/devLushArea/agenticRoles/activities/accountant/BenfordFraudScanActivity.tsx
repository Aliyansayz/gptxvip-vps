import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, AlertTriangle, Sparkles } from 'lucide-react';

export const BenfordFraudScanActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isScanning, setIsScanning] = useState(false);
  const [highlightAnomaly, setHighlightAnomaly] = useState(false);
  const [hoveredDigit, setHoveredDigit] = useState<number | null>(4);

  const benfordData = [
    { digit: 1, expectedFreq: 30.1, observedFreq: 29.8, anomalyFlag: false },
    { digit: 2, expectedFreq: 17.6, observedFreq: 18.1, anomalyFlag: false },
    { digit: 3, expectedFreq: 12.5, observedFreq: 11.9, anomalyFlag: false },
    { digit: 4, expectedFreq: 9.7, observedFreq: 28.5, anomalyFlag: true, zScore: 8.42 },
    { digit: 5, expectedFreq: 7.9, observedFreq: 4.1, anomalyFlag: false },
    { digit: 6, expectedFreq: 6.7, observedFreq: 3.2, anomalyFlag: false },
    { digit: 7, expectedFreq: 5.8, observedFreq: 2.1, anomalyFlag: false },
    { digit: 8, expectedFreq: 5.1, observedFreq: 1.5, anomalyFlag: false },
    { digit: 9, expectedFreq: 4.6, observedFreq: 0.8, anomalyFlag: false }
  ];

  const handleScan = () => {
    setIsScanning(true);
    toast.info("Running Benford's Law Chi-Square and Z-Score Logarithmic Scan across 5,000 disbursement invoices...");
    setTimeout(() => {
      setIsScanning(false);
      setHighlightAnomaly(true);
      toast.error("CRITICAL FRAUD ANOMALY: Digit '4' observed frequency 28.5% (Expected: 9.7%, Z-Score: 8.42)!");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Computing Z-Scores...' : "Run Benford's Scan"}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          First-Digit Frequency vs Benford Theoretical Log Curve
        </span>
        <span className="font-mono text-sm text-amber-700 dark:text-amber-400">P(d) = log10(1 + 1/d)</span>
      </div>

      {/* SVG Visualizer */}
      <div className="w-full h-[320px] bg-white dark:bg-slate-900/60 rounded-lg p-2 flex items-end justify-between gap-2 border border-slate-200 dark:border-slate-800 relative">
        {/* Theoretical Curve Overlay Polyline */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none p-4" viewBox="0 0 420 180">
          <path
            d="M 30,30 Q 90,80 150,110 T 270,145 T 390,165"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeDasharray="4,4"
          />
        </svg>

        {/* Bars for Digits 1-9 */}
        {benfordData.map((b) => {
          const isHovered = hoveredDigit === b.digit;
          const isAnomaly = b.anomalyFlag || (highlightAnomaly && b.digit === 4);

          return (
            <div
              key={b.digit}
              tabIndex={0} role="button" aria-label={`Inspect digit ${b.digit}: observed ${b.observedFreq} percent, expected ${b.expectedFreq} percent`} onFocus={() => setHoveredDigit(b.digit)} onClick={() => setHoveredDigit(b.digit)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setHoveredDigit(b.digit); } }} onMouseEnter={() => setHoveredDigit(b.digit)}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
            >
              <span className={`text-sm font-mono font-bold ${isAnomaly ? 'text-rose-700 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
                {b.observedFreq}%
              </span>

              <div className="w-full max-w-[28px] bg-slate-50 dark:bg-slate-950 rounded-t h-[140px] flex items-end overflow-hidden border border-slate-200 dark:border-slate-800 relative">
                {/* Expected Shadow Bar */}
                <div
                  className="w-full absolute bottom-0 bg-slate-700/40 border-t border-slate-600"
                  style={{ height: `${(b.expectedFreq / 35) * 100}%` }}
                />
                {/* Observed Live Bar */}
                <div
                  className={`w-full rounded-t transition-colors duration-500 relative z-10 ${
                    isAnomaly
                      ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse'
                      : isHovered
                      ? 'bg-amber-400'
                      : 'bg-amber-500/80'
                  }`}
                  style={{ height: `${(b.observedFreq / 35) * 100}%` }}
                />
              </div>

              <span className={`text-sm font-mono font-bold ${isAnomaly ? 'text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {b.digit}
              </span>
            </div>
          );
        })}
      </div>

      {/* Anomaly Callout Box */}
      {hoveredDigit === 4 && (
        <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-500/40 text-sm font-mono text-rose-700 dark:text-rose-300 space-y-1 animate-in fade-in">
          <div className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            Forensic Anomaly Detected: Digit 4 (Z-Score = 8.42)
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Observed: 28.5% (Expected: 9.7%). 85% of invoices clustered at $4,950.00 to evade the $5,000 manager authorization threshold (Smurfing pattern).
          </p>
        </div>
      )}
    </div>

    </RoleActivityFrame>
  );
};

export default BenfordFraudScanActivity;
