import { IndicatorRow } from '../indicatorState/fetchIndicatorAlpha';

/**
 * Normalizes an indicator key and metric label into a standard identifiable column name.
 * e.g., 'supertrend' -> 'supertrend_alpha'
 * and the lookback suffixes like '_t-n' are appended for older records.
 */
export function normalizeIndicatorIntoDataSource(
  indicatorKey: string,
  metricLabel: string,
  source: 'alpha' | 'beta' | 'delta',
  lookbackIndex: number
): string {
  // Normalize the indicator key to lower-case snake_case
  let key = indicatorKey.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  // Manual normalization overrides as requested
  if (key === 'smoothing' || key === 'heikin_ashi') {
    key = 'heikin_ashi_smoothed';
  }

  const datasourceSuffix = `_${source}`;
  
  // Format the metric label to look nice and be standard snake_case
  const metric = metricLabel.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

  const baseName = `${key}${datasourceSuffix}_${metric}`;

  // If there's a lookback, append the lookback tag
  if (lookbackIndex > 0) {
    return `${baseName}_t-${lookbackIndex}`;
  }
  return baseName;
}

/**
 * Iterates through historical IndicatorRows and extracts human-readable normalized metrics
 * for the log columns, attaching lookbacks like '_t-1', '_t-2', ... '_t-n'.
 */
export function extractNormalizedMetrics(
  rows: IndicatorRow[],
  source: 'alpha' | 'beta' | 'delta',
  indicatorCheckedState?: Record<string, boolean>
): Record<string, string | number> {
  const metrics: Record<string, string | number> = {};

  // rows represent [latest (t-0), older (t-1), even older (t-2)...]
  rows.forEach((row, lookbackIdx) => {
    if (!row || !row.indicators) return;

    row.indicators.forEach((ind) => {
      if (!ind || !ind.values) return;
      
      // If unchecked, exclude from feature log book
      if (indicatorCheckedState && indicatorCheckedState[ind.key] === false) {
        return;
      }

      Object.entries(ind.values).forEach(([label, val]) => {
        const colName = normalizeIndicatorIntoDataSource(ind.key, label, source, lookbackIdx);
        metrics[colName] = val;
      });
    });
  });

  return metrics;
}
