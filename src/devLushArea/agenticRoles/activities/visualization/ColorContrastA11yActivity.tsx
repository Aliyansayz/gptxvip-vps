import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Palette, Sparkles, ShieldCheck, Check, Eye, Sun } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const ColorContrastA11yActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [visionMode, setVisionMode] = useState<'normal' | 'deuteranopia' | 'protanopia' | 'tritanopia'>('normal');

  // Palette color definitions with simulated filters
  const palettes = [
    {
      name: "Accessible Blue-Amber (Oklab)",
      hexNormal: ["#2563EB", "#F59E0B", "#10B981", "#8B5CF6"],
      hexDeuteranopia: ["#3b6fcb", "#c29d33", "#7ea474", "#6775d6"],
      hexProtanopia: ["#2a69d4", "#c09b30", "#89a26f", "#5b77dc"],
      hexTritanopia: ["#2c6ea3", "#f2929e", "#0faea4", "#8f576e"],
      contrast: 8.4,
      rating: "AAA",
      safe: true
    },
    {
      name: "Legacy Red-Green (RGB)",
      hexNormal: ["#E11D48", "#10B981"],
      hexDeuteranopia: ["#8f5e3b", "#7fa375"], // Both look olive/brown!
      hexProtanopia: ["#636f45", "#8aa16f"], // Indistinguishable!
      hexTritanopia: ["#dc2e3d", "#0fb0a3"],
      contrast: 4.1,
      rating: "FAIL",
      safe: false
    }
  ];

  const handleAudit = () => {
    setIsAuditing(true);
    toast.info("Auditing color palettes under Deuteranopia / Protanopia colorblind simulations...");
    setTimeout(() => {
      setIsAuditing(false);
      toast.success("Oklab Perceptual Uniformity Verified: Blue-Amber Palette achieves 8.4:1 contrast (WCAG AAA Pass) across all colorblind deficiency filters!");
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
      toast.success("Correct WCAG AAA Accessible Palette remediation!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect. Use colorblind-safe palettes (Blue-Amber) and direct text labels.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'easy');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || 'WCAG AAA Perceptual Color Palette Synthesizer'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                OKLAB A11Y ENGINE
              </span>
            </h2>
            <p className="text-xs text-slate-400">Data Visualization Specialist • Day 1 Mission • Colorblind Simulator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Filtering...' : 'Audit Contrast Ratios'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Colorblind Vision Mode Switcher & Swatches (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-purple-400" />
                Color Vision Deficiency Simulator
              </span>
              <span className="text-purple-400 font-mono font-bold uppercase">{visionMode} Vision</span>
            </div>

            {/* Vision Mode Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {(['normal', 'deuteranopia', 'protanopia', 'tritanopia'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setVisionMode(mode)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold capitalize transition-all cursor-pointer ${
                    visionMode === mode
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Palette Preview Swatches */}
            <div className="space-y-3 pt-1">
              {palettes.map((p) => {
                const colors =
                  visionMode === 'deuteranopia'
                    ? p.hexDeuteranopia
                    : visionMode === 'protanopia'
                    ? p.hexProtanopia
                    : visionMode === 'tritanopia'
                    ? p.hexTritanopia
                    : p.hexNormal;

                return (
                  <div key={p.name} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-white font-bold">{p.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.safe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        WCAG {p.rating} • {p.contrast}:1
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {colors.map((hex, idx) => (
                        <div
                          key={idx}
                          className="flex-1 h-8 rounded-md flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-inner transition-colors duration-300"
                          style={{ backgroundColor: hex }}
                        >
                          {hex}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Accessible Visual Design
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-purple-500 bg-purple-500/15 text-purple-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-purple-500 bg-purple-500/10 text-white font-semibold';
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
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-purple-950/30 border-purple-800 text-purple-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select palette remediation</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Apply Palette
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorContrastA11yActivity;
