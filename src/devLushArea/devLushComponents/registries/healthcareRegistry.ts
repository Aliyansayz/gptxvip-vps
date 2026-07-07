import React from 'react';
import HealthcareActivity from '../devLushTopics/healthcare/HealthcareActivity';

export const healthcareRegistry: Record<string, React.ComponentType<any>> = {
  'healthcare-agents': HealthcareActivity,
};
