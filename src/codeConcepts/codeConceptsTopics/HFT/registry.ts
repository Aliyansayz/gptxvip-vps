import React from 'react';
import { GoldVolatilityWorkflow, TimeHorizonVolatility } from './visual';

export const hftRegistry: Record<string, React.FC<any>> = {
  'mp_hft_gold_workflow': GoldVolatilityWorkflow,
  'mp_hft_time_horizon': TimeHorizonVolatility,
};
