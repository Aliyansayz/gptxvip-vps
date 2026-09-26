import React from 'react';
import {
  BarChart3,
  Sun,
  Moon,
  Search,
  Bot,
  BookOpen,
  ArrowLeft,
  Menu,
  Lightbulb,
  Zap,
  Activity,
  Network,
  UserRound,
} from 'lucide-react';

interface FinhubNavbarProps {
  activeTab: string;
  setActiveTab: (tab: any, subTab?: string) => void;
  activeCodeCategory: string;
  setActiveCodeCategory: (category: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onExit?: () => void;
  onNavigateDevLush?: () => void;
}

export const FinhubNavbar: React.FC<FinhubNavbarProps> = ({
  activeTab,
  setActiveTab,
  activeCodeCategory,
  setActiveCodeCategory,
  isDarkMode,
  onToggleTheme,
  isSidebarOpen,
  onToggleSidebar,
  onExit,
  onNavigateDevLush,
}) => {
  const isLearningTab = activeTab === 'code-concepts' || activeTab === 'core-concepts' || activeTab === 'math-primer';
  const navItems = [
    {
      id: 'home',
      label: 'Overview',
      icon: <BarChart3 className="w-3.5 h-3.5" />,
      isActive: activeTab === 'home',
      onClick: () => {
        setActiveTab('home', 'liquidity-depth');
      },
    },
    {
      id: 'trade-type',
      label: 'Docs',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      isActive: activeTab === 'trade-type' || activeTab === 'overview',
      onClick: () => {
        setActiveTab('trade-type');
      },
    },
    {
      id: 'trading-tools',
      label: 'Tools Lab',
      icon: <Zap className="w-3.5 h-3.5" />,
      isActive: activeTab === 'trading-tools' || activeTab === 'archive-tools',
      onClick: () => {
        setActiveTab('trading-tools', 'leverage-view-v3');
      },
    },
    {
      id: 'cointegration',
      label: 'Cointegration',
      icon: <Activity className="w-3.5 h-3.5" />,
      isActive: activeTab === 'cointegration',
      onClick: () => {
        setActiveTab('cointegration');
      },
    },
    {
      id: 'code-concepts',
      label: 'Code Concepts',
      icon: <Lightbulb className="w-3.5 h-3.5" />,
      isActive:
        activeTab === 'code-concepts' ||
        activeTab === 'core-concepts' ||
        activeTab === 'math-primer',
      onClick: () => {
        if (activeCodeCategory === 'search') {
          setActiveCodeCategory('general');
        } else {
          setActiveTab('code-concepts');
        }
      },
    },
    {
      id: 'key-terms',
      label: 'Key Terms',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      isActive: activeTab === 'key-terms',
      onClick: () => {
        setActiveTab('key-terms');
      },
    },
    {
      id: 'map',
      label: 'Map',
      icon: <Network className="w-3.5 h-3.5" />,
      isActive: activeTab === 'map',
      onClick: () => {
        setActiveTab('map', 'doc-map');
      },
    },
  ];

  const handleSearchClick = () => {
    setActiveCodeCategory('search');
  };

  const handleDevLushClick = () => {
    if (onNavigateDevLush) {
      onNavigateDevLush();
    } else {
      window.location.assign('/agents');
    }
  };

  const handleBlogsClick = () => {
    window.location.assign('/blogs');
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
  };

  return (
    <header className="z-50 transition-all duration-200 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl sticky top-0 w-full flex-shrink-0">
      <div className="max-w-full mx-auto px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Section: Back, Sidebar Toggle, Brand Identity */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              aria-label="Return to Main Hub"
              title="Return to Main Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className={`p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 ${isLearningTab ? 'hidden md:inline-flex' : ''}`}
              aria-label="Toggle Sidebar"
              title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            aria-label="Go to Finhub home"
            onClick={() => {
              setActiveTab('home', 'liquidity-depth');
            }}
            className="flex items-center gap-2 cursor-pointer group text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 rounded-lg ml-0.5"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-tr from-emerald-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-all">
              <BarChart3 className="text-white dark:text-zinc-950 w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-sans font-black tracking-tight text-sm sm:text-base uppercase text-zinc-900 dark:text-white leading-none">
                  GPTX<span className="text-emerald-500">{isLearningTab ? ".LEARN" : ".FINHUB"}</span>
                </span>
                <span className="hidden xs:inline-block px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  v4.0
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider leading-none mt-0.5">
                {isLearningTab ? "Interactive code lessons" : "Valuation & Quant Lab"}
              </span>
            </div>
          </button>
        </div>

        {/* Center: EXPOSED Organic Static Navigation Pills on Desktop */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-zinc-100/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={item.isActive ? 'page' : undefined}
              onClick={item.onClick}
              className={`px-3 py-1.5 text-xs font-bold tracking-wide transition-all rounded-xl flex items-center gap-1.5 cursor-pointer ${
                item.isActive
                  ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-zinc-200 dark:border-zinc-700'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {/* Direct bridge to devLush Swarms */}
          <button
            type="button"
            onClick={handleDevLushClick}
            className="px-3 py-1.5 text-xs font-bold tracking-wide transition-all rounded-xl flex items-center gap-1.5 cursor-pointer text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10"
            title="Switch to devLush AgentOS Workspace"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-500" />
            <span>devLush Swarms</span>
          </button>

          {/* Direct bridge to Blogs */}
          <button
            type="button"
            onClick={handleBlogsClick}
            className="px-3 py-1.5 text-xs font-bold tracking-wide transition-all rounded-xl flex items-center gap-1.5 cursor-pointer text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
            title="Explore Research Papers & Blogs"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-500" />
            <span>Blogs</span>
          </button>

          {/* Profile */}
          <button
            type="button"
            onClick={handleProfileClick}
            className={`px-3 py-1.5 text-xs font-bold tracking-wide transition-all rounded-xl flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-zinc-200 dark:border-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <UserRound className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        </nav>

        {/* Right Section: Quick Search, Theme Switcher & Exit CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Quick Search */}
          <button
            type="button"
            onClick={handleSearchClick}
            className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer border ${
              activeTab === 'code-concepts' && activeCodeCategory === 'search'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="Search Topics & Code Concepts"
            aria-label="Search Topics"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          {/* Exit CTA Button */}
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all bg-red-500/10 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white border border-red-500/30 rounded-xl cursor-pointer shadow-sm"
              title="Exit Finhub Lab & Return to Main Hub"
            >
              Exit
            </button>
          )}

        </div>
      </div>

      {/* Sub Row: Organically Visible Static Navigation Bar on Mobile/Tablet */}
      <div className={`lg:hidden border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/90 dark:bg-zinc-900/90 px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs font-semibold select-none touch-pan-x ${isLearningTab ? 'hidden' : ''}`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={item.isActive ? 'page' : undefined}
            onClick={item.onClick}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer transition-all ${
              item.isActive
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <button
          type="button"
          onClick={handleDevLushClick}
          className="px-2.5 py-1 rounded-lg text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Bot className="w-3 h-3 text-cyan-500" />
          <span>devLush</span>
        </button>

        <button
          type="button"
          onClick={handleBlogsClick}
          className="px-2.5 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookOpen className="w-3 h-3 text-purple-500" />
          <span>Blogs</span>
        </button>

        <button
          type="button"
          onClick={handleProfileClick}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
              : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <UserRound className="w-3 h-3" />
          <span>Profile</span>
        </button>

        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="px-2.5 py-1 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 border border-red-500/20 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer font-bold"
          >
            <span>Exit</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default FinhubNavbar;
