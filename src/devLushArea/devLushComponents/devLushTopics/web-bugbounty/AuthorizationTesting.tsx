import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircle, XCircle, Terminal, RefreshCw, Key, EyeOff } from 'lucide-react';
import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import { DevLushLayout } from '../../devLushTopicsView/DevLushLayout';
import SaveTheoryButton from '../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';
import { DevLushTheoryBridge } from '../../devLushTopicsView/DevLushTheoryBridge';
import BlueMatrixTerminal from '../../../devlushView/tools/BlueMatrixTerminal';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const AuthorizationTesting: React.FC<ChapterProps> = ({
  step,
  exercises,
  infoVisible,
  infoPlacement,
  settings
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [displayedLogs, setDisplayedLogs] = useState<{ timestamp: string, level: string, message: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const question = exercises[step];
  const exerciseData = question as any;

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    resetSimulator();
  }, [step]);

  const resetSimulator = () => {
    setIsRunning(false);
    setProgress(0);
    setDisplayedLogs([
      { timestamp: new Date().toLocaleTimeString(), level: "info", message: "SYSTEM: IDOR Sandbox ready." },
      { timestamp: new Date().toLocaleTimeString(), level: "info", message: "Ready to test authorization boundaries..." }
    ]);
  };

  const startReconLoop = () => {
    if (isRunning) return;
    setIsRunning(true);
    setDisplayedLogs([]);
    setProgress(10);

    const logSequence = exerciseData.logs || [];

    if (logSequence.length === 0) {
      setIsRunning(false);
      setProgress(100);
      return;
    }

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logSequence.length) {
        const item = logSequence[currentLogIndex];
        setDisplayedLogs(prev => [...prev, item]);
        setProgress(Math.floor(((currentLogIndex + 1) / logSequence.length) * 100));
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setProgress(100);
        toast.success("Authorization flaw validated.");
      }
    }, 1200);
  };

  const checkAnswer = () => {
    if (!selectedAnswer) {
      toast.error("Please select an option before continuing.");
      return;
    }
    const correct = selectedAnswer === question.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      toast.success("Correct analysis! Excellent work.");
    } else {
      toast.error("Incorrect theory alignment. Read the explanation.");
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return '#ff0033'; // red theme base
      case 'warn': return '#ffb300';
      case 'success': return '#00ff41';
      default: return '#ff8b8b'; // red text secondary
    }
  };

  const visualContent = (
    <div className="w-full flex flex-col h-[400px]">
      <BlueMatrixTerminal theme="red" title="BURP_SUITE_TERMINAL" osName="AUTH_TAMPER_OS" height="100%">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-[#ff0033]">
            <Terminal className="w-5 h-5" />
            <span className="font-mono text-xs font-bold tracking-widest">INJECTOR_NODE</span>
          </div>
          <button
            onClick={startReconLoop}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-[#ff0033] hover:bg-[#cc0029] text-white disabled:opacity-50 rounded-md transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            Inject Payload
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-4 text-[#ff8b8b]">
          <div className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${progress > 0 && progress < 40 ? 'border-[#ff0033] bg-[rgba(255,0,51,0.2)] scale-105' : 'border-[rgba(255,0,51,0.3)] bg-[rgba(255,0,51,0.05)] opacity-60'}`}>
            <Key className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-mono font-bold tracking-wider">1. AUTHENTICATE</span>
            <span className="text-[8px]">Session Created</span>
          </div>
          <div className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${progress >= 40 && progress < 80 ? 'border-[#ff0033] bg-[rgba(255,0,51,0.2)] scale-105' : 'border-[rgba(255,0,51,0.3)] bg-[rgba(255,0,51,0.05)] opacity-60'}`}>
            <RefreshCw className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-mono font-bold tracking-wider">2. TAMPER</span>
            <span className="text-[8px]">ID Manipulation</span>
          </div>
          <div className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${progress >= 80 ? 'border-[#ff0033] bg-[rgba(255,0,51,0.2)] scale-105' : 'border-[rgba(255,0,51,0.3)] bg-[rgba(255,0,51,0.05)] opacity-60'}`}>
            <EyeOff className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-mono font-bold tracking-wider">3. EXPLOIT</span>
            <span className="text-[8px]">IDOR Confirmed</span>
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-[10px] font-mono text-[#cc6666]">
            <span>TEST LATENCY: 0.8s</span>
            <span>PROGRESS: {progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[rgba(255,0,51,0.1)] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 bg-[#ff0033]`}
              style={{ width: `${progress}%`, boxShadow: '0 0 10px #ff0033' }}
            ></div>
          </div>
        </div>

        <div className="font-mono text-xs space-y-1 mt-4 border-t border-[rgba(255,0,51,0.2)] pt-4">
          {displayedLogs.map((log, index) => (
            <div key={index} className="leading-relaxed pl-2 border-l-2" style={{ borderColor: getLogColor(log.level), color: getLogColor(log.level) }}>
              [{log.timestamp}] {log.message}
            </div>
          ))}
          {isRunning && (
            <div className="flex items-center gap-1.5 text-[#ff0033] text-[11px] animate-pulse mt-2">
              <span className="w-1.5 h-1.5 bg-[#ff0033] rounded-full animate-ping"></span>
              <span>Tampering request identifier parameters...</span>
            </div>
          )}
        </div>
      </BlueMatrixTerminal>
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
          onClick={resetSimulator}
          className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline"
        >
          Reset Simulation
        </button>

        {!showResult ? (
          <button
            onClick={checkAnswer}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            Verify Analysis
          </button>
        ) : (
          <div className="flex items-center gap-2 animate-in fade-in">
            {isCorrect ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/30">
                <CheckCircle className="w-4 h-4" /> Correct Analysis
              </span>
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

export default AuthorizationTesting;
