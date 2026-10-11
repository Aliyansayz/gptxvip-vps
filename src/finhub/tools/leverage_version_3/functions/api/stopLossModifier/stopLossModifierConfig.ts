export interface StopLossModifierConfig {
  // Mode 1: Straight Forward Trail
  activateTrailAfterBreakeven: boolean;
  trailTillBreakevenOnly: boolean;
  // Delay indicator trailing until the trade is at least X pips in profit.
  enableTrailAfterProfitPips: boolean;
  trailAfterProfitPips: number;
  // Independently lock a percentage of the current profitable pip move.
  enableProfitPipsLock: boolean;
  profitLockTriggerPips: number;
  profitLockPercent: number;

  // Mode 2: Conditional Trailing Threshold
  enableConditionalTrailingThreshold: boolean;
  trailThresholdRewardFactor: number;

  // Mode 3: Explicit Stop Loss Modification
  isStopLossModification: boolean;
  explicitAdjustFactor: number;
  lowerBoundTarget: number;
  upperBoundTarget: number;
}

export const defaultStopLossModifierConfig: StopLossModifierConfig = {
  activateTrailAfterBreakeven: false,
  trailTillBreakevenOnly: false,
  enableTrailAfterProfitPips: false,
  trailAfterProfitPips: 70,
  enableProfitPipsLock: false,
  profitLockTriggerPips: 70,
  profitLockPercent: 50,

  enableConditionalTrailingThreshold: false,
  trailThresholdRewardFactor: 2.0,

  isStopLossModification: false,
  explicitAdjustFactor: 0.68,
  lowerBoundTarget: 2.0,
  upperBoundTarget: 4.0
};
