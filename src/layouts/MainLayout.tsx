import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  BarChart3,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Home,
  Search,
  UserRound,
} from "lucide-react";
import { sidebarItems } from "../constants";
import { CODE_CONCEPT_CATEGORIES } from "../constants/codeConcepts";
import { DotNavigation } from "../components/verticalScrollNav/DotNavigation";

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  activeSubTab: string;
  setActiveTab: (tab: any) => void;
  setActiveSubTab: (subTab: string) => void;
  activeCodeCategory: string;
  setActiveCodeCategory: (category: string) => void;
  showUI?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  activeSubTab,
  setActiveTab,
  setActiveSubTab,
  activeCodeCategory,
  setActiveCodeCategory,
  showUI = true
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const shouldShowSidebar = activeTab !== "home" && activeTab !== "profile" && !(activeTab === "code-concepts" && activeCodeCategory === "search");
  const [isSidebarOpen, setIsSidebarOpen] = useState(shouldShowSidebar);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["home"]);

  useEffect(() => {
    setIsSidebarOpen(shouldShowSidebar);
  }, [shouldShowSidebar]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const activeItem = sidebarItems.find((item) => item.id === activeTab);
    if (!activeItem || !activeItem.subItems) return;

    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSubTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const timeoutId = setTimeout(() => {
      activeItem.subItems?.forEach((subItem) => {
        const el = document.getElementById(subItem.id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [activeTab, setActiveSubTab]);

  const handleMainItemClick = (item: any) => {
    setActiveTab(item.id);
    if (item.subItems) {
      setExpandedMenus((prev) =>
        prev.includes(item.id)
          ? prev.filter((id) => id !== item.id)
          : [...prev, item.id],
      );
      if (item.subItems.length > 0) {
        setActiveSubTab(item.subItems[0].id);
      }
    } else {
      setActiveSubTab("");
    }
  };

  const handleSubItemClick = (tabId: string, sectionId: string) => {
    setActiveTab(tabId as any);
    setActiveSubTab(sectionId);
    if (!expandedMenus.includes(tabId)) {
      setExpandedMenus((prev) => [...prev, tabId]);
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const prefetchData = (tabId: string) => {
    if (tabId === 'key-terms') {
      fetch('/key-terms-dictionary.json').catch(() => {});
      fetch('/key-terms-volatility.json').catch(() => {});
    }
    if (tabId === 'map') {
      fetch('/documentation-map.json').catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30 flex flex-col transition-colors duration-300">
      {/* Header */}
      {showUI && (
        <header className={`z-50 transition-all duration-300 ${activeTab === "home" ? "absolute top-0 left-0 right-0 bg-transparent border-none" : "border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0"}`}>
          <div className="max-w-full mx-auto px-6 h-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                 onClick={() => {
                   setActiveTab("home");
                   setActiveSubTab("liquidity-depth");
                 }}
                 className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                 aria-label="Home"
              >
                 <Home className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 -ml-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Toggle Sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  <BarChart3 className="text-white dark:text-black w-5 h-5" />
                </div>
                <span className="font-display font-black tracking-tighter text-xl uppercase text-white">
                  GPTX.VIP
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab("trade-type");
                    setActiveSubTab("");
                  }}
                  className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors bg-transparent border-none ${
                    activeTab === "home" ? "text-white hover:text-white/80" : (!isDarkMode ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-white")
                  }`}
                >
                  Docs
                </button>
                <button
                  onClick={() => {
                    setActiveTab("code-concepts");
                    setActiveSubTab("");
                    if (activeCodeCategory === "search") {
                      setActiveCodeCategory("general");
                    }
                  }}
                  className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors bg-transparent border-none ${
                    activeTab === "home" ? "text-white hover:text-white/80" : (!isDarkMode ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-white")
                  }`}
                >
                  Code Concepts
                </button>
                <button
                  onClick={() => {
                    setActiveTab("code-concepts");
                    setActiveSubTab("");
                    setActiveCodeCategory("search");
                  }}
                  className={`p-1.5 transition-colors bg-transparent border-none ${
                    activeTab === "home" ? "text-white hover:text-white/80" : (!isDarkMode ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-white")
                  }`}
                  title="Search Topics"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setActiveSubTab("");
                  }}
                  className={`px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase transition-colors bg-transparent border-none flex items-center gap-1.5 ${
                    activeTab === "home" ? "text-white hover:text-white/80" : (!isDarkMode ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-white")
                  }`}
                >
                  <UserRound className="w-3.5 h-3.5" />
                  Profile
                </button>
              </div>
  
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 transition-colors bg-transparent border-none ${
                  activeTab === "home" ? "text-white hover:text-white/80" : (!isDarkMode ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-white")
                }`}
                title="Toggle Theme"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && showUI && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-r border-zinc-200 dark:border-zinc-800 bg-transparent flex flex-col p-4 gap-2 transition-colors duration-300 overflow-hidden whitespace-nowrap"
            >
              <div className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase font-bold tracking-widest mb-4 px-2">
                {activeTab === "code-concepts" ? "Code Concepts" : "Navigation"}
              </div>
              <div className="overflow-y-auto scrollbar-hide pr-2 space-y-1">
                {activeTab === "code-concepts" ? (
                   CODE_CONCEPT_CATEGORIES.filter(c => c.id !== "search").map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCodeCategory(category.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full ${
                        activeCodeCategory === category.id
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent"
                      }`}
                    >
                      <category.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{category.label}</span>
                    </button>
                   ))
                ) : (
                  sidebarItems.filter(item => item.id !== "home").map((item) => (
                    <div key={item.id} className="flex flex-col">
                      <button
                        onClick={() => handleMainItemClick(item)}
                        onMouseEnter={() => prefetchData(item.id)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full ${
                          activeTab === item.id
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.subItems &&
                          (expandedMenus.includes(item.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          ))}
                      </button>
                      <AnimatePresence>
                        {item.subItems && expandedMenus.includes(item.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden flex flex-col gap-1 mt-1 pl-9 pr-2"
                          >
                            {item.subItems.map((subItem) => {
                              const isSubActive = activeSubTab === subItem.id;
                              return (
                                <button
                                  key={subItem.id}
                                  onClick={() =>
                                    handleSubItemClick(item.id, subItem.id)
                                  }
                                  onMouseEnter={() => prefetchData(item.id)}
                                  className={`text-left px-2 py-1.5 text-xs rounded-md transition-colors truncate ${
                                    isSubActive
                                      ? "text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-500/10"
                                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                                  }`}
                                >
                                  {subItem.label}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950 transition-colors duration-300 relative scroll-smooth scroll-pt-20">
          <DotNavigation
            sections={
              sidebarItems.find((item) => item.id === activeTab)?.subItems || []
            }
            activeSection={activeSubTab}
            onSectionChange={(id) => handleSubItemClick(activeTab, id)}
          />
          <div className={
            activeTab === "home"
              ? "w-full h-full overflow-hidden"
              : activeTab === "map" && activeSubTab === "project-journey" 
              ? "w-full h-full overflow-hidden" 
              : activeTab === "map" 
              ? "w-full mx-auto px-8 py-12 pb-32" 
              : activeTab === "code-concepts"
              ? "w-full h-full"
              : activeTab === "trading-tools" || activeTab === "archive-tools"
              ? "w-full h-full"
              : "max-w-5xl mx-auto px-8 py-12 pb-32"
          }>
            {children}
          </div>
        </main>
      </div>

          {/* Footer */}
          {showUI && (
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
          )}
    </div>
  );
};
