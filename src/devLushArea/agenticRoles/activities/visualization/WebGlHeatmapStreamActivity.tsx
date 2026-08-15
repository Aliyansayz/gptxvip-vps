import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Cpu, Sparkles, ShieldCheck, Activity, Gauge } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const WebGlHeatmapStreamActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  const metrics = (currentExercise?.roleSpecificData as any)?.data?.webGlMetrics || {
    renderedPointsCount: 150000,
    fpsAverage: 60.0,
    gpuMemoryAllocatedMb: 18.4
  };

  const handleRender = () => {
    setIsRendering(true);
    toast.info("Binding Instanced WebGL Vertex Buffer and Quadtree for 150,000 telemetry points...");
    setTimeout(() => {
      setIsRendering(false);
      toast.success("WebGL Draw Complete: 150,000 nodes rendered in 1.2ms (Steady 60.0 FPS, 18.4MB GPU RAM)!");
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
      toast.success("Correct WebGL & Canvas GPU Acceleration architecture!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect. Offload 100k+ points to WebGL/Canvas with Quadtrees to eliminate DOM freezes.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'medium');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <Gauge className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {currentExercise?.title || 'High-Density WebGL / Canvas Heatmap Telemetry'}
            </h2>
            <p className="text-xs text-slate-400">Data Visualization Specialist • Day 3 Mission</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleRender}
            disabled={isRendering}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isRendering ? 'animate-spin' : ''}`} />
            {isRendering ? 'Rendering...' : 'Compile WebGL Buffer'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Rendered Data Points</span>
              <div className="text-xl font-bold font-mono text-purple-400">
                {metrics.renderedPointsCount.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">IoT Sensor Fleet</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Render Frame Rate</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {metrics.fpsAverage} FPS
              </div>
              <span className="text-[10px] text-emerald-500 font-semibold">Zero UI Jitter</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">GPU VRAM Used</span>
              <div className="text-xl font-bold font-mono text-cyan-400">
                {metrics.gpuMemoryAllocatedMb} MB
              </div>
              <span className="text-[10px] text-cyan-500 font-semibold">Instanced Buffer</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-2">
            <div className="text-slate-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Performance Benchmark Comparison</span>
              <span className="text-purple-400">150,000 Points</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between text-[11px]">
              <span className="text-rose-400">SVG DOM Nodes (&lt;circle&gt;)</span>
              <span className="font-bold text-rose-400">0.54 FPS (8,000ms UI Freeze)</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-emerald-500/30 flex justify-between text-[11px]">
              <span className="text-emerald-400">Instanced WebGL + Quadtree Hit-Test</span>
              <span className="font-bold text-emerald-400">60.0 FPS (1.2ms Draw Time)</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                GPU Rendering Architecture
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
              ) : <div className="text-[11px] text-slate-500 font-mono">Select rendering strategy</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Deploy Shader
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebGlHeatmapStreamActivity;
