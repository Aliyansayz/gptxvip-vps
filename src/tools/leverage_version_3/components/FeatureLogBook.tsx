import React from 'react';
import { useIndicatorsStore } from '../stores/indicators_store';
import { Download, FileSpreadsheet, Trash2 } from 'lucide-react';

export const FeatureLogBook: React.FC = () => {
  const { featureLog, setFeatureLog } = useIndicatorsStore();
  const [visibleCount, setVisibleCount] = React.useState(100);

  if (featureLog.length === 0) {
    return (
      <div className="w-full bg-zinc-900/60 border border-zinc-805 rounded-xl overflow-hidden p-8 flex flex-col items-center justify-center text-center">
        <FileSpreadsheet className="text-zinc-650 h-10 w-10 mb-3" />
        <h4 className="text-sm font-semibold text-zinc-400">Feature Log Book is Empty</h4>
        <p className="text-xs text-zinc-500 max-w-md mt-1">
          Make sure "Activate the Feature Log" is checked in your Indicator Log tab. A new row will be automatically created whenever a main trade setup is triggered.
        </p>
      </div>
    );
  }

  // Identify all dynamic indicator column keys
  const metadataKeys = ['trade_id', 'type_of_trade', 'asset', 'trade_action', 'timestamp', 'preset_name'];
  const allKeys = Array.from(new Set(featureLog.flatMap(entry => Object.keys(entry))));
  const indicatorKeys = allKeys.filter(k => !metadataKeys.includes(k)).sort();

  const hasPresets = featureLog.some(entry => entry.preset_name);

  const reversedLog = [...featureLog].reverse();
  const visibleLogs = reversedLog.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 100);
  };

  const handleDownloadCSV = () => {
    if (featureLog.length === 0) return;

    const headers = [
      'trade_id',
      'type_of_trade',
      'asset',
      ...(hasPresets ? ['preset_name'] : []),
      ...indicatorKeys,
      'trade_action'
    ];
    
    const csvRows = featureLog.map(entry => {
      return headers.map(header => {
        const val = entry[header];
        if (val === undefined) return '';
        const valStr = String(val);
        if (valStr.includes(',') || valStr.includes('"') || valStr.includes('\n')) {
          return `"${valStr.replace(/"/g, '""')}"`;
        }
        return valStr;
      });
    });

    const csvContent = [headers.join(','), ...csvRows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `feature_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-4">
      <div className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl overflow-hidden shadow-inner flex flex-col min-h-0">
        <div className="p-4 border-b border-zinc-800 flex flex-wrap gap-4 justify-between items-center bg-zinc-800/40 shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-cyan-200 flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-cyan-400" />
              Machine Learning Feature Log Book
            </h3>
            <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/40 px-2 py-0.5 rounded font-bold uppercase">
              {featureLog.length} Records
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 text-[10.5px] uppercase font-bold tracking-wider rounded border border-cyan-800/40 transition-all pointer-events-auto"
            >
              <Download size={12} />
              Export CSV
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete all feature log book records?")) {
                  setFeatureLog([]);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-950/40 hover:bg-red-900/40 text-red-400 text-[10.5px] uppercase font-bold tracking-wider rounded border border-red-900/30 transition-all pointer-events-auto"
            >
              <Trash2 size={12} />
              Reset Log
            </button>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[350px] flex-1 custom-scrollbar">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-zinc-950 text-cyan-600 border-b border-zinc-800/60 uppercase tracking-wider text-[10px] font-bold sticky top-0 backdrop-blur-sm z-10">
              <tr>
                <th className="px-4 py-3 font-bold border-r border-zinc-850">Trade ID</th>
                <th className="px-4 py-3 font-bold border-r border-zinc-850">Type</th>
                {hasPresets ? (
                  <th className="px-4 py-3 font-bold border-r border-zinc-850 text-center text-cyan-400">Asset =&gt; Preset Name</th>
                ) : (
                  <th className="px-4 py-3 font-bold border-r border-zinc-850 text-center">Asset</th>
                )}
                
                {/* Dynamically mapped indicator columns */}
                {indicatorKeys.map(key => {
                  const isLookback = key.includes('_t-');
                  return (
                    <th 
                      key={key} 
                      className={`px-4 py-3 font-mono font-normal tracking-tight text-[10px] border-r border-zinc-850 ${
                        isLookback ? 'text-zinc-500 bg-zinc-950/40' : 'text-zinc-350'
                      }`}
                    >
                      {key}
                    </th>
                  );
                })}

                <th className="px-4 py-3 font-bold text-center">Trade Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 bg-zinc-900/20 font-mono text-[11px]">
              {visibleLogs.map((entry, index) => {
                return (
                  <tr key={`${entry.trade_id}_${index}`} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-zinc-400 border-r border-zinc-850 truncate max-w-[120px]" title={entry.trade_id}>
                      {entry.trade_id}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-500 border-r border-zinc-850">
                      {entry.type_of_trade}
                    </td>
                    {hasPresets ? (
                      <td className="px-4 py-2.5 text-center border-r border-zinc-850 font-sans font-medium text-cyan-300">
                        {entry.asset}{entry.preset_name ? ` => ${entry.preset_name}` : ''}
                      </td>
                    ) : (
                      <td className="px-4 py-2.5 text-center border-r border-zinc-850 font-sans font-medium text-cyan-300">
                        {entry.asset}
                      </td>
                    )}

                    {/* Mapped dynamic columns */}
                    {indicatorKeys.map(key => {
                      const val = entry[key];
                      const isLookback = key.includes('_t-');
                      return (
                        <td 
                          key={key} 
                          className={`px-4 py-2.5 border-r border-zinc-850 ${
                            isLookback ? 'text-zinc-500/90' : 'text-zinc-305'
                          }`}
                        >
                          {val !== undefined ? (
                            typeof val === 'number' ? (
                              Number.isInteger(val) ? val : val.toFixed(4)
                            ) : String(val)
                          ) : (
                            <span className="text-zinc-650">-</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                        entry.trade_action === 'long' 
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' 
                          : 'bg-red-950/40 text-red-400 border-red-900/50'
                      }`}>
                        {entry.trade_action}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {visibleLogs.length < featureLog.length && (
                <tr>
                  <td colSpan={indicatorKeys.length + 4} className="px-4 py-4 text-center">
                    <button
                      onClick={handleLoadMore}
                      className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-xs font-medium rounded border border-zinc-700/50 transition-colors"
                    >
                      Load More Records ({featureLog.length - visibleLogs.length} remaining)
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
