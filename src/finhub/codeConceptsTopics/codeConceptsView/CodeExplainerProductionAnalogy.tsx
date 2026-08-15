import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CodeExplainerProductionAnalogyQuestion 
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
  ArrowLeft,
  Lightbulb,
  Cpu,
  Layers,
  Globe,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  BookOpen,
  Search,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

const fallbackGlossary = [
  { term: 'C++20 Stackless Coroutines', definition: 'Lightweight functions compiled into state machines, storing states on the heap instead of a thread stack.' },
  { term: 'co_await', definition: 'C++20 operator that suspends a coroutine cooperatively to hand execution control back to the event system.' },
  { term: 'Awaiter Pattern', definition: 'The protocol methods (await_ready, await_suspend, await_resume) dictating coroutine suspend and wake rules.' },
  { term: 'await_ready()', definition: 'C++ function determining if an async operation is pre-completed so suspension can be avoided.' },
  { term: 'await_suspend(handle)', definition: 'C++ function registers a suspended coroutine handle with an external event loop.' },
  { term: 'await_resume()', definition: 'C++ function invoked on wakeup to return the final completed async payload data.' },
  { term: 'asyncio', definition: 'Python library for writing single-threaded concurrent applications using async and await.' },
  { term: 'await', definition: 'Python keyword that pauses a coroutine cooperatively, handing control back to the event loop scheduler.' },
  { term: 'Event Loop', definition: 'A single-threaded coordinator that tracks active tasks, timers, and I/O status triggers sequentially.' },
  { term: 'Cooperative Multitasking', definition: 'Execution model where concurrent tasks voluntarily yield control back to a central loop scheduler.' }
];

interface CodeExplainerProductionAnalogyProps {
  question: CodeExplainerProductionAnalogyQuestion;
  onBack?: () => void;
  isDarkMode?: boolean;
  language?: string;
}

