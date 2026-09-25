import { Trade } from '../../../../types/trading';

export interface TradeMetrics {
  profitFactor: number;
  maxDrawdownValue: number;
  maxDrawdownPercent: number;
  expectancy: number;
  avgGain: number;
  avgLoss: number;
  avgConsecutiveWins: number;
  avgConsecutiveLosses: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
}

export function calculateTradeMetrics(closedTrades: Trade[], initialBalance?: number): TradeMetrics {
  const sortedTrades = [...closedTrades]
    .filter(t => t.status === 'CLOSED')
    .sort((a, b) => (a.exitTime || 0) - (b.exitTime || 0));

  const totalTrades = sortedTrades.length;
  if (totalTrades === 0) {
    return {
      profitFactor: 0,
      maxDrawdownValue: 0,
      maxDrawdownPercent: 0,
      expectancy: 0,
      avgGain: 0,
      avgLoss: 0,
      avgConsecutiveWins: 0,
      avgConsecutiveLosses: 0,
      maxConsecutiveWins: 0,
      maxConsecutiveLosses: 0,
    };
  }

  // 1. Profit Factor & Wins/Losses setup
  const wins = sortedTrades.filter(t => (t.pnl || 0) > 0);
  const losses = sortedTrades.filter(t => (t.pnl || 0) < 0);
  
  const grossProfit = wins.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const grossLoss = Math.abs(losses.reduce((sum, t) => sum + (t.pnl || 0), 0));
  
  const profitFactor = grossLoss === 0 
    ? (grossProfit > 0 ? Infinity : 1) 
    : grossProfit / grossLoss;

  // 2. Average Gain & Average Loss
  const avgGain = wins.length > 0 ? grossProfit / wins.length : 0;
  const avgLoss = losses.length > 0 ? grossLoss / losses.length : 0;

  // 3. Expectancy
  const winRate = wins.length / totalTrades;
  const lossRate = 1 - winRate;
  const expectancy = (winRate * avgGain) - (lossRate * avgLoss);

  // 4. Max Drawdown
  let startBalance = initialBalance ?? 100000;
  if (sortedTrades.length > 0) {
    const first = sortedTrades[0];
    const deducedBefore = (first.balanceAfter ?? startBalance) - (first.pnl ?? 0);
    startBalance = deducedBefore > 0 ? deducedBefore : startBalance;
  }

  let currentBalance = startBalance;
  let peak = currentBalance;
  let maxDrawdownValue = 0;
  let maxDrawdownPercent = 0;

  for (const trade of sortedTrades) {
    currentBalance += (trade.pnl || 0);
    if (currentBalance > peak) {
      peak = currentBalance;
    }
    const ddValue = peak - currentBalance;
    const ddPercent = peak > 0 ? (ddValue / peak) * 100 : 0;

    if (ddValue > maxDrawdownValue) maxDrawdownValue = ddValue;
    if (ddPercent > maxDrawdownPercent) maxDrawdownPercent = ddPercent;
  }

  // 5. Consecutive wins & losses
  const winStreaks: number[] = [];
  const lossStreaks: number[] = [];
  let currentStreak = 0; // Positive for wins, negative for losses

  for (const trade of sortedTrades) {
    const isWin = (trade.pnl || 0) > 0;
    if (isWin) {
      if (currentStreak < 0) {
        lossStreaks.push(Math.abs(currentStreak));
        currentStreak = 1;
      } else {
        currentStreak++;
      }
    } else {
      // Treat PnL <= 0 as a loss for consecutive streaks
      if (currentStreak > 0) {
        winStreaks.push(currentStreak);
        currentStreak = -1;
      } else {
        currentStreak--;
      }
    }
  }

  // Final streak push
  if (currentStreak > 0) {
    winStreaks.push(currentStreak);
  } else if (currentStreak < 0) {
    lossStreaks.push(Math.abs(currentStreak));
  }

  const maxConsecutiveWins = winStreaks.length > 0 ? Math.max(...winStreaks) : 0;
  const maxConsecutiveLosses = lossStreaks.length > 0 ? Math.max(...lossStreaks) : 0;

  const avgConsecutiveWins = winStreaks.length > 0 
    ? winStreaks.reduce((sum, val) => sum + val, 0) / winStreaks.length 
    : 0;

  const avgConsecutiveLosses = lossStreaks.length > 0 
    ? lossStreaks.reduce((sum, val) => sum + val, 0) / lossStreaks.length 
    : 0;

  return {
    profitFactor,
    maxDrawdownValue,
    maxDrawdownPercent,
    expectancy,
    avgGain,
    avgLoss,
    avgConsecutiveWins,
    avgConsecutiveLosses,
    maxConsecutiveWins,
    maxConsecutiveLosses
  };
}
