import { Trade } from '../../../../types/trading';
import { TradingRulesConfig } from '../rules/tradingRules';

export function determineFlipTradeSignal(
  newlyClosedTrades: Trade[],
  config: TradingRulesConfig
): 'LONG' | 'SHORT' | null {
  if (!config.flipModeActive) return null;

  for (const t of newlyClosedTrades) {
    const isMainTrade = !t.tradeType || t.tradeType === 'main trade';
    if (!isMainTrade) continue;

    if (t.exitReason === 'SIGNAL_REVERSAL') {
      const oppositeSide = t.side === 'LONG' ? 'SHORT' : 'LONG';

      // Feature B
      if (config.flipModeUseExitRuleAsEntry) {
        return oppositeSide;
      }

      // Feature A
      if (config.exitOnSignalReversal && !config.useDifferentSignalSystemOnExit) {
        return oppositeSide;
      }
    }
  }

  return null;
}
