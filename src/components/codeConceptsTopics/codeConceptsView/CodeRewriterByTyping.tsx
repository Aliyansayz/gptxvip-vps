import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CodeRewriterByTypingQuestion 
} from '../../../types/codeConcepts';
import { 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  RotateCcw,
  Terminal,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface CodeRewriterByTypingProps {
  question: CodeRewriterByTypingQuestion;
  onBack?: () => void;
  isDarkMode?: boolean;
}

export const CodeRewriterByTyping: React.FC<CodeRewriterByTypingProps> = ({
  question,
  onBack,
  isDarkMode = true,
}) => {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [userInput, setUserInput] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const currentSnippet = question.snippets[currentSnippetIndex];
  const bgClass = isDarkMode ? "bg-[#0b0c10]" : "bg-zinc-50";
  const textColorClass = isDarkMode ? "text-slate-200" : "text-zinc-900";
  const headerBgClass = isDarkMode ? "bg-[#0f111a] border-white/10" : "bg-white border-zinc-200";

  useEffect(() => {
    setUserInput('');
    setIsCorrect(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentSnippetIndex]);

  const normalizeSpace = (str: string) => str.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);
    if (normalizeSpace(value) === normalizeSpace(currentSnippet.code)) {
      setIsCorrect(true);
      toast.success("Correct! Well typed.");
    } else {
      setIsCorrect(false);
    }
  };

  const nextSnippet = () => {
    if (currentSnippetIndex < question.snippets.length - 1) {
      setCurrentSnippetIndex(prev => prev + 1);
    }
  };

  const prevSnippet = () => {
    if (currentSnippetIndex > 0) {
      setCurrentSnippetIndex(prev => prev - 1);
    }
  };

  // Colorize logic for display
  const colorizePart = (text: string) => {
    const keywords = ['std::', 'void', 'int', 'return', 'string', 'mutex', 'lock_guard', 'unordered_map', 'class', 'struct', 'public', 'private', 'template', 'typename'];
    const parts = text.split(new RegExp(`(${keywords.join('|')})`, 'g'));
    return parts.map((part, i) => {
      if (keywords.includes(part)) {
        return <span key={i} className="text-indigo-400 font-bold">{part}</span>;
      }
      if (part.includes('"')) {
        return <span key={i} className="text-amber-400">{part}</span>;
      }
      if (part.startsWith('//')) {
        return <span key={i} className="text-gray-500 italic">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const getCodeSnippetDisplay = (snippet: typeof question.snippets[0]) => {
    const lines = snippet.code.split('\n');
    return lines.map((line, idx) => {
       const isComment = line.trim().startsWith('//');
       const lineExplanation = snippet.line_explanations?.find(e => e.line_number === idx + 1);
       
       return (
          <div key={idx} className="flex flex-col mb-1.5 group">
            <div className="flex bg-black/20 group-hover:bg-white/5 px-2 py-0.5 rounded transition-colors">
              <span className="opacity-30 w-8 inline-block select-none text-right pr-4 text-xs mt-0.5 shrink-0 group-hover:text-indigo-400 group-hover:opacity-100 transition-all">{idx + 1}</span>
              <span className={`whitespace-pre ${isComment ? 'text-gray-500 italic' : ''}`}>
                 {isComment ? line : colorizePart(line)}
              </span>
            </div>
            {lineExplanation && (
              <div className="flex mt-1 mb-2 ml-10">
                <div className="px-3 py-1.5 bg-indigo-500/10 border-l-2 border-indigo-500/50 rounded-r-md text-xs font-sans text-indigo-300 w-full animate-in fade-in slide-in-from-top-1">
                  <span className="font-bold mr-2 text-indigo-400">Line {idx + 1}</span>
                  {lineExplanation.explanation}
                </div>
              </div>
            )}
          </div>
       );
    });
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden ${bgClass} ${textColorClass} transition-colors duration-500 font-sans`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${headerBgClass} z-10 shrink-0`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Code2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide text-zinc-100">{question.title || 'Code Rewriter By Typing'}</h2>
              <div className="flex items-center gap-2 text-xs text-indigo-200/60 font-medium">
                <span>Code Typing Lab</span>
                <span>•</span>
                <span>Fragment {currentSnippetIndex + 1} of {question.snippets.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
        {/* Top/Left Pane: Reference Code */}
        <div className={`flex-1 min-w-[50%] border-b md:border-b-0 md:border-r ${isDarkMode ? 'border-white/5' : 'border-black/5'} flex flex-col relative`}>
            <div className={`py-2 px-4 uppercase tracking-[0.2em] text-[10px] font-bold ${isDarkMode ? 'bg-white/5 text-zinc-400' : 'bg-black/5 text-zinc-500'} flex items-center justify-between shrink-0`}>
                <span className="flex items-center gap-2">
                   <Terminal className="w-3 h-3 text-indigo-400" /> REFERENCE SNIPPET
                </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar text-sm font-mono leading-relaxed bg-[#0b0c10]">
               <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-indigo-300 mb-2">{currentSnippet.title}</h3>
                    {currentSnippet.explanation && <p className="text-zinc-400 text-sm mb-4">{currentSnippet.explanation}</p>}
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5 overflow-x-auto shadow-inner custom-scrollbar">
                     {getCodeSnippetDisplay(currentSnippet)}
                  </div>
               </div>
            </div>
        </div>

        {/* Bottom/Right Pane: Editor */}
        <div className="flex-1 flex flex-col bg-[#0b0c10] relative min-w-[50%] min-h-0">
            <div className={`py-2 px-4 uppercase tracking-[0.2em] text-[10px] font-bold ${isDarkMode ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'} flex items-center justify-between shrink-0 border-b border-indigo-500/20`}>
               <span className="flex items-center gap-2">
                 YOUR IMPLEMENTATION
               </span>
               <span className="opacity-50">Type exactly as shown above</span>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col relative">
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder="// Type the reference code here..."
                  className="w-full h-full p-4 md:p-6 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-emerald-300 placeholder:text-zinc-700 custom-scrollbar"
                  spellCheck={false}
                />
            </div>
            
            <div className="p-4 border-t border-white/5 flex items-center justify-between shrink-0 bg-black/20">
               <button 
                 onClick={() => {
                   setUserInput('');
                   setIsCorrect(false);
                 }}
                 className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-400 transition-colors"
               >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
               </button>
               
               <div className="flex gap-2">
                   {currentSnippetIndex > 0 && (
                     <button
                       onClick={prevSnippet}
                       className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all bg-white/5 hover:bg-white/10 text-zinc-300"
                     >
                        Previous
                     </button>
                   )}
                   
                   <button
                     onClick={nextSnippet}
                     disabled={!isCorrect || currentSnippetIndex === question.snippets.length - 1}
                     className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                       isCorrect && currentSnippetIndex < question.snippets.length - 1
                        ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                        : 'bg-white/5 text-zinc-500 cursor-not-allowed'
                     }`}
                   >
                      Next Snippet <ArrowRight className="w-4 h-4" />
                   </button>

                   {isCorrect && currentSnippetIndex === question.snippets.length - 1 && (
                     <div className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" /> Completed!
                     </div>
                   )}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CodeRewriterByTyping;
