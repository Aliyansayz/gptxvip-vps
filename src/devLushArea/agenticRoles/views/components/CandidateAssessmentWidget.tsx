import React, { useState } from 'react';
import { AgenticRoleExercise } from '../../agenticRoleTypes';
import { Sparkles, RotateCcw, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CandidateAssessmentWidgetProps {
  exercise: AgenticRoleExercise;
  onSuccess?: () => void;
  accentColor?: string;
}

export const CandidateAssessmentWidget: React.FC<CandidateAssessmentWidgetProps> = ({
  exercise,
  onSuccess,
  accentColor = '#3B82F6'
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleVerify = () => {
    if (!selectedOption) {
      toast.error("Please choose a candidate option.");
      return;
    }
    const correct = selectedOption === exercise.answer;
    setIsCorrect(correct);
    setIsEvaluated(true);

    if (correct) {
      toast.success("Correct technical reasoning! Milestone validated.");
      if (onSuccess) onSuccess();
    } else {
      toast.error("Incorrect decision. Review the technical prompt and try again.");
    }
  };

  const selectedFeedback = exercise.wrong_answer_feedback?.find(
    (feedback) => feedback.option === selectedOption
  )?.feedback;

  const handleReset = () => {
    setSelectedOption(null);
    setIsEvaluated(false);
    setIsCorrect(false);
  };

  return (
    <div className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Candidate Assessment Challenge
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {exercise.difficulty.toUpperCase()}
          </span>
        </div>

        {exercise.prompt && (
          <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">Task prompt</p>
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            {exercise.prompt}
          </p>
          </div>
        )}

        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">Assessment question</p>
          <h3 className="text-sm font-semibold text-white leading-snug">{exercise.question}</h3>
        </div>

        {/* Options List */}
        <div className="space-y-2 pt-1">
          {exercise.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            let style = 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-950';

            if (isEvaluated) {
              if (opt === exercise.answer) {
                style = 'border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold';
              } else if (isSelected && !isCorrect) {
                style = 'border-rose-500 bg-rose-950/20 text-rose-300';
              }
            } else if (isSelected) {
              style = 'border-blue-500 bg-blue-950/20 text-white font-semibold';
            }

            return (
              <button
                key={idx}
                type="button"
                aria-pressed={isSelected}
                disabled={isEvaluated}
                onClick={() => setSelectedOption(opt)}
                className={`flex min-h-11 w-full items-start gap-2.5 rounded-lg border p-3 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-default ${style}`}
              >
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 mt-0.5 flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Evaluation Diagnostic Banner */}
        {isEvaluated && (
          <div
            role="status"
            aria-live="polite"
            className={`space-y-1 rounded-lg border p-3 text-xs ${
              isCorrect
                ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/30 border-rose-800 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
              <span>{isCorrect ? 'Assessment Validated' : 'Technical Misalignment'}</span>
            </div>
            <p className="font-semibold">{isCorrect ? 'Why this is correct' : 'Why this needs revision'}</p>
            <p className="text-slate-300 text-[11px] leading-relaxed">{!isCorrect && selectedFeedback ? selectedFeedback : exercise.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
        {isEvaluated ? (
          <button
            type="button"
            onClick={handleReset}
            className="flex min-h-11 items-center gap-1.5 rounded-lg bg-slate-800 px-3 text-xs font-semibold text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Choice
          </button>
        ) : (
          <span className="text-[11px] text-slate-500 font-mono">Select candidate response</span>
        )}

        {!isEvaluated && (
          <button
            type="button"
            onClick={handleVerify}
            className="flex min-h-11 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Lock In Choice
          </button>
        )}
      </div>
    </div>
  );
};

export default CandidateAssessmentWidget;
