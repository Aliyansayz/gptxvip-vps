import React, { useState, useEffect } from "react";
import { Exercise } from "../../../../types";
import { toast } from "sonner";
import { CheckCircle, XCircle, Bot, Activity } from "lucide-react";
import { LabSettings } from "../../../agentDevRootComponents/LabSettingsMenu";
import { DevLushLayout } from "../../devLushTopicsView/DevLushLayout";
import SaveTheoryButton from "../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton";
import { DevLushTheoryBridge } from "../../devLushTopicsView/DevLushTheoryBridge";

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: "side" | "bottom";
  settings?: LabSettings;
}

export const GenericAgentActivity: React.FC<ChapterProps> = ({
  step,
  exercises,
  infoVisible,
  infoPlacement,
  settings,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setLogs([]);
    setIsRunning(false);
  }, [step]);

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);

    // Use logs from the question data if available, otherwise mock logs
    const defaultLogs = [
      {
        timestamp: "00:00",
        level: "info",
        message: "Initializing agent systems...",
      },
      {
        timestamp: "00:01",
        level: "info",
        message: "Analyzing environment context...",
      },
      {
        timestamp: "00:03",
        level: "success",
        message: "Task completed successfully.",
      },
    ];

    const logData = question.logs || defaultLogs;

    logData.forEach((logItem: any, idx: number) => {
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          `[${logItem.timestamp || new Date().toLocaleTimeString()}] ${logItem.level ? logItem.level.toUpperCase() + ": " : ""}${logItem.message}`,
        ]);
      }, idx * 1000);
    });

    setTimeout(
      () => {
        setIsRunning(false);
        toast.success("Agent simulation completed");
      },
      logData.length * 1000 + 500,
    );
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

  const PersonalShopperAnalogy: React.FC = () => (
    <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-500" /> Analogy: Personal Shopper
        </h5>
        <svg viewBox="0 0 200 120" className="w-full h-40">
            {/* Customer */}
            <circle cx="30" cy="50" r="10" fill="#94a3b8" />
            <rect x="25" y="60" width="10" height="20" fill="#94a3b8" />
            
            {/* Shopping List Handoff */}
            <path d="M 40 60 L 70 60" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="2 2" />
            <rect x="50" y="55" width="10" height="15" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
            <line x1="52" y1="58" x2="58" y2="58" stroke="#64748b" strokeWidth="0.5" />
            <line x1="52" y1="62" x2="58" y2="62" stroke="#64748b" strokeWidth="0.5" />

            {/* Concierge (Agent) */}
            <circle cx="90" cy="50" r="10" fill="#c4b5fd" />
            <rect x="85" y="60" width="10" height="20" fill="#c4b5fd" />
            <text x="90" y="45" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#4f46e5">AGENT</text>

            {/* Store Aisles */}
            <rect x="130" y="20" width="40" height="15" fill="#e2e8f0" stroke="#94a3b8" />
            <rect x="130" y="50" width="40" height="15" fill="#e2e8f0" stroke="#94a3b8" />
            <rect x="130" y="80" width="40" height="15" fill="#e2e8f0" stroke="#94a3b8" />

            {/* Items */}
            <circle cx="140" cy="27" r="4" fill="#3b82f6" />
            <circle cx="160" cy="57" r="4" fill="#ef4444" className="animate-pulse" />
            <circle cx="150" cy="87" r="4" fill="#10b981" />

            {/* Agent path */}
            <path d="M 100 60 C 110 60, 110 27, 130 27" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeDasharray="2 2" className="animate-pulse" />
            <path d="M 100 60 C 110 60, 110 87, 130 87" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeDasharray="2 2" className="animate-pulse" style={{animationDelay: '0.5s'}} />

            <text x="100" y="115" textAnchor="middle" fontSize="8" fill="currentColor" className="text-slate-500">Agent autonomously fulfills intent by navigating systems</text>
        </svg>
    </div>
  );

  const EcommerceCheckoutVisual = () => (
    <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                <span className="font-mono text-xs font-bold text-indigo-300 tracking-wider">ECOMMERCE_AGENT</span>
            </div>
            <button
                onClick={runSimulation}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 rounded-lg transition-all shadow-inner disabled:opacity-50"
            >
                <Activity className={`w-3.5 h-3.5 ${isRunning ? "animate-pulse" : ""}`} />
                {isRunning ? "Processing Order..." : "Checkout Cart"}
            </button>
        </div>

        {/* Main Vis */}
        <div className="flex-1 relative flex">
            {/* SVG Area */}
            <div className="flex-1 p-4">
                <svg viewBox="0 0 200 150" className="w-full h-full max-h-full">
                    {/* Conveyor Belt */}
                    <path d="M 0 100 L 200 100" stroke="#475569" strokeWidth="4" />
                    <path d="M 0 110 L 200 110" stroke="#334155" strokeWidth="20" />
                    {/* Belt Lines */}
                    <g className={isRunning ? "animate-[slide-left_1s_linear_infinite]" : ""}>
                        <line x1="20" y1="100" x2="20" y2="120" stroke="#1e293b" strokeWidth="2" />
                        <line x1="60" y1="100" x2="60" y2="120" stroke="#1e293b" strokeWidth="2" />
                        <line x1="100" y1="100" x2="100" y2="120" stroke="#1e293b" strokeWidth="2" />
                        <line x1="140" y1="100" x2="140" y2="120" stroke="#1e293b" strokeWidth="2" />
                        <line x1="180" y1="100" x2="180" y2="120" stroke="#1e293b" strokeWidth="2" />
                    </g>

                    {/* Scanner Node (Agent) */}
                    <rect x="80" y="30" width="40" height="40" rx="4" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
                    <text x="100" y="50" textAnchor="middle" fontSize="8" fill="#818cf8" fontWeight="bold">AI AGENT</text>
                    <path d="M 90 70 L 110 70 M 100 70 L 100 100" stroke="#4f46e5" strokeWidth="2" />
                    {/* Laser */}
                    {isRunning && <polygon points="90,70 110,70 120,100 80,100" fill="#6366f1" opacity="0.3" className="animate-pulse" />}

                    {/* Item Box */}
                    <g style={{ transform: isRunning ? 'translateX(120px)' : 'translateX(10px)', transition: 'transform 3s linear' }}>
                        <rect x="0" y="80" width="20" height="20" fill="#ca8a04" stroke="#854d0e" strokeWidth="2" />
                        <line x1="0" y1="90" x2="20" y2="90" stroke="#a16207" strokeWidth="1" />
                    </g>

                    {/* Decision Buckets */}
                    <rect x="150" y="120" width="40" height="30" fill="#064e3b" stroke="#10b981" />
                    <text x="170" y="140" textAnchor="middle" fontSize="6" fill="#34d399">APPROVED</text>
                </svg>
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes slide-left {
                        from { transform: translateX(40px); }
                        to { transform: translateX(0); }
                    }
                `}} />
            </div>

            {/* Logs Area */}
            <div className="w-1/3 border-l border-slate-800 bg-black/50 p-3 font-mono text-[10px] text-slate-300 overflow-y-auto custom-scrollbar">
                <div className="text-indigo-400 mb-2 font-bold border-b border-slate-800 pb-1">AGENT_LOGS</div>
                {logs.map((log, idx) => (
                    <div key={idx} className={`mb-1 ${log.includes("SUCCESS") ? "text-emerald-400" : log.includes("WARN") ? "text-amber-400" : "text-slate-400"}`}>
                        {log}
                    </div>
                ))}
                {!isRunning && logs.length === 0 && <div className="text-slate-600 italic">Waiting...</div>}
            </div>
        </div>
    </div>
  );

  const visualContent = (
    <div className="my-4 w-full">
      <EcommerceCheckoutVisual />
    </div>
  );

  const interactionContent = (
    <div className="space-y-4">
            {question?.question && (
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          {question.question}
        </h4>
      )}
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
              className={`text-left p-4 rounded-xl border font-sans text-sm font-medium transition-all duration-200 ${showResult ? (opt === question.answer ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400" : isSelected ? "bg-rose-50 dark:bg-rose-950/20 border-rose-400 text-rose-700 dark:text-rose-400" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-65") : isSelected ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-700 dark:text-indigo-400 scale-[1.01]" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isSelected ? "bg-indigo-500 text-white border-indigo-600" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 leading-snug">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center gap-4 pt-2">
        {!showResult ? (
          <button
            onClick={checkAnswer}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ml-auto"
          >
            Verify Analysis
          </button>
        ) : (
          <div className="flex items-center gap-2 animate-in fade-in ml-auto">
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
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Interactive Review:
          </p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );

  const theoryContent = (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={question.theory || question} />
      </div>
      <div className="flex-1">
        <div className="flex flex-col h-full gap-4">
            <DevLushTheoryBridge
              item={{
                labId: "generic-agent",
                exerciseTitle: question.title,
                theory: question.theory,
              }}
            />
            <PersonalShopperAnalogy />
        </div>
      </div>
    </div>
  );

  return (
    <DevLushLayout
      title={question.title}
      prompt={question.prompt}
      visualContent={visualContent}
      interactionContent={interactionContent}
      theoryContent={theoryContent}
      infoVisible={infoVisible}
      infoPlacement={infoPlacement}
      settings={settings}
    />
  );
};

export default GenericAgentActivity;
