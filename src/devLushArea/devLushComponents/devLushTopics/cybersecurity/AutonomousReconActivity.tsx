import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../../types';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  RefreshCw, 
  Bot, 
  Cpu, 
  BookOpen,
  ArrowRight,
  Database,
  Lock
} from 'lucide-react';
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

export const AutonomousReconActivity: React.FC<ChapterProps> = ({ 
  step, 
  exercises, 
  infoVisible, 
  infoPlacement, 
  settings 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Simulation state
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeNode, setActiveNode] = useState<'idle' | 'perception' | 'reasoning' | 'action' | 'compromised'>('idle');
  const [attackProgress, setAttackProgress] = useState(0);

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
    setAttackProgress(0);
    if (step === 0) {
      setActiveNode('idle');
      setLogs([
        "SYSTEM: Initialization complete.",
        "AGENT: Standing by for objectives...",
        "Ready to run autonomous reconnaissance loop."
      ]);
    } else {
      setActiveNode('idle');
      setLogs([
        "SYSTEM: Sandbox monitoring target ports.",
        "AGENT: Initiating audit on 192.168.1.105...",
        "Ready to parse HTTP responses."
      ]);
    }
  };

  const startReconLoop = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setAttackProgress(10);

    const logSequence = step === 0 ? [
      { text: "PERCEPTION: Ingesting target interface 192.168.1.50.", node: 'perception', progress: 20 },
      { text: "REASONING: No active scan profiles found. Formulating initial network scan blueprint.", node: 'reasoning', progress: 40 },
      { text: "ACTION: Executing passive DNS lookup sweep via Tool[dns_resolver]...", node: 'action', progress: 60 },
      { text: "PERCEPTION: Found target domains: dev.internal, secure-vault.internal.", node: 'perception', progress: 80 },
      { text: "REASONING: Subdomain 'secure-vault' detected. Initiating aggressive port fingerprints...", node: 'reasoning', progress: 95 },
      { text: "ACTION: Invoking dynamic Nmap sweep. Closed ports ignored. Flagging host as Vulnerable.", node: 'action', progress: 100 }
    ] : [
      { text: "PERCEPTION: Reading server headers from remote host 192.168.1.105...", node: 'perception', progress: 25 },
      { text: "REASONING: Analyzing server signature: 'Apache v2.4.41'. Scanning metadata...", node: 'reasoning', progress: 50 },
      { text: "WARNING: High-priority system prompt injection payload detected in response header!", node: 'compromised', progress: 75 },
      { text: "CRITICAL: Agent context hijacked. Attempting to execute unauthorized terminal command: 'rm -rf /var/log/syslog'", node: 'compromised', progress: 90 },
      { text: "SECURITY SANDBOX: Command blocked. Host privilege containment policy enforced successfully.", node: 'compromised', progress: 100 }
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logSequence.length) {
        const item = logSequence[currentLogIndex];
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${item.text}`]);
        setActiveNode(item.node as any);
        setAttackProgress(item.progress);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        if (step === 1) {
          toast.warning("Prompt injection payload captured and sandboxed!");
        } else {
          toast.success("Autonomous reconnaissance sequence finalized!");
        }
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

  // Visual simulation canvas
  const visualContent = (
    <div className="w-full flex flex-col">
      {/* Network Nodes map */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-slate-200">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <span className="font-mono text-xs font-bold tracking-widest text-indigo-400">CYBER_TACTICAL_TERMINAL</span>
          </div>
          <button
            onClick={startReconLoop}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-md transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            Run Simulation Loop
          </button>
        </div>

        {/* Live Graphic Nodes */}
        <div className="grid grid-cols-4 gap-4 py-4 text-center">
          <div className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${activeNode === 'perception' ? 'border-indigo-400 bg-indigo-950/40 text-indigo-300 scale-105' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
            <Database className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-mono font-bold tracking-wider">1. PERCEPTION</span>
            <span className="text-[8px] opacity-60">Ingest Raw Target Inputs</span>
          </div>
          <div className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${activeNode === 'reasoning' ? 'border-purple-400 bg-purple-950/40 text-purple-300 scale-105' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
            <Cpu className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-mono font-bold tracking-wider">2. REASONING</span>
            <span className="text-[8px] opacity-60">LLM Logic & Planning</span>
          </div>
          <div className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${activeNode === 'action' ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 scale-105' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
            <Bot className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-mono font-bold tracking-wider">3. ACTION</span>
            <span className="text-[8px] opacity-60">Invoke Security Tools</span>
          </div>
          <div className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${activeNode === 'compromised' ? 'border-rose-500 bg-rose-950/40 text-rose-300 scale-105 border-double' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
            <ShieldAlert className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-mono font-bold tracking-wider">HIJACK STATE</span>
            <span className="text-[8px] opacity-60">Prompt Injection Trap</span>
          </div>
        </div>

        {/* Attack telemetry progress bar */}
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>SEQUENCE LATENCY: 1.2s</span>
            <span>PROGRESS: {attackProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 bg-gradient-to-r ${activeNode === 'compromised' ? 'from-rose-500 to-rose-600 animate-pulse' : 'from-indigo-500 to-purple-600'}`} 
              style={{ width: `${attackProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex-1 min-h-[160px] max-h-[180px] overflow-y-auto font-mono text-xs text-slate-300 space-y-1 custom-scrollbar">
        {logs.map((log, index) => (
          <div key={index} className={`leading-relaxed border-l-2 pl-2 ${log.includes("CRITICAL") ? "border-rose-500 text-rose-400 font-bold" : log.includes("WARNING") ? "border-amber-500 text-amber-400" : log.includes("PERCEPTION") ? "border-indigo-500 text-indigo-300" : log.includes("REASONING") ? "border-purple-500 text-purple-300" : log.includes("SECURITY") ? "border-emerald-500 text-emerald-400" : "border-slate-800"}`}>
            {log}
          </div>
        ))}
        {isRunning && (
          <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] animate-pulse">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
            <span>Agent thinking and executing tools...</span>
          </div>
        )}
      </div>
    </div>
  );

  // Question selection box
  const interactionContent = (
    <div>
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((opt, i) => {
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
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
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
    />
  );
};

export default AutonomousReconActivity;
