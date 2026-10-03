import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Check } from 'lucide-react';

export const SchemaGraphExtractionActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isValidating, setIsValidating] = useState(false);

  const schemaData = (currentExercise?.roleSpecificData as any)?.data?.schemaEntities || [
    { type: "Organization", id: "https://example.com/#org", name: "Enterprise AI Inc." },
    { type: "Article", id: "https://example.com/post-101/#article", headline: "Cloud Migration Architecture" },
    { type: "Person", id: "https://example.com/authors/alice/#author", name: "Dr. Alice Vance" }
  ];

  const handleValidateSchema = () => {
    setIsValidating(true);
    toast.info("Validating JSON-LD Knowledge Graph schema...");
    setTimeout(() => {
      setIsValidating(false);
      toast.success("Graph validated! 0 critical syntax errors, 1 entity link suggested.");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleValidateSchema}
            disabled={isValidating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
            {isValidating ? 'Validating...' : 'Validate Graph'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300">
      <div className="text-slate-600 dark:text-slate-400 font-bold mb-3 pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>Nested JSON-LD Entities</span>
        <span className="text-sm text-emerald-700 dark:text-emerald-400">@graph Array</span>
      </div>
      <div className="space-y-2">
        {schemaData.map((node: any, idx: number) => (
          <div key={idx} className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-sm font-bold">
                @{node.type}
              </span>
              <div className="text-slate-900 dark:text-white font-medium text-sm">{node.headline || node.name}</div>
              <div className="text-sm text-slate-500 truncate max-w-sm">{node.id}</div>
            </div>
            <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
        ))}
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default SchemaGraphExtractionActivity;
