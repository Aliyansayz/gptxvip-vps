export type SignalSource = 'alpha' | 'beta' | 'delta';

export interface DataSourceRules {
  signalSource: SignalSource;
}

export const DEFAULT_DATA_SOURCE_RULES: DataSourceRules = {
  signalSource: 'alpha',
};

/** A signal from an aggregate candle is usable only when that candle first closes. */
export const isNewSourceCandle = (sourceTime: number, previousAlphaTime?: number): boolean =>
  previousAlphaTime === undefined || sourceTime > previousAlphaTime;

export const getBaseInterval = (mode: string) => {
  const parts = mode.split('_');
  if (parts.length === 2) {
    const timeStr = parts[1]; // '1s', '3s', '5s', '1m', '10m', '1h'
    if (timeStr.endsWith('s')) return parseInt(timeStr.replace('s', '')) || 1;
    if (timeStr.endsWith('m')) return (parseInt(timeStr.replace('m', '')) || 1) * 60;
    if (timeStr.endsWith('h')) return (parseInt(timeStr.replace('h', '')) || 1) * 3600;
  }
  if (mode === 'standard') return 3600;
  return 1;
};

export const formatInterval = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
};

export const getLowestActiveIntervalDelay = (
  hasAlpha: boolean,
  hasBeta: boolean,
  hasDelta: boolean,
  mode: string,
  betaAggregateFactor: number = 1,
  deltaAggregateFactor: number = 1,
  deltaAggregateSource: string = 'alpha'
) => {
  const base = getBaseInterval(mode);
  let lowest = Infinity;

  if (hasAlpha) lowest = Math.min(lowest, base);

  if (hasBeta) {
    lowest = Math.min(lowest, base * Math.max(1, betaAggregateFactor));
  }

  if (hasDelta) {
    const deltaBase = deltaAggregateSource === 'beta' ? base * Math.max(1, betaAggregateFactor) : base;
    lowest = Math.min(lowest, deltaBase * Math.max(1, deltaAggregateFactor));
  }

  if (lowest === Infinity) return base;
  return lowest;
};
