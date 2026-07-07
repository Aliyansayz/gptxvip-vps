import { Trade } from '../../../../types/trading';
import { TradingRulesConfig } from './tradingRules';
import { Ohlc } from '../indicators/baseline';
import { isVolatilityEntryConditionMet } from './tradingVolatilityRules';
import { LeverageConfig } from '../position_sizing/leveragedPositionSizeMetals';
import { evaluateDynamicPositionSize } from '../position_sizing/leveragedDynamicPositionSize';

export function processIndicatorBasedEntry(
  currentIndex: number,
  data: Ohlc[],
  signal: 'LONG' | 'SHORT' | null,
  activeTrades: Trade[],
  config: TradingRulesConfig,
  customStopLossValue?: { upper: number, lower: number },
  adxValue?: number,
  squeezeStatus?: number,
  leverageConfig?: LeverageConfig,
  currentBalance?: number
): Trade[] {
  if (!config.entryOnSignal || !signal) return [];

  // Volatility Filters (ADX, Squeeze)
  if (!isVolatilityEntryConditionMet(config, adxValue, squeezeStatus)) {
    return [];
  }

  // Check if we already have an open trade
  const hasOpenTrade = activeTrades.some(t => t.status === 'OPEN');
  if (hasOpenTrade) return [];

  const currentCandle = data[currentIndex];
  
  let stopLoss = undefined;
  let takeProfit = undefined;

  if (config.useStopLoss && customStopLossValue) {
    if (signal === 'LONG') {
      stopLoss = customStopLossValue.lower;
      if (config.useTakeProfit) {
        const risk = currentCandle.close - stopLoss;
        takeProfit = currentCandle.close + (risk * config.rewardRiskRatio);
      }
    } else {
      stopLoss = customStopLossValue.upper;
      if (config.useTakeProfit) {
        const risk = stopLoss - currentCandle.close;
        takeProfit = currentCandle.close - (risk * config.rewardRiskRatio);
      }
    }
  } else {
    // Fixed Pip-based Limit
    if (config.stopLossPips !== undefined && config.stopLossPips > 0) {
      const pipMultiplier = config.pipMultiplier || 1;
      if (signal === 'LONG') {
        stopLoss = currentCandle.close - (config.stopLossPips * pipMultiplier);
      } else {
        stopLoss = currentCandle.close + (config.stopLossPips * pipMultiplier);
      }
    }

    if (config.takeProfitPips !== undefined && config.takeProfitPips > 0) {
      const pipMultiplier = config.pipMultiplier || 1;
      if (signal === 'LONG') {
        takeProfit = currentCandle.close + (config.takeProfitPips * pipMultiplier);
      } else {
        takeProfit = currentCandle.close - (config.takeProfitPips * pipMultiplier);
      }
    }
  }

  const count = config.mainTradeParams?.countToExecute || 1;
  const executionTypeStr = config.mainTradeParams?.executionType === 'market execution' ? 'MARKET_EXECUTION' : 'MARKET_EXECUTION';
  const trades: Trade[] = [];
  
  let evaluatedPositionSize = 1;
  if (leverageConfig && leverageConfig.enabled) {
    if (leverageConfig.positionSizingType === 'dynamic_margin' && currentBalance !== undefined) {
      const evaluation = evaluateDynamicPositionSize(
        currentBalance,
        currentCandle.close,
        leverageConfig.leverage,
        leverageConfig.dynamicMarginType || 'percentage',
        leverageConfig.dynamicMarginType === 'value' ? (leverageConfig.dynamicMarginValue || 100) : (leverageConfig.dynamicMarginPercentage || 5),
        leverageConfig.useExplicitLiquidationPips ? leverageConfig.explicitLiquidationPips : undefined
      );
      evaluatedPositionSize = Math.max(0.01, evaluation.possibleLotSize);
    } else {
      evaluatedPositionSize = leverageConfig.positionSize;
    }
  }

  for (let i = 0; i < count; i++) {
    trades.push({
      id: `trade-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      tradeType: config.activeTradeType || 'main trade',
      side: signal,
      entryPrice: currentCandle.close,
      entryTime: currentCandle.time,
      entryIndex: currentIndex,
      size: evaluatedPositionSize,
      status: 'OPEN',
      stopLoss,
      takeProfit,
      executionType: executionTypeStr
    });
  }

  return trades;
}
