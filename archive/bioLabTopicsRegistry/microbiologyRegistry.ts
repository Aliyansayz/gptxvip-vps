
import React from 'react';
import { MicrobiologyLab } from '../bioLabTopics/microbiology/MicrobiologyLab';
import { AntibioticResistance } from '../bioLabTopics/microbiology/AntibioticResistance';

export const microbiologyRegistry: Record<string, React.ComponentType<any>> = {
  'microbiology-lab': MicrobiologyLab,
  'microbiology-resistance': AntibioticResistance,
};
