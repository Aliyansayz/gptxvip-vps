import React from 'react';
import { CellularProcesses } from '../bioLabTopics/cellular-biology/CellularProcesses';
import { CellOrganelles } from '../bioLabTopics/cellular-biology/CellOrganelles';
import { CellularRespiration } from '../bioLabTopics/cellular-biology/CellularRespiration';

export const cellularBiologyRegistry: Record<string, React.ComponentType<any>> = {
  'cell-membrane-transport': CellularProcesses,
  'cell-organelles': CellOrganelles,
  'cellular-respiration': CellularRespiration,
};
