
import React from 'react';
import { ProteomicsLab } from '../bioLabTopics/proteomics/ProteomicsLab';

export const proteomicsRegistry: Record<string, React.ComponentType<any>> = {
  'proteomics-lab': ProteomicsLab, // Fallback
  'proteomics-structure': ProteomicsLab,
  'proteomics-techniques': ProteomicsLab,
};
