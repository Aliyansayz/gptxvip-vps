import React, { useState, useEffect } from 'react';
import { Exercise } from '../../devLushTypes';

import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertTriangle, Terminal, Activity, ChevronRight } from 'lucide-react';
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

export const BenfordsLawAudit: React.FC<ChapterProps> = ({
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
  const [ledgerLogs, setLedgerLogs] = useState<string[]>([]);

  const question = exercises[step];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    resetSimulator();
  }, [step]);

  const resetSimulator = () => {
    setIsRunning(false);
    setLedgerLogs([
      "AUDITOR: Loading quarterly balance receipts...",
      "DATASET: 4,120 journal entry transactions ingested.",
      "Ready to run leading digit Benford distribution mapping."
    ]);
  };

  const runAccountingAudit = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLedgerLogs([]);

    const logChain = [
      { text: "BENFORD_AGENT: Computing logarithmic frequency distributions...", delay: 0 },
      { text: "BENFORD_AGENT: Analyzing first significant digit patterns across all entries...", delay: 600 },
      { text: "BENFORD_AGENT: Digit '1' frequency: 29.8% (Expected: 30.1%)", delay: 1200 },
      { text: "BENFORD_AGENT: Digit '2' frequency: 18.2% (Expected: 17.6%)", delay: 1800 },
      { text: "BENFORD_AGENT: ALERT: Digit '4' frequency shows abnormal surge: 28.5% (Expected: 9.7%)", delay: 2400 },
      { text: "SEMANTIC_AUDIT: Scanning invoices starting with '4'. Flagging 14 duplicated receipts from vendor 'Global Logistics'.", delay: 3000 },
      { text: "CRITICAL COMPLIANCE ALERT: Fabricated expenses identified! Anomaly isolated successfully.", delay: 3600, error: true }
    ];

    logChain.forEach((item) => {
      setTimeout(() => {
        setLedgerLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${item.text}`]);
        if (item.error) {
          toast.warning("Mathematical compliance anomaly detected under Benford's Law!");
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

  const benfordValues = [30.1, 17.6, 12.5, 9.7, 7.9, 6.7, 5.8, 5.1, 4.6];
  const actualValues = [29.8, 18.2, 11.1, 28.5, 4.2, 3.8, 2.1, 1.3, 1.0];

  const visualContent = (
    <div className="w-full flex flex-col gap-4">
      <div className="bg-gray-950 p-6 rounded-lg border border-gray-800 text-gray-300 shadow-sm relative overflow-hidden font-mono">
        <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <Terminal className="w-5 h-5" />
            <span className="text-xs font-bold tracking-widest uppercase">Benford_Audit_Subroutine</span>
          </div>
          <button
            onClick={runAccountingAudit}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/50 rounded transition-all"
          >
            {isRunning ? (
              <Activity className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            {isRunning ? 'EXECUTING...' : 'RUN AUDIT'}
          </button>
        </div>

        <div className="gap-4 py-2">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
            <span>DISTRIBUTION_MAP [1-9]</span>
            <AnimatePresence>
              {ledgerLogs.length > 4 && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-amber-500 flex items-center gap-1 bg-amber-950/30 px-2 py-1 border border-amber-900/50 rounded"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> ANOMALY DETECTED
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="h-32 flex items-end gap-3 border-b border-gray-800 pb-2 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full border-t border-gray-700"></div>
              ))}
            </div>

            {benfordValues.map((val, idx) => {
              const actual = actualValues[idx];
              const isAnomaly = idx === 3 && ledgerLogs.length > 3; // Highlight '4' after it's logged

              return (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full relative z-10">
                  <div className="flex gap-1 justify-center items-end h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: isRunning || ledgerLogs.length > 0 ? `${val * 2.5}%` : 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="w-3 bg-gray-700/50 border-t border-gray-500"
                      title={`Expected: ${val}%`}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: isRunning || ledgerLogs.length > 0 ? `${actual * 2.5}%` : 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + idx * 0.05 }}
                      className={`w-3 border-t ${isAnomaly ? 'bg-amber-500/80 border-amber-400 shadow-[0_0_10px_#f59e0b]' : 'bg-emerald-600/60 border-emerald-400'}`}
                      title={`Actual: ${actual}%`}
                    />
                  </div>
                  <span className={`text-[10px] text-center mt-2 ${isAnomaly ? 'text-amber-400 font-bold' : 'text-gray-500'}`}>{idx + 1}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-6 mt-3 text-[10px] text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-700 border border-gray-500" /> Expected (Benford's Law)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-600/60 border border-emerald-400" /> Actual Ledger Frequency
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black p-4 rounded-lg border border-gray-800 flex-1 min-h-[180px] max-h-[200px] overflow-y-auto font-mono text-xs text-emerald-500 space-y-2 custom-scrollbar">
        <div className="opacity-50 mb-2">root@auditor-vm:~# tail -f /var/log/ledger_audit.log</div>
        <AnimatePresence>
          {ledgerLogs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`leading-relaxed flex gap-2 ${log.includes("CRITICAL") || log.includes("ALERT") ? "text-amber-400 font-bold bg-amber-950/20 p-1 border-l-2 border-amber-500" : log.includes("ERROR") ? "text-rose-400 font-bold" : ""}`}
            >
              <span className="text-gray-600 shrink-0">&gt;</span>
              <span>{log}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {isRunning && (
          <div className="flex items-center gap-2 text-emerald-400/50 text-[11px] mt-2">
            <span className="w-1.5 h-3 bg-emerald-500 animate-pulse"></span>
            <span>Processing statistical models...</span>
          </div>
        )}
      </div>
    </div>
  );

  const interactionContent = (
    <div className="gap-4">
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

export default BenfordsLawAudit;
