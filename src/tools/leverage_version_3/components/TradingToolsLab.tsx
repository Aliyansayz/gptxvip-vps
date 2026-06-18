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
import { ExitSignalRuleSettingsPanel } from "./lab/ExitSignalRule/ExitSignalRuleSettingsPanel";
import { TradingPanelDataSettings } from "./simulator/TradingPanelDataSettings";
import { ConjunctionSimulation } from "./ConjunctionSimulation";
import { CollapsiblePresetMenu } from "./lab/CollapsiblePresetMenu";
import { MultiInstanceDashboard } from "./MultiInstanceDashboard";

export interface TradingToolsLabProps {
  isParallelModeActive?: boolean;
  onToggleParallelMode?: () => void;
}

export const TradingToolsLab: React.FC<TradingToolsLabProps> = ({ isParallelModeActive, onToggleParallelMode }) => {
  const [activeTab, setActiveTab] = useState<ToolTab>("stochastic");
  const [localParallel, setLocalParallel] = useState(false);

  // If onToggleParallelMode is not provided from parent, and localParallel is true,
  // we render the MultiInstanceDashboard locally which will in turn render 
  // instances of this component with the active mode props.
  if (!onToggleParallelMode && localParallel) {
    return <MultiInstanceDashboard onExitParallelMode={() => setLocalParallel(false)} />;
  }

  const handleToggleParallel = onToggleParallelMode || (() => setLocalParallel(true));
  const isParallelActive = isParallelModeActive !== undefined ? isParallelModeActive : localParallel;

  return (
    <div className="flex flex-col w-full h-full bg-zinc-950 text-zinc-50 font-mono overflow-y-auto">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-500 via-zinc-900 to-transparent pointer-events-none" />
      
      <div className="relative z-10 w-full min-h-full flex flex-col pt-4">
        <LabHeader 
          isParallelModeActive={isParallelActive}
          onToggleParallelMode={handleToggleParallel}
        />
        
        <LabStatus />
        
        <LabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <div className="w-full flex-1 flex flex-col pt-2 pb-6 min-h-0 px-6 md:px-12">
          <IndicatorSettingsPanel activeTab={activeTab} />
          <VolatilitySettingsPanel />
          <VolatilityRegimeSettingsPanel />
          <TrendStrengthSettingsPanel />
          <StopLossIndicatorSettingsPanel />
          <SmoothingIndicatorPanel />
          <ExitSignalRuleSettingsPanel entrySystemType={activeTab} />
          <TradingPanelDataSettings />
          <CollapsiblePresetMenu />
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
