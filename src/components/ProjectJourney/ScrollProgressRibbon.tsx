import React from 'react';

/**
 * ScrollProgressRibbon
 * * @param {number} scrollPct - The current scroll percentage (0 to 100)
 */
export const ScrollProgressRibbon = ({ scrollPct = 0 }: { scrollPct: number }) => {
  return (
    // The Container: Positions the ribbon on the left and adds padding
    <div className="absolute left-1.5 top-0 bottom-0 w-6 flex justify-center pointer-events-none z-10 py-4">
      
      {/* The Track: 2px ultra-thin background line */}
      <div className="w-[2px] h-full bg-slate-200 dark:bg-zinc-800 relative rounded-full overflow-visible">
        
        {/* The Fill: Liquid emerald progress bar that grows downward */}
        <div 
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-emerald-600 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] rounded-full transition-all duration-75 ease-linear"
          style={{ height: `${scrollPct}%` }}
        />
        
        {/* The Thumb/Knob: Sleek vertical pill that travels with the scroll */}
        <div 
          className="absolute w-[1.5px] h-[32px] bg-white rounded-full shadow-[0_0_10px_#6ee7b7] transition-all duration-75 ease-linear left-1/2 -translate-x-1/2"
          style={{ top: `calc(${scrollPct}% - 16px)` }}
        />
        
      </div>
      
    </div>
  );
};
