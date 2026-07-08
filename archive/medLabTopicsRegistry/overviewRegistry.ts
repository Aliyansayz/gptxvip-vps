import React from 'react';
import { MedOverview } from '../medLabTopics/overview/MedOverview';

export const overviewRegistry: Record<string, React.ComponentType<any>> = {
  'med-overview-intro': MedOverview,
};
