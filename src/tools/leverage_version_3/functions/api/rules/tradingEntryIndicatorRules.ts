import { Trade } from '../../../../types/trading';
import { TradingRulesConfig } from './tradingRules';
import { Ohlc } from '../indicators/baseline';
import { isVolatilityEntryConditionMet } from './tradingVolatilityRules';
import { LeverageConfig } from '../position_sizing/leveragedPositionSizeMetals';
import { evaluateDynamicPositionSize, evaluateRiskPerPip } from '../position_sizing/leveragedDynamicPositionSize';
import { priceToPips } from '../middleware/pipsTranslation';
import { shouldAllowTradeByTimeFilter } from './timeFilterTradingRules';
import { evaluateAdaptiveRiskPercentage } from '../position_sizing/adaptivePositionSizing';

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
  currentBalance?: number,
  volRegimeScenario?: 'A'|'B'|'C'|'D'|'None',
  assetName: string = 'gold',
  isFlipSignal: boolean = false,
  slopePersistenceValue?: number,
  trendEfficiencyValue?: number
): Trade[] {
  if (!signal) return [];
  if (!config.entryOnSignal && !isFlipSignal) return [];

  // Volatility Filters (ADX, Squeeze, Regime, Slope Persistence, Trend Efficiency)
  if (!isVolatilityEntryConditionMet(config, adxValue, squeezeStatus, volRegimeScenario, slopePersistenceValue, trendEfficiencyValue)) {
    return [];
  }

  // Check if we already have an open trade
  const hasOpenTrade = activeTrades.some(t => t.status === 'OPEN');
  if (hasOpenTrade) return [];

  const currentCandle = data[currentIndex];
  
  // Apply Time Filter
  if (!shouldAllowTradeByTimeFilter(currentCandle.time, config.timeFilter)) {
    return [];
  }
  
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
      } else {
        // Evaluate adaptive logic could also scale `value` if we really wanted to, but the requirement specifically calls for percentage ranges applying to Risk/Pip and Risk ATR.
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
  }

  for (let i = 0; i < count; i++) {
    const mainTradeId = `trade-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
    trades.push({
      id: mainTradeId,
      tradeType: config.activeTradeType || 'main trade',
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
      executionType: executionTypeStr
    });

    if (config.isHftModeActive && (!config.activeTradeType || config.activeTradeType === 'main trade')) {
      const hftScale = config.hftScaleFactor || 1;
      const hftSize = Math.max(0.01, Number((evaluatedPositionSize * hftScale).toFixed(2)));
      const hftSide = signal === 'LONG' ? 'SHORT' : 'LONG';
      
      let hftStopLoss = undefined;
      let hftTakeProfit = undefined;
      
      if (config.hftSyncStopLoss) {
         if (stopLoss !== undefined) {
           const priceDiff = Math.abs(currentCandle.close - stopLoss);
           hftStopLoss = hftSide === 'LONG' ? (currentCandle.close - priceDiff) : (currentCandle.close + priceDiff);
           
           if (config.useTakeProfit) {
             const hftRisk = Math.abs(currentCandle.close - hftStopLoss);
             hftTakeProfit = hftSide === 'LONG' 
               ? (currentCandle.close + hftRisk * config.rewardRiskRatio) 
               : (currentCandle.close - hftRisk * config.rewardRiskRatio);
           }
         }
      } else {
         const pipMultiplier = config.pipMultiplier || 1;
         if (config.hftStopLossPips) {
           hftStopLoss = hftSide === 'LONG' 
             ? currentCandle.close - (config.hftStopLossPips * pipMultiplier) 
             : currentCandle.close + (config.hftStopLossPips * pipMultiplier);
         }
         
         const rr = config.hftRewardRiskRatio || 1.5;
         if (config.hftTakeProfitPips) {
           hftTakeProfit = hftSide === 'LONG'
             ? currentCandle.close + (config.hftTakeProfitPips * pipMultiplier)
             : currentCandle.close - (config.hftTakeProfitPips * pipMultiplier);
         } else if (config.hftStopLossPips) {
           const hftRisk = config.hftStopLossPips * pipMultiplier;
           hftTakeProfit = hftSide === 'LONG'
             ? currentCandle.close + (hftRisk * rr)
             : currentCandle.close - (hftRisk * rr);
         }
      }

      trades.push({
        id: `hft-${mainTradeId}`,
        tradeType: 'hft hedge trade',
        side: hftSide,
        entryPrice: currentCandle.close,
        entryTime: currentCandle.time,
        entryIndex: currentIndex,
        size: hftSize,
        status: 'OPEN',
        initialStopLoss: hftStopLoss,
        initialTakeProfit: hftTakeProfit,
        stopLoss: hftStopLoss,
        takeProfit: hftTakeProfit,
        executionType: executionTypeStr
      });
    }
  }

  return trades;
}
