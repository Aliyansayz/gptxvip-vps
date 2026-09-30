import React, { useCallback, useEffect, useRef, useState } from 'react';
import RedTeamAgentSidebar, { RedTeamSidebarView } from '../components/RedTeamAgentSidebar';
import RedTeamDashboardView from './RedTeamDashboardView';
import RedTeamToolsView from './RedTeamToolsView';
import RedTeamReconView from './RedTeamReconView';
import RedTeamLateralMovementView from './RedTeamLateralMovementView';
import RedTeamReportingView from './RedTeamReportingView';
import RedTeamSettingsView from './RedTeamSettingsView';
import RedTeamTutorialTour from '../tutorial/RedTeamTutorialTour';
import AgentTheorySidebar from '../../../components/AgentTheorySidebar';
import { BookOpen, X, Terminal } from 'lucide-react';
import { SvgTheoryIllustration } from '../../scannerAgent/components/ScannerIllustrations';
import { ActionSummary } from '../../../../../shared/components/ActionSummary';

export default function RedTeamAgentMainView() {
  const [sidebarView, setSidebarView] = useState<RedTeamSidebarView>('dashboard');
  const [isTheoryPaneOpen, setIsTheoryPaneOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(true);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [isNarrowScreen, setIsNarrowScreen] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches);

  const [simLogs, setSimLogs] = useState<string[]>([]);
  const simulationTimers = useRef<number[]>([]);
  const theoryReturnView = useRef<RedTeamSidebarView>('dashboard');
  const theoryOpener = useRef<HTMLElement | null>(null);
  const theoryCloseButton = useRef<HTMLButtonElement | null>(null);
  const theoryPane = useRef<HTMLDivElement | null>(null);
  const theoryToggle = useRef<HTMLButtonElement | null>(null);

  const finishTutorial = useCallback(() => setRunTutorial(false), []);
  const closeTheoryPane = useCallback(() => {
    setIsTheoryPaneOpen(false);
    if (sidebarView === 'theory') setSidebarView(theoryReturnView.current);
    window.requestAnimationFrame(() => {
      const opener = theoryOpener.current;
      if (opener?.isConnected) opener.focus();
      else theoryToggle.current?.focus();
    });
  }, [sidebarView]);

  const clearSimulationTimers = () => {
    simulationTimers.current.forEach((timerId) => window.clearTimeout(timerId));
    simulationTimers.current = [];
  };

  useEffect(() => () => {
    simulationTimers.current.forEach((timerId) => window.clearTimeout(timerId));
    simulationTimers.current = [];
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => setIsNarrowScreen(media.matches);
    updateViewport();
    media.addEventListener('change', updateViewport);
    return () => media.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    if (!isTheoryPaneOpen) return;

    const frame = window.requestAnimationFrame(() => theoryCloseButton.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeTheoryPane();
        return;
      }

      if (!isNarrowScreen || event.key !== 'Tab' || !theoryPane.current) return;
      const focusable = Array.from(theoryPane.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !theoryPane.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !theoryPane.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTheoryPaneOpen, isNarrowScreen, closeTheoryPane]);

  const startSimulation = () => {
    clearSimulationTimers();
    setIsSimulationRunning(true);
    setSidebarView('exploitation');
    setSimLogs(['> Starting a scripted training sequence.', '> Example scope label: 10.0.x.x/24; no target contacted.']);
    
    simulationTimers.current = [
      window.setTimeout(() => setSimLogs(prev => [...prev, '> Example step: review prepared perimeter signals.']), 1000),
      window.setTimeout(() => setSimLogs(prev => [...prev, '> Example finding: simulated Apache Struts service in the fixed sample scope.']), 2500),
      window.setTimeout(() => setSimLogs(prev => [...prev, '> Example step: inspect an illustrative exploitation path.']), 4000),
      window.setTimeout(() => setSimLogs(prev => [...prev, '> Example stage: simulated low-privilege shell (no system accessed).']), 5500),
      window.setTimeout(() => setSimLogs(prev => [...prev, '> Example step: review lateral-movement and privilege signals.']), 7000),
      window.setTimeout(() => {
        setSimLogs(prev => [...prev, '> Scenario complete. No target was contacted or changed.']);
        setIsSimulationRunning(false);
        simulationTimers.current = [];
      }, 8500),
    ];
  };

  const stopSimulation = () => {
    clearSimulationTimers();
    setSimLogs([]);
    setIsSimulationRunning(false);
    setSidebarView('dashboard');
  };

  const handleSidebarNavigate = (view: RedTeamSidebarView, opener: HTMLButtonElement) => {
    if (view === 'theory') {
      if (sidebarView !== 'theory') theoryReturnView.current = sidebarView;
      theoryOpener.current = opener;
      setSidebarView('theory');
      setIsTheoryPaneOpen(true);
      return;
    }
    setSidebarView(view);
    setIsTheoryPaneOpen(false);
  };

  const openTheoryPane = (opener: HTMLButtonElement) => {
    theoryOpener.current = opener;
    setIsTheoryPaneOpen(true);
  };

  const showTheoryPane = isTheoryPaneOpen || sidebarView === 'theory';

  return (
    <div className="w-full h-full flex bg-slate-50 relative overflow-hidden">
      <RedTeamTutorialTour run={runTutorial} onFinish={finishTutorial} />

      <RedTeamAgentSidebar currentView={sidebarView} onNavigate={handleSidebarNavigate} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {sidebarView === 'dashboard' && (
            <RedTeamDashboardView onStartSimulation={startSimulation} />
          )}

          {sidebarView === 'tools' && (
            <div className="h-full">
               <RedTeamToolsView />
            </div>
          )}

          {sidebarView === 'exploitation' && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto bg-slate-50 p-4 sm:p-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-red-700">Scenario boundary · fixed sample · no network activity</p><ActionSummary input="Prepared 10.0.x.x/24 training scenario" action="Play a fixed event sequence" result="Illustrative signals; no target or defense was tested" nextStep="Review the event trace, then open the sample report" status={isSimulationRunning ? 'running' : simLogs.some(log => log.includes('Scenario complete')) ? 'done' : 'idle'} /><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => setSidebarView('reporting')} className="min-h-11 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Open report trace</button><button type="button" onClick={stopSimulation} className="min-h-11 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Reset scenario</button></div></div>
              <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-medium font-mono uppercase tracking-wider text-slate-700">Exploitation Terminal</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-red-600">
                    <span className="text-xs font-mono uppercase font-semibold">Scripted simulation · no target contacted</span>
                    {isSimulationRunning ? (
                      <button type="button" onClick={stopSimulation} className="min-h-11 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Stop scenario</button>
                    ) : (
                      <button type="button" onClick={stopSimulation} className="min-h-11 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Return to Command Center</button>
                    )}
                  </div>
                </div>
                <div className="min-h-44 max-h-[24rem] flex-1 space-y-2 overflow-y-auto break-words p-4 font-mono text-sm text-slate-600 sm:p-6" aria-live="polite">
                  {simLogs.length === 0 && (
                    <div className="text-slate-500 italic">No active simulation. Return to Command Center to initialize.</div>
                  )}
                  {simLogs.map((log, i) => (
                        <div key={i} className={`${log.includes('Scenario complete') ? 'text-emerald-700 font-medium' : log.startsWith('>') ? 'text-slate-800' : 'text-slate-500'}`}>
                      {log}
                    </div>
                  ))}
                  {isSimulationRunning && <div className="text-red-700">Preparing the next sample event…</div>}
                </div>
              </div>
            </div>
          )}

          {sidebarView === 'recon' && <RedTeamReconView />}
          {sidebarView === 'lateral_movement' && <RedTeamLateralMovementView />}
          {sidebarView === 'reporting' && <RedTeamReportingView scenarioLogs={simLogs} scenarioComplete={simLogs.some(log => log.includes('Scenario complete'))} onOpenScenario={() => setSidebarView('exploitation')} />}
          {sidebarView === 'settings' && <RedTeamSettingsView />}
          
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
          <div
            id="red-team-theory-pane"
            ref={theoryPane}
            role={isNarrowScreen ? 'dialog' : 'complementary'}
            aria-modal={isNarrowScreen ? true : undefined}
            aria-label="Red Team Theory Wiki"
            className="absolute inset-0 md:relative md:inset-auto w-full md:w-[450px] border-l border-slate-200 bg-white h-full shadow-2xl shrink-0 overflow-hidden z-40 flex flex-col animate-in slide-in-from-right-full duration-300"
          >
            <button 
              ref={theoryCloseButton}
              type="button"
              aria-label="Close Theory Wiki and return to the previous section"
              onClick={closeTheoryPane}
              className="absolute top-4 right-4 min-h-11 min-w-11 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-md z-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <X className="w-4 h-4" />
            </button>
            <AgentTheorySidebar agentType="red_team" />
          </div>
        )}
      </div>

      {/* Fixed Toggle Button when closed */}
      {!showTheoryPane && (
        <button 
          ref={theoryToggle}
          type="button"
          aria-label="Open Theory Wiki"
          aria-expanded={isTheoryPaneOpen}
          aria-controls="red-team-theory-pane"
          onClick={(event) => openTheoryPane(event.currentTarget)}
          className="theory-wiki-trigger absolute right-0 top-1/2 -translate-y-1/2 min-h-11 min-w-11 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-l-lg shadow-[0_0_15px_rgba(220,38,38,0.4)] z-50 flex items-center justify-center transition-transform hover:-translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          title="Open Theory Wiki"
        >
          <BookOpen aria-hidden="true" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
