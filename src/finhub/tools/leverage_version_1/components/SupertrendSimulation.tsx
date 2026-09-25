import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';

export const SupertrendSimulation: React.FC = () => {
  const { indicatorSettings } = useIndicatorsStore();
  const settings = indicatorSettings.supertrend;
  
  return (
    <div className="w-full space-y-4">
      <CandlestickSimulator 
        config={{ 
          type: 'supertrend', 
          supertrendPeriod: settings.period, 
          supertrendMultiplier: settings.multiplier 
        }} 
      />
    </div>
  );
};
