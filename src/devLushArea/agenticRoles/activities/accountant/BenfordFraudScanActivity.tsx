import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, AlertTriangle, Sparkles, ShieldCheck, BarChart2, ZoomIn, Info } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const BenfordFraudScanActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
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

  const handleVerify = () => {
    if (!selectedOption) {
      toast.error("Please choose a candidate response.");
      return;
    }
    const correct = selectedOption === currentExercise.answer;
    setIsCorrect(correct);
    setIsEvaluated(true);
    if (correct) {
      toast.success("Correct Forensic Audit Determination!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect action. Check smurfing/threshold evasion protocols.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'medium');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <BarChart2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || "Benford's Law Forensic Fraud Anomaly Scanning"}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                LOGARITHMIC SPECTROGRAM
              </span>
            </h2>
            <p className="text-xs text-slate-400">Agentic Accountant • Day 2 Mission • 5,000 Vendor Invoices</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Computing Z-Scores...' : "Run Benford's Scan"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dual-Layer SVG Logarithmic Curve & Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80 text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                First-Digit Frequency vs Benford Theoretical Log Curve
              </span>
              <span className="font-mono text-[11px] text-amber-400">P(d) = log10(1 + 1/d)</span>
            </div>

            {/* SVG Visualizer */}
            <div className="w-full h-[220px] bg-slate-900/60 rounded-lg p-2 flex items-end justify-between gap-2 border border-slate-800 relative">
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
                    onMouseEnter={() => setHoveredDigit(b.digit)}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
                  >
                    <span className={`text-[10px] font-mono font-bold ${isAnomaly ? 'text-rose-400' : 'text-slate-400'}`}>
                      {b.observedFreq}%
                    </span>

                    <div className="w-full max-w-[28px] bg-slate-950 rounded-t h-[140px] flex items-end overflow-hidden border border-slate-800 relative">
                      {/* Expected Shadow Bar */}
                      <div
                        className="w-full absolute bottom-0 bg-slate-700/40 border-t border-slate-600"
                        style={{ height: `${(b.expectedFreq / 35) * 100}%` }}
                      />
                      {/* Observed Live Bar */}
                      <div
                        className={`w-full rounded-t transition-all duration-500 relative z-10 ${
                          isAnomaly
                            ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse'
                            : isHovered
                            ? 'bg-amber-400'
                            : 'bg-amber-500/80'
                        }`}
                        style={{ height: `${(b.observedFreq / 35) * 100}%` }}
                      />
                    </div>

                    <span className={`text-xs font-mono font-bold ${isAnomaly ? 'text-rose-400' : 'text-slate-300'}`}>
                      {b.digit}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Anomaly Callout Box */}
            {hoveredDigit === 4 && (
              <div className="mt-3 p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-xs font-mono text-rose-300 space-y-1 animate-in fade-in">
                <div className="font-bold flex items-center gap-1.5 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  Forensic Anomaly Detected: Digit 4 (Z-Score = 8.42)
                </div>
                <p className="text-[11px] text-slate-300">
                  Observed: 28.5% (Expected: 9.7%). 85% of invoices clustered at $4,950.00 to evade the $5,000 manager authorization threshold (Smurfing pattern).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Forensic Audit Determination
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-amber-500 bg-amber-500/15 text-amber-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-amber-500 bg-amber-500/10 text-white font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isEvaluated}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${style}`}
                    >
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isEvaluated && (
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-amber-950/30 border-amber-800 text-amber-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
                  <p className="font-semibold mb-1">{isCorrect ? 'Analysis Confirmed:' : 'Evaluation:'}</p>
                  <p className="text-slate-300 text-[11px]">{currentExercise.explanation}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {isEvaluated ? (
                <button
                  onClick={() => { setIsEvaluated(false); setSelectedOption(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              ) : <div className="text-[11px] text-slate-500 font-mono">Select forensic action</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Execute Action
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenfordFraudScanActivity;
