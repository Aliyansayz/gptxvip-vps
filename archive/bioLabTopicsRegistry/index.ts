
import { cellularBiologyRegistry } from './cellularBiologyRegistry';
import { geneticsRegistry } from './geneticsRegistry';
import { ecologyRegistry } from './ecologyRegistry';
import { pathologyRegistry } from './pathologyRegistry';
import { pharmacologyRegistry } from './pharmacologyRegistry';
import { physiologyRegistry } from './physiologyRegistry';
import { developmentalBiologyRegistry } from './developmentalBiologyRegistry';
import { neuroscienceRegistry } from './neuroscienceRegistry';
import { immunologyRegistry } from './immunologyRegistry';
import { microbiologyRegistry } from './microbiologyRegistry';
import { proteomicsRegistry } from './proteomicsRegistry';
import { geneticEngineeringRegistry } from './geneticEngineeringRegistry';

export const bioLabTopicsRegistry = {
  ...cellularBiologyRegistry,
  ...geneticsRegistry,
  ...ecologyRegistry,
  ...pathologyRegistry,
  ...pharmacologyRegistry,
  ...physiologyRegistry,
  ...developmentalBiologyRegistry,
  ...neuroscienceRegistry,
  ...immunologyRegistry,
  ...microbiologyRegistry,
  ...proteomicsRegistry,
  ...geneticEngineeringRegistry,
};
