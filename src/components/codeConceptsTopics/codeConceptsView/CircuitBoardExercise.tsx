import React, { useState, useRef } from 'react';
import { 
  Terminal, 
  Play, 
  RefreshCw, 
  Code, 
  Cpu, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2,
  Database,
  Hash,
  ArrowLeft,
  Sun,
  Moon,
  Move
} from 'lucide-react';
import { CircuitBoardQuestion } from '../../../types';

interface CircuitBoardExerciseProps {
  question: CircuitBoardQuestion;
  themeColor?: string;
  onBack?: () => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

export const CircuitBoardExercise: React.FC<CircuitBoardExerciseProps> = ({ 
  question, 
  themeColor = 'indigo',
  onBack,
  isDarkMode = true,
  toggleDarkMode
}) => {
  const [placedBlocks, setPlacedBlocks] = useState<Record<string, string>>({}); // { nodeId: blockId }
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<Record<string, boolean> | null>(null); // { nodeId: boolean }
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

  // Canvas panning state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPan = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only left click pans
    if ((e.target as HTMLElement).closest('.node-element') || (e.target as HTMLElement).closest('.mission-panel')) {
       return; // clicked on a node or panel, do not pan
    }
    setIsPanning(true);
    startPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.current.x,
      y: e.clientY - startPan.current.y
    });
  };

  const handlePointerUp = () => {
    setIsPanning(false);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.stopPropagation();
    setDraggedBlock(blockId);
    e.dataTransfer.setData("blockId", blockId);
  };

  const handleDrop = (e: React.DragEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const blockId = e.dataTransfer.getData("blockId");
    if (!blockId) return;

    setPlacedBlocks(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        if (next[key] === blockId) delete next[key];
      });
      next[nodeId] = blockId;
      return next;
    });
    setResults(null);
  };

  const handleLibraryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData("blockId");
    setPlacedBlocks(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        if (next[key] === blockId) delete next[key];
      });
      return next;
    });
    setResults(null);
  };

  // Execution Logic
  const runCircuit = () => {
    setIsRunning(true);
    setResults(null);

    // Simulate "compilation" delay
    setTimeout(() => {
      const newResults: Record<string, boolean> = {};
      question.nodes.forEach(node => {
        newResults[node.id] = placedBlocks[node.id] === node.expectedBlock;
      });
      setResults(newResults);
      setIsRunning(false);
    }, 1500);
  };

  const resetCircuit = () => {
    setPlacedBlocks({});
    setResults(null);
    setIsRunning(false);
    setPan({ x: 0, y: 0 });
  };

  // Theme-aware styles
  const bgClass = isDarkMode ? "bg-[#020408]" : "bg-zinc-100";
  const headerBgClass = isDarkMode ? "bg-[#05080c] border-blue-900/30" : "bg-white border-zinc-300";
  const textColorClass = isDarkMode ? "text-slate-300" : "text-zinc-800";
  const gridPatternClass = isDarkMode 
    ? "bg-[radial-gradient(#1e293b_1px,transparent_1px)]" 
    : "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)]";
  const gridStrokeIdle = isDarkMode ? "#1e293b" : "#94a3b8";

  return (
    <div className={`flex flex-col w-full h-full ${bgClass} ${textColorClass} font-mono overflow-hidden transition-colors duration-500`}>
      {/* Top Header */}
      <div className={`h-16 border-b ${headerBgClass} flex items-center justify-between px-6 shrink-0`}>
        <div className="flex items-center gap-4">
          {onBack && (
            <button
                onClick={onBack}
                className={`p-2 rounded-xl transition-colors shrink-0 ${isDarkMode ? 'bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300' : 'bg-white hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700 border border-zinc-200 shadow-sm'}`}
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className={`flex items-center gap-3 p-2 rounded-xl ${isDarkMode ? 'bg-blue-900/10 border border-blue-900/20' : 'bg-blue-50 border border-blue-100'}`}>
            <Cpu className="text-blue-500 w-5 h-5 shrink-0" />
            <h1 className="text-xs font-bold tracking-[0.2em] text-blue-500 uppercase">
              LogicGate // {question.title}
            </h1>
          </div>
        </div>
        <div className="flex gap-4 items-center">
            {toggleDarkMode && (
                <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-xl transition-colors border ${isDarkMode ? 'bg-zinc-800/50 hover:bg-zinc-800/80 text-zinc-400 border-zinc-700/50' : 'bg-white hover:bg-zinc-50 text-zinc-400 border-zinc-200'}`}
                >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
            )}
          <button 
            onClick={resetCircuit}
            className={`px-4 py-2 text-xs border transition-colors flex items-center gap-2 rounded-xl font-bold tracking-wider ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-zinc-300 hover:bg-zinc-200'}`}
          >
            <RefreshCw size={14} className={isRunning ? "animate-spin" : ""} /> RESET
          </button>
          <button 
            onClick={runCircuit}
            disabled={Object.keys(placedBlocks).length === 0 || isRunning}
            className={`px-6 py-2 text-xs font-bold flex items-center gap-2 transition-all rounded-xl tracking-wider ${
              Object.keys(placedBlocks).length === 0 || isRunning
                ? isDarkMode ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
            }`}
          >
            <Play size={14} fill="currentColor" /> {isRunning ? "EXECUTING..." : "RUN CIRCUIT"}
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div 
        className={`flex-1 relative ${gridPatternClass} [background-size:30px_30px] overflow-hidden select-none ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ backgroundPosition: `${pan.x}px ${pan.y}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div 
            className="absolute inset-0 pointer-events-none transition-transform duration-75 ease-out"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
        >
            {/* Background Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <path 
                d={`M ${question.nodes.map(n => `${n.x} ${n.y}`).join(' L ')}`} 
                fill="none" 
                stroke={results ? (Object.values(results).every(v => v) ? "#10b981" : "#ef4444") : gridStrokeIdle} 
                strokeWidth="2" 
                strokeDasharray="5,5"
                className="transition-colors duration-500"
              />
            </svg>

            {/* Nodes (Drop Zones) */}
            {question.nodes.map((node) => {
              const currentBlockId = placedBlocks[node.id];
              const block = question.blocks.find(b => b.id === currentBlockId);
              const status = results ? (results[node.id] ? 'success' : 'error') : 'idle';

              const boxBgClass = isDarkMode ? "bg-[#05080c]/90 border-slate-700" : "bg-white/90 border-zinc-300 shadow-md";
              const textMutedClass = isDarkMode ? "text-slate-500" : "text-zinc-500";
              const textNormalClass = isDarkMode ? "text-slate-300" : "text-zinc-700";

              return (
                <div 
                  key={node.id}
                  style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
                  className="absolute node-element cursor-default pointer-events-auto"
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => handleDrop(e, node.id)}
                >
                  <div className={`
                    w-64 min-h-[100px] border-2 transition-all duration-300 relative group rounded-xl overflow-hidden backdrop-blur-md
                    ${status === 'success' ? 'border-emerald-500/50 bg-emerald-500/10' : 
                      status === 'error' ? 'border-red-500/50 bg-red-500/10' : 
                      currentBlockId ? 'border-blue-500/50 bg-blue-500/5' : `border-dashed ${boxBgClass}`}
                  `}>
                    {/* Labels */}
                    <div className="absolute -top-7 left-0 flex items-center gap-2 w-full px-1">
                      <span className="text-[10px] font-bold text-blue-500 uppercase">{node.label}</span>
                      <span className={`text-[11px] ${textMutedClass} truncate max-w-[140px] font-medium`}>[{node.description}]</span>
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute -right-3 -top-3 z-10">
                      {status === 'success' && <CheckCircle2 className={`text-emerald-500 ${isDarkMode ? 'bg-[#020408]' : 'bg-white'} rounded-full`} size={24} />}
                      {status === 'error' && <AlertCircle className={`text-red-500 ${isDarkMode ? 'bg-[#020408]' : 'bg-white'} rounded-full`} size={24} />}
                    </div>

                    {/* Draggable Placed Content */}
                    {block ? (
                      <div 
                        draggable 
                        onDragStart={(e) => handleDragStart(e, block.id)}
                        className="p-4 cursor-grab active:cursor-grabbing min-h-[100px] flex flex-col justify-center relative z-10"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{block.label}</span>
                          <Hash size={12} className={textMutedClass} />
                        </div>
                        <code className={`text-xs ${textNormalClass} block leading-tight break-words whitespace-pre-wrap font-medium`}>
                          {block.code}
                        </code>
                      </div>
                    ) : (
                      <div className={`h-[100px] flex items-center justify-center text-[10px] uppercase font-bold tracking-widest animate-pulse relative z-10 ${isDarkMode ? 'text-slate-600' : 'text-zinc-400'}`}>
                        Drop Logic Block
                      </div>
                    )}

                    {/* Execution Scanner */}
                    {isRunning && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent h-full w-full animate-scan pointer-events-none" />
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Pan Controls Info */}
        <div className={`absolute bottom-6 left-6 flex items-center gap-2 px-3 py-2 rounded-xl z-10 border shadow-sm backdrop-blur-md ${isDarkMode ? 'bg-[#05080c]/80 border-blue-900/30 text-slate-500' : 'bg-white/80 border-zinc-200 text-zinc-500'}`}>
          <Move size={14} />
          <span className="text-[10px] font-bold tracking-widest uppercase">CLICK & DRAG BACKGROUND TO PAN CANVAS</span>
        </div>

        {/* Mission Brief Panel */}
        <div className={`mission-panel absolute top-6 right-6 w-80 p-5 rounded-2xl shadow-xl border backdrop-blur-xl ${isDarkMode ? 'bg-[#05080c]/90 border-blue-900/30 shadow-black/50' : 'bg-white/90 border-zinc-200 shadow-xl'}`}>
          <div className={`flex items-center gap-3 mb-4 border-b pb-3 ${isDarkMode ? 'border-blue-900/30' : 'border-zinc-200'}`}>
            <Terminal size={16} className="text-blue-500" />
            <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-zinc-800'}`}>Mission Briefing</span>
          </div>
          <p className={`text-xs leading-relaxed mb-5 ${isDarkMode ? 'text-slate-400' : 'text-zinc-600 font-medium'}`}>
            {question.explanation}
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-bold">
              <span className={`uppercase ${isDarkMode ? 'text-slate-500' : 'text-zinc-500'}`}>System Integrity</span>
              <span className={results ? (Object.values(results).every(v => v) ? "text-emerald-500" : "text-red-500") : "text-blue-500"}>
                {results ? (Object.values(results).every(v => v) ? "VERIFIED" : "COMPROMISED") : "READY"}
              </span>
            </div>
            <div className={`h-1.5 overflow-hidden rounded-full ${isDarkMode ? 'bg-slate-900' : 'bg-zinc-200'}`}>
              <div 
                className={`h-full transition-all duration-1000 ${results && Object.values(results).every(v => v) ? 'bg-emerald-500' : 'bg-blue-500'}`}
                style={{ width: `${(Object.keys(placedBlocks).length / question.nodes.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Pane (Component Library) */}
      <div 
        className={`min-h-[160px] border-t p-5 shrink-0 overflow-hidden ${isDarkMode ? 'bg-[#05080c] border-blue-900/40' : 'bg-white border-zinc-200 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]'}`}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={handleLibraryDrop}
      >
        <div className="flex items-center gap-3 mb-4 px-2">
          <Database size={16} className={isDarkMode ? 'text-slate-500' : 'text-zinc-500'} />
          <span className={`text-xs font-bold uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-500' : 'text-zinc-500'}`}>Logic Component Store</span>
        </div>
        
        <div className="flex gap-5 overflow-x-auto pb-4 px-2 scrollbar-none">
          {question.blocks.map((block) => {
            const isUsed = Object.values(placedBlocks).includes(block.id);
            const libBlockBg = isDarkMode ? 'bg-[#0a0f18] border-blue-900/60 shadow-lg' : 'bg-zinc-50 border-zinc-200 shadow-sm';
            const libCodeBg = isDarkMode ? 'bg-black/40 border-white/5' : 'bg-white border-zinc-200';
            const libCodeText = isDarkMode ? 'text-slate-300' : 'text-indigo-950 font-semibold';
            
            return (
              <div
                key={block.id}
                draggable={!isUsed}
                onDragStart={(e) => handleDragStart(e, block.id)}
                className={`
                  flex-shrink-0 w-56 p-4 border transition-all duration-300 relative rounded-xl
                  ${isUsed 
                    ? `opacity-30 ${isDarkMode ? 'grayscale border-slate-800' : 'border-zinc-300'} cursor-not-allowed` 
                    : `${libBlockBg} hover:border-blue-400 cursor-grab active:cursor-grabbing hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:-translate-y-1`
                  }
                `}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isUsed ? (isDarkMode ? 'bg-slate-700' : 'bg-zinc-300') : 'bg-blue-500'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-blue-400/80' : 'text-blue-600'}`}>{block.label}</span>
                  </div>
                  <Code size={12} className={isDarkMode ? 'text-slate-600' : 'text-zinc-400'} />
                </div>
                <div className={`${libCodeBg} p-3 border rounded-lg mx-[-4px] mb-3 min-h-[50px] flex items-center shadow-inner`}>
                  <code className={`text-xs block break-words whitespace-pre-wrap leading-relaxed w-full ${libCodeText}`}>
                    {block.code}
                  </code>
                </div>
                <div className={`text-[9px] font-bold text-right uppercase mt-auto ${isDarkMode ? 'text-slate-600' : 'text-zinc-400'}`}>
                  Type: {block.type}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};
