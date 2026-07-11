import React from 'react';
import LegalAgentsActivity from '../devLushTopics/legal/LegalAgentsActivity';
import LegalIpProtectionActivity from '../devLushTopics/legal/LegalIpProtectionActivity';
import LegalMnaDueDiligenceActivity from '../devLushTopics/legal/LegalMnaDueDiligenceActivity';
import LegalLiabilityCapActivity from '../devLushTopics/legal/LegalLiabilityCapActivity';
import LegalTaxComplianceActivity from '../devLushTopics/legal/LegalTaxComplianceActivity';

export const legalRegistry: Record<string, React.ComponentType<any>> = {
  'legal-agents': LegalAgentsActivity,
  'legal-ip-protection': LegalIpProtectionActivity,
  'legal-mna-due-diligence': LegalMnaDueDiligenceActivity,
  'legal-liability-cap': LegalLiabilityCapActivity,
  'legal-tax-compliance': LegalTaxComplianceActivity,
};
