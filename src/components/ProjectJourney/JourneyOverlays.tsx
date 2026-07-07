import React from "react";

interface Props {
  progress: number;
  status: string;
}

export const JourneyOverlays: React.FC<Props> = ({ progress, status }) => {
  return (
    <>
      {/* STATIC UI (Bottom Bar) */}
      <div className="absolute bottom-8 left-10 right-10 flex justify-between items-center z-30 pointer-events-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl transition-all duration-300">
        <div className="flex gap-6 w-full justify-between items-center">
          <div className="w-32">
            <div className="text-[10px] uppercase text-slate-500 dark:text-zinc-400 font-bold tracking-widest">
              Global Status
            </div>
            <div className="text-slate-800 dark:text-zinc-100 font-bold text-lg tracking-tight whitespace-nowrap">
              {status}
            </div>
          </div>
          
          {/* Timeline Ribbon Widget */}
          <div className="flex-1 flex items-center justify-center gap-4 px-6 md:px-12 border-x border-slate-200 dark:border-zinc-800">
             <input 
                type="range" 
                min="0" max="1" step="0.001" 
                value={progress}
                readOnly
                className="flex-1 accent-emerald-500 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
             />
          </div>

          <div className="text-right w-32">
            <div className="text-[10px] uppercase text-slate-500 dark:text-zinc-400 font-bold tracking-widest">
              Track Progress
            </div>
            <div className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-lg">
              {Math.round(progress * 100)}%
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
