import React, { useState, useRef, useEffect } from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { ChevronLeft, ChevronRight, Ban } from 'lucide-react';

export const DeveloperConsoleLogPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { consoleLog, setConsoleLog } = useIndicatorsStore();
  
  const [filterInfo, setFilterInfo] = useState(true);
  const [filterWarn, setFilterWarn] = useState(true);
  const [filterError, setFilterError] = useState(true);
  const [filterSuccess, setFilterSuccess] = useState(true);

  const endOfLogsRef = useRef<HTMLDivElement>(null);

  const filteredLogs = consoleLog.filter(log => {
    if (log.level === 'INFO' && !filterInfo) return false;
    if (log.level === 'WARN' && !filterWarn) return false;
    if (log.level === 'ERROR' && !filterError) return false;
    if (log.level === 'SUCCESS' && !filterSuccess) return false;
    return true;
  });

  useEffect(() => {
    if (isExpanded && endOfLogsRef.current) {
      endOfLogsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, isExpanded]);

  const clearLogs = () => {
    setConsoleLog([]);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${d.getMilliseconds().toString().padStart(3, '0')}`;
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'SUCCESS': return 'text-emerald-400';
      case 'INFO': return 'text-cyan-400';
      case 'WARN': return 'text-amber-400';
      case 'ERROR': return 'text-rose-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className={`fixed right-0 top-1/4 bottom-1/4 z-50 transition-all duration-300 flex ${isExpanded ? 'w-[400px] md:w-[600px] bg-zinc-950 border-l border-t border-b border-zinc-800 shadow-2xl' : 'w-8 bg-zinc-900 border-l border-t border-b border-zinc-700 shadow-lg cursor-pointer hover:bg-zinc-800'} rounded-l-lg overflow-hidden`}>
      {/* Collapsed View / Toggle Handle */}
      <div 
        className="w-8 shrink-0 flex flex-col items-center py-4 cursor-pointer min-h-full border-r border-zinc-900 justify-center bg-zinc-900 hover:bg-zinc-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronRight className="w-5 h-5 text-zinc-400 mb-4" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-zinc-400 mb-4" />
        )}
        <div className="writing-vertical-rl transform rotate-180 text-xs font-mono font-medium tracking-widest text-zinc-400 whitespace-nowrap">
          DEVELOPER CONSOLE
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="flex-1 flex flex-col min-w-0 bg-black text-zinc-300 font-mono text-[10px] md:text-xs">
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-zinc-800 bg-zinc-900 shrink-0">
            <div className="flex gap-2">
              <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                <input type="checkbox" checked={filterInfo} onChange={() => setFilterInfo(!filterInfo)} className="accent-cyan-500" />
                <span className="text-cyan-400">INFO</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                <input type="checkbox" checked={filterSuccess} onChange={() => setFilterSuccess(!filterSuccess)} className="accent-emerald-500" />
                <span className="text-emerald-400">SUCCESS</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                <input type="checkbox" checked={filterWarn} onChange={() => setFilterWarn(!filterWarn)} className="accent-amber-500" />
                <span className="text-amber-400">WARN</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                <input type="checkbox" checked={filterError} onChange={() => setFilterError(!filterError)} className="accent-rose-500" />
                <span className="text-rose-400">ERROR</span>
              </label>
            </div>
            <button onClick={clearLogs} className="flex items-center gap-1 text-zinc-400 hover:text-rose-400 transition-colors" title="Clear Logs">
              <Ban className="w-3 h-3" />
              <span>CLEAR</span>
            </button>
          </div>

          {/* Log Window */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredLogs.length === 0 ? (
              <div className="text-zinc-600 italic">No logs matched filters</div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="flex items-start gap-2 break-all hover:bg-zinc-900 px-1 py-0.5 rounded">
                  <span className="text-zinc-600 shrink-0 w-[85px]">{formatTime(log.timestamp)}</span>
                  <span className={`shrink-0 w-[55px] font-bold ${getLogColor(log.level)}`}>{log.level}</span>
                  <span className="text-zinc-500 shrink-0 min-w-[70px]">[{log.source}]</span>
                  <span className="text-zinc-300 flex-1">{log.message}</span>
                </div>
              ))
            )}
            <div ref={endOfLogsRef} />
          </div>
        </div>
      )}
    </div>
  );
};
