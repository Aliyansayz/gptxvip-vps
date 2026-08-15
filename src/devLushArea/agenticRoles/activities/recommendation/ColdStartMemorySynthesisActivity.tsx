import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Brain, Sparkles, ShieldCheck, UserCheck, MessageSquare } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const ColdStartMemorySynthesisActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
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

  const handleVerify = () => {
    if (!selectedOption) {
      toast.error("Please choose a candidate response.");
      return;
    }
    const correct = selectedOption === currentExercise.answer;
    setIsCorrect(correct);
    setIsEvaluated(true);
    if (correct) {
      toast.success("Correct Cold-Start Vector Synthesis decision!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect action. Cold-start is solved by extracting structured interests into instant vectors.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'hard');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {currentExercise?.title || 'Cold-Start User Persona Synthesis with Memory Stores'}
            </h2>
            <p className="text-xs text-slate-400">Agentic Recommendation Analyst • Day 4 Mission</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleExtract}
            disabled={isExtracting}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isExtracting ? 'animate-spin' : ''}`} />
            {isExtracting ? 'Synthesizing...' : 'Extract Persona'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-3">
            <div className="text-slate-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Conversational Onboarding Extraction</span>
              <span className="text-indigo-400">LLM Episodic Memory Store</span>
            </div>

            <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="text-slate-400 text-[10px] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> User Input Transcript:
              </div>
              <p className="text-xs text-white italic">
                "Looking for non-fiction audiobooks about quantum physics and deep tech startup founders, narrated in British English."
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="text-slate-400 text-[11px] font-bold">Extracted Long-Term Persona Memory Nodes:</div>
              {memories.map((mem: string, idx: number) => (
                <div key={idx} className="p-2 rounded bg-slate-900 border border-indigo-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{mem}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Zero-Shot Initialization
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-indigo-500 bg-indigo-500/15 text-indigo-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-indigo-500 bg-indigo-500/10 text-white font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isEvaluated}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${style}`}
                    >
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isEvaluated && (
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-indigo-950/30 border-indigo-800 text-indigo-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
                  <p className="font-semibold mb-1">{isCorrect ? 'Analysis Confirmed:' : 'Evaluation:'}</p>
                  <p className="text-slate-300 text-[11px]">{currentExercise.explanation}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {isEvaluated ? (
                <button
                  onClick={() => { setIsEvaluated(false); setSelectedOption(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              ) : <div className="text-[11px] text-slate-500 font-mono">Select synthesis approach</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Initialize Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdStartMemorySynthesisActivity;
