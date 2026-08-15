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

  const handleReset = () => {
    setSelectedOption(null);
    setIsEvaluated(false);
    setIsCorrect(false);
  };

  return (
    <div className="rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 p-5 shadow-2xl space-y-4 flex flex-col justify-between">
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
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            {exercise.prompt}
          </p>
        )}

        <h3 className="text-sm font-semibold text-white leading-snug">{exercise.question}</h3>

        {/* Options List */}
        <div className="space-y-2 pt-1">
          {exercise.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            let style = 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-950';

            if (isEvaluated) {
              if (opt === exercise.answer) {
                style = 'border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.2)]';
              } else if (isSelected && !isCorrect) {
                style = 'border-rose-500 bg-rose-950/20 text-rose-300';
              }
            } else if (isSelected) {
              style = 'border-blue-500 bg-blue-950/20 text-white font-semibold shadow-[0_0_10px_rgba(59,130,246,0.2)]';
            }

            return (
              <button
                key={idx}
                disabled={isEvaluated}
                onClick={() => setSelectedOption(opt)}
                className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${style}`}
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
            className={`p-3 rounded-lg text-xs border space-y-1 animate-in fade-in ${
              isCorrect
                ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/30 border-rose-800 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
              <span>{isCorrect ? 'Assessment Validated' : 'Technical Misalignment'}</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{exercise.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        {isEvaluated ? (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Choice
          </button>
        ) : (
          <span className="text-[11px] text-slate-500 font-mono">Select candidate response</span>
        )}

        {!isEvaluated && (
          <button
            onClick={handleVerify}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
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
