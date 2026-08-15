import React, { useState, useEffect, lazy, Suspense } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { generateMockData, generateCandlestickData } from "./functions/mockData";
import { PriceData, OHLCData } from "./types";

import { HomeMainView } from "./finhub/homeMainView";

// Lazy loading to improve Core Web Vitals (FCP, LCP, TBT, Speed Index)
const TradeTypeView = lazy(() => import("./views/TradeTypeView").then(module => ({ default: module.TradeTypeView })));
const CointegrationView = lazy(() => import("./views/CointegrationView").then(module => ({ default: module.CointegrationView })));
const KeyTermsView = lazy(() => import("./views/KeyTermsView").then(module => ({ default: module.KeyTermsView })));
const MapView = lazy(() => import("./views/MapView").then(module => ({ default: module.MapView })));
const OverviewView = lazy(() => import("./views/OverviewView").then(module => ({ default: module.OverviewView })));
const CodeConceptsView = lazy(() => import("./finhub/codeConceptsTopics/codeConceptsView/CodeConceptsView").then(module => ({ default: module.CodeConceptsView })));
const ProfileInfo = lazy(() => import("./finhub/profileInfo").then(module => ({ default: module.ProfileInfo })));
const TradingToolsView = lazy(() => import("./views/TradingToolsView").then(module => ({ default: module.TradingToolsView })));
const DevLushApp = lazy(() => import("./devLushArea/agentDevRootComponents/devLushAreaApp"));
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

interface AppProps {
  initialTab?: ActiveTabType;
}

export default function App({ initialTab }: AppProps = {}) {
  const [chart1Data, setChart1Data] = useState<PriceData[]>([]);
  const [chart2Data, setChart2Data] = useState<PriceData[]>([]);
  const [candlestickData, setCandlestickData] = useState<OHLCData[]>([]);
  const [silverCandlestickData, setSilverCandlestickData] = useState<OHLCData[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTabType>(
    initialTab || (window.location.pathname.startsWith('/profile') ? "profile" : 
                   window.location.pathname.startsWith('/core_concepts') ? "core-concepts" :
                   window.location.pathname.startsWith('/math_primer') ? "math-primer" : 
                   window.location.pathname.startsWith('/finhub') ? "home" : "root-home")
  );
  const [activeSubTab, setActiveSubTab] = useState<string>("liquidity-depth");
  const [activeCodeCategory, setActiveCodeCategory] = useState<string>("general");
  const [showUI, setShowUI] = useState(true);

  const [initialDeepLinkActivity, setInitialDeepLinkActivity] = useState<string | undefined>(undefined);

  useEffect(() => {
    setChart1Data(generateMockData(150, 2, 30));
    setChart2Data(generateMockData(2800, 15, 30));
    setCandlestickData(generateCandlestickData(100, 100));
    setSilverCandlestickData(generateCandlestickData(25.50, 100, 0.05)); // Silver prices around $25.50, lower absolute volatility
    
    // Parse deep links
    const path = window.location.pathname;
    if (path.startsWith('/core_concepts/') || path.startsWith('/math_primer/')) {
      const parts = path.split('/').filter(Boolean);
      if (parts.length > 1) {
        setActiveCodeCategory(parts[1]);
        if (parts.length > 2) {
          setInitialDeepLinkActivity(parts[2]);
        }
      }
    }
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      {activeTab === "root-home" ? (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-zinc-500">Loading GPTX.VIP...</div>}>
          <RootHomePage 
            onNavigateFinhub={() => {
              setActiveTab("home");
              window.history.pushState({}, '', '/finhub');
            }}
            onNavigateDevLush={() => {
              setActiveTab("dev-labs-workspace");
            }}
            onNavigateBlogs={() => {
              window.location.assign('/blogs');
            }}
          />
        </Suspense>
      ) : activeTab === "dev-labs-workspace" ? (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-zinc-500">Loading Workspace...</div>}>
          <DevLushApp onExit={() => {
            setActiveTab("root-home");
            window.history.pushState({}, '', '/');
          }} />
        </Suspense>
      ) : activeTab === "roadmap-workspace" ? (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-zinc-500">Loading Roadmap...</div>}>
          <RoadmapContainer onExit={() => {
            setActiveTab("root-home");
            window.history.pushState({}, '', '/');
          }} />
        </Suspense>
      ) : (
        <MainLayout
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          setActiveTab={setActiveTab}
          setActiveSubTab={setActiveSubTab}
          activeCodeCategory={activeCodeCategory}
          setActiveCodeCategory={setActiveCodeCategory}
          showUI={showUI}
        >
          <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-zinc-500">Loading...</div>}>
            {activeTab === "home" && (
              <HomeMainView 
                candlestickData={candlestickData} 
                onToggleUI={setShowUI} 
                onInitializeEngine={() => {
                  setActiveTab("trading-tools");
                  setActiveSubTab("leverage-view-v3");
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
            {(activeTab === "trading-tools" || activeTab === "archive-tools") && <TradingToolsView activeSubTab={activeSubTab} />}
            {activeTab === "profile" && <ProfileInfo />}
            {(activeTab === "code-concepts" || activeTab === "core-concepts" || activeTab === "math-primer") && (
              <CodeConceptsView 
                activeCategory={activeCodeCategory as any} 
                setActiveCategory={setActiveCodeCategory as any}
                onToggleUI={setShowUI}
                onExitSearch={() => {
                  setActiveTab("root-home");
                  window.history.pushState({}, '', '/');
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
