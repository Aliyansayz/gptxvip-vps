import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';

export const StochasticCrossoverSimulation: React.FC = () => {
  const { indicatorSettings } = useIndicatorsStore();
  const settings = indicatorSettings.stochastic;
  
  return (
    <div className="w-full space-y-4">
      <CandlestickSimulator 
        config={{ 
          type: 'stochastic', 
          stochK: settings.stochK, 
          stochD: settings.stochD 
        }} 
      />
    </div>
  );
};
