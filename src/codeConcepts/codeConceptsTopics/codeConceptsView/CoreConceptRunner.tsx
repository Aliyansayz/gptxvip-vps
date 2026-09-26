import React, { useState, useEffect } from 'react';
import { InteractiveQuestion, DragAndDropQuestion, MCQQuestion, CodeCompletionQuestion, MCQOption, ScrollCodeWalkthroughQuestion, WalkthroughStepMCQ, SimulationRunnerQuestion, CodeExplainerPlusVisualizerQuestion, HFTJourneyExplainerQuestion, CodeExplainerDragDropQuestion, CodeExplainerProductionAnalogyQuestion } from '../../../types';
import { ArrowLeft, HelpCircle, ActivitySquare, GripVertical, Layers, CheckCircle2, CheckCircle, XCircle, Code2, Terminal, Wand2, RotateCcw, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { componentRegistry } from '../../codeConceptsTopicsRegistry/componentRegistry';
import { HighlightedText } from './TermHighlighter';
import { CppCodeSnippet } from './CppCodeSnippet';

// Helper to render inline snippets from text containing $snippet ... snippet$
export const renderTextWithSnippets = (text: string, isDarkMode: boolean = true) => {
  if (!text || (!text.includes('$snippet') && !text.includes('snippet$'))) return <>{text}</>;
  
  const parts = text.split(/(\$snippet.*?snippet\$)/gs); // using /s to match across newlines if any
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$snippet') && part.endsWith('snippet$')) {
          const code = part.replace(/^\$snippet/g, '').replace(/snippet\$$/g, '').trim();
          return (
            <span 
              key={index} 
              className={`inline-block max-w-full overflow-x-auto align-middle whitespace-pre rounded-md px-1.5 py-0.5 font-mono text-[0.85em] ${
                isDarkMode ? 'bg-[#0f172a] text-indigo-300 border border-indigo-500/20 shadow-inner' : 'bg-zinc-100 text-indigo-700 border border-zinc-200 shadow-sm'
              } mx-1`}
              style={{ lineHeight: '1.2' }}
            >
              {code}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};
import { TheoryPane } from './TheoryPane';
import { SimulationRunner } from './SimulationRunner';
import { CircuitBoardExercise } from './CircuitBoardExercise';
import { CodeExplainerPlusVisualizer } from './CodeExplainerPlusVisualizer';
import CodeExplainerDragDrop from './CodeExplainerDragDrop';
import CodeRewriterByTyping from './CodeRewriterByTyping';
import { HFTJourneyExplainer } from '../HFTJourneyExplainer';
import CodeExplainerProductionAnalogy from './CodeExplainerProductionAnalogy';

import { InteractiveQuestionVisual } from '../cpp_hello_world/visual/InteractiveQuestionVisuals';
import { EngineInteractiveVisual } from '../cpp_engine_design/visual/EngineInteractiveVisuals';

// === HELPER: FISHER YATES SHUFFLE ===
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// === COMPONENT: DRAG N DROP EXERCISE ===
interface DragNDropExerciseProps {
  question: DragAndDropQuestion;
  themeColor?: string;
  categoryId?: string;
}

const DragNDropExercise: React.FC<DragNDropExerciseProps> = ({ question, themeColor = 'indigo', categoryId }) => {
  const isSequence = !!question.draggable_items && !!question.correct_order;
  const isMatching = !!question.pairs;

  const [sequence, setSequence] = useState<string[]>([]);
  const [keys, setKeys] = useState<string[]>([]);
  const [bank, setBank] = useState<string[]>([]);
  const [slots, setSlots] = useState<Record<string, string | null>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  useEffect(() => {
    if (isSequence && question.draggable_items) {
      setSequence(shuffleArray([...question.draggable_items]));
    } else if (isMatching && question.pairs) {
      const k = question.pairs.map(p => p.type || p.operator || 'Unknown');
      const v = question.pairs.map(p => p.example || p.meaning || 'Unknown');
      
      setKeys(k);
      setBank(shuffleArray([...v]));
      
      const initialSlots: Record<string, string | null> = {};
      k.forEach(keyStr => { initialSlots[keyStr] = null; });
      setSlots(initialSlots);
    }
  }, [question, isSequence, isMatching]);

  const handleDragStart = (e: React.DragEvent, value: string) => {
    e.dataTransfer.setData("text/plain", value);
  };

  const handleDropOnSlot = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    const value = e.dataTransfer.getData("text/plain");
    if (!value) return;

    setSlots(prev => {
      const newSlots = { ...prev };
      for (const k in newSlots) {
        if (newSlots[k] === value) newSlots[k] = null;
      }
      const existingValue = newSlots[slotKey];
      if (existingValue && existingValue !== value) {
        setBank(b => [...b, existingValue]);
      }
      newSlots[slotKey] = value;
      return newSlots;
    });

    setBank(prev => prev.filter(v => v !== value));
  };

  const handleDropOnBank = (e: React.DragEvent) => {
    e.preventDefault();
    const value = e.dataTransfer.getData("text/plain");
    if (!value) return;

    setBank(prev => {
      if (prev.includes(value)) return prev;
      return [...prev, value];
    });

    setSlots(prev => {
      const newSlots = { ...prev };
      for (const k in newSlots) {
        if (newSlots[k] === value) newSlots[k] = null;
      }
      return newSlots;
    });
  };

  const handleCheck = () => {
    setIsSubmitted(true);
  };

  const isCorrectMatch = (slotKey: string) => {
    if (!question.pairs) return false;
    const pair = question.pairs.find(p => (p.type || p.operator) === slotKey);
    if (!pair) return false;
    return slots[slotKey] === (pair.example || pair.meaning);
  };

  const isSequenceCorrect = () => {
    if (!question.correct_order) return false;
    return JSON.stringify(sequence) === JSON.stringify(question.correct_order);
  };

  const feedbackVariants = {
    initial: { scale: 1 },
    correct: { 
      scale: [1, 1.05, 1],
      transition: { duration: 0.3 }
    },
    wrong: { 
      x: [0, -8, 8, -8, 8, 0],
      transition: { duration: 0.4 }
    }
  };

  const getColorClasses = (type: string) => {
    if (themeColor === 'emerald') {
      if (type === 'text') return 'text-emerald-500';
      if (type === 'text-strong') return 'text-emerald-700 dark:text-emerald-300';
      if (type === 'border') return 'border-emerald-500';
      if (type === 'border-hover') return 'hover:border-emerald-500';
      if (type === 'bg-soft') return 'bg-emerald-50 dark:bg-emerald-900/10';
      if (type === 'bg') return 'bg-emerald-500';
    }
    if (themeColor === 'blue') {
      if (type === 'text') return 'text-blue-500';
      if (type === 'text-strong') return 'text-blue-700 dark:text-blue-300';
      if (type === 'border') return 'border-blue-500';
      if (type === 'border-hover') return 'hover:border-blue-500';
      if (type === 'bg-soft') return 'bg-blue-50 dark:bg-blue-900/10';
      if (type === 'bg') return 'bg-blue-500';
    }
    // Default indigo
    if (type === 'text') return 'text-indigo-500';
    if (type === 'text-strong') return 'text-indigo-700 dark:text-indigo-300';
    if (type === 'border') return 'border-indigo-500';
    if (type === 'border-hover') return 'hover:border-indigo-500';
    if (type === 'bg-soft') return 'bg-indigo-50 dark:bg-indigo-900/10';
    if (type === 'bg') return 'bg-indigo-500';
    return '';
  };

  if (isSequence) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full">
        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Layers className={`w-4 h-4 ${getColorClasses('text')}`} />
          Sequence Arrangement
        </h4>

        {/* Visual Component Integration */}
        {(question.visual_prompt || question.visual_interactive_prompt) && (
          <div className="mb-6 overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow-inner border border-zinc-200 dark:border-zinc-800">
            {(() => {
              const VisualComp = componentRegistry[question.componentId];
              return VisualComp ? <VisualComp componentId={question.componentId} /> : null;
            })()}
          </div>
        )}

        <Reorder.Group axis="y" values={sequence} onReorder={(newOrder) => {
          setSequence(newOrder);
          if (isSubmitted) setIsSubmitted(false);
        }} className="space-y-2.5">
          {sequence.map((item) => (
            <Reorder.Item 
              key={item} 
              value={item} 
              className={`p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl cursor-grab active:cursor-grabbing flex items-center gap-4 transition-colors relative group overflow-hidden ${
                 themeColor === 'emerald' ? 'hover:border-emerald-500/50' : 
                 themeColor === 'blue' ? 'hover:border-blue-500/50' : 
                 'hover:border-indigo-500/50'
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-zinc-200 dark:bg-zinc-800 transition-colors group-hover:${getColorClasses('bg')}`} />
              <GripVertical className="text-zinc-300 dark:text-zinc-600 w-5 h-5 shrink-0" />
              <span className="font-mono text-sm text-zinc-800 dark:text-zinc-200 font-medium select-none">{item}</span>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {!isSubmitted ? (
          <button
            onClick={handleCheck}
            className="mt-6 w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl transition-colors"
          >
            Check Answer
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${isSequenceCorrect() ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'}`}
          >
             {isSequenceCorrect() ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
             <div>
               <p className="font-bold">{isSequenceCorrect() ? 'Perfect Match!' : 'Incorrect Order'}</p>
               <p className="text-sm mt-1">{isSequenceCorrect() ? 'The logic is sound and executable.' : 'High-frequency systems require exact ordering. Adjust and try again.'}</p>
             </div>
          </motion.div>
        )}
      </div>
    );
  }

  if (isMatching) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
             <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className={`w-4 h-4 ${getColorClasses('text')}`} /> Categories
             </h4>
             {keys.map((k, i) => (
                <div key={`${k}-${i}`} className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl flex items-center justify-center min-h-[60px] font-bold text-zinc-700 dark:text-zinc-300 text-center select-none text-sm leading-tight">{k}</div>
             ))}
          </div>
          <div className="space-y-3">
             <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 text-center">Drop Targets</h4>
             {keys.map((k, i) => {
               const slotFilled = !!slots[k];
               const isCorrect = isSubmitted && slotFilled && isCorrectMatch(k);
               const isWrong = isSubmitted && slotFilled && !isCorrectMatch(k);
               const isOver = dragOverSlot === k;

               return (
                <div 
                  key={`slot-${k}-${i}`} 
                  onDragOver={e => e.preventDefault()}
                  onDragEnter={() => setDragOverSlot(k)}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={e => {
                    handleDropOnSlot(e, k);
                    setDragOverSlot(null);
                  }}
                  className={`p-1.5 border-2 border-dashed rounded-xl min-h-[60px] flex items-center justify-center transition-all duration-200 ${
                    isOver ? `border-indigo-500 bg-indigo-500/10 scale-[1.02] ring-4 ring-indigo-500/10` :
                    isCorrect ? '!border-emerald-500 !bg-emerald-500/5' :
                    isWrong ? '!border-red-500 !bg-red-500/5' :
                    slots[k] ? `${getColorClasses('border').replace('border-', 'border-opacity-50 border-')} ${getColorClasses('bg-soft')}` : 
                    `border-zinc-300 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-900/50 ${getColorClasses('border-hover')}`
                  }`}
                >
                   {slots[k] ? (
                      <motion.div 
                        draggable 
                        onDragStart={(e: any) => handleDragStart(e, slots[k]!)}
                        variants={feedbackVariants}
                        animate={isSubmitted ? (isCorrect ? 'correct' : 'wrong') : 'initial'}
                        className={`bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 w-full h-full p-3 rounded-lg cursor-grab active:cursor-grabbing text-center font-mono text-sm select-none flex items-center justify-center break-words relative transition-colors ${
                          isCorrect ? '!text-emerald-600 dark:!text-emerald-400' :
                          isWrong ? '!text-red-600 dark:!text-red-400' :
                          getColorClasses('text-strong')
                        }`}
                      >
                        {slots[k]}
                        {isCorrect && <CheckCircle className="w-3 h-3 absolute top-1 right-1 text-emerald-500" />}
                        {isWrong && <XCircle className="w-3 h-3 absolute top-1 right-1 text-red-500" />}
                      </motion.div>
                   ) : (
                      <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isOver ? 'text-indigo-500' : 'text-zinc-400 dark:text-zinc-600'}`}>
                        {isOver ? 'Release Here' : 'Empty_Slot'}
                      </span>
                   )}
                </div>
               );
             })}
          </div>
        </div>
        <div className="p-6 bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-2xl min-h-[140px] flex flex-col items-center justify-center" onDragOver={e => e.preventDefault()} onDrop={handleDropOnBank}>
          <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 text-center">Available Concepts Bank</h4>
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
             {bank.map((item, i) => (
                 <motion.div 
                   key={`bank-${i}`} 
                   draggable 
                   onDragStart={(e: any) => handleDragStart(e, item)}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className={`bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-xl cursor-grab active:cursor-grabbing font-mono text-sm text-zinc-700 dark:text-zinc-200 transition-all select-none ${getColorClasses('border-hover')} hover:${getColorClasses('text')}`}
                 >
                   {item}
                 </motion.div>
             ))}
             {bank.length === 0 && (
               <div className="flex flex-col items-center justify-center opacity-50 py-4"><CheckCircle2 className="w-8 h-8 text-zinc-400 mb-2" /><span className="text-zinc-500 text-sm italic font-medium">All components placed!</span></div>
             )}
          </div>
        </div>

        {!isSubmitted ? (
          <button
            onClick={handleCheck}
            disabled={Object.values(slots).some(s => s === null)}
            className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black uppercase tracking-widest rounded-2xl disabled:opacity-30 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            Check Answer
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <button
               onClick={() => setIsSubmitted(false)}
               className="text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              ← Edit Placements
            </button>
            <div className={`p-5 rounded-2xl flex items-start gap-4 ${Object.values(slots).every((_, i) => isCorrectMatch(keys[i])) ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800'}`}>
               <HelpCircle className="w-6 h-6 shrink-0 text-indigo-500" />
               <div>
                  <p className="font-bold uppercase tracking-tight">System Analysis</p>
                  <p className="text-sm mt-1 opacity-80 italic">Review the highlighted status nodes above. Green indicates valid logic paths, Red indicates potential bottlenecks or errors.</p>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};


// === COMPONENT: CODE COMPLETION EXERCISE ===
interface CodeCompletionExerciseProps {
  question: CodeCompletionQuestion;
  themeColor?: string;
  categoryId?: string;
}

const CodeCompletionExercise: React.FC<CodeCompletionExerciseProps> = ({ question, themeColor = 'indigo', categoryId }) => {
  const [slots, setSlots] = useState<Record<string, string | null>>({});
  const [bank, setBank] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const slotOrder = React.useMemo(() => {
    return question.code_template.match(/{{([^}]+)}}/g)?.map(m => m.replace(/{{|}}/g, '')) || [];
  }, [question.code_template]);

  useEffect(() => {
    const initialSlots: Record<string, string | null> = {};
    Object.keys(question.correct_mappings).forEach(key => {
      initialSlots[key] = null;
    });
    setSlots(initialSlots);
    setBank(shuffleArray([...question.draggable_items]));
    setHistory([]);
    setIsSubmitted(false);
  }, [question]);

  const handleItemClick = (item: string) => {
    if (isSubmitted) return;
    
    // Find first empty slot in order
    const nextSlotKey = slotOrder.find(key => slots[key] === null);
    if (!nextSlotKey) return;

    setSlots(prev => ({ ...prev, [nextSlotKey]: item }));
    setBank(prev => prev.filter(v => v !== item));
    setHistory(prev => [...prev, nextSlotKey]);
  };

  const handleUndo = () => {
    if (isSubmitted || history.length === 0) return;

    const lastKey = history[history.length - 1];
    const itemToReturn = slots[lastKey];
    
    if (!itemToReturn) return;

    setSlots(prev => ({ ...prev, [lastKey]: null }));
    setBank(prev => {
      if (prev.includes(itemToReturn)) return prev;
      return [...prev, itemToReturn];
    });
    setHistory(prev => prev.slice(0, -1));
  };

  const handleAutoSolve = () => {
    if (isSubmitted) return;
    setSlots({ ...question.correct_mappings });
    setBank([]);
    setHistory([...slotOrder]);
  };

  const isAllCorrect = () => {
    return Object.entries(question.correct_mappings).every(([key, value]) => slots[key] === value);
  };

  const renderCorrectSolution = () => {
    let resolvedCode = question.code_template;
    Object.entries(question.correct_mappings).forEach(([key, value]) => {
      resolvedCode = resolvedCode.replace(`{{${key}}}`, value);
    });
    return (
      <div className="mt-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
         <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Compiled Logic:</h5>
         <pre className="font-mono text-xs text-emerald-400 whitespace-pre"><code>{resolvedCode}</code></pre>
      </div>
    );
  };

  const colorizePart = (text: string) => {
    const keywords = ['std::', 'void', 'int', 'return', 'string', 'mutex', 'lock_guard', 'unordered_map'];
    const parts = text.split(new RegExp(`(${keywords.join('|')})`, 'g'));
    return parts.map((part, i) => {
      if (keywords.includes(part)) {
        return <span key={i} className="text-indigo-400 font-bold">{part}</span>;
      }
      if (part.includes('"')) {
        return <span key={i} className="text-amber-400">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const templateParts = question.code_template.split(/({{[^}]+}})/g);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-500" />
          <h4 className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 shadow-sm shadow-indigo-500/10 uppercase tracking-[0.15em]">Code Completion Lab</h4>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && !isSubmitted && (
            <button 
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
            >
              <RotateCcw className="w-3 h-3" /> Undo
            </button>
          )}
          {!isSubmitted && (
            <button 
              onClick={handleAutoSolve}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
            >
              <Wand2 className="w-3 h-3" /> Auto Solve
            </button>
          )}
        </div>
      </div>

      {/* Visual Component Integration */}
      {(question.visual_prompt || question.visual_interactive_prompt) && (
        <div className="mb-4 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 shadow-inner border border-zinc-200 dark:border-zinc-800">
          {(() => {
            const VisualComp = componentRegistry[question.componentId];
            return VisualComp ? <VisualComp componentId={question.componentId} /> : null;
          })()}
        </div>
      )}

      <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 font-mono text-sm leading-relaxed relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-2 opacity-10"><Terminal className="w-12 h-12" /></div>
         <div className="flex flex-wrap items-center gap-y-3 gap-x-1 text-zinc-400 relative z-10 w-full">
            {templateParts.map((part, i) => {
              const match = part.match(/{{([^}]+)}}/);
              if (match) {
                const slotKey = match[1];
                const filledValue = slots[slotKey];
                const isSubmittedAndWrong = isSubmitted && filledValue && filledValue !== question.correct_mappings[slotKey];
                const isSubmittedAndCorrect = isSubmitted && filledValue && filledValue === question.correct_mappings[slotKey];

                return (
                  <div
                    key={i}
                    className={`inline-flex items-center justify-center min-w-[80px] h-8 px-2 border-b-2 transition-all duration-200 ${
                      isSubmittedAndCorrect ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" :
                      isSubmittedAndWrong ? "border-red-500 bg-red-500/10 text-red-400" :
                      filledValue ? "border-zinc-500 bg-zinc-800/80 text-white font-bold" : "border-zinc-700 bg-zinc-900/50"
                    }`}
                  >
                    {filledValue ? (
                      <motion.span 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-emerald-400"
                      >
                        {filledValue}
                      </motion.span>
                    ) : (
                      <span className="text-[10px] opacity-20 font-bold uppercase tracking-tighter">_{slotKey}_</span>
                    )}
                  </div>
                );
              }
              return <span key={i} className="whitespace-pre">{colorizePart(part)}</span>;
            })}
         </div>
      </div>

      <div 
        className="p-6 bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-2xl min-h-[100px] flex flex-col items-center justify-center transition-all"
      >
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">DEPLOYABLE SNIPPETS</span>
        <div className="flex flex-wrap gap-2 justify-center">
          {bank.map((item, i) => (
            <motion.button
              key={i}
              onClick={() => handleItemClick(item)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono text-xs font-bold text-zinc-700 dark:text-emerald-400 shadow-sm hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all"
            >
              {item}
            </motion.button>
          ))}
          {bank.length === 0 && (
            <div className="text-zinc-500 text-xs italic flex items-center gap-2">
               <CheckCircle className="w-4 h-4 text-emerald-500" /> Pipeline construction complete.
            </div>
          )}
        </div>
      </div>

      {!isSubmitted ? (
        <button
          onClick={() => setIsSubmitted(true)}
          disabled={Object.values(slots).some(v => v === null)}
          className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black uppercase tracking-widest rounded-2xl disabled:opacity-30 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg"
        >
          Verify Execution Pipeline
        </button>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            ← Modify Snippets
          </button>
          <div className={`p-5 rounded-2xl flex items-start gap-4 ${isAllCorrect() ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'}`}>
             {isAllCorrect() ? <CheckCircle className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
             <div>
                <p className="font-bold uppercase tracking-tight">{isAllCorrect() ? 'Deployment Successful' : 'Compile Error'}</p>
                <p className="text-sm mt-1 opacity-80">{isAllCorrect() ? 'The code structure is correct and follows C++ high-performance patterns.' : 'Syntax or logic mismatch detected. Review the slot placements.'}</p>
             </div>
          </div>
          {isAllCorrect() && renderCorrectSolution()}
        </div>
      )}
    </div>
  );
};


// === COMPONENT: MCQ EXERCISE ===
interface MCQExerciseProps {
  question: MCQQuestion;
  themeColor?: string;
  isDarkMode?: boolean;
  categoryId?: string;
}

const MCQExercise: React.FC<MCQExerciseProps> = ({ question, themeColor = 'indigo', isDarkMode = true, categoryId }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCorrect = selectedOption === question.answer;

  const handleSubmit = () => {
    if (selectedOption) setIsSubmitted(true);
  };

  const themeClasses: any = {
    emerald: {
      text: 'text-emerald-500',
      textStrong: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500',
      borderLight: 'border-emerald-300 dark:border-emerald-700',
      bgSoft: 'bg-emerald-50 dark:bg-emerald-900/30'
    },
    blue: {
      text: 'text-blue-500',
      textStrong: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-500',
      borderLight: 'border-blue-300 dark:border-blue-700',
      bgSoft: 'bg-blue-50 dark:bg-blue-900/30'
    },
    indigo: {
      text: 'text-indigo-500',
      textStrong: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-500',
      borderLight: 'border-indigo-300 dark:border-indigo-700',
      bgSoft: 'bg-indigo-50 dark:bg-indigo-900/30'
    }
  }[themeColor] || {
    text: 'text-indigo-500',
    textStrong: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-500',
    borderLight: 'border-indigo-300 dark:border-indigo-700',
    bgSoft: 'bg-indigo-50 dark:bg-indigo-900/30'
  };

  return (
    <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full shadow-sm">
      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Layers className={`w-4 h-4 ${themeClasses.text}`} />
        Knowledge Check
      </h4>

      {/* Visual Component Integration */}
      {(question.visual_prompt || question.visual_interactive_prompt) && (
        <div className="mb-6 overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-900 shadow-inner border border-zinc-200 dark:border-zinc-800">
           {(() => {
             const VisualComp = componentRegistry[question.componentId];
             if (VisualComp) {
               return <VisualComp componentId={question.componentId} />;
             }
             return (
              <div className="p-10 text-center text-zinc-500 text-xs italic">
                [Visual Prompt] {question.visual_prompt || question.visual_interactive_prompt}
              </div>
             );
           })()}
        </div>
      )}

      <div className="space-y-3">
        {question.options?.map((rawOption, idx) => {
          const isObj = typeof rawOption !== 'string';
          const optionText = isObj ? (rawOption as MCQOption).text : (rawOption as string);
          const isSnippet = isObj ? (rawOption as MCQOption).isSnippet : false;
          const hasReasoning = isObj && (rawOption as MCQOption).reasoning !== undefined;
          const optReasoning = isObj ? (rawOption as MCQOption).reasoning : null;
          const optIsCorrectLocal = isObj ? (rawOption as MCQOption).isCorrect : optionText === question.answer;

          const isSelected = selectedOption === optionText;
          const showResult = isSubmitted;

          let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 block ";
          
          if (showResult) {
            if (isSelected) {
              btnClass += optIsCorrectLocal 
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]" 
                : "bg-red-500/10 border-red-500 text-red-900 dark:text-red-100 ring-2 ring-red-500/20 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]";
            } else if (optIsCorrectLocal) {
              btnClass += "bg-emerald-500/5 border-emerald-500/50 text-emerald-800 dark:text-emerald-200 opacity-90"; // Highlight correct if they missed it
            } else {
              btnClass += "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 opacity-50";
            }
          } else {
            // Gradient highlight for selected option
            btnClass += isSelected 
              ? `bg-gradient-to-r ${themeColor === 'emerald' ? 'from-emerald-50 to-white dark:from-emerald-900/40 dark:to-zinc-900 border-emerald-500 text-emerald-900 dark:text-emerald-100' : themeColor === 'blue' ? 'from-blue-50 to-white dark:from-blue-900/40 dark:to-zinc-900 border-blue-500 text-blue-900 dark:text-blue-100' : 'from-indigo-50 to-white dark:from-indigo-900/40 dark:to-zinc-900 border-indigo-500 text-indigo-900 dark:text-indigo-100'} shadow-md scale-[1.01]` 
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800";
          }

          return (
            <div key={`${optionText}-${idx}`} className="flex flex-col gap-2">
              <button
                onClick={() => {
                  if (!isSubmitted) setSelectedOption(optionText);
                }}
                disabled={isSubmitted}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                  {isSnippet ? (
                    <div className="font-mono text-xs bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-zinc-300 overflow-x-auto w-full">
                        <code className="whitespace-pre">{optionText}</code>
                    </div>
                  ) : (
                    <span className="font-medium whitespace-pre-wrap leading-relaxed">{renderTextWithSnippets(optionText, isDarkMode)}</span>
                  )}
                  {showResult && isSelected && (
                     optIsCorrectLocal ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 ml-3" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 ml-3" />
                  )}
                  {showResult && !isSelected && optIsCorrectLocal && (
                     <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-3 opacity-70" />
                  )}
                </div>
              </button>
              
              {/* Show per-option reasoning if submitted and it was selected (or is correct) */}
              {isSubmitted && (isSelected || optIsCorrectLocal) && hasReasoning && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`px-4 py-3 rounded-lg text-sm border ml-4 ${
                    optIsCorrectLocal 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1.5 mb-1">
                    {optIsCorrectLocal ? "Why this is correct:" : "Why this is incorrect:"}
                  </span>
                  {optReasoning}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className={`mt-6 w-full py-3.5 text-white font-bold rounded-xl transition-all ${
             !selectedOption ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed' :
             themeColor === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-md hover:shadow-lg' :
             themeColor === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 shadow-md hover:shadow-lg' :
             'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-md hover:shadow-lg'
          }`}
        >
          Check Answer
        </button>
      ) : (
        <button
          onClick={() => {
            setIsSubmitted(false);
            setSelectedOption(null);
          }}
          className={`mt-6 w-full py-3.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
             themeColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm' :
             themeColor === 'blue' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shadow-sm' :
             'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-sm'
          }`}
        >
           <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
};

// === COMPONENT: SCROLL CODE WALKTHROUGH ===
interface ScrollCodeWalkthroughProps {
  question: ScrollCodeWalkthroughQuestion;
  themeColor?: string;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isCodeVisible: boolean;
  setIsCodeVisible: (val: boolean) => void;
  language?: string;
}

const ScrollCodeWalkthrough: React.FC<ScrollCodeWalkthroughProps> = ({ 
  question, 
  themeColor = 'indigo',
  isDarkMode,
  setIsDarkMode,
  isCodeVisible,
  setIsCodeVisible,
  language = "cpp"
}) => {
  const [activeStep, setActiveStep] = useState(0);
  
  const filmRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const stepRefs = React.useRef<(HTMLElement | null)[]>([]);

  // Split lines and prepare them for rendering
  const codeLines = question.codeSnippet.split('\n');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-step-index') || '0');
          setActiveStep(index);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!filmRef.current || !viewportRef.current || !isCodeVisible) return;

    const currentStepData = question.steps[activeStep];
    if (!currentStepData) return;

    const [startLine, endLine] = currentStepData.range;
    
    // Calculate position
    const film = filmRef.current;
    const viewport = viewportRef.current;
    
    const applyScroll = () => {
      const allLines = film.querySelectorAll('.line-wrapper');
      const focusedLines = Array.from(allLines).filter((_, i) => (i + 1) >= startLine && (i + 1) <= endLine) as HTMLElement[];

      if (focusedLines.length > 0) {
        const firstLine = focusedLines[0];
        const lastLine = focusedLines[focusedLines.length - 1];
        
        const blockTop = firstLine.offsetTop;
        const blockBottom = lastLine.offsetTop + lastLine.offsetHeight;
        const blockCenter = (blockTop + blockBottom) / 2;

        let vh = viewport.offsetHeight;
        if (vh === 0) vh = window.innerHeight * 0.45; // roughly 45vh fallback during initial animation

        const blockSize = blockBottom - blockTop;
        let targetTranslateY;

        if (blockSize > vh * 0.8) {
          // If focus area is large, align closer to top so the beginning of the snippet is clearly visible
          targetTranslateY = (vh * 0.2) - blockTop;
        } else {
          targetTranslateY = (vh / 2) - blockCenter;
        }

        film.style.transform = `translateY(${targetTranslateY}px)`;
      }
    };

    // Need slight delay to ensure fonts/offsets are fully calculated on first render
    const timeoutId = setTimeout(() => requestAnimationFrame(applyScroll), 50);
    
    // Re-apply if container resizes (e.g. initial animation to 45vh)
    const resizeObserver = new ResizeObserver(() => applyScroll());
    resizeObserver.observe(viewport);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [activeStep, question.steps, isCodeVisible]);

  const getColorHex = () => {
    if (themeColor === 'emerald') return '#10b981';
    if (themeColor === 'blue') return '#3b82f6';
    return '#6366f1';
  };

  const getHighlightBgColor = () => {
    if (isDarkMode) {
      if (themeColor === 'emerald') return 'rgba(16, 185, 129, 0.15)';
      if (themeColor === 'blue') return 'rgba(59, 130, 246, 0.15)';
      return 'rgba(99, 102, 241, 0.15)'; // indigo
    } else {
      if (themeColor === 'emerald') return 'rgba(16, 185, 129, 0.1)';
      if (themeColor === 'blue') return 'rgba(59, 130, 246, 0.1)';
      return 'rgba(99, 102, 241, 0.1)'; // indigo
    }
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden transition-colors duration-500 ${isDarkMode ? 'walkthrough-dark bg-zinc-950' : 'walkthrough-light bg-zinc-50'}`}>
      
      {/* Upper top : "code snippet" */}
      <AnimatePresence>
        {isCodeVisible && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '45vh', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`relative shrink-0 border-b overflow-hidden group code-snippet-container ${isDarkMode ? 'border-zinc-800 bg-[#020617]' : 'border-zinc-200 bg-white'}`} 
            ref={viewportRef}
          >
            {/* Code Header */}
            <div className={`absolute top-0 left-0 right-0 h-10 border-b z-20 flex items-center justify-between px-4 backdrop-blur-md ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-100/80 border-zinc-200'}`}>
               <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
               </div>
               <span className={`text-[9px] font-mono uppercase tracking-[0.2em] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{question.title || 'Source Code'}</span>
               <div className="w-10" />
            </div>

            {/* The "Film" */}
            <div 
              ref={filmRef}
              className="camera-film-container transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center py-[30vh]"
              style={{ transform: 'translateY(0px)' }}
            >
              <pre className={`font-mono text-[1.05rem] leading-[1.8] w-full whitespace-pre-wrap break-words ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                <code>
                  {codeLines.map((line, idx) => {
                    const lineNum = idx + 1;
                    const activeRange = question.steps[activeStep]?.range || [0, 0];
                    const isFocused = lineNum >= activeRange[0] && lineNum <= activeRange[1];

                    return (
                      <div 
                        key={idx} 
                        className={`line-wrapper relative px-8 flex items-start transition-colors duration-300 w-full`}
                        style={{ backgroundColor: isFocused ? getHighlightBgColor() : 'transparent' }}
                      >
                        {isFocused && (
                           <div 
                             className="absolute left-0 top-0 bottom-0 w-1"
                             style={{ backgroundColor: getColorHex() }}
                           />
                        )}
                        <span className={`w-8 text-right mr-6 font-mono text-xs select-none relative z-10 transition-colors duration-300 shrink-0 ${isFocused ? (isDarkMode ? 'text-indigo-400 font-bold' : 'text-indigo-600 font-bold') : (isDarkMode ? 'text-zinc-500' : 'text-zinc-400')}`}>
                          {lineNum}
                        </span>
                        <span className={`relative z-10 w-full transition-colors duration-300 ${isFocused ? 'drop-shadow-sm' : ''}`}>
                          <CppCodeSnippet code={line || '\u00A0'} isDarkMode={isDarkMode} inline language={language} />
                        </span>
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3- Lower bottom : "code concept scroll view" */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar-hide relative z-10 ${isDarkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
        <div className="max-w-4xl mx-auto px-6">
          {question.steps.map((step, idx) => (
            <section 
              key={idx}
              data-step-index={idx}
              ref={el => { stepRefs.current[idx] = el; }}
              className={`min-h-[70vh] flex flex-col justify-center py-20 transition-opacity duration-700 ${activeStep === idx ? 'opacity-100' : 'opacity-20'}`}
            >
              <div className="relative pl-8">
                 <div 
                   className="absolute left-0 top-0 bottom-0 w-1 rounded-full opacity-50"
                   style={{ backgroundColor: getColorHex() }}
                 />
                 <h3 className={`text-sm font-bold uppercase tracking-[0.3em] mb-4 ${isDarkMode ? 'text-white/40' : 'text-zinc-400'}`}>{step.title}</h3>
                 <h2 className={`text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight ${
                   isDarkMode 
                     ? (themeColor === 'emerald' ? 'text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : themeColor === 'blue' ? 'text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]') 
                     : (themeColor === 'emerald' ? 'text-emerald-600' : themeColor === 'blue' ? 'text-blue-600' : 'text-indigo-600')
                 }`}>
                    <HighlightedText text={step.title} themeColor={themeColor as any} />
                 </h2>
                 <p className={`text-xl md:text-2xl leading-relaxed max-w-2xl mb-12 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    <HighlightedText text={step.description} themeColor={themeColor as any} />
                 </p>

                 {/* MCQ at the end of each concept */}
                 {step.mcq && (
                    <div className="mt-12 scale-[0.95] origin-left">
                       <WalkthroughMCQ 
                         mcq={step.mcq} 
                         themeColor={themeColor} 
                         stepActive={activeStep === idx}
                         isDarkMode={isDarkMode}
                       />
                    </div>
                 )}
              </div>
            </section>
          ))}

          {/* End Spacing */}
          <div className="h-[20vh]" />
        </div>
      </div>

      {/* Control Panel (Top Right) */}
      <div className="fixed top-4 right-4 z-[110] flex items-center gap-2">
         <div className={`flex items-center gap-0.5 p-1 rounded-full border shadow-2xl backdrop-blur-xl transition-colors duration-300 ${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10'}`}>
            <button
               onClick={() => setIsCodeVisible(!isCodeVisible)}
               title={isCodeVisible ? "Collapse Code" : "Show Code"}
               className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'hover:bg-white text-white hover:text-zinc-950' : 'hover:bg-black text-zinc-900 hover:text-white'} ${!isCodeVisible ? 'ring-2 ring-indigo-500' : ''}`}
            >
               {isCodeVisible ? <Code2 className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
            </button>
            <div className={`w-px h-4 mx-1 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
            <button
               onClick={() => setIsDarkMode(!isDarkMode)}
               title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
               className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'hover:bg-white text-white hover:text-zinc-950' : 'hover:bg-black text-zinc-900 hover:text-white'}`}
            >
               {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
         </div>
      </div>

      {/* Nav Dots */}
      <div className="fixed right-6 top-[72vh] -translate-y-1/2 flex flex-col gap-4 z-50">
         {question.steps.map((_, i) => (
           <button
             key={i}
             onClick={() => {
                stepRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
             }}
             className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStep === i ? 'scale-[2] ring-4' : 'bg-zinc-700 hover:bg-zinc-500'}`}
             style={{ 
               backgroundColor: activeStep === i ? getColorHex() : undefined,
               boxShadow: activeStep === i ? `0 0 10px ${getColorHex()}40` : undefined,
               borderColor: activeStep === i ? (isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)') : 'transparent'
             }}
           />
         ))}
      </div>
    </div>
  );
};

interface WalkthroughMCQProps {
  mcq: WalkthroughStepMCQ;
  themeColor: string;
  stepActive: boolean;
}

const WalkthroughMCQ: React.FC<WalkthroughMCQProps & { isDarkMode?: boolean }> = ({ mcq, themeColor, stepActive, isDarkMode = true }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const colors = {
    emerald: 'emerald',
    blue: 'blue',
    indigo: 'indigo'
  }[themeColor] || 'indigo';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={stepActive ? { opacity: 1, y: 0 } : {}}
      style={{ transform: 'skewY(-2deg)' }}
      className={`p-8 rounded-none backdrop-blur-sm max-w-2xl shadow-2xl border transition-colors duration-500 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200'}`}
    >
      <div style={{ transform: 'skewY(2deg)' }}>
        <div className="flex items-center gap-3 mb-6">
           <div className={`p-2 rounded-none bg-${colors}-500/10 border border-${colors}-500/20`}>
              <HelpCircle className={`w-5 h-5 text-${colors}-500`} />
           </div>
           <h4 className={`text-xs font-bold uppercase tracking-[0.2em] text-${colors}-400`}>Concept Check</h4>
        </div>

        <p className={`text-lg font-bold mb-8 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{renderTextWithSnippets(mcq.question, isDarkMode)}</p>

        <div className="space-y-3">
          {mcq.options.map((option, idx) => {
            const isSelected = selectedIdx === idx;
            const showResult = isSubmitted;
            const isCorrect = option.isCorrect;

            let btnClass = "w-full text-left p-5 rounded-none border transition-all duration-300 flex items-center justify-between group ";
            
            if (showResult) {
              if (isSelected) {
                btnClass += isCorrect ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-red-500/10 border-red-500/50 text-red-400";
              } else if (isCorrect) {
                btnClass += "bg-emerald-500/5 border-emerald-500/20 text-emerald-500/70";
              } else {
                btnClass += isDarkMode ? "border-zinc-800 text-zinc-600 opacity-40" : "border-zinc-200 text-zinc-400 opacity-40";
              }
            } else {
              btnClass += isSelected 
                ? `bg-${colors}-500/10 border-${colors}-500 ${isDarkMode ? 'text-white' : 'text-zinc-900'} shadow-[0_0_20px_rgba(99,102,241,0.1)]` 
                : `${isDarkMode ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50' : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100'}`;
            }

            return (
              <div key={idx}>
                <button
                  disabled={isSubmitted}
                  onClick={() => setSelectedIdx(idx)}
                  className={btnClass}
                >
                  <span className="font-medium whitespace-pre-wrap leading-relaxed">{renderTextWithSnippets(option.text, isDarkMode)}</span>
                  {isSelected && !isSubmitted && <div className={`w-2 h-2 rounded-full bg-${colors}-500`} />}
                  {showResult && isSelected && (
                    isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </button>
                
                <AnimatePresence>
                  {showResult && (isSelected || isCorrect) && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className={`mt-2 ml-4 p-4 rounded-none text-sm border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500/80' : 'bg-red-500/5 border-red-500/10 text-red-500/80'}`}
                    >
                      <span className="font-bold block mb-1">{isCorrect ? 'Correct:' : 'Incorrect:'}</span>
                      {option.reasoning}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {!isSubmitted ? (
          <button
            disabled={selectedIdx === null}
            onClick={() => setIsSubmitted(true)}
            className={`mt-10 w-full py-4 rounded-none font-black uppercase tracking-widest transition-all shadow-xl shadow-black disabled:opacity-30 ${
              selectedIdx === null 
                ? (isDarkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-400')
                : `bg-${colors}-500 hover:bg-${colors}-400 text-white`
            }`}
          >
            Check Logic
          </button>
        ) : (
          <button
            onClick={() => {
              setIsSubmitted(false);
              setSelectedIdx(null);
            }}
            className={`mt-6 w-full py-4 rounded-none font-bold flex items-center justify-center gap-2 transition-all ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'}`}
          >
            <RotateCcw className="w-4 h-4" /> Reset Choice
          </button>
        )}
      </div>
    </motion.div>
  );
};


// === COMPONENT: CORE CONCEPT RUNNER ===
interface CoreConceptRunnerProps {
    concept: InteractiveQuestion;
    onBack: () => void;
    onComplete?: () => void;
    courseId?: string;
    categoryId?: string;
    themeColor?: 'emerald' | 'blue' | 'indigo';
}

export const CoreConceptRunner: React.FC<CoreConceptRunnerProps> = ({ 
    concept, 
    onBack, 
    onComplete,
    courseId,
    categoryId,
    themeColor = 'indigo'
}) => {
    const [isTheoryOpen, setIsTheoryOpen] = useState(true);
    const isCodeVisibleValue = concept.type === 'circuit_board' ? false : true;
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isCodeVisible, setIsCodeVisible] = useState(isCodeVisibleValue);
    const VisualComponent = componentRegistry[concept.componentId];
    const isWalkthrough = concept.type === 'scroll_code_walkthrough';
    const isSimulation = concept.type === 'simulation_runner';
    const isCircuitBoard = concept.type === 'circuit_board';
    const isCodeExplainerPlusVisualizer = concept.type === 'code_explainer_plus_visualizer';
    const isCodeExplainerDragDrop = concept.type === 'code_explainer_drag_drop';
    const isCodeRewriterByTyping = concept.type === 'code_rewriter_by_typing';
    const isHFTJourneyExplainer = concept.type === 'hft_journey_explainer';
    const isCodeExplainerProductionAnalogy = concept.type === 'code_explainer_production_analogy';

    // Abstract the reasoning block 
    const renderReasoning = () => {
        const visualPrompt = concept.visual_prompt || concept.visual_interactive_prompt;
        
        const renderVisuals = () => {
            const VisualComp = componentRegistry[concept.componentId];
            if (VisualComp) {
                return (
                    <div className="mt-4 overflow-hidden rounded-xl shadow-inner">
                        <VisualComp componentId={concept.componentId} />
                    </div>
                );
            }
            return null;
        };

        if (concept.type === 'mcq') {
            return (
            <div className="space-y-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-lg text-emerald-800 dark:text-emerald-300">
                <strong>Correct Answer:</strong> {concept.answer}
                </div>
                <div className="text-zinc-700 dark:text-zinc-300 border-l-2 border-indigo-500 pl-3"><HighlightedText text={concept.explanation} themeColor={themeColor} /></div>
                {renderVisuals()}
            </div>
            );
        } else if (concept.type === 'drag_and_drop') {
            const q = concept as DragAndDropQuestion;
            return (
            <div className="space-y-4">
                <div className="text-zinc-700 dark:text-zinc-300 border-l-2 border-indigo-500 pl-3"><HighlightedText text={concept.explanation} themeColor={themeColor} /></div>
                {renderVisuals()}
                {q.correct_order ? (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <h6 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Correct Structure:</h6>
                    <div className="flex flex-col gap-2">
                        {q.correct_order.map((item: string, i: number) => (
                        <div key={i} className="text-sm font-mono bg-white dark:bg-zinc-900 px-3 py-2 rounded border border-zinc-100 dark:border-zinc-800">{item}</div>
                        ))}
                    </div>
                </div>
                ) : q.pairs ? (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <h6 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Correct Pairings:</h6>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.pairs.map((pair: any, i: number) => (
                        <div key={i} className="flex flex-col p-3 bg-white dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800">
                            <span className="text-xs font-bold text-indigo-500 mb-1">{pair.type || pair.operator}</span>
                            <span className="text-sm">{pair.example || pair.meaning}</span>
                        </div>
                        ))}
                    </div>
                </div>
                ) : null}
            </div>
            );
        }
        return (
            <div className="space-y-4">
                <div className="text-zinc-700 dark:text-zinc-300 border-l-2 border-indigo-500 pl-3"><HighlightedText text={(concept as InteractiveQuestion).explanation} themeColor={themeColor} /></div>
                {renderVisuals()}
            </div>
        );
    };

    if (isWalkthrough) {
        return (
            <div className={`w-full h-full relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
               <div className="absolute top-4 left-4 z-[100] flex items-center gap-4">
                  <button
                      onClick={onBack}
                      className={`group flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest border rounded-full transition-all duration-500 shadow-2xl backdrop-blur-xl ${
                          isDarkMode 
                            ? 'bg-white/10 hover:bg-white text-white hover:text-zinc-950 border-white/20' 
                            : 'bg-black/5 hover:bg-black text-black hover:text-white border-black/20'
                      }`}
                  >
                      <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                      Exit Walkthrough
                  </button>
                  <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
                  <p className={`text-[10px] font-bold uppercase tracking-[0.3em] font-mono ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
                     {courseId || ''} // {concept.concept_tested}
                  </p>
               </div>
               <ScrollCodeWalkthrough 
                 question={concept as ScrollCodeWalkthroughQuestion} 
                 themeColor={themeColor} 
                 isDarkMode={isDarkMode}
                 setIsDarkMode={setIsDarkMode}
                 isCodeVisible={isCodeVisible}
                 setIsCodeVisible={setIsCodeVisible}
                 language={categoryId?.toLowerCase() === 'python' ? 'python' : 'cpp'}
               />
            </div>
        );
    }

    if (isSimulation) {
        return (
            <SimulationRunner 
                question={concept as SimulationRunnerQuestion}
                VisualComponent={VisualComponent || (() => <div className="p-20 text-center text-zinc-500 font-mono text-xs">ERR: Simulation_Module_Not_Found</div>)}
                themeColor={themeColor}
                onBack={onBack}
                courseId={courseId}
            />
        );
    }

    if (isCircuitBoard) {
        return (
            <CircuitBoardExercise
                question={concept as any}
                themeColor={themeColor}
                onBack={onBack}
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />
        );
    }

    if (isCodeExplainerPlusVisualizer) {
        return (
            <CodeExplainerPlusVisualizer
                question={concept as CodeExplainerPlusVisualizerQuestion}
                themeColor={themeColor}
                onBack={onBack}
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />
        );
    }

    if (isCodeExplainerDragDrop) {
        return (
            <div className={`w-full h-[100dvh] relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#020617]' : 'bg-zinc-50'}`}>
               <div className="absolute top-4 left-4 z-[100] flex items-center gap-4">
                  <button
                      onClick={onBack}
                      className={`group flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest border rounded-full transition-all duration-500 shadow-2xl backdrop-blur-xl ${
                          isDarkMode 
                            ? 'bg-white/10 hover:bg-white text-white hover:text-zinc-950 border-white/20' 
                            : 'bg-black/5 hover:bg-black text-black hover:text-white border-black/20'
                      }`}
                  >
                      <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                      Exit Walkthrough
                  </button>
                  <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
                  <p className={`text-[10px] font-bold uppercase tracking-[0.3em] font-mono ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
                     {courseId || ''} // {concept.concept_tested} // ACTIVITY TYPE: CODE EXPLAINER AND DRAG N DROP
                  </p>
               </div>
               <CodeExplainerDragDrop
                   question={concept as CodeExplainerDragDropQuestion}
                   onBack={onBack}
                   isDarkMode={isDarkMode}
                   language={categoryId?.toLowerCase() === 'python' ? 'python' : 'cpp'}
               />
            </div>
        );
    }

    if (isCodeExplainerProductionAnalogy) {
        return (
            <div className={`w-full h-[100dvh] relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#020617]' : 'bg-zinc-50'}`}>
               <div className="absolute top-4 left-4 z-[100] flex items-center gap-4">
                  <button
                      onClick={onBack}
                      className={`group flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest border rounded-full transition-all duration-500 shadow-2xl backdrop-blur-xl ${
                          isDarkMode 
                            ? 'bg-white/10 hover:bg-white text-white hover:text-zinc-950 border-white/20' 
                            : 'bg-black/5 hover:bg-black text-black hover:text-white border-black/20'
                      }`}
                  >
                      <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                      Exit Walkthrough
                  </button>
                  <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
                  <p className={`text-[10px] font-bold uppercase tracking-[0.3em] font-mono ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
                     {courseId || ''} // {concept.concept_tested} // ACTIVITY TYPE: CODE EXPLAINER, PRODUCTION USECASE & ANALOGY
                  </p>
               </div>
               <CodeExplainerProductionAnalogy
                   question={concept as CodeExplainerProductionAnalogyQuestion}
                   onBack={onBack}
                   isDarkMode={isDarkMode}
                   language={categoryId?.toLowerCase() === 'python' ? 'python' : 'cpp'}
               />
            </div>
        );
    }

    if (isHFTJourneyExplainer) {
        return (
            <HFTJourneyExplainer
                question={concept as HFTJourneyExplainerQuestion}
                themeColor={themeColor}
                onBack={onBack}
                isDarkMode={isDarkMode}
            />
        );
    }

    if (isCodeRewriterByTyping) {
        return (
            <div className="w-full h-full flex flex-col bg-[#0b0c10] animate-in fade-in duration-500">
               <CodeRewriterByTyping
                   question={concept as any}
                   onBack={onBack}
                   isDarkMode={isDarkMode}
               />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pl-2 pr-4 pt-2 shrink-0">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Concept Hub
                </button>
                <div className="flex items-center gap-4">
                   <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest hidden sm:block">
                        {courseId ? `${courseId} - ` : ''} {concept.concept_tested}
                   </p>
                </div>
            </div>

            <div className="flex-1 w-full mx-auto min-h-0 max-w-7xl overflow-y-auto custom-scrollbar pb-16 px-2">
                <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
                    
                    {/* Left Column: Description & Interactive Activity */}
                    <div className="flex-1 w-full space-y-6">
                        
                        {/* Top Left: Question Statement */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${
                                themeColor === 'emerald' ? 'bg-emerald-500' :
                                themeColor === 'blue' ? 'bg-blue-500' :
                                'bg-indigo-500'
                            }`} />
                            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-2 pl-2">
                                {concept.title}
                            </h2>
                                <p className="break-words whitespace-pre-wrap pl-2 text-lg leading-relaxed [overflow-wrap:anywhere] text-zinc-700 dark:text-zinc-300">
                                {renderTextWithSnippets(concept.question || (concept as any).prompt || '', isDarkMode)}
                            </p>
                        </div>

                        {/* Bottom Left: Interactive Activity */}
                        <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm ${concept.type === 'overview' ? 'p-0 bg-transparent border-none shadow-none' : 'p-6 overflow-x-auto'}`}>
                            {concept.type === "overview" && concept.theory ? (
                                <TheoryPane concepts={concept.theory} categoryId={categoryId} themeColor={themeColor} />
                            ) : VisualComponent ? (
                                <VisualComponent exercise={concept} onComplete={onComplete || onBack} themeColor={themeColor} />
                            ) : concept.type === "mcq" ? (
                                <MCQExercise question={concept as MCQQuestion} themeColor={themeColor} isDarkMode={isDarkMode} categoryId={categoryId} />
                            ) : concept.type === "drag_and_drop" ? (
                                <DragNDropExercise question={concept as DragAndDropQuestion} themeColor={themeColor} categoryId={categoryId} />
                            ) : concept.type === "code_completion" ? (
                                <CodeCompletionExercise question={concept as CodeCompletionQuestion} themeColor={themeColor} categoryId={categoryId} />
                            ) : (
                                <div className="p-8 text-center text-zinc-500">
                                    Activity not found for this concept.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Right: Expandable Theory Pane */}
                    {(concept.type !== 'overview' && !isWalkthrough && concept.theory && concept.theory.length > 0) && (
                        <div className={`transition-all duration-300 ease-in-out shrink-0 w-full lg:w-[350px] relative`}>
                            <button
                                type="button"
                                aria-expanded={isTheoryOpen}
                                aria-controls="concept-theory-panel"
                                onClick={() => setIsTheoryOpen(!isTheoryOpen)} 
                                className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors mb-2"
                            >
                            <span className="font-bold flex items-center gap-2">
                                <ActivitySquare className={`w-5 h-5 ${
                                    themeColor === 'emerald' ? 'text-emerald-500' :
                                    themeColor === 'blue' ? 'text-blue-500' :
                                    'text-indigo-500'
                                }`} />
                                Theory & Concepts
                            </span>
                            <span className="text-xs bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded font-mono uppercase tracking-widest">{isTheoryOpen ? 'Hide' : 'Show'}</span>
                        </button>
                        
                        <AnimatePresence initial={false}>
                            {isTheoryOpen && (
                                <motion.div
                                    id="concept-theory-panel"
                                    role="region"
                                    aria-label="Theory and concept details"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`overflow-hidden rounded-2xl border shadow-sm ${
                                        themeColor === 'emerald' ? 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10' :
                                        themeColor === 'blue' ? 'border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10' :
                                        'border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/10'
                                    }`}
                                >
                                    <div className="p-6 relative">
                                        <div className={`absolute top-0 left-0 w-1.5 h-full ${
                                            themeColor === 'emerald' ? 'bg-emerald-500' :
                                            themeColor === 'blue' ? 'bg-blue-500' :
                                            'bg-indigo-500'
                                        }`} />
                                        
                                        {concept.theory ? (
                                            <>
                                                <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-3">{concept.theory.title || "Concept Theory"}</h4>
                                                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                                                    {concept.theory.summary}
                                                </p>
                                                {concept.theory.bullets && concept.theory.bullets.length > 0 && (
                                                    <ul className="space-y-2 mb-4">
                                                        {concept.theory.bullets.map((b: string, i: number) => (
                                                            <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                                                                <span className={`shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${
                                                                    themeColor === 'emerald' ? 'bg-emerald-400' :
                                                                    themeColor === 'blue' ? 'bg-blue-400' :
                                                                    'bg-indigo-400'
                                                                }`} />
                                                                <span>{b}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                {concept.theory.glossary && concept.theory.glossary.length > 0 && (
                                                    <div className={`mt-4 pt-4 border-t ${
                                                        themeColor === 'emerald' ? 'border-emerald-200/50 dark:border-emerald-800/50' :
                                                        themeColor === 'blue' ? 'border-blue-200/50 dark:border-blue-800/50' :
                                                        'border-indigo-200/50 dark:border-indigo-800/50'
                                                    }`}>
                                                        <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Glossary</h5>
                                                        <dl className="space-y-2">
                                                            {concept.theory.glossary.map((g: any, i: number) => (
                                                                <div key={i} className="text-sm">
                                                                    <dt className="font-bold text-zinc-800 dark:text-zinc-200 italic mr-1">{g.term}:</dt>
                                                                    <dd className="text-zinc-600 dark:text-zinc-400 inline">{g.definition}</dd>
                                                                </div>
                                                            ))}
                                                        </dl>
                                                    </div>
                                                )}
                                                {concept.theory.physics_link && (
                                                    <div className={`mt-4 pt-4 border-t ${
                                                        themeColor === 'emerald' ? 'border-emerald-200/50 dark:border-emerald-800/50' :
                                                        themeColor === 'blue' ? 'border-blue-200/50 dark:border-blue-800/50' :
                                                        'border-indigo-200/50 dark:border-indigo-800/50'
                                                    }`}>
                                                        <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Technical / Physics Link</h5>
                                                        <p className="text-sm italic text-zinc-600 dark:text-zinc-400">{concept.theory.physics_link}</p>
                                                    </div>
                                                )}
                                                {concept.theory.analogy && (
                                                    <div className={`mt-4 pt-4 border-t ${
                                                        themeColor === 'emerald' ? 'border-emerald-200/50 dark:border-emerald-800/50' :
                                                        themeColor === 'blue' ? 'border-blue-200/50 dark:border-blue-800/50' :
                                                        'border-indigo-200/50 dark:border-indigo-800/50'
                                                    }`}>
                                                        <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Analogy</h5>
                                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{concept.theory.analogy}</p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-3">Key Info</h4>
                                                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                                    {concept.explanation || "In this exercise, apply your knowledge to solve the challenge presented."}
                                                </p>
                                            </>
                                        )}
                                        
                                        <div className={`mt-6 pt-4 border-t ${
                                            themeColor === 'emerald' ? 'border-emerald-200/50 dark:border-emerald-800/50' :
                                            themeColor === 'blue' ? 'border-blue-200/50 dark:border-blue-800/50' :
                                            'border-indigo-200/50 dark:border-indigo-800/50'
                                        }`}>
                                            <details className="group cursor-pointer">
                                                <summary className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors select-none outline-none border ${
                                                    themeColor === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40' :
                                                    themeColor === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40' :
                                                    'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
                                                }`}>
                                                    <HelpCircle className="w-4 h-4" /> Show Explanation
                                                </summary>
                                                <div className="mt-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                                    {renderReasoning()}
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    )}

                </div>
            </div>
        </div>
    );
};
