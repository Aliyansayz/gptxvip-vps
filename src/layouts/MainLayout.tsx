import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { sidebarItems } from "../constants";
import { CODE_CONCEPT_CATEGORIES } from "../constants/codeConcepts";
import { DotNavigation } from "../finhub/verticalScrollNav/DotNavigation";
import { MainFooter } from "./MainFooter";
import { FinhubNavbar } from "../finhub/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  activeSubTab: string;
  setActiveTab: (tab: any, subTab?: string) => void;
  setActiveSubTab: (subTab: string) => void;
  activeCodeCategory: string;
  setActiveCodeCategory: (category: string) => void;
  showUI?: boolean;
  onExit?: () => void;
  onNavigateDevLush?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  activeSubTab,
  setActiveTab,
  setActiveSubTab,
  activeCodeCategory,
  setActiveCodeCategory,
  showUI = true,
  onExit,
  onNavigateDevLush,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const isLearningTab = activeTab === "code-concepts" || activeTab === "core-concepts" || activeTab === "math-primer";
  const learningAreaLabel = activeTab === "math-primer"
    ? "Math Primer"
    : activeTab === "core-concepts"
      ? "Core Concepts"
      : "Code Concepts";
  const shouldShowSidebar = activeTab !== "home" && activeTab !== "profile" && !(isLearningTab && activeCodeCategory === "search");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => shouldShowSidebar && (typeof window === "undefined" || window.innerWidth >= 768));
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["home"]);

  useEffect(() => {
    setIsSidebarOpen(shouldShowSidebar && (typeof window === "undefined" || window.innerWidth >= 768));
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
    if (!activeItem || !activeItem.subItems || typeof IntersectionObserver === "undefined") return;

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

  const closeMobileSidebar = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setIsSidebarOpen(false);
    }
  };

  const handleTabChange = (tab: any, subTab?: string) => {
    setActiveTab(tab, subTab);
    closeMobileSidebar();
  };

  const handleMainItemClick = (item: any) => {
    const defaultSubTab = item.subItems?.[0]?.id || "";
    handleTabChange(item.id, defaultSubTab);
    if (item.subItems) {
      setExpandedMenus((prev) =>
        prev.includes(item.id)
          ? prev.filter((id) => id !== item.id)
          : [...prev, item.id],
      );
      if (item.subItems.length > 0) {
        setActiveSubTab(defaultSubTab);
      }
    } else {
      setActiveSubTab("");
    }
  };

  const handleSubItemClick = (tabId: string, sectionId: string) => {
    handleTabChange(tabId as any, sectionId);
    setActiveSubTab(sectionId);
    if (!expandedMenus.includes(tabId)) {
      setExpandedMenus((prev) => [...prev, tabId]);
    }
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
      
      {/* Finhub Top Navbar */}
      {showUI && (
        <FinhubNavbar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          activeCodeCategory={activeCodeCategory}
          setActiveCodeCategory={setActiveCodeCategory}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={shouldShowSidebar ? () => setIsSidebarOpen(!isSidebarOpen) : undefined}
          onExit={onExit || (() => {
            setActiveTab("root-home");
            window.history.pushState({}, '', '/');
          })}
          onNavigateDevLush={onNavigateDevLush || (() => setActiveTab("dev-labs-workspace"))}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && showUI && (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-x-0 bottom-0 top-[52px] z-50 bg-black/35 backdrop-blur-[1px] md:hidden"
          />
        )}
        <AnimatePresence initial={false}>
          {isSidebarOpen && showUI && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-[52px] left-0 z-[60] border-r border-zinc-200 bg-white p-4 flex flex-col gap-2 shadow-2xl transition-colors duration-300 overflow-hidden whitespace-nowrap shrink-0 dark:border-zinc-800 dark:bg-zinc-950 md:relative md:inset-auto md:z-auto md:bg-transparent md:shadow-none"
            >
              <div className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase font-bold tracking-widest mb-4 px-2">
                {isLearningTab ? learningAreaLabel : "Navigation"}
              </div>
              <div className="overflow-y-auto scrollbar-hide pr-2 space-y-1">
                {isLearningTab ? (
                   CODE_CONCEPT_CATEGORIES.filter(c => c.id !== "search").map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      aria-current={activeCodeCategory === category.id ? "page" : undefined}
                      onClick={() => {
                        setActiveCodeCategory(category.id);
                        closeMobileSidebar();
                      }}
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
                        type="button"
                        aria-current={activeTab === item.id ? "page" : undefined}
                        aria-expanded={item.subItems ? expandedMenus.includes(item.id) : undefined}
                        onClick={() => handleMainItemClick(item)}
                        onMouseEnter={() => prefetchData(item.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
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
                                  type="button"
                                  aria-current={isSubActive ? "location" : undefined}
                                  onClick={() =>
                                    handleSubItemClick(item.id, subItem.id)
                                  }
                                  onMouseEnter={() => prefetchData(item.id)}
                                  className={`text-left px-2 py-1.5 text-xs rounded-md transition-colors truncate focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 ${
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
              ? "w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 pb-32" 
              : isLearningTab
              ? "w-full h-full"
              : activeTab === "trading-tools" || activeTab === "archive-tools"
              ? "w-full h-full"
              : "max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 pb-32"
          }>
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {showUI && !isLearningTab && (
        <MainFooter 
          setActiveTab={handleTabChange}
          activeCodeCategory={activeCodeCategory}
          setActiveCodeCategory={setActiveCodeCategory}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}
    </div>
  );
};
