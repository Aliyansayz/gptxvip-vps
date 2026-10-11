import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';

export const TurtleTradingSimulation: React.FC = () => {
  const { indicatorSettings } = useIndicatorsStore();
  return <CandlestickSimulator config={{ type: 'turtle_trading', ...indicatorSettings.turtle_trading }} />;
};
