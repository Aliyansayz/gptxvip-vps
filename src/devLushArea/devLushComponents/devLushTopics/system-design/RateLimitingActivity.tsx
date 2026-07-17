import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircle, XCircle, Shield, Play, RotateCcw, Activity } from 'lucide-react';
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

export const RateLimitingActivity: React.FC<ChapterProps> = ({
  step,
  exercises,
  infoVisible,
  infoPlacement,
  settings
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Interactive visual state
  const [tokens, setTokens] = useState(5);
  const maxTokens = 10;
  const [requests, setRequests] = useState<{ id: number; status: 'success' | 'rejected' }[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setTokens(5);
    setRequests([]);
    setIsRunning(false);
  }, [step]);

  // Token refill interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setTokens(prev => Math.min(prev + 1, maxTokens));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleSendRequest = () => {
    const newRequest: { id: number; status: 'success' | 'rejected' } = { id: Date.now(), status: 'success' };
    if (tokens > 0) {
      setTokens(prev => prev - 1);
      newRequest.status = 'success';
    } else {
      newRequest.status = 'rejected';
      toast.error("Rate limit exceeded!");
    }
    setRequests(prev => [...prev.slice(-9), newRequest]);
  };

  const handleBurstRequest = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(handleSendRequest, i * 100);
    }
  };

  const resetSimulation = () => {
    setTokens(5);
    setRequests([]);
    setIsRunning(false);
  };

  const handleOptionSelect = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
    const correct = option === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      toast.success("Correct! Token Bucket is great for handling bursts.");
    } else {
      toast.error("Incorrect. Try again.");
    }
  };

  const visualContent = (
    <div className="w-full flex flex-col h-[400px]">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 px-4 py-3 rounded-t-xl flex-shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span className="font-mono text-xs font-bold tracking-widest text-indigo-400">RATE_LIMITER_TESTBED</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${isRunning ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
          >
            {isRunning ? 'Pause Refill' : 'Start Refill'}
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="bg-slate-950 text-slate-200 border-x border-b border-slate-800 rounded-b-xl p-5 flex-1 flex flex-col items-center justify-center relative overflow-hidden">

        {/* Token Bucket Visualization */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="text-xs font-mono text-slate-400 mb-2">TOKEN BUCKET CAPACITY: {maxTokens}</div>
          <div className="w-64 h-32 border-b-4 border-x-4 border-indigo-900 rounded-b-2xl relative overflow-hidden flex flex-col justify-end p-2 gap-1 bg-slate-900/50">
            {/* Tokens */}
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: maxTokens }).map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${i < tokens ? 'bg-indigo-500/20 border border-indigo-400 scale-100 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800 border border-slate-700 scale-75 opacity-50'
                    }`}
                >
                  <Activity className={`w-5 h-5 ${i < tokens ? 'text-indigo-400' : 'text-slate-600'}`} />
                </div>
              ))}
            </div>

            {/* Water level effect */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-indigo-500/10 transition-all duration-500 pointer-events-none"
              style={{ height: `${(tokens / maxTokens) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8 relative z-10">
          <button
            onClick={handleSendRequest}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold rounded-lg shadow-lg active:scale-95 transition-all"
          >
            SEND 1 REQUEST
          </button>
          <button
            onClick={handleBurstRequest}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold rounded-lg shadow-lg active:scale-95 transition-all"
          >
            BURST 5 REQUESTS
          </button>
        </div>

        {/* Request Log */}
        <div className="w-full max-w-md h-12 flex gap-1 relative z-10">
          {requests.map((req, i) => (
            <div
              key={req.id}
              className={`flex-1 h-full rounded flex items-center justify-center animate-in slide-in-from-right-4 fade-in ${req.status === 'success' ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border border-rose-500 text-rose-400'
                }`}
            >
              {req.status === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            </div>
          ))}
        </div>

      </div>
    </div>
  );

  const interactionContent = (
    <div className="w-full flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
          {question.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {question.question}
        </p>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-center bg-slate-50 dark:bg-slate-900">
        <div className="space-y-3">
          {question.options?.map((option, idx) => {
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

  const theoryData = question.theory || (question.theory_explanation ? {
    title: question.title || "Theory Concept",
    content: question.theory_explanation,
    summary: question.real_world_analogy || undefined,
    visual_element: 'theme-park-queue'
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

export default RateLimitingActivity;
