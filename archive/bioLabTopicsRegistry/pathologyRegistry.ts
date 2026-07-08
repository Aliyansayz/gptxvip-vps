
import React from 'react';
import { Pathology } from '../bioLabTopics/pathology/Pathology';
import { TissueChanges } from '../bioLabTopics/pathology/TissueChanges';
import { DiseaseMechanisms } from '../bioLabTopics/pathology/DiseaseMechanisms';

export const pathologyRegistry: Record<string, React.ComponentType<any>> = {
  'pathology-intro': Pathology,
  'pathology-tissue-changes': TissueChanges,
  'pathology-disease-mechanisms': DiseaseMechanisms,
};
