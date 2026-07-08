import React from 'react';
import { ArrowRight, ArrowDown, Server, Activity, BookOpen, Database } from 'lucide-react';

interface RoadmapReadingActivityProps {
  chapter: any;
  onComplete: () => void;
}

export const RoadmapReadingActivity: React.FC<RoadmapReadingActivityProps> = ({ chapter, onComplete }) => {
  const labId = chapter?.readingComponentId || chapter?.labComponentId;
  
  // --- Bespoke Visuals ---
  const kernelBypassVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-slate-950">
       <div className="flex flex-col md:flex-row w-full max-w-2xl h-auto md:h-64 border border-slate-800 rounded-xl overflow-hidden bg-slate-900 relative">
          <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col items-center justify-between opacity-50 space-y-4 md:space-y-0">
             <div className="w-full py-3 bg-blue-900/50 border border-blue-700 text-center text-blue-300 font-bold rounded">App Space (Java)</div>
             <ArrowDown className="w-6 h-6 text-slate-500" />
             <div className="w-full py-3 bg-slate-800 border border-slate-600 text-center text-slate-400 rounded">OS Kernel TCP/IP</div>
             <ArrowDown className="w-6 h-6 text-slate-500" />
             <div className="w-full py-3 bg-slate-700 border border-slate-500 text-center text-slate-300 rounded">Standard NIC</div>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-between relative space-y-4 md:space-y-0">
             <div className="w-full py-3 bg-green-900/80 border-2 border-green-500 text-center text-green-300 font-bold rounded shadow-[0_0_15px_rgba(34,197,94,0.4)] z-10">App Space (C++)</div>
             <div className="absolute right-4 top-[80px] h-[100px] w-8 border-r-2 border-b-2 border-t-2 border-emerald-500 rounded-r-xl border-dashed animate-pulse hidden md:block"></div>
             <div className="w-full py-3 bg-slate-800 border border-slate-600 text-center text-slate-600 rounded line-through decoration-red-500">OS Kernel Bypassed</div>
             <div className="w-full py-3 bg-emerald-900/80 border-2 border-emerald-500 text-center text-emerald-300 font-bold rounded shadow-[0_0_15px_rgba(16,185,129,0.4)] z-10">Custom FPGA NIC</div>
          </div>
       </div>
    </div>
  );

  const marketOrderVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-slate-950 overflow-hidden relative">
       <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-8 relative">
          <div className="flex justify-between items-center mb-16">
             <div className="flex flex-col gap-2">
                <span className="text-slate-400 font-bold">Resting Limit Order</span>
                <div className="px-6 py-3 bg-red-900/40 border-2 border-red-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                   <span className="text-red-400 font-mono text-xl">Ask: $100.05</span>
                </div>
             </div>
          </div>
          <div className="absolute top-1/2 left-8 transform -translate-y-1/2 animate-[slideRight_2s_ease-in-out_infinite]">
             <div className="flex items-center gap-3">
                <div className="px-6 py-3 bg-green-900/80 border-2 border-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                   <span className="text-green-300 font-bold">Aggressive Market Buy</span>
                </div>
                <ArrowRight className="w-6 h-6 text-green-400" />
             </div>
          </div>
          <div className="absolute top-1/2 right-12 transform -translate-y-1/2 translate-x-1/2 w-16 h-16 bg-yellow-500/20 rounded-full animate-[ping_2s_ease-in-out_infinite]"></div>
       </div>
       <style>{`
         @keyframes slideRight {
           0% { left: 2rem; opacity: 0; }
           20% { opacity: 1; }
           80% { left: calc(100% - 16rem); opacity: 1; transform: scale(1) translateY(-50%); }
           90% { left: calc(100% - 14rem); opacity: 0; transform: scale(1.2) translateY(-50%); }
           100% { opacity: 0; left: calc(100% - 14rem); }
         }
       `}</style>
    </div>
  );

  const fpgaVisual = (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-slate-950 overflow-hidden relative">
       <div className="flex gap-8 w-full max-w-4xl h-72">
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-between opacity-50 relative">
             <h4 className="text-slate-400 font-bold text-center">Standard CPU (Software)</h4>
             <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-4 bg-blue-500/20 border border-blue-500 rounded"></div>
                <div className="w-8 h-4 bg-blue-500/20 border border-blue-500 rounded"></div>
             </div>
             <ArrowDown className="w-6 h-6 text-slate-600" />
             <div className="w-32 h-24 bg-slate-800 rounded border border-slate-600 flex flex-col items-center justify-center p-2">
                <span className="text-xs text-slate-400 text-center">Interrupt Handler & Kernel Queue</span>
             </div>
             <ArrowDown className="w-6 h-6 text-slate-600" />
             <div className="w-24 h-24 bg-blue-900/50 rounded-full border border-blue-700 flex items-center justify-center">
                <span className="font-bold text-blue-300">CPU</span>
             </div>
          </div>
          <div className="flex-1 bg-slate-900 border border-emerald-900/50 rounded-xl p-6 flex flex-col items-center justify-between relative shadow-[0_0_30px_rgba(16,185,129,0.1)]">
             <h4 className="text-emerald-400 font-bold text-center">FPGA (Hardware Acceleration)</h4>
             <div className="absolute top-16 left-1/2 -translate-x-1/2 w-8 h-32 overflow-hidden flex flex-col items-center">
                <div className="w-8 h-8 bg-emerald-500 rounded animate-[slideDown_0.5s_linear_infinite] shadow-[0_0_15px_#10b981]"></div>
             </div>
             <div className="w-full flex-1"></div>
             <div className="w-48 h-32 bg-emerald-900/40 border-2 border-emerald-500 rounded-lg flex flex-col items-center justify-center p-4 shadow-[0_0_20px_rgba(16,185,129,0.3)] z-10 backdrop-blur-sm">
                <Activity className="w-8 h-8 text-emerald-400 mb-2" />
                <span className="font-bold text-emerald-300 text-center text-sm">Hardcoded Logic Gates<br/>(No OS)</span>
             </div>
          </div>
       </div>
       <style>{`
         @keyframes slideDown {
           0% { transform: translateY(-40px); opacity: 0; }
           50% { opacity: 1; }
           100% { transform: translateY(120px); opacity: 0; }
         }
       `}</style>
    </div>
  );

  let activeVisual;
  switch (labId) {
      case 'IntroductionToHFTReading': activeVisual = kernelBypassVisual; break;
      case 'OrderBookMicrostructureReading': activeVisual = marketOrderVisual; break;
      case 'ExchangeColocationReading': activeVisual = fpgaVisual; break;
      default: activeVisual = kernelBypassVisual;
  }

  return (
    <div className="w-full h-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* Visual Pane */}
      <div className="w-full lg:w-1/2 h-64 lg:h-full border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        <div className="relative z-10 w-full h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Contextual Visual
                </h3>
            </div>
            <div className="flex-1 overflow-hidden">
                {activeVisual}
            </div>
        </div>
      </div>

      {/* Reading Pane */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-white dark:bg-slate-900">
        <div className="p-8 max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4 text-emerald-500 mb-2">
               <BookOpen className="w-8 h-8" />
               <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{chapter?.chapter_title || "Reading Guide"}</h1>
            </div>
            
            <div 
               className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-emerald-500 hover:prose-a:text-emerald-400"
               dangerouslySetInnerHTML={{ __html: chapter?.content || "<p>Loading content...</p>" }}
            />

            {chapter?.glossary_table && (
                <div className="mt-12">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                        <Database className="w-5 h-5 text-emerald-500" />
                        Glossary
                    </h3>
                    <div className="grid gap-4">
                        {chapter.glossary_table.map((item: any, i: number) => (
                            <div key={i} className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2">{item.term}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.definition}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Also import Database at the top
