import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Search, Globe } from 'lucide-react';

export const SerpIntentAuditActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isScraping, setIsScraping] = useState(false);
  const [activeTab, setActiveTab] = useState<'serp' | 'terminal' | 'entities'>('serp');

  const serpData = (currentExercise?.roleSpecificData as any)?.data || {
    targetKeyword: "Enterprise Cloud Backup Cost Comparison",
    searchVolume: 14200,
    searchIntent: "commercial",
    serpCompetitors: [
      { rank: 1, url: "https://techradar.com/cloud-backup-pricing", title: "Best Cloud Backup 2026: Pricing Compared", intentScore: 0.95, domainAuthority: 88 },
      { rank: 2, url: "https://cloudstorage.io/calculator", title: "Interactive Enterprise Storage Cost Estimator", intentScore: 0.92, domainAuthority: 79 },
      { rank: 3, url: "https://forbes.com/advisor/cloud-backup", title: "Enterprise Cloud Backup Cost Analysis", intentScore: 0.89, domainAuthority: 92 }
    ]
  };

  const handleRunAudit = () => {
    setIsScraping(true);
    toast.info("Dispatched autonomous SERP crawler across Google Search API...");
    setTimeout(() => {
      setIsScraping(false);
      toast.success("SERP intent decomposition completed with 94.2% confidence!");
    }, 1200);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleRunAudit}
            disabled={isScraping}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
            {isScraping ? 'Auditing sample...' : 'Run sample audit'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-sm">
        <div className="flex gap-2">
          <button type="button"                   aria-pressed={activeTab === 'serp'} onClick={() => setActiveTab('serp')}
            className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
              activeTab === 'serp' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            SERP Decomposition
          </button>
          <button type="button"                   aria-pressed={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')}
            className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
              activeTab === 'terminal' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            Agent Logs
          </button>
        </div>
        <span className="text-sm font-mono text-slate-500">Query: "{serpData.targetKeyword}"</span>
      </div>

      <div className="p-4 min-h-[260px] max-h-[340px] overflow-y-auto custom-scrollbar">
        {activeTab === 'serp' ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800/80">
              <span>Rank / Snippet</span>
              <span>Intent Match</span>
              <span>Domain Authority</span>
            </div>
            {serpData.serpCompetitors?.map((comp: any) => (
              <div key={comp.rank} className="p-3 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="space-y-1 max-w-[65%]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">#{comp.rank}</span>
                    <span className="text-slate-900 dark:text-white font-medium truncate">{comp.title}</span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 truncate flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-500" />
                    {comp.url}
                  </div>
                </div>
                <div className="text-center font-mono text-emerald-700 dark:text-emerald-400">
                  {(comp.intentScore * 100).toFixed(0)}%
                </div>
                <div className="text-center font-mono text-slate-700 dark:text-slate-300">
                  DA {comp.domainAuthority}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="font-mono text-sm text-slate-700 dark:text-slate-300 space-y-2">
            {currentExercise?.logs?.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-slate-500">[{log.timestamp}]</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">[{log.level.toUpperCase()}]</span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default SerpIntentAuditActivity;
