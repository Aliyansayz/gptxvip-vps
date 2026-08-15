import React, { useState, useEffect } from 'react';
import { Home, BarChart3, Sun, Moon, Zap, Bot, BookOpen, Layers, ArrowLeft } from 'lucide-react';

interface LandingNavbarProps {
  onExploreCatalog?: () => void;
  onNavigateView?: (view: string) => void;
}

export const Navbar: React.FC<LandingNavbarProps> = ({ onExploreCatalog, onNavigateView }) => {
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

  return (
    <header className="z-50 transition-all duration-200 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl sticky top-0 w-full flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.assign('/')}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Home"
            title="Return to Main Hub"
          >
            <Home className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)]">
              <Bot className="text-white dark:text-zinc-950 w-4.5 h-4.5" />
            </div>
            <span className="font-sans font-black tracking-tight text-lg uppercase text-zinc-900 dark:text-white">
              devLush<span className="text-cyan-500">.OS</span>
            </span>
          </div>
        </div>

        {/* Center/Right: Exposed Navigation Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 p-1 bg-zinc-100/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
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
              onClick={() => window.location.assign('/')}
              className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
            >
              Finhub Lab
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
