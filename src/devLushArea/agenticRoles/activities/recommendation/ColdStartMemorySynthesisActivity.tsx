import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, UserCheck, MessageSquare } from 'lucide-react';

export const ColdStartMemorySynthesisActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isExtracting, setIsExtracting] = useState(false);

  const memories = (currentExercise?.roleSpecificData as any)?.data?.coldStartEpisodicMemories || [
    "Interests: Quantum Physics, Startup Biographies, Deep Tech",
    "Audio Preference: British English Dialect",
    "Onboarded: 2026-08-15"
  ];

  const handleExtract = () => {
    setIsExtracting(true);
    toast.info("Extracting episodic concepts from conversational onboarding transcript...");
    setTimeout(() => {
      setIsExtracting(false);
      toast.success("Synthesized User Vector [0.88, 0.42] at Cluster #482 (Science & Biographies) with British Audio filter!");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleExtract}
            disabled={isExtracting}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isExtracting ? 'animate-spin' : ''}`} />
            {isExtracting ? 'Synthesizing...' : 'Extract Persona'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-3">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>Conversational Onboarding Extraction</span>
        <span className="text-indigo-700 dark:text-indigo-400">LLM Episodic Memory Store</span>
      </div>

      <div className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
        <div className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" /> User Input Transcript:
        </div>
        <p className="text-sm text-slate-900 dark:text-white italic">
          "Looking for non-fiction audiobooks about quantum physics and deep tech startup founders, narrated in British English."
        </p>
      </div>

      <div className="space-y-1.5 pt-1">
        <div className="text-slate-600 dark:text-slate-400 text-sm font-bold">Extracted Long-Term Persona Memory Nodes:</div>
        {memories.map((mem: string, idx: number) => (
          <div key={idx} className="p-2 rounded bg-white dark:bg-slate-900 border border-indigo-500/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />
            <span>{mem}</span>
          </div>
        ))}
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default ColdStartMemorySynthesisActivity;
