import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, ShoppingCart, Sparkles, ShieldCheck, DollarSign, ShieldAlert, TrendingDown } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const PriceElasticityScraperActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRepricing, setIsRepricing] = useState(false);
  const [competitorPrice, setCompetitorPrice] = useState(42.0);

  const unitCost = 40.0;
  const minFloor = 50.0; // 20% margin
  const ourCurrentPrice = 50.0;

  const handleReprice = () => {
    setIsRepricing(true);
    toast.info("Repricer evaluating competitor price drop ($42.00) vs margin floor ($50.00)...");
    setTimeout(() => {
      setIsRepricing(false);
      toast.error("MARGIN_GUARD INTERCEPT: Refused undercut to $41.50. Locked price at $50.00 hard margin floor.");
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
      toast.success("Correct Margin Guardrail decision!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect action. Never violate the immutable unit cost margin floor.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'easy');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <ShoppingCart className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || 'Competitor Price Scraping & Elasticity Modeling'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                PRICE WAR TRAJECTORY
              </span>
            </h2>
            <p className="text-xs text-slate-400">Agentic Commerce Analyst • Day 1 Mission • Hard Floor Enforcer</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleReprice}
            disabled={isRepricing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isRepricing ? 'animate-spin' : ''}`} />
            {isRepricing ? 'Evaluating Loop...' : 'Run Pricing Engine'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Price War Trajectory Chart (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-xl relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                Live Buy-Box Repricing Collision Trajectory
              </span>
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <span>Competitor:</span>
                <input
                  type="range"
                  min="35"
                  max="60"
                  step="1"
                  value={competitorPrice}
                  onChange={(e) => setCompetitorPrice(parseFloat(e.target.value))}
                  className="w-20 accent-rose-500 cursor-pointer"
                />
                <span className="text-rose-400 font-bold">${competitorPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* SVG Price Chart */}
            <div className="w-full h-[180px] bg-slate-900/60 rounded-lg border border-slate-800/80 p-3 relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 400 130">
                {/* Danger Zone Shading (Below $50.00 Floor) */}
                <rect x="20" y="70" width="360" height="50" fill="#F43F5E" fillOpacity="0.1" />

                {/* Hard Margin Floor ($50.00) Red Dashed Line */}
                <line x1="20" y1="70" x2="380" y2="70" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4,4" />
                <text x="380" y="65" textAnchor="end" fill="#F43F5E" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  HARD MARGIN FLOOR: $50.00 (20% Target)
                </text>

                {/* Unit Cost Line ($40.00) */}
                <line x1="20" y1="110" x2="380" y2="110" stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />
                <text x="380" y="106" textAnchor="end" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                  UNIT COST: $40.00 (Net Zero)
                </text>

                {/* Competitor Price Step Trajectory (Rose) */}
                <polyline
                  points={`20,20 120,40 220,60 320,${Math.min(120, 20 + (60 - competitorPrice) * 3.5)}`}
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2.5"
                  className={isRepricing ? "animate-pulse" : ""}
                />

                {/* Our Bot Clamped Price Trajectory (Emerald) */}
                <polyline
                  points="20,22 120,42 220,62 320,70"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                />

                {/* Clamped Lock Node */}
                <circle cx="320" cy="70" r="5" fill="#10B981" />
                <text x="320" y="58" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  LOCKED: $50.00
                </text>
              </svg>
            </div>

            {/* Diagnostic Badges */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-rose-500/30 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Predatory Competitor Bot: <span className="text-white font-bold">${competitorPrice.toFixed(2)}</span>
              </span>
              <span className="text-emerald-400 font-bold">
                Our Clamped Floor: ${ourCurrentPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Algorithmic Repricing Strategy
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-rose-500 bg-rose-500/15 text-rose-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-rose-500 bg-rose-500/10 text-white font-semibold';
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
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-rose-950/30 border-rose-800 text-rose-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select repricing action</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Commit Decision
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceElasticityScraperActivity;
