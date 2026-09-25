import { Trade } from '../../../../types/trading';
import { Ohlc } from '../indicators/baseline';
import { LeverageConfig, calculatePnL, calculateRequiredMargin } from '../position_sizing/leveragedPositionSizeMetals';

export interface ActiveTradeState {
  trade: Trade;
  isLeveraged: boolean;
  equity: number;
  currentPnl: number;
  currentPips: number;
  latencyDelaySeconds?: number;
}

export interface TradeStateSummary {
  mainTrades: ActiveTradeState[];
  recurrentTrades: ActiveTradeState[];
}

/**
 * Fetch active main trades across the 'Trade Log Book' with all their parameters.
 * Like leveraged account or non leverage, their equity.
 * Fetches the main trade loss or gain after every interval lowest of available among these data sources: (alpha, beta, delta).
 * Does the same for recurrent trade types too (not fully supported yet, but built to accommodate).
 */
export function fetchActiveTradeState(
  trades: Trade[],
  alphaData: Ohlc[],
  betaData: Ohlc[],
  deltaData: Ohlc[],
  simulationIndex: number,
  leverageSettings?: LeverageConfig,
  latencyDelaySeconds?: number,
  pipMultiplier?: number,
  asset?: string
): TradeStateSummary {
  const activeTrades = trades.filter((t) => t.status === 'OPEN');

  const mainTrades: ActiveTradeState[] = [];
  const recurrentTrades: ActiveTradeState[] = [];

  const betaIndex = Math.floor(simulationIndex / 1); // We would ideally need real index
  
  // To correctly evaluate "lowest of available among these data sources", we can
  // look at the current price from the lowest timeframe that has a candle.
  // Alpha is the most granular, so we check alpha first. If missing, we check beta, then delta.
  const alphaCandle = alphaData[simulationIndex];
  
  // Try to find the matching beta and delta candles if indices are available, or best approximation.
  const betaCandle = betaData.length > 0 ? betaData[Math.min(betaData.length - 1, simulationIndex)] : undefined;
  const deltaCandle = deltaData.length > 0 ? deltaData[Math.min(deltaData.length - 1, simulationIndex)] : undefined;

  activeTrades.forEach((trade) => {
    // We want the lowest possible floating PnL (worst-case) among the data sources
    const size = trade.size || 1;
    
    let worstPnl = Infinity;
    let worstPips = Infinity;

    const evaluatePrice = (price: number) => {
      let pnl = 0;
      const priceDiff = trade.side === 'LONG' ? price - trade.entryPrice : trade.entryPrice - price;
      
      if (leverageSettings && leverageSettings.enabled) {
        pnl = calculatePnL(trade.entryPrice, price, size, trade.side as 'LONG' | 'SHORT', asset);
      } else {
        pnl = priceDiff;
      }
      
      const pips = priceDiff / (pipMultiplier || 1);
      
      if (pnl < worstPnl) {
        worstPnl = pnl;
        worstPips = pips;
      }
    };

    // Check high and low for each available candle to find the extreme worst case in the current intervals
    if (alphaCandle) {
      evaluatePrice(alphaCandle.low);
      evaluatePrice(alphaCandle.high);
      evaluatePrice(alphaCandle.close);
    }
    if (betaCandle) {
      evaluatePrice(betaCandle.low);
      evaluatePrice(betaCandle.high);
      evaluatePrice(betaCandle.close);
    }
    if (deltaCandle) {
      evaluatePrice(deltaCandle.low);
      evaluatePrice(deltaCandle.high);
      evaluatePrice(deltaCandle.close);
    }

    if (worstPnl === Infinity) {
      worstPnl = 0;
      worstPips = 0;
    }

    const currentPnl = worstPnl;
    const pips = worstPips;
    
    // Basic equity calculation
    let isLeveraged = false;
    let equity = currentPnl;

    if (leverageSettings && leverageSettings.enabled) {
      isLeveraged = true;
      // In leverage mode, initial margin + pnl = equity for the trade
      const margin = calculateRequiredMargin(trade.entryPrice, size, leverageSettings.leverage, asset);
      equity = margin + currentPnl;
    } else {
      // Non-leveraged, base equity is size * entry
      const baseValue = trade.entryPrice * size * 100; // 100 is contract size factor for leverage version
      equity = baseValue + currentPnl;
    }

    const tradeState: ActiveTradeState = {
      trade,
      isLeveraged,
      equity,
      currentPnl,
      currentPips: pips,
      latencyDelaySeconds,
    };

    if (trade.tradeType === 'recurrent trade') {
      recurrentTrades.push(tradeState);
    } else {
      // Default to main trade
      mainTrades.push(tradeState);
    }
  });

  return {
    mainTrades,
    recurrentTrades,
  };
}

