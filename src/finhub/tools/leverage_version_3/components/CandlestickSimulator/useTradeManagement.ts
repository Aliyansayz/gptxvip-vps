import React, { useState } from 'react';
import { Ohlc, calculateStopBandsSmooth } from '../../functions/api/indicators/baseline';
import { Trade } from '../../../types/trading';
import { evaluateTradeEntries } from '../../functions/api/rules/tradingRules';
import { syncTradeState } from '../../functions/api/trade_log_book/syncTradeState';
import { ParallelAccount } from '../../stores/indicators_store';
import { calculatePnL } from '../../functions/api/position_sizing/leveragedPositionSizeMetals';
import { hasOpenTradeSingleAccount } from '../../functions/api/rules/singleAccountTradingRules';
import { hasOpenTradeSerialAccount } from '../../functions/api/rules/serialAccountTradingRules';
import { hasOpenTradeParallelAccount } from '../../functions/api/rules/parallelAccountTradingRules';
import { getEligibleRootAccount } from '../../functions/api/accountState/accountEligibleToTrade';

export function useTradeManagement(
  data: Ohlc[],
  betaData: Ohlc[],
  deltaData: Ohlc[],
  simulationIndex: number,
  tradingConfig: any,
  leverageSettings: any,
  latencyDelaySeconds: number,
  simulationMode: string,
  parallelAccounts: ParallelAccount[],
  asset: string = 'Gold',
  serialTradingEnabled: boolean = false
) {
  const [trades, setTrades] = useState<Trade[]>([]);

  const handleManualTrade = (side: 'LONG' | 'SHORT') => {
    if (data.length === 0 || simulationIndex < 1 || tradingConfig.tradeBreaker) return;
    let customStopLossValue = undefined;

    if (tradingConfig.useStopLoss) {
      const stops = calculateStopBandsSmooth(data.slice(0, simulationIndex + 1), 10, 3.0, false, true);
      customStopLossValue = {
         upper: stops.upperBand[stops.upperBand.length - 1],
         lower: stops.lowerBand[stops.lowerBand.length - 1]
      };
    }

    setTrades(prev => {
      const currentPrice = data[simulationIndex]?.close || 0;
      const eligibleAccountId = getEligibleRootAccount(prev, leverageSettings.balance, leverageSettings, currentPrice, asset, serialTradingEnabled);

      let hasOpenTrade = false;
      if (serialTradingEnabled) {
        hasOpenTrade = hasOpenTradeSerialAccount(prev, eligibleAccountId);
      } else {
        const isParallelModeActive = prev.some(t => t.accountId && t.accountId !== 'A1' && !t.accountId.startsWith('S'));
        if (isParallelModeActive) {
          hasOpenTrade = hasOpenTradeParallelAccount(prev);
        } else {
          hasOpenTrade = hasOpenTradeSingleAccount(prev);
        }
      }

      if (hasOpenTrade) return prev; 
      
      let closedPnL = prev.filter(t => t.status === 'CLOSED').reduce((sum, t) => sum + (t.pnl || 0), 0);
      let currentBalance = leverageSettings.balance + closedPnL;

      const newTradesRaw = evaluateTradeEntries(
        simulationIndex, 
        data.slice(0, simulationIndex + 1), 
        side, 
        prev, 
        { ...tradingConfig, entryOnSignal: true }, 
        customStopLossValue, 
        undefined, 
        undefined, 
        leverageSettings, 
        currentBalance, 
        'None',
        asset,
        false,
        undefined,
        undefined,
        undefined,
        serialTradingEnabled,
        eligibleAccountId
      );
      
      const generateParallelTrades = (baseTrades: Trade[]) => {
        const pTrades: Trade[] = [];
        baseTrades.forEach(t => {
          if (!t.accountId || t.accountId === 'A1') {
            parallelAccounts.forEach(pa => {
              if (pa.simultaneousTradeState) {
                if (pa.tradeExecutionMode === 'normal') {
                  pTrades.push({ ...t, id: `${t.id}_${pa.id}`, accountId: pa.id });
                } else if (pa.tradeExecutionMode === 'invert') {
                  pTrades.push({ ...t, id: `${t.id}_${pa.id}`, accountId: pa.id, side: t.side === 'LONG' ? 'SHORT' : 'LONG' });
                } else if (pa.tradeExecutionMode === 'hedge') {
                  pTrades.push({ ...t, id: `${t.id}_${pa.id}_L`, accountId: pa.id, side: 'LONG', size: t.size / 2 });
                  pTrades.push({ ...t, id: `${t.id}_${pa.id}_S`, accountId: pa.id, side: 'SHORT', size: t.size / 2 });
                }
              }
            });
          }
        });
        return pTrades;
      };

      const newTrades = newTradesRaw.length > 0 ? [...newTradesRaw, ...generateParallelTrades(newTradesRaw)] : [];
      return newTrades.length > 0 ? [...prev, ...newTrades] : prev;
    });
  };

  const handleManualExit = () => {
    if (data.length === 0 || simulationIndex < 1) return;
    const currentCandle = data[simulationIndex];
    setTrades(prev => prev.map(t => {
      if (t.status === 'OPEN') {
         const priceDiff = t.side === 'LONG' 
          ? currentCandle.close - t.entryPrice 
          : t.entryPrice - currentCandle.close;
         const pipMultiplier = tradingConfig.pipMultiplier || 1;
         const pips = priceDiff / pipMultiplier;
         let pnl = 0;
         if (leverageSettings && leverageSettings.enabled) {
           pnl = calculatePnL(t.entryPrice, currentCandle.close, t.size || 1, t.side, asset);
         } else {
           pnl = priceDiff;
         }
         return {
           ...t,
           status: 'CLOSED',
           exitPrice: currentCandle.close,
           exitTime: currentCandle.time,
           exitIndex: simulationIndex,
           exitReason: 'MANUAL',
           pnl,
           pips,
         };
      }
      return t;
    }));
  }

  const handleManualCloseTrade = (tradeId: string) => {
    if (data.length === 0 || simulationIndex < 1) return;
    const currentCandle = data[simulationIndex];
    setTrades(prev => prev.map(t => {
      if (t.status === 'OPEN' && t.id === tradeId) {
         const priceDiff = t.side === 'LONG' 
          ? currentCandle.close - t.entryPrice 
          : t.entryPrice - currentCandle.close;
         const pipMultiplier = tradingConfig.pipMultiplier || 1;
         const pips = priceDiff / pipMultiplier;
         let pnl = 0;
         if (leverageSettings && leverageSettings.enabled) {
           pnl = calculatePnL(t.entryPrice, currentCandle.close, t.size || 1, t.side, asset);
         } else {
           pnl = priceDiff;
         }
         return {
           ...t,
           status: 'CLOSED',
           exitPrice: currentCandle.close,
           exitTime: currentCandle.time,
           exitIndex: simulationIndex,
           exitReason: 'MANUAL',
           pnl,
           pips,
         };
      }
      return t;
    }));
  };

  const handleReset = (setSimulationIndex: React.Dispatch<React.SetStateAction<number>>) => {
    setTrades([]);
    setSimulationIndex(50);
  }

  const hasActiveTrade = trades.some(t => t.status === 'OPEN');

  const syncedState = React.useMemo(() => {
    if (trades.length === 0) return { mainTrades: [], recurrentTrades: [] };
    return syncTradeState(trades, data, betaData, deltaData, simulationIndex, leverageSettings, latencyDelaySeconds, tradingConfig?.pipMultiplier, asset);
  }, [trades, data, betaData, deltaData, simulationIndex, leverageSettings, latencyDelaySeconds, tradingConfig, asset]);

  const displayTrades = React.useMemo(() => {
    const allActive = [...syncedState.mainTrades, ...syncedState.recurrentTrades];
    return trades.map(t => {
      if (t.status === 'OPEN') {
        const active = allActive.find(a => a.trade.id === t.id);
        if (active) {
          return {
            ...t,
            pnl: active.currentPnl,
            pips: active.currentPips
          };
        }
      }
      return t;
    });
  }, [trades, syncedState]);

  return {
    trades,
    setTrades,
    handleManualTrade,
    handleManualExit,
    handleManualCloseTrade,
    handleReset,
    hasActiveTrade,
    displayTrades
  };
}
