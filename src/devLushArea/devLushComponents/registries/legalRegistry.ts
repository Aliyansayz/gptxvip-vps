import React from 'react';
import LegalActivity from '../devLushTopics/legal/LegalActivity';

export const legalRegistry: Record<string, React.ComponentType<any>> = {
  'legal-agents': LegalActivity,
  'legal-ip-protection': LegalActivity,
  'legal-mna-due-diligence': LegalActivity,
  'legal-liability-cap': LegalActivity,
};
