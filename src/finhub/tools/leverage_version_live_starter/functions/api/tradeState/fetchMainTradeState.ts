import { Trade } from '../../../../types/trading';
import { Ohlc } from '../../../../leverage_version_3/functions/api/indicators/baseline';
import { LeverageConfig, calculatePnL, calculateRequiredMargin } from '../../../../leverage_version_3/functions/api/position_sizing/leveragedPositionSizeMetals';

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
  hftTrades: ActiveTradeState[];
}

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
  const hftTrades: ActiveTradeState[] = [];

  const betaIndex = Math.floor(simulationIndex / 1); 

  
  const alphaCandle = alphaData[simulationIndex];
  
  const betaCandle = betaData.length > 0 ? betaData[Math.min(betaData.length - 1, simulationIndex)] : undefined;
  const deltaCandle = deltaData.length > 0 ? deltaData[Math.min(deltaData.length - 1, simulationIndex)] : undefined;

  activeTrades.forEach((trade) => {
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
    
    let isLeveraged = false;
    let equity = currentPnl;

    if (leverageSettings && leverageSettings.enabled) {
      isLeveraged = true;
      const margin = calculateRequiredMargin(trade.entryPrice, size, leverageSettings.leverage, asset);
      equity = margin + currentPnl;
    } else {
      const baseValue = trade.entryPrice * size * 100;
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
    } else if (trade.tradeType === 'hft hedge trade') {
      hftTrades.push(tradeState);
    } else {
      mainTrades.push(tradeState);
    }
  });

  return {
    mainTrades,
    recurrentTrades,
    hftTrades,
  };
}
