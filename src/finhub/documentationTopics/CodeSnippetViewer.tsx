import React, { useEffect, useRef, useState } from "react";
import { Code2, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Snippet {
  id: string;
  name: string;
  code: string;
  description: string;
}

interface CodeSnippetViewerProps {
  snippets: Snippet[];
}

export const CodeSnippetViewer: React.FC<CodeSnippetViewerProps> = ({
  snippets,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (copyTimeoutRef.current !== null) window.clearTimeout(copyTimeoutRef.current);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % snippets.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + snippets.length) % snippets.length);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(snippets[currentIndex].code);
      setCopyError("");
      setCopied(true);
      if (copyTimeoutRef.current !== null) window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyError("Clipboard access failed. Select the code and copy it manually.");
    }
  };

  if (snippets.length === 0) {
    return <p role="status" className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">No code snippets are available yet.</p>;
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden mt-8 transition-colors duration-300">
      {/* Tabs Header */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto no-scrollbar bg-white dark:bg-zinc-950/50 pt-2 px-2">
        {snippets.map((snippet, index) => (
          <button
            type="button"
            aria-pressed={currentIndex === index}
            key={snippet.id}
            onClick={() => {
              setCurrentIndex(index);
              setCopied(false);
              setCopyError("");
            }}
            className={`px-4 py-3 font-mono uppercase tracking-widest whitespace-nowrap transition-all duration-300 border-b-2 ${
              currentIndex === index
                ? "text-sm md:text-base font-bold text-white bg-emerald-500 border-emerald-500 shadow-lg transform scale-105 z-10 relative rounded-t-lg"
                : "text-xs md:text-sm text-zinc-500 border-transparent hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            {snippet.name}
          </button>
        ))}
      </div>

      {/* Code Area */}
      <div className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-zinc-500 dark:text-zinc-600" />
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-600 uppercase tracking-widest">
              Python // Logic Engine
            </span>
          </div>
          <button
            type="button"
            aria-label={copied ? "Snippet copied" : "Copy code snippet"}
            onClick={copyToClipboard}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        {copyError && <p role="alert" className="mb-3 text-xs text-amber-700 dark:text-amber-400">{copyError}</p>}
        <p role="status" className="sr-only">{copied ? "Snippet copied to clipboard." : ""}</p>

        <div className="min-h-[200px] relative">
          <div key={currentIndex} className="font-mono text-sm leading-relaxed">
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#1E1E1E] shadow-lg">
              <SyntaxHighlighter
                language="python"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "1.5rem",
                  background: "transparent",
                  fontSize: "0.875rem",
                  lineHeight: "1.6",
                }}
                wrapLines={true}
                wrapLongLines={true}
              >
                {snippets[currentIndex].code}
              </SyntaxHighlighter>
            </div>
            <div className="mt-6 p-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
              <p className="text-xs text-zinc-600 dark:text-zinc-500 italic">
                {snippets[currentIndex].description}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={prev}
            className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> PREV
          </button>
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-700">
            {currentIndex + 1} / {snippets.length}
          </div>
          <button
            type="button"
            onClick={next}
            className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            NEXT <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
