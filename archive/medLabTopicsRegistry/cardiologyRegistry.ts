import React from 'react';
import { ECGSimulator } from '../medLabTopics/cardiology/ECGSimulator';
import { CardiologyOverview } from '../medLabTopics/cardiology/CardiologyOverview';
import { CardiologyDiagnostics } from '../medLabTopics/cardiology/CardiologyDiagnostics';
import { CardiologyAnatomy } from '../medLabTopics/cardiology/CardiologyAnatomy';
import { CardiologyHemodynamics } from '../medLabTopics/cardiology/CardiologyHemodynamics';
import { CardiologyImaging } from '../medLabTopics/cardiology/CardiologyImaging';
import { CardiologyLabs } from '../medLabTopics/cardiology/CardiologyLabs';
import { CardiologyPathology } from '../medLabTopics/cardiology/CardiologyPathology';
import { CardiologyPharmacology } from '../medLabTopics/cardiology/CardiologyPharmacology';
import { MyocardialInfarction } from '../medLabTopics/cardiology/MyocardialInfarction';

export const cardiologyRegistry: Record<string, React.ComponentType<any>> = {
  'cardio-anatomy': CardiologyAnatomy,
  'cardiology-ecg-basics': ECGSimulator,
  'cardio-hemodynamics': CardiologyHemodynamics,
  'cardio-imaging': CardiologyImaging,
  'cardio-labs': CardiologyLabs,
  'cardio-patho': CardiologyPathology,
  'cardiology-diagnostics': CardiologyDiagnostics,
  'cardio-pharma': CardiologyPharmacology,
  // MI Module
  'mi-pathophysiology': MyocardialInfarction,
  'mi-ecg-evolution': MyocardialInfarction,
  'mi-management': MyocardialInfarction,
};
