
import React from 'react';
import { Pharmacology } from '../bioLabTopics/pharmacology/Pharmacology';
import { DrugMetabolism } from '../bioLabTopics/pharmacology/DrugMetabolism';
import { DrugInteractions } from '../bioLabTopics/pharmacology/DrugInteractions';

export const pharmacologyRegistry: Record<string, React.ComponentType<any>> = {
  'pharmacology-dose-response': Pharmacology,
  'pharmacology-drug-metabolism': DrugMetabolism,
  'pharmacology-drug-interactions': DrugInteractions,
};
