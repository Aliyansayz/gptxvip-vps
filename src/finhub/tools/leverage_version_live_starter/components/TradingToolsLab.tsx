import React, { useState } from "react";
import { TradingPanelDataSettings } from "./simulator/TradingPanelDataSettings";
import { TradingPanelHFTMode } from "./simulator/TradingPanelHFTMode";
import { LabHeader } from "./lab/LabHeader";
import { DeveloperConsoleLogPanel } from "./simulator/DeveloperConsoleLogPanel";

export const TradingToolsLab: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [panelTab, setPanelTab] = useState<'data' | 'hftMode'>('data');

  return (
    <>
      <div className={`flex flex-col gap-6 w-full ${isExpanded ? 'fixed inset-0 z-50 p-6 md:p-12 pb-24 bg-zinc-950 text-zinc-50 overflow-y-auto' : 'h-full p-6 bg-zinc-900 border border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-xl overflow-hidden backdrop-blur-sm z-20 relative text-zinc-50'} font-mono transition-all duration-300`}>
        <div className={isExpanded ? 'relative z-10 w-full max-w-[1800px] mx-auto min-h-full flex flex-col' : 'flex-1 flex flex-col min-h-0 w-full'}>
          <LabHeader isExpanded={isExpanded} onToggleExpand={() => setIsExpanded(!isExpanded)} />
          
          <div className="flex border-b border-zinc-800/50 flex-wrap overflow-hidden items-center">
             <button onClick={() => setPanelTab('data')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'data' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Data Layer Config</button>
             <button onClick={() => setPanelTab('hftMode')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'hftMode' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}>HFT Mode</button>
          </div>
          
          <div className="w-full flex-1 flex flex-col pt-4 pb-6 min-h-0 overflow-y-auto">
            {panelTab === 'data' && <TradingPanelDataSettings />}
            {panelTab === 'hftMode' && <TradingPanelHFTMode />}
          </div>
        </div>
      </div>
      <DeveloperConsoleLogPanel />
    </>
  );
};
