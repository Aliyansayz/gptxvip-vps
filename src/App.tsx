import React, { useState, useEffect } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { generateMockData, generateCandlestickData } from "./functions/mockData";
import { PriceData, OHLCData } from "./types";

import { TradeTypeView } from "./views/TradeTypeView";
import { CointegrationView } from "./views/CointegrationView";
import { KeyTermsView } from "./views/KeyTermsView";
import { MapView } from "./views/MapView";
import { ProjectJourneyView } from "./views/ProjectJourneyView";
import { OverviewView } from "./views/OverviewView";
import { CodeConceptsView } from "./components/codeConceptsTopics/codeConceptsView/CodeConceptsView";
import { HomeMainView } from "./components/homeMainView";
import { ProfileInfo } from "./components/profileInfo";
import { TradingToolsView } from "./views/TradingToolsView";

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
      <MainLayout
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        setActiveTab={setActiveTab}
        setActiveSubTab={setActiveSubTab}
        activeCodeCategory={activeCodeCategory}
        setActiveCodeCategory={setActiveCodeCategory}
        showUI={showUI}
      >
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
      </MainLayout>
    </>
  );
}
