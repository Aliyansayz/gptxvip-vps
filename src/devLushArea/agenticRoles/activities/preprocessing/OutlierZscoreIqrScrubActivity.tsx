import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play } from 'lucide-react';

export const OutlierZscoreIqrScrubActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isScrubbing, setIsScrubbing] = useState(false);

  const outliers = (currentExercise?.roleSpecificData as any)?.data?.outlierProfiles || [
    { column: "income", q1: 45000, q3: 95000, iqr: 50000, lowerBound: 0, upperBound: 170000, detectedAnomalies: 14 },
    { column: "credit_line", q1: 5000, q3: 25000, iqr: 20000, lowerBound: 0, upperBound: 55000, detectedAnomalies: 28 }
  ];

  const handleScrub = () => {
    setIsScrubbing(true);
    toast.info("Fitting Isolation Forest (n_estimators=200) for multivariate non-linear anomaly isolation...");
    setTimeout(() => {
      setIsScrubbing(false);
      toast.error("Multivariate Anomaly Isolated: 42 records flagged with anomaly score > 0.85 (e.g. low income + high credit line).");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleScrub}
            disabled={isScrubbing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isScrubbing ? 'animate-spin' : ''}`} />
            {isScrubbing ? 'Scrubbing...' : 'Fit Isolation Forest'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-3">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>Statistical Tukey IQR Boundaries vs Isolation Forest</span>
        <span className="text-cyan-700 dark:text-cyan-400">Contamination = 0.01</span>
      </div>

      <div className="space-y-2">
        {outliers.map((col: any) => (
          <div key={col.column} className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div>
              <span className="text-slate-900 dark:text-white font-bold">{col.column}</span>
              <div className="text-slate-500 text-sm">
                Q1: ${col.q1.toLocaleString()} | Q3: ${col.q3.toLocaleString()} | IQR Fence: [${col.lowerBound}, ${col.upperBound.toLocaleString()}]
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-slate-500 block">ANOMALIES</span>
              <span className="text-amber-700 dark:text-amber-400 font-bold font-mono">
                {col.detectedAnomalies} Flagged
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default OutlierZscoreIqrScrubActivity;
