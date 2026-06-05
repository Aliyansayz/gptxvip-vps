import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';

export const LinearRegressionSimulation: React.FC = () => {
  const { indicatorSettings } = useIndicatorsStore();
  const settings = indicatorSettings.linear_regression;
  
  return (
    <div className="w-full space-y-4">
      <CandlestickSimulator 
        config={{ 
          type: 'linear_regression', 
          lrSlopePeriod: settings.slopePeriod,
          lrVolPeriod: settings.volPeriod,
          lrRegimePeriod: settings.regimePeriod
        }} 
      />
    </div>
  );
};
