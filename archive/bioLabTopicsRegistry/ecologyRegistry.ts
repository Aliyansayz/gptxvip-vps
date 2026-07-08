
import React from 'react';
import { Ecology } from '../bioLabTopics/ecology/Ecology';
import { EnergyFlow } from '../bioLabTopics/ecology/EnergyFlow';

export const ecologyRegistry: Record<string, React.ComponentType<any>> = {
  'ecology-balance': Ecology,
  'energy-flow': EnergyFlow,
};
