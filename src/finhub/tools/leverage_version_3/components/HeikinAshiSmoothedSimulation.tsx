import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';

export const HeikinAshiSmoothedSimulation: React.FC = () => {
  const { indicatorSettings } = useIndicatorsStore();
  const settings = indicatorSettings.heikin_ashi_smoothed;
  
  return (
    <div className="w-full space-y-4">
      <CandlestickSimulator 
        config={{ 
          type: 'heikin_ashi_smoothed', 
          haSmoothLen: settings.smoothLen 
        }} 
      />
    </div>
  );
};
