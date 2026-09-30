import React, { useEffect, useRef, useState } from 'react';
import DfirAgentSidebar, { DfirSidebarView } from '../components/DfirAgentSidebar';
import DfirDashboardView from './DfirDashboardView';
import DfirToolsView from './DfirToolsView';
import DfirDataView from './DfirDataView';
import DfirTutorialTour from '../tutorial/DfirTutorialTour';
import AgentTheorySidebar from '../../../components/AgentTheorySidebar';
import { BookOpen, X, Terminal, Activity } from 'lucide-react';
import { SvgTheoryIllustration, SvgEmptyState } from '../../scannerAgent/components/ScannerIllustrations';
import { ActionSummary } from '../../../../../shared/components/ActionSummary';

export default function DfirAgentMainView() {
  const [sidebarView, setSidebarView] = useState<DfirSidebarView>('dashboard');
  const [isTheoryPaneOpen, setIsTheoryPaneOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(true);

  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [investigationStatus, setInvestigationStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const investigationTimers = useRef<number[]>([]);
  const clearInvestigationTimers = () => { investigationTimers.current.forEach(id => window.clearTimeout(id)); investigationTimers.current = []; };
  useEffect(() => () => clearInvestigationTimers(), []);

  const startInvestigation = () => {
    clearInvestigationTimers();
    setSidebarView('investigations');
    setInvestigationStatus('running');
    setScanLogs(['> Starting a prepared DFIR timeline. No endpoint or SIEM queried.', '> Example host label: 192.168.1.104']);
    
    // Simulate investigation steps
    investigationTimers.current = [
      window.setTimeout(() => setScanLogs(prev => [...prev, '> Example evidence step: inspect a prepared network trace.']), 1000),
      window.setTimeout(() => setScanLogs(prev => [...prev, '> Example signal: outbound beaconing to documentation IP 203.0.113.50; source artifact unavailable.']), 2500),
      window.setTimeout(() => setScanLogs(prev => [...prev, '> Example evidence step: inspect a prepared memory-analysis summary.']), 4000),
      window.setTimeout(() => setScanLogs(prev => [...prev, '> Example finding: suspicious process name in the sample; not verified on a host.']), 5500),
      window.setTimeout(() => { setScanLogs(prev => [...prev, '> Sample timeline complete. Review evidence before any containment action.']); setInvestigationStatus('done'); investigationTimers.current = []; }, 7000),
    ];
  };

  const resetInvestigation = () => { clearInvestigationTimers(); setInvestigationStatus('idle'); setScanLogs([]); setSidebarView('dashboard'); };

  const handleSidebarNavigate = (view: DfirSidebarView) => {
    setSidebarView(view);
    if (view === 'theory') {
      setIsTheoryPaneOpen(true);
    }
  };

  const showTheoryPane = isTheoryPaneOpen || sidebarView === 'theory';

  return (
    <div className="w-full h-full flex bg-slate-50 relative overflow-hidden">
      <DfirTutorialTour run={runTutorial} onFinish={() => setRunTutorial(false)} />

      <DfirAgentSidebar currentView={sidebarView} onNavigate={handleSidebarNavigate} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {sidebarView === 'dashboard' && (
            <DfirDashboardView onStartInvestigation={startInvestigation} />
          )}

          {sidebarView === 'tools' && (
            <div className="dfir-tools-panel h-full">
               <DfirToolsView />
            </div>
          )}

          {sidebarView === 'investigations' && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto bg-slate-50 p-4 sm:p-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4"><ActionSummary input="Prepared incident INC-9942; no connected evidence" action="Play an illustrative triage timeline" result="Sample signals with no attached PCAP or memory artifact" nextStep="Validate the evidence chain and seek approval before containment" status={investigationStatus} /><button type="button" onClick={resetInvestigation} className="mt-4 min-h-11 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">Stop and reset sample</button></div>
              <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-medium font-mono uppercase tracking-wider text-slate-700">Sample incident timeline</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase font-semibold">{investigationStatus === 'running' ? 'Playing sample' : investigationStatus === 'done' ? 'Sample complete' : 'Sample idle'}</span>
                  </div>
                </div>
                <div className="max-h-[24rem] min-h-44 flex-1 space-y-2 overflow-y-auto break-words p-4 font-mono text-sm text-slate-600 sm:p-6" aria-live="polite">
                  {scanLogs.length === 0 && (
                    <div className="text-slate-500 italic">No active investigation running. Return to the Command Center to triage an alert.</div>
                  )}
                  {scanLogs.map((log, i) => (
                    <div key={i} className={`${log.includes('CRITICAL') || log.includes('WARN') ? 'text-red-600 font-medium' : log.startsWith('>') ? 'text-slate-800' : 'text-slate-500'}`}>
                      {log}
                    </div>
                  ))}
                  {investigationStatus === 'running' && <div className="text-sky-700">Preparing the next sample event…</div>}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other views */}
          {['queue', 'activity', 'iocs', 'containment', 'settings'].includes(sidebarView) && (
            <DfirDataView viewType={sidebarView as any} />
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
              className="absolute right-4 top-4 z-50 flex min-h-11 min-w-11 items-center justify-center rounded-md bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <X className="w-4 h-4" />
            </button>
            <AgentTheorySidebar agentType="dfir" />
          </div>
        )}
      </div>

      {/* Fixed Toggle Button when closed */}
      {!showTheoryPane && (
        <button 
          onClick={() => setIsTheoryPaneOpen(true)}
          className="theory-wiki-trigger absolute right-0 top-1/2 -translate-y-1/2 bg-sky-600 hover:bg-sky-700 text-white p-2.5 rounded-l-lg shadow-[0_0_15px_rgba(14,165,233,0.4)] z-50 flex items-center justify-center transition-transform hover:-translate-x-1"
          title="Open Theory Wiki"
        >
          <BookOpen className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
