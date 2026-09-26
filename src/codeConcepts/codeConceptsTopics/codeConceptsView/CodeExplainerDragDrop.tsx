import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CodeExplainerDragDropQuestion 
} from '../../../types/codeConcepts';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Code2, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  Terminal,
  MousePointer2,
  Check,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface CodeExplainerDragDropProps {
  question: CodeExplainerDragDropQuestion;
  onBack?: () => void;
  isDarkMode?: boolean;
  language?: string;
}

export const CodeExplainerDragDrop: React.FC<CodeExplainerDragDropProps> = ({
  question,
  onBack,
  isDarkMode = true,
  language = 'cpp'
}) => {
  const [phase, setPhase] = useState<'explanation' | 'interaction'>('explanation');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const topCodePanelRef = useRef<HTMLDivElement>(null);

  const currentSnippet = question.snippets[currentSnippetIndex];
  const bgClass = isDarkMode ? "bg-[#0b0c10]" : "bg-zinc-50";
  const textColorClass = isDarkMode ? "text-slate-200" : "text-zinc-900";
  const headerBgClass = isDarkMode ? "bg-[#0f111a] border-white/10" : "bg-white border-zinc-200";

  // Sequence of slots for order-based filling
  const getSlotIds = (template: string) => {
    const matches = template.match(/\[\[(SLOT\d+)\]\]/g) || [];
    return matches.map(m => m.replace(/[\[\]]/g, ''));
  };

  const slotIds = currentSnippet ? getSlotIds(currentSnippet.template) : [];

  const { lines: explanationLines, ranges: explanationRanges, headerLineCount } = React.useMemo(() => {
    let lines: string[] = [];
    let ranges: [number, number][] = [];
    
    const headerLines = [
       "/*",
       `${question.title}`,
       `• ${question.difficulty || 'intermediate'}`,
       "",
       `${question.prompt || 'See how Templates allow you to write logic that works with any data type.'}`,
       "",
       "Concept Tested:",
       `${question.concept_tested || 'Templates and Generic Programming'}`,
       "",
       "Activity Type:",
       "Code Explainer And Drag n Drop",
       "*/",
       ""
    ];
    lines.push(...headerLines);

    let currentLine = headerLines.length + 1;
    
    question.explanation_steps.forEach(step => {
       const stepLines = step.code.split('\n');
       lines.push(...stepLines);
       ranges.push([currentLine, currentLine + stepLines.length - 1]);
       currentLine += stepLines.length;
    });
    
    return { lines, ranges, headerLineCount: headerLines.length };
  }, [question]);

  useEffect(() => {
    if (bottomPanelRef.current) {
        bottomPanelRef.current.scrollTo({
            top: bottomPanelRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    if (topCodePanelRef.current && phase === 'explanation') {
      // Find the first focused element
      const focusedElements = topCodePanelRef.current.querySelectorAll('.is-focused');
      if (focusedElements.length > 0) {
         // calculate center
         const firstEl = focusedElements[0] as HTMLElement;
         const lastEl = focusedElements[focusedElements.length - 1] as HTMLElement;
         const container = topCodePanelRef.current;
         const targetScrollTop = firstEl.offsetTop - container.offsetHeight / 2 + (lastEl.offsetTop - firstEl.offsetTop + lastEl.offsetHeight) / 2;
         
         container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
         });
      }
    }
  }, [currentStep, phase]);

  const handleNextStep = () => {
    if (currentStep < question.explanation_steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startChallenge = () => {
    setPhase('interaction');
  };

  const handleItemClick = (item: string) => {
    const firstEmptySlot = slotIds.find(id => !userAnswers[id]);
    if (firstEmptySlot) {
      setUserAnswers(prev => ({ ...prev, [firstEmptySlot]: item }));
      setIsCorrect(null);
    } else {
      toast.info("All slots are filled. Click a slot to remove its item first.");
    }
  };

  const validateSnippet = () => {
    const mappings = currentSnippet?.correct_mappings || {};
    let allCorrect = true;
    
    Object.keys(mappings).forEach(slotId => {
      if (userAnswers[slotId] !== mappings[slotId]) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      setIsCorrect(true);
      toast.success('Snippet completed correctly!');
    } else {
      setIsCorrect(false);
      toast.error('Some parts are incorrect. Try again!');
    }
  };

  const nextSnippet = () => {
    if (currentSnippetIndex < question.snippets.length - 1) {
      setCurrentSnippetIndex(currentSnippetIndex + 1);
      setUserAnswers({});
      setIsCorrect(null);
    }
  };

  const resetSnippet = () => {
    setUserAnswers({});
    setIsCorrect(null);
  };  const colorizeText = (text: string) => {
    const isPython = language === 'python';
    const regex = isPython
      ? /(\b(?:def|class|import|from|as|in|for|while|if|elif|else|try|except|finally|with|lambda|pass|return|None|True|False|self)\b|[:]|[{}()\[\]'"])/g
      : /(\b(?:template|typename|class|public|private|int|return|void|float|double|bool|char)\b|<<|>>|[{}();]|<T>|T\b)/g;

    const subParts = text.split(regex);
    return (
      <span>
        {subParts.map((sub, j) => {
          if (isPython) {
            if (/\b(?:def|class|import|from|lambda|pass|return)\b/.test(sub)) {
              return <span key={j} className="text-violet-400 font-bold">{sub}</span>;
            }
            if (/\b(?:if|elif|else|for|while|in|with|try|except|finally|as)\b/.test(sub)) {
              return <span key={j} className="text-indigo-400 font-bold">{sub}</span>;
            }
            if (/\b(?:True|False|None|self)\b/.test(sub)) {
              return <span key={j} className="text-emerald-405 font-semibold text-emerald-400">{sub}</span>;
            }
            if (/[:{}()\[\]'"]/.test(sub)) {
              return <span key={j} className="text-amber-400 font-semibold">{sub}</span>;
            }
          } else {
            if (/\b(?:template|typename|class|public|private|int|return|void|float|double|bool|char)\b/.test(sub)) {
              return <span key={j} className="text-violet-400 font-bold">{sub}</span>;
            }
            if (/[{}();]|<<|>>/.test(sub)) {
              return <span key={j} className="text-amber-400 font-medium">{sub}</span>;
            }
            if (/<T>|T\b/.test(sub)) {
              return <span key={j} className="text-emerald-400">{sub}</span>;
            }
          }
          return <span key={j} className={`transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-zinc-650 dark:text-zinc-300'}`}>{sub}</span>;
        })}
      </span>
    );
  };

  const colorizeCode = (code: string) => {
    const lines = code.split('\n');
    return lines.map((line, i) => {
      return (
        <div key={i} className="px-3 py-1.5 rounded-md transition-all duration-200 whitespace-pre flex items-center text-slate-400/70 border border-transparent hover:bg-white/5 hover:text-slate-300">
          <span className="inline-block w-8 text-slate-600 select-none text-right pr-3 border-r border-white/5 mr-3 shrink-0">{i + 1}</span>
          <span>
            {colorizeText(line)}
          </span>
        </div>
      );
    });
  };

  const renderTemplate = (template: string) => {
    const lines = template.split('\n');
    return lines.map((line, lineIndex) => {
      const parts = line.split(/(\[\[SLOT\d+\]\])/g);
      return (
        <div key={lineIndex} className="line-wrapper relative px-8 flex items-start transition-colors duration-300 w-full hover:bg-white/5">
          <span className={`w-8 text-right mr-6 font-mono text-xs select-none relative z-10 pt-1 transition-colors duration-300 shrink-0 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {lineIndex + 1}
          </span>
          <span className="flex items-center flex-wrap relative z-10 w-full min-h-[32px]">
            {parts.map((part, index) => {
              const match = part.match(/\[\[(SLOT\d+)\]\]/);
              if (match) {
                const slotId = match[1];
                const value = userAnswers[slotId];
                return (
                  <motion.span
                    key={`${lineIndex}-${index}`}
                    layoutId={slotId}
                    className={`inline-flex items-center justify-center min-w-[125px] h-8 mx-1 px-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${
                      value 
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 select-none' 
                        : 'bg-zinc-800/50 border-zinc-700/50 text-transparent border-dashed'
                    } ${isCorrect === false && value ? 'border-red-500/50 bg-red-500/10 text-red-400' : ''} ${isCorrect === true && value ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : ''}`}
                    onClick={() => {
                        if (value) {
                            const newAnswers = {...userAnswers};
                            delete newAnswers[slotId];
                            setUserAnswers(newAnswers);
                            setIsCorrect(null);
                        }
                    }}
                  >
                    {value ? colorizeText(value) : '...'}
                  </motion.span>
                );
              }
              
              return (
                <span key={`${lineIndex}-${index}`}>
                  {colorizeText(part)}
                </span>
              );
            })}
          </span>
        </div>
      );
    });
  };

  return (
    <div className={`flex flex-col w-full h-[100dvh] ${bgClass} ${textColorClass} font-sans overflow-hidden`}>

      {/* Top Area: Code Preview (Locked or Incomplete) */}
      <div className={`shrink-0 h-[45vh] relative overflow-hidden flex flex-col w-full ${isDarkMode ? 'bg-[#020617] border-zinc-800' : 'bg-white border-zinc-200'} border-b`}>
            <div className={`absolute top-0 left-0 right-0 h-10 border-b z-20 flex shrink-0 items-center justify-between px-4 backdrop-blur-md ${isDarkMode ? 'bg-[#0a0c10]/80 border-zinc-800' : 'bg-zinc-100/80 border-zinc-200'}`}>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <span className={`text-[9px] font-mono uppercase tracking-[0.2em] flex items-center gap-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  <Code2 className="w-3 h-3 text-emerald-400" /> {phase === 'explanation' ? (language === 'python' ? 'walkthrough.py' : 'walkthrough.cpp') : (language === 'python' ? 'challenge.py' : 'challenge.cpp')}
                </span>
                <div className="w-10" />
            </div>

            <div ref={topCodePanelRef} className={`flex-1 overflow-y-auto w-full pt-16 pb-12 custom-scrollbar scroll-smooth ${isDarkMode ? 'bg-[#020617]' : 'bg-zinc-50'}`}>
              {phase === 'explanation' ? (
                 <pre className={`font-mono text-[1.05rem] leading-[1.8] w-full whitespace-pre-wrap break-words ${isDarkMode ? 'text-slate-300' : 'text-zinc-600'}`}>

                    <code>
                      {explanationLines.map((line, idx) => {
                         const lineNum = idx + 1;
                         const activeRange = explanationRanges[currentStep] || [0,0];
                         const isFocused = lineNum >= activeRange[0] && lineNum <= activeRange[1];
                         
                         const stepIndex = explanationRanges.findIndex(r => lineNum >= r[0] && lineNum <= r[1]);
                         const isHeaderLine = lineNum <= headerLineCount;
                         const isBlur = !isHeaderLine && stepIndex > currentStep;

                         const getHighlightBgColor = () => isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)';
                         const getColorHex = () => '#6366f1';

                         return (
                            <div 
                              key={idx} 
                              className={`line-wrapper relative px-8 flex items-start transition-all duration-300 w-full ${isBlur ? 'opacity-20 blur-[2px] select-none grayscale' : ''} ${isFocused ? 'is-focused' : ''}`}
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
                              <span className={`relative z-10 w-full transition-colors duration-300 ${isFocused ? 'drop-shadow-sm' : ''} ${isHeaderLine ? 'text-slate-500 italic' : ''}`}>
                                {isHeaderLine ? (line || '\u00A0') : colorizeText(line || '\u00A0')}
                              </span>
                            </div>
                         );
                      })}
                    </code>
                 </pre>
              ) : (
                 <motion.div
                    key={currentSnippetIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full font-mono text-[1.05rem] leading-[1.8] whitespace-pre-wrap flex flex-col items-start px-2"
                 >
                    {currentSnippet && renderTemplate(currentSnippet.template)}
                 </motion.div>
              )}
            </div>
      </div>

      {/* Bottom Area: Controls & Step Text */}
      <div className={`flex-1 min-h-0 border-t ${isDarkMode ? 'bg-[#0f111a] border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]' : 'bg-white border-zinc-200 shadow-2xl'} z-20 flex flex-col relative`}>
        {/* Minimal Navigation Buttons in Top Right for Explanation Phase */}
        {phase === 'explanation' && (
            <div className="absolute top-6 right-6 lg:right-10 z-30 flex items-center gap-2 bg-[#0f111a]/80 backdrop-blur pb-2 pl-2 rounded-bl-xl">
                <button
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        currentStep === 0 
                            ? 'opacity-50 cursor-not-allowed text-zinc-500 bg-transparent' 
                            : isDarkMode 
                                ? 'text-slate-300 hover:text-white hover:bg-white/10 bg-white/5 border border-white/10' 
                                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 bg-zinc-50 border border-zinc-200'
                    }`}
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Prev
                </button>
                {currentStep < question.explanation_steps.length - 1 ? (
                    <button
                        onClick={handleNextStep}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            isDarkMode 
                                ? 'text-slate-300 hover:text-white hover:bg-white/10 bg-white/5 border border-white/10' 
                                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 bg-zinc-50 border border-zinc-200'
                        }`}
                    >
                        Next <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                ) : (
                    <button
                        onClick={startChallenge}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            isDarkMode 
                                ? 'text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/20 bg-emerald-500/10 border border-emerald-500/20' 
                                : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 bg-emerald-50 border border-emerald-200'
                        }`}
                    >
                        Challenge <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        )}

        <div ref={bottomPanelRef} className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
            <div className="max-w-5xl mx-auto h-full flex flex-col justify-start">
                {phase === 'explanation' ? (
                    <div className="flex flex-col gap-12 pb-20">
                        {question.explanation_steps.slice(0, currentStep + 1).map((step, idx) => (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className={`flex flex-col max-w-3xl items-start transition-all duration-500 ${idx === currentStep ? 'opacity-100' : 'opacity-40 grayscale-[50%]'}`}
                            >
                                <div className="space-y-4 pt-2">
                                    <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                                        <Sparkles className="w-3 h-3" /> Step {idx + 1}
                                    </div>
                                    <h3 className="text-xl lg:text-2xl font-extrabold text-white leading-tight tracking-tight">
                                        {step.description}
                                    </h3>
                                    {idx === 0 && question.explanation && (
                                        <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-medium italic border-l-2 border-indigo-500/30 pl-4 py-1">
                                            {question.explanation}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col h-full justify-center">
                        <div className="mb-8 flex items-center justify-between">
                             <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                                <MousePointer2 className="w-5 h-5 text-indigo-400" /> 
                                {isDarkMode ? <span className="text-slate-400">Select logic blocks to build the snippet</span> : <span>Select logic blocks to build the snippet</span>}
                            </h4>
                            <div className="flex gap-2">
                                {question.snippets.map((_, i) => (
                                    <div key={i} className={`h-2 rounded-full transition-all duration-700 ${i === currentSnippetIndex ? 'w-16 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : i < currentSnippetIndex ? 'w-4 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'w-4 bg-white/10'}`} />
                                ))}
                            </div>
                        </div>
                        {isCorrect === true && (currentSnippet?.code_reasoning || currentSnippet?.correct_code) ? (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`w-full p-6 rounded-2xl border ${
                                    isDarkMode 
                                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200' 
                                        : 'bg-emerald-50/60 border-emerald-300 text-zinc-900'
                                }`}
                            >
                                <div className="flex items-center gap-2 text-emerald-450 font-extrabold mb-3 text-sm tracking-wider uppercase">
                                    <Sparkles className="w-5 h-5 animate-pulse text-emerald-400" />
                                    <span>Code Explanation & Architectural Reasonings</span>
                                </div>
                                {currentSnippet.code_reasoning && (
                                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300 font-normal' : 'text-zinc-600 font-medium'}`}>
                                        {currentSnippet.code_reasoning}
                                    </p>
                                )}
                                {currentSnippet.correct_code && (
                                    <div className="mt-4 rounded-xl overflow-hidden border border-zinc-805 dark:border-white/5">
                                        <div className={`px-4 py-2 text-[10px] uppercase font-mono font-bold tracking-wider ${isDarkMode ? 'bg-black/40 text-zinc-500' : 'bg-zinc-100 text-zinc-500'}`}>
                                            Assembled Code Snippet
                                        </div>
                                        <pre className={`p-4 font-mono text-sm overflow-x-auto whitespace-pre ${isDarkMode ? 'bg-black/80 text-emerald-300' : 'bg-zinc-900 text-emerald-700'}`}>
                                            <code>{currentSnippet.correct_code}</code>
                                        </pre>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="flex flex-wrap gap-4 items-center">
                                <AnimatePresence mode="popLayout">
                                    {currentSnippet?.draggable_items.map((item, idx) => (
                                        <motion.button
                                            key={`${currentSnippetIndex}-${idx}`}
                                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            whileHover={{ scale: 1.05, y: -4, borderColor: 'rgba(99, 102, 241, 0.5)', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleItemClick(item)}
                                            className={`px-8 py-4 rounded-2xl border-2 font-mono text-lg transition-all font-black shadow-lg ${
                                                isDarkMode 
                                                    ? 'bg-[#151822] border-white/10 text-slate-200' 
                                                    : 'bg-white border-zinc-200 text-zinc-800'
                                            }`}
                                        >
                                            <div className="truncate text-base leading-none">
                                               {colorizeText(item)}
                                            </div>
                                        </motion.button>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Footer Navigation within Bottom Area */}
        {phase === 'interaction' && (
        <div className={`px-6 py-4 lg:px-10 lg:py-6 border-t ${isDarkMode ? 'border-white/5 bg-[#0b0c10]' : 'border-zinc-100 bg-zinc-50'}`}>
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {isCorrect === true ? (
                        <div className="flex items-center gap-3 text-emerald-400 font-bold px-6 py-3 bg-emerald-400/10 rounded-xl border border-emerald-400/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] animate-in fade-in zoom-in-95 duration-500">
                             <CheckCircle2 className="w-5 h-5" /> Solution Verified
                        </div>
                    ) : isCorrect === false ? (
                        <div className="flex items-center gap-3 text-rose-400 font-bold px-6 py-3 bg-rose-400/10 rounded-xl border border-rose-400/20 shadow-md animate-in shake duration-500">
                             <AlertCircle className="w-5 h-5" /> Incorrect Configuration
                        </div>
                    ) : null}
                </div>

                <div className="flex gap-4">
                    <button onClick={resetSnippet} className="p-4 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all group" title="Reset Slots">
                        <RotateCcw className="w-6 h-6 group-hover:-rotate-90 transition-transform duration-300" />
                    </button>
                    {isCorrect === true ? (
                        currentSnippetIndex < question.snippets.length - 1 ? (
                            <button
                                onClick={nextSnippet}
                                className={`px-10 py-4 ${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'} rounded-xl font-bold flex items-center gap-4 transition-all shadow-lg active:scale-95`}
                            >
                                Next Challenge <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={onBack}
                                className={`px-10 py-4 ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} rounded-xl font-bold flex items-center gap-4 transition-all shadow-lg active:scale-95`}
                            >
                                <Check className="w-5 h-5" /> Finish Activity
                            </button>
                        )
                    ) : (
                        <button
                            onClick={validateSnippet}
                            className={`px-10 py-4 ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} rounded-xl font-bold flex items-center gap-4 transition-all shadow-[0_10px_20px_rgba(79,70,229,0.2)] active:scale-[0.98]`}
                        >
                            Check Code
                        </button>
                    )}
                </div>
            </div>
        </div>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-in.shake {
          animation: shake 0.4s ease-in-out;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CodeExplainerDragDrop;
