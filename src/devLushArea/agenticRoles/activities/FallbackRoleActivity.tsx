import React, { useState, useEffect } from 'react';
import { AgenticRoleExercise } from '../agenticRoleTypes';
import { toast } from 'sonner';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Database,
  ShieldCheck
} from 'lucide-react';
import { getRoleTheme, getDifficultyBadge } from '../agenticThemeHelpers';

export interface ActivityComponentProps {
  step: number;
  exercises: AgenticRoleExercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: any;
  onComplete?: () => void;
}

/**
 * Universal High-Fidelity Interactive Activity Simulator
 * Serves as the fallback and modular base for all Agentic Role Missions.
 */
export const FallbackRoleActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  infoVisible,
  infoPlacement,
  settings,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [streamedLogs, setStreamedLogs] = useState<Array<{ timestamp: string; level: string; message: string }>>([]);

  // Reset local state when step changes
  useEffect(() => {
    setSelectedOption(null);
    setIsEvaluated(false);
    setIsCorrect(false);
    setIsRunningSimulation(false);
    
    // Seed initial logs
    if (currentExercise?.logs && currentExercise.logs.length > 0) {
      setStreamedLogs(currentExercise.logs.slice(0, 1));
    } else {
      setStreamedLogs([
        {
          timestamp: new Date().toLocaleTimeString(),
          level: 'info',
          message: `AGENT_CORE: Initialized mission workspace for ${currentExercise?.title || 'Agentic Mission'}.`,
        }
      ]);
    }
  }, [step, currentExercise]);

  const handleRunSimulation = () => {
    if (isRunningSimulation) return;
    setIsRunningSimulation(true);
    setStreamedLogs([]);

    const logPool = currentExercise?.logs || [
      { timestamp: '00:00:01', level: 'info', message: 'AGENT_ORCHESTRATOR: Spawning worker subagents...' },
      { timestamp: '00:00:02', level: 'info', message: 'TELEMETRY_STREAM: Ingested target environment state.' },
      { timestamp: '00:00:03', level: 'warn', message: 'EVAL_LOOP: Anomaly pattern isolated in telemetry stream.' },
      { timestamp: '00:00:04', level: 'success', message: 'AGENT_EXEC: Mission objective reached with 98.4% confidence.' }
    ];

    logPool.forEach((log, index) => {
      setTimeout(() => {
        setStreamedLogs((prev) => [...prev, log]);
        if (index === logPool.length - 1) {
          setIsRunningSimulation(false);
          toast.success("Agent simulation cycle completed!");
        }
      }, (index + 1) * 600);
    });
  };

  const handleSelectOption = (option: string) => {
    if (isEvaluated) return;
    setSelectedOption(option);
  };

  const handleVerifyAnswer = () => {
    if (!selectedOption) {
      toast.error("Please select a response before verifying.");
      return;
    }

    const correct = selectedOption === currentExercise.answer;
    setIsCorrect(correct);
    setIsEvaluated(true);

    if (correct) {
      toast.success("Correct Assessment! Mission step passed.");
      if (onComplete) onComplete();
    } else {
      const feedback = currentExercise.wrong_answer_feedback?.find(
        (f) => f.option === selectedOption
      );
      toast.error(feedback?.feedback || "Incorrect analysis. Review the theory panel and try again.");
    }
  };

  const theme = getRoleTheme(currentExercise?.tags?.[0] || 'seo');
  const difficultyBadge = getDifficultyBadge(currentExercise?.difficulty || 'easy');

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${theme.bgSoftGlow} ${theme.borderSoft} border`}>
            <Cpu className={`w-5 h-5 ${theme.text}`} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {currentExercise?.title || 'Interactive Agentic Sandbox'}
            </h2>
            <p className="text-xs text-slate-400">
              Day {currentExercise?.dayNumber || 1} Mission Sandbox • Step {step + 1} of {exercises.length || 1}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyBadge.badgeClass}`}>
            {difficultyBadge.label}
          </span>

          <button
            onClick={handleRunSimulation}
            disabled={isRunningSimulation}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isRunningSimulation
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isRunningSimulation ? 'animate-spin' : ''}`} />
            {isRunningSimulation ? 'Simulating...' : 'Run Agent Analysis'}
          </button>
        </div>
      </div>

      {/* Main Simulation Workbench Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Terminal Output & Telemetry Viewport (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>agent-runtime-telemetry.log</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
            </div>

            {/* Terminal Stream Body */}
            <div className="p-4 font-mono text-xs text-slate-300 min-h-[220px] max-h-[280px] overflow-y-auto space-y-2 custom-scrollbar">
              {streamedLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-150">
                  <span className="text-slate-500 flex-shrink-0">[{log.timestamp}]</span>
                  <span
                    className={`font-semibold flex-shrink-0 ${
                      log.level === 'error'
                        ? 'text-rose-400'
                        : log.level === 'warn'
                        ? 'text-amber-400'
                        : log.level === 'success'
                        ? 'text-emerald-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    [{log.level.toUpperCase()}]
                  </span>
                  <span className="text-slate-300 leading-relaxed">{log.message}</span>
                </div>
              ))}
              {isRunningSimulation && (
                <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                  <span>&gt;</span>
                  <span>Executing autonomous subagent decision tree...</span>
                </div>
              )}
            </div>
          </div>

          {/* Domain Specific Data Snapshot Preview */}
          {currentExercise?.roleSpecificData && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  Domain Telemetry Payload
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  LIVE BUFFER
                </span>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-3 rounded-lg overflow-x-auto max-h-[140px] custom-scrollbar border border-slate-800">
                {JSON.stringify(currentExercise.roleSpecificData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right: Candidate Assessment & Decision Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Assessment Challenge
                </span>
                {isEvaluated && (
                  <span
                    className={`text-xs font-bold flex items-center gap-1 ${
                      isCorrect ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {isCorrect ? 'PASSED' : 'RETRY REQUIRED'}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {currentExercise?.prompt}
                </p>
                <h3 className="text-sm font-semibold text-white leading-snug">
                  {currentExercise?.question}
                </h3>
              </div>

              {/* Options Selector */}
              <div className="space-y-2.5 pt-1">
                {currentExercise?.options?.map((opt, optIdx) => {
                  const isSelected = selectedOption === opt;
                  let optStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40';

                  if (isEvaluated) {
                    if (opt === currentExercise.answer) {
                      optStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-500/10 text-rose-300';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-indigo-500 bg-indigo-500/15 text-white font-semibold shadow-sm shadow-indigo-500/20';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isEvaluated}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${optStyle}`}
                    >
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {isEvaluated && (
                <div
                  className={`p-3.5 rounded-lg text-xs leading-relaxed animate-in fade-in duration-200 border ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                  }`}
                >
                  <p className="font-semibold mb-1">
                    {isCorrect ? 'Analysis Confirmed:' : 'Technical Evaluation:'}
                  </p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {currentExercise.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              {isEvaluated ? (
                <button
                  onClick={() => {
                    setIsEvaluated(false);
                    setSelectedOption(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Answer
                </button>
              ) : (
                <div className="text-[11px] text-slate-500 font-mono">
                  Select best candidate response
                </div>
              )}

              {!isEvaluated && (
                <button
                  onClick={handleVerifyAnswer}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verify Analysis
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackRoleActivity;
