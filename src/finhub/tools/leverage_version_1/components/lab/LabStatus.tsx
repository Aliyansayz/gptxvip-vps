import React from 'react';

interface LabStatusProps {}

export const LabStatus: React.FC<LabStatusProps> = () => {
  return (
    <div className="flex gap-16 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-black text-cyan-600">Concept Tested:</span>
        <span className="text-xs font-semibold text-zinc-300">Technical Analysis & Backtesting</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-black text-cyan-600">Activity Type:</span>
        <span className="text-xs font-semibold text-zinc-300">Interactive Activity</span>
      </div>
    </div>
  );
};
