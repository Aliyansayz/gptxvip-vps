import React from "react";

interface Props {
  perfectPath: string;
  pathLength: number;
  progress: number;
  pathRef: React.RefObject<SVGPathElement | null>;
  strokeWidth?: number;
  width?: number;
  height?: number;
}

export const JourneyPath: React.FC<Props> = ({ perfectPath, pathLength, progress, pathRef, strokeWidth = 8, width = 1600, height = 800 }) => {
  return (
    <svg className="absolute inset-0 z-10 w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="devGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Flattened Track */}
      <path 
        className={`fill-none stroke-slate-200 dark:stroke-zinc-800 stroke-[${strokeWidth}] stroke-linecap-round`} 
        d={perfectPath} 
        style={{ strokeWidth }}
      />
      {/* Pulsing Glow Track */}
      <path 
        className={`fill-none stroke-emerald-500 stroke-[${strokeWidth * 2}] stroke-linecap-round opacity-20 blur-[8px] transition-[stroke-dashoffset] duration-100 ease-out`} 
        d={perfectPath}
        style={{ strokeWidth: strokeWidth * 2 }}
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength - (pathLength * progress)} 
      />
      {/* Main Vector Path */}
      <path 
        ref={pathRef as any}
        className={`fill-none stroke-[url(#devGradient)] stroke-[${strokeWidth}] stroke-linecap-round transition-[stroke-dashoffset] duration-100 ease-out`} 
        d={perfectPath}
        style={{ strokeWidth }}
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength} // Initial state until first scroll calculation
      />
    </svg>
  );
};
