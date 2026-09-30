import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Check, Trash2 } from 'lucide-react';
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
  title = "Sample agent output",
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

  const handleCopy = async () => {
    const rawText = logs
      .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      toast.success("Sample output copied.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed. Select the output text and copy it manually.");
    }
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
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white tracking-wide text-xs">{title}</span>
          <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300">Scripted example</span>
          {isStreaming && (
            <span role="status" className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
              Generating sample
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Level Filter Tabs */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-[10px]" aria-label="Filter sample output">
            {(['all', 'info', 'warn', 'error'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedFilter(lvl)}
                aria-pressed={selectedFilter === lvl}
                className={`min-h-9 rounded px-2 capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
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
            type="button"
            onClick={handleCopy}
            title="Copy sample output"
            aria-label="Copy sample output"
            className="flex min-h-9 min-w-9 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {onClear && (
            <button
              type="button"
              onClick={onClear}
              title="Clear sample output"
              aria-label="Clear sample output"
              className="flex min-h-9 min-w-9 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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
        className="space-y-1.5 overflow-y-auto break-words p-3 font-mono text-[11px] leading-relaxed custom-scrollbar"
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
              <span className="min-w-0 flex-1 break-words text-slate-300">{log.message}{log.source && <span className="ml-1 text-slate-400">Source: {log.source}</span>}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AgentTerminalLog;
