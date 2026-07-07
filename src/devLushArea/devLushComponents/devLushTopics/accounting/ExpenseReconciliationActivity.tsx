import React, { useState, useEffect } from 'react';
import { Exercise } from '../../../../types';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Search, RefreshCw, FileImage, ShieldAlert, Receipt } from 'lucide-react';
import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import { DevLushLayout } from '../../devLushTopicsView/DevLushLayout';
import SaveTheoryButton from '../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';
import { DevLushTheoryBridge } from '../../devLushTopicsView/DevLushTheoryBridge';
import { motion } from 'motion/react';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const ExpenseReconciliationActivity: React.FC<ChapterProps> = ({ 
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
  const [activeStage, setActiveStage] = useState<'idle' | 'parsing' | 'policy' | 'complete'>('idle');

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
      "SYSTEM: Expense Agent initialized.",
      "Awaiting receipt image upload."
    ]);
  };

  const runExpenseProcessing = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProcessLogs([]);
    setActiveStage('parsing');

    const logChain = [
      { text: "VISION_MODEL: Scanning receipt_045.jpg...", delay: 0, stage: 'parsing' as const },
      { text: "EXTRACT: [Steak: $45.00] (Category: Meals)", delay: 800, stage: 'parsing' as const },
      { text: "EXTRACT: [Beer: $15.00] (Category: Alcohol)", delay: 1600, stage: 'parsing' as const },
      { text: "SYSTEM: Handing off to deterministic Policy Engine...", delay: 2400, stage: 'policy' as const },
      { text: "POLICY_EVAL: Checking 'Meals' ($45.00) <= $100.00 Limit. -> PASSED.", delay: 3000, stage: 'policy' as const },
      { text: "POLICY_EVAL: Checking 'Alcohol'. Rule: strict_deny. -> REJECTED.", delay: 3800, stage: 'policy' as const },
      { text: "EXPENSE_AGENT: Recalculating reimbursable total. Total: $45.00 (Tax applied automatically).", delay: 4500, stage: 'complete' as const },
      { text: "SYSTEM: Expense partially approved. Syncing with payroll ledger.", delay: 5200, stage: 'complete' as const }
    ];

    logChain.forEach((item) => {
      setTimeout(() => {
        setProcessLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${item.text}`]);
        setActiveStage(item.stage);
        if (item.stage === 'complete' && item.text.includes("approved")) {
          toast.success("Multimodal extraction and policy enforcement successful!");
        }
      }, item.delay);
    });

    setTimeout(() => {
      setIsRunning(false);
    }, 6000);
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
            <Receipt className="w-5 h-5 text-fuchsia-500" />
            <h3 className="font-semibold text-white">Expense Reconciliation Pipeline</h3>
          </div>
          <button
            onClick={runExpenseProcessing}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {isRunning ? 'Processing...' : 'Upload Receipt'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Stage 1: Multimodal Vision */}
            <div className={`flex flex-col items-center justify-center p-4 rounded-xl border ${activeStage === 'parsing' ? 'bg-fuchsia-900/40 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)]' : 'bg-slate-800 border-slate-700'} transition-all duration-500`}>
                <FileImage className={`w-8 h-8 mb-2 ${activeStage === 'parsing' ? 'text-fuchsia-400 animate-pulse' : 'text-slate-500'}`} />
                <span className="text-xs font-mono font-bold text-center text-slate-300">Vision Model<br/>(Extract Line Items)</span>
            </div>
            
            {/* Stage 2: Policy Evaluation */}
            <div className={`flex flex-col items-center justify-center p-4 rounded-xl border ${activeStage === 'policy' ? 'bg-amber-900/40 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-800 border-slate-700'} transition-all duration-500`}>
                <ShieldAlert className={`w-8 h-8 mb-2 ${activeStage === 'policy' ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
                <span className="text-xs font-mono font-bold text-center text-slate-300">Policy Engine<br/>(Deterministic Check)</span>
            </div>
            
            {/* Stage 3: Approval */}
            <div className={`flex flex-col items-center justify-center p-4 rounded-xl border ${activeStage === 'complete' ? 'bg-emerald-900/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800 border-slate-700'} transition-all duration-500`}>
                <CheckCircle className={`w-8 h-8 mb-2 ${activeStage === 'complete' ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-xs font-mono font-bold text-center text-slate-300">Approval Workflow<br/>(Partial/Full Sync)</span>
            </div>
        </div>

        <div className="bg-black/50 p-4 rounded-xl font-mono text-xs text-amber-400 h-48 overflow-y-auto">
          {processLogs.length === 0 ? (
             <div className="text-slate-500 italic">Waiting to start expense agent pipeline...</div>
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

  const theoryContent = question.theory ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={question.theory} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'accounting-agents', exerciseTitle: question.title, theory: question.theory }} />
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

export default ExpenseReconciliationActivity;
