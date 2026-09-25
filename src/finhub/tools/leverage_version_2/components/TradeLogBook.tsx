import React from 'react';
import { calculateLogBookStats } from '../functions/api/trade_log_book/starter_log_book';
import { Trade } from '../../types/trading';
import { useIndicatorsStore } from '../stores/indicators_store';
import { collectAllAccountInfo } from '../functions/api/middleware/collectAllAccountInfo';
import { forwardInfoToLogBook } from '../functions/api/middleware/forwardInfoToLogBook';
import { calculatePnL } from '../functions/api/position_sizing/leveragedPositionSizeMetals';

interface TradeLogBookProps {
  trades: Trade[];
  showPips?: boolean;
  onReset?: () => void;
  currentPrice?: number;
}

const TradeRow: React.FC<{trade: Trade, currentPrice?: number, leverageSettings: any, pipMultiplier: number}> = ({ trade, currentPrice, leverageSettings, pipMultiplier }) => {
  let displayPnl = trade.pnl;
  let displayPips = trade.pips;
  
  if (trade.status === 'OPEN' && currentPrice !== undefined) {
    const priceDiff = trade.side === 'LONG' ? currentPrice - trade.entryPrice : trade.entryPrice - currentPrice;
    displayPips = priceDiff / pipMultiplier;
    
    if (leverageSettings.enabled) {
      displayPnl = calculatePnL(trade.entryPrice, currentPrice, trade.size || 1, trade.side);
    } else {
      displayPnl = priceDiff;
    }
  }

  return (
  <tr className="hover:bg-zinc-800/40 transition-colors">
    <td className="px-4 py-3 text-[10px] text-zinc-400 font-mono">
      <div className="text-zinc-500 break-all w-24 truncate" title={trade.id}>{trade.id}</div>
      <div className="text-cyan-600 capitalize mt-0.5">{trade.tradeType || 'Main Trade'}</div>
    </td>
    <td className="px-4 py-3">
      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
        (trade.accountId || 'A1') === 'A1' 
          ? 'text-emerald-400 bg-emerald-900/30 border-emerald-800/50' 
          : (trade.accountId || '').startsWith('S')
          ? 'text-amber-400 bg-amber-900/30 border-amber-800/50'
          : 'text-purple-400 bg-purple-900/30 border-purple-800/50'
      }`}>
        {trade.accountId || 'A1'}
      </span>
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
      <div className="flex flex-col gap-1 items-start">
        {trade.status === 'OPEN' ? (
          <span className="text-blue-400 text-xs font-medium px-2 py-1 bg-blue-900/30 rounded border border-blue-800/50">OPEN</span>
        ) : (
          <span className="text-zinc-400/80 text-[10px] bg-zinc-800/40 px-2 py-1 rounded max-w-[150px] truncate" title={trade.exitReason}>{trade.exitReason}</span>
        )}
        {trade.infoStatus && (
          <span className="text-zinc-500 text-[10px] bg-zinc-800/30 px-2 py-0.5 rounded border border-zinc-700/30">
            {trade.infoStatus}
          </span>
        )}
      </div>
    </td>
    <td className="px-4 py-3 font-mono text-zinc-300 text-xs">
      <div>IN: {trade.entryPrice.toFixed(2)}</div>
      <div>OUT: {trade.exitPrice?.toFixed(2) || (currentPrice !== undefined ? currentPrice.toFixed(2) : '-')}</div>
    </td>
    <td className="px-4 py-3 font-mono text-zinc-300 text-xs">
      {trade.size.toFixed(2)} lot
    </td>
    <td className={`px-4 py-3 font-mono font-medium ${
      displayPnl !== undefined && displayPnl !== null ? (displayPnl >= 0 ? 'text-emerald-400' : 'text-red-500') : 'text-cyan-700'
    }`}>
      <div>{displayPnl !== undefined && displayPnl !== null ? (displayPnl > 0 ? `+${displayPnl.toFixed(2)}` : displayPnl.toFixed(2)) : '-'}</div>
      {displayPips !== undefined && displayPips !== null && (
        <div className="text-[10px] font-normal opacity-70">
          {displayPips > 0 ? `+${displayPips.toFixed(1)} pips` : `${displayPips.toFixed(1)} pips`}
        </div>
      )}
    </td>
    <td className="px-4 py-3 font-mono text-zinc-300 text-xs font-medium">
      {trade.balanceAfter !== undefined ? trade.balanceAfter.toFixed(2) : '-'}
    </td>
  </tr>
  );
};

export const TradeLogBook: React.FC<TradeLogBookProps> = ({ trades, showPips, onReset, currentPrice }) => {
  const { leverageSettings, tradingConfig, parallelAccounts, serialTradingEnabled } = useIndicatorsStore();
  
  const accountState = collectAllAccountInfo(
    trades,
    parallelAccounts,
    leverageSettings.balance,
    currentPrice,
    leverageSettings.enabled,
    serialTradingEnabled
  );

  const forwardedInfo = forwardInfoToLogBook(trades, accountState);
  
  const { totalPnL, closedTrades, winRate } = forwardedInfo.stats;
  const { activeAccountsCount, initialCombinedBalance, combinedBalance, combinedEquity, floatingPnL, openTrades, historyTrades } = forwardedInfo.accountState;


  const activeEquityGrowthPct = initialCombinedBalance > 0 ? ((combinedEquity - initialCombinedBalance) / initialCombinedBalance * 100) : 0;
  const historyPnLPct = initialCombinedBalance > 0 ? ((totalPnL / initialCombinedBalance) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-4 mt-4">
      {/* Active Trades Log Book */}
      <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-inner flex flex-col min-h-0">
        <div className="p-4 border-b border-zinc-800 flex flex-wrap gap-4 justify-between items-center bg-zinc-800/40 shrink-0">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-medium text-cyan-100">
              Trade Log Book (Active) 
              {activeAccountsCount === 1 && !serialTradingEnabled && <span className="text-cyan-500/70 text-xs ml-2 font-normal">(Single Account Mode)</span>}
              {activeAccountsCount > 1 && !serialTradingEnabled && <span className="text-cyan-500/70 text-xs ml-2 font-normal">(Parallel Account Mode)</span>}
              {serialTradingEnabled && <span className="text-cyan-500/70 text-xs ml-2 font-normal">(Serial Account Mode)</span>}
            </h3>
          </div>
          <div className="flex gap-4 text-xs">
            <div><span className="text-cyan-600">Active Accounts:</span> <span className="font-medium text-cyan-400">{activeAccountsCount}</span></div>
            <div><span className="text-cyan-600">Floating Gain/Loss:</span> <span className={`font-medium ${floatingPnL >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>{floatingPnL > 0 ? `+${floatingPnL.toFixed(2)}` : floatingPnL.toFixed(2)}</span></div>
            <div>
              <span className="text-cyan-600">Combined Equity:</span>{' '}
              <span className={`font-medium ${combinedEquity >= initialCombinedBalance ? 'text-emerald-400' : 'text-red-500'}`}>
                {combinedEquity.toFixed(2)} ({activeEquityGrowthPct > 0 ? '+' : ''}{activeEquityGrowthPct.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto flex-1 min-h-[150px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-800/20 text-cyan-600 border-b border-zinc-700/30 uppercase tracking-wider text-xs sticky top-0 backdrop-blur-sm z-10">
              <tr>
                <th className="px-4 py-2 font-semibold">ID / Type</th>
                <th className="px-4 py-2 font-semibold">Account</th>
                <th className="px-4 py-2 font-semibold">Side & Exec</th>
                <th className="px-4 py-2 font-semibold">Times</th>
                <th className="px-4 py-2 font-semibold">Status / Reason</th>
                <th className="px-4 py-2 font-semibold">Prices</th>
                <th className="px-4 py-2 font-semibold">Size</th>
                <th className="px-4 py-2 font-semibold">PnL (Pips)</th>
                <th className="px-4 py-2 font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-800/30">
              {[...openTrades].reverse().map((trade) => (
                <TradeRow key={trade.id} trade={trade} currentPrice={currentPrice} leverageSettings={leverageSettings} pipMultiplier={tradingConfig.pipMultiplier || 1} />
              ))}
              {openTrades.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-cyan-700">
                    No active trades
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade History Book */}
      <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-inner flex flex-col min-h-0">
        <div className="p-4 border-b border-zinc-800 flex flex-wrap gap-4 justify-between items-center bg-zinc-800/40 shrink-0">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-medium text-cyan-100">
              Trade History Book
              {activeAccountsCount === 1 && !serialTradingEnabled && <span className="text-cyan-500/70 text-xs ml-2 font-normal">(Single Account Mode)</span>}
              {activeAccountsCount > 1 && !serialTradingEnabled && <span className="text-cyan-500/70 text-xs ml-2 font-normal">(Parallel Account Mode)</span>}
              {serialTradingEnabled && <span className="text-cyan-500/70 text-xs ml-2 font-normal">(Serial Account Mode)</span>}
            </h3>
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
            <div><span className="text-cyan-600">Trades:</span> <span className="font-medium text-cyan-400">{closedTrades}</span></div>
            <div><span className="text-cyan-600">Win Rate:</span> <span className="font-medium text-cyan-400">{winRate.toFixed(1)}%</span></div>
            <div>
              <span className="text-cyan-600">Total PnL (Closed):</span>{' '}
              <span className={`font-medium ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                {totalPnL > 0 ? `+${totalPnL.toFixed(2)}` : totalPnL.toFixed(2)} ({historyPnLPct > 0 ? '+' : ''}{historyPnLPct.toFixed(2)}%)
              </span>
            </div>
            <div><span className="text-cyan-600">Combined Balance:</span> <span className={`font-medium ${combinedBalance >= initialCombinedBalance ? 'text-emerald-400' : 'text-red-500'}`}>{combinedBalance.toFixed(2)}</span></div>
          </div>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[400px] flex-1 custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-800/20 text-cyan-600 border-b border-zinc-700/30 uppercase tracking-wider text-xs sticky top-0 backdrop-blur-sm z-10">
              <tr>
                <th className="px-4 py-2 font-semibold">ID / Type</th>
                <th className="px-4 py-2 font-semibold">Account</th>
                <th className="px-4 py-2 font-semibold">Side & Exec</th>
                <th className="px-4 py-2 font-semibold">Times</th>
                <th className="px-4 py-2 font-semibold">Status / Reason</th>
                <th className="px-4 py-2 font-semibold">Prices</th>
                <th className="px-4 py-2 font-semibold">Size</th>
                <th className="px-4 py-2 font-semibold">PnL (Pips)</th>
                <th className="px-4 py-2 font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-800/30">
              {[...historyTrades].reverse().map((trade) => (
                <TradeRow key={trade.id} trade={trade} currentPrice={currentPrice} leverageSettings={leverageSettings} pipMultiplier={tradingConfig.pipMultiplier || 1} />
              ))}
              {historyTrades.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-cyan-700">
                    No closed trades yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

