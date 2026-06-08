import React from 'react';
import { calculateLogBookStats } from '../functions/api/trade_log_book/starter_log_book';
import { Trade } from '../../types/trading';
import { useIndicatorsStore } from '../stores/indicators_store';
import { collectAllAccountInfo } from '../functions/api/middleware/collectAllAccountInfo';
import { forwardInfoToLogBook } from '../functions/api/middleware/forwardInfoToLogBook';
import { calculatePnL } from '../functions/api/position_sizing/leveragedPositionSizeMetals';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { calculateTradeMetrics, TradeMetrics } from '../functions/api/utility/metricsCalculator';
import { triggerMetricsCalculation, getClosedTradesInSequentialOrder } from '../functions/api/utility/metricsCalcTrigger';

interface TradeLogBookProps {
  trades: Trade[];
  showPips?: boolean;
  onReset?: () => void;
  currentPrice?: number;
  onCloseTrade?: (id: string) => void;
}

const TradeRow = React.memo<{trade: Trade, currentPrice?: number, leverageSettings: any, pipMultiplier: number, onCloseTrade?: (id: string) => void}>(({ trade, currentPrice, leverageSettings, pipMultiplier, onCloseTrade }) => {
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
          <div className="flex item-center gap-2">
            <span className="text-blue-400 text-xs font-medium px-2 py-1 bg-blue-900/30 rounded border border-blue-800/50">OPEN</span>
            {onCloseTrade && (
              <button 
                onClick={() => onCloseTrade(trade.id)} 
                className="px-2 py-1 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-cyan-400 font-medium rounded border border-zinc-700 transition"
              >
                Close
              </button>
            )}
          </div>
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
});
TradeRow.displayName = 'TradeRow';

