import { ScannerAgentData, ScannerFinding } from './utility/schema';

export const getCriticalFindings = (data: ScannerAgentData): ScannerFinding[] => {
  return data.agent.findings.filter(finding => finding.severity === 'CRITICAL');
};

export const countFindingsBySeverity = (data: ScannerAgentData, severity: string): number => {
  return data.agent.findings.filter(finding => finding.severity === severity).length;
};

export const hasHighOrCriticalFindings = (data: ScannerAgentData): boolean => {
  return data.agent.findings.some(
    finding => finding.severity === 'CRITICAL' || finding.severity === 'HIGH'
  );
};
