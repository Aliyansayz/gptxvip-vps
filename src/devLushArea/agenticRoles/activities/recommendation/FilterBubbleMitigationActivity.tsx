import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play } from 'lucide-react';

export const FilterBubbleMitigationActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isDiversifying, setIsDiversifying] = useState(false);

  const candidates = (currentExercise?.roleSpecificData as any)?.data?.candidateItems || [
    { id: "p1", title: "Alpine Trail Hiking Boots", category: "Footwear", cosineSimilarity: 0.99, rerankScore: 0.94 },
    { id: "p2", title: "Merino Wool Trail Socks (3-Pack)", category: "Apparel", cosineSimilarity: 0.91, rerankScore: 0.89 },
    { id: "p3", title: "2.5L Hydration Reservoir Pack", category: "Gear", cosineSimilarity: 0.88, rerankScore: 0.86 }
  ];

  const handleDiversify = () => {
    setIsDiversifying(true);
    toast.info("Applying Maximal Marginal Relevance (MMR) λ=0.6 diversity tradeoff...");
    setTimeout(() => {
      setIsDiversifying(false);
      toast.success("Filter Bubble Bursted! Intra-list diversity improved by 42% across complementary categories.");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleDiversify}
            disabled={isDiversifying}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isDiversifying ? 'animate-spin' : ''}`} />
            {isDiversifying ? 'Diversifying...' : 'Apply MMR Reranking'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-3">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>Maximal Marginal Relevance (MMR) Output Carousel</span>
        <span className="text-indigo-700 dark:text-indigo-400">λ Diversity = 0.60</span>
      </div>

      <div className="space-y-2">
        {candidates.map((item: any, idx: number) => (
          <div key={item.id} className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-indigo-700 dark:text-indigo-400 font-bold">Slot #{idx + 1}</span>
                <span className="text-slate-900 dark:text-white font-bold">{item.title}</span>
              </div>
              <span className="text-slate-500 text-sm px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800">
                Category: {item.category}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm text-slate-500 block">MMR SCORE</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                {(item.rerankScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default FilterBubbleMitigationActivity;
