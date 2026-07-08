
import React from 'react';
import { ImmunologyLab } from '../bioLabTopics/immunology/ImmunologyLab';
import { ImmunologyMemory } from '../bioLabTopics/immunology/ImmunologyMemory';

export const immunologyRegistry: Record<string, React.ComponentType<any>> = {
  'immunology-lab': ImmunologyLab,
  'immunology-memory': ImmunologyMemory,
};
