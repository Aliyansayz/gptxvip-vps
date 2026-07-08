import React from 'react';
import { DnaToProtein } from '../bioLabTopics/genetics/DnaToProtein';
import { DNAReplication } from '../bioLabTopics/genetics/DNAReplication';
import { MendelianGenetics } from '../bioLabTopics/genetics/MendelianGenetics';

export const geneticsRegistry: Record<string, React.ComponentType<any>> = {
  'dna-to-protein': DnaToProtein,
  'interactive-dna-replication': DNAReplication,
  'mendelian-genetics': MendelianGenetics,
};
