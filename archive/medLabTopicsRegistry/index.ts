
import React from 'react';

import { overviewRegistry } from './overviewRegistry';
import { physiologyRegistry } from './physiologyRegistry';
import { toxicologyRegistry } from './toxicologyRegistry';
import { cardiologyRegistry } from './cardiologyRegistry';
import { clinicalChemistryRegistry } from './clinicalChemistryRegistry';
import { clinicalLabRegistry } from './clinicalLabRegistry';
import { hematologyRegistry } from './hematologyRegistry';
import { pointOfCareRegistry } from './pointOfCareRegistry';
import { anatomyRegistry } from './anatomyRegistry';

export const medLabTopicsRegistry: Record<string, React.ComponentType<any>> = {
  ...overviewRegistry,
  ...anatomyRegistry,
  ...physiologyRegistry,
  ...toxicologyRegistry,
  ...cardiologyRegistry,
  ...clinicalChemistryRegistry,
  ...clinicalLabRegistry,
  ...hematologyRegistry,
  ...pointOfCareRegistry,
};
