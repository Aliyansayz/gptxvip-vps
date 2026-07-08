import React from "react";
import { BarChart3, ChevronRight, Sun, Moon } from "lucide-react";

interface MainFooterProps {
  setActiveTab: (tab: any) => void;
  setActiveSubTab: (subTab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export const MainFooter: React.FC<MainFooterProps> = ({
  setActiveTab,
  setActiveSubTab,
  isDarkMode,
  setIsDarkMode,
}) => {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
              <BarChart3 className="text-white dark:text-black w-3 h-3" />
            </div>
            <span className="font-display font-black tracking-tighter text-lg uppercase">
              GPTX.VIP
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono leading-relaxed max-w-sm">
            Advanced analytical environment and visual documentation engine for algorithmic trading concepts and execution simulations.
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 font-mono">
            Contact: aliyan@gptx.vip
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Lab Tools</h4>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium font-sans">
            <li>
              <button 
                onClick={() => {
                  setActiveTab("trading-tools" as any);
                  setActiveSubTab("leverage-view-v3");
                }}
                className="hover:text-emerald-500 transition-colors flex items-center gap-2 group text-left font-sans bg-transparent border-none cursor-pointer"
              >
                <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500 transition-colors shrink-0" />
                Leverage Trading Version 3
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setActiveTab("trading-tools" as any);
                  setActiveSubTab("");
                }}
                className="hover:text-emerald-500 transition-colors flex items-center gap-2 group text-left font-sans bg-transparent border-none cursor-pointer"
              >
                <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500 transition-colors shrink-0" />
                Trading Simulator Hub
              </button>
            </li>
            <li>
              <button 
                 onClick={() => {
                  setActiveTab("trading-tools");
                  setActiveSubTab("");
                }}
                className="hover:text-emerald-500 transition-colors flex items-center gap-2 group"
              >
                 <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                 Technical Indicators
              </button>
            </li>
            <li>
              <button 
                 onClick={() => {
                  setActiveTab("code-concepts");
                  setActiveSubTab("");
                }}
                className="hover:text-emerald-500 transition-colors flex items-center gap-2 group"
              >
                 <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                 Code Concepts
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("profile");
                  setActiveSubTab("");
                }}
                className="hover:text-emerald-500 transition-colors flex items-center gap-2 group"
              >
                <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                Owner Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("dev-labs-workspace");
                  setActiveSubTab("");
                }}
                className="hover:text-emerald-500 transition-colors flex items-center gap-2 group"
              >
                <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                DevLushArea
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("map");
                  setActiveSubTab("doc-map");
                }}
                className="hover:text-emerald-500 transition-colors flex items-center gap-2 group"
              >
                <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                Roadmap
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Environment</h4>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
            <li>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="hover:text-emerald-500 transition-colors flex items-center gap-2 group">
                {isDarkMode ? <Sun className="w-3 h-3 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500" /> : <Moon className="w-3 h-3 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </li>
            <li className="flex items-center gap-2 text-zinc-400">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               System Online
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-200 dark:border-zinc-800 py-6 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-widest text-center relative z-10">
          © 2026 GPTX.VIP INC. // DOCUMENTATION ENGINE // V1.0.4 // LOCAL RUNTIME
        </p>
      </div>
    </footer>
  );
};
