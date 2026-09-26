import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { generateMockData, generateCandlestickData } from "./functions/mockData";
import { PriceData, OHLCData } from "./types";
import { sidebarItems } from "./constants";

// Lazy loading to improve Core Web Vitals (FCP, LCP, TBT, Speed Index)
const HomeMainView = lazy(() => import("./finhub/homeMainView").then(module => ({ default: module.HomeMainView })));
const TradeTypeView = lazy(() => import("./views/TradeTypeView").then(module => ({ default: module.TradeTypeView })));
const CointegrationView = lazy(() => import("./views/CointegrationView").then(module => ({ default: module.CointegrationView })));
const KeyTermsView = lazy(() => import("./views/KeyTermsView").then(module => ({ default: module.KeyTermsView })));
const MapView = lazy(() => import("./views/MapView").then(module => ({ default: module.MapView })));
const OverviewView = lazy(() => import("./views/OverviewView").then(module => ({ default: module.OverviewView })));
const CodeConceptsView = lazy(() => import("./codeConcepts").then(module => ({ default: module.CodeConceptsView })));
const ProfileInfo = lazy(() => import("./finhub/profileInfo").then(module => ({ default: module.ProfileInfo })));
const TradingToolsView = lazy(() => import("./views/TradingToolsView").then(module => ({ default: module.TradingToolsView })));
const RoadmapContainer = lazy(() => import("./roadmapArea/roadmapView/RoadmapContainer"));
const RootHomePage = lazy(() => import("./rootHomePage/RootHomePage").then(module => ({ default: module.RootHomePage })));

import { Toaster } from 'sonner';

type ActiveTabType =
  | "root-home"
  | "home"
  | "trade-type"
  | "overview"
  | "map"
  | "cointegration"
  | "key-terms"
  | "code-concepts"
  | "trading-tools"
  | "archive-tools"
  | "profile"
  | "dev-labs-workspace"
  | "roadmap-workspace"
  | "core-concepts"
  | "math-primer";

const learningTabs = ["code-concepts", "core-concepts", "math-primer"] as const;
const finhubTabs = [
  "home", "trade-type", "overview", "map", "cointegration", "key-terms",
  "trading-tools", "archive-tools",
] as const;
const defaultFinhubSubTabs: Partial<Record<(typeof finhubTabs)[number], string>> = {
  home: "liquidity-depth",
  map: "doc-map",
};

