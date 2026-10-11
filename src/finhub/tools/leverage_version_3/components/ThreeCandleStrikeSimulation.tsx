import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';

export const ThreeCandleStrikeSimulation: React.FC = () => {
  const { indicatorSettings } = useIndicatorsStore();
  return <CandlestickSimulator config={{ type: 'three_candle_strike', ...indicatorSettings.three_candle_strike }} />;
};
