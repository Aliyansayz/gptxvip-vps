import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';
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
}

const GlobalTrafficRouterVisual: React.FC = () => {
    return (
        <div className="w-full bg-slate-950 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden border border-slate-800 shadow-xl h-full">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Global Traffic Routing</h3>
            <svg viewBox="0 0 400 200" className="w-full h-64">
                {/* Globe / Users */}
                <circle cx="60" cy="100" r="40" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <path d="M 60 60 C 80 80, 80 120, 60 140 M 60 60 C 40 80, 40 120, 60 140 M 20 100 L 100 100" stroke="#334155" fill="none" strokeWidth="1" />
                <circle cx="50" cy="80" r="3" fill="#3b82f6" className="animate-pulse" />
                <circle cx="70" cy="120" r="3" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <circle cx="30" cy="110" r="3" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '1s' }} />
                <text x="60" y="155" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">CLIENTS</text>

                {/* Load Balancer */}
                <rect x="160" y="80" width="40" height="40" rx="8" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
                <text x="180" y="103" textAnchor="middle" fontSize="8" fill="#a78bfa" fontWeight="bold">L7 LB</text>

                {/* Traffic paths from clients to LB */}
                <path d="M 100 100 L 160 100" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" />

                {/* Data Centers */}
                <rect x="280" y="30" width="60" height="40" rx="4" fill="#064e3b" stroke="#10b981" />
                <text x="310" y="53" textAnchor="middle" fontSize="8" fill="#34d399" fontWeight="bold">US-EAST</text>

                <rect x="280" y="130" width="60" height="40" rx="4" fill="#1e3a8a" stroke="#3b82f6" />
                <text x="310" y="153" textAnchor="middle" fontSize="8" fill="#60a5fa" fontWeight="bold">EU-WEST</text>

                {/* Paths from LB to DCs */}
                <path d="M 200 100 L 240 100 L 240 50 L 280 50" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" fill="none" className="animate-[dash_1.5s_linear_infinite]" />
                <path d="M 200 100 L 240 100 L 240 150 L 280 150" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" fill="none" className="animate-[dash_1.5s_linear_infinite]" style={{ animationDelay: '0.7s' }} />
            </svg>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes dash {
                    to { stroke-dashoffset: -8; }
                }
            `}} />
        </div>
    );
};

export const SystemDesignOverviewActivity: React.FC<ChapterProps> = ({
  step,
  exercises,
  infoVisible,
  infoPlacement,
  settings
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  }, [step]);

  const handleOptionSelect = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
    const correct = option === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      toast.success("Correct Answer!");
    } else {
      toast.error("Incorrect. Try again.");
    }
  };

  const visualContent = (
    <div className="w-full flex flex-col h-[400px]">
      <GlobalTrafficRouterVisual />
    </div>
  );

  const interactionContent = (
    <div className="w-full flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
          {question?.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {question?.question}
        </p>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-center bg-slate-50 dark:bg-slate-900">
        <div className="space-y-3">
          {question?.options?.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === question.answer;

            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ";

            if (!showResult) {
              btnClass += "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300";
            } else {
              if (isCorrectOption) {
                btnClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
              } else if (isSelected) {
                btnClass += "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300";
              } else {
                btnClass += "border-slate-200 dark:border-slate-700 opacity-50 text-slate-500";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                disabled={showResult}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  {showResult && isCorrectOption && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                  {showResult && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-rose-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className={`p-4 border-t ${isCorrect
            ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30'
            : 'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/30'
          }`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5" />
            )}
            <div>
              <h4 className={`font-bold ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h4>
              <p className={`text-sm mt-1 ${isCorrect ? 'text-emerald-700 dark:text-emerald-400/80' : 'text-rose-700 dark:text-rose-400/80'}`}>
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const theoryData = question?.theory || (question?.theory_explanation ? {
    title: question.title || "Theory Concept",
    content: question.theory_explanation,
    summary: question.real_world_analogy || undefined
  } : null);

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'system-design', exerciseTitle: question.title, theory: theoryData }} />
      </div>
    </div>
  ) : null;

  if (!question) return null;

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
    />
  );
};

export default SystemDesignOverviewActivity;
