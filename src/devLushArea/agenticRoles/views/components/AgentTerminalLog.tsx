import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Check, Trash2, Maximize2, Minimize2, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

export interface TerminalLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  source?: string;
}

interface AgentTerminalLogProps {
  logs: TerminalLogEntry[];
  title?: string;
  isStreaming?: boolean;
  maxHeight?: string;
  onClear?: () => void;
}

export const AgentTerminalLog: React.FC<AgentTerminalLogProps> = ({
  logs,
  title = "Agent Telemetry Stream",
  isStreaming = false,
  maxHeight = "240px",
  onClear
}) => {
  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'info' | 'warn' | 'error' | 'success'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleCopy = () => {
    const rawText = logs
      .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    toast.success("Terminal logs copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = logs.filter((l) => {
    if (selectedFilter === 'all') return true;
    return l.level === selectedFilter;
  });

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-emerald-400 font-semibold';
      case 'warn':
        return 'text-amber-400 font-semibold';
      case 'error':
        return 'text-rose-400 font-bold';
      case 'info':
      default:
        return 'text-cyan-400';
    }
  };

  return (
    <div className="w-full rounded-xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white tracking-wide text-xs">{title}</span>
          {isStreaming && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-cyan-300 font-bold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              LIVE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Level Filter Tabs */}
          <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[10px]">
            {(['all', 'info', 'warn', 'error'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedFilter(lvl)}
                className={`px-2 py-0.5 rounded capitalize transition-all cursor-pointer ${
                  selectedFilter === lvl
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            title="Copy Logs"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {onClear && (
            <button
              onClick={onClear}
              title="Clear Terminal"
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Log Feed */}
      <div
        ref={scrollRef}
        style={{ maxHeight }}
        className="p-3 overflow-y-auto space-y-1.5 font-mono text-[11px] leading-relaxed custom-scrollbar"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 italic py-4 text-center">No terminal logs recorded yet.</div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2.5 hover:bg-slate-900/40 px-1.5 py-0.5 rounded transition-colors">
              <span className="text-slate-600 select-none flex-shrink-0 text-[10px]">{log.timestamp}</span>
              <span className={`uppercase text-[10px] px-1.5 py-0.2 rounded border border-slate-800 select-none ${getLevelStyle(log.level)}`}>
                {log.level}
              </span>
              <span className="text-slate-300 break-words flex-1">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AgentTerminalLog;
