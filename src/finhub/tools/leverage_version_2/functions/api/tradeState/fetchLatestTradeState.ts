import { Trade } from '../../../../types/trading';
import { Ohlc } from '../indicators/baseline';
import { LeverageConfig, calculatePnL } from '../position_sizing/leveragedPositionSizeMetals';

export interface LatestTradeState {
  trade: Trade | null;
  isLeveraged: boolean;
  status: 'LOSS' | 'GAIN' | 'NEUTRAL';
  pnl: number;
  pips: number;
}

export function fetchLatestTradeState(
  trades: Trade[],
  alphaData: Ohlc[],
  betaData: Ohlc[],
  deltaData: Ohlc[],
  simulationIndex: number,
  leverageSettings?: LeverageConfig
): LatestTradeState {
  if (!trades || trades.length === 0) {
    return {
      trade: null,
      isLeveraged: !!leverageSettings?.enabled,
      status: 'NEUTRAL',
      pnl: 0,
      pips: 0
    };
  }

  // Get the most recent trade (assumed to be the last one in the array, or sort by entryTime)
  const sortedTrades = [...trades].sort((a, b) => b.entryTime - a.entryTime);
  const latestTrade = sortedTrades[0];

  const size = latestTrade.size || 1;
  let pnl = 0;
  let pips = 0;

  if (latestTrade.status === 'CLOSED') {
    // If it's closed, we use its already calculated PnL
    pnl = latestTrade.pnl || 0;
    pips = latestTrade.pips || 0;
  } else {
    // If it's open, calculate current floating PnL
    const alphaCandle = alphaData[simulationIndex];
    const betaCandle = betaData.length > 0 ? betaData[Math.min(betaData.length - 1, simulationIndex)] : undefined;
    const deltaCandle = deltaData.length > 0 ? deltaData[Math.min(deltaData.length - 1, simulationIndex)] : undefined;

    let worstPnl = Infinity;
    let worstPips = Infinity;

    const evaluatePrice = (price: number) => {
      let calculatedPnl = 0;
      const priceDiff = latestTrade.side === 'LONG' ? price - latestTrade.entryPrice : latestTrade.entryPrice - price;
      
      if (leverageSettings && leverageSettings.enabled) {
        calculatedPnl = calculatePnL(latestTrade.entryPrice, price, size, latestTrade.side as 'LONG' | 'SHORT');
      } else {
        calculatedPnl = priceDiff;
      }
      
      const calculatedPips = priceDiff;
      
      if (calculatedPnl < worstPnl) {
        worstPnl = calculatedPnl;
        worstPips = calculatedPips;
      }
    };

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
      pnl = 0;
      pips = 0;
    } else {
      pnl = worstPnl;
      pips = worstPips;
    }
  }

  let status: 'LOSS' | 'GAIN' | 'NEUTRAL' = 'NEUTRAL';
  if (pnl > 0) status = 'GAIN';
  else if (pnl < 0) status = 'LOSS';

  return {
    trade: latestTrade,
    isLeveraged: !!leverageSettings?.enabled,
    status,
    pnl,
    pips
  };
}
