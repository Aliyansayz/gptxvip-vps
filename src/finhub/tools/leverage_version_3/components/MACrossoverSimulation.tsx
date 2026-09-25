import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';

export const MACrossoverSimulation: React.FC = () => {
  const { indicatorSettings } = useIndicatorsStore();
  const settings = indicatorSettings.ma_crossover;
  
  return (
    <div className="w-full space-y-4">
      <CandlestickSimulator 
        config={{ 
          type: 'ma_crossover', 
          fastMa: settings.fastMa, 
          slowMa: settings.slowMa 
        }} 
      />
    </div>
  );
};
