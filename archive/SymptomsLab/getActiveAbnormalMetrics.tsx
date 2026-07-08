import React from 'react';
import { Symptom } from './SymptomsLabView';
import { getAbnormalMetrics, getNormalMetrics } from './metrics_helper';

interface Props {
  symptomId: number;
  symptoms: Symptom[];
  metricValues: Record<string, number>;
  showNormal?: boolean;
}

export const GetActiveAbnormalMetrics: React.FC<Props> = ({ symptomId, symptoms, metricValues, showNormal = false }) => {
  const symptom = symptoms.find((s) => s.id === symptomId);
  if (!symptom || !symptom.metrics) return null;

  const abnormalMetrics = getAbnormalMetrics(symptom.metrics, metricValues);
  const normalMetrics = showNormal ? getNormalMetrics(symptom.metrics, metricValues) : [];

  if (abnormalMetrics.length === 0 && normalMetrics.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-4 mb-6">
      {/* Abnormal Metrics */}
      {abnormalMetrics.length > 0 && (
        <div className="space-y-2">
          {abnormalMetrics.map((m) => {
            const val = metricValues[m.label] !== undefined ? metricValues[m.label] : (m.normalMin + m.normalMax) / 2;
            const deviationText = val < m.normalMin ? "Below Normal" : "Above Normal";

            return (
              <div key={m.label} className="bg-white dark:bg-slate-800/50 border border-red-100 dark:border-red-900/30 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{m.label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                    Range: {m.normalMin} - {m.normalMax}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded uppercase tracking-tight">
                    {deviationText}
                  </span>
                  <span className="text-xl font-mono font-black text-red-600 dark:text-red-400">{val}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Normal Metrics (if toggled) */}
      {showNormal && normalMetrics.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Normal Readings</span>
          {normalMetrics.map((m) => {
            const val = metricValues[m.label] !== undefined ? metricValues[m.label] : (m.normalMin + m.normalMax) / 2;
            return (
              <div key={m.label} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 opacity-80">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{m.label}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Standard baseline: {m.normalMin} - {m.normalMax}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-tight">
                    Stable
                  </span>
                  <span className="text-lg font-mono font-bold text-slate-600 dark:text-slate-400">{val}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
