import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../../types';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Terminal, RefreshCw, Search, LockOpen, Activity } from 'lucide-react';
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

export const AttackSurfaceDiscovery: React.FC<ChapterProps> = ({ 
  step, 
  exercises, 
  infoVisible, 
  infoPlacement, 
  settings 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [displayedLogs, setDisplayedLogs] = useState<{timestamp: string, level: string, message: string}[]>([]);
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
      { timestamp: new Date().toLocaleTimeString(), level: "info", message: "SYSTEM: Sandbox ready." },
      { timestamp: new Date().toLocaleTimeString(), level: "info", message: "Ready to initiate bug bounty test sequence..." }
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
        toast.success("Test sequence finalized!");
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
      switch(level) {
          case 'error': return '#f43f5e'; // rose-500
          case 'warn': return '#f59e0b'; // amber-500
          case 'success': return '#10b981'; // emerald-500
          default: return '#94a3b8'; // slate-400
      }
  };

  const visualContent = (
    <div className="w-full flex flex-col h-[400px]">
      <BlueMatrixTerminal theme="amber" title="BURP_SUITE_TERMINAL" osName="RECON_OS_V1" height="100%">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-[#ffb300]">
            <Terminal className="w-5 h-5" />
            <span className="font-mono text-xs font-bold tracking-widest">NETWORK_SCANNER</span>
          </div>
          <button
            onClick={startReconLoop}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-[#ffb300] hover:bg-[#e6a100] text-black disabled:opacity-50 rounded-md transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            Run Recon Sequence
          </button>
        </div>

        {/* Network Map SVG */}
        <div className="w-full h-32 mb-4 bg-black/40 rounded border border-[#ffb300]/20 relative overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 300 100" className="w-full h-full">
                {/* Main Target */}
                <circle cx="150" cy="50" r="15" fill="#1e293b" stroke="#ffb300" strokeWidth="2" className={progress > 0 ? "animate-pulse" : ""} />
                <text x="150" y="53" textAnchor="middle" fontSize="6" fill="#ffb300" fontWeight="bold">TARGET</text>
                
                {/* Subdomains / Ports */}
                <circle cx="80" cy="20" r="8" fill="#1e293b" stroke={progress > 20 ? "#10b981" : "#475569"} strokeWidth="1.5" />
                <text x="80" y="35" textAnchor="middle" fontSize="5" fill="#94a3b8">api.target</text>
                
                <circle cx="80" cy="80" r="8" fill="#1e293b" stroke={progress > 40 ? "#f43f5e" : "#475569"} strokeWidth="1.5" />
                <text x="80" y="95" textAnchor="middle" fontSize="5" fill="#94a3b8">dev.target</text>
                
                <circle cx="220" cy="20" r="8" fill="#1e293b" stroke={progress > 60 ? "#10b981" : "#475569"} strokeWidth="1.5" />
                <text x="220" y="35" textAnchor="middle" fontSize="5" fill="#94a3b8">staging.target</text>
                
                <circle cx="220" cy="80" r="8" fill="#1e293b" stroke={progress > 80 ? "#f43f5e" : "#475569"} strokeWidth="1.5" />
                <text x="220" y="95" textAnchor="middle" fontSize="5" fill="#94a3b8">admin.target</text>

                {/* Connections */}
                <path d="M 140 43 L 88 25" stroke="#ffb300" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" className={progress > 0 && progress < 30 ? "animate-pulse" : ""} />
                <path d="M 140 57 L 88 75" stroke="#ffb300" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" className={progress > 30 && progress < 50 ? "animate-pulse" : ""} />
                <path d="M 160 43 L 212 25" stroke="#ffb300" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" className={progress > 50 && progress < 70 ? "animate-pulse" : ""} />
                <path d="M 160 57 L 212 75" stroke="#ffb300" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" className={progress > 70 && progress < 90 ? "animate-pulse" : ""} />
                
                {/* Scanning rings */}
                {isRunning && <circle cx="150" cy="50" r="30" fill="none" stroke="#ffb300" strokeWidth="0.5" opacity="0.3" className="animate-ping" />}
            </svg>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-4 text-[#ffdf8b]">
          <div className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${progress > 0 && progress < 40 ? 'border-[#ffb300] bg-[rgba(255,179,0,0.2)] scale-105' : 'border-[rgba(255,179,0,0.3)] bg-[rgba(255,179,0,0.05)] opacity-60'}`}>
            <Search className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-mono font-bold tracking-wider">1. RECON</span>
            <span className="text-[8px]">Mapping Attack Surface</span>
          </div>
          <div className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${progress >= 40 && progress < 80 ? 'border-[#ffb300] bg-[rgba(255,179,0,0.2)] scale-105' : 'border-[rgba(255,179,0,0.3)] bg-[rgba(255,179,0,0.05)] opacity-60'}`}>
            <Activity className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-mono font-bold tracking-wider">2. TEST</span>
            <span className="text-[8px]">Fuzzing & Validation</span>
          </div>
          <div className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${progress >= 80 ? 'border-[#ffb300] bg-[rgba(255,179,0,0.2)] scale-105' : 'border-[rgba(255,179,0,0.3)] bg-[rgba(255,179,0,0.05)] opacity-60'}`}>
            <CheckCircle className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-mono font-bold tracking-wider">3. SCOPED</span>
            <span className="text-[8px]">Asset Confirmed</span>
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-[10px] font-mono text-[#ccb366]">
            <span>TEST LATENCY: 0.8s</span>
            <span>PROGRESS: {progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[rgba(255,179,0,0.1)] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 bg-[#ffb300]`} 
              style={{ width: `${progress}%`, boxShadow: '0 0 10px #ffb300' }}
            ></div>
          </div>
        </div>

        <div className="font-mono text-xs space-y-1 mt-4 border-t border-[rgba(255,179,0,0.2)] pt-4">
          {displayedLogs.map((log, index) => (
            <div key={index} className="leading-relaxed pl-2 border-l-2" style={{ borderColor: getLogColor(log.level), color: getLogColor(log.level) }}>
              [{log.timestamp}] {log.message}
            </div>
          ))}
          {isRunning && (
            <div className="flex items-center gap-1.5 text-[#ffb300] text-[11px] animate-pulse mt-2">
              <span className="w-1.5 h-1.5 bg-[#ffb300] rounded-full animate-ping"></span>
              <span>Intercepting and analyzing traffic...</span>
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
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
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

  const BurglaryReconAnalogy: React.FC = () => (
    <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-500" /> Analogy: House Reconnaissance
        </h5>
        <svg viewBox="0 0 200 120" className="w-full h-40">
            {/* House */}
            <path d="M 60 60 L 100 20 L 140 60 L 140 110 L 60 110 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            <rect x="90" y="80" width="20" height="30" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="95" cy="95" r="1.5" fill="#64748b" /> {/* Door knob */}
            
            <rect x="70" y="65" width="15" height="15" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="115" y="65" width="15" height="15" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
            
            {/* Attacker */}
            <circle cx="40" cy="90" r="5" fill="#ef4444" />
            <path d="M 40 95 L 40 110 M 35 100 L 45 100 M 35 115 L 40 110 L 45 115" stroke="#ef4444" strokeWidth="1.5" fill="none" />
            
            {/* Recon paths */}
            <path d="M 45 90 C 60 85, 75 75, 75 72" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" fill="none" className="animate-pulse" />
            <path d="M 45 90 C 60 90, 80 90, 85 90" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" fill="none" className="animate-pulse" style={{animationDelay: '0.3s'}} />
            <path d="M 45 90 C 70 50, 100 30, 120 62" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" fill="none" className="animate-pulse" style={{animationDelay: '0.6s'}} />

            <text x="100" y="118" textAnchor="middle" fontSize="6" fill="currentColor" className="text-slate-500">Checking every window (port) and door (endpoint)</text>
        </svg>
    </div>
  );

  const theoryContent = theoryData ? (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={theoryData} />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <DevLushTheoryBridge item={{ labId: 'cybersecurity', exerciseTitle: question.title, theory: theoryData }} />
        <BurglaryReconAnalogy />
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

export default AttackSurfaceDiscovery;
