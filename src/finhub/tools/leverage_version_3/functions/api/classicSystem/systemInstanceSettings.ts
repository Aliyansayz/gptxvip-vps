import { getBaseSystemId } from '../conjunctionSystem/selfReplicationLabelManage';

/** Keep saved settings from older parameter panels effective. */
export function normalizeSystemParameters(instanceId: string, parameters: Record<string, any> = {}): Record<string, any> {
  const normalized = { ...parameters };
  const alias = (current: string, older: string) => {
    if (normalized[current] === undefined && normalized[older] !== undefined) {
      normalized[current] = normalized[older];
    }
  };
  switch (getBaseSystemId(instanceId)) {
    case 'stochastic': alias('stochK', 'kPeriod'); alias('stochD', 'dPeriod'); break;
    case 'supertrend': alias('period', 'supertrendPeriod'); alias('period', 'atrPeriod'); alias('multiplier', 'supertrendMultiplier'); break;
    case 'divergence': alias('stochK', 'lookback'); alias('stochD', 'rsiPeriod'); break;
    case 'linear_regression': alias('slopePeriod', 'lrSlopePeriod'); alias('slopePeriod', 'period'); alias('volPeriod', 'lrVolPeriod'); alias('volPeriod', 'channelWidth'); alias('regimePeriod', 'lrRegimePeriod'); break;
    case 'bollinger_bands': alias('period', 'bbPeriod'); alias('stdDev', 'bbStdDev'); break;
    case 'heikin_ashi_smoothed': alias('smoothLen', 'haSmoothLen'); break;
  }
  return normalized;
}

/** Combine a system's shared defaults with the settings for one selected instance. */
export function getSystemInstanceSettings(
  settings: Record<string, any>,
  instanceId: string
): Record<string, any> {
  const base = normalizeSystemParameters(instanceId, settings[getBaseSystemId(instanceId)]);
  const instance = normalizeSystemParameters(instanceId, settings[instanceId]);
  return {
    ...base,
    ...instance,
    alphaParams: { ...normalizeSystemParameters(instanceId, base.alphaParams), ...normalizeSystemParameters(instanceId, instance.alphaParams) },
    betaParams: { ...normalizeSystemParameters(instanceId, base.betaParams), ...normalizeSystemParameters(instanceId, instance.betaParams) },
    deltaParams: { ...normalizeSystemParameters(instanceId, base.deltaParams), ...normalizeSystemParameters(instanceId, instance.deltaParams) },
    allowedPatterns: { ...base.allowedPatterns, ...instance.allowedPatterns }
  };
}
