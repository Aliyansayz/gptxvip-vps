import React from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { Trade } from '../../../types/trading';
import { getLeverageAccountInfo } from '../../functions/api/leveragedAccount/getLeverageAccountInfo';
import { collectAllAccountInfo } from '../../functions/api/middleware/collectAllAccountInfo';

interface AccountInfoProps {
  displayTrades: Trade[];
  currentPrice?: number;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({ displayTrades, currentPrice }) => {
  const { leverageSettings, parallelAccounts, serialTradingEnabled } = useIndicatorsStore();

  if (!leverageSettings.enabled) return null;

  const {
    totalBalance,
    openFloatingPnL,
    totalEquity,
    freeMargin,
    currency
  } = getLeverageAccountInfo(displayTrades, leverageSettings);

  const equityGrowthPct = leverageSettings.balance > 0 ? ((totalEquity - leverageSettings.balance) / leverageSettings.balance) * 100 : 0;

  let combinedInitialEquity = leverageSettings.balance;
  let combinedEquity = totalEquity;
  let combinedEquityGrowthPct = equityGrowthPct;
  
  if ((parallelAccounts || serialTradingEnabled) && currentPrice !== undefined) {
      const { initialCombinedBalance, combinedEquity: ce } = collectAllAccountInfo(
          displayTrades,
          parallelAccounts,
          leverageSettings.balance,
          currentPrice,
          leverageSettings.enabled,
          serialTradingEnabled
      );
      combinedInitialEquity = initialCombinedBalance;
      combinedEquity = ce;
      combinedEquityGrowthPct = combinedInitialEquity > 0 ? ((combinedEquity - combinedInitialEquity) / combinedInitialEquity) * 100 : 0;
  }

  return (
    <div className="w-full shrink-0 flex flex-col bg-zinc-900/60 border border-zinc-800 shadow-inner rounded-xl overflow-hidden p-4 mt-2">
      <h3 className="text-sm font-semibold text-cyan-500 mb-4 uppercase tracking-wider">Account Info</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
          <div className="text-[10px] text-zinc-400 uppercase mb-1">Total Balance</div>
          <div className="text-lg font-mono text-zinc-100">{currency}{totalBalance.toFixed(2)}</div>
        </div>
        <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
          <div className="text-[10px] text-zinc-400 uppercase mb-1">Floating PnL</div>
          <div className={`text-lg font-mono ${openFloatingPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {openFloatingPnL >= 0 ? '+' : ''}{currency}{openFloatingPnL.toFixed(2)}
          </div>
        </div>
        <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
          <div className="text-[10px] text-zinc-400 uppercase mb-1">Total Equity</div>
          <div className="text-lg font-mono text-cyan-400">
            {currency}{totalEquity.toFixed(2)} <span className="text-xs">({equityGrowthPct > 0 ? '+' : ''}{equityGrowthPct.toFixed(2)}%)</span>
          </div>
        </div>
        <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
          <div className="text-[10px] text-zinc-400 uppercase mb-1">Free Margin</div>
          <div className={`text-lg font-mono ${freeMargin >= 0 ? 'text-zinc-100' : 'text-rose-400'}`}>
            {currency}{freeMargin.toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Combined Accounts Overall Info */}
      {(parallelAccounts?.length > 0 || serialTradingEnabled) && (
        <div className="w-full bg-zinc-950/40 border-t border-zinc-800 pt-3">
           <h4 className="text-[10px] uppercase text-purple-400 font-bold mb-2">Combined Overview (All Accounts)</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-purple-900/10 p-3 rounded-lg border border-purple-900/30">
                 <div className="text-[10px] text-zinc-400 uppercase mb-1">Combined Initial Equity</div>
                 <div className="text-lg font-mono text-purple-200">{currency}{combinedInitialEquity.toFixed(2)}</div>
             </div>
             <div className="bg-purple-900/10 p-3 rounded-lg border border-purple-900/30">
                 <div className="text-[10px] text-zinc-400 uppercase mb-1">Combined Equity Growth</div>
                 <div className={`text-lg font-mono ${combinedEquityGrowthPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                   {currency}{combinedEquity.toFixed(2)} <span className="text-xs">({combinedEquityGrowthPct > 0 ? '+' : ''}{combinedEquityGrowthPct.toFixed(2)}%)</span>
                 </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

