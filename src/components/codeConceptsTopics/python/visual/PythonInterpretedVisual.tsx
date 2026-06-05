import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, SkipForward, RotateCcw, Terminal, ArrowRight, Settings, Cpu } from 'lucide-react';

export const PythonInterpretedVisual: React.FC = () => {
  const codeLines = [
    { text: "x = 10", comment: "Define integer x" },
    { text: "y = 20", comment: "Define integer y" },
    { text: "result = x + y", comment: "Perform addition" },
    { text: "print(f'Sum: {result}')", comment: "Output sum to console" }
  ];

  const [activeLine, setActiveLine] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [processingState, setProcessingState] = useState<string>("Idle");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (activeLine < codeLines.length - 1) {
        timer = setTimeout(() => {
          stepNext();
        }, 1200);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeLine]);

  const stepNext = () => {
    const nextLine = activeLine + 1;
    if (nextLine >= codeLines.length) {
      setProcessingState("Execution Finished");
      setIsPlaying(false);
      return;
    }

    setActiveLine(nextLine);
    setProcessingState(`Interpreting Line ${nextLine + 1}...`);

    // Simulate interpreter executing the side effect of that specific line
    setTimeout(() => {
      if (nextLine === 0) {
        setVariables({ x: 10 });
      } else if (nextLine === 1) {
        setVariables(prev => ({ ...prev, y: 20 }));
      } else if (nextLine === 2) {
        setVariables(prev => ({ ...prev, result: 30 }));
      } else if (nextLine === 3) {
        setConsoleLogs(prev => [...prev, "Sum: 30"]);
      }
      setProcessingState(`Line ${nextLine + 1} Executed`);
    }, 600);
  };

  const handleRun = () => {
    if (activeLine >= codeLines.length - 1) {
      // reset first
      handleReset();
      setTimeout(() => {
        setIsPlaying(true);
      }, 100);
    } else {
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setActiveLine(-1);
    setIsPlaying(false);
    setConsoleLogs([]);
    setVariables({});
    setProcessingState("Idle");
  };

  return (
    <div className="w-full bg-zinc-950 rounded-2xl border border-zinc-850 p-6 font-sans text-zinc-300 shadow-xl max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-zinc-500 font-mono ml-2">interpreted_pipeline.py</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={stepNext}
            disabled={isPlaying || activeLine >= codeLines.length - 1}
            className="p-1 px-2 text-[11px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 disabled:opacity-40 transition-all flex items-center gap-1 font-bold"
          >
            <SkipForward size={10} /> Step
          </button>
          <button
            onClick={handleRun}
            className={`p-1 px-2 text-[11px] rounded font-bold transition-all flex items-center gap-1 ${
              isPlaying 
                ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' 
                : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
            }`}
          >
            <Play size={10} /> {isPlaying ? 'Running...' : 'Run All'}
          </button>
          <button
            onClick={handleReset}
            className="p-1 px-2 text-[11px] bg-zinc-900 border border-zinc-800 rounded text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-1 font-bold"
          >
            <RotateCcw size={10} /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Source Code View */}
        <div className="md:col-span-7 bg-zinc-900/60 rounded-xl border border-zinc-900 p-4 relative overflow-hidden">
          <h4 className="text-[10px] uppercase text-zinc-500 font-bold mb-3 tracking-widest">Source Script</h4>
          <div className="space-y-2 font-mono text-xs">
            {codeLines.map((line, idx) => {
              const isCurrent = idx === activeLine;
              return (
                <div
                  key={idx}
                  className={`relative p-2 rounded transition-all duration-300 flex justify-between items-center ${
                    isCurrent 
                      ? 'bg-yellow-500/10 border-l-4 border-yellow-500 pl-3 text-yellow-300' 
                      : idx < activeLine 
                      ? 'text-zinc-650 line-through' 
                      : 'text-zinc-400'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-zinc-600 mr-3 inline-block w-4">{idx + 1}</span>
                    <span>{line.text}</span>
                  </div>
                  <span className="text-[9px] text-zinc-600 italic hidden sm:inline"># {line.comment}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interpreter Bridge / Live Memory */}
        <div className="md:col-span-5 flex flex-col gap-3">
          {/* State */}
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-3 flex flex-col justify-center">
            <span className="text-[9px] uppercase text-zinc-500 font-bold tracking-wider">Interpreter State</span>
            <div className="flex items-center gap-2 mt-1">
              <Settings className={`w-3.5 h-3.5 text-yellow-500 ${isPlaying ? 'animate-spin' : ''}`} />
              <span className="text-xs font-mono font-bold text-yellow-500">{processingState}</span>
            </div>
          </div>

          {/* Memory Heap */}
          <div className="bg-zinc-900/60 rounded-xl border border-zinc-900 p-3 h-full flex flex-col">
            <span className="text-[9px] uppercase text-zinc-500 font-bold tracking-wider mb-2 block">Python Virtual Heap</span>
            <div className="flex-1 space-y-1 text-xs font-mono">
              {Object.keys(variables).length === 0 ? (
                <div className="text-[10px] text-zinc-600 italic py-2">Heap is currently clean</div>
              ) : (
                Object.entries(variables).map(([key, val]) => (
                  <motion.div
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    key={key}
                    className="flex justify-between p-1.5 rounded bg-zinc-950 border border-zinc-900"
                  >
                    <span className="text-blue-400">{key}</span>
                    <span className="text-zinc-500">&rarr;</span>
                    <span className="text-emerald-400 font-bold">{val}</span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="mt-4 bg-zinc-950 border border-zinc-900 rounded-xl p-4 font-mono text-xs shadow-inner">
        <div className="flex items-center gap-2 mb-2 text-zinc-500">
          <Terminal size={12} />
          <span className="text-[10px] uppercase font-bold tracking-wider">Console Egress (stdout)</span>
        </div>
        <div className="min-h-[50px] bg-black p-3 rounded border border-zinc-900 text-emerald-400 flex flex-col gap-1">
          {consoleLogs.length === 0 && (
            <span className="text-zinc-700 italic">No console logs flushed. Trigger code execution.</span>
          )}
          {consoleLogs.map((log, index) => (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              key={index}
              className="flex items-center gap-2"
            >
              <span className="text-zinc-600">&gt;</span>
              <span>{log}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
