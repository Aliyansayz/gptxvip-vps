import React, { useState, useEffect, lazy, Suspense } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { generateMockData, generateCandlestickData } from "./functions/mockData";
import { PriceData, OHLCData } from "./types";

import { HomeMainView } from "./components/homeMainView";

// Lazy loading to improve Core Web Vitals (FCP, LCP, TBT, Speed Index)
const TradeTypeView = lazy(() => import("./views/TradeTypeView").then(module => ({ default: module.TradeTypeView })));
const CointegrationView = lazy(() => import("./views/CointegrationView").then(module => ({ default: module.CointegrationView })));
const KeyTermsView = lazy(() => import("./views/KeyTermsView").then(module => ({ default: module.KeyTermsView })));
const MapView = lazy(() => import("./views/MapView").then(module => ({ default: module.MapView })));
const OverviewView = lazy(() => import("./views/OverviewView").then(module => ({ default: module.OverviewView })));
const CodeConceptsView = lazy(() => import("./components/codeConceptsTopics/codeConceptsView/CodeConceptsView").then(module => ({ default: module.CodeConceptsView })));
const ProfileInfo = lazy(() => import("./components/profileInfo").then(module => ({ default: module.ProfileInfo })));
const TradingToolsView = lazy(() => import("./views/TradingToolsView").then(module => ({ default: module.TradingToolsView })));
const DevLushApp = lazy(() => import("./devLushArea/agentDevRootComponents/devLushAreaApp"));
const RoadmapContainer = lazy(() => import("./roadmapArea/roadmapView/RoadmapContainer"));

import { Toaster } from 'sonner';

export default function App() {
  const [chart1Data, setChart1Data] = useState<PriceData[]>([]);
  const [chart2Data, setChart2Data] = useState<PriceData[]>([]);
  const [candlestickData, setCandlestickData] = useState<OHLCData[]>([]);
  const [silverCandlestickData, setSilverCandlestickData] = useState<OHLCData[]>([]);
  const [activeTab, setActiveTab] = useState<
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
  >("home");
  const [activeSubTab, setActiveSubTab] = useState<string>("liquidity-depth");
  const [activeCodeCategory, setActiveCodeCategory] = useState<string>("general");
  const [showUI, setShowUI] = useState(true);

  useEffect(() => {
    setChart1Data(generateMockData(150, 2, 30));
    setChart2Data(generateMockData(2800, 15, 30));
    setCandlestickData(generateCandlestickData(100, 100));
    setSilverCandlestickData(generateCandlestickData(25.50, 100, 0.05)); // Silver prices around $25.50, lower absolute volatility
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      {activeTab === "dev-labs-workspace" ? (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-zinc-500">Loading Workspace...</div>}>
          <DevLushApp onExit={() => setActiveTab("home")} />
        </Suspense>
      ) : activeTab === "roadmap-workspace" ? (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-zinc-500">Loading Roadmap...</div>}>
          <RoadmapContainer onExit={() => setActiveTab("home")} />
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
            {activeTab === "code-concepts" && (
              <CodeConceptsView 
                activeCategory={activeCodeCategory as any} 
                setActiveCategory={setActiveCodeCategory as any}
                onToggleUI={setShowUI}
                onExitSearch={() => setActiveTab("home")}
              />
            )}
          </Suspense>
        </MainLayout>
      )}
    </>
  );
}
