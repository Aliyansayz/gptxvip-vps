import React from 'react';
import { HematologyBloodSmear } from '../medLabTopics/hematology/HematologyBloodSmear';
import { HematologyRBC } from '../medLabTopics/hematology/HematologyRBC';
import { HematologyWBC } from '../medLabTopics/hematology/HematologyWBC';
import { HematologyMalignancy } from '../medLabTopics/hematology/HematologyMalignancy';
import { HematologyPlatelets } from '../medLabTopics/hematology/HematologyPlatelets';
import { HematologyMarrow } from '../medLabTopics/hematology/HematologyMarrow';
import { HematologyTechniques } from '../medLabTopics/hematology/HematologyTechniques';
import { HematologyMorphologyChallenge } from '../medLabTopics/hematology/HematologyMorphologyChallenge';

export const hematologyRegistry: Record<string, React.ComponentType<any>> = {
  // Hematology
  'hematology-blood-smear': HematologyBloodSmear,
  'hematology-rbc': HematologyRBC,
  'hematology-wbc': HematologyWBC,
  'hematology-malignancy': HematologyMalignancy,
  'hematology-platelets': HematologyPlatelets,
  'hematology-marrow': HematologyMarrow,
  'hematology-techniques': HematologyTechniques,
  'hematology-morphology-challenge': HematologyMorphologyChallenge,
};