function decodePathSegment(segment?: string) {
  if (!segment) return "";
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function readAppRoute(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const prefix = segments[0];
  const category = segments[1] || "general";
  const knownCategory = ["search", "favorites", "general", "cpp_hello_world", "cpp_engine_design", "HFT", "python"].includes(category)
    ? category
    : "general";

  if (prefix === "profile" && segments.length === 1) return { tab: "profile" as ActiveTabType, category: knownCategory, activity: undefined, subTab: "" };
  if (prefix === "core_concepts") return { tab: "core-concepts" as ActiveTabType, category: knownCategory, activity: segments[2], subTab: "" };
  if (prefix === "math_primer") return { tab: "math-primer" as ActiveTabType, category: knownCategory, activity: segments[2], subTab: "" };
  if (prefix === "code_concepts") return { tab: "code-concepts" as ActiveTabType, category: knownCategory, activity: segments[2], subTab: "" };
  if (prefix === "roadmap") return { tab: "roadmap-workspace" as ActiveTabType, category: knownCategory, activity: undefined, subTab: "" };

  if (prefix === "finhub" && segments[1]) {
    const routeTab = segments[1] as (typeof finhubTabs)[number];
    if ((finhubTabs as readonly string[]).includes(routeTab)) {
      const tabSections = sidebarItems.find((item) => item.id === routeTab)?.subItems?.map((item) => item.id) || [];
      const requestedSection = decodePathSegment(segments[2]);
      const fallbackSection = defaultFinhubSubTabs[routeTab] || tabSections[0] || "";
      const subTab = requestedSection && tabSections.includes(requestedSection)
        ? requestedSection
        : fallbackSection;
      return { tab: routeTab as ActiveTabType, category: knownCategory, activity: undefined, subTab };
    }
  }

  return {
    tab: prefix === "finhub" && !segments[1] ? "home" as ActiveTabType : "root-home" as ActiveTabType,
    category: knownCategory,
    activity: undefined,
    subTab: "",
  };
}

const sectionScrollTabs = new Set(["home", "trade-type", "cointegration", "key-terms"]);

function scrollToSectionForPath(pathname: string, behavior: ScrollBehavior = "auto"): () => void {
  const segments = pathname.split("/").filter(Boolean);
  const tab = segments[1];
  const sectionId = decodePathSegment(segments[2]);
  if (segments[0] !== "finhub" || !tab || !sectionId || !sectionScrollTabs.has(tab)) return () => {};
  const isKnownSection = sidebarItems.find((item) => item.id === tab)?.subItems?.some((item) => item.id === sectionId);
  if (!isKnownSection) return () => {};

  let observer: MutationObserver | null = null;
  let timeoutId: number | null = null;
  const stopObserving = () => {
    observer?.disconnect();
    if (timeoutId !== null) window.clearTimeout(timeoutId);
  };
  const scrollWhenReady = () => {
    const target = document.getElementById(sectionId);
    if (!target) return false;
    target.scrollIntoView({ behavior, block: "start" });
    stopObserving();
    return true;
  };

  if (scrollWhenReady()) return stopObserving;
  const main = document.querySelector("main");
  if (!main) return stopObserving;
  observer = new MutationObserver(scrollWhenReady);
  observer.observe(main, { childList: true, subtree: true });
  timeoutId = window.setTimeout(stopObserving, 5000);
  return stopObserving;
}

interface AppProps {
  initialTab?: ActiveTabType;
}

export default function App({ initialTab }: AppProps = {}) {
  const initialRoute = readAppRoute(window.location.pathname);
  const [chart1Data, setChart1Data] = useState<PriceData[]>([]);
  const [chart2Data, setChart2Data] = useState<PriceData[]>([]);
  const [candlestickData, setCandlestickData] = useState<OHLCData[]>([]);
  const [silverCandlestickData, setSilverCandlestickData] = useState<OHLCData[]>([]);
  const [activeTab, setActiveTabState] = useState<ActiveTabType>(initialTab || initialRoute.tab);
  const [activeSubTab, setActiveSubTab] = useState<string>(initialRoute.subTab || defaultFinhubSubTabs[initialRoute.tab as (typeof finhubTabs)[number]] || "");
  const [activeCodeCategory, setActiveCodeCategoryState] = useState<string>(initialRoute.category);
  const [showUI, setShowUI] = useState(true);

  const [initialDeepLinkActivity, setInitialDeepLinkActivity] = useState<string | undefined>(initialRoute.activity);
  const sectionScrollCancelRef = useRef<() => void>(() => {});
  const sectionScrollTimeoutRef = useRef<number | null>(null);

  const pathForTab = (tab: ActiveTabType, subTab = "") => {
    if (tab === "root-home") return "/";
    if (tab === "profile") return "/profile";
    if (tab === "roadmap-workspace") return "/roadmap";
    if (tab === "dev-labs-workspace") return "/agents/lab";
    if (tab === "core-concepts") return `/core_concepts/${activeCodeCategory}`;
    if (tab === "math-primer") return `/math_primer/${activeCodeCategory}`;
    if (tab === "code-concepts") return `/code_concepts/${activeCodeCategory}`;
    const basePath = tab === "home" ? "/finhub/home" : `/finhub/${tab}`;
    return subTab ? `${basePath}/${encodeURIComponent(subTab)}` : tab === "home" ? "/finhub" : basePath;
  };

  const scheduleSectionScroll = (path: string) => {
    sectionScrollCancelRef.current();
    if (sectionScrollTimeoutRef.current !== null) {
      window.clearTimeout(sectionScrollTimeoutRef.current);
    }
    sectionScrollTimeoutRef.current = window.setTimeout(() => {
      sectionScrollTimeoutRef.current = null;
      sectionScrollCancelRef.current = scrollToSectionForPath(path, "smooth");
    }, 0);
  };

  const navigateTab = (tab: ActiveTabType, subTab = "") => {
    if (tab === "dev-labs-workspace") {
      window.location.assign("/agents/lab");
      return;
    }
    setActiveTabState(tab);
    const nextSubTab = subTab || defaultFinhubSubTabs[tab as (typeof finhubTabs)[number]] || "";
    setActiveSubTab(nextSubTab);
    const path = pathForTab(tab, nextSubTab);
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    scheduleSectionScroll(path);
  };

  const setActiveCodeCategory = (category: string) => {
    setActiveCodeCategoryState(category);
    setActiveSubTab("");
    const nextTab = category === "search" || activeCodeCategory === "search"
      ? "code-concepts"
      : activeTab;
    if (nextTab !== activeTab) setActiveTabState(nextTab);
    if (!learningTabs.includes(nextTab as (typeof learningTabs)[number])) return;
    const prefix = nextTab === "math-primer" ? "/math_primer" : nextTab === "code-concepts" ? "/code_concepts" : "/core_concepts";
    const path = `${prefix}/${category}`;
    if (window.location.pathname !== path) {
      window.history.pushState(category === "search" ? { codeConceptSearch: true } : {}, "", path);
    }
  };

  const exitCodeConceptSearch = () => {
    const historyState = window.history.state;
    if (historyState && typeof historyState === "object" && historyState.codeConceptSearch === true) {
      window.history.back();
      return;
    }

    const tab = learningTabs.includes(activeTab as (typeof learningTabs)[number]) ? activeTab : "code-concepts";
    const prefix = tab === "math-primer" ? "/math_primer" : tab === "core-concepts" ? "/core_concepts" : "/code_concepts";
    setActiveTabState(tab);
    setActiveSubTab("");
    setActiveCodeCategoryState("general");
    window.history.replaceState({}, "", `${prefix}/general`);
  };

  useEffect(() => {
    const synchronizeRoute = () => {
      const currentPath = window.location.pathname;
      const route = readAppRoute(currentPath);
      const routeSegments = currentPath.split("/").filter(Boolean);
      if (route.tab === "root-home" && currentPath !== "/") {
        window.history.replaceState({}, "", `/${window.location.search}${window.location.hash}`);
      } else if ((finhubTabs as readonly string[]).includes(route.tab)) {
        const requestedSection = decodePathSegment(routeSegments[2]);
        const hasExtraSegments = routeSegments.length > 3;
        if (hasExtraSegments || (routeSegments[2] && requestedSection !== route.subTab)) {
          const basePath = route.tab === "home" ? "/finhub/home" : `/finhub/${route.tab}`;
          const canonicalPath = route.subTab ? `${basePath}/${encodeURIComponent(route.subTab)}` : basePath;
          window.history.replaceState({}, "", `${canonicalPath}${window.location.search}${window.location.hash}`);
        }
      }
      sectionScrollCancelRef.current();
      if (sectionScrollTimeoutRef.current !== null) {
        window.clearTimeout(sectionScrollTimeoutRef.current);
        sectionScrollTimeoutRef.current = null;
      }
      sectionScrollCancelRef.current = scrollToSectionForPath(window.location.pathname);
      setActiveTabState(route.tab);
      setActiveSubTab(route.subTab || defaultFinhubSubTabs[route.tab as (typeof finhubTabs)[number]] || "");
      setActiveCodeCategoryState(route.category);
      setInitialDeepLinkActivity(route.activity);
      setShowUI(true);
    };
    synchronizeRoute();
    window.addEventListener("popstate", synchronizeRoute);
    return () => {
      sectionScrollCancelRef.current();
      if (sectionScrollTimeoutRef.current !== null) {
        window.clearTimeout(sectionScrollTimeoutRef.current);
      }
      window.removeEventListener("popstate", synchronizeRoute);
    };
  }, []);

  useEffect(() => {
    setChart1Data(generateMockData(150, 2, 30));
    setChart2Data(generateMockData(2800, 15, 30));
    setCandlestickData(generateCandlestickData(100, 100));
    setSilverCandlestickData(generateCandlestickData(25.50, 100, 0.05)); // Silver prices around $25.50, lower absolute volatility
    
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      {activeTab === "root-home" ? (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-zinc-500">Loading GPTX.VIP...</div>}>
          <RootHomePage 
            onNavigateFinhub={() => {
              navigateTab("home");
            }}
            onNavigateDevLush={() => {
              window.location.assign('/agents');
            }}
            onNavigateBlogs={() => {
              window.location.assign('/blogs');
            }}
          />
        </Suspense>
      ) : activeTab === "roadmap-workspace" ? (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-zinc-500">Loading Roadmap...</div>}>
          <RoadmapContainer onExit={() => {
            navigateTab("root-home");
          }} />
        </Suspense>
      ) : (
        <MainLayout
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          setActiveTab={navigateTab}
          setActiveSubTab={setActiveSubTab}
          activeCodeCategory={activeCodeCategory}
          setActiveCodeCategory={setActiveCodeCategory}
          showUI={showUI}
          onExit={() => {
            navigateTab("root-home");
          }}
          onNavigateDevLush={() => {
            navigateTab("dev-labs-workspace");
          }}
        >
          <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-zinc-500">Loading...</div>}>
            {activeTab === "home" && (
              <HomeMainView 
                candlestickData={candlestickData} 
                onToggleUI={setShowUI} 
                onInitializeEngine={() => {
                  navigateTab("trading-tools", "leverage-view-v3");
                }}
              />
            )}
            {activeTab === "trade-type" && (
              <TradeTypeView
                silverCandlestickData={silverCandlestickData}
                chart2Data={chart2Data}
                candlestickData={candlestickData}
              />
            )}
            {activeTab === "cointegration" && <CointegrationView />}
            {activeTab === "key-terms" && <KeyTermsView />}
            {activeTab === "map" && <MapView activeSubTab={activeSubTab} />}
            {activeTab === "overview" && <OverviewView />}
            {(activeTab === "trading-tools" || activeTab === "archive-tools") && (
              <TradingToolsView activeSubTab={activeSubTab} isArchive={activeTab === "archive-tools"} />
            )}
            {activeTab === "profile" && <ProfileInfo />}
            {(activeTab === "code-concepts" || activeTab === "core-concepts" || activeTab === "math-primer") && (
              <CodeConceptsView 
                courseMode={activeTab}
                activeCategory={activeCodeCategory as any} 
                setActiveCategory={setActiveCodeCategory as any}
                onToggleUI={setShowUI}
                onExitSearch={() => {
                  exitCodeConceptSearch();
                }}
                initialActivityId={initialDeepLinkActivity}
              />
            )}
          </Suspense>
        </MainLayout>
      )}
    </>
  );
}
