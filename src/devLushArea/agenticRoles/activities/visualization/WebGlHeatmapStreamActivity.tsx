import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play } from 'lucide-react';

export const WebGlHeatmapStreamActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

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

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleRender}
            disabled={isRendering}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isRendering ? 'animate-spin' : ''}`} />
            {isRendering ? 'Rendering...' : 'Compile WebGL Buffer'}
          </button>}>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
        <span className="text-sm font-mono uppercase text-slate-600 dark:text-slate-400">Rendered Data Points</span>
        <div className="text-xl font-bold font-mono text-purple-700 dark:text-purple-400">
          {metrics.renderedPointsCount.toLocaleString()}
        </div>
        <span className="text-sm text-slate-500 font-semibold">IoT Sensor Fleet</span>
      </div>
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
        <span className="text-sm font-mono uppercase text-slate-600 dark:text-slate-400">Render Frame Rate</span>
        <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
          {metrics.fpsAverage} FPS
        </div>
        <span className="text-sm text-emerald-500 font-semibold">Zero UI Jitter</span>
      </div>
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
        <span className="text-sm font-mono uppercase text-slate-600 dark:text-slate-400">GPU VRAM Used</span>
        <div className="text-xl font-bold font-mono text-cyan-700 dark:text-cyan-400">
          {metrics.gpuMemoryAllocatedMb} MB
        </div>
        <span className="text-sm text-cyan-500 font-semibold">Instanced Buffer</span>
      </div>
    </div>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-2">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>Performance Benchmark Comparison</span>
        <span className="text-purple-700 dark:text-purple-400">150,000 Points</span>
      </div>
      <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between text-sm">
        <span className="text-rose-700 dark:text-rose-400">SVG DOM Nodes (&lt;circle&gt;)</span>
        <span className="font-bold text-rose-700 dark:text-rose-400">0.54 FPS (8,000ms UI Freeze)</span>
      </div>
      <div className="p-2 rounded bg-white dark:bg-slate-900 border border-emerald-500/30 flex justify-between text-sm">
        <span className="text-emerald-700 dark:text-emerald-400">Instanced WebGL + Quadtree Hit-Test</span>
        <span className="font-bold text-emerald-700 dark:text-emerald-400">60.0 FPS (1.2ms Draw Time)</span>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default WebGlHeatmapStreamActivity;
