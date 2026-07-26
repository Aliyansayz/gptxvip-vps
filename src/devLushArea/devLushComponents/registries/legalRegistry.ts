import React from 'react';
import LegalAgentsActivity from '../devLushTopics/legal/LegalAgentsActivity';
import LegalIpProtectionActivity from '../devLushTopics/legal/LegalIpProtectionActivity';
import LegalMnaDueDiligenceActivity from '../devLushTopics/legal/LegalMnaDueDiligenceActivity';
import LegalLiabilityCapActivity from '../devLushTopics/legal/LegalLiabilityCapActivity';
import LegalTaxComplianceActivity from '../devLushTopics/legal/LegalTaxComplianceActivity';
import LegalCrossBorderTaxActivity from '../devLushTopics/legal/LegalCrossBorderTaxActivity';
import LegalOffshoreAssetsActivity from '../devLushTopics/legal/LegalOffshoreAssetsActivity';
import LegalGlobalMobilityActivity from '../devLushTopics/legal/LegalGlobalMobilityActivity';
import LegalVisaProcessingActivity from '../devLushTopics/legal/LegalVisaProcessingActivity';
import LegalAsylumDefenseActivity from '../devLushTopics/legal/LegalAsylumDefenseActivity';
import LegalImmigrationAppealsActivity from '../devLushTopics/legal/LegalImmigrationAppealsActivity';

export const legalRegistry: Record<string, React.ComponentType<any>> = {
  'legal-agents': LegalAgentsActivity,
  'legal-ip-protection': LegalIpProtectionActivity,
  'legal-mna-due-diligence': LegalMnaDueDiligenceActivity,
  'legal-liability-cap': LegalLiabilityCapActivity,
  'legal-tax-compliance': LegalTaxComplianceActivity,
  'legal-cross-border-tax': LegalCrossBorderTaxActivity,
  'legal-offshore-assets': LegalOffshoreAssetsActivity,
  'legal-global-mobility': LegalGlobalMobilityActivity,
  'legal-visa-processing': LegalVisaProcessingActivity,
  'legal-asylum-defense': LegalAsylumDefenseActivity,
  'legal-immigration-appeals': LegalImmigrationAppealsActivity,
};
