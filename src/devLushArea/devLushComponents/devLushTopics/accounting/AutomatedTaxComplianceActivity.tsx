import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircle, XCircle, Search, RefreshCw, Landmark, FileText, Database } from 'lucide-react';
import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import { DevLushLayout } from '../../devLushTopicsView/DevLushLayout';
import SaveTheoryButton from '../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';
import { DevLushTheoryBridge } from '../../devLushTopicsView/DevLushTheoryBridge';
import { motion, AnimatePresence } from 'motion/react';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const AutomatedTaxComplianceActivity: React.FC<ChapterProps> = ({
  step,
  exercises,
  infoVisible,
  infoPlacement,
  settings
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [processLogs, setProcessLogs] = useState<string[]>([]);
  const [activeStage, setActiveStage] = useState<'idle' | 'extracting' | 'api' | 'complete'>('idle');

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    resetSimulator();
  }, [step]);

  const resetSimulator = () => {
    setIsRunning(false);
    setActiveStage('idle');
    setProcessLogs([
      "SYSTEM: Waiting for document ingestion...",
      "TAX_AGENT: Ready to process incoming invoice."
    ]);
  };

  const runTaxProcessing = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProcessLogs([]);
    setActiveStage('extracting');

    const logChain = [
      { text: "TAX_AGENT: Reading PDF Invoice INV-8890...", delay: 0, stage: 'extracting' as const },
      { text: "LLM_PARSE: Extracting entity relationships. Vendor: 'CloudTech Solutions'.", delay: 800, stage: 'extracting' as const },
      { text: "LLM_PARSE: Location identified: 'San Francisco, CA'. Product: 'B2B SaaS Subscription'.", delay: 1600, stage: 'extracting' as const },
      { text: "SYSTEM: Handoff to deterministic API layer.", delay: 2400, stage: 'api' as const },
      { text: "API_CALL: Fetching ruleset from CA_Tax_Authority via API...", delay: 3000, stage: 'api' as const },
      { text: "API_RESPONSE: CA State Tax for SaaS = 0.00% (Exempt).", delay: 3800, stage: 'complete' as const },
      { text: "TAX_AGENT: Invoice successfully processed and marked exempt. Ledger updated.", delay: 4500, stage: 'complete' as const }
    ];

    logChain.forEach((item) => {
      setTimeout(() => {
        setProcessLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${item.text}`]);
        setActiveStage(item.stage);
        if (item.stage === 'complete' && item.text.includes("successfully")) {
          toast.success("Deterministic API logic successfully resolved tax rate without hallucination!");
        }
      }, item.delay);
    });

    setTimeout(() => {
      setIsRunning(false);
    }, 5000);
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

  const visualContent = (
    <div className="w-full flex flex-col">
      {/* Simulation Visualization */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-white">Automated Tax Architecture Pipeline</h3>
          </div>
          <button
            onClick={runTaxProcessing}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {isRunning ? 'Processing...' : 'Ingest Invoice'}
          </button>
        </div>

        {/* SVG Pipeline */}
        <div className="w-full h-40 mb-8 relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 400 120" className="w-full h-full">
            {/* Nodes */}
            <rect x="20" y="40" width="80" height="40" rx="8" fill={activeStage === 'extracting' ? "#312e81" : "#1e293b"} stroke={activeStage === 'extracting' ? "#6366f1" : "#475569"} strokeWidth="2" />
            <text x="60" y="60" textAnchor="middle" fontSize="10" fill="#cbd5e1" fontWeight="bold">EXTRACTOR</text>

            <rect x="160" y="40" width="80" height="40" rx="8" fill={activeStage === 'api' ? "#064e3b" : "#1e293b"} stroke={activeStage === 'api' ? "#10b981" : "#475569"} strokeWidth="2" />
            <text x="200" y="60" textAnchor="middle" fontSize="10" fill="#cbd5e1" fontWeight="bold">API ENGINE</text>

            <rect x="300" y="40" width="80" height="40" rx="8" fill={activeStage === 'complete' ? "#1e3a8a" : "#1e293b"} stroke={activeStage === 'complete' ? "#3b82f6" : "#475569"} strokeWidth="2" />
            <text x="340" y="60" textAnchor="middle" fontSize="10" fill="#cbd5e1" fontWeight="bold">LEDGER</text>

            {/* Paths */}
            <path d="M 100 60 L 160 60" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 240 60 L 300 60" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />

            {/* Animated Documents */}
            <g style={{ transform: activeStage === 'extracting' ? 'translateX(60px)' : activeStage === 'api' ? 'translateX(200px)' : activeStage === 'complete' ? 'translateX(340px)' : 'translateX(0)', transition: 'transform 1s ease-in-out', opacity: activeStage === 'idle' ? 0 : 1 }}>
              <rect x="-10" y="45" width="20" height="30" fill="#f8fafc" stroke="#94a3b8" />
              <line x1="-5" y1="52" x2="5" y2="52" stroke="#94a3b8" strokeWidth="1" />
              <line x1="-5" y1="58" x2="5" y2="58" stroke="#94a3b8" strokeWidth="1" />
              <line x1="-5" y1="64" x2="5" y2="64" stroke="#94a3b8" strokeWidth="1" />
            </g>
          </svg>
        </div>

        <div className="bg-black/50 p-4 rounded-xl font-mono text-xs text-emerald-400 h-48 overflow-y-auto">
          {processLogs.length === 0 ? (
            <div className="text-slate-500 italic">Waiting to start tax agent pipeline...</div>
          ) : (
            processLogs.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-1"
              >
                {log}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const interactionContent = (
    <div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {question.title || "Strategic Analysis"}
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-6 font-medium">
          {question.question}
        </p>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !showResult && setSelectedAnswer(option)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3
                ${showResult
                  ? option === question.answer
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-500/50'
                    : option === selectedAnswer
                      ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500 dark:border-rose-500/50 opacity-50'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-50'
                  : selectedAnswer === option
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 dark:border-indigo-500/50 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
            >
              <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center
                ${selectedAnswer === option ? 'border-indigo-500' : 'border-slate-300 dark:border-slate-600'}
              `}>
                {selectedAnswer === option && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
              </div>
              <span className={`text-sm ${selectedAnswer === option ? 'text-indigo-900 dark:text-indigo-100 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>
                {option}
              </span>
            </button>
          ))}
        </div>

        {!showResult ? (
          <button
            onClick={checkAnswer}
            disabled={!selectedAnswer}
            className="mt-6 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Final Architecture Strategy
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-5 rounded-xl border ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
              <h4 className={`font-bold ${isCorrect ? 'text-emerald-900 dark:text-emerald-300' : 'text-rose-900 dark:text-rose-300'}`}>
                {isCorrect ? "Optimal Security Achieved" : "Architectural Flaw"}
              </h4>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
              {question.explanation}
            </p>
            {!isCorrect && (
              <button
                onClick={() => {
                  setSelectedAnswer(null);
                  setShowResult(false);
                }}
                className="text-sm font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Reassess Architecture
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );

  const TollBoothAnalogy: React.FC = () => (
    <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
      <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider flex items-center gap-2">
        <Landmark className="w-4 h-4 text-indigo-500" /> Analogy: Automated Toll Booth
      </h5>
      <svg viewBox="0 0 200 120" className="w-full h-40">
        {/* Road */}
        <path d="M 0 70 L 200 70 M 0 90 L 200 90" stroke="#cbd5e1" strokeWidth="20" />
        <path d="M 0 80 L 200 80" stroke="#fcd34d" strokeWidth="1" strokeDasharray="4 4" />

        {/* Toll Booth */}
        <rect x="80" y="30" width="40" height="35" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
        <rect x="85" y="40" width="30" height="15" fill="#1e293b" />
        <text x="100" y="50" textAnchor="middle" fontSize="6" fill="#10b981" fontWeight="bold">TAX_RULE</text>
        <rect x="95" y="65" width="10" height="15" fill="#94a3b8" /> {/* pillar */}

        {/* Boom Gate */}
        <line x1="105" y1="70" x2="105" y2="90" stroke="#ef4444" strokeWidth="2" />

        {/* Cars */}
        <g className="animate-[drive_3s_linear_infinite]">
          <rect x="20" y="73" width="15" height="8" rx="2" fill="#3b82f6" />
          <circle cx="23" cy="81" r="2" fill="#1e293b" />
          <circle cx="32" cy="81" r="2" fill="#1e293b" />
        </g>

        <text x="100" y="115" textAnchor="middle" fontSize="8" fill="currentColor" className="text-slate-500">Fixed rules (Toll API) deterministically classify inputs (Vehicles)</text>
      </svg>
      <style dangerouslySetInnerHTML={{
        __html: `
            @keyframes drive {
                from { transform: translateX(0); }
                to { transform: translateX(150px); }
            }
        `}} />
    </div>
  );

  const theoryContent = question.theory ? (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={question.theory} />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <DevLushTheoryBridge item={{ labId: 'accounting-agents', exerciseTitle: question.title, theory: question.theory }} />
        <TollBoothAnalogy />
      </div>
    </div>
  ) : null;

  return (
    <DevLushLayout
      visualContent={visualContent}
      interactionContent={interactionContent}
      theoryContent={theoryContent}
      prompt={question.prompt}
      title={question.title}
      infoVisible={infoVisible}
      infoPlacement={infoPlacement}
      settings={settings}
    />
  );
};

export default AutomatedTaxComplianceActivity;
