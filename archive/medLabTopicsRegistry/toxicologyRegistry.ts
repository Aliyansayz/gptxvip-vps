import React from 'react';
import { Toxicology } from '../medLabTopics/toxicology/Toxicology';
import { ToxicologyLab } from '../medLabTopics/toxicology/ToxicologyLab';

export const toxicologyRegistry: Record<string, React.ComponentType<any>> = {
  'toxicology-overview': Toxicology,
  'clinical-toxicology': Toxicology,
  'environmental-toxicology': Toxicology,
  
  // New Toxicology Chapters
  'toxicology-intro': ToxicologyLab,
  'toxicology-mechanisms': ToxicologyLab,
  'toxicology-analytical': ToxicologyLab,
  'toxicology-tdm': ToxicologyLab,
  'toxicology-forensic': ToxicologyLab,
  'toxicology-environmental': ToxicologyLab,
  'toxicology-cases': ToxicologyLab,
};
