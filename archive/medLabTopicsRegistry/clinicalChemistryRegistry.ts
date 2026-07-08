import React from 'react';
import { MetabolicPanel } from '../medLabTopics/clinical-chemistry/MetabolicPanel';
import { ClinicalBasics } from '../medLabTopics/clinical-chemistry/ClinicalBasics';
import { AcidBaseBalance } from '../medLabTopics/clinical-chemistry/AcidBaseBalance';
import { Enzymology } from '../medLabTopics/clinical-chemistry/Enzymology';
import { ProteinsLipids } from '../medLabTopics/clinical-chemistry/ProteinsLipids';
import { CarbMetabolism } from '../medLabTopics/clinical-chemistry/CarbMetabolism';

export const clinicalChemistryRegistry: Record<string, React.ComponentType<any>> = {
  'metabolic-panel': MetabolicPanel,
  // Clinical Chemistry Modules
  'clin-chem-basics': ClinicalBasics,
  'clin-chem-acid-base': AcidBaseBalance,
  'clin-chem-enzymology': Enzymology,
  'clin-chem-proteins': ProteinsLipids,
  'clin-chem-glucose': CarbMetabolism,
};
