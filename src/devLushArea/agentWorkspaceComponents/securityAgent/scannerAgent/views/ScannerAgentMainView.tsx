import React, { useEffect, useRef, useState } from 'react';
import { WebVulnCandidate } from '../utility/schema';
import WebExploitationDashboard from './WebExploitationDashboard';
import RemediationPlanView from './RemediationPlanView';
import ScannerDashboardView from './ScannerDashboardView';
import AgentTheorySidebar from '../../../components/AgentTheorySidebar';
import AgentSidebar, { SidebarView } from '../../../components/AgentSidebar';
import { initialWebVulnCandidates } from '../data/mockSecurityData';
import ScannerActivityView from './ScannerActivityView';
import ScannerQueueView from './ScannerQueueView';
import ScannerAgentsView from './ScannerAgentsView';
import ScannerMissionsView from './ScannerMissionsView';
import ScannerSkillsView from './ScannerSkillsView';
import ScannerReconView from './ScannerReconView';
import ScannerMemoryView from './ScannerMemoryView';
import ScannerAnalyticsView from './ScannerAnalyticsView';
import ScannerSettingsView from './ScannerSettingsView';
import { Terminal, Activity, FileText, BookOpen, X } from 'lucide-react';

import ScannerTutorialTour from '../tutorial/ScannerTutorialTour';
import { SvgEmptyState, SvgTheoryIllustration } from '../components/ScannerIllustrations';
import { ActionSummary } from '../../../../../shared/components/ActionSummary';

type ScannerPhase = 'DASHBOARD' | 'SCANNING' | 'RESULTS' | 'REMEDIATION';

