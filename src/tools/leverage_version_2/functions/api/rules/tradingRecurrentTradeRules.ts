import { Trade } from '../../../../types/trading';
import { TradingRulesConfig } from './tradingRules';
import { calculateVolatilityAdjustedLimit } from './tradingVolatilityRules';
import { VolatilityState } from '../tradeState/fetchVolatilityState';
import { LatestTradeState } from '../tradeState/fetchLatestTradeState';
import { Ohlc } from '../indicators/baseline';
import { LeverageConfig } from '../position_sizing/leveragedPositionSizeMetals';
import { evaluateDynamicPositionSize, evaluateRiskPerPip } from '../position_sizing/leveragedDynamicPositionSize';
import { calculateRecurrentPositionSize } from '../position_sizing/recurrentPositionSizing';
import { isSufficientBalanceToOpenTrade } from './leverageTradingRules';
import { fetchMainTradeTrailEventCount } from '../tradeState/fetchMainTradeTrailEventCount';

/**
 * Recurrent Trades Logic:
 * Defines whether a new recurrent trade should be spawned.
 */

export function canOpenRecurrentTrade(
  referenceTrade: Trade,
  currentTimeMs: number,
  currentIndex: number,
  config: TradingRulesConfig,
  latestTradeState: LatestTradeState,
  volatilityState?: VolatilityState
): { canOpen: boolean; adjustedSecondsLimit: number; adjustedCandlesLimit: number; reason?: string } {
  if (!config.isRecurrentTradeActive || !config.recurrentTradeParams) {
    return { canOpen: false, adjustedSecondsLimit: 0, adjustedCandlesLimit: 0, reason: 'Recurrent trade inactive' };
  }

  // Pips based entry evaluation
  // If price moves X pips in favor of main trade direction (since the latest trade)
  const pipsTrigger = config.recurrentTradeParams.entryOnPipsFavor || 0;
  let pipsMet = false;
  
  if (pipsTrigger > 0 && latestTradeState.pips >= pipsTrigger) {
    pipsMet = true;
  }

  // 1. Time evaluation
  const zScoreValue = volatilityState?.zScore?.value ?? undefined;
  
  const { entryAfterNSeconds, entryAfterNSecondsMin, entryAfterNSecondsMax, entryAfterNCandles, entryAfterNCandlesMin, entryAfterNCandlesMax } = config.recurrentTradeParams;
  const adjustedSecondsLimit = calculateVolatilityAdjustedLimit(
    entryAfterNSeconds,
    entryAfterNSecondsMin,
    entryAfterNSecondsMax,
    zScoreValue
  );

  const timeDiffMs = currentTimeMs - referenceTrade.entryTime;
  const secondsDiff = timeDiffMs / 1000;

  let timeMet = true;
  if (adjustedSecondsLimit > 0) {
    if (secondsDiff < adjustedSecondsLimit) {
      timeMet = false;
    }
  }

  const adjustedCandlesLimit = calculateVolatilityAdjustedLimit(
    entryAfterNCandles,
    entryAfterNCandlesMin,
    entryAfterNCandlesMax,
    zScoreValue
  );

  let candlesMet = true;
  if (adjustedCandlesLimit > 0) {
    const candlesDiff = currentIndex - referenceTrade.entryIndex;
    if (candlesDiff < adjustedCandlesLimit) {
      candlesMet = false;
    }
  }

  // If no time/candle limitations are set and pips trigger is set, time counts as unmet to avoid instant execution
  if (!adjustedSecondsLimit && !adjustedCandlesLimit && pipsTrigger > 0) {
      timeMet = false;
      candlesMet = false;
  }

  // Evaluate if either the Time/Candle limits are met OR Pips based limit is met.
  const isTriggered = pipsMet || (timeMet && candlesMet);

  if (!isTriggered) {
    return { canOpen: false, adjustedSecondsLimit, adjustedCandlesLimit, reason: 'Time/Candle delay not met, and Pips target not met' };
  }

  // 2. Only Execute if latest trade is in surplus (applies primarily to time-based spawns)
  if (config.recurrentTradeParams.onlyExecuteIfLatestTradeInSurplus && !pipsMet) {
    if (latestTradeState.status !== 'GAIN') {
      return { canOpen: false, adjustedSecondsLimit, adjustedCandlesLimit, reason: `Latest trade not in surplus (Current: ${latestTradeState.pips.toFixed(1)} pips)` };
    }
  }

  // Determine a simple, clean, and helpful human trigger reason for the log book status
  let triggeredReason = '';
  if (pipsMet) {
    triggeredReason = `Pips Favorite Trigger (+${latestTradeState.pips.toFixed(1)} pips >= +${pipsTrigger.toFixed(1)})`;
  } else {
    const reasonParts: string[] = [];
    if (adjustedSecondsLimit > 0) {
      reasonParts.push(`Time Delay (${secondsDiff.toFixed(0)}s >= ${adjustedSecondsLimit.toFixed(0)}s)`);
    }
    if (adjustedCandlesLimit > 0) {
      const candlesDiff = currentIndex - referenceTrade.entryIndex;
      reasonParts.push(`Candle Delay (${candlesDiff} >= ${adjustedCandlesLimit})`);
    }
    if (reasonParts.length === 0) {
      reasonParts.push('Triggered');
    }
    triggeredReason = reasonParts.join(' & ');
  }

  return { canOpen: true, adjustedSecondsLimit, adjustedCandlesLimit, reason: triggeredReason };
}

