import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, TrendingUp, Sparkles, ShieldCheck, DollarSign, RefreshCw } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const CashFlowRunwayForecastActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [monthlyBurn, setMonthlyBurn] = useState(200000);

  const currentCash = 2400000;
  const p50Runway = (currentCash / monthlyBurn).toFixed(1);
  const p95Runway = ((currentCash / monthlyBurn) * 0.6).toFixed(1);

  const handleSimulate = () => {
    setIsSimulating(true);
    toast.info("Executing 10,000 stochastic Monte Carlo iterations with volatile receivable delay parameters...");
    setTimeout(() => {
      setIsSimulating(false);
      toast.success(`Monte Carlo Complete: P50 (Median) = ${p50Runway} Months • P95 (Conservative) = ${p95Runway} Months!`);
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
      toast.success("Correct Treasury Risk Recommendation!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect recommendation. Plan runway buffers against P95 conservative tails.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'hard');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || 'Autonomous Burn Rate & Cash Runway Forecasting'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                MONTE CARLO FAN CHART
              </span>
            </h2>
            <p className="text-xs text-slate-400">Agentic Accountant • Day 5 Capstone Mission • 10,000 Iterations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Simulating 10k paths...' : 'Run Monte Carlo'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stochastic Fan Chart & Burn Slider (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-xl relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
              <span className="font-mono text-slate-400">12-Month Stochastic Treasury Trajectory ($2.4M Initial)</span>
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <span>Burn:</span>
                <input
                  type="range"
                  min="100000"
                  max="400000"
                  step="25000"
                  value={monthlyBurn}
                  onChange={(e) => setMonthlyBurn(parseInt(e.target.value))}
                  className="w-20 accent-amber-500 cursor-pointer"
                />
                <span className="text-amber-400 font-bold">${(monthlyBurn / 1000).toFixed(0)}k/mo</span>
              </div>
            </div>

            {/* SVG Fan Chart */}
            <div className="w-full h-[180px] bg-slate-900/60 rounded-lg border border-slate-800/80 p-3 relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 400 140">
                {/* Zero-Cash Line */}
                <line x1="20" y1="120" x2="380" y2="120" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
                <text x="380" y="116" textAnchor="end" fill="#94a3b8" fontSize="8" fontFamily="monospace">$0 (Insolvency)</text>

                {/* Shaded P10-P90 Fan Envelope */}
                <polygon
                  points="20,20 120,45 220,85 300,120 220,105 120,65 20,20"
                  fill="#F59E0B"
                  fillOpacity="0.15"
                />

                {/* P95 Conservative Trajectory Line (Red) */}
                <polyline
                  points="20,20 100,55 180,95 240,120"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2.5"
                  className={isSimulating ? "animate-pulse" : ""}
                />

                {/* P50 Median Trajectory Line (Amber) */}
                <polyline
                  points="20,20 100,45 200,75 300,105 360,120"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                />

                {/* Initial Node */}
                <circle cx="20" cy="20" r="4" fill="#10B981" />
                <text x="28" y="24" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">$2.4M (M0)</text>

                {/* P95 Zero Cash Point */}
                <circle cx="240" cy="120" r="4" fill="#F43F5E" />
                <text x="240" y="134" textAnchor="middle" fill="#F43F5E" fontSize="8" fontWeight="bold" fontFamily="monospace">P95: {p95Runway} Mo</text>

                {/* P50 Zero Cash Point */}
                <circle cx="360" cy="120" r="4" fill="#F59E0B" />
                <text x="360" y="134" textAnchor="middle" fill="#F59E0B" fontSize="8" fontWeight="bold" fontFamily="monospace">P50: {p50Runway} Mo</text>
              </svg>
            </div>

            {/* Metric Breakdown Cards */}
            <div className="grid grid-cols-3 gap-3 text-center pt-1 font-mono text-xs">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">TREASURY CASH</span>
                <span className="text-emerald-400 font-bold text-sm">$2.40M</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">P50 RUNWAY</span>
                <span className="text-amber-400 font-bold text-sm">{p50Runway} Mo</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-rose-500/30">
                <span className="text-[10px] text-slate-500 block">P95 CONSERVATIVE</span>
                <span className="text-rose-400 font-bold text-sm">{p95Runway} Mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Board Advisory Recommendation
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select board directive</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Submit Recommendation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowRunwayForecastActivity;
