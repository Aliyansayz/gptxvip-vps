import { Symptom } from './SymptomsLabView';

export type DiagnosticStatus = 'Confirmed' | 'Suspected' | 'Healthy';

export interface DiagnosticBlock {
  symptomId: number;
  label: string;
  category: string;
  severity: string;
  description: string;
  status: DiagnosticStatus;
  abnormalCount: number;
  totalCount: number;
}

export const evaluateDiagnostics = (
  metricValues: Record<string, number>,
  allSymptoms: Symptom[],
  selectedSymptomId?: number
): DiagnosticBlock[] => {
  const blocks: DiagnosticBlock[] = [];

  for (const symptom of allSymptoms) {
    if (!symptom.metrics || symptom.metrics.length === 0) {
      // For Healthy Baseline (usually has no specific diagnostic metrics of its own in the JSON)
      // or symptoms with no metrics, we only include if it's the baseline or selected.
      if (symptom.id === 0 || (selectedSymptomId !== undefined && symptom.id === selectedSymptomId)) {
        blocks.push({
          symptomId: symptom.id,
          label: symptom.label,
          category: symptom.category,
          severity: symptom.severity,
          description: symptom.description,
          status: 'Healthy',
          abnormalCount: 0,
          totalCount: 0
        });
      }
      continue;
    }

    let abnormalCount = 0;
    const totalCount = symptom.metrics.length;

    symptom.metrics.forEach(metric => {
      const val = metricValues[metric.label];
      // If value is missing, assume normal midpoint
      const currentVal = val !== undefined ? val : (metric.normalMin + metric.normalMax) / 2;
      
      const isNormal = currentVal >= metric.normalMin && currentVal <= metric.normalMax;
      if (!isNormal) {
        abnormalCount++;
      }
    });

    // Include if abnormal OR if it's the specifically selected symptom OR if it's the Healthy Baseline
    if (abnormalCount > 0 || (selectedSymptomId !== undefined && symptom.id === selectedSymptomId) || symptom.id === 0) {
      blocks.push({
        symptomId: symptom.id,
        label: symptom.label,
        category: symptom.category,
        severity: symptom.severity,
        description: symptom.description,
        status: abnormalCount === totalCount ? 'Confirmed' : abnormalCount > 0 ? 'Suspected' : 'Healthy',
        abnormalCount,
        totalCount
      });
    }
  }

  // Sort blocks: Healthy Baseline ALWAYS FIRST, then Confirmed, then Suspected, then Healthy
  blocks.sort((a, b) => {
    // ID 0 always wins
    if (a.symptomId === 0) return -1;
    if (b.symptomId === 0) return 1;

    const statusOrder = { 'Confirmed': 0, 'Suspected': 1, 'Healthy': 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return a.label.localeCompare(b.label);
  });

  return blocks;
};