export function evaluateRecurrentTradeEntries(
  currentIndex: number,
  data: Ohlc[],
  activeTrades: Trade[],
  config: TradingRulesConfig,
  latestTradeState: LatestTradeState,
  volatilityState?: VolatilityState,
  leverageConfig?: LeverageConfig,
  currentBalance?: number,
  assetName: string = 'gold'
): Trade[] {
  if (!config.isRecurrentTradeActive || !config.recurrentTradeParams) {
    return [];
  }

  // Find the original main trade that is driving this
  const mainTrades = activeTrades.filter(t => t.tradeType === 'main trade');
  if (mainTrades.length === 0) return [];
  const parentTrade = mainTrades[mainTrades.length - 1]; // Use the most recent main trade

  // We only spawn recurrent trades if the parent trade is still OPEN
  if (parentTrade.status !== 'OPEN') return [];

  // Check count tied to the current parent trade (excluding rejected margin checks so a failed margin check doesn't lock execution forever)
  const recurrentTrades = activeTrades.filter(
    t => t.tradeType === 'recurrent trade' && 
         t.entryTime >= parentTrade.entryTime && 
         t.exitReason !== 'REJECTED'
  );
  if (recurrentTrades.length >= config.recurrentTradeParams.countToExecute) {
    return [];
  }

  const currentCandle = data[currentIndex];
  
  // What time should we use as reference? The parent main trade or the latest recurrent trade?
  // Usually, it's interval from the parent, OR from the latest trade.
  // The rule function takes `referenceTrade`. We'll pass the latest trade as the reference.
  const referenceTrade = latestTradeState.trade || parentTrade;

  let canOpenResult = canOpenRecurrentTrade(referenceTrade, currentCandle.time, currentIndex, config, latestTradeState, volatilityState);
  
  if (config.recurrentTradeParams.entryOnMainTradeTrail && parentTrade.lastTrailIndex === currentIndex) {
    const totalTrails = fetchMainTradeTrailEventCount(activeTrades);
    canOpenResult = {
      canOpen: true,
      adjustedSecondsLimit: 0,
      adjustedCandlesLimit: 0,
      reason: `Main Trade SL Trail Event #${totalTrails}`
    };
  }

  if (!canOpenResult.canOpen) {
    return [];
  }

  // Leverage Check
  if (leverageConfig && leverageConfig.enabled && currentBalance !== undefined) {
    if (!isSufficientBalanceToOpenTrade(currentCandle.close, leverageConfig, currentBalance, assetName)) {
       // Log rejected trade to log book so it consumes a count and stops spamming
       const rejectedTrade: Trade = {
         id: `recurrent-rejected-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
         tradeType: 'recurrent trade',
         side: parentTrade.side,
         entryPrice: currentCandle.close,
         entryTime: currentCandle.time,
         entryIndex: currentIndex,
         size: 0,
         status: 'CLOSED', // So it doesn't stay open
         exitPrice: currentCandle.close,
         exitTime: currentCandle.time,
         exitIndex: currentIndex,
         exitReason: 'REJECTED',
         pnl: 0,
         pips: 0,
         executionType: 'MARKET_EXECUTION',
         infoStatus: `Rejected: Margin. Triggered by ${canOpenResult.reason}`,
         balanceAfter: currentBalance
       };
       return [rejectedTrade];
    }
  }

  // Open recurrent trade in the SAME direction as main trade
  const signal = parentTrade.side;
  
  let stopLoss = undefined;
  let takeProfit = undefined;

  // Let's just use the same stop loss / take profit pips logic as main trade, or inherit from config
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

  let evaluatedPositionSize = leverageConfig ? leverageConfig.positionSize : 1;

  if (leverageConfig && leverageConfig.enabled) {
    if (leverageConfig.positionSizingType === 'dynamic_risk_per_pip' && currentBalance !== undefined) {
      const evaluation = evaluateRiskPerPip(
        currentBalance,
        currentCandle.close,
        leverageConfig.leverage,
        leverageConfig.dynamicRiskPerPipValue || 1,
        undefined,
        assetName
      );
      evaluatedPositionSize = Math.max(0.01, evaluation.possibleLotSize);
    } else if (leverageConfig.positionSizingType === 'dynamic_margin' && currentBalance !== undefined) {
      const evaluation = evaluateDynamicPositionSize(
        currentBalance,
        currentCandle.close,
        leverageConfig.leverage,
        leverageConfig.dynamicMarginType || 'percentage',
        leverageConfig.dynamicMarginType === 'value' ? (leverageConfig.dynamicMarginValue || 100) : (leverageConfig.dynamicMarginPercentage || 5),
        leverageConfig.useExplicitLiquidationPips ? leverageConfig.explicitLiquidationPips : undefined,
        undefined,
        assetName
      );
      evaluatedPositionSize = Math.max(0.01, evaluation.possibleLotSize);
    } else {
      evaluatedPositionSize = leverageConfig.positionSize;
    }
    
    // Recurrent position sizing mode
    if (leverageConfig.recurrentPositionSizingMode) {
      evaluatedPositionSize = calculateRecurrentPositionSize(
        evaluatedPositionSize,
        leverageConfig.recurrentPositionSizingMode,
        leverageConfig.recurrentTradeWeightFactor ?? 0.33,
        leverageConfig.recurrentFloatingGainPercentage ?? 20,
        activeTrades,
        currentCandle.close,
        leverageConfig
      );
    } else {
      const weightFactor = leverageConfig.recurrentTradeWeightFactor ?? 0.33;
      evaluatedPositionSize = Math.max(0.01, Number((evaluatedPositionSize * weightFactor).toFixed(2)));
    }
  } else {
    // If not enabled or no leverage Config
    const weightFactor = leverageConfig?.recurrentTradeWeightFactor ?? 0.33;
    evaluatedPositionSize = Math.max(0.01, Number((evaluatedPositionSize * weightFactor).toFixed(2)));
  }

  const newTrade: Trade = {
    id: `recurrent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    tradeType: 'recurrent trade',
    side: signal,
    entryPrice: currentCandle.close,
    entryTime: currentCandle.time,
    entryIndex: currentIndex,
    size: evaluatedPositionSize,
    status: 'OPEN',
    stopLoss,
    takeProfit,
    executionType: 'MARKET_EXECUTION',
    infoStatus: `Triggered by ${canOpenResult.reason}`
  };

  return [newTrade];
}
