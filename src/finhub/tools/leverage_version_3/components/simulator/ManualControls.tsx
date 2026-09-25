import React from 'react';

interface ManualControlsProps {
  hasActiveTrade: boolean;
  isPlaying: boolean;
  tradeBreaker?: boolean;
  onTrade: (side: 'LONG' | 'SHORT') => void;
  onExit: () => void;
  onReset: () => void;
}

export const ManualControls: React.FC<ManualControlsProps> = ({
  hasActiveTrade,
  isPlaying,
  tradeBreaker,
  onTrade,
  onExit,
  onReset
}) => {
  return (
    <div className="flex flex-col gap-3 justify-center">
      <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">Manual Controls</span>
      <div className="flex gap-2">
        <button 
          disabled={hasActiveTrade || !isPlaying || tradeBreaker} 
          onClick={() => onTrade('LONG')} 
          className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          Buy LONG
        </button>
        <button 
          disabled={hasActiveTrade || !isPlaying || tradeBreaker} 
          onClick={() => onTrade('SHORT')} 
          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sell SHORT
        </button>
        <button 
          disabled={!hasActiveTrade} 
          onClick={onExit} 
          className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-cyan-700 disabled:opacity-50 text-cyan-100 rounded font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-500 whitespace-nowrap"
        >
          Close All Trades
        </button>
        <button 
          onClick={onReset} 
          className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
