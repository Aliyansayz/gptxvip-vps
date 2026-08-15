import React, { useState, useEffect } from 'react';
import { Home, BarChart3, Sun, Moon, Zap, Bot, BookOpen, Layers, ArrowLeft } from 'lucide-react';

interface LandingNavbarProps {
  onExploreCatalog?: () => void;
  onNavigateView?: (view: string) => void;
  onExit?: () => void;
}

export const Navbar: React.FC<LandingNavbarProps> = ({ onExploreCatalog, onNavigateView, onExit }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
      const observer = new MutationObserver(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
      });
      observer.observe(document.documentElement, { attributes: true });
      return () => observer.disconnect();
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      window.location.assign('/');
    }
  };

  return (
    <header className="z-50 transition-all duration-200 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl sticky top-0 w-full flex-shrink-0 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleExit}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            aria-label="Return to Main Hub"
            title="Return to Main Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.assign('/')}>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-tr from-cyan-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)]">
              <Bot className="text-white dark:text-zinc-950 w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black tracking-tight text-sm sm:text-base uppercase text-zinc-900 dark:text-white leading-none">
                devLush<span className="text-cyan-500">.OS</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider leading-none mt-0.5">
                Agent Labs
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right: Static Organic Navigation Buttons on Desktop */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-zinc-100/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
          <button
            onClick={() => scrollToSection('fleet-catalog')}
            className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer"
          >
            Fleet Catalog
          </button>

          <button
            onClick={() => scrollToSection('vertical-solutions')}
            className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer"
          >
            Verticals
          </button>

          <button
            onClick={() => scrollToSection('roi-calculator')}
            className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer"
          >
            ROI Modeler
          </button>

          <button
            onClick={() => scrollToSection('governance-framework')}
            className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer"
          >
            Governance
          </button>

          <button
            onClick={() => window.location.assign('/blogs')}
            className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-all cursor-pointer"
          >
            Blogs
          </button>

          <button
            onClick={() => window.location.assign('/finhub')}
            className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
          >
            Finhub Lab
          </button>
        </nav>

        {/* Right Section: Theme Toggle & Exit Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          <button
            onClick={handleExit}
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all bg-red-500/10 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white border border-red-500/30 rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0"
            title="Exit to Main Hub"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Sub Row: Mobile Static Organic Bar */}
      <div className="md:hidden border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/90 dark:bg-zinc-900/90 px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs font-semibold select-none touch-pan-x">
        <button
          onClick={() => scrollToSection('fleet-catalog')}
          className="px-2.5 py-1 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          Fleet Catalog
        </button>
        <button
          onClick={() => scrollToSection('vertical-solutions')}
          className="px-2.5 py-1 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          Verticals
        </button>
        <button
          onClick={() => scrollToSection('roi-calculator')}
          className="px-2.5 py-1 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          ROI Modeler
        </button>
        <button
          onClick={() => scrollToSection('governance-framework')}
          className="px-2.5 py-1 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          Governance
        </button>
        <button
          onClick={() => window.location.assign('/blogs')}
          className="px-2.5 py-1 rounded-lg text-purple-600 dark:text-purple-400 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Blogs
        </button>
        <button
          onClick={() => window.location.assign('/finhub')}
          className="px-2.5 py-1 rounded-lg text-emerald-600 dark:text-emerald-400 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Finhub
        </button>
        <button
          onClick={handleExit}
          className="px-2.5 py-1 rounded-lg text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/25 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer font-bold"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
