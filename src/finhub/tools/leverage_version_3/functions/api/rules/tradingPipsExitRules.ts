import { Trade } from '../../../../types/trading';
import { TradingRulesConfig } from './tradingRules';

export function checkPipsExitConditions(
  trade: Trade,
  currentPrice: number,
  config: TradingRulesConfig
): { shouldExit: boolean, exitReason?: Trade['exitReason'] } {
  
  const isRecurrent = trade.tradeType === 'recurrent trade';
  const isHft = trade.tradeType === 'hft hedge trade';
  
  const pipsLimit = isHft 
    ? config.hftExitAfterNPips
    : (isRecurrent && config.recurrentTradeParams 
      ? config.recurrentTradeParams.exitAfterNPips 
      : config.exitAfterNPips);

  if (pipsLimit && pipsLimit > 0) {
    const pipMultiplier = config.pipMultiplier || 1;
    let earnedPips = 0;
    
    if (trade.side === 'LONG') {
      earnedPips = (currentPrice - trade.entryPrice) / pipMultiplier;
    } else {
      earnedPips = (trade.entryPrice - currentPrice) / pipMultiplier;
    }

    if (earnedPips >= pipsLimit) {
      return { shouldExit: true, exitReason: 'TAKE_PROFIT' };
    }
  }

  return { shouldExit: false };
}