export default function ScannerAgentMainView() {
  const [sidebarView, setSidebarView] = useState<SidebarView>('dashboard');
  const [isTheoryPaneOpen, setIsTheoryPaneOpen] = useState(false);
  const [viewBeforeTheory, setViewBeforeTheory] = useState<SidebarView>('dashboard');
  const [runTutorial, setRunTutorial] = useState(true);
  
  // Phase mapping for the specific Web Exploits / Scanner domain workflows
  const [phase, setPhase] = useState<ScannerPhase>('DASHBOARD');
  const [targetUrl, setTargetUrl] = useState('https://api.internal-sandbox.com');
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<WebVulnCandidate | null>(null);
  const scanTimersRef = useRef<number[]>([]);
  const sidebarViewRef = useRef(sidebarView);
  sidebarViewRef.current = sidebarView;

  const clearScanTimers = () => {
    scanTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    scanTimersRef.current = [];
  };

  useEffect(() => () => clearScanTimers(), []);

  const startScan = (target: string) => {
    const normalizedTarget = target.trim();
    if (!normalizedTarget) return;
    clearScanTimers();
    setTargetUrl(normalizedTarget);
    setPhase('SCANNING');
    setSidebarView('scans');
    setScanLogs(['> Starting a scripted preview. No request will be sent.', '> Scenario label: ' + normalizedTarget]);
    
    // Simulate scan steps
    scanTimersRef.current = [
      window.setTimeout(() => addLog('> Example step: inspect a fixed route list.'), 1000),
      window.setTimeout(() => addLog('> Example step: compare known response patterns.'), 2500),
      window.setTimeout(() => addLog('> Sample signal: reflection in a prepared response at /api/v1/users/profile.'), 4000),
      window.setTimeout(() => addLog('> Sample signal: an illustrative SQL error at /api/v1/products.'), 5500),
      window.setTimeout(() => addLog('> Scripted preview complete. No endpoint was contacted.'), 7000),
      window.setTimeout(() => {
      setPhase('RESULTS');
        if (sidebarViewRef.current === 'scans') setSidebarView('exploits');
      }, 8000),
    ];
  };

  const addLog = (msg: string) => {
    setScanLogs(prev => [...prev, msg]);
  };

  const handleRemediate = (candidate: WebVulnCandidate) => {
    setSelectedCandidate(candidate);
    setPhase('REMEDIATION');
    setSidebarView('reports');
  };

  const handleSidebarNavigate = (view: SidebarView) => {
    setSidebarView(view);
    if (view === 'dashboard') setPhase('DASHBOARD');
    else if (view === 'exploits') setPhase('RESULTS');
    else if (view === 'reports' && selectedCandidate) setPhase('REMEDIATION');
    
    if (view === 'theory') {
      if (sidebarView !== 'theory') setViewBeforeTheory(sidebarView);
      setIsTheoryPaneOpen(true);
    }
  };

  const showTheoryPane = isTheoryPaneOpen || sidebarView === 'theory';

  return (
    <div className="w-full h-full flex bg-slate-50 relative overflow-hidden">
      <ScannerTutorialTour run={runTutorial} onFinish={() => setRunTutorial(false)} />
      
      <AgentSidebar currentView={sidebarView} onNavigate={handleSidebarNavigate} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {sidebarView === 'dashboard' && (
            <ScannerDashboardView 
              candidates={initialWebVulnCandidates}
              onStartScan={startScan}
              onTutorialRecap={() => setRunTutorial(true)}
              onViewAllFindings={() => {
                setPhase('RESULTS');
                setSidebarView('exploits');
              }}
            />
          )}

          {sidebarView === 'scans' && (
            <div className="flex-1 flex flex-col p-6 bg-slate-50">
              <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-medium font-mono uppercase tracking-wider text-slate-700">Scripted preview output</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase font-semibold">{phase === 'RESULTS' ? 'Preview complete' : phase === 'SCANNING' ? 'Preview running' : 'Preview idle'}</span>
                  </div>
                  <button type="button" onClick={() => { clearScanTimers(); setPhase('DASHBOARD'); setScanLogs([]); setSidebarView('dashboard'); }} className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Stop and reset</button>
                </div>
                <div className="border-b border-slate-200 p-4"><ActionSummary input={targetUrl} action="Play fixed example steps; no network activity" result="Sample findings are available in Web Exploits" nextStep="Review an example finding and its remediation plan" status={phase === 'SCANNING' ? 'running' : phase === 'RESULTS' ? 'done' : 'idle'} /></div>
                <div className="flex-1 p-6 font-mono text-sm text-slate-600 overflow-y-auto space-y-2">
                  {scanLogs.length === 0 && (
                    <div className="text-slate-500 italic">No preview running. Return to the dashboard to choose an example scenario.</div>
                  )}
                  {scanLogs.map((log, i) => (
                    <div key={i} className={`${log.includes('CRITICAL') || log.includes('WARN') ? 'text-red-600 font-medium' : log.startsWith('>') ? 'text-slate-800' : 'text-slate-500'}`}>
                      {log}
                    </div>
                  ))}
                  {scanLogs.length > 0 && phase === 'SCANNING' && <div className="text-emerald-700">Preparing the next sample event…</div>}
                </div>
              </div>
            </div>
          )}

          {sidebarView === 'exploits' && (
            <div className="flex-1 p-6 overflow-hidden">
              <WebExploitationDashboard 
                candidates={initialWebVulnCandidates}
                onRemediate={handleRemediate}
              />
            </div>
          )}

          {sidebarView === 'reports' && (
            <div className="flex-1 p-6 overflow-hidden bg-slate-50">
              {selectedCandidate ? (
                <RemediationPlanView 
                  candidate={selectedCandidate} 
                  onBack={() => {
                    setPhase('RESULTS');
                    setSidebarView('exploits');
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <SvgEmptyState 
                    title="No Active Remediation Plan" 
                    message="Select a vulnerability from the Web Exploits tab to view its automated remediation steps." 
                  />
                </div>
              )}
            </div>
          )}

          {sidebarView === 'theory' && (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
              <SvgTheoryIllustration />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Theory Wiki Pane is Open</h3>
              <p className="text-sm">Check the right side of your screen to access the theory library.</p>
            </div>
          )}

          {sidebarView === 'activity' && <ScannerActivityView />}
          {sidebarView === 'queue' && <ScannerQueueView />}
          {sidebarView === 'agents' && <ScannerAgentsView />}
          {sidebarView === 'missions' && <ScannerMissionsView />}
          {sidebarView === 'skills' && <ScannerSkillsView />}
          {sidebarView === 'recon' && <ScannerReconView />}
          {sidebarView === 'memory' && <ScannerMemoryView />}
          {sidebarView === 'analytics' && <ScannerAnalyticsView />}
          {sidebarView === 'settings' && <ScannerSettingsView />}
        </div>
        
        {/* Right Side Theory Pane */}
        {showTheoryPane && (
          <div className="absolute inset-y-0 right-0 z-40 flex h-full w-full max-w-[450px] flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right-full duration-300 lg:relative lg:inset-y-auto lg:right-auto lg:w-[450px] lg:max-w-[40vw] lg:shrink-0">
            <button
              type="button"
              aria-label="Close theory panel"
              onClick={() => {
                 setIsTheoryPaneOpen(false);
                 if (sidebarView === 'theory') setSidebarView(viewBeforeTheory === 'theory' ? 'dashboard' : viewBeforeTheory);
              }}
              className="absolute top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="w-4 h-4" />
            </button>
            <AgentTheorySidebar agentType="scanner" />
          </div>
        )}
      </div>

      {/* Fixed Toggle Button when closed */}
      {!showTheoryPane && (
        <button 
          type="button"
          onClick={() => setIsTheoryPaneOpen(true)}
          className="theory-wiki-trigger absolute right-0 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-l-lg bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-transform hover:-translate-x-1 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          aria-label="Open Theory Wiki"
          title="Open Theory Wiki"
        >
          <BookOpen className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
