import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';

export const SupertrendRegimeSimulation: React.FC = () => {
  const { indicatorSettings } = useIndicatorsStore();
  const settings = indicatorSettings.supertrend_regime;
  
  return (
    <div className="w-full space-y-4">
      <CandlestickSimulator 
        config={{ 
          type: 'supertrend_regime', 
          stPeriod: settings.stPeriod,
          atrMultiplier: settings.atrMultiplier,
          regimePeriod: settings.regimePeriod,
          zPeriod: settings.zPeriod,
          zUpper: settings.zUpper,
          zLower: settings.zLower
        }} 
      />
    </div>
  );
};
