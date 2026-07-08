
import React from 'react';
import { EmbryoDevelopment } from '../bioLabTopics/developmental-biology/EmbryoDevelopment';
import { CellDivision } from '../bioLabTopics/developmental-biology/CellDivision';
import { GeneticExpression } from '../bioLabTopics/developmental-biology/GeneticExpression';
import { AdvancedMorphogenesis } from '../bioLabTopics/developmental-biology/AdvancedMorphogenesis';
import CleavageSimulatorActivity from '../bioLabTopics/developmental-biology/CleavageSimulatorActivity';
import MorphogenGradientActivity from '../bioLabTopics/developmental-biology/MorphogenGradientActivity';
import WaddingtonsLandscapeActivity from '../bioLabTopics/developmental-biology/WaddingtonsLandscapeActivity';
import HoxGeneBuilderActivity from '../bioLabTopics/developmental-biology/HoxGeneBuilderActivity';

export const developmentalBiologyRegistry: Record<string, React.ComponentType<any>> = {
  'embryo-development': EmbryoDevelopment,
  'dev-bio-cell-division': CellDivision,
  'dev-bio-gene-expression': GeneticExpression,
  'advanced-morphogenesis': AdvancedMorphogenesis,
  'cleavage-simulator': CleavageSimulatorActivity,
  'morphogen-gradient': MorphogenGradientActivity,
  'waddingtons-landscape': WaddingtonsLandscapeActivity,
  'hox-gene-builder': HoxGeneBuilderActivity,
};
