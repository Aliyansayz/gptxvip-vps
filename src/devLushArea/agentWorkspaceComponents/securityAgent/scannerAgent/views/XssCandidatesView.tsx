import React from 'react';
import { WebVulnCandidate } from '../utility/schema';
import WebExploitationDashboard from './WebExploitationDashboard';

interface XssCandidatesViewProps {
  candidates: WebVulnCandidate[];
}

export default function XssCandidatesView({ candidates }: XssCandidatesViewProps) {
  // Pre-filter the candidates to only include XSS
  const filtered = candidates.filter(c => c.vulnClass === 'XSS');
  
  // Render the central dashboard with pre-configured props
  return (
    <WebExploitationDashboard 
      candidates={filtered} 
      initialSelectedClass='XSS' 
      hideClassFilter={true} 
    />
  );
}
