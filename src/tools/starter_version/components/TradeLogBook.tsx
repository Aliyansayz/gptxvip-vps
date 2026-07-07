import React from 'react';
import { calculateLogBookStats } from '../functions/api/trade_log_book/starter_log_book';
import { Trade } from '../../types/trading';

interface TradeLogBookProps {
  trades: Trade[];
  showPips?: boolean;
  onReset?: () => void;
}

export const TradeLogBook: React.FC<TradeLogBookProps> = ({ trades, showPips, onReset }) => {
  const { totalPnL, closedTrades, winRate } = calculateLogBookStats(trades);

  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-inner mt-4">
      <div className="p-4 border-b border-zinc-800 flex flex-wrap gap-4 justify-between items-center bg-zinc-800/40">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium text-cyan-100">Trade Log Book</h3>
          {onReset && (
            <button 
              onClick={onReset}
              className="px-3 py-1 bg-red-900/40 hover:bg-red-800/60 text-red-400 text-[10px] uppercase font-bold tracking-widest rounded border border-red-900/60 transition-all"
            >
              Reset Data
            </button>
          )}
        </div>
        <div className="flex gap-4 text-xs">
          <div><span className="text-cyan-600">Total PnL:</span> <span className={`font-medium ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>{totalPnL.toFixed(2)}</span></div>
          <div><span className="text-cyan-600">Win Rate:</span> <span className="font-medium text-cyan-400">{winRate.toFixed(1)}%</span></div>
          <div><span className="text-cyan-600">Trades:</span> <span className="font-medium text-cyan-400">{closedTrades}</span></div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-800/20 text-cyan-600 border-b border-zinc-700/30 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-4 py-2 font-semibold">ID / Type</th>
              <th className="px-4 py-2 font-semibold">Side & Exec</th>
              <th className="px-4 py-2 font-semibold">Times</th>
              <th className="px-4 py-2 font-semibold">Status / Reason</th>
              <th className="px-4 py-2 font-semibold">Prices</th>
              <th className="px-4 py-2 font-semibold">PnL {showPips && '(Pips)'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-800/30">
            {[...trades].reverse().map((trade) => (
              <tr key={trade.id} className="hover:bg-zinc-800/40 transition-colors">
                <td className="px-4 py-3 text-[10px] text-zinc-400 font-mono">
                  <div className="text-zinc-500 break-all w-24 truncate" title={trade.id}>{trade.id}</div>
                  <div className="text-cyan-600 capitalize mt-0.5">{trade.tradeType || 'Main Trade'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold w-fit ${
                      trade.side === 'LONG' ? 'bg-cyan-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {trade.side}
                    </span>
                    <span className="text-[10px] text-cyan-600">{trade.executionType || 'MARKET_EXECUTION'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[10px] text-zinc-400/80 font-mono">
                   <div>IN: {new Date(trade.entryTime).toLocaleTimeString()}</div>
                   <div>OUT: {trade.exitTime ? new Date(trade.exitTime).toLocaleTimeString() : '-'}</div>
                </td>
                <td className="px-4 py-3">
                  {trade.status === 'OPEN' ? (
                    <span className="text-blue-400 text-xs font-medium px-2 py-1 bg-blue-900/30 rounded">OPEN</span>
                  ) : (
                    <span className="text-zinc-400/80 text-[10px] bg-zinc-800/40 px-2 py-1 rounded">{trade.exitReason}</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-zinc-300 text-xs">
                  <div>IN: {trade.entryPrice.toFixed(2)}</div>
                  <div>OUT: {trade.exitPrice?.toFixed(2) || '-'}</div>
                </td>
                <td className={`px-4 py-3 font-mono font-medium ${
                  trade.pnl ? (trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-500') : 'text-cyan-700'
                }`}>
                  <div>{trade.pnl ? (trade.pnl > 0 ? `+${trade.pnl.toFixed(2)}` : trade.pnl.toFixed(2)) : '-'}</div>
                  {showPips && (
                    <div className="text-[10px] font-normal opacity-70">
                      {trade.pips ? (trade.pips > 0 ? `+${trade.pips.toFixed(1)} pips` : `${trade.pips.toFixed(1)} pips`) : ''}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-cyan-700">
                  No trades taken yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
