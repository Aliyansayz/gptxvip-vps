import React, { useState, useEffect } from 'react';
import { BarChart3, Sun, Moon, Zap, Bot, BookOpen, Menu, X, ArrowUpRight, ShieldCheck, Layers, Sparkles } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      setScrolled(window.scrollY > 20);
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
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className={`z-50 transition-all duration-200 sticky top-0 w-full flex-shrink-0 ${
      scrolled 
        ? 'border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-sm' 
        : 'border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => scrollToSection('top')}
            className="flex items-center gap-3 cursor-pointer group text-left focus:outline-none"
            aria-label="GPTX.VIP Home"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-emerald-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-all duration-200">
              <BarChart3 className="text-white dark:text-zinc-950 w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-black tracking-tight text-lg sm:text-xl uppercase text-zinc-900 dark:text-white leading-none">
                  GPTX<span className="text-cyan-500">.VIP</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  v4.0
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider leading-none mt-1">
                AgentOS &amp; Finhub Lab
              </span>
            </div>
          </button>
        </div>

        {/* Center: EXPOSED Primary Navigation Buttons & Section Links */}
        <div className="hidden xl:flex items-center gap-2">
          
          {/* Primary Action Button 1: Finhub */}
          <button
            onClick={onNavigateFinhub}
            className="group relative px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 shadow-sm"
            title="Launch Finhub Equity Valuation & Accounting Suite"
          >
            <BarChart3 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span>Finhub Lab</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono font-bold">
              VALUATION
            </span>
          </button>

          {/* Primary Action Button 2: devLush */}
          <button
            onClick={onNavigateDevLush}
            className="group relative px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60 shadow-sm"
            title="Launch devLush Autonomous AgentOS Workspace"
          >
            <Bot className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
            <span>devLush Swarms</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-mono font-bold">
              AGENTOS
            </span>
          </button>

          {/* Primary Action Button 3: Blogs */}
          <button
            onClick={onNavigateBlogs}
            className="group relative px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 hover:border-purple-500/60 shadow-sm"
            title="Explore Research Papers, Deep Learning & Security Blogs"
          >
            <BookOpen className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
            <span>Blogs &amp; Papers</span>
          </button>

          {/* Vertical Divider */}
          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 mx-1.5" />

          {/* Exposed Section Jump Links */}
          <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            <button
              onClick={() => scrollToSection('fleet-catalog')}
              className="px-2.5 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              Fleet Catalog
            </button>
            <button
              onClick={() => scrollToSection('vertical-solutions')}
              className="px-2.5 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              Verticals
            </button>
            <button
              onClick={() => scrollToSection('block-gallery')}
              className="px-2.5 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              Visualizers
            </button>
            <button
              onClick={() => scrollToSection('roi-calculator')}
              className="px-2.5 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              ROI Modeler
            </button>
            <button
              onClick={() => scrollToSection('governance-framework')}
              className="px-2.5 py-1.5 rounded-lg hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              Governance
            </button>
          </div>
        </div>

        {/* Medium-screen Compact Exposed Hub Buttons (lg to xl) */}
        <div className="hidden lg:flex xl:hidden items-center gap-2">
          <button
            onClick={onNavigateFinhub}
            className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Finhub</span>
          </button>
          <button
            onClick={onNavigateDevLush}
            className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-500" />
            <span>devLush</span>
          </button>
          <button
            onClick={onNavigateBlogs}
            className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-500" />
            <span>Blogs</span>
          </button>
        </div>

        {/* Right Section: Conversion CTA & Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* Priority Book Demo CTA */}
          <button
            onClick={onBookDemo}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-extrabold text-xs shadow-md shadow-cyan-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-3.5 h-3.5 fill-zinc-950" />
            <span>Deploy Swarm</span>
          </button>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden cursor-pointer"
            aria-label="Toggle Mobile Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-5 space-y-4 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 px-1">
            Primary Hubs
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigateFinhub(); }}
              className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer hover:bg-emerald-500/20 transition-all"
            >
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              <span>Finhub Lab</span>
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigateDevLush(); }}
              className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer hover:bg-cyan-500/20 transition-all"
            >
              <Bot className="w-5 h-5 text-cyan-500" />
              <span>devLush</span>
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigateBlogs(); }}
              className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer hover:bg-purple-500/20 transition-all"
            >
              <BookOpen className="w-5 h-5 text-purple-500" />
              <span>Blogs</span>
            </button>
          </div>

          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 px-1 pt-2">
            Page Sections
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <button 
              onClick={() => scrollToSection('fleet-catalog')} 
              className="text-left px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:text-cyan-500 cursor-pointer"
            >
              Fleet Catalog
            </button>
            <button 
              onClick={() => scrollToSection('vertical-solutions')} 
              className="text-left px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:text-cyan-500 cursor-pointer"
            >
              Verticals
            </button>
            <button 
              onClick={() => scrollToSection('block-gallery')} 
              className="text-left px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:text-cyan-500 cursor-pointer"
            >
              Visualizers
            </button>
            <button 
              onClick={() => scrollToSection('roi-calculator')} 
              className="text-left px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:text-cyan-500 cursor-pointer"
            >
              ROI Modeler
            </button>
            <button 
              onClick={() => scrollToSection('governance-framework')} 
              className="text-left px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:text-cyan-500 cursor-pointer"
            >
              ADAPT Security
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="text-left px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:text-cyan-500 cursor-pointer"
            >
              Architecture FAQ
            </button>
          </div>

          <button
            onClick={() => { setIsMobileMenuOpen(false); onBookDemo(); }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Zap className="w-4 h-4 fill-zinc-950" />
            <span>Deploy Enterprise Swarm Sandbox</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
