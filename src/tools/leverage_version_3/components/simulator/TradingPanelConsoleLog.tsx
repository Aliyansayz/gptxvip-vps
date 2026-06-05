import React, { useEffect, useRef, useState } from 'react';
import { useLoggerStore, LogLevel } from '../../functions/api/developerLogConsole';

export const TradingPanelConsoleLog: React.FC = () => {
  const { logs, clearLogs } = useLoggerStore();
  const [filters, setFilters] = useState<Record<LogLevel, boolean>>({
    INFO: true,
    WARN: true,
    ERROR: true,
    SUCCESS: true,
  });
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  const toggleFilter = (level: LogLevel) => {
    setFilters((prev) => ({ ...prev, [level]: !prev[level] }));
  };

  const getLogColor = (level: LogLevel) => {
    switch (level) {
      case 'SUCCESS': return 'text-emerald-400';
      case 'INFO': return 'text-cyan-400';
      case 'WARN': return 'text-amber-400';
      case 'ERROR': return 'text-rose-400';
      default: return 'text-zinc-400';
    }
  };

  const filteredLogs = logs.filter((log) => filters[log.level]);

  return (
    <div className="flex flex-col h-[400px] w-full bg-black/90 font-mono text-xs rounded-lg overflow-hidden border border-zinc-800">
      {/* Header controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950/50">
        <div className="flex space-x-3">
          {(Object.keys(filters) as LogLevel[]).map((level) => (
            <label key={level} className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters[level]}
                onChange={() => toggleFilter(level)}
                className="rounded-sm bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-0 w-3 h-3"
              />
              <span className={`text-[10px] ${getLogColor(level)}`}>{level}</span>
            </label>
          ))}
        </div>
        <button
          onClick={clearLogs}
          className="px-2 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-md border border-red-900/50 transition text-[10px]"
        >
          Clear Logs
        </button>
      </div>

      {/* Terminal View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {filteredLogs.length === 0 ? (
          <div className="text-zinc-600 text-center mt-10">No logs available matching the current filters.</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex space-x-3 hover:bg-zinc-900/50 px-2 py-0.5 rounded">
              <span className="text-zinc-500 shrink-0 w-24">
                {new Date(log.timestamp).toISOString().split('T')[1].replace('Z', '')}
              </span>
              <span className={`shrink-0 w-16 font-semibold ${getLogColor(log.level)}`}> [{log.level}] </span>
              <span className="text-purple-400 shrink-0 min-w-24">[{log.source}]</span>
              <span className="text-zinc-300 break-all">{log.message}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
