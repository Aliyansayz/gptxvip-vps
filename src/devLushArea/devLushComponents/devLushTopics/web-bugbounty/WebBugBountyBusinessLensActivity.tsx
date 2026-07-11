import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircle, XCircle, TrendingUp, AlertTriangle, Bug, Target } from 'lucide-react';
import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import { DevLushLayout } from '../../devLushTopicsView/DevLushLayout';
import SaveTheoryButton from '../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';
import { DevLushTheoryBridge } from '../../devLushTopicsView/DevLushTheoryBridge';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
  onComplete?: () => void;
}

export const WebBugBountyBusinessLensActivity: React.FC<ChapterProps> = ({
  step,
  exercises,
  infoVisible,
  infoPlacement,
  settings,
  onComplete
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [activeBug, setActiveBug] = useState<'xss' | 'idor' | null>(null);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setActiveBug(null);
  }, [step]);

  const checkAnswer = () => {
    if (!selectedAnswer) {
      toast.error("Please select an option before continuing.");
      return;
    }
    const correct = selectedAnswer === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      toast.success("Correct! Impact drives the value, not just complexity.");
    } else {
      toast.error("Incorrect. Try reviewing the theory section again.");
    }
  };

  const visualContent = (
    <div className="w-full flex flex-col">
      <div className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-t-xl flex items-center gap-2 flex-shrink-0">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-mono text-slate-300 font-bold tracking-widest">TRIAGE DASHBOARD</span>
      </div>

      <div className="bg-slate-900 border-x border-b border-slate-700 rounded-b-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4 h-72 overflow-y-auto animate-in fade-in">
        {/* Bug 1: Complex XSS */}
        <button
          onClick={() => setActiveBug('xss')}
          className={`text-left p-4 rounded-xl border transition-all ${activeBug === 'xss' ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5"><Bug className="w-3.5 h-3.5" /> DOM XSS via postMessage</div>
              <div className="text-[10px] text-slate-500 mt-1">Requires 10 user interaction steps. Bypass CSP.</div>
            </div>
          </div>

          {activeBug === 'xss' && (
            <div className="mt-4 pt-4 border-t border-slate-700 animate-in fade-in space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Technical Complexity:</span>
                <span className="text-rose-400 font-bold">EXTREME</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Business Impact:</span>
                <span className="text-emerald-400 font-bold">LOW (1 user affected)</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Estimated Payout:</span>
                <span className="text-slate-200 font-bold">$500</span>
              </div>
            </div>
          )}
        </button>

        {/* Bug 2: Simple IDOR */}
        <button
          onClick={() => setActiveBug('idor')}
          className={`text-left p-4 rounded-xl border transition-all ${activeBug === 'idor' ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> IDOR on /export_data</div>
              <div className="text-[10px] text-slate-500 mt-1">Change ID in URL to download any user's data.</div>
            </div>
          </div>

          {activeBug === 'idor' && (
            <div className="mt-4 pt-4 border-t border-slate-700 animate-in fade-in space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Technical Complexity:</span>
                <span className="text-emerald-400 font-bold">TRIVIAL</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Business Impact:</span>
                <span className="text-rose-400 font-bold">CRITICAL (Data Breach)</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Estimated Payout:</span>
                <span className="text-slate-200 font-bold">$10,000+</span>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  const interactionContent = (
    <div className="space-y-4">
      {question.question && (
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          {question.question}
        </h4>
      )}
      <div className="grid grid-cols-1 gap-3">
        {question.options?.map((opt: string, i: number) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={i}
              onClick={() => {
                if (showResult) return;
                setSelectedAnswer(opt);
              }}
              disabled={showResult}
              className={`text-left p-4 rounded-xl border font-sans text-sm font-medium transition-all duration-200 ${showResult ? (opt === question.answer ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' : isSelected ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-400 text-rose-700 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-65') : isSelected ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-700 dark:text-indigo-400 scale-[1.01]' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isSelected ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 leading-snug">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center gap-4 pt-2">
        <button
          onClick={() => {
            setSelectedAnswer(null);
            setShowResult(false);
            setIsCorrect(false);
            setActiveBug(null);
          }}
          className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline"
        >
          Reset Quiz
        </button>

        {!showResult ? (
          <button
            onClick={checkAnswer}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            Verify Analysis
          </button>
        ) : (
          <div className="flex items-center gap-2 animate-in fade-in">
            {isCorrect ? (
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/30">
                  <CheckCircle className="w-4 h-4" /> Correct Analysis
                </span>
                {onComplete && (
                  <button
                    onClick={onComplete}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all text-xs"
                  >
                    Complete Business Lens
                  </button>
                )}
              </div>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-bold text-sm flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/20 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/30">
                <XCircle className="w-4 h-4" /> Try Reviewing Theory
              </span>
            )}
          </div>
        )}
      </div>

      {showResult && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-2">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Interactive Review:</p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );

  const theoryData = question.theory || (question.theory_explanation ? {
    title: question.title || "Theory Concept",
    content: question.theory_explanation,
    analogy: question.real_world_analogy
  } : null);

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'cybersecurity', exerciseTitle: question.title, theory: theoryData }} />
      </div>
    </div>
  ) : null;

  return (
    <DevLushLayout
      title={question.title}
      prompt={question.prompt}
      visualContent={visualContent}
      interactionContent={interactionContent}
      theoryContent={theoryContent}
      infoVisible={infoVisible && !!theoryData}
      infoPlacement={infoPlacement}
      settings={settings}
      compactVisual={true}
    />
  );
};

export default WebBugBountyBusinessLensActivity;
