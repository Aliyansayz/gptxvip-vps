import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircle, XCircle, FileSpreadsheet, RefreshCw, Zap, Terminal, Code, ChevronRight } from 'lucide-react';
import { LabSettings } from '../../../agentDevRootComponents/LabSettingsMenu';
import { DevLushLayout } from '../../devLushTopicsView/DevLushLayout';
import SaveTheoryButton from '../../../agentDevRootComponents/TopicTheoryView/SaveTheoryButton';
import { DevLushTheoryBridge } from '../../devLushTopicsView/DevLushTheoryBridge';
import { motion, AnimatePresence } from 'framer-motion';

interface ChapterProps {
  step: number;
  exercises: Exercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: LabSettings;
}

export const SemanticReconciliation: React.FC<ChapterProps> = ({
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
  const [debit, setDebit] = useState(1432590.85);
  const [credit, setCredit] = useState(1432590.35);
  const [ledgerLogs, setLedgerLogs] = useState<string[]>([]);
  const [solverActive, setSolverActive] = useState(false);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    resetSimulator();
  }, [step]);

  const resetSimulator = () => {
    setIsRunning(false);
    setSolverActive(false);
    setDebit(1432590.85);
    setCredit(1432590.35);
    setLedgerLogs([
      "LEDGER: Core balance spreadsheet loaded.",
      "ANALYSIS: Scanning credit-to-debit ledger sums...",
      "Ready to execute transaction reconciliation sums."
    ]);
  };

  const runAccountingAudit = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLedgerLogs([]);

    const logChain = [
      { text: "RECONCILE_AGENT: Extracting token decimals from bank CSV statements...", delay: 0 },
      { text: "RECONCILE_AGENT: Computing SUM via native LLM text prediction...", delay: 800 },
      { text: `RECONCILE_AGENT: Computed Sum Total: Credit=$1,432,590.85 vs Debit=$1,432,590.85`, delay: 1600 },
      { text: "COMPLIANCE_BOT: ERROR! Actual ledger state database shows Credits=$1,432,590.35 (Discrepancy: $0.50)", delay: 2400 },
      { text: solverActive ? "SOLVER TOOL: Precision Python decimal executor mounted. Summing credits directly as true Decimals..." : "CRITICAL: LLM string prediction rounded floating decimal values! Bookkeeping hallucination present.", delay: 3200, isSolve: solverActive }
    ];

    logChain.forEach((item) => {
      setTimeout(() => {
        setLedgerLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${item.text}`]);
        if (item.isSolve) {
          setCredit(1432590.85);
          toast.success("Python numerical tool resolved floating point mismatch!");
        } else if (item.text.includes("hallucination")) {
          toast.error("Accounting compilation mismatch: Token calculation rounded final balance!");
        }
      }, item.delay);
    });

    setTimeout(() => {
      setIsRunning(false);
    }, 4000);
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
    <div className="w-full flex flex-col gap-4 font-mono">
      <div className="bg-gray-950 p-6 rounded-lg border border-gray-800 text-gray-300 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-blue-500">
            <Terminal className="w-5 h-5" />
            <span className="text-xs font-bold tracking-widest uppercase">Semantic_Reconciliation_Engine</span>
          </div>
          <button
            onClick={runAccountingAudit}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-800/50 rounded transition-all"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            {isRunning ? 'CALCULATING...' : 'EXECUTE RUN'}
          </button>
        </div>

        <div className="gap-4 py-2 text-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-black border border-gray-800 rounded-lg flex flex-col relative overflow-hidden">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-2 text-left border-b border-gray-800 pb-2">Target Sum (Debit)</span>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-sm text-gray-600">$</span>
                <span className="text-2xl font-mono text-gray-300">
                  {debit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className={`p-4 bg-black border rounded-lg flex flex-col relative overflow-hidden transition-colors duration-500 ${debit !== credit && !isRunning ? 'border-rose-900/50' : 'border-gray-800'}`}>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-2 text-left border-b border-gray-800 pb-2 flex justify-between">
                Computed Sum (Credit)
                {debit !== credit && !isRunning && <span className="text-rose-500 animate-pulse">MISMATCH</span>}
              </span>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-sm text-gray-600">$</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={credit}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-2xl font-mono ${debit !== credit && !isRunning ? 'text-rose-500 font-bold' : 'text-emerald-500'}`}
                  >
                    {credit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center bg-black border border-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              <Code className="w-4 h-4" />
              <span>MATH INTEGRITY LAYER</span>
            </div>
            <button
              onClick={() => {
                if (isRunning) return;
                setSolverActive(!solverActive);
              }}
              disabled={isRunning}
              className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all border ${solverActive ? 'bg-indigo-900/40 text-indigo-400 border-indigo-700/50 shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'bg-gray-900 text-gray-500 border-gray-700 hover:bg-gray-800'}`}
            >
              <Zap className={`w-3.5 h-3.5 ${solverActive ? 'text-indigo-400' : 'text-gray-500'}`} />
              {solverActive ? 'SYS: PYTHON_DECIMAL_MODE_ACTIVE' : 'MOUNT PYTHON RESOLVER'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-black p-4 rounded-lg border border-gray-800 flex-1 min-h-[160px] max-h-[180px] overflow-y-auto font-mono text-xs text-blue-500 space-y-2 custom-scrollbar">
        <div className="opacity-50 mb-2">root@reconciler-vm:~# ./run_audit.sh</div>
        <AnimatePresence>
          {ledgerLogs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`leading-relaxed flex gap-2 ${log.includes("CRITICAL") || log.includes("ERROR") ? "text-rose-400 font-bold bg-rose-950/20 p-1 border-l-2 border-rose-500" : log.includes("SOLVER") ? "text-indigo-400 font-bold" : ""}`}
            >
              <span className="text-gray-600 shrink-0">&gt;</span>
              <span>{log}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {isRunning && (
          <div className="flex items-center gap-2 text-blue-400/50 text-[11px] mt-2">
            <span className="w-2 h-3 bg-blue-500 animate-pulse"></span>
            <span>Parsing ledger streams...</span>
          </div>
        )}
      </div>
    </div>
  );

  const interactionContent = (
    <div className="gap-4">
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

  const theoryContent = (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-2">
        <SaveTheoryButton theory={question.theory || question} />
      </div>
      <div className="flex-1">
        <DevLushTheoryBridge item={{ labId: 'accounting', exerciseTitle: question.title, theory: question.theory }} />
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

export default SemanticReconciliation;
