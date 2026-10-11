import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';

export const IchimokuSimulation: React.FC = () => {
  const { indicatorSettings } = useIndicatorsStore();
  return <CandlestickSimulator config={{ type: 'ichimoku', ...indicatorSettings.ichimoku }} />;
};
