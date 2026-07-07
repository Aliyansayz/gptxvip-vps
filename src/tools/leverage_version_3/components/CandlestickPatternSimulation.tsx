import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';

export const CandlestickPatternSimulation: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <CandlestickSimulator 
        config={{ 
          type: 'candlestick_pattern'
        }} 
      />
    </div>
  );
};
