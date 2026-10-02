import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';

export const BollingerBandsSimulation: React.FC = () => {
  const { indicatorSettings } = useIndicatorsStore();
  const settings = indicatorSettings.bollinger_bands || { period: 55, stdDev: 1 };
  
  return (
    <div className="w-full space-y-4">
      <CandlestickSimulator 
        config={{ 
          type: 'bollinger_bands', 
          bbPeriod: settings.period, 
          bbStdDev: settings.stdDev 
        }} 
      />
    </div>
  );
};
