import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MACrossoverSimulation } from "./MACrossoverSimulation";
import { StochasticCrossoverSimulation } from "./StochasticCrossoverSimulation";
import { SupertrendSimulation } from "./SupertrendSimulation";
import { DivergenceSimulation } from "./DivergenceSimulation";
import { LinearRegressionSimulation } from "./LinearRegressionSimulation";
import { BollingerBandsSimulation } from "./BollingerBandsSimulation";
import { SupertrendRegimeSimulation } from "./SupertrendRegimeSimulation";
import { HeikinAshiSmoothedSimulation } from "./HeikinAshiSmoothedSimulation";
import { CandlestickPatternSimulation } from "./CandlestickPatternSimulation";
import { LabHeader } from "./lab/LabHeader";
import { LabNavigation, ToolTab } from "./lab/LabNavigation";
import { LabStatus } from "./lab/LabStatus";
import { IndicatorSettingsPanel } from "./lab/IndicatorSettingsPanel";
import { VolatilitySettingsPanel } from "./lab/VolatilitySettingsPanel";
import { VolatilityRegimeSettingsPanel } from "./lab/VolatilityRegimeSettingsPanel";
import { TrendStrengthSettingsPanel } from "./lab/TrendStrengthSettingsPanel";
import { StopLossIndicatorSettingsPanel } from "./lab/StopLossIndicatorSettingsPanel";
import { SmoothingIndicatorPanel } from "./lab/SmoothingIndicatorPanel";
import { ExitSignalRuleSettingsPanel } from "./lab/ExitSignalRuleSettingsPanel";
import { TradingPanelDataSettings } from "./simulator/TradingPanelDataSettings";
import { ConjunctionSimulation } from "./ConjunctionSimulation";

export const TradingToolsLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolTab>("stochastic");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`flex flex-col gap-6 w-full ${isExpanded ? 'fixed inset-0 z-50 p-6 md:p-12 pb-24 bg-zinc-950 text-zinc-50 overflow-y-auto' : 'h-full p-6 bg-zinc-900 border border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-xl overflow-hidden backdrop-blur-sm z-20 relative text-zinc-50'} font-mono transition-all duration-300`}>
      {isExpanded && <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-500 via-zinc-900 to-transparent pointer-events-none" />}
      
      <div className={isExpanded ? 'relative z-10 w-full max-w-[1800px] mx-auto min-h-full flex flex-col' : 'flex-1 flex flex-col min-h-0 w-full'}>
        <LabHeader 
          isExpanded={isExpanded} 
          onToggleExpand={() => setIsExpanded(!isExpanded)} 
        />
        
        <LabStatus />
        
        <LabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <div className="w-full flex-1 flex flex-col pt-2 pb-6 min-h-0">
          <IndicatorSettingsPanel activeTab={activeTab} />
          <VolatilitySettingsPanel />
          <VolatilityRegimeSettingsPanel />
          <TrendStrengthSettingsPanel />
          <StopLossIndicatorSettingsPanel />
          <SmoothingIndicatorPanel />
          <ExitSignalRuleSettingsPanel />
          <TradingPanelDataSettings />
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 w-full flex flex-col min-h-0 shrink-0"
            >
              <div className="p-2 flex-1 flex flex-col min-h-0 text-zinc-300">
                 {activeTab === 'ma_crossover' && <MACrossoverSimulation />}
                 {activeTab === 'stochastic' && <StochasticCrossoverSimulation />}
                 {activeTab === 'supertrend' && <SupertrendSimulation />}
                 {activeTab === 'divergence' && <DivergenceSimulation />}
                 {activeTab === 'linear_regression' && <LinearRegressionSimulation />}
                 {activeTab === 'bollinger_bands' && <BollingerBandsSimulation />}
                 {activeTab === 'supertrend_regime' && <SupertrendRegimeSimulation />}
                 {activeTab === 'heikin_ashi_smoothed' && <HeikinAshiSmoothedSimulation />}
                 {activeTab === 'candlestick_pattern' && <CandlestickPatternSimulation />}
                 {activeTab === 'conjunction' && <ConjunctionSimulation />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
