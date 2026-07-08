
import React from 'react';
import { HeartCirculation } from '../bioLabTopics/physiology/HeartCirculation';
import { RespiratorySystem } from '../bioLabTopics/physiology/RespiratorySystem';
import { RenalPhysiology } from '../bioLabTopics/physiology/RenalPhysiology';
import { MusclePhysiology } from '../bioLabTopics/physiology/MusclePhysiology';
import { DigestiveSystem } from '../bioLabTopics/physiology/DigestiveSystem';
import { EndocrineSystem } from '../bioLabTopics/physiology/EndocrineSystem';

export const physiologyRegistry: Record<string, React.ComponentType<any>> = {
  'physiology-heart': HeartCirculation,
  'physiology-respiratory': RespiratorySystem,
  'physiology-renal': RenalPhysiology,
  'physiology-muscle': MusclePhysiology,
  'physiology-digestive': DigestiveSystem,
  'physiology-endocrine': EndocrineSystem,
};
