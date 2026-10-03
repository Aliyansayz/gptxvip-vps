import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Check } from 'lucide-react';

export const TaxNexusComplianceActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isAuditing, setIsAuditing] = useState(false);

  const jurisdictions = (currentExercise?.roleSpecificData as any)?.data?.taxJurisdictions || [
    { stateCode: "CO", salesThreshold: 100000, currentSales: 104200, nexusReached: true, rate: 0.029 },
    { stateCode: "TX", salesThreshold: 500000, currentSales: 312000, nexusReached: false, rate: 0.0625 },
    { stateCode: "CA", salesThreshold: 500000, currentSales: 640000, nexusReached: true, rate: 0.0725 }
  ];

  const handleAudit = () => {
    setIsAuditing(true);
    toast.info("Auditing multi-state rolling 12-month economic nexus triggers...");
    setTimeout(() => {
      setIsAuditing(false);
      toast.error("Nexus Triggered in Colorado ($104,200 > $100,000 threshold)! Remittance permit required.");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Auditing...' : 'Check Nexus Thresholds'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-3">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>State Economic Nexus Tracker (Wayfair Standards)</span>
        <span className="text-amber-700 dark:text-amber-400">Rolling 12-Month Sales</span>
      </div>
      <div className="space-y-2">
        {jurisdictions.map((j: any) => (
          <div key={j.stateCode} className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{j.stateCode}</span>
                <span className={`px-2 py-0.5 rounded text-sm font-bold ${j.nexusReached ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'}`}>
                  {j.nexusReached ? 'NEXUS REACHED' : 'BELOW THRESHOLD'}
                </span>
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Sales: ${j.currentSales.toLocaleString()} / Limit: ${j.salesThreshold.toLocaleString()}
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-slate-500 text-sm block">TAX RATE</span>
              <span className="text-amber-700 dark:text-amber-400 font-bold">{(j.rate * 100).toFixed(2)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default TaxNexusComplianceActivity;
