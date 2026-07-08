import React from 'react';
import { UrinalysisLab } from '../medLabTopics/clinical-lab/UrinalysisLab';
import { BloodAnalysisLab } from '../medLabTopics/clinical-lab/BloodAnalysisLab';
import { MicrobiologyLab } from '../medLabTopics/clinical-lab/MicrobiologyLab';
import { ImmunologyLab } from '../medLabTopics/clinical-lab/ImmunologyLab';
import { ToxicologyLab as ClinicalToxicologyLab } from '../medLabTopics/clinical-lab/ToxicologyLab';
import { MorphologyLab } from '../medLabTopics/clinical-lab/MorphologyLab';

export const clinicalLabRegistry: Record<string, React.ComponentType<any>> = {
  // Clinical Lab Modules
  'urinalysis-lab': UrinalysisLab,
  'blood-analysis-lab': BloodAnalysisLab,
  'microbiology-lab': MicrobiologyLab,
  'immunology-lab': ImmunologyLab,
  'toxicology-lab': ClinicalToxicologyLab,
  'morphology-lab': MorphologyLab,
};
