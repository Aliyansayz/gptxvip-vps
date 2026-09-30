import React, { useEffect, useRef, useState } from 'react';
import ThreatIntelAgentSidebar, { ThreatIntelSidebarView } from '../components/ThreatIntelAgentSidebar';
import ThreatIntelDashboardView from './ThreatIntelDashboardView';
import ThreatIntelToolsView from './ThreatIntelToolsView';
import ThreatIntelDataView from './ThreatIntelDataView';
import ThreatIntelTutorialTour from '../tutorial/ThreatIntelTutorialTour';
import AgentTheorySidebar from '../../../components/AgentTheorySidebar';
import { BookOpen, X, Terminal, Activity } from 'lucide-react';
import { SvgTheoryIllustration, SvgEmptyState } from '../../scannerAgent/components/ScannerIllustrations';
import { ActionSummary } from '../../../../../shared/components/ActionSummary';

export default function ThreatIntelAgentMainView() {
  const [sidebarView, setSidebarView] = useState<ThreatIntelSidebarView>('dashboard');
  const [isTheoryPaneOpen, setIsTheoryPaneOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(true);

  const [intelLogs, setIntelLogs] = useState<string[]>([]);
  const [intelStatus, setIntelStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const intelTimers = useRef<number[]>([]);
  const clearIntelTimers = () => { intelTimers.current.forEach(id => window.clearTimeout(id)); intelTimers.current = []; };
  useEffect(() => () => clearIntelTimers(), []);

  const handleRunTutorial = () => {
    setRunTutorial(false);
    setTimeout(() => {
      setRunTutorial(true);
    }, 100);
  };

  const investigateTarget = () => {
    clearIntelTimers();
    setSidebarView('targeted_alerts');
    setIntelStatus('running');
    setIntelLogs(['> Starting a prepared intelligence example. No feed or asset inventory queried.']);
    
    // Simulate investigation steps
    intelTimers.current = [
      window.setTimeout(() => setIntelLogs(prev => [...prev, '> Example observation: an unverified CVE discussion; original source and date unavailable.']), 1500),
      window.setTimeout(() => setIntelLogs(prev => [...prev, '> Example asset match: Nginx on Web-01; no internal inventory connected.']), 3000),
      window.setTimeout(() => setIntelLogs(prev => [...prev, '> Confidence remains unverified without source and asset evidence.']), 4500),
      window.setTimeout(() => setIntelLogs(prev => [...prev, '> Proposed analyst step: check a verified advisory and asset owner.']), 6000),
      window.setTimeout(() => { setIntelLogs(prev => [...prev, '> Sample contextualization complete. No alert or WAF rule was sent.']); setIntelStatus('done'); intelTimers.current = []; }, 7500),
    ];
  };

  const resetIntel = () => { clearIntelTimers(); setIntelStatus('idle'); setIntelLogs([]); setSidebarView('dashboard'); };

  const handleSidebarNavigate = (view: ThreatIntelSidebarView) => {
    setSidebarView(view);
    if (view === 'theory') {
      setIsTheoryPaneOpen(true);
    }
  };

  const showTheoryPane = isTheoryPaneOpen || sidebarView === 'theory';

  return (
    <div className="w-full h-full flex bg-slate-50 relative overflow-hidden">
      <ThreatIntelTutorialTour run={runTutorial} onFinish={() => setRunTutorial(false)} />

      <ThreatIntelAgentSidebar currentView={sidebarView} onNavigate={handleSidebarNavigate} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {sidebarView === 'dashboard' && (
            <ThreatIntelDashboardView onInvestigateTarget={investigateTarget} onRunTutorial={handleRunTutorial} />
          )}

          {sidebarView === 'tools' && (
            <div className="threat-intel-tools h-full">
               <ThreatIntelToolsView />
            </div>
          )}

          {sidebarView === 'targeted_alerts' && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto bg-slate-50 p-4 sm:p-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4"><ActionSummary input="Built-in indicator and asset example" action="Play a fixed contextualization sequence" result="Unverified observation with no connected source date" nextStep="Check a verified advisory and the affected asset owner" status={intelStatus} /><button type="button" onClick={resetIntel} className="mt-4 min-h-11 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">Stop and reset sample</button></div>
              <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-medium font-mono uppercase tracking-wider text-slate-700">Sample indicator trace</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-600">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase font-semibold">{intelStatus === 'running' ? 'Playing sample' : intelStatus === 'done' ? 'Sample complete' : 'Sample idle'}</span>
                  </div>
                </div>
                <div className="max-h-[24rem] min-h-44 flex-1 space-y-2 overflow-y-auto break-words p-4 font-mono text-sm text-slate-600 sm:p-6" aria-live="polite">
                  {intelLogs.length === 0 && (
                    <div className="text-slate-500 italic">No targeted alert currently under analysis. Return to the Command Center.</div>
                  )}
                  {intelLogs.map((log, i) => (
                    <div key={i} className={`${log.includes('CRITICAL') || log.includes('Action') ? 'text-purple-700 font-medium' : log.startsWith('>') ? 'text-slate-800' : 'text-slate-500'}`}>
                      {log}
                    </div>
                  ))}
                  {intelStatus === 'running' && <div className="text-purple-700">Preparing the next sample event…</div>}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other views */}
          {['global_feed', 'osint', 'darkweb', 'cve_monitor', 'settings'].includes(sidebarView) && (
            <ThreatIntelDataView viewType={sidebarView as any} />
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
              className="absolute right-4 top-4 z-50 flex min-h-11 min-w-11 items-center justify-center rounded-md bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <X className="w-4 h-4" />
            </button>
            <AgentTheorySidebar agentType="threat_intel" />
          </div>
        )}
      </div>

      {/* Fixed Toggle Button when closed */}
      {!showTheoryPane && (
        <button 
          onClick={() => setIsTheoryPaneOpen(true)}
          className="theory-wiki-trigger absolute right-0 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-l-lg shadow-[0_0_15px_rgba(147,51,234,0.4)] z-50 flex items-center justify-center transition-transform hover:-translate-x-1"
          title="Open Theory Wiki"
        >
          <BookOpen className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
