import { Trade } from '../../../../types/trading';
import { TradingRulesConfig } from './tradingRules';
import { calculateVolatilityAdjustedLimit } from './tradingVolatilityRules';
import { VolatilityState } from '../tradeState/fetchVolatilityState';
import { LatestTradeState } from '../tradeState/fetchLatestTradeState';
import { Ohlc } from '../indicators/baseline';
import { LeverageConfig } from '../position_sizing/leveragedPositionSizeMetals';
import { evaluateDynamicPositionSize, evaluateRiskPerPip } from '../position_sizing/leveragedDynamicPositionSize';
import { priceToPips } from '../middleware/pipsTranslation';
import { calculateRecurrentPositionSize } from '../position_sizing/recurrentPositionSizing';
import { isSufficientBalanceToOpenTrade } from './leverageTradingRules';
import { fetchMainTradeTrailEventCount } from '../tradeState/fetchMainTradeTrailEventCount';
import { evaluateAdaptiveRiskPercentage } from '../position_sizing/adaptivePositionSizing';
import { evaluateRecurrentTradeConditionsState, evaluateRecurrentTradeReversalTriggers } from '../indicatorStatus/recurrentTradeConditions';
import { isTradeRestricted } from './tradeRestriction';

/**
 * Recurrent Trades Logic:
 * Defines whether a new recurrent trade should be spawned.
 */

import { evaluateCandlePatternAcrossSources } from '../indicatorState/trackCandlePatternTracker';

