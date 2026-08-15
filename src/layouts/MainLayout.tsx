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
import { DotNavigation } from "../finhub/verticalScrollNav/DotNavigation";
import { MainFooter } from "./MainFooter";

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
    if (item.id === "core-concepts") {
      window.location.assign('/core_concepts');
      return;
    }
    if (item.id === "math-primer") {
      window.location.assign('/math_primer');
      return;
    }
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
                   setActiveTab("root-home");
                   window.history.pushState({}, '', '/');
                 }}
                 className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                 aria-label="Home"
                 title="Return to Main Hub"
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
                <button 
                  onClick={() => {
                    setActiveTab("root-home");
                    window.history.pushState({}, '', '/');
                  }}
                  className="flex items-center gap-2 cursor-pointer text-left"
                >
                  <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    <BarChart3 className="text-white dark:text-black w-5 h-5" />
                  </div>
                  <span className={`font-display font-black tracking-tighter text-xl uppercase ${activeTab === "home" && !isDarkMode ? "text-zinc-900" : "text-white"}`}>
                    GPTX.VIP
                  </span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-6">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab("trade-type");
                    setActiveSubTab("");
                  }}
                  style={{ transform: 'skewY(-2deg)' }}
                  className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors bg-gradient-to-br border rounded-none shadow-xl ${
                    activeTab === "home" 
                      ? (!isDarkMode ? "from-white to-zinc-50 border-zinc-200 text-zinc-800 hover:text-zinc-600" : "from-zinc-900 to-zinc-950 border-zinc-800/80 text-white hover:text-white/80")
                      : (!isDarkMode ? "from-zinc-900 to-zinc-950 border-zinc-800/80 text-zinc-600 hover:text-zinc-900" : "from-zinc-900 to-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-white")
                  }`}
                >
                  <div style={{ transform: 'skewY(2deg)' }}>Docs</div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("code-concepts");
                    setActiveSubTab("");
                    if (activeCodeCategory === "search") {
                      setActiveCodeCategory("general");
                    }
                  }}
                  style={{ transform: 'skewY(-2deg)' }}
                  className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors bg-gradient-to-br border rounded-none shadow-xl ${
                    activeTab === "home" 
                      ? (!isDarkMode ? "from-white to-zinc-50 border-zinc-200 text-zinc-800 hover:text-zinc-600" : "from-zinc-900 to-zinc-950 border-zinc-800/80 text-white hover:text-white/80")
                      : (!isDarkMode ? "from-zinc-900 to-zinc-950 border-zinc-800/80 text-zinc-600 hover:text-zinc-900" : "from-zinc-900 to-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-white")
                  }`}
                >
                  <div style={{ transform: 'skewY(2deg)' }}>Code Concepts</div>
                </button>

                <button
                  onClick={() => {
                    window.location.assign('/agent');
                  }}
                  style={{ transform: 'skewY(-2deg)' }}
                  className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors bg-gradient-to-br border rounded-none shadow-xl ${
                    activeTab === "home" 
                      ? (!isDarkMode ? "from-white to-zinc-50 border-zinc-200 text-zinc-800 hover:text-zinc-600" : "from-zinc-900 to-zinc-950 border-zinc-800/80 text-white hover:text-white/80")
                      : (!isDarkMode ? "from-zinc-900 to-zinc-950 border-zinc-800/80 text-zinc-600 hover:text-zinc-900" : "from-zinc-900 to-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-white")
                  }`}
                >
                  <div style={{ transform: 'skewY(2deg)' }}>Dev Agents</div>
                </button>
                <button
                  onClick={() => {
                    window.location.assign('/blogs');
                  }}
                  style={{ transform: 'skewY(-2deg)' }}
                  className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors bg-gradient-to-br border rounded-none shadow-xl ${
                    activeTab === "home" 
                      ? (!isDarkMode ? "from-white to-zinc-50 border-zinc-200 text-zinc-800 hover:text-zinc-600" : "from-zinc-900 to-zinc-950 border-zinc-800/80 text-white hover:text-white/80")
                      : (!isDarkMode ? "from-zinc-900 to-zinc-950 border-zinc-800/80 text-zinc-600 hover:text-zinc-900" : "from-zinc-900 to-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-white")
                  }`}
                >
                  <div style={{ transform: 'skewY(2deg)' }}>Blogs</div>
                </button>
                <button
                  onClick={() => {
                    window.location.assign('/profile');
                  }}
                  style={{ transform: 'skewY(-2deg)' }}
                  className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors bg-gradient-to-br border rounded-none shadow-xl ${
                    activeTab === "home" 
                      ? (!isDarkMode ? "from-white to-zinc-50 border-zinc-200 text-zinc-800 hover:text-zinc-600" : "from-zinc-900 to-zinc-950 border-zinc-800/80 text-white hover:text-white/80")
                      : (!isDarkMode ? "from-zinc-900 to-zinc-950 border-zinc-800/80 text-zinc-600 hover:text-zinc-900" : "from-zinc-900 to-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-white")
                  }`}
                >
                  <div style={{ transform: 'skewY(2deg)' }} className="flex items-center gap-1.5">
                    <UserRound className="w-3.5 h-3.5" />
                    Profile
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("code-concepts");
                    setActiveSubTab("");
                    setActiveCodeCategory("search");
                  }}
                  className={`p-1.5 transition-colors bg-transparent border-none ${
                    activeTab === "home" ? (!isDarkMode ? "text-zinc-800 hover:text-zinc-600" : "text-white hover:text-white/80") : (!isDarkMode ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-white")
                  }`}
                  title="Search Topics"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
  
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 transition-colors bg-transparent border-none ${
                  activeTab === "home" ? (!isDarkMode ? "text-zinc-800 hover:text-zinc-600" : "text-white hover:text-white/80") : (!isDarkMode ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-white")
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
                {activeTab === "code-concepts" || activeTab === "core-concepts" || activeTab === "math-primer" ? "Code Concepts" : "Navigation"}
              </div>
              <div className="overflow-y-auto scrollbar-hide pr-2 space-y-1">
                {activeTab === "code-concepts" || activeTab === "core-concepts" || activeTab === "math-primer" ? (
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
            activeTab === "home" || activeTab === "dev-labs-workspace"
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
            <MainFooter 
              setActiveTab={setActiveTab}
              setActiveSubTab={setActiveSubTab}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
    </div>
  );
};
