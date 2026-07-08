import React from 'react';
import AutonomousReconActivity from '../devLushTopics/cybersecurity/AutonomousReconActivity';
import WebBugBountyActivity from '../devLushTopics/web-bugbounty/WebBugBountyActivity';
import WebBugBountyDeveloperLensActivity from '../devLushTopics/web-bugbounty/WebBugBountyDeveloperLensActivity';
import WebBugBountySecurityLensActivity from '../devLushTopics/web-bugbounty/WebBugBountySecurityLensActivity';
import WebBugBountyBusinessLensActivity from '../devLushTopics/web-bugbounty/WebBugBountyBusinessLensActivity';
import AttackSurfaceDiscovery from '../devLushTopics/web-bugbounty/AttackSurfaceDiscovery';
import AuthorizationTesting from '../devLushTopics/web-bugbounty/AuthorizationTesting';
import SecurityToolsSimulators from '../devLushTopics/cybersecurity/SecurityToolsSimulators';
import ReadingActivity from '../devLushTopics/shared/ReadingActivity';
import SecOpsActivity from '../devLushTopics/cybersecurity/SecOpsActivity';

import XSSDomSandbox from '../devLushTopics/web-bugbounty/XSSDomSandbox';
import SQLiQueryBuilder from '../devLushTopics/web-bugbounty/SQLiQueryBuilder';
import SSRFCloudTopology from '../devLushTopics/web-bugbounty/SSRFCloudTopology';
import IDORIdentitySwitcher from '../devLushTopics/web-bugbounty/IDORIdentitySwitcher';
import CSRFAmbientAuthority from '../devLushTopics/web-bugbounty/CSRFAmbientAuthority';
import PathTraversalClimber from '../devLushTopics/web-bugbounty/PathTraversalClimber';
import CORSMisconfiguration from '../devLushTopics/web-bugbounty/CORSMisconfiguration';

import OffensiveAiSecurityLensActivity from '../devLushTopics/cybersecurity/OffensiveAiSecurityLensActivity';
import OffensiveAiDeveloperLensActivity from '../devLushTopics/cybersecurity/OffensiveAiDeveloperLensActivity';
import OffensiveAiBusinessLensActivity from '../devLushTopics/cybersecurity/OffensiveAiBusinessLensActivity';
import CybersecurityMorphologyActivity from '../devLushTopics/cybersecurity/CybersecurityMorphologyActivity';

export const cybersecurityRegistry: Record<string, React.ComponentType<any>> = {
  'offensive-ai-cybersecurity': AutonomousReconActivity,
  'offensive-ai-cybersecurity-developer-lens': OffensiveAiDeveloperLensActivity,
  'offensive-ai-cybersecurity-security-lens': OffensiveAiSecurityLensActivity,
  'offensive-ai-cybersecurity-business-lens': OffensiveAiBusinessLensActivity,
  'web-bugbounty-developer-lens': WebBugBountyDeveloperLensActivity,
  'web-bugbounty-security-lens': WebBugBountySecurityLensActivity,
  'web-bugbounty-business-lens': WebBugBountyBusinessLensActivity,
  'web-bugbounty-foundations': WebBugBountyActivity,
  'web-bugbounty-xss': XSSDomSandbox,
  'web-bugbounty-sqli': SQLiQueryBuilder,
  'web-bugbounty-ssrf': SSRFCloudTopology,
  'web-bugbounty-idor': IDORIdentitySwitcher,
  'web-bugbounty-csrf': CSRFAmbientAuthority,
  'web-bugbounty-lfi': PathTraversalClimber,
  'web-bugbounty-cors': CORSMisconfiguration,
  'security-tools-simulators': SecurityToolsSimulators,
  'attack-surface-discovery': AttackSurfaceDiscovery,
  'authorization-testing': AuthorizationTesting,
  'secops-agents': SecOpsActivity,
  'cybersecurity-morphology': CybersecurityMorphologyActivity,
};
