import { strict as assert } from 'node:assert';
import { Trade } from '../../../../types/trading';
import { TradingRulesConfig, evaluateTradeExits } from '../rules/tradingRules';
import { processIndicatorBasedEntry } from '../rules/tradingEntryIndicatorRules';
import { updateTrailSL } from '../middleware/updateTrailSL';
import { defaultStopLossModifierConfig } from './stopLossModifierConfig';
import { evaluateStopLossModification } from './stopLossModifierManager';

const lock = { ...defaultStopLossModifierConfig, enableProfitPipsLock: true, profitLockTriggerPips: 70, profitLockPercent: 50 };
const long = { initialStopLoss: 95, currentStopLoss: 95, entryPrice: 100, latestPrice: 107,
  proposedNewSL: 95, direction: 'LONG' as const, assetType: 'Gold' };
assert.equal(evaluateStopLossModification(long, lock), 103.5); // 35 of 70 gold pips
assert.equal(evaluateStopLossModification(long, { ...lock, profitLockPercent: 70 }), 104.9); // 49 of 70 pips
assert.equal(evaluateStopLossModification({ ...long, latestPrice: 106.9 }, lock), 95);
assert.equal(evaluateStopLossModification({ ...long, currentStopLoss: 104 }, lock), 104); // no widening

const short = { initialStopLoss: 105, currentStopLoss: 105, entryPrice: 100, latestPrice: 93,
  proposedNewSL: 105, direction: 'SHORT' as const, assetType: 'Gold' };
assert.equal(evaluateStopLossModification(short, lock), 96.5);
assert.equal(evaluateStopLossModification(short, { ...lock, profitLockPercent: 70 }), 95.1);

const gated = { ...defaultStopLossModifierConfig, enableTrailAfterProfitPips: true, trailAfterProfitPips: 70 };
assert.equal(evaluateStopLossModification({ ...long, latestPrice: 106.9, proposedNewSL: 102 }, gated), 95);
assert.equal(evaluateStopLossModification({ ...long, proposedNewSL: 102 }, gated), 102);

const eurusd = { ...long, entryPrice: 1.1, initialStopLoss: 1.09, currentStopLoss: 1.09,
  proposedNewSL: 1.09, latestPrice: 1.107, assetType: 'EURUSD' };
assert.ok(Math.abs(evaluateStopLossModification(eurusd, lock) - 1.1035) < 1e-10);

const trade: Trade = { id: 't1', side: 'LONG', status: 'OPEN', tradeType: 'main trade', entryPrice: 100,
  entryTime: 0, entryIndex: 0, size: 1, stopLoss: 95, initialStopLoss: 95, executionType: 'MARKET_EXECUTION' };
const rules = { useStopLoss: true, useTakeProfit: false, exitOnSignalReversal: false,
  stopLossModifier: lock } as TradingRulesConfig;
const bar = { time: 1, open: 100, high: 108, low: 99, close: 107, volume: 1 };
const exitsOnCurrentBar = evaluateTradeExits(0, [bar], null, [trade], rules);
assert.equal(exitsOnCurrentBar[0].status, 'OPEN');
const trailed = updateTrailSL(exitsOnCurrentBar, 0, [bar], rules, undefined, 'Gold');
assert.equal(trailed[0].stopLoss, 103.5);
const nextBar = { time: 2, open: 107, high: 107, low: 103, close: 104, volume: 1 };
const nextExits = evaluateTradeExits(1, [bar, nextBar], null, trailed, rules);
assert.equal(nextExits[0].status, 'CLOSED');
assert.equal(nextExits[0].exitPrice, 103.5);

const atrRules = { ...rules, useSmoothAtrStopLossTrailing: true, stopLossModifier: gated };
const atrStops = { lowerBand: [102], upperBand: [112] };
const beforeTrigger = updateTrailSL([trade], 0, [{ ...bar, close: 106.9 }], atrRules, atrStops, 'Gold');
assert.equal(beforeTrigger[0].stopLoss, 95);
const atTrigger = updateTrailSL([trade], 0, [bar], atrRules, atrStops, 'Gold');
assert.equal(atTrigger[0].stopLoss, 102);

const fixedRules = { ...atrRules, entryOnSignal: true, stopLossPips: 50,
  useTakeProfit: true, rewardRiskRatio: 2 } as TradingRulesConfig;
const entryBar = { time: 0, open: 100, high: 100, low: 100, close: 100, volume: 1 };
const [fixedLong] = processIndicatorBasedEntry(0, [entryBar], 'LONG', [], fixedRules,
  { lower: 92, upper: 108 }, undefined, undefined, undefined, undefined, undefined, 'Gold');
assert.equal(fixedLong.initialStopLoss, 95);
assert.equal(fixedLong.stopLoss, 95);
assert.equal(fixedLong.takeProfit, 110);
const [fixedShort] = processIndicatorBasedEntry(0, [entryBar], 'SHORT', [], fixedRules,
  { lower: 92, upper: 108 }, undefined, undefined, undefined, undefined, undefined, 'Gold');
assert.equal(fixedShort.initialStopLoss, 105);
assert.equal(fixedShort.takeProfit, 90);

const stoppedBeforeTrigger = evaluateTradeExits(1, [entryBar,
  { time: 1, open: 100, high: 101, low: 94, close: 96, volume: 1 }], null, [fixedLong], fixedRules);
assert.equal(stoppedBeforeTrigger[0].exitReason, 'STOP_LOSS');
assert.equal(stoppedBeforeTrigger[0].exitPrice, 95);
const fixedBeforeTrigger = updateTrailSL([fixedLong], 0, [{ ...bar, close: 106.9 }], fixedRules, atrStops, 'Gold');
assert.equal(fixedBeforeTrigger[0].stopLoss, 95);
const fixedAfterTrigger = updateTrailSL([fixedLong], 0, [bar], fixedRules, atrStops, 'Gold');
assert.equal(fixedAfterTrigger[0].stopLoss, 102);
assert.equal(fixedAfterTrigger[0].initialStopLoss, 95);
const shortStops = { lowerBand: [88], upperBand: [98] };
const shortBeforeTrigger = updateTrailSL([fixedShort], 0, [{ ...bar, close: 93.1 }], fixedRules, shortStops, 'Gold');
assert.equal(shortBeforeTrigger[0].stopLoss, 105);
const shortAfterTrigger = updateTrailSL([fixedShort], 0, [{ ...bar, close: 93 }], fixedRules, shortStops, 'Gold');
assert.equal(shortAfterTrigger[0].stopLoss, 98);
assert.equal(shortAfterTrigger[0].initialStopLoss, 105);
const activatedWithoutMoving = updateTrailSL([fixedLong], 0, [bar], fixedRules,
  { lowerBand: [94], upperBand: [112] }, 'Gold');
assert.equal(activatedWithoutMoving[0].stopLoss, 95);
assert.equal(activatedWithoutMoving[0].profitTrailActivated, true);
assert.equal(activatedWithoutMoving[0].trailCount, 0);
const afterRetracement = updateTrailSL(activatedWithoutMoving, 0, [{ ...bar, close: 106 }],
  fixedRules, atrStops, 'Gold');
assert.equal(afterRetracement[0].stopLoss, 102);

const [forexLong] = processIndicatorBasedEntry(0,
  [{ ...entryBar, close: 1.1 }], 'LONG', [], fixedRules, undefined,
  undefined, undefined, undefined, undefined, undefined, 'EURUSD');
assert.ok(Math.abs((forexLong.stopLoss ?? 0) - 1.095) < 1e-10);

console.log('pip profit stop loss checks passed');
