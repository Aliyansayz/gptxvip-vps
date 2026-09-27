import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, Bot, ChevronDown, FileText, FlaskConical, Layers, Lock, Menu, Moon, Search, Settings2, ShieldCheck, Sun, Unlock, Users, X, Zap } from 'lucide-react';

type Theme = 'light' | 'dark';
type View =
  | 'landing'
  | 'devlush-search'
  | 'reading'
  | 'articles'
  | 'blogs'
  | 'favorites'
  | 'topic-theory'
  | 'devlush'
  | 'agentic-roles'
  | 'agent-workspace';

interface NavbarProps {
  isAppLocked: boolean;
  onToggleLockMode: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  studyEnergy: number;
  isInfiniteEnergy: boolean;
  onToggleInfiniteEnergy: () => void;
  energyLockoutTime: number;
  currentView: View;
  onViewChange: (view: View) => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  showAiAssistant: boolean;
  onToggleAiAssistant: () => void;
  onExit?: () => void;
  onNavigateFinhub?: () => void;
}

const formatTime = (ms: number) => {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const primaryItems: Array<{ id: View; label: string; icon: React.ReactNode }> = [
  { id: 'landing', label: 'Overview', icon: <FlaskConical className="h-3.5 w-3.5" /> },
  { id: 'devlush', label: 'Topics', icon: <Layers className="h-3.5 w-3.5" /> },
  { id: 'topic-theory', label: 'Theory', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  { id: 'agent-workspace', label: 'Workspace', icon: <Bot className="h-3.5 w-3.5" /> },
];

export const Navbar: React.FC<NavbarProps> = ({
  isAppLocked,
  onToggleLockMode,
  theme,
  onToggleTheme,
  studyEnergy,
  isInfiniteEnergy,
  onToggleInfiniteEnergy,
  energyLockoutTime,
  currentView,
  onViewChange,
  focusMode,
  onToggleFocusMode,
  showAiAssistant,
  onToggleAiAssistant,
  onExit,
  onNavigateFinhub,
}) => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const toolsTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const lockoutRemaining = Math.max(energyLockoutTime - Date.now(), 0);
  const isDark = theme === 'dark';

  useEffect(() => {
    const closeTools = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) setToolsOpen(false);
    };
    document.addEventListener('mousedown', closeTools);
    return () => document.removeEventListener('mousedown', closeTools);
  }, []);

  useEffect(() => {
    if (!toolsOpen && !mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setToolsOpen(false);
      setMobileOpen(false);
      (mobileOpen ? mobileTriggerRef.current : toolsTriggerRef.current)?.focus();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [mobileOpen, toolsOpen]);

  const changeView = (view: View) => {
    onViewChange(view);
    setToolsOpen(false);
    setMobileOpen(false);
  };

  const navButton = (item: (typeof primaryItems)[number]) => (
    <button type="button" key={item.id} onClick={() => changeView(item.id)} className={`flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${currentView === item.id ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'}`} aria-current={currentView === item.id ? 'page' : undefined}>
      {item.icon}{item.label}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button type="button" onClick={() => currentView === 'landing' ? (onExit || (() => window.location.assign('/')))() : changeView('landing')} className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500" aria-label={currentView === 'landing' ? (onExit ? 'Return to Agent catalog' : 'Return to GPTX.VIP') : 'Return to Agent Labs overview'}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => changeView('landing')} className="flex min-h-11 min-w-0 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white dark:text-zinc-950"><Bot className="h-4 w-4" /></span>
            <span className="truncate text-sm font-black tracking-tight text-zinc-900 dark:text-white">Agent Labs</span>
          </button>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Agent Labs navigation">
          {primaryItems.map(navButton)}
        </nav>

        <div className="flex items-center gap-1">
          <button type="button" onClick={() => changeView('devlush-search')} className={`flex h-11 w-11 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${currentView === 'devlush-search' ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white'}`} aria-label="Search Agent Labs topics" title="Search topics" aria-current={currentView === 'devlush-search' ? 'page' : undefined}><Search className="h-4 w-4" /></button>
          <button type="button" onClick={onToggleTheme} className="hidden h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-zinc-900 dark:hover:text-white sm:flex" aria-label={isDark ? 'Use light theme' : 'Use dark theme'}>{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>

          <div ref={toolsRef} className="relative">
            <button ref={toolsTriggerRef} type="button" onClick={() => setToolsOpen((open) => !open)} className={`flex h-11 items-center gap-1 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-zinc-900 dark:hover:text-white ${toolsOpen ? 'bg-zinc-100 dark:bg-zinc-900' : ''}`} aria-expanded={toolsOpen} aria-controls="agent-labs-tools" aria-label="Open Agent Labs tools"><Settings2 className="h-4 w-4" /><ChevronDown className="hidden h-3 w-3 sm:block" /></button>
            {toolsOpen && (
              <div id="agent-labs-tools" className="absolute right-0 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-2 text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" role="group" aria-label="Agent Labs contextual tools">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">Contextual tools</div>
                <button type="button" onClick={() => changeView('reading')} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-zinc-900"><BookOpen className="h-4 w-4 text-cyan-600" /> Reading</button>
                <button type="button" onClick={() => changeView('articles')} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-zinc-900"><FileText className="h-4 w-4 text-cyan-600" /> Articles</button>
                <button type="button" onClick={() => changeView('agentic-roles')} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-zinc-900"><Users className="h-4 w-4 text-cyan-600" /> Agent roles</button>
                <button type="button" onClick={() => changeView('favorites')} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-zinc-900"><ShieldCheck className="h-4 w-4 text-cyan-600" /> Favorites</button>
                <div className="my-2 border-t border-zinc-100 dark:border-zinc-900" />
                <button type="button" onClick={onToggleFocusMode} aria-pressed={focusMode} className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-zinc-900"><span className="flex items-center gap-2"><FlaskConical className="h-4 w-4" /> Focus mode</span><span className="text-xs text-zinc-400">{focusMode ? 'On' : 'Off'}</span></button>
                <button type="button" onClick={onToggleAiAssistant} aria-pressed={showAiAssistant} className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-zinc-900"><span className="flex items-center gap-2"><Bot className="h-4 w-4" /> AI helper</span><span className="text-xs text-zinc-400">{showAiAssistant ? 'On' : 'Off'}</span></button>
                <button type="button" onClick={onToggleLockMode} aria-pressed={isAppLocked} className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-zinc-900"><span className="flex items-center gap-2">{isAppLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />} Interaction lock</span><span className="text-xs text-zinc-400">{isAppLocked ? 'On' : 'Off'}</span></button>
                <button type="button" onClick={onToggleInfiniteEnergy} aria-pressed={isInfiniteEnergy} className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-zinc-900"><span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Study energy</span><span className="text-xs text-zinc-400">{isInfiniteEnergy ? '∞' : lockoutRemaining > 0 ? formatTime(lockoutRemaining) : `${studyEnergy}/15`}</span></button>
                <div className="my-2 border-t border-zinc-100 dark:border-zinc-900" />
                <button type="button" onClick={() => { setToolsOpen(false); (onNavigateFinhub || (() => window.location.assign('/finhub')))(); }} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-emerald-300 dark:hover:bg-emerald-950/30"><ArrowLeft className="h-4 w-4 rotate-180" /> Open Finhub</button>
                <button type="button" onClick={() => { setToolsOpen(false); window.location.assign('/blogs'); }} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-violet-700 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-violet-300 dark:hover:bg-violet-950/30"><BookOpen className="h-4 w-4" /> Open Notes</button>
              </div>
            )}
          </div>

          {onExit && <button type="button" onClick={onExit} className="hidden min-h-11 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white sm:block">Exit</button>}
          <button ref={mobileTriggerRef} type="button" onClick={() => setMobileOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:bg-zinc-900 dark:hover:text-white lg:hidden" aria-expanded={mobileOpen} aria-controls="agent-labs-mobile-nav" aria-label={mobileOpen ? 'Close Agent Labs menu' : 'Open Agent Labs menu'}>{mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        </div>
      </div>

      {mobileOpen && <nav id="agent-labs-mobile-nav" className="border-t border-zinc-200 bg-white px-3 py-3 dark:border-zinc-800 dark:bg-zinc-950 lg:hidden" aria-label="Mobile Agent Labs navigation"><div className="mx-auto flex max-w-7xl flex-col gap-1">{primaryItems.map(navButton)}<button type="button" onClick={() => changeView('reading')} className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-600 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-zinc-400 dark:hover:bg-zinc-900"><BookOpen className="h-3.5 w-3.5" /> Reading and articles</button><button type="button" onClick={() => { setMobileOpen(false); (onNavigateFinhub || (() => window.location.assign('/finhub')))(); }} className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-emerald-700 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-emerald-300 dark:hover:bg-emerald-950/30">Finhub</button>{onExit && <button type="button" onClick={onExit} className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-600 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-zinc-400 dark:hover:bg-zinc-900"><ArrowLeft className="h-3.5 w-3.5" /> Exit</button>}</div></nav>}
    </header>
  );
};

export default Navbar;
