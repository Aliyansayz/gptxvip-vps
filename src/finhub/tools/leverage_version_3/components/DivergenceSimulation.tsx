import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';

export const DivergenceSimulation: React.FC = () => {
  const { indicatorSettings } = useIndicatorsStore();
  const settings = indicatorSettings.divergence;
  
  return (
    <div className="w-full space-y-4">
      <CandlestickSimulator 
        config={{ 
          type: 'divergence',
          stochK: settings.stochK,
          stochD: settings.stochD
        }} 
      />
    </div>
  );
};
