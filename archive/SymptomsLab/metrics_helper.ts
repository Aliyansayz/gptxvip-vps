import { Metric } from './SymptomsLabView';

/**
 * Returns metrics that are outside their normal range.
 */
export function getAbnormalMetrics(metrics: Metric[], metricValues: Record<string, number>) {
  return metrics.filter((m) => {
    const val = metricValues[m.label] !== undefined ? metricValues[m.label] : (m.normalMin + m.normalMax) / 2;
    return val < m.normalMin || val > m.normalMax;
  });
}

/**
 * Returns metrics that are within their normal range.
 */
export function getNormalMetrics(metrics: Metric[], metricValues: Record<string, number>) {
  return metrics.filter((m) => {
    const val = metricValues[m.label] !== undefined ? metricValues[m.label] : (m.normalMin + m.normalMax) / 2;
    return val >= m.normalMin && val <= m.normalMax;
  });
}