export const CodeExplainerProductionAnalogy: React.FC<CodeExplainerProductionAnalogyProps> = ({
  question,
  onBack,
  isDarkMode = true,
  language = 'python'
}) => {
  const [phase, setPhase] = useState<'explanation' | 'interaction'>('explanation');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSplitIndex, setCurrentSplitIndex] = useState(0);
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [mcqResults, setMcqResults] = useState<Record<number, boolean>>({});

  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(true);

  useEffect(() => {
    setCurrentSplitIndex(0);
  }, [currentStep]);

  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const topCodePanelRef = useRef<HTMLDivElement>(null);

  const bgClass = isDarkMode ? "bg-[#0b0c10]" : "bg-zinc-50";
  const textColorClass = isDarkMode ? "text-slate-200" : "text-zinc-900";

  const renderTextWithGlossary = (text: string) => {
    if (!text) return '';
    const activeGlossary = question.glossary || fallbackGlossary;
    
    // Sort descending by term length to ensure longest matching wins
    const sortedTerms = [...activeGlossary].sort((a, b) => b.term.length - a.term.length);
    const escapedTerms = sortedTerms.map(item => item.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    if (escapedTerms.length === 0) return <span>{text}</span>;
    
    // Create word boundary regex matching terms case-insensitively
    const regex = new RegExp(`\\b(${escapedTerms.join('|')})|(\\B\\\\bSocketReadAwaitable\\\\b\\B)\\b`, 'gi');
    const parts = text.split(regex).filter(Boolean);
    
    return (
      <span>
        {parts.map((part, idx) => {
          const match = activeGlossary.find(item => item.term.toLowerCase() === part.toLowerCase());
          if (match) {
            return (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGlossaryTerm(match.term);
                  setIsGlossaryOpen(true);
                }}
                className={`cursor-help border-b-2 border-dotted group relative inline-block transition-all ${
                  isDarkMode 
                    ? 'border-indigo-405 text-indigo-300 hover:text-white hover:border-indigo-300' 
                    : 'border-indigo-650 text-indigo-700 hover:text-indigo-900 hover:border-indigo-850'
                } font-bold px-0.5`}
                title="Click to anchor definition"
              >
                {part}
                {/* Float-up tooltip */}
                <span className={`pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 scale-0 rounded-xl p-3 text-left text-xs font-normal opacity-0 transition-all duration-200 shadow-2xl leading-relaxed ${
                  isDarkMode 
                    ? 'bg-slate-900 border border-slate-800 text-slate-200' 
                    : 'bg-white border border-zinc-250 text-zinc-900 shadow-zinc-300'
                } group-hover:scale-100 group-hover:opacity-100`}>
                  <strong className="block text-[10px] font-black uppercase tracking-widest mb-1 text-indigo-400">{match.term}</strong>
                  <span className={isDarkMode ? 'text-slate-300' : 'text-zinc-600'}>{match.definition}</span>
                  <span className={`absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-zinc-250'
                  }`} />
                </span>
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </span>
    );
  };

  const { lines: explanationLines, ranges: explanationRanges, headerLineCount } = React.useMemo(() => {
    let lines: string[] = [];
    let ranges: [number, number][] = [];
    
    const headerLines = [
       "/*",
       `• Topic: ${question.title}`,
       `• Difficulty: ${question.difficulty || 'advanced'}`,
       "",
       `Concept Tested:`,
       `• ${question.concept_tested || 'Asynchronous Programming'}`,
       "",
       `Production Usecase:`,
       `• ${question.production_usecase.title}`,
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
      const focusedElements = topCodePanelRef.current.querySelectorAll('.is-focused');
      if (focusedElements.length > 0) {
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

  const currentMcq = question.mcqs[currentMcqIndex];

  const handleCheckOption = () => {
    if (!selectedOption || !currentMcq) return;

    const isCorrect = selectedOption === currentMcq.answer;
    setIsSubmitted(true);
    setMcqResults(prev => ({ ...prev, [currentMcqIndex]: isCorrect }));

    if (isCorrect) {
      setSessionScore(prev => prev + 1);
      toast.success('Excellent! Correct analysis.');
    } else {
      toast.error('Analytical mismatch. Review wrong option feedback.');
    }
  };

  const handleNextMcq = () => {
    if (currentMcqIndex < question.mcqs.length - 1) {
      setCurrentMcqIndex(currentMcqIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  const colorizeText = (text: string) => {
    const isPython = language === 'python';
    const regex = isPython
      ? /(\b(?:def|class|import|from|as|in|for|while|if|elif|else|try|except|finally|with|lambda|pass|return|None|True|False|self|await|async)\b|[:]|[{}()\[\]'"])/g
      : /(\b(?:template|typename|class|public|private|int|return|void|float|double|bool|char)\b|<<|>>|[{}();]|<T>|T\b)/g;

    const subParts = text.split(regex);
    return (
      <span>
        {subParts.map((sub, j) => {
          if (isPython) {
            if (/\b(?:def|class|import|from|lambda|pass|return|await|async)\b/.test(sub)) {
              return <span key={j} className="text-violet-400 font-bold">{sub}</span>;
            }
            if (/\b(?:if|elif|else|for|while|in|with|try|except|finally|as)\b/.test(sub)) {
              return <span key={j} className="text-indigo-400 font-bold">{sub}</span>;
            }
            if (/\b(?:True|False|None|self)\b/.test(sub)) {
              return <span key={j} className="text-emerald-400 font-semibold">{sub}</span>;
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
          return <span key={j} className={`transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-zinc-650'}`}>{sub}</span>;
        })}
      </span>
    );
  };

  return (
    <div className={`flex flex-col w-full h-[100dvh] ${bgClass} ${textColorClass} font-sans overflow-hidden`}>

      {/* Top Panel: Source Code walkthrogh viewport */}
      <div className={`shrink-0 h-[45vh] relative overflow-hidden flex flex-col w-full ${isDarkMode ? 'bg-[#020617] border-zinc-800' : 'bg-white border-zinc-200'} border-b`}>
            <div className={`absolute top-0 left-0 right-0 h-10 border-b z-20 flex shrink-0 items-center justify-between px-4 backdrop-blur-md ${isDarkMode ? 'bg-[#0a0c10]/80 border-zinc-800' : 'bg-zinc-100/80 border-zinc-200'}`}>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <span className={`text-[9px] font-mono uppercase tracking-[0.2em] flex items-center gap-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  <Code2 className="w-3 h-3 text-emerald-400" /> {phase === 'explanation' ? (language === 'python' ? 'production_usecase.py' : 'production_usecase.cpp') : 'architecture_analysis.log'}
                </span>
                <div className="w-10" />
            </div>

            <div ref={topCodePanelRef} className={`flex-1 overflow-y-auto w-full pt-12 pb-12 custom-scrollbar scroll-smooth ${isDarkMode ? 'bg-[#020617]' : 'bg-zinc-50'}`}>
              {phase === 'explanation' ? (
                 <pre className={`font-mono text-[1.05rem] leading-[1.8] w-full whitespace-pre-wrap ${isDarkMode ? 'text-slate-300' : 'text-zinc-600'}`}>
                    <code>
                      {explanationLines.map((line, idx) => {
                         const lineNum = idx + 1;
                         const activeRange = explanationRanges[currentStep] || [0,0];
                         const isFocused = lineNum >= activeRange[0] && lineNum <= activeRange[1];
                         
                         const stepIndex = explanationRanges.findIndex(r => lineNum >= r[0] && lineNum <= r[1]);
                         const isHeaderLine = lineNum <= headerLineCount;
                         const isBlur = !isHeaderLine && stepIndex > currentStep;

                         const getHighlightBgColor = () => isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)';
                         const getColorHex = () => '#6366f1';

                         return (
                            <div 
                              key={idx} 
                              className={`line-wrapper relative px-8 flex items-start transition-all duration-300 w-full ${isBlur ? 'opacity-20 blur-[1px]' : ''} ${isFocused ? 'is-focused font-semibold' : ''}`}
                              style={{ backgroundColor: isFocused ? getHighlightBgColor() : 'transparent' }}
                            >
                              {isFocused && (
                                <div 
                                    className="absolute left-0 top-0 bottom-0 w-1"
                                    style={{ backgroundColor: getColorHex() }}
                                />
                              )}
                              <span className={`w-8 text-right mr-6 font-mono text-xs select-none relative z-10 transition-colors duration-300 shrink-0 ${isFocused ? 'text-indigo-400 font-bold' : 'text-zinc-500'}`}>
                                {lineNum}
                              </span>
                              <span className={`relative z-10 w-full transition-colors duration-300 ${isHeaderLine ? 'text-slate-500 italic text-sm' : ''}`}>
                                {isHeaderLine ? (line || '\u00A0') : colorizeText(line || '\u00A0')}
                              </span>
                            </div>
                         );
                      })}
                    </code>
                 </pre>
              ) : (
                 <div className="p-8 h-full flex flex-col justify-center items-center text-center">
                    <motion.div
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className={`p-6 max-w-2xl rounded-2xl border ${isDarkMode ? 'bg-[#0f111a] border-zinc-800' : 'bg-white border-zinc-200'} shadow-2xl`}
                    >
                       <div className="flex items-center justify-center gap-3 mb-4">
                          <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
                          <h4 className={`text-lg font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                             Interactive Architecture Analysis
                          </h4>
                       </div>
                       <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                          Review the production code logic explained earlier. Complete the diagnostic questionnaire to verify your system engineering understanding under peak load.
                       </p>
                       <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-mono">
                          <span className="px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                             <Layers className="w-3.5 h-3.5" /> Concurrency Mode: Cooperative
                          </span>
                          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                             <Globe className="w-3.5 h-3.5" /> Use-Case: Websocket Feed Handler
                          </span>
                       </div>
                    </motion.div>
                 </div>
              )}
            </div>
      </div>

      {/* Bottom Area: Narrative & Controls */}
      <div className={`flex-1 min-h-0 border-t ${isDarkMode ? 'bg-[#0f111a] border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]' : 'bg-white border-zinc-200'} z-20 flex flex-col relative`}>
        
        {/* Step Navigation Controls (Explanations Phase only) */}
        {phase === 'explanation' && (
            <div className="absolute top-6 right-6 lg:right-10 z-30 flex items-center gap-2 bg-[#0f111a]/80 backdrop-blur pb-2 pl-2 rounded-bl-xl">
                <button
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        currentStep === 0 
                            ? 'opacity-40 cursor-not-allowed text-zinc-500 bg-transparent' 
                            : isDarkMode 
                                ? 'text-slate-300 hover:text-white hover:bg-white/10 bg-white/5 border border-white/10' 
                                : 'text-zinc-600 hover:bg-zinc-100 bg-zinc-50'
                    }`}
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </button>
                {currentStep < question.explanation_steps.length - 1 ? (
                    <button
                        onClick={handleNextStep}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            isDarkMode 
                                ? 'text-slate-300 hover:text-white hover:bg-white/10 bg-white/5 border border-white/10' 
                                : 'text-zinc-600 hover:bg-zinc-100 bg-zinc-50'
                        }`}
                    >
                        Next <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                ) : (
                    <button
                        onClick={startChallenge}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            isDarkMode 
                                ? 'text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/20 bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/10' 
                                : 'text-emerald-700 hover:bg-emerald-100 bg-emerald-50'
                        }`}
                    >
                        Challenge <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        )}

        <div ref={bottomPanelRef} className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-8 justify-start items-start">
                <div className="flex-1 w-full min-w-0">
                    {phase === 'explanation' ? (
                    <div className="flex flex-col gap-10 pb-16">
                        
                        {/* Summary / Production Use-Case Box */}
                        {currentStep === 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#151822] border-indigo-500/10' : 'bg-indigo-50/50 border-indigo-200'}`}
                          >
                             <div className="flex items-center gap-3 text-indigo-400 text-sm font-black uppercase tracking-wider mb-2">
                                <Cpu className="w-4 h-4 text-indigo-500 animate-bounce" />
                                <span>Real Production Context</span>
                             </div>
                             <h4 className="text-xl font-extrabold m-0 leading-tight">
                                {question.production_usecase.title}
                             </h4>
                             <p className={`text-sm mt-3 leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'text-slate-400' : 'text-zinc-600'}`}>
                                {renderTextWithGlossary(question.production_usecase.description)}
                             </p>
                          </motion.div>
                        )}

                        {/* Staggered explanation steps list */}
                        {question.explanation_steps.slice(0, currentStep + 1).map((step, idx) => {
                            const isCurrent = idx === currentStep;
                            const hasSplits = step.splits && step.splits.length > 0;
                            
                            return (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 15 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className={`flex flex-col items-start transition-all duration-500 w-full ${isCurrent ? 'opacity-100' : 'opacity-40 grayscale-[25%]'}`}
                                >
                                    <div className="space-y-4 pt-1 w-full">
                                        <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-405 text-[10px] font-black uppercase tracking-widest mb-2">
                                            <Sparkles className="w-3 h-3 text-indigo-400" /> Action Node // Step {idx + 1}
                                        </div>

                                        {!hasSplits ? (
                                            /* Standard fallback block for raw step database entries */
                                            <div className="space-y-4 w-full">
                                                <h3 className={`text-lg lg:text-xl font-extrabold leading-relaxed ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                                                    {renderTextWithGlossary(step.description)}
                                                </h3>
                                                
                                                {(step.analogy_title || step.analogy_description) && (
                                                   <div className={`p-5 rounded-2xl border-l-4 ${isDarkMode ? 'bg-[#0f1b1a] border-emerald-500 text-slate-200' : 'bg-emerald-50/40 border-emerald-500 text-zinc-900'} space-y-2 mt-2 shadow-sm`}>
                                                      <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-400">
                                                         <Lightbulb className="w-4 h-4 text-emerald-400 animate-pulse fill-emerald-500/10" />
                                                         <span>Real-World Analogy: {step.analogy_title}</span>
                                                      </div>
                                                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-zinc-600'}`}>
                                                         {renderTextWithGlossary(step.analogy_description || '')}
                                                      </p>
                                                   </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* Dynamic split presentation workflow */
                                            <div className="space-y-6 w-full">
                                                {(isCurrent ? step.splits!.slice(0, currentSplitIndex + 1) : step.splits!).map((split, sIdx) => (
                                                    <motion.div 
                                                        key={sIdx}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className={`space-y-4 w-full p-5 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02]/30 border-white/5' : 'bg-zinc-50 border border-zinc-100'}`}
                                                    >
                                                        <div className={`text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5`}>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Part {sIdx + 1} of {step.splits!.length}
                                                        </div>
                                                        <h3 className={`text-base lg:text-lg font-bold leading-relaxed ${isDarkMode ? 'text-slate-100' : 'text-zinc-800'}`}>
                                                            {renderTextWithGlossary(split.description)}
                                                        </h3>
                                                        
                                                        {(split.analogy_title || split.analogy_description) && (
                                                           <div className={`p-4 rounded-xl border-l-4 ${isDarkMode ? 'bg-[#0d1616] border-emerald-500 text-slate-200' : 'bg-emerald-50/30 border-emerald-500 text-zinc-900'} space-y-2 shadow-sm`}>
                                                              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-400">
                                                                 <Lightbulb className="w-4 h-4 text-emerald-400 animate-pulse" />
                                                                 <span>Real-World Analogy: {split.analogy_title}</span>
                                                              </div>
                                                              <p className={`text-xs lg:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-zinc-650'}`}>
                                                                 {renderTextWithGlossary(split.analogy_description || '')}
                                                              </p>
                                                           </div>
                                                        )}
                                                    </motion.div>
                                                ))}

                                                {/* Inline "Proceed Further" controls directly focused in viewport */}
                                                {isCurrent && (
                                                    <div className="pt-4 flex justify-start items-center">
                                                        <button
                                                            onClick={() => {
                                                                if (currentSplitIndex < step.splits!.length - 1) {
                                                                    setCurrentSplitIndex(prev => prev + 1);
                                                                } else if (currentStep < question.explanation_steps.length - 1) {
                                                                    setCurrentStep(prev => prev + 1);
                                                                } else {
                                                                    setPhase('interaction');
                                                                }
                                                            }}
                                                            className={`group flex items-center gap-2 px-6 py-3.5 text-xs font-black uppercase tracking-[0.12em] rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95 ${
                                                                isDarkMode 
                                                                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/15' 
                                                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/10'
                                                            }`}
                                                        >
                                                            {currentSplitIndex < step.splits!.length - 1 ? (
                                                                <>
                                                                    Proceed Further
                                                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                                </>
                                                            ) : currentStep < question.explanation_steps.length - 1 ? (
                                                                <>
                                                                    Proceed to Next Concept
                                                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Proceed to Challenge
                                                                    <Award className="w-4 h-4 text-emerald-400" />
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    // Interaction Phase: Diagnostic MCQs
                    <div className="flex flex-col h-full justify-center pb-12">
                        <div className="mb-6 flex items-center justify-between">
                             <div className="flex items-center gap-2.5">
                                 <HelpCircle className="w-5 h-5 text-indigo-400 animate-spin-slow" />
                                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                    System Diagnostics: Case {currentMcqIndex + 1} of {question.mcqs.length}
                                 </h4>
                             </div>
                             <div className="flex gap-2">
                                {question.mcqs.map((_, i) => (
                                    <div 
                                      key={i} 
                                      className={`h-2 rounded-full transition-all duration-500 ${
                                         i === currentMcqIndex 
                                           ? 'w-12 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                                           : mcqResults[i] === true 
                                             ? 'w-4 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                                             : mcqResults[i] === false 
                                               ? 'w-4 bg-red-500' 
                                               : 'w-4 bg-white/10'
                                      }`} 
                                    />
                                ))}
                             </div>
                        </div>

                        {currentMcq ? (
                          <div className="space-y-6">
                             {/* Question Box */}
                             <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-indigo-950/20 rounded-2xl border border-indigo-500/20">
                                 <p className="text-lg font-bold leading-normal m-0 whitespace-pre-wrap">
                                    {currentMcq.question}
                                 </p>
                             </div>

                             {/* Options list */}
                             <div className="grid grid-cols-1 gap-3.5">
                                {currentMcq.options.map((option, idx) => {
                                   const isSelected = selectedOption === option.text;
                                   const isOptCorrect = option.isCorrect ?? (option.text === currentMcq.answer);
                                   
                                   let btnBorderColor = isDarkMode ? "border-zinc-800" : "border-zinc-200";
                                   let btnBg = isDarkMode ? "bg-zinc-900/60" : "bg-white";
                                   let btnText = isDarkMode ? "text-slate-300" : "text-zinc-800";

                                   if (isSubmitted) {
                                      if (isSelected) {
                                         if (isOptCorrect) {
                                            btnBorderColor = "border-emerald-500 ring-2 ring-emerald-500/20";
                                            btnBg = isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50";
                                            btnText = isDarkMode ? "text-emerald-300" : "text-emerald-800";
                                         } else {
                                            btnBorderColor = "border-red-500 ring-2 ring-red-500/20";
                                            btnBg = isDarkMode ? "bg-red-500/10" : "bg-red-50";
                                            btnText = isDarkMode ? "text-red-300" : "text-red-800";
                                         }
                                      } else if (isOptCorrect) {
                                         // Highlight correct if missed
                                         btnBorderColor = "border-emerald-500/50";
                                         btnBg = isDarkMode ? "bg-emerald-550/5" : "bg-emerald-50/50";
                                      } else {
                                         // Dim other options
                                         btnBg = isDarkMode ? "bg-zinc-950/20" : "bg-zinc-50/30";
                                         btnText = "text-zinc-500 opacity-60";
                                      }
                                   } else if (isSelected) {
                                      btnBorderColor = "border-indigo-500 ring-2 ring-indigo-500/10";
                                      btnBg = isDarkMode ? "bg-indigo-500/10" : "bg-indigo-50/20";
                                      btnText = isDarkMode ? "text-indigo-300" : "text-indigo-800";
                                   }

                                   return (
                                     <div key={idx} className="flex flex-col gap-2">
                                        <button
                                          onClick={() => {
                                             if (!isSubmitted) setSelectedOption(option.text);
                                          }}
                                          disabled={isSubmitted}
                                          className={`w-full text-left p-5 rounded-xl border ${btnBorderColor} ${btnBg} ${btnText} transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.005]`}
                                        >
                                           <div className="flex items-start justify-between gap-3">
                                               <span className="font-semibold text-base leading-relaxed">
                                                  {option.text}
                                               </span>
                                               {isSubmitted && isSelected && (
                                                  isOptCorrect ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" /> : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
                                               )}
                                               {isSubmitted && !isSelected && isOptCorrect && (
                                                  <CheckCircle2 className="w-5 h-5 text-emerald-450 shrink-0 mt-1 opacity-70 text-emerald-400" />
                                               )}
                                           </div>
                                        </button>

                                        {/* Dynamic feedback per option */}
                                        {isSubmitted && (isSelected || isOptCorrect) && option.reasoning && (
                                           <motion.div
                                             initial={{ opacity: 0, height: 0 }}
                                             animate={{ opacity: 1, height: 'auto' }}
                                             className={`px-5 py-4 rounded-xl border-l-4 ml-6 text-sm ${
                                                isOptCorrect 
                                                  ? 'bg-emerald-500/5 border-emerald-500 text-emerald-400' 
                                                  : 'bg-red-500/5 border-red-500 text-red-500'
                                             }`}
                                           >
                                              <span className="font-black uppercase tracking-wider block mb-1 text-[10px]">
                                                 {isOptCorrect ? "Correct Option Analysis" : "Wrong Option Analysis"}
                                              </span>
                                              <p className="m-0 leading-relaxed font-medium">
                                                 {option.reasoning}
                                              </p>
                                           </motion.div>
                                        )}
                                     </div>
                                   );
                                })}
                             </div>
                          </div>
                        ) : null}
                    </div>
                )}
                </div>

                {/* Floating or Docked Key Terms Glossary Panel */}
                {phase === 'explanation' && (question.glossary || fallbackGlossary) && isGlossaryOpen && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`w-full lg:w-80 shrink-0 border rounded-2xl overflow-hidden self-stretch flex flex-col ${
                      isDarkMode 
                        ? 'bg-[#151923] border-white/5 text-slate-200 shadow-2xl' 
                        : 'bg-[#f8f9fa] border-zinc-200 text-zinc-900 shadow-sm'
                    }`}
                  >
                    <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5 bg-[#1a202c]' : 'border-zinc-200 bg-zinc-200/50'}`}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-black uppercase tracking-wider">Key Terms Glossary</span>
                      </div>
                      <button 
                        onClick={() => setIsGlossaryOpen(false)}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                          isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-zinc-650 hover:text-zinc-900 hover:bg-zinc-200'
                        }`}
                      >
                        Collapse
                      </button>
                    </div>
                    
                    <div className={`p-3 border-b ${isDarkMode ? 'border-white/5 bg-[#10141f]' : 'border-zinc-200 bg-zinc-50'}`}>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                        <input 
                          type="text"
                          placeholder="Filter concepts..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs transition duration-200 outline-none ${
                            isDarkMode 
                              ? 'bg-zinc-900 border border-white/5 text-white placeholder-zinc-500 focus:border-indigo-500' 
                              : 'bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-indigo-600'
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[420px] lg:max-h-[640px] custom-scrollbar">
                      {(question.glossary || fallbackGlossary)
                        .filter(item => 
                          item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((item, index) => {
                          const isSelected = selectedGlossaryTerm === item.term;
                          return (
                            <div 
                              key={index}
                              onClick={() => setSelectedGlossaryTerm(item.term)}
                              className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                                isSelected 
                                  ? isDarkMode 
                                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' 
                                    : 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-sm'
                                  : isDarkMode 
                                    ? 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03]' 
                                    : 'bg-white border-zinc-200/65 hover:border-zinc-300 hover:bg-zinc-50'
                              }`}
                            >
                              <h5 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-400 animate-ping' : 'bg-zinc-500'}`} />
                                {item.term}
                              </h5>
                              <p className={`text-[11px] leading-relaxed mt-2 select-text ${isSelected ? (isDarkMode ? 'text-indigo-200' : 'text-indigo-950') : (isDarkMode ? 'text-zinc-400' : 'text-zinc-650')}`}>
                                {item.definition}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </motion.div>
                )}
            </div>

            {/* floating/anchored Retrieve Glossary button when closed */}
            {!isGlossaryOpen && (question.glossary || fallbackGlossary) && phase === 'explanation' && (
              <button 
                onClick={() => setIsGlossaryOpen(true)}
                className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl shadow-2xl border transition-all duration-300 active:scale-95 ${
                  isDarkMode 
                    ? 'bg-[#151923] hover:bg-[#1f2535] border-white/10 text-white shadow-black/80' 
                    : 'bg-white hover:bg-zinc-50 border-zinc-250 text-zinc-900 shadow-zinc-300'
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-505 animate-pulse" />
                <span>Key Glossary ({(question.glossary || fallbackGlossary).length})</span>
              </button>
            )}
        </div>

        {/* Diagnostic Action footer (Interactions phase) */}
        {phase === 'interaction' && (
        <div className={`px-6 py-4 lg:px-10 lg:py-6 border-t ${isDarkMode ? 'border-white/5 bg-[#0b0c10]' : 'border-zinc-100 bg-zinc-50'}`}>
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {isSubmitted ? (
                        mcqResults[currentMcqIndex] === true ? (
                            <div className="flex items-center gap-3 text-emerald-400 font-bold px-5 py-2.5 bg-emerald-400/10 rounded-xl border border-emerald-400/20 shadow-md">
                                 <CheckCircle2 className="w-4 h-4" /> Diagnosis Verified
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-rose-400 font-bold px-5 py-2.5 bg-rose-400/10 rounded-xl border border-rose-400/20 shadow-md">
                                 <AlertCircle className="w-4 h-4" /> Diagnostics Failed
                            </div>
                        )
                    ) : null}
                </div>

                <div className="flex gap-4">
                    {!isSubmitted ? (
                        <button
                            onClick={handleCheckOption}
                            disabled={!selectedOption}
                            className={`px-10 py-3.5 bg-indigo-650 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl font-bold transition-all shadow-[0_10px_20px_rgba(79,70,229,0.15)] active:scale-95`}
                        >
                            Verify Choice
                        </button>
                    ) : (
                        currentMcqIndex < question.mcqs.length - 1 ? (
                            <button
                                onClick={handleNextMcq}
                                className="px-10 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-md"
                            >
                                Next Diagnostic <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <motion.button
                                initial={{ scale: 0.95 }}
                                animate={{ scale: [1, 1.03, 1] }}
                                onClick={onBack}
                                className="px-10 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-lg"
                            >
                                <Award className="w-4 h-4 text-amber-400" /> Complete Walkthrough
                            </motion.button>
                        )
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

export default CodeExplainerProductionAnalogy;
