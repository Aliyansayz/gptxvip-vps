import React, { useEffect, useRef, useState } from 'react';
import CloudPostureAgentSidebar, { CloudPostureSidebarView } from '../components/CloudPostureAgentSidebar';
import CloudPostureDashboardView from './CloudPostureDashboardView';
import CloudPostureToolsView from './CloudPostureToolsView';
import CloudPostureDataView from './CloudPostureDataView';
import CloudPostureTutorialTour from '../tutorial/CloudPostureTutorialTour';
import AgentTheorySidebar from '../../../components/AgentTheorySidebar';
import { BookOpen, X, Terminal, Activity } from 'lucide-react';
import { SvgTheoryIllustration, SvgEmptyState } from '../../scannerAgent/components/ScannerIllustrations';
import { ActionSummary } from '../../../../../shared/components/ActionSummary';

export default function CloudPostureAgentMainView() {
  const [sidebarView, setSidebarView] = useState<CloudPostureSidebarView>('dashboard');
  const [isTheoryPaneOpen, setIsTheoryPaneOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(true);

  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditStatus, setAuditStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const auditTimers = useRef<number[]>([]);
  const clearAuditTimers = () => { auditTimers.current.forEach(id => window.clearTimeout(id)); auditTimers.current = []; };
  useEffect(() => () => clearAuditTimers(), []);

  const auditResource = () => {
    clearAuditTimers();
    setSidebarView('misconfigurations');
    setAuditStatus('running');
    setAuditLogs(['> Starting a prepared cloud posture review. No AWS account is connected.', '> Example resource label: arn:aws:s3:::prod-customer-data-01']);
    
    // Simulate investigation steps
    auditTimers.current = [
      window.setTimeout(() => setAuditLogs(prev => [...prev, '> Example step: compare a prepared policy record with a stated baseline.']), 1500),
      window.setTimeout(() => setAuditLogs(prev => [...prev, '> Example finding: public-access control differs from the prepared baseline; severity is unverified.']), 3000),
      window.setTimeout(() => setAuditLogs(prev => [...prev, '> Proposed remediation: review a Terraform change with the resource owner.']), 4500),
      window.setTimeout(() => setAuditLogs(prev => [...prev, '> Review gate: confirm account, bucket owner, current policy, and change approval.']), 6000),
      window.setTimeout(() => { setAuditLogs(prev => [...prev, '> Sample review complete. No patch, cloud change, or notification was sent.']); setAuditStatus('done'); auditTimers.current = []; }, 7500),
    ];
  };

  const resetAudit = () => { clearAuditTimers(); setAuditStatus('idle'); setAuditLogs([]); setSidebarView('dashboard'); };

  const handleSidebarNavigate = (view: CloudPostureSidebarView) => {
    setSidebarView(view);
    if (view === 'theory') {
      setIsTheoryPaneOpen(true);
    }
  };

  const showTheoryPane = isTheoryPaneOpen || sidebarView === 'theory';

  return (
    <div className="w-full h-full flex bg-slate-50 relative overflow-hidden">
      <CloudPostureTutorialTour run={runTutorial} onFinish={() => setRunTutorial(false)} />

      <CloudPostureAgentSidebar currentView={sidebarView} onNavigate={handleSidebarNavigate} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {sidebarView === 'dashboard' && (
            <CloudPostureDashboardView onAuditResource={auditResource} />
          )}

          {sidebarView === 'tools' && (
            <div className="cloud-posture-tools h-full">
               <CloudPostureToolsView />
            </div>
          )}

          {sidebarView === 'misconfigurations' && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto bg-slate-50 p-4 sm:p-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4"><ActionSummary input="Prepared S3 bucket policy record" action="Compare sample policy and baseline" result="Example drift; account and current policy unverified" nextStep="Confirm owner and approval before preparing a real change" status={auditStatus} /><button type="button" onClick={resetAudit} className="mt-4 min-h-11 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Stop and reset sample</button></div>
              <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-medium font-mono uppercase tracking-wider text-slate-700">Sample posture review trace</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase font-semibold">{auditStatus === 'running' ? 'Playing sample' : auditStatus === 'done' ? 'Sample complete' : 'Sample idle'}</span>
                  </div>
                </div>
                <div className="max-h-[24rem] min-h-44 flex-1 space-y-2 overflow-y-auto break-words p-4 font-mono text-sm text-slate-600 sm:p-6" aria-live="polite">
                  {auditLogs.length === 0 && (
                    <div className="text-slate-500 italic">No remediation workflow active. Return to the Command Center to initiate a fix.</div>
                  )}
                  {auditLogs.map((log, i) => (
                    <div key={i} className={`${log.includes('CRITICAL') || log.includes('SUCCESS') ? 'text-blue-700 font-medium' : log.startsWith('>') ? 'text-slate-800' : 'text-slate-500'}`}>
                      {log}
                    </div>
                  ))}
                  {auditStatus === 'running' && <div className="text-blue-700">Preparing the next sample event…</div>}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other views */}
          {['drift', 'iam_audit', 'data_security', 'compliance', 'settings'].includes(sidebarView) && (
            <CloudPostureDataView viewType={sidebarView as any} />
          )}
          
          {sidebarView === 'theory' && (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
              <SvgTheoryIllustration />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Theory Wiki Pane is Open</h3>
              <p className="text-sm">Check the right side of your screen to access the theory library.</p>
            </div>
          )}

        </div>
        
        {/* Right Side Theory Pane */}
        {showTheoryPane && (
          <div className="absolute inset-0 z-40 flex h-full w-full flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl motion-reduce:animate-none lg:relative lg:inset-auto lg:w-[450px] lg:max-w-[40vw] lg:shrink-0">
            <button 
              onClick={() => {
                 setIsTheoryPaneOpen(false);
                 if (sidebarView === 'theory') setSidebarView('dashboard');
              }}
              aria-label="Close theory panel"
              className="absolute right-4 top-4 z-50 flex min-h-11 min-w-11 items-center justify-center rounded-md bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X className="w-4 h-4" />
            </button>
            <AgentTheorySidebar agentType="cloud_posture" />
          </div>
        )}
      </div>

      {/* Fixed Toggle Button when closed */}
      {!showTheoryPane && (
        <button 
          onClick={() => setIsTheoryPaneOpen(true)}
          className="theory-wiki-trigger absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-l-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] z-50 flex items-center justify-center transition-transform hover:-translate-x-1"
          title="Open Theory Wiki"
        >
          <BookOpen className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