export const TradeLogBook: React.FC<TradeLogBookProps> = ({ trades, showPips, onReset, currentPrice, onCloseTrade }) => {
  const { leverageSettings, tradingConfig, parallelAccounts, serialTradingEnabled } = useIndicatorsStore();
  const [visibleHistoryCount, setVisibleHistoryCount] = React.useState(50);
  
  // State for collapsible metrics
  const [isMetricsExpanded, setIsMetricsExpanded] = React.useState(false);
  const [calculatedMetrics, setCalculatedMetrics] = React.useState<TradeMetrics | null>(null);
  const [lastCalculatedCount, setLastCalculatedCount] = React.useState<number>(0);
  
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

  const closedTradesList = React.useMemo(() => {
    return getClosedTradesInSequentialOrder(trades);
  }, [trades]);

  const closedTradesCount = closedTradesList.length;

  const handleRecalculate = React.useCallback((isClick: boolean = false) => {
    const res = triggerMetricsCalculation(
      trades,
      isClick,
      lastCalculatedCount,
      leverageSettings.balance
    );

    if (res.triggered || isClick || !calculatedMetrics) {
      const freshMetrics = calculateTradeMetrics(closedTradesList, leverageSettings.balance);
      setCalculatedMetrics(freshMetrics);
      setLastCalculatedCount(closedTradesCount);
    }
  }, [trades, closedTradesCount, lastCalculatedCount, calculatedMetrics, leverageSettings.balance, closedTradesList]);

  // Modulus 3 trigger or initial trigger
  React.useEffect(() => {
    if (closedTradesCount > 0 && closedTradesCount !== lastCalculatedCount && closedTradesCount % 3 === 0) {
      handleRecalculate(false);
    }
  }, [closedTradesCount, lastCalculatedCount, handleRecalculate]);

  // Initial computation
  React.useEffect(() => {
    if (!calculatedMetrics && closedTradesCount > 0) {
      const freshMetrics = calculateTradeMetrics(closedTradesList, leverageSettings.balance);
      setCalculatedMetrics(freshMetrics);
      setLastCalculatedCount(closedTradesCount);
    }
  }, [calculatedMetrics, closedTradesCount, closedTradesList, leverageSettings.balance]);

  const activeEquityGrowthPct = initialCombinedBalance > 0 ? ((combinedEquity - initialCombinedBalance) / initialCombinedBalance * 100) : 0;
  const historyPnLPct = initialCombinedBalance > 0 ? ((totalPnL / initialCombinedBalance) * 100) : 0;

  const reversedHistory = [...historyTrades].reverse();
  const visibleHistory = reversedHistory.slice(0, visibleHistoryCount);

  const handleLoadMore = () => {
    setVisibleHistoryCount(prev => prev + 50);
  };

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
              {[...openTrades].reverse().map((trade, idx) => (
                <TradeRow key={`${trade.id}-${idx}-${trade.status}`} trade={trade} currentPrice={currentPrice} leverageSettings={leverageSettings} pipMultiplier={tradingConfig.pipMultiplier || 1} onCloseTrade={onCloseTrade} />
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
            <div><span className="text-zinc-650">Trades:</span> <span className="font-medium text-cyan-400">{closedTrades}</span></div>
            <div><span className="text-zinc-650">Win Rate:</span> <span className="font-medium text-cyan-400">{winRate.toFixed(1)}%</span></div>
            <div>
              <span className="text-zinc-650">Total PnL (Closed):</span>{' '}
              <span className={`font-medium ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                {totalPnL > 0 ? `+${totalPnL.toFixed(2)}` : totalPnL.toFixed(2)} ({historyPnLPct > 0 ? '+' : ''}{historyPnLPct.toFixed(2)}%)
              </span>
            </div>
            <div><span className="text-zinc-650">Combined Balance:</span> <span className={`font-medium ${combinedBalance >= initialCombinedBalance ? 'text-emerald-400' : 'text-red-500'}`}>{combinedBalance.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Collapsible Metrics Info Panel */}
        <div className="border-b border-zinc-805 bg-zinc-950/20 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMetricsExpanded(!isMetricsExpanded)}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium font-mono uppercase tracking-wider text-[11px] transition-colors"
            >
              {isMetricsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {isMetricsExpanded ? 'Hide performance metrics' : 'Show performance metrics'}
            </button>
            {calculatedMetrics && (
              <span className="text-[10px] text-zinc-500 font-mono">
                [Calculated at: {lastCalculatedCount} trades]
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {closedTradesCount % 3 === 0 && closedTradesCount > 0 && (
              <span className="text-[10px] text-emerald-500 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded font-mono">
                Auto-updated (Mod 3)
              </span>
            )}
            <button
              onClick={() => handleRecalculate(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/40 hover:bg-cyan-800/40 text-cyan-400 text-[10px] uppercase font-bold tracking-wider rounded border border-cyan-900/60 transition-all cursor-pointer"
              title="Recalculate metrics on-demand"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>
        </div>

        {isMetricsExpanded && (
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/40 text-xs">
            {!calculatedMetrics ? (
              <div className="text-zinc-650 text-center py-2 font-mono">
                No performance metrics calculated yet. Click refresh or close some trades.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                {/* Profit Factor */}
                <div className="bg-zinc-950/70 border border-zinc-850/60 rounded-lg p-3 flex flex-col justify-between">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider">Profit Factor</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className={`text-base font-bold font-mono ${
                      calculatedMetrics.profitFactor >= 1.5 
                        ? 'text-emerald-400' 
                        : calculatedMetrics.profitFactor >= 1.0 
                        ? 'text-amber-400' 
                        : 'text-red-500'
                    }`}>
                      {calculatedMetrics.profitFactor === Infinity ? '∞' : calculatedMetrics.profitFactor.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[9px] text-zinc-600 mt-1">Ratio: Gross Profits / Gross Losses</span>
                </div>

                {/* Max Drawdown */}
                <div className="bg-zinc-950/70 border border-zinc-850/60 rounded-lg p-3 flex flex-col justify-between">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider">Max Drawdown</span>
                  <div className="mt-1 flex flex-col">
                    <span className="text-base font-bold font-mono text-zinc-300">
                      -${calculatedMetrics.maxDrawdownValue.toFixed(2)}
                    </span>
                    <span className="text-xs text-red-400 font-mono mt-0.5">
                      {calculatedMetrics.maxDrawdownPercent.toFixed(2)}%
                    </span>
                  </div>
                  <span className="text-[9px] text-zinc-600 mt-1">Peak-to-trough extreme loss</span>
                </div>

                {/* Expectancy */}
                <div className="bg-zinc-950/70 border border-zinc-850/60 rounded-lg p-3 flex flex-col justify-between">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider">Expectancy</span>
                  <div className="mt-1">
                    <span className={`text-base font-bold font-mono ${
                      calculatedMetrics.expectancy >= 0 ? 'text-emerald-400' : 'text-red-500'
                    }`}>
                      {calculatedMetrics.expectancy >= 0 ? '+' : ''}{calculatedMetrics.expectancy.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[9px] text-zinc-600 mt-1">Expected profit/loss per closed trade</span>
                </div>

                {/* Average Gain vs Loss */}
                <div className="bg-zinc-950/70 border border-zinc-850/60 rounded-lg p-3 flex flex-col justify-between">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider">Avg Gain / Loss</span>
                  <div className="mt-1 flex flex-col gap-0.5 font-mono text-[11px]">
                    <div className="flex justify-between text-emerald-400">
                      <span>Gain:</span>
                      <span className="font-semibold">+{calculatedMetrics.avgGain.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>Loss:</span>
                      <span className="font-semibold">-${calculatedMetrics.avgLoss.toFixed(2)}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-600 mt-1">Average result of win vs loss</span>
                </div>

                {/* Avg Consecutive Wins / Losses */}
                <div className="bg-zinc-950/70 border border-zinc-850/60 rounded-lg p-3 flex flex-col justify-between">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider">Avg Consecutive</span>
                  <div className="mt-1 flex flex-col gap-0.5 font-mono text-[11px] text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Wins:</span>
                      <span className="font-semibold text-emerald-400/90">{calculatedMetrics.avgConsecutiveWins.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Losses:</span>
                      <span className="font-semibold text-red-400/90">{calculatedMetrics.avgConsecutiveLosses.toFixed(1)}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-600 mt-1">Mean run lengths of streaks</span>
                </div>

                {/* Max Consecutive Wins / Losses */}
                <div className="bg-zinc-950/70 border border-zinc-850/60 rounded-lg p-3 flex flex-col justify-between">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider">Max Consecutive</span>
                  <div className="mt-1 flex flex-col gap-0.5 font-mono text-[11px] text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Wins:</span>
                      <span className="font-semibold text-emerald-450">{calculatedMetrics.maxConsecutiveWins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Losses:</span>
                      <span className="font-semibold text-red-450">{calculatedMetrics.maxConsecutiveLosses}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-600 mt-1">Highest run lengths recorded</span>
                </div>
              </div>
            )}
          </div>
        )}
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
              {visibleHistory.map((trade, idx) => (
                <TradeRow key={`${trade.id}-${idx}-${trade.status}`} trade={trade} currentPrice={currentPrice} leverageSettings={leverageSettings} pipMultiplier={tradingConfig.pipMultiplier || 1} />
              ))}
              {historyTrades.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-cyan-700">
                    No closed trades yet
                  </td>
                </tr>
              )}
              {visibleHistory.length < historyTrades.length && (
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-center">
                    <button
                      onClick={handleLoadMore}
                      className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-xs font-medium rounded border border-zinc-700/50 transition-colors"
                    >
                      Load More Trades ({historyTrades.length - visibleHistory.length} remaining)
                    </button>
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

