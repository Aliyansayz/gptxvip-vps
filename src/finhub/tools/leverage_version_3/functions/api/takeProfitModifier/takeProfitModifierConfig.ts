export interface TakeProfitModifierConfig {
  enableUpdateTpAtTarget: boolean;
  tpUpdateRewardTarget: number;
  tpUpdateMultiplier: number;

  enableTrailTpAfterBreakeven: boolean;
}

export const defaultTakeProfitModifierConfig: TakeProfitModifierConfig = {
  enableUpdateTpAtTarget: false,
  tpUpdateRewardTarget: 2.0,
  tpUpdateMultiplier: 1.0,

  enableTrailTpAfterBreakeven: false,
};
