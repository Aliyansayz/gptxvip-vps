import React from 'react';
import { Physiology } from '../medLabTopics/physiology/Physiology';
import { CellularPhysiology } from '../medLabTopics/physiology/CellularPhysiology';
import { CardiovascularPhysiology } from '../medLabTopics/physiology/CardiovascularPhysiology';
import { RespiratoryPhysiology } from '../medLabTopics/physiology/RespiratoryPhysiology';
import { RenalPhysiology } from '../medLabTopics/physiology/RenalPhysiology';
import { EndocrinePhysiology } from '../medLabTopics/physiology/EndocrinePhysiology';
import { GastrointestinalPhysiology } from '../medLabTopics/physiology/GastrointestinalPhysiology';

export const physiologyRegistry: Record<string, React.ComponentType<any>> = {
  'physiology-overview': Physiology,
  'neurophysiology': Physiology,
  'cardiovascular-physiology': CardiovascularPhysiology,
  'cellular-physiology': CellularPhysiology,
  'respiratory-physiology': RespiratoryPhysiology,
  'renal-physiology': RenalPhysiology,
  'endocrine-physiology': EndocrinePhysiology,
  'gastrointestinal-physiology': GastrointestinalPhysiology,
};
