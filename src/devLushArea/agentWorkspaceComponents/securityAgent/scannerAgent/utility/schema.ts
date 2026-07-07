export interface ScannerFinding {
  vulnerability: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  path: string;
}

export interface ScannerAgentData {
  agent: {
    id: string;
    name: string;
    status: 'idle' | 'active' | 'completed';
    findings: ScannerFinding[];
  };
}

export interface WebVulnCandidate {
  id: string;
  vulnClass: string;
  endpoint: string;
  parameter: string;
  context: string;
  confidenceScore: string;
  evidence: string;
  timestamp: string;
  status: string;
}