export function canOpenRecurrentTrade(
  referenceTrade: Trade,
  currentTimeMs: number,
  currentIndex: number,
  config: TradingRulesConfig,
  latestTradeState: LatestTradeState,
  volatilityState?: VolatilityState,
  multiSources?: { alpha: Ohlc[], beta: Ohlc[], delta: Ohlc[] },
  allowedPatterns?: Record<string, boolean>
): { canOpen: boolean; adjustedSecondsLimit: number; adjustedCandlesLimit: number; reason?: string } {
  if (!config.isRecurrentTradeActive || !config.recurrentTradeParams) {
    return { canOpen: false, adjustedSecondsLimit: 0, adjustedCandlesLimit: 0, reason: 'Recurrent trade inactive' };
  }

  // Candle Pattern Based Entry
  let candlePatternMet = false;
  let candlePatternReason = '';
  if (
    config.recurrentTradeParams.entryOnCandlePattern &&
    config.recurrentTradeParams.entryOnCandlePatternSource &&
    config.recurrentTradeParams.entryOnCandlePatternSource !== 'none' &&
    multiSources
  ) {
    const parentTrade = referenceTrade; // We use main trade direction
    const directionWanted = parentTrade.side; // Assuming referenceTrade has 'side' matching main trade
    const res = evaluateCandlePatternAcrossSources(
       multiSources,
       config.recurrentTradeParams.entryOnCandlePatternSource,
       directionWanted,
       currentIndex,
       allowedPatterns
    );
    if (res) {
       candlePatternMet = true;
       candlePatternReason = `Candle Pattern: ${res.pattern} (Source: ${res.source})`;
    }
  }

  // Trend Revert or Candles Revert Based Entry
  let trendRevertMet = false;
  let candlesRevertMet = false;
  if (
    multiSources &&
    multiSources.alpha &&
    (config.recurrentTradeParams.entryOnTrendRevert || config.recurrentTradeParams.entryOnCandlesRevert)
  ) {
    const parentTrade = referenceTrade;
    const directionWanted = parentTrade.side;
    const res = evaluateRecurrentTradeReversalTriggers(multiSources.alpha, directionWanted);
    if (config.recurrentTradeParams.entryOnTrendRevert && res.trendStrengthRevert) {
      trendRevertMet = true;
    }
    if (config.recurrentTradeParams.entryOnCandlesRevert && res.candlesRevert) {
      candlesRevertMet = true;
    }
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

  // If no time/candle limitations are set and triggers are set, time/candles count as unmet to avoid instant execution
  if (!adjustedSecondsLimit && !adjustedCandlesLimit && (pipsTrigger > 0 || config.recurrentTradeParams.entryOnCandlePattern || config.recurrentTradeParams.entryOnTrendRevert || config.recurrentTradeParams.entryOnCandlesRevert)) {
      timeMet = false;
      candlesMet = false;
  }

  // Evaluate if any limits are met OR any triggers are met
  const isTriggered = pipsMet || (timeMet && candlesMet) || candlePatternMet || trendRevertMet || candlesRevertMet;

  if (!isTriggered) {
    return { canOpen: false, adjustedSecondsLimit, adjustedCandlesLimit, reason: 'Delay not met, Pips not met, and no Candle Pattern/Trend/Candle Reversal trigger hit' };
  }

  // 2. Only Execute if latest trade is in surplus (applies primarily to time-based spawns)
  if (config.recurrentTradeParams.onlyExecuteIfLatestTradeInSurplus && !pipsMet && !candlePatternMet && !trendRevertMet && !candlesRevertMet) {
    if (latestTradeState.status !== 'GAIN') {
      return { canOpen: false, adjustedSecondsLimit, adjustedCandlesLimit, reason: `Latest trade not in surplus (Current: ${latestTradeState.pips.toFixed(1)} pips)` };
    }
  }

  // Additional parallel indicator checks
  if (multiSources && multiSources.alpha) {
    const parentDirection = referenceTrade.side;
    
    const hasAnyActiveFilter = 
      config.recurrentTradeParams.onlyExecuteIfSqueezeMomentumValid ||
      (config.recurrentTradeParams.adxFilterThreshold !== undefined && config.recurrentTradeParams.adxFilterThreshold > 0) ||
      config.recurrentTradeParams.onlyExecuteIfTrendStrengthFavorable ||
      config.recurrentTradeParams.onlyExecuteIfHeikinAshiFavorable;

    if (hasAnyActiveFilter) {
      const {
        isSqueezeValid,
        isAdxValid,
        isTrendStrengthFavorable,
        isHeikinAshiFavorable
      } = evaluateRecurrentTradeConditionsState(
        multiSources.alpha,
        parentDirection,
        config.recurrentTradeParams.adxFilterThreshold ?? 18
      );

      if (config.recurrentTradeParams.onlyExecuteIfSqueezeMomentumValid && !isSqueezeValid) {
        return { canOpen: false, adjustedSecondsLimit, adjustedCandlesLimit, reason: `Squeeze Momentum is not valid (firing/expansion)` };
      }
      if (config.recurrentTradeParams.adxFilterThreshold !== undefined && config.recurrentTradeParams.adxFilterThreshold > 0 && !isAdxValid) {
        return { canOpen: false, adjustedSecondsLimit, adjustedCandlesLimit, reason: `ADX is below threshold (${config.recurrentTradeParams.adxFilterThreshold})` };
      }
      if (config.recurrentTradeParams.onlyExecuteIfTrendStrengthFavorable && !isTrendStrengthFavorable) {
         return { canOpen: false, adjustedSecondsLimit, adjustedCandlesLimit, reason: `Trend Strength is not favorable to ${parentDirection}` };
      }
      if (config.recurrentTradeParams.onlyExecuteIfHeikinAshiFavorable && !isHeikinAshiFavorable) {
         return { canOpen: false, adjustedSecondsLimit, adjustedCandlesLimit, reason: `Heikin Ashi is not favorable to ${parentDirection}` };
      }
    }
  }

  // Determine a simple, clean, and helpful human trigger reason for the log book status
  let triggeredReason = '';
  if (candlePatternMet) {
    triggeredReason = candlePatternReason;
  } else if (trendRevertMet) {
    triggeredReason = 'Trend Strength Revert (Opposite -> Main with Strong Strength)';
  } else if (candlesRevertMet) {
    triggeredReason = 'Smoothing Candles Revert (Opposite -> Main)';
  } else if (pipsMet) {
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
  assetName: string = 'gold',
  multiSources?: { alpha: Ohlc[], beta: Ohlc[], delta: Ohlc[] },
  allowedPatterns?: Record<string, boolean>
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

  let canOpenResult = canOpenRecurrentTrade(referenceTrade, currentCandle.time, currentIndex, config, latestTradeState, volatilityState, multiSources, allowedPatterns);
  
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
  
  if (isTradeRestricted(config, signal === 'LONG' ? 'long' : 'short')) {
    return [];
  }
  
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
      let riskVal = leverageConfig.dynamicRiskPerPipValue || 1;
      if (leverageConfig.dynamicRiskPerPipType === 'percentage') {
        let basePct = leverageConfig.dynamicRiskPerPipPercentage || 1;
        // Adaptive override
        const historicalData = data.slice(0, currentIndex + 1);
        basePct = evaluateAdaptiveRiskPercentage(basePct, leverageConfig, historicalData);
        riskVal = currentBalance * (basePct / 100);
      }

      const evaluation = evaluateRiskPerPip(
        currentBalance,
        currentCandle.close,
        leverageConfig.leverage,
        riskVal,
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
    } else if (leverageConfig.positionSizingType === 'dynamic_risk_atr_pips' && currentBalance !== undefined) {
      let atrPips = leverageConfig.explicitLiquidationPips || 50;
      if (stopLoss !== undefined) {
        const priceMove = Math.abs(currentCandle.close - stopLoss);
        const calcPips = priceToPips(priceMove, assetName, currentCandle.close);
        if (calcPips > 0) atrPips = calcPips;
      }
      
      let basePct = leverageConfig.dynamicRiskAtrPipsPercentage || 2;
      const historicalData = data.slice(0, currentIndex + 1);
      basePct = evaluateAdaptiveRiskPercentage(basePct, leverageConfig, historicalData);

      const evaluation = evaluateDynamicPositionSize(
        currentBalance,
        currentCandle.close,
        leverageConfig.leverage,
        'percentage',
        basePct,
        atrPips,
        undefined,
        assetName
      );
      evaluatedPositionSize = Math.max(0.01, evaluation.possibleLotSize);
    } else {
      evaluatedPositionSize = leverageConfig.positionSize;
    }
    
    // Recurrent position sizing mode
    if (leverageConfig.recurrentPositionSizingMode === 'DYNAMIC_RISK_ATR_PIPS' && currentBalance !== undefined) {
      let atrPips = leverageConfig.explicitLiquidationPips || 50;
      if (stopLoss !== undefined) {
        const priceMove = Math.abs(currentCandle.close - stopLoss);
        const calcPips = priceToPips(priceMove, assetName, currentCandle.close);
        if (calcPips > 0) atrPips = calcPips;
      }
      
      const riskPercentage = leverageConfig.recurrentRiskAtrPipsPercentage !== undefined ? leverageConfig.recurrentRiskAtrPipsPercentage : (leverageConfig.dynamicRiskAtrPipsPercentage || 2);
      const evaluation = evaluateDynamicPositionSize(
        currentBalance,
        currentCandle.close,
        leverageConfig.leverage,
        'percentage',
        riskPercentage,
        atrPips,
        undefined,
        assetName
      );
      evaluatedPositionSize = Math.max(0.01, evaluation.possibleLotSize);
    } else if (leverageConfig.recurrentPositionSizingMode === 'DYNAMIC_RISK_PER_PIP' && currentBalance !== undefined) {
      let riskVal = leverageConfig.recurrentRiskPerPipValue !== undefined ? leverageConfig.recurrentRiskPerPipValue : (leverageConfig.dynamicRiskPerPipValue || 1);
      const type = leverageConfig.recurrentRiskPerPipType || 'value';
      if (type === 'percentage') {
        const basePct = leverageConfig.recurrentRiskPerPipPercentage !== undefined ? leverageConfig.recurrentRiskPerPipPercentage : (leverageConfig.dynamicRiskPerPipPercentage || 1);
        riskVal = currentBalance * (basePct / 100);
      }
      const evaluation = evaluateRiskPerPip(
        currentBalance,
        currentCandle.close,
        leverageConfig.leverage,
        riskVal,
        undefined,
        assetName
      );
      evaluatedPositionSize = Math.max(0.01, evaluation.possibleLotSize);
    } else if (leverageConfig.recurrentPositionSizingMode) {
      evaluatedPositionSize = calculateRecurrentPositionSize(
        evaluatedPositionSize,
        leverageConfig.recurrentPositionSizingMode,
        leverageConfig.recurrentTradeWeightFactor ?? 0.33,
        leverageConfig.recurrentFloatingGainPercentage ?? 20,
        activeTrades,
        currentCandle.close,
        leverageConfig,
        assetName
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
    initialStopLoss: stopLoss,
    initialTakeProfit: takeProfit,
    stopLoss,
    takeProfit,
    executionType: 'MARKET_EXECUTION',
    infoStatus: `Triggered by ${canOpenResult.reason}`
  };

  return [newTrade];
}
