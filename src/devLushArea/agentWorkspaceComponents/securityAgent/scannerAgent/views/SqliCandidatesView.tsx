import React from 'react';
import { WebVulnCandidate } from '../utility/schema';
import WebExploitationDashboard from './WebExploitationDashboard';

interface SqliCandidatesViewProps {
  candidates: WebVulnCandidate[];
}

export default function SqliCandidatesView({ candidates }: SqliCandidatesViewProps) {
  // Pre-filter the candidates to only include SQLi
  const filtered = candidates.filter(c => c.vulnClass === 'SQLi');
  
  // Render the central dashboard with pre-configured props
  return (
    <WebExploitationDashboard 
      candidates={filtered} 
      initialSelectedClass='SQLi' 
      hideClassFilter={true} 
    />
  );
}
