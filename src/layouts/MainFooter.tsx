import React from "react";
import { ChevronRight, Sun, Moon } from "lucide-react";
import { ContactForm } from "../shared/components/ContactForm";
import { Logo } from "../shared/components/Logo";

interface MainFooterProps {
  setActiveTab: (tab: any, subTab?: string) => void;
  activeCodeCategory: string;
  setActiveCodeCategory: (category: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export const MainFooter: React.FC<MainFooterProps> = ({
  setActiveTab,
  activeCodeCategory,
  setActiveCodeCategory,
  isDarkMode,
  setIsDarkMode,
}) => {
  return (
    <footer className="border-t transition-colors duration-300 mt-auto border-zinc-800 bg-zinc-900 relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.25fr_1.15fr_0.85fr_0.75fr] gap-8">
        <div className="space-y-4">
          <a href="/" aria-label="Return to GPTX.VIP home" className="flex w-fit items-center gap-2.5 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500">
            <Logo size="sm" variant="default" wordmarkClassName="text-zinc-100" />
          </a>
          <p className="text-xs font-mono leading-relaxed max-w-sm text-zinc-400">
            Advanced analytical environment and visual documentation engine for algorithmic trading concepts and execution simulations.
          </p>
          <a href="mailto:aliyan@gptx.vip" className="block w-fit text-xs font-mono text-zinc-300 hover:text-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
            Contact: aliyan@gptx.vip
          </a>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Send a message</h4>
          <ContactForm
            variant="compact"
            tone="dark"
            accent="emerald"
            title="Questions about a tool or lesson?"
            description="This form reaches the site owner directly."
            subject="Contact from Finhub workspace"
            className="[&_input]:border-zinc-700 [&_input]:bg-zinc-950"
          />
          <a href="/contact" className="inline-block text-xs font-mono text-zinc-400 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
            Or open the full contact page
          </a>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Lab Tools</h4>
          <ul className="space-y-2 text-sm font-medium font-sans text-zinc-400">
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("trading-tools" as any, "leverage-view-v3");
                }}
                className="flex items-center gap-2 group text-left font-sans bg-transparent border-none cursor-pointer transition-colors hover:text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                <ChevronRight className="w-3 h-3 group-hover:text-emerald-500 transition-colors shrink-0 text-zinc-700" />
                Leverage Trading Version 3
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("trading-tools" as any, "");
                }}
                className="flex items-center gap-2 group text-left font-sans bg-transparent border-none cursor-pointer transition-colors hover:text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                <ChevronRight className="w-3 h-3 group-hover:text-emerald-500 transition-colors shrink-0 text-zinc-700" />
                Trading Simulator Hub
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => {
                  setActiveTab("trading-tools", "");
                }}
                className="flex items-center gap-2 group text-left font-sans bg-transparent border-none cursor-pointer transition-colors hover:text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                 <ChevronRight className="w-3 h-3 group-hover:text-emerald-500 transition-colors shrink-0 text-zinc-700" />
                 Technical Indicators
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => {
                  if (activeCodeCategory === "search") {
                    setActiveCodeCategory("general");
                  } else {
                    setActiveTab("code-concepts");
                  }
                }}
                className="flex items-center gap-2 group text-left font-sans bg-transparent border-none cursor-pointer transition-colors hover:text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                 <ChevronRight className="w-3 h-3 group-hover:text-emerald-500 transition-colors shrink-0 text-zinc-700" />
                 Code Concepts
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("profile");
                }}
                className="flex items-center gap-2 group text-left font-sans bg-transparent border-none cursor-pointer transition-colors hover:text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                <ChevronRight className="w-3 h-3 group-hover:text-emerald-500 transition-colors shrink-0 text-zinc-700" />
                Owner Profile
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("dev-labs-workspace");
                }}
                className="flex items-center gap-2 group text-left font-sans bg-transparent border-none cursor-pointer transition-colors hover:text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                <ChevronRight className="w-3 h-3 group-hover:text-emerald-500 transition-colors shrink-0 text-zinc-700" />
                DevLushArea
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("roadmap-workspace");
                }}
                className="flex items-center gap-2 group text-left font-sans bg-transparent border-none cursor-pointer transition-colors hover:text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                <ChevronRight className="w-3 h-3 group-hover:text-emerald-500 transition-colors shrink-0 text-zinc-700" />
                Roadmap
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-100">Environment</h4>
          <ul className="space-y-2 text-sm font-medium text-zinc-400">
            <li>
              <button type="button" onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center gap-2 group text-left bg-transparent border-none cursor-pointer transition-colors hover:text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
                {isDarkMode ? <Sun className="w-3 h-3 group-hover:text-emerald-500 text-zinc-700" /> : <Moon className="w-3 h-3 group-hover:text-emerald-500 text-zinc-700" />}
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
      <div className="border-t py-6 px-6 relative overflow-hidden border-zinc-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <p className="text-[10px] font-mono uppercase tracking-widest text-center relative z-10 text-zinc-500">
          © 2026 GPTX.VIP INC. // DOCUMENTATION ENGINE // V1.0.4 // LOCAL RUNTIME
        </p>
      </div>
    </footer>
  );
};
