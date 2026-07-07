import { WebVulnCandidate } from '../utility/schema';

export const initialWebVulnCandidates: WebVulnCandidate[] = [
  {
    id: 'vuln-1',
    vulnClass: 'XSS',
    endpoint: '/api/v1/users/profile',
    parameter: 'bio',
    context: 'Stored - Profile Description',
    confidenceScore: 'Confirmed',
    evidence: '<script>alert(1)</script> successfully executed on view profile.',
    timestamp: '1 hour ago',
    status: 'Open'
  },
  {
    id: 'vuln-2',
    vulnClass: 'SQLi',
    endpoint: '/api/v1/products',
    parameter: 'id',
    context: 'Error-based SQLi on product details',
    confidenceScore: 'Confirmed',
    evidence: 'id=1\' OR \'1\'=\'1 returns all products. Syntax error observed.',
    timestamp: '2 hours ago',
    status: 'Open'
  },
  {
    id: 'vuln-3',
    vulnClass: 'SSRF',
    endpoint: '/api/v1/fetch-url',
    parameter: 'url',
    context: 'Internal service access',
    confidenceScore: 'High',
    evidence: 'Able to fetch metadata from 169.254.169.254',
    timestamp: '3 hours ago',
    status: 'Investigating'
  },
  {
    id: 'vuln-4',
    vulnClass: 'Command Injection',
    endpoint: '/api/v1/ping',
    parameter: 'ip',
    context: 'OS Command Execution',
    confidenceScore: 'Confirmed',
    evidence: 'ip=127.0.0.1; id returned uid=0(root)',
    timestamp: '4 hours ago',
    status: 'Open'
  }
];
