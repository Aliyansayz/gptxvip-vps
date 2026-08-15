import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  BarChart3,
  Sun,
  Moon,
  Search,
  Settings,
  Lock,
  Unlock,
  Zap,
  Infinity,
  MessageSquare as ChatIcon,
  Cpu,
  Bot,
  Terminal,
  BookOpen,
  FileText,
  Bookmark,
  Layers,
  ArrowLeft,
  ShieldCheck,
  Check
} from 'lucide-react';
import { StarIcon } from './icons';

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
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

interface ToggleSwitchProps {
  label: string;
  isOn: boolean;
  onToggle: () => void;
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  isOn,
  onToggle,
  onIcon,
  offIcon,
}) => (
  <div className="flex items-center justify-between w-full py-1.5">
    <label
      htmlFor={`toggle-${label}`}
      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 cursor-pointer"
    >
      {isOn ? onIcon : offIcon}
      {label}
    </label>
    <button
      id={`toggle-${label}`}
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        isOn ? 'bg-cyan-500' : 'bg-zinc-300 dark:bg-zinc-700'
      }`}
      role="switch"
      aria-checked={isOn}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isOn ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

const EnergyBeam: React.FC<{
  studyEnergy: number;
  isInfinite: boolean;
  lockoutRemaining: number;
}> = ({ studyEnergy, isInfinite, lockoutRemaining }) => {
  const maxEnergy = 15;
  const percentage = isInfinite ? 100 : (studyEnergy / maxEnergy) * 100;
  const isLocked = !isInfinite && studyEnergy <= 0 && lockoutRemaining > 0;

  return (
    <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
      <div className="flex justify-between items-center text-xs text-zinc-600 dark:text-zinc-400">
        <span className="font-bold text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Study Energy
        </span>
        {isLocked ? (
          <span className="font-mono text-red-500 font-bold text-xs">
            {formatTime(lockoutRemaining)}
          </span>
        ) : isInfinite ? (
          <span className="flex items-center gap-1 text-cyan-500 text-xs font-mono font-bold">
            <Infinity className="w-3.5 h-3.5" /> Inf
          </span>
        ) : (
          <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
            {studyEnergy} / {maxEnergy}
          </span>
        )}
      </div>
      <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isLocked
              ? 'bg-red-500'
              : isInfinite
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 animate-pulse'
              : 'bg-emerald-500'
          }`}
          style={{ width: isLocked ? '100%' : `${percentage}%` }}
        />
      </div>
    </div>
  );
};

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(
    energyLockoutTime - Date.now()
  );
  const settingsRef = useRef<HTMLDivElement>(null);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = energyLockoutTime - Date.now();
      setLockoutRemaining(remaining > 0 ? remaining : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [energyLockoutTime]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    {
      id: 'landing' as View,
      label: 'Overview',
      icon: <Home className="w-3.5 h-3.5" />,
      isActive: currentView === 'landing',
      onClick: () => onViewChange('landing'),
    },
    {
      id: 'agent-workspace' as View,
      label: 'Workspace',
      icon: <Terminal className="w-3.5 h-3.5" />,
      isActive: currentView === 'agent-workspace',
      onClick: () => onViewChange('agent-workspace'),
    },
    {
      id: 'agentic-roles' as View,
      label: 'Agentic Roles',
      icon: <Bot className="w-3.5 h-3.5" />,
      isActive: currentView === 'agentic-roles',
      onClick: () => onViewChange('agentic-roles'),
    },
    {
      id: 'devlush' as View,
      label: 'Topics',
      icon: <Layers className="w-3.5 h-3.5" />,
      isActive: currentView === 'devlush',
      onClick: () => onViewChange('devlush'),
    },
    {
      id: 'topic-theory' as View,
      label: 'Theory',
      icon: <Cpu className="w-3.5 h-3.5" />,
      isActive: currentView === 'topic-theory',
      onClick: () => onViewChange('topic-theory'),
    },
    {
      id: 'reading' as View,
      label: 'Reading',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      isActive: currentView === 'reading',
      onClick: () => onViewChange('reading'),
    },
    {
      id: 'articles' as View,
      label: 'Articles',
      icon: <FileText className="w-3.5 h-3.5" />,
      isActive: currentView === 'articles',
      onClick: () => onViewChange('articles'),
    },
  ];

  return (
    <header className="z-50 transition-all duration-200 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl sticky top-0 w-full flex-shrink-0">
      <div className="max-w-full mx-auto px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Section: Back/Home, Logo Badge, Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              if (currentView === 'landing') {
                if (onExit) {
                  onExit();
                } else {
                  window.location.assign('/');
                }
              } else {
                onViewChange('landing');
              }
            }}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            aria-label="Return to Landing / Main Hub"
            title="Return to Main Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onViewChange('landing')}
            className="flex items-center gap-2 cursor-pointer group text-left focus:outline-none"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-tr from-cyan-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:scale-105 transition-all">
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
          </button>
        </div>

        {/* Center: EXPOSED Organic Static Navigation Pills on Desktop */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-zinc-100/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`px-3 py-1.5 text-xs font-bold tracking-wide transition-all rounded-xl flex items-center gap-1.5 cursor-pointer ${
                item.isActive
                  ? 'bg-white dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-zinc-200 dark:border-zinc-700'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          <button
            onClick={() => window.location.assign('/blogs')}
            className="px-3 py-1.5 text-xs font-bold tracking-wide transition-all rounded-xl flex items-center gap-1.5 cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-500" />
            <span>Blogs</span>
          </button>

          <button
            onClick={onNavigateFinhub || (() => window.location.assign('/finhub'))}
            className="px-3 py-1.5 text-xs font-bold tracking-wide transition-all rounded-xl flex items-center gap-1.5 cursor-pointer text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            title="Launch Finhub Valuation & Accounting Lab"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Finhub</span>
          </button>
        </nav>

        {/* Right Section: Utilities (Search, Theme, Settings, Exit) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Quick Search */}
          <button
            onClick={() => onViewChange('devlush-search')}
            className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer border ${
              currentView === 'devlush-search'
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="Search Topics & Activities"
            aria-label="Search Topics"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          {/* Settings & Energy Popover */}
          <div ref={settingsRef} className="relative">
            <button
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer border flex items-center gap-1.5 ${
                isSettingsOpen
                  ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title="devLush Controls & Energy"
            >
              <Settings className="w-4 h-4" />
              {isInfiniteEnergy ? (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              ) : studyEnergy <= 3 ? (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              ) : null}
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    Workspace Controls
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    LIVE
                  </span>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      onViewChange('favorites');
                      setIsSettingsOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <StarIcon className="w-4 h-4 text-amber-500" />
                      Favorites View
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono group-hover:text-cyan-500">
                      OPEN &rarr;
                    </span>
                  </button>

                  <div className="border-t border-zinc-100 dark:border-zinc-900" />

                  <ToggleSwitch
                    label={isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    isOn={isDarkMode}
                    onToggle={onToggleTheme}
                    onIcon={<Moon className="w-3.5 h-3.5 text-zinc-400" />}
                    offIcon={<Sun className="w-3.5 h-3.5 text-amber-400" />}
                  />
                  <ToggleSwitch
                    label="Manual Lock"
                    isOn={isAppLocked}
                    onToggle={onToggleLockMode}
                    onIcon={<Lock className="w-3.5 h-3.5 text-red-500" />}
                    offIcon={<Unlock className="w-3.5 h-3.5 text-zinc-400" />}
                  />
                  <ToggleSwitch
                    label="Focus Mode"
                    isOn={focusMode}
                    onToggle={onToggleFocusMode}
                    onIcon={<Zap className="w-3.5 h-3.5 text-amber-500" />}
                    offIcon={<Zap className="w-3.5 h-3.5 text-zinc-400" />}
                  />
                  <ToggleSwitch
                    label="AI Assistant"
                    isOn={showAiAssistant}
                    onToggle={onToggleAiAssistant}
                    onIcon={<ChatIcon className="w-3.5 h-3.5 text-cyan-500" />}
                    offIcon={<ChatIcon className="w-3.5 h-3.5 text-zinc-400" />}
                  />

                  <div className="border-t border-zinc-100 dark:border-zinc-900" />

                  <ToggleSwitch
                    label="Infinite Energy"
                    isOn={isInfiniteEnergy}
                    onToggle={onToggleInfiniteEnergy}
                    onIcon={<Infinity className="w-3.5 h-3.5 text-cyan-500" />}
                    offIcon={<Zap className="w-3.5 h-3.5 text-zinc-400" />}
                  />

                  <EnergyBeam
                    studyEnergy={studyEnergy}
                    isInfinite={isInfiniteEnergy}
                    lockoutRemaining={lockoutRemaining}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Exit / Return CTA */}
          {onExit && (
            <button
              onClick={onExit}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all bg-red-500/10 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white border border-red-500/30 rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0"
              title="Exit devLush and return to Main Hub"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          )}

        </div>
      </div>

      {/* Sub Row: Organically Visible Static Navigation Bar on Mobile/Tablet */}
      <div className="lg:hidden border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/90 dark:bg-zinc-900/90 px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs font-semibold select-none touch-pan-x">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer transition-all ${
              item.isActive
                ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <button
          onClick={() => window.location.assign('/blogs')}
          className="px-2.5 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookOpen className="w-3 h-3 text-purple-500" />
          <span>Blogs</span>
        </button>

        <button
          onClick={onNavigateFinhub || (() => window.location.assign('/finhub'))}
          className="px-2.5 py-1 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BarChart3 className="w-3 h-3 text-emerald-500" />
          <span>Finhub</span>
        </button>

        {onExit && (
          <button
            onClick={onExit}
            className="px-2.5 py-1 rounded-lg text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/25 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer font-bold"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Exit</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
