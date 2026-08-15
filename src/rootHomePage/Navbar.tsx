import React, { useState, useEffect } from 'react';
import { BarChart3, Sun, Moon, Zap, Bot, BookOpen, Layers, ShieldCheck, Sparkles, Sliders, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onNavigateFinhub: () => void;
  onNavigateDevLush: () => void;
  onNavigateBlogs: () => void;
  onBookDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateFinhub,
  onNavigateDevLush,
  onNavigateBlogs,
  onBookDemo,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <header className={`z-50 transition-all duration-200 sticky top-0 w-full flex-shrink-0 ${
      scrolled 
        ? 'border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-sm' 
        : 'border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md'
    }`}>
      {/* Main Top Navigation Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => scrollToSection('top')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group text-left focus:outline-none"
            aria-label="GPTX.VIP Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-emerald-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-all duration-200">
              <BarChart3 className="text-white dark:text-zinc-950 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-sans font-black tracking-tight text-base sm:text-lg uppercase text-zinc-900 dark:text-white leading-none">
                  GPTX<span className="text-cyan-500">.VIP</span>
                </span>
                <span className="hidden xs:inline-block px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  v4.0
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider leading-none mt-0.5 sm:mt-1 truncate max-w-[130px] sm:max-w-none">
                AgentOS &amp; Finhub
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Static Organic Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
          
          {/* Primary Hub: Finhub */}
          <button
            onClick={onNavigateFinhub}
            className="group px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-150 flex items-center gap-1.5 cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 shadow-sm"
            title="Launch Finhub Equity Valuation & Accounting Suite"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Finhub Lab</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono font-bold">
              VALUATION
            </span>
          </button>

          {/* Primary Hub: devLush */}
          <button
            onClick={onNavigateDevLush}
            className="group px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-150 flex items-center gap-1.5 cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60 shadow-sm"
            title="Launch devLush Autonomous AgentOS Workspace"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-500" />
            <span>devLush Swarms</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-mono font-bold">
              AGENTOS
            </span>
          </button>

          {/* Primary Hub: Blogs */}
          <button
            onClick={onNavigateBlogs}
            className="group px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-150 flex items-center gap-1.5 cursor-pointer bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 hover:border-purple-500/60 shadow-sm"
            title="Explore Research Papers, Deep Learning & Security Blogs"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-500" />
            <span>Blogs &amp; Papers</span>
          </button>

          {/* Divider */}
          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-800 mx-1" />

          {/* Static Section Links */}
          <div className="flex items-center gap-0.5 text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
            <button
              onClick={() => scrollToSection('fleet-catalog')}
              className="px-2.5 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer"
            >
              Fleet
            </button>
            <button
              onClick={() => scrollToSection('vertical-solutions')}
              className="px-2.5 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer"
            >
              Verticals
            </button>
            <button
              onClick={() => scrollToSection('block-gallery')}
              className="px-2.5 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer"
            >
              Visualizers
            </button>
            <button
              onClick={() => scrollToSection('roi-calculator')}
              className="px-2.5 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer"
            >
              ROI Modeler
            </button>
            <button
              onClick={() => scrollToSection('governance-framework')}
              className="px-2.5 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer"
            >
              Governance
            </button>
          </div>
        </nav>

        {/* Right Section: Priority Action & Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Priority Book Demo CTA */}
          <button
            onClick={onBookDemo}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-extrabold text-xs shadow-md shadow-cyan-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 fill-zinc-950" />
            <span>Deploy Swarm</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>
        </div>
      </div>

      {/* Sub Row: Organically Visible Static Navigation Bar on Mobile/Tablet */}
      <div className="lg:hidden border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/90 dark:bg-zinc-900/90 px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs font-semibold select-none touch-pan-x">
        <button
          onClick={onNavigateFinhub}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BarChart3 className="w-3 h-3 text-emerald-500" />
          <span>Finhub Lab</span>
        </button>

        <button
          onClick={onNavigateDevLush}
          className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Bot className="w-3 h-3 text-cyan-500" />
          <span>devLush Swarms</span>
        </button>

        <button
          onClick={onNavigateBlogs}
          className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookOpen className="w-3 h-3 text-purple-500" />
          <span>Blogs</span>
        </button>

        <div className="h-3.5 w-px bg-zinc-300 dark:bg-zinc-700 shrink-0 mx-0.5" />

        <button
          onClick={() => scrollToSection('fleet-catalog')}
          className="px-2 py-1 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          Fleet
        </button>

        <button
          onClick={() => scrollToSection('vertical-solutions')}
          className="px-2 py-1 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          Verticals
        </button>

        <button
          onClick={() => scrollToSection('block-gallery')}
          className="px-2 py-1 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          Visualizers
        </button>

        <button
          onClick={() => scrollToSection('roi-calculator')}
          className="px-2 py-1 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          ROI Modeler
        </button>

        <button
          onClick={() => scrollToSection('governance-framework')}
          className="px-2 py-1 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          ADAPT Security
        </button>

        <button
          onClick={() => scrollToSection('faq')}
          className="px-2 py-1 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          FAQ
        </button>
      </div>
    </header>
  );
};

export default Navbar;
