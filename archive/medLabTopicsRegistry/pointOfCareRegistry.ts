import React from 'react';
import { RapidDiagnosticsLab } from '../medLabTopics/point-of-care/RapidDiagnosticsLab';
import { POCTIntro } from '../medLabTopics/point-of-care/POCTIntro';
import { GlucoseLab } from '../medLabTopics/point-of-care/GlucoseLab';
import { CoagulationLab } from '../medLabTopics/point-of-care/CoagulationLab';
import { BedsideUrinalysis } from '../medLabTopics/point-of-care/BedsideUrinalysis';

export const pointOfCareRegistry: Record<string, React.ComponentType<any>> = {
  'point-of-care-rapid': RapidDiagnosticsLab, // Fallback/Legacy
  'poct-intro': POCTIntro,
  'poct-lateral-flow': RapidDiagnosticsLab,
  'poct-glucose': GlucoseLab,
  'poct-coag': CoagulationLab,
  'poct-cardiac': RapidDiagnosticsLab,
  'poct-infectious': RapidDiagnosticsLab,
  'poct-urinalysis': BedsideUrinalysis,
  'poct-fertility': RapidDiagnosticsLab,
};
