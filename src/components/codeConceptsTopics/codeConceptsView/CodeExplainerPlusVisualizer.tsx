import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CodeExplainerPlusVisualizerQuestion } from '../../../types/codeConcepts';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  BookOpenText,
  CheckCircleIcon,
  HelpCircleIcon,
  ChevronDown,
  Download,
  Info,
  Minus,
  Plus,
  RotateCcw,
  Trash2,
  XCircle,
  ArrowLeft,
  Sun,
  Moon,
  Code2,
  Terminal,
  Cpu,
  BrainCircuit,
  MessageSquare,
  Play
} from 'lucide-react';

interface CodeExplainerPlusVisualizerProps {
  question: CodeExplainerPlusVisualizerQuestion;
  themeColor?: string;
  onBack?: () => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const TheoryPane: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const characteristics = [
    { label: 'Model', value: 'SPSC lock-free circular buffer' },
    { label: 'Read/Write Cost', value: 'O(1) push and O(1) pop' },
    { label: 'Capacity', value: 'Fixed-size, no reallocation' },
    { label: 'Overflow Policy', value: 'Overwrite oldest when full' },
    { label: 'Latency Fit', value: 'Predictable timing & cache' },
  ];

  return (
    <div className="bg-white dark:bg-[#0f111a] border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden transition-all shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpenText className="w-4 h-4 text-indigo-500" />
          <h4 className="font-bold text-sm text-zinc-800 dark:text-slate-200">Theory and Characteristics</h4>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-zinc-200 dark:border-white/5 space-y-4 text-sm">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5">
                <p className="font-semibold mb-2 text-zinc-800 dark:text-slate-200 text-xs uppercase tracking-wider">Mechanics</p>
                <p className="text-zinc-600 dark:text-slate-400 leading-relaxed text-xs">
                  A ring buffer uses modulo arithmetic for head and tail pointers to reuse fixed memory in a cycle.
                  This removes dynamic allocation and keeps push/pop deterministic, which is ideal for low-latency
                  market data pipelines.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5">
                <p className="font-semibold mb-2 text-zinc-800 dark:text-slate-200 text-xs uppercase tracking-wider">Characteristics</p>
                <div className="space-y-2">
                  {characteristics.map((item) => (
                    <div key={item.label} className="flex justify-between gap-4 items-center">
                      <span className="font-medium text-zinc-700 dark:text-slate-300 text-xs shrink-0">{item.label}</span>
                      <div className="h-px bg-zinc-200 dark:bg-white/10 flex-1 border-dashed mt-1" />
                      <span className="text-zinc-500 dark:text-slate-500 text-xs text-right truncate">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CodeExplainerPlusVisualizer: React.FC<CodeExplainerPlusVisualizerProps> = ({ 
  question, 
  themeColor = 'indigo', 
  onBack, 
  isDarkMode = true, 
  toggleDarkMode 
}) => {
  const [size, setSize] = useState(8);
  const [buffer, setBuffer] = useState<Array<number | null>>(new Array(8).fill(null));
  const [head, setHead] = useState(0);
  const [tail, setTail] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [activeCodeLine, setActiveCodeLine] = useState<number | null>(null);
  const [lastAction, setLastAction] = useState<'push' | 'pop' | 'overwrite' | null>(null);
  const [recentIndex, setRecentIndex] = useState<number | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questionsList = question.questions && question.questions.length > 0 ? question.questions : [question as any];
  const currentQuestionObj = questionsList[currentQuestionIndex];
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const codeTimerRef = useRef<number | null>(null);
  const clearLineTimerRef = useRef<number | null>(null);

  const occupiedCount = useMemo(() => {
    if (isFull) return size;
    if (head >= tail) return head - tail;
    return size - (tail - head);
  }, [head, tail, isFull, size]);

  const writeAvailable = size - occupiedCount;

  const codeBlocks = question.codeBlocks || {
    push: [
      { id: 1, text: 'with nogil:' },
      { id: 2, text: '    pushed = queue.push(<char*>data, len)' },
      { id: 3, text: '    self.head = (self.head + 1) % cap' },
    ],
    pop: [
      { id: 4, text: 'with nogil:' },
      { id: 5, text: '    popped = queue.pop(arr.data, size)' },
      { id: 6, text: '    self.tail = (self.tail + 1) % cap' },
    ],
    overwrite: [
      { id: 7, text: '# Overwriting oldest data' },
      { id: 8, text: 'self.tail = (self.tail + 1) % cap' },
      { id: 9, text: 'self.head = (self.head + 1) % cap' },
    ],
  };

  const clearTimers = () => {
    if (codeTimerRef.current) {
      window.clearInterval(codeTimerRef.current);
      codeTimerRef.current = null;
    }
    if (clearLineTimerRef.current) {
      window.clearTimeout(clearLineTimerRef.current);
      clearLineTimerRef.current = null;
    }
  };

  const reset = () => {
    clearTimers();
    setBuffer(new Array(size).fill(null));
    setHead(0);
    setTail(0);
    setIsFull(false);
    setHistory([]);
    setActiveCodeLine(null);
    setLastAction(null);
    setRecentIndex(null);
    setSelectedOption(null);
    setFeedback(null);
    setCurrentQuestionIndex(0);
  };

  const animateCode = (lines: number[]) => {
    clearTimers();
    let i = 0;
    codeTimerRef.current = window.setInterval(() => {
      setActiveCodeLine(lines[i]);
      i += 1;
      if (i >= lines.length) {
        clearTimers();
        clearLineTimerRef.current = window.setTimeout(() => {
          setActiveCodeLine(null);
          clearLineTimerRef.current = null;
        }, 900);
      }
    }, 260);
  };

  const triggerPush = () => {
    const newData = Math.floor(Math.random() * 90 + 10);
    const newBuffer = [...buffer];
    const targetIdx = head;

    let nextTail = tail;
    let overwrite = false;
    if (isFull) {
      overwrite = true;
      nextTail = (tail + 1) % size;
      setTail(nextTail);
      setLastAction('overwrite');
    } else {
      setLastAction('push');
    }

    newBuffer[targetIdx] = newData;
    setRecentIndex(targetIdx);
    setBuffer(newBuffer);

    const nextHead = (head + 1) % size;
    setHead(nextHead);

    const fullNow = nextHead === nextTail;
    setIsFull(fullNow);

    animateCode(overwrite ? [7, 8, 9] : [1, 2, 3]);
    setHistory((prev) => [`Pushed ${newData}${overwrite ? ' (Overwrote)' : ''}`, ...prev.slice(0, 7)]);
  };

  const triggerPop = () => {
    if (occupiedCount === 0) return;

    setLastAction('pop');
    const targetIdx = tail;
    setRecentIndex(targetIdx);

    const newBuffer = [...buffer];
    const poppedValue = newBuffer[targetIdx];
    newBuffer[targetIdx] = null;

    setBuffer(newBuffer);
    setTail((prev) => (prev + 1) % size);
    setIsFull(false);

    animateCode([4, 5, 6]);
    setHistory((prev) => [`Popped ${poppedValue}`, ...prev.slice(0, 7)]);
  };

  const checkAnswer = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === currentQuestionObj.answer;
    if (isCorrect) {
      toast.success('Correct!');
      setFeedback({ correct: true, text: currentQuestionObj.explanation || 'Good job!' });
      return;
    }
    const feedbackText =
      currentQuestionObj.wrong_answer_feedback?.find((f: any) => f.option === selectedOption)?.feedback || 'Incorrect.';
    setFeedback({ correct: false, text: feedbackText });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsList.length - 1) {
       setCurrentQuestionIndex(currentQuestionIndex + 1);
       setSelectedOption(null);
       setFeedback(null);
    }
  }

  useEffect(() => {
    reset();
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const bgClass = isDarkMode ? "bg-[#0b0c10]" : "bg-zinc-50";
  const textColorClass = isDarkMode ? "text-slate-200" : "text-zinc-900";
  const headerBgClass = isDarkMode ? "bg-[#0f111a] border-white/10" : "bg-white border-zinc-200";

  return (
    <div className={`flex flex-col w-full h-full min-h-screen ${bgClass} ${textColorClass} font-sans`}>
      {/* Header Panel */}
      <div className={`flex items-center justify-between px-6 py-4 border-b ${headerBgClass} sticky top-0 z-30 shadow-sm backdrop-blur-md bg-opacity-90`}>
          <div className="flex items-center gap-4">
              {onBack && (
                  <button
                      onClick={onBack}
                      className={`p-2 rounded-lg transition-colors shrink-0 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'}`}
                  >
                      <ArrowLeft className="w-5 h-5" />
                  </button>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                    Concept Explainer
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                    {question.difficulty || 'Intermediate'}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">{question.title}</h2>
              </div>
          </div>
          <div className="flex gap-4 items-center">
              {toggleDarkMode && (
                  <button
                      onClick={toggleDarkMode}
                      className={`p-2.5 rounded-lg transition-colors border ${isDarkMode ? 'bg-[#0f111a] hover:bg-white/5 text-zinc-400 border-white/10' : 'bg-white hover:bg-zinc-50 text-zinc-400 border-zinc-200 shadow-sm'}`}
                  >
                      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
              )}
          </div>
      </div>
      
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Context, Theory, Code, Logs */}
          <div className="xl:col-span-4 space-y-6 flex flex-col h-full">
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#151822] border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]' : 'bg-white border-zinc-200 shadow-sm'}`}>
               <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                 <BrainCircuit className="w-5 h-5 text-indigo-500" /> Topic Overview
               </h3>
               <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-zinc-700'}`}>
                  {question.explanation || question.theory?.summary || 'Follow the visual simulation to understand this engine design concept.'}
               </p>
            </div>

            <TheoryPane />

            <div className={`rounded-xl border overflow-hidden flex flex-col flex-1 shadow-lg ${isDarkMode ? 'bg-[#0a0c10] border-white/10' : 'bg-zinc-900 border-zinc-800'}`}>
              <div className="px-4 py-3 border-b border-white/10 text-xs font-mono text-slate-400 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-medium tracking-wide flex items-center gap-2 text-slate-300">
                    <Code2 className="w-4 h-4 text-blue-400" /> buffer_impl.cpp
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {lastAction && (
                    <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                      <Play className="w-3 h-3" /> {lastAction}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4 font-mono text-xs space-y-1 overflow-x-auto bg-[#0d1017]">
                {Object.values(codeBlocks)
                  .flat()
                  .map((line) => {
                     const isActive = activeCodeLine === line.id;
                     return (
                      <div
                        key={line.id}
                        className={`px-3 py-1.5 rounded-md transition-all duration-200 whitespace-pre flex items-center ${
                          isActive 
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]' 
                            : 'text-slate-400/70 border border-transparent hover:bg-white/5 hover:text-slate-300'
                        }`}
                      >
                        <span className="inline-block w-8 text-slate-600 select-none text-right pr-3 border-r border-white/5 mr-3">{line.id}</span>
                        <span className={isActive ? 'font-medium font-mono' : 'font-mono'}>{line.text}</span>
                      </div>
                    )
                  })}
              </div>

              <div className="border-t border-white/10 bg-[#0a0c10] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Console Output
                  </h4>
                  {history.length > 0 && <span className="text-[10px] text-slate-600 font-mono text-right">{history.length} events log</span>}
                </div>
                <div className="h-32 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {history.length === 0 && <div className="text-xs text-slate-600 italic font-mono flex items-center gap-2">Waiting for simulation events...</div>}
                  {history.map((h, i) => (
                    <div key={i} className="text-xs flex items-center gap-2 font-mono text-slate-300">
                      <span className="text-blue-500/50">›</span> {h}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visualizer & Questions */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            
            {/* Interactive Sandbox */}
            <div className={`p-1 rounded-3xl ${isDarkMode ? 'bg-gradient-to-b from-[#1c2130] to-[#12151e] shadow-[0_8px_40px_rgba(0,0,0,0.4)]' : 'bg-gradient-to-b from-white to-zinc-50 shadow-xl border border-zinc-200'}`}>
              <div className={`p-8 rounded-[22px] flex flex-col gap-8 ${isDarkMode ? 'bg-[#151822] border border-white/[0.05]' : 'bg-white border border-zinc-100'}`}>
                
                {/* Visualizer Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Interactive Ring Buffer</h3>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-zinc-500'} flex items-center gap-2`}>
                        <span className={`inline-block w-2 h-2 rounded-full ${isFull ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                        {isFull ? 'Buffer Full (Overwrite Warning)' : 'Buffer active'}
                      </p>
                    </div>
                  </div>

                  <div className={`flex rounded-xl overflow-hidden shadow-inner ${isDarkMode ? 'bg-[#0f111a] border border-white/5' : 'bg-zinc-100 border border-zinc-200'}`}>
                    <div className={`px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center border-r ${isDarkMode ? 'border-white/5 text-slate-400' : 'border-zinc-200 text-zinc-500'}`}>
                      Capacity
                    </div>
                    <button onClick={() => setSize(Math.max(4, size - 1))} className={`p-2 transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-zinc-200 text-zinc-700'}`}>
                      <Minus size={16} />
                    </button>
                    <div className={`px-4 py-2 text-sm font-bold border-l border-r ${isDarkMode ? 'border-white/5 text-white bg-[#1a1e2b]' : 'border-zinc-200 text-black bg-white'}`}>
                      {size}
                    </div>
                    <button onClick={() => setSize(Math.min(16, size + 1))} className={`p-2 transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-zinc-200 text-zinc-700'}`}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Status Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className={`p-4 rounded-xl text-center border ${isDarkMode ? 'bg-[#0f111a] border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
                      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-zinc-500'}`}>Head</div>
                      <div className="text-xl font-mono text-emerald-500 font-bold">[{head}]</div>
                   </div>
                   <div className={`p-4 rounded-xl text-center border ${isDarkMode ? 'bg-[#0f111a] border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
                      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-zinc-500'}`}>Tail</div>
                      <div className="text-xl font-mono text-amber-500 font-bold">[{tail}]</div>
                   </div>
                   <div className={`p-4 rounded-xl text-center border ${isDarkMode ? 'bg-[#0f111a] border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
                      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-zinc-500'}`}>Readable</div>
                      <div className="text-xl font-mono text-blue-500 font-bold">{occupiedCount} <span className="text-sm font-sans text-slate-500 font-medium">slots</span></div>
                   </div>
                   <div className={`p-4 rounded-xl text-center border ${isDarkMode ? 'bg-[#0f111a] border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
                      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-zinc-500'}`}>Writable</div>
                      <div className="text-xl font-mono text-slate-300 font-bold">{writeAvailable} <span className="text-sm font-sans text-slate-500 font-medium">slots</span></div>
                   </div>
                </div>

                {/* Visualizer Stage */}
                <div className={`relative rounded-2xl flex items-center justify-center min-h-[400px] overflow-hidden ${isDarkMode ? 'bg-[#0f111a] border border-white/5' : 'bg-zinc-50 border border-zinc-200 shadow-inner'}`}>
                  
                  {/* The Background Ring */}
                  {isDarkMode && (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0f111a]/50 to-[#0f111a] pointer-events-none" />
                  )}
                  
                  <div className="relative w-[320px] h-[320px] md:w-[360px] md:h-[360px]">
                    {/* Ring Track SVG */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" overflow="visible">
                       <circle 
                         cx="50" cy="50" r="42" 
                         fill="none" 
                         stroke={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)"} 
                         strokeWidth="10" 
                       />
                       <circle 
                         cx="50" cy="50" r="42" 
                         fill="none" 
                         className="transition-all duration-500 ease-in-out"
                         stroke={isDarkMode ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.2)"} 
                         strokeWidth="1" 
                         strokeDasharray={`${(occupiedCount/size) * 264} 264`}
                         strokeLinecap="round"
                         transform="rotate(-90 50 50)"
                       />
                    </svg>

                    {/* Nodes Loop */}
                    {buffer.map((item, i) => {
                      const angle = (i / size) * 2 * Math.PI - Math.PI / 2;
                      const x = 50 + 42 * Math.cos(angle);
                      const y = 50 + 42 * Math.sin(angle);

                      const isRecentlyChanged = recentIndex === i;
                      const isEmpty = item === null;
                      const isHead = head === i;
                      const isTail = tail === i;

                      return (
                        <div
                          key={i}
                          style={{ left: `${x}%`, top: `${y}%` }}
                          className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all duration-300
                            ${isEmpty 
                                ? (isDarkMode ? 'bg-[#151822] border-2 border-white/10 text-slate-500' : 'bg-white border-2 border-zinc-200 text-zinc-400') 
                                : isRecentlyChanged && lastAction === 'overwrite'
                                   ? 'bg-blue-400 text-white border-2 border-white shadow-[0_0_20px_rgba(96,165,250,0.5)] z-10 scale-110'
                                   : 'bg-blue-600 text-white border-2 border-blue-500 shadow-md'
                             }
                             ${isRecentlyChanged && lastAction === 'push' ? 'scale-110 shadow-[0_0_20px_rgba(37,99,235,0.5)] z-10' : ''}
                          `}
                        >
                          {!isEmpty && <span className="text-sm font-mono">{item}</span>}
                          {isEmpty && <span className="text-[10px] opacity-50 font-mono">{i}</span>}
                          
                          {/* Pointers mapping directly over the node */}
                          {isHead && (
                            <div className="absolute -top-6 flex flex-col items-center">
                              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider bg-emerald-500/10 px-1 py-0.5 rounded">H</span>
                              <div className="w-1 h-3 bg-emerald-500 mt-0.5 rounded-full" />
                            </div>
                          )}
                          {isTail && (
                            <div className="absolute -bottom-6 flex flex-col items-center">
                              <div className="w-1 h-3 bg-amber-500 mb-0.5 rounded-full" />
                              <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider bg-amber-500/10 px-1 py-0.5 rounded">T</span>
                            </div>
                          )}
                          <div className={`absolute -right-3 -top-3 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono
                             ${isDarkMode ? 'bg-[#0f111a] text-slate-500' : 'bg-white text-zinc-400 border border-zinc-100'}
                             ${isEmpty ? 'opacity-0' : 'opacity-100'}
                          `}>
                            {i}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Center stats */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className={`text-center p-6 rounded-full flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#151822] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border border-white/5' : 'bg-white shadow-inner border border-zinc-100'}`}>
                        <div className="text-3xl font-mono font-bold text-blue-500">
                          {Math.round((occupiedCount / size) * 100)}%
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Utilized</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls Area */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                  <button
                    onClick={triggerPush}
                    className="flex-1 w-full md:w-auto py-4 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20 group"
                  >
                    <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    PUSH DATA
                  </button>
                  <button
                    onClick={triggerPop}
                    disabled={occupiedCount === 0}
                    className={`flex-1 w-full md:w-auto py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                       occupiedCount === 0 
                         ? isDarkMode ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
                         : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98] shadow-lg shadow-blue-900/20 group'
                    }`}
                  >
                    <Trash2 className={`w-5 h-5 ${occupiedCount > 0 ? 'group-hover:scale-110 transition-transform' : ''}`} />
                    POP DATA
                  </button>
                  <button
                    onClick={reset}
                    className={`py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border ${isDarkMode ? 'border-rose-500/30 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20' : 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100'}`}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Questions Section - "Knowledge Checks" */}
            <div className={`p-8 rounded-3xl border flex flex-col gap-6 shadow-sm relative overflow-hidden ${isDarkMode ? 'bg-[#151822] border-white/10' : 'bg-white border-zinc-200'}`}>
              <div className={`absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none`} />
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full relative z-10"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                         <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Knowledge Check</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-zinc-500'}`}>Verify your understanding</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg shrink-0 border ${isDarkMode ? 'bg-[#0f111a] border-white/5 text-slate-300' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>
                      Question {currentQuestionIndex + 1} of {questionsList.length}
                    </span>
                  </div>
                  
                  <div className={`p-6 rounded-2xl mb-6 border ${isDarkMode ? 'bg-[#0f111a] border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
                    <label className={`font-medium text-lg leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-zinc-800'}`}>
                      {currentQuestionObj.question}
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestionObj.options?.map((option: string) => (
                      <button
                        key={option}
                        onClick={() => setSelectedOption(option)}
                        disabled={!!feedback}
                        className={`p-5 rounded-2xl text-sm md:text-base text-left transition-all font-medium border-2 relative overflow-hidden ${
                            selectedOption === option 
                              ? `border-blue-500 bg-blue-500/10 text-blue-400 shadow-md` 
                              : isDarkMode 
                                  ? 'border-white/5 bg-[#151822] hover:border-white/20 hover:bg-[#1a1e2b] text-slate-300' 
                                  : 'border-zinc-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-zinc-700'
                          }`}
                      >
                        {selectedOption === option && <div className="absolute inset-0 bg-blue-500/[0.03] pointer-events-none" />}
                        <span className="relative z-10">{option}</span>
                      </button>
                    ))}
                  </div>
                  
                  {!feedback ? (
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={checkAnswer}
                          disabled={!selectedOption}
                          className={`px-8 py-4 font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                              isDarkMode 
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20' 
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                            }`}
                        >
                          Check Answer <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                  ) : (
                       <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          className="mt-8 flex flex-col gap-6"
                       >
                           <div
                              className={`p-6 rounded-2xl border ${
                                  feedback.correct 
                                      ? isDarkMode ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-300 bg-emerald-50'
                                      : isDarkMode ? 'border-rose-500/30 bg-rose-500/10' : 'border-rose-300 bg-rose-50'
                                  }`}
                            >
                              <h5 className={`font-bold flex items-center gap-2 mb-3 text-lg ${
                                feedback.correct 
                                  ? isDarkMode ? 'text-emerald-400' : 'text-emerald-700' 
                                  : isDarkMode ? 'text-rose-400' : 'text-rose-700'
                              }`}>
                                {feedback.correct ? <CheckCircleIcon className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                {feedback.correct ? 'Correct! Excellent job.' : 'Not Quite'}
                              </h5>
                              <p className={`text-base font-medium leading-relaxed ${
                                feedback.correct 
                                   ? isDarkMode ? 'text-emerald-200/80' : 'text-emerald-800/80'
                                   : isDarkMode ? 'text-rose-200/80' : 'text-rose-800/80'
                              }`}>
                                {feedback.text}
                              </p>
                            </div>
                            
                            <div className="flex justify-end">
                              {currentQuestionIndex < questionsList.length - 1 ? (
                                  <button
                                      onClick={handleNextQuestion}
                                      className={`px-8 py-4 font-bold rounded-xl transition-all flex items-center gap-3 active:scale-[0.98] ${
                                          isDarkMode 
                                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                                        }`}
                                   >
                                      Continue to Next <ArrowRight className="w-5 h-5" />
                                   </button>
                              ) : (
                                  <div className={`w-full text-center p-6 rounded-2xl font-bold flex flex-col items-center justify-center gap-3 border ${
                                    isDarkMode 
                                       ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                                       : 'text-emerald-700 bg-emerald-50 border-emerald-200 shadow-sm'
                                  }`}>
                                     <div className="p-3 bg-emerald-500/20 rounded-full">
                                       <CheckCircleIcon className="w-8 h-8" />
                                     </div>
                                     <span className="text-xl">Activity Completed Successfully!</span>
                                  </div>
                              )}
                            </div>
                       </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
